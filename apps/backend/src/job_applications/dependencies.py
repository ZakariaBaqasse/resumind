from fastapi import Depends
from sqlmodel import Session

from src.configs.database_config import get_session
from src.job_applications.repositories.job_application_repository import (
    JobApplicationRepository,
)
from src.job_applications.services.job_application_service import JobApplicationService


def get_job_application_repository(session: Session = Depends(get_session)):
    return JobApplicationRepository(session)


def get_job_application_service(
    session: Session = Depends(get_session),
) -> JobApplicationService:
    """
    Dependency to get JobApplicationService instance.
    This ensures that the service is created with the current database session.
    """
    from src.core.service_registry import ServiceRegistry

    return ServiceRegistry.get_job_application_service(session)
