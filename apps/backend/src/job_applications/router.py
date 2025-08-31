import asyncio
import json
import os
from logging import getLogger
from typing import List, Dict, Any

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    Request,
)
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from src.core.types import Resume
from src.auth.dependencies import get_current_user
from src.job_applications.dependencies import get_job_application_service
from src.job_applications.services.job_application_service import JobApplicationService
from src.user.model import User
from src.job_applications.types import (
    CreateJobApplicationRequest,
    JobApplicationPreview,
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


class PaginatedJobApplicationsResponse(BaseModel):
    items: List[JobApplicationPreview]
    total: int
    has_next: bool


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


@job_application_router.get("/list", response_model=PaginatedJobApplicationsResponse)
async def list_job_applications(
    offset: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    user: User = Depends(get_current_user),
    job_application_service: JobApplicationService = Depends(
        get_job_application_service
    ),
):
    """
    Get a paginated list of job applications
    """
    try:
        job_applications, total = job_application_service.list_paginated(
            user.id, offset, limit
        )
        job_applications_previews = [
            JobApplicationPreview(**job_application.model_dump())
            for job_application in job_applications
        ]
        has_next = (offset + limit) < total
        logger.debug("PAGINATED APPLICATIONS", job_applications_previews)
        return PaginatedJobApplicationsResponse(
            items=job_applications_previews, total=total, has_next=has_next
        )
    except Exception as e:
        logger.error(f"Error listing job applications: {e}")
        return PaginatedJobApplicationsResponse(items=[], total=0, has_next=False)


@job_application_router.get("/search", response_model=PaginatedJobApplicationsResponse)
async def search_job_applications(
    search_term: str = Query(None, description="Search term"),
    offset: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    user: User = Depends(get_current_user),
    job_application_service: JobApplicationService = Depends(
        get_job_application_service
    ),
):
    """
    Search for job applications with comprehensive filtering support
    Supports filtering by:
    - search_term: matches app name or description
    """
    try:
        job_applications, total = job_application_service.search_job_applications(
            search_term=search_term, offset=offset, limit=limit, user_id=user.id
        )
        job_applications_previews = [
            JobApplicationPreview(**job_application.model_dump())
            for job_application in job_applications
        ]
        has_next = (offset + limit) < total
        return PaginatedJobApplicationsResponse(
            items=job_applications_previews, total=total, has_next=has_next
        )
    except Exception as e:
        logger.error(f"Error searching job applications: {e}")
        return PaginatedJobApplicationsResponse(items=[], total=0, has_next=False)


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


@job_application_router.get("/stats")
async def get_resume_creation_stats(
    current_user: User = Depends(get_current_user),
    job_application_service: JobApplicationService = Depends(
        get_job_application_service
    ),
):
    try:
        stats = job_application_service.get_stats(current_user.id)
        return stats
    except Exception as e:
        logger.error(
            f"ERROR in job_application router get_resume_creation_stats {str(e)}"
        )
        return HTTPException(status_code=500, detail="Internal Server error")


class UpdateResumeRequest(BaseModel):
    resume: Resume


@job_application_router.put("/{application_id}/resume")
async def update_generated_resume(
    application_id: str,
    request: UpdateResumeRequest,
    current_user: User = Depends(get_current_user),
    job_application_service: JobApplicationService = Depends(
        get_job_application_service
    ),
):
    try:
        job_application = job_application_service.get_user_job_application(
            application_id, current_user.id, refresh=True
        )
        if not job_application:
            return HTTPException(
                status_code=404, detail="No job application found for the given user"
            )
        if not job_application.generated_resume:
            return HTTPException(
                status_code=400,
                detail="Cannot update job application resume because it isn't generated yet",
            )
        updated_job_application = job_application_service.save_generated_resume(
            application_id, request.resume
        )
        return updated_job_application
    except Exception as e:
        logger.error(
            f"ERROR in job_application router update_generated_resume {str(e)}"
        )
        return HTTPException(status_code=500, detail="Internal Server error")


class UpdateCoverLetterRequest(BaseModel):
    cover_letter_content: str


@job_application_router.put("/{application_id}/cover-letter")
async def update_generated_cover_letter(
    application_id: str,
    cover_letter: UpdateCoverLetterRequest,
    current_user: User = Depends(get_current_user),
    job_application_service: JobApplicationService = Depends(
        get_job_application_service
    ),
):
    try:
        job_application = job_application_service.get_user_job_application(
            application_id, current_user.id, refresh=True
        )
        if not job_application:
            return HTTPException(
                status_code=404, detail="No job application found for the given user"
            )
        if not job_application.generated_cover_letter:
            return HTTPException(
                status_code=400,
                detail="Cannot update job application cover letter because it isn't generated yet",
            )
        updated_job_application = job_application_service.save_generated_cover_letter(
            application_id, cover_letter.cover_letter_content
        )
        return updated_job_application
    except Exception as e:
        logger.error(
            f"ERROR in job_application router update_generated_cover_letter {str(e)}"
        )
        return HTTPException(status_code=500, detail="Internal Server error")


@job_application_router.delete("/{application_id}")
async def delete_job_application(
    application_id: str,
    current_user: User = Depends(get_current_user),
    job_application_service: JobApplicationService = Depends(
        get_job_application_service
    ),
):
    try:
        job_application = job_application_service.get_user_job_application(
            application_id, current_user.id, refresh=True
        )
        if not job_application:
            return HTTPException(
                status_code=404, detail="No job application found for the given user"
            )

        return job_application_service.delete_job_application(application_id)
    except Exception as e:
        logger.error(f"ERROR in job_application router delete_job_application {str(e)}")
        return HTTPException(status_code=500, detail="Internal Server error")


@job_application_router.get("/{application_id}")
async def get_job_application(
    application_id: str,
    current_user: User = Depends(get_current_user),
    job_application_service: JobApplicationService = Depends(
        get_job_application_service
    ),
):
    try:
        job_application = job_application_service.get_user_job_application(
            application_id, current_user.id, refresh=True
        )
        if not job_application:
            return HTTPException(
                status_code=404, detail="No job application found for the given user"
            )
        return job_application
    except Exception as e:
        logger.error(f"ERROR in job_application router get_job_application {str(e)}")
        return HTTPException(status_code=500, detail="Internal Server error")
