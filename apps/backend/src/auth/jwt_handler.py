"""JWT token handler module for creating, decoding, and verifying JWT tokens.

This module provides JWT functionality including:
- Creating JWT tokens with expiration times
- Decoding and validating JWT tokens
- Verifying JWT tokens from HTTP authorization headers
"""
import os
from datetime import datetime, timedelta, UTC
from typing import Any
import logging

import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

# Get module logger
logger = logging.getLogger(__name__)

# Configuration
JWT_SECRET = os.environ.get("JWT_SECRET")
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM")
ACCESS_TOKEN_EXPIRE_HOURS = os.environ.get("ACCESS_TOKEN_EXPIRE_HOURS")

security = HTTPBearer()


class JWTHandler:
    """JWT token handler for creating, decoding, and verifying JWT tokens.
    
    Methods:
    -------
    create_token(user_data: dict[str, Any], expires_delta: timedelta | None = None) -> str
        Create a new JWT token for a user with optional custom expiration time.
    
    decode_token(token: str) -> dict[str, Any]
        Decode and validate a JWT token, checking for expiration.
    
    verify_jwt(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict[str, Any]
        Verify a JWT token extracted from the authorization header.
    """
    @staticmethod
    def create_token(
        user_data: dict[str, Any], expires_delta: timedelta | None = None
    ) -> str:
        """Create a new JWT token for a user."""
        to_encode = user_data.copy()

        # Set expiration time
        expire = datetime.now(UTC) + (
            expires_delta or timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
        )
        to_encode.update({"exp": expire})

        # Create token
        encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
        return encoded_jwt

    @staticmethod
    def decode_token(token: str) -> dict[str, Any]:
        """Decode and validate JWT token."""
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])

            # Check if token has expired
            if datetime.fromtimestamp(
                payload.get("exp", 0), tz=UTC
            ) < datetime.now(UTC):
                raise HTTPException(status_code=401, detail="Token expired")
            logger.debug(f"Token payload: {payload}")
            return payload
        except jwt.PyJWTError as e:
            logger.error(f"JWT decode error: {str(e)}")
            raise HTTPException(status_code=401, detail="Invalid token")

    @staticmethod
    def verify_jwt(
        credentials: HTTPAuthorizationCredentials = Security(security),
    ) -> dict[str, Any]:
        """Verify JWT token from authorization header."""
        return JWTHandler.decode_token(credentials.credentials)
