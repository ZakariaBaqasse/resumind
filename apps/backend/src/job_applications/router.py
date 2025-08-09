import asyncio
import json
import os
from logging import getLogger
from datetime import datetime
from typing import Optional, Dict, Any, Tuple

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
)
from fastapi.responses import StreamingResponse

from src.auth.dependencies import get_current_user
from src.job_applications.dependencies import get_job_application_service
from src.job_applications.services.job_application_service import JobApplicationService
from src.user.model import User
from src.job_applications.types import (
    CreateJobApplicationRequest,
    ResumeGenerationStatus,
)
from src.job_applications.model import JobApplication
from src.job_applications.generate_resume_job import start_resume_generation
from src.user.dependencies import get_user_service
from src.user.service import UserService

logger = getLogger(__name__)
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "../../uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

job_application_router = APIRouter(prefix="/application", tags=["job application"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "../../uploads")


@job_application_router.post("/application/start-generation")
def start_application_resume_generation(
    application_data: CreateJobApplicationRequest,
    current_user: User = Depends(get_current_user),
    job_application_service: JobApplicationService = Depends(
        get_job_application_service
    ),
):
    try:
        job_application = job_application_service.create_job_application(
            JobApplication(
                **application_data,
                user_id=current_user.id,
                originalResumeSnapshot=current_user.initial_resume,
            )
        )
        resume_generation_job = start_resume_generation.delay(
            job_application_id=job_application.id
        )
        job_application.resume_generation_status = ResumeGenerationStatus.STARTED
        job_application.background_task_id = resume_generation_job.id
        updated_application = job_application_service.update_job_application(
            job_application
        )
        return {
            "status_code": 200,
            "detail": "started the generation of the resume",
            "job_application": updated_application,
        }
    except HTTPException as e:
        return e
    except Exception:
        return HTTPException(status_code=500, detail="Internal Server error")


@job_application_router.get("/application/{application_id}/stream/{token}")
async def application_snapshot_sse(
    application_id: str,
    token: str,
    request: Request,
    user_service: UserService = Depends(get_user_service),
    job_application_service: JobApplicationService = Depends(
        get_job_application_service
    ),
    poll_interval_ms: int = 1000,
    events_limit: int = 200,  # limit how many events to include per snapshot
):
    """
    SSE stream of the full JobApplication snapshot (including related events).
    Sends a new frame only when the JobApplication or its events change.
    """
    current_user = get_current_user(token, user_service)
    # Authorization: ensure the job application belongs to the current user
    app_obj = job_application_service.get_job_application(application_id)
    if not app_obj:
        raise HTTPException(status_code=404, detail="Job application not found")
    if app_obj.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized for this application"
        )

    def _sig(app: JobApplication) -> Tuple[Optional[datetime], Optional[datetime], int]:
        # Signature to detect changes: (app.updated_at, latest_event_at, total_events)
        last_event_at = None
        total_events = len(getattr(app, "events", []) or [])
        if total_events:
            last_event_at = max(
                (e.created_at for e in app.events if getattr(e, "created_at", None)),
                default=None,
            )
        return (app.updated_at, last_event_at, total_events)

    def _serialize_event(ev) -> Dict[str, Any]:
        return {
            "id": ev.id,
            "job_application_id": ev.job_application_id,
            "event_name": ev.event_name,
            "status": ev.status,
            "step": ev.step,
            "category_name": ev.category_name,
            "tool_name": ev.tool_name,
            "iteration": ev.iteration,
            "message": ev.message,
            "data": ev.data,
            "error": ev.error,
            "created_at": ev.created_at.isoformat() if ev.created_at else None,
        }

    def _serialize_job_application(app: JobApplication) -> Dict[str, Any]:
        # Sort events ascending; apply limit to the most recent ones to keep payload reasonable
        evs = app.events or []
        if events_limit and len(evs) > events_limit:
            evs = evs[-events_limit:]

        return {
            "id": app.id,
            "job_title": app.job_title,
            "company_name": app.company_name,
            "job_description": app.job_description,
            "background_task_id": app.background_task_id,
            "resume_generation_status": (
                app.resume_generation_status.value
                if app.resume_generation_status
                else None
            ),
            "company_profile": app.company_profile,
            "generated_resume": app.generated_resume,
            "original_resume_snapshot": app.original_resume_snapshot,
            "created_at": app.created_at.isoformat() if app.created_at else None,
            "updated_at": app.updated_at.isoformat() if app.updated_at else None,
            "events": [_serialize_event(e) for e in evs],
        }

    def _format_sse(evt_id: str, payload: Dict[str, Any]) -> str:
        # Use event id as combination of updated_at and last event time for idempotence
        return f"id: {evt_id}\nevent: application.snapshot\ndata: {json.dumps(payload, default=str)}\n\n"

    async def event_generator():
        last_signature: Optional[Tuple[Optional[datetime], Optional[datetime], int]] = (
            None
        )
        keepalive_counter = 0

        while True:
            if await request.is_disconnected():
                break

            try:
                app = job_application_service.get_job_application(application_id)

                if not app:
                    yield _format_sse("gone", {"detail": "not_found"})
                    break

                sig = _sig(app)
                changed = sig != last_signature

                if changed:
                    payload = _serialize_job_application(app)
                    # Frame id uses updated_at + last event created_at for client dedupe
                    updated_part = payload["updated_at"] or "0"
                    last_ev = (
                        payload["events"][-1]["created_at"]
                        if payload["events"]
                        else "0"
                    )
                    yield _format_sse(f"{updated_part}:{last_ev}", payload)
                    last_signature = sig
                    keepalive_counter = 0
                else:
                    keepalive_counter += 1
                    if keepalive_counter >= max(1, int(15000 / poll_interval_ms)):
                        # comment keep-alive
                        yield ": keep-alive\n\n"
                        keepalive_counter = 0

                await asyncio.sleep(max(0.1, poll_interval_ms / 1000.0))
            except Exception as e:
                yield _format_sse(
                    "stream-error", {"detail": "stream_error", "message": str(e)}
                )
                break

    return StreamingResponse(event_generator(), media_type="text/event-stream")
