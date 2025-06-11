from src.user.service import UserService
from fastapi import Depends, HTTPException, status
from src.auth.service import AuthService
from src.user.dependencies import get_user_service
from fastapi.security import OAuth2PasswordBearer
from src.auth.jwt_handler import JWTHandler
from jwt import PyJWKError
import logging

logger = logging.getLogger(__name__)


def get_auth_service(
    user_service: UserService = Depends(get_user_service),
) -> AuthService:
    """Dependency to get AuthService instance"""
    return AuthService(user_service)


# Dependency to get the current user using the auth service
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    user_service: UserService = Depends(get_user_service),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = JWTHandler.decode_token(token)
        email: str = payload.get("email")
    except HTTPException as e:
        # Re-raise the HTTPException from decode_token with our custom message
        logger.error("Error in get_current_user: ", e)
        raise credentials_exception from e
    except PyJWKError as e:
        logger.error("Error in get_current_user: ", e)
        raise credentials_exception

    user = user_service.get_user_by_email(email)
    if user is None:
        raise credentials_exception
    return user
