import asyncio
import json
import os
from logging import getLogger

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


# @job_application_router.get("/status/{token}")
# async def resume_status_sse(
#     token: str, request: Request, user_service: UserService = Depends(get_user_service)
# ):
#     """
#     SSE endpoint to notify frontend when resume extraction is complete.
#     Authenticates user using JWT token from route param.
#     """
#     try:
#         user = await get_current_user(token, user_service)
#         if not user:
#             raise HTTPException(status_code=401, detail="Invalid token")
#     except Exception:
#         raise HTTPException(status_code=401, detail="Invalid token")

#     async def event_generator(user_id: str):
#         while True:
#             user = user_service.get_user(user_id)
#             if user is None:
#                 yield f"data:{json.dumps({'status': 'error', 'detail': 'User not found'})}\n\n"
#                 break
#             if isinstance(user.initial_resume, dict) and len(user.initial_resume) > 0:
#                 yield f"data: {json.dumps({'status': 'complete', 'resume': user.initial_resume})}\n\n"
#                 break
#             yield f"data: {json.dumps({'status': 'waiting'})}\n\n"
#             await asyncio.sleep(2)
#             if await request.is_disconnected():
#                 break

#     return StreamingResponse(event_generator(user.id), media_type="text/event-stream")
