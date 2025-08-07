from datetime import datetime, timezone
from typing import Any, Dict, Optional, List, TYPE_CHECKING
from uuid import uuid4

from sqlmodel import JSON, Column, Field, SQLModel, Relationship

if TYPE_CHECKING:
    from src.job_applications.model import JobApplication


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
    job_applications: List["JobApplication"] = Relationship(
        cascade_delete=True,
        back_populates="user",
        sa_relationship_kwargs={"order_by": "JobApplication.created_at"},
    )

    class Config:
        orm_mode = True
