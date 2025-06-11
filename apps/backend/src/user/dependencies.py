from src.user.repository import UserRepository
from sqlmodel import Session
from fastapi import Depends
from src.configs.database_config import get_session
from src.user.service import UserService


def get_user_repository(session: Session = Depends(get_session)):
    return UserRepository(session)


def get_user_service(user_repository: UserRepository = Depends(get_user_repository)):
    return UserService(user_repository)
