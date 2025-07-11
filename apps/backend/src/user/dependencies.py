from fastapi import Depends
from sqlmodel import Session

from src.configs.database_config import get_session
from src.user.repository import UserRepository
from src.user.service import UserService


def get_user_repository(session: Session = Depends(get_session)):
    return UserRepository(session)


def get_user_service(session: Session = Depends(get_session)) -> UserService:
    """
    Dependency to get UserService instance.
    This ensures that the service is created with the current database session.
    """
    from src.core.service_registry import ServiceRegistry

    return ServiceRegistry.get_user_service(session)
