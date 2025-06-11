import os
from src.user.service import UserService
from fastapi import HTTPException, status
import requests
from datetime import timedelta
from src.auth.jwt_handler import JWTHandler
from src.user.model import UserBase, User
from pydantic import BaseModel
from datetime import datetime, timezone
import logging
from passlib.context import CryptContext

# Get module logger
logger = logging.getLogger(__name__)


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserBase


class SignupResponse(BaseModel):
    user: UserBase


class AuthService:
    def __init__(self, user_service: UserService) -> None:
        self.user_service = user_service
        self.pwd_context = CryptContext(
            schemes=["pbkdf2_sha256"],
            default="pbkdf2_sha256",
            pbkdf2_sha256__default_rounds=30000,
        )

    def google_authenticate(self, access_token: str):
        """
        Verify Google tokens (id_token and access_token) and return our custom JWT
        """
        try:
            # Use access token to get user info from Google
            user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
            headers = {"Authorization": f"Bearer {access_token}"}

            user_info_response = requests.get(user_info_url, headers=headers)
            user_info_response.raise_for_status()
            google_user = user_info_response.json()

            # Verify the user exists in our database, if not, create a new user
            user = self.user_service.get_user_by_email(google_user["email"])

            if not user:
                # Create new user
                user = User(
                    email=google_user["email"],
                    name=google_user.get("name", ""),
                    image=google_user.get("picture", None),
                    emailVerified=datetime.now(timezone.utc),
                )

                user = self.user_service.create_user(user)

            # Generate our own JWT token with user data
            token_data = {
                "user_id": str(user.id),
                "email": user.email,
                "name": user.name,
            }

            # Generate token with 30 day expiry
            token = JWTHandler.create_token(
                token_data, expires_delta=timedelta(days=30)
            )

            # Return token to frontend
            return AuthResponse(access_token=token, user=user)

        except requests.exceptions.RequestException as e:
            logger.error(f"Error validating Google tokens: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error validating Google tokens: {str(e)}",
            )
        except Exception as e:
            logger.error("Unexpected error during authentication:", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error.",
            )

    def register_user(self, email: str, password: str):
        found_user = self.user_service.get_user_by_email(email)
        if found_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="A user with the same email already exists",
            )
        hashed_password = self.pwd_context.hash(password)
        user = User(email=email, name=email, password=hashed_password)
        self.user_service.create_user(user)
        return SignupResponse(user=user)

    def credentials_authenticate(self, email: str, password: str):
        user = self.user_service.get_user_by_email(email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"No user found with the email {email}",
            )
        if not self.pwd_context.verify(password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong password"
            )

        token_data = {
            "user_id": str(user.id),
            "email": user.email,
            "name": user.name,
        }
        # Generate token with 30 day expiry
        token = JWTHandler.create_token(token_data, expires_delta=timedelta(days=30))
        return AuthResponse(access_token=token, user=user)
