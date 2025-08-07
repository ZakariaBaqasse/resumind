from datetime import datetime, timezone
from typing import Any, Dict, Optional, TYPE_CHECKING
from uuid import uuid4

from sqlmodel import JSON, Column, Field, SQLModel, Relationship
from sqlalchemy import Enum as SQLAlchemyEnum

from src.job_applications.types import ResumeGenerationStatus

if TYPE_CHECKING:
    from src.user.model import User


class JobApplicationBase(SQLModel):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    job_title: str
    company_name: str
    job_description: str
    company_profile: Optional[Dict[str, Any]] = Field(
        default=None, alias="companyProfile", sa_column=Column(JSON)
    )
    generated_resume: Optional[Dict[str, Any]] = Field(
        default=None, alias="generatedResume", sa_column=Column(JSON)
    )
    original_resume_snapshot: Optional[Dict[str, Any]] = Field(
        default=None, alias="originalResumeSnapshot", sa_column=Column(JSON)
    )
    background_task_id: Optional[str]
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
    # Relationships (back_populates)
    user_id: str = Field(foreign_key="auth.user.id", ondelete="CASCADE")
    # Use string reference for User to avoid circular dependency
    resume_generation_status: Optional[ResumeGenerationStatus] = Field(
        default=None, sa_column=Column(SQLAlchemyEnum(ResumeGenerationStatus))
    )


class JobApplication(JobApplicationBase, table=True):
    """User model for authentication and profile information"""

    __tablename__ = "job_applications"
    __table_args__ = {
        "schema": "app",
    }
    user: "User" = Relationship(back_populates="job_applications")

    class Config:
        orm_mode = True
