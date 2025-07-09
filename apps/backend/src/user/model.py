from datetime import datetime, timezone
from typing import Any, Dict, Optional
from uuid import uuid4

from sqlmodel import JSON, Column, Field, SQLModel


class UserBase(SQLModel):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    name: Optional[str] = None
    email: str = Field(unique=True, index=True)
    emailVerified: Optional[datetime] = Field(default=None)
    image: Optional[str] = None
    initial_resume: Optional[Dict[str, Any]] = Field(
        default=None, alias="initialResume", sa_column=Column(JSON)
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        alias="createdAt",
        nullable=True,
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        alias="updatedAt",
        nullable=True,
    )


class User(UserBase, table=True):
    """User model for authentication and profile information"""

    __tablename__ = "user"
    __table_args__ = {
        "schema": "auth",
    }
    password: Optional[str] = Field(default=None)

    class Config:
        orm_mode = True
