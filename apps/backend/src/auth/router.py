from fastapi import APIRouter, Depends
from src.auth.service import AuthResponse, AuthService
from src.auth.dependencies import get_auth_service
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm


auth_router = APIRouter(prefix="/auth", tags=["auth"])


class AuthRequest(BaseModel):
    id_token: str
    access_token: str


@auth_router.post("/google-signin", response_model=AuthResponse)
def google_signin(
    request: AuthRequest, auth_service: AuthService = Depends(get_auth_service)
):
    return auth_service.google_authenticate(request.access_token)


@auth_router.post("/signup")
def signup(
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth_service: AuthService = Depends(get_auth_service),
):
    return auth_service.register_user(form_data.username, form_data.password)


@auth_router.post("/credentials-login")
def credentials_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth_service: AuthService = Depends(get_auth_service),
):
    return auth_service.credentials_authenticate(form_data.username, form_data.password)
