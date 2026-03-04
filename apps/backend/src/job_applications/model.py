"""Database models for job applications and related events.

This module provides:
- JobApplication: main model for tracking job applications
- Event: model for tracking application processing events
"""

from datetime import datetime, UTC
from typing import TYPE_CHECKING, Any
from uuid import uuid4

from sqlmodel import JSON, Column, Field, Relationship, SQLModel

if TYPE_CHECKING:
    from src.user.model import User


class JobApplicationBase(SQLModel):
    """Base model for job applications with common fields."""

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    job_title: str
    company_name: str
    job_description: str
    company_profile: dict[str, Any] | None = Field(
        default=None, alias="companyProfile", sa_column=Column(JSON)
    )
    generated_resume: dict[str, Any] | None = Field(
        default=None, alias="generatedResume", sa_column=Column(JSON)
    )
    resume_strategy_brief: dict[str, Any] | None = Field(
        default=None, sa_column=Column(JSON)
    )
    generated_cover_letter: str | None
    original_resume_snapshot: dict[str, Any] | None = Field(
        default=None, alias="originalResumeSnapshot", sa_column=Column(JSON)
    )
    background_task_id: str | None
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
    # Relationships (back_populates)
    user_id: str = Field(foreign_key="auth.user.id", ondelete="CASCADE")
    # Use string reference for User to avoid circular dependency
    resume_generation_status: str | None


class JobApplication(JobApplicationBase, table=True):
    """Model for job applications with database table configuration."""

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
        """Pydantic configuration for JobApplication model."""

        orm_mode = True


class EventBase(SQLModel):
    """Base model for events related to job application processing."""

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)

    # Link to job application (events fetched by job_application_id)
    job_application_id: str = Field(
        ..., foreign_key="app.job_applications.id", ondelete="CASCADE", index=True
    )

    # Event taxonomy fields (kept flexible as strings)
    event_name: str = Field(index=True)  # e.g., "pipeline.step", "tool.execution"
    status: str | None = Field(default=None)  # "started" | "succeeded" | "failed"
    step: str | None = Field(default=None, index=True)  # e.g., "company_discovery"
    category_name: str | None = Field(default=None)  # research category name
    tool_name: str | None = Field(default=None)  # e.g., "tavily"

    # Iteration + messaging
    iteration: int | None = Field(default=None)
    message: str | None = Field(default=None)

    # Structured payloads (avoid PII; summaries only)
    data: dict[str, Any] | None = Field(default=None, sa_column=Column(JSON))
    error: dict[str, Any] | None = Field(default=None, sa_column=Column(JSON))

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        alias="createdAt",
        nullable=True,
    )


class Event(EventBase, table=True):
    """Model for events related to job application processing with database table configuration."""

    __tablename__ = "events"
    __table_args__ = {
        "schema": "app",
    }

    # Relationship back to job application
    job_application: "JobApplication" = Relationship(back_populates="events")

    class Config:
        """Pydantic configuration for Event model."""

        orm_mode = True
