"""Types and models for authentication functionality.

This module provides Pydantic models for:
- TokenData: JWT token payload data
- OAuthUserRequest: OAuth user information request
- AuthResponse: Authentication response with user details
"""

from pydantic import BaseModel, EmailStr
from datetime import datetime


class TokenData(BaseModel):
    """JWT token payload data.

    Attributes:
    ----------
    email : str | None
        The email address associated with the token.
    exp : datetime | None
        The token expiration time.
    """

    email: str | None = None
    exp: datetime | None = None


class OAuthUserRequest(BaseModel):
    """OAuth user information request.

    Attributes:
    ----------
    email : EmailStr
        The user's email address.
    name : str | None
        The user's full name.
    image : str | None
        The user's profile image URL.
    provider : str
        The OAuth provider name.
    """

    email: EmailStr
    name: str | None = None
    image: str | None = None
    provider: str


class AuthResponse(BaseModel):
    """Authentication response with user details.

    Attributes:
    ----------
    id : str
        The unique user identifier.
    email : str
        The user's email address.
    name : str | None
        The user's full name.
    image : str | None
        The user's profile image URL.
    """

    id: str
    email: str
    name: str | None = None
    image: str | None = None
