"""User models for authentication and profile management.

This module provides SQLModel definitions for user accounts, including:
- UserBase: base user model with common fields
- User: full user model with authentication and job application relationships
"""

from datetime import datetime, UTC
from typing import Any, TYPE_CHECKING
from uuid import uuid4

from sqlmodel import JSON, Column, Field, SQLModel, Relationship

if TYPE_CHECKING:
    from src.job_applications.model import JobApplication


class UserBase(SQLModel):
    """Base model for user accounts with common fields."""

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    name: str | None = None
    email: str = Field(unique=True, index=True)
    emailVerified: datetime | None = Field(default=None)
    image: str | None = None
    initial_resume: dict[str, Any] | None = Field(
        default=None, alias="initialResume", sa_column=Column(JSON)
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        alias="createdAt",
        nullable=True,
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        alias="updatedAt",
        nullable=True,
    )


class User(UserBase, table=True):
    """User model for authentication and profile information."""

    __tablename__ = "user"
    __table_args__ = {
        "schema": "auth",
    }
    password: str | None = Field(default=None)
    job_applications: list["JobApplication"] = Relationship(
        cascade_delete=True,
        back_populates="user",
        sa_relationship_kwargs={"order_by": "JobApplication.created_at"},
    )

    class Config:
        """Pydantic configuration for the User model."""

        orm_mode = True
