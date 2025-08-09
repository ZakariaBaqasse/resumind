from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from sqlalchemy import delete as sa_delete
from sqlmodel import Session, select

from src.job_applications.model import Event


class EventRepository:
    """
    Repository for handling Event model database operations.
    Events are linked to job applications and are typically fetched by job_application_id.
    """

    def __init__(self, session: Session):
        self.session = session

    # Create operations
    def create(self, event: Event) -> Event:
        self.session.add(event)
        self.session.commit()
        return self.get_by_id(event.id)

    def create_many(self, events: List[Event]) -> List[Event]:
        if not events:
            return []
        self.session.add_all(events)
        self.session.commit()
        # Refresh created entities (ids are set via default_factory so they exist already)
        return [self.get_by_id(e.id) for e in events if e.id is not None]  # defensive

    # Read operations
    def get_by_id(self, event_id: str) -> Optional[Event]:
        stmt = select(Event).where(Event.id == event_id)
        res = self.session.exec(stmt)
        return res.first()

    def list_events(
        self,
        job_application_id: str,
        *,
        event_name: Optional[str] = None,
        step: Optional[str] = None,
        status: Optional[str] = None,
        category_name: Optional[str] = None,
        tool_name: Optional[str] = None,
        since: Optional[datetime] = None,
        until: Optional[datetime] = None,
        limit: int = 200,
        offset: int = 0,
        ascending: bool = True,
    ) -> List[Event]:
        """
        Fetch events for a job application with optional filters.
        Ordered by created_at (asc by default).
        """
        stmt = select(Event).where(Event.job_application_id == job_application_id)

        if event_name:
            stmt = stmt.where(Event.event_name == event_name)
        if step:
            stmt = stmt.where(Event.step == step)
        if status:
            stmt = stmt.where(Event.status == status)
        if category_name:
            stmt = stmt.where(Event.category_name == category_name)
        if tool_name:
            stmt = stmt.where(Event.tool_name == tool_name)
        if since:
            stmt = stmt.where(Event.created_at >= since)
        if until:
            stmt = stmt.where(Event.created_at <= until)

        stmt = (
            stmt.order_by(
                Event.created_at.asc() if ascending else Event.created_at.desc()
            )
            .limit(limit)
            .offset(offset)
        )

        res = self.session.exec(stmt)
        return res.all()

    def get_latest_by_step(self, job_application_id: str, step: str) -> Optional[Event]:
        stmt = (
            select(Event)
            .where(
                Event.job_application_id == job_application_id,
                Event.step == step,
            )
            .order_by(Event.created_at.desc())
            .limit(1)
        )
        res = self.session.exec(stmt)
        return res.first()

    # Delete operations
    def delete_by_job_application(self, job_application_id: str) -> int:
        """
        Delete all events linked to a job application.
        Returns number of rows deleted.
        """
        result = self.session.exec(
            sa_delete(Event).where(Event.job_application_id == job_application_id)
        )
        # result.rowcount can be None on some dialects; commit regardless
        self.session.commit()
        return int(result.rowcount or 0)
