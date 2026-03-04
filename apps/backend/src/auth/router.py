"""Authentication router for handling user authentication and authorization.

This module provides endpoints for:
- Google OAuth2 sign-in
- User registration with credentials
- Credentials-based login
"""

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

from src.auth.dependencies import get_auth_service
from src.auth.service import AuthResponse, AuthService

auth_router = APIRouter(prefix="/auth", tags=["auth"])


class AuthRequest(BaseModel):
    """Request model for authentication with OAuth2 tokens.

    Attributes:
    ----------
    id_token : str
        The ID token from the OAuth2 provider.
    access_token : str
        The access token from the OAuth2 provider.
    """

    id_token: str
    access_token: str


@auth_router.post("/google-signin", response_model=AuthResponse)
def google_signin(
    request: AuthRequest, auth_service: AuthService = Depends(get_auth_service)
):
    """Authenticate user with Google OAuth2 tokens.

    Parameters
    ----------
    request : AuthRequest
        The OAuth2 tokens from Google.
    auth_service : AuthService
        The authentication service dependency.

    Returns:
    -------
    AuthResponse
        The authentication response containing user data and tokens.
    """
    return auth_service.google_authenticate(request.access_token)


@auth_router.post("/signup")
def signup(
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth_service: AuthService = Depends(get_auth_service),
):
    """Register a new user with credentials.

    Parameters
    ----------
    form_data : OAuth2PasswordRequestForm
        The username and password credentials.
    auth_service : AuthService
        The authentication service dependency.

    Returns:
    -------
    dict
        The registration response with user data and tokens.
    """
    return auth_service.register_user(form_data.username, form_data.password)


@auth_router.post("/credentials-login")
def credentials_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth_service: AuthService = Depends(get_auth_service),
):
    """Authenticate user with username and password credentials.

    Parameters
    ----------
    form_data : OAuth2PasswordRequestForm
        The username and password credentials.
    auth_service : AuthService
        The authentication service dependency.

    Returns:
    -------
    dict
        The authentication response with user data and tokens.
    """
    return auth_service.credentials_authenticate(form_data.username, form_data.password)
