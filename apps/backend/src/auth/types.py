from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class TokenData(BaseModel):
    email: Optional[str] = None
    exp: Optional[datetime] = None


class OAuthUserRequest(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    image: Optional[str] = None
    provider: str


class AuthResponse(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    image: Optional[str] = None
