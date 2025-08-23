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


@job_application_router.post("/start-generation")
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
                job_description=application_data.job_description,
                job_title=application_data.job_role,
                company_name=application_data.company,
                user_id=current_user.id,
                originalResumeSnapshot=current_user.initial_resume,
            )
        )

        resume_generation_job = start_resume_generation.delay(
            job_application_id=job_application.id
        )
        job_application.resume_generation_status = ResumeGenerationStatus.STARTED.value
        job_application.background_task_id = resume_generation_job.id
        updated_application = job_application_service.update_job_application(
            job_application
        )
        return updated_application
    except HTTPException as e:
        logger.error(
            f"ERROR in job_application router start_application_resume_generation {str(e)}"
        )
        return e
    except Exception as e:
        logger.error(
            f"ERROR in job_application router start_application_resume_generation {str(e)}"
        )
        return HTTPException(status_code=500, detail="Internal Server error")


@job_application_router.get("/{application_id}/stream/{token}")
async def application_snapshot_sse(
    application_id: str,
    token: str,
    request: Request,
    user_service: UserService = Depends(get_user_service),
    job_application_service: JobApplicationService = Depends(
        get_job_application_service
    ),
    poll_interval_ms: int = 1000,
    events_limit: int = 200,
):
    """
    SSE stream of the full JobApplication snapshot (including related events).
    Sends a new frame on every poll to ensure real-time updates.
    """
    try:
        current_user = await get_current_user(token, user_service)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    # Authorization: ensure the job application belongs to the current user
    app_obj = job_application_service.get_job_application(application_id)
    if not app_obj:
        raise HTTPException(status_code=404, detail="Job application not found")
    if app_obj.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized for this application"
        )

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
                app.resume_generation_status if app.resume_generation_status else None
            ),
            "company_profile": app.company_profile,
            "generated_resume": app.generated_resume,
            "original_resume_snapshot": app.original_resume_snapshot,
            "generated_cover_letter": app.generated_cover_letter,
            "created_at": app.created_at.isoformat() if app.created_at else None,
            "updated_at": app.updated_at.isoformat() if app.updated_at else None,
            "events": [_serialize_event(e) for e in evs],
        }

    def _format_sse(evt_id: str, payload: Dict[str, Any]) -> str:
        return f"id: {evt_id}\nevent: application.snapshot\ndata: {json.dumps(payload, default=str)}\n\n"

    async def event_generator():
        counter = 0
        last_status = None

        while True:
            if await request.is_disconnected():
                logger.info(f"Client disconnected for application {application_id}")
                break

            try:
                app = job_application_service.get_job_application(
                    application_id, refresh=True
                )

                if not app:
                    yield _format_sse("gone", {"detail": "not_found"})
                    break

                current_status = app.resume_generation_status
                status_changed = current_status != last_status
                last_status = current_status

                # Always send the current state
                payload = _serialize_job_application(app)
                event_id = (
                    f"{app.updated_at.isoformat() if app.updated_at else '0'}:{counter}"
                )

                # Add status change indicator
                if status_changed:
                    payload["status_changed"] = True
                    payload["previous_status"] = last_status

                yield _format_sse(event_id, payload)
                counter += 1

                # Handle terminal states
                if current_status in [
                    ResumeGenerationStatus.FAILED.value,
                    ResumeGenerationStatus.COMPLETED.value,
                ]:
                    # Send completion event and close after a delay
                    completion_payload = {
                        **payload,
                        "stream_ending": True,
                        "final_status": current_status,
                    }
                    yield _format_sse(f"completion-{event_id}", completion_payload)

                    # Give client time to process the final event
                    await asyncio.sleep(1.0)
                    break

                await asyncio.sleep(max(0.1, poll_interval_ms / 1000.0))

            except Exception as e:
                logger.error(
                    f"Error in SSE stream for application {application_id}: {e}"
                )
                yield _format_sse(
                    "stream-error", {"detail": "stream_error", "message": str(e)}
                )
                break

    from os import getenv

    headers = {
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
        # CORS for SSE
        "Access-Control-Allow-Origin": getenv("FRONTEND_URL", "http://localhost:3000"),
        "Access-Control-Allow-Credentials": "true",
    }
    return StreamingResponse(
        event_generator(), media_type="text/event-stream", headers=headers
    )
