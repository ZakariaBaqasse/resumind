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
    # New: related events (ordered by created_at asc)
    events: list["Event"] = Relationship(
        back_populates="job_application",
        sa_relationship_kwargs={
            "order_by": "Event.created_at",
            "cascade": "all, delete-orphan",
        },
    )

    class Config:
        orm_mode = True


class EventBase(SQLModel):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)

    # Link to job application (events fetched by job_application_id)
    job_application_id: str = Field(
        ..., foreign_key="app.job_applications.id", ondelete="CASCADE", index=True
    )

    # Event taxonomy fields (kept flexible as strings)
    event_name: str = Field(index=True)  # e.g., "pipeline.step", "tool.execution"
    status: Optional[str] = Field(default=None)  # "started" | "succeeded" | "failed"
    step: Optional[str] = Field(default=None, index=True)  # e.g., "company_discovery"
    category_name: Optional[str] = Field(default=None)  # research category name
    tool_name: Optional[str] = Field(default=None)  # e.g., "tavily"

    # Iteration + messaging
    iteration: Optional[int] = Field(default=None)
    message: Optional[str] = Field(default=None)

    # Structured payloads (avoid PII; summaries only)
    data: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    error: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        alias="createdAt",
        nullable=True,
    )


class Event(EventBase, table=True):
    __tablename__ = "events"
    __table_args__ = {
        "schema": "app",
    }

    # Relationship back to job application
    job_application: "JobApplication" = Relationship(back_populates="events")

    class Config:
        orm_mode = True
