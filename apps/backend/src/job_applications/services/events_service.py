from __future__ import annotations

from logging import getLogger
from datetime import datetime
from typing import Any, Dict, List, Optional

from src.job_applications.model import Event
from src.job_applications.repositories.events_repository import EventRepository
from src.job_applications.types import EventName, EventStatus, PipelineStep

logger = getLogger(__name__)


class EventService:
    """
    Business logic for emitting and retrieving events linked to job applications.
    Stores enum values as strings in the DB for flexibility.
    """

    def __init__(self, event_repository: EventRepository):
        self.event_repository = event_repository

    # Generic emitter
    def emit_event(
        self,
        *,
        job_application_id: str,
        event_name: EventName,
        status: Optional[EventStatus] = None,
        step: Optional[PipelineStep | str] = None,
        category_name: Optional[str] = None,
        tool_name: Optional[str] = None,
        iteration: Optional[int] = None,
        message: Optional[str] = None,
        data: Optional[Dict[str, Any]] = None,
        error: Optional[Dict[str, Any]] = None,
    ) -> Event:
        try:
            evt = Event(
                job_application_id=job_application_id,
                event_name=event_name.value,
                status=status.value if isinstance(status, EventStatus) else status,
                step=step.value if isinstance(step, PipelineStep) else step,
                category_name=category_name,
                tool_name=tool_name,
                iteration=iteration,
                message=message,
                data=data,
                error=error,
            )
            return self.event_repository.create(evt)
        except Exception as e:
            logger.error(f"Error emitting event {event_name}: {e}")
            raise

    # Convenience emitters
    def emit_pipeline_step(
        self,
        *,
        job_application_id: str,
        step: PipelineStep,
        status: EventStatus,
        message: Optional[str] = None,
        data: Optional[Dict[str, Any]] = None,
        error: Optional[Dict[str, Any]] = None,
        iteration: Optional[int] = None,
    ) -> Event:
        return self.emit_event(
            job_application_id=job_application_id,
            event_name=EventName.PIPELINE_STEP,
            status=status.value,
            step=step.value,
            message=message,
            data=data,
            error=error,
            iteration=iteration,
        )

    def emit_research_category(
        self,
        *,
        job_application_id: str,
        category_name: str,
        status: EventStatus,
        iteration: Optional[int] = None,
        message: Optional[str] = None,
        data: Optional[Dict[str, Any]] = None,
        error: Optional[Dict[str, Any]] = None,
    ) -> Event:
        return self.emit_event(
            job_application_id=job_application_id,
            event_name=EventName.RESEARCH_CATEGORY,
            status=status,
            step=PipelineStep.RESEARCH,
            category_name=category_name,
            iteration=iteration,
            message=message,
            data=data,
            error=error,
        )

    def emit_tool_execution(
        self,
        *,
        job_application_id: str,
        tool_name: str,
        status: EventStatus,
        message: Optional[str] = None,
        data: Optional[Dict[str, Any]] = None,
        error: Optional[Dict[str, Any]] = None,
        step: Optional[PipelineStep | str] = PipelineStep.RESEARCH,
        iteration: Optional[int] = None,
    ) -> Event:
        return self.emit_event(
            job_application_id=job_application_id,
            event_name=EventName.TOOL_EXECUTION,
            status=status,
            step=step,
            tool_name=tool_name,
            message=message,
            data=data,
            error=error,
            iteration=iteration,
        )

    def emit_artifact_generated(
        self,
        *,
        job_application_id: str,
        artifact_type: str,
        summary: Optional[str] = None,
        preview_ref: Optional[str] = None,
        message: Optional[str] = None,
        data: Optional[Dict[str, Any]] = None,
        step: Optional[PipelineStep | str] = None,
    ) -> Event:
        payload = {
            "artifact_type": artifact_type,
            **({"summary": summary} if summary else {}),
            **({"preview_ref": preview_ref} if preview_ref else {}),
            **(data or {}),
        }
        return self.emit_event(
            job_application_id=job_application_id,
            event_name=EventName.ARTIFACT_GENERATED,
            status=EventStatus.SUCCEEDED,
            step=step.value,
            message=message,
            data=payload,
        )

    def emit_pipeline_completed(
        self,
        *,
        job_application_id: str,
        message: Optional[str] = None,
        data: Optional[Dict[str, Any]] = None,
    ) -> Event:
        return self.emit_event(
            job_application_id=job_application_id,
            event_name=EventName.PIPELINE_COMPLETED,
            status=EventStatus.SUCCEEDED,
            message=message,
            data=data,
        )

    def emit_pipeline_failed(
        self,
        *,
        job_application_id: str,
        message: Optional[str] = None,
        error: Optional[Dict[str, Any]] = None,
        data: Optional[Dict[str, Any]] = None,
    ) -> Event:
        return self.emit_event(
            job_application_id=job_application_id,
            event_name=EventName.PIPELINE_FAILED,
            status=EventStatus.FAILED,
            message=message,
            error=error,
            data=data,
        )

    def emit_pipeline_update(
        self,
        *,
        job_application_id: str,
        message: Optional[str] = None,
        data: Optional[Dict[str, Any]] = None,
        step: Optional[PipelineStep | str] = None,
    ) -> Event:
        return self.emit_event(
            job_application_id=job_application_id,
            event_name=EventName.PIPELINE_UPDATE,
            status=None,
            step=step,
            message=message,
            data=data,
        )

    # Queries
    def list_events(
        self,
        job_application_id: str,
        *,
        event_name: Optional[EventName | str] = None,
        step: Optional[PipelineStep | str] = None,
        status: Optional[EventStatus | str] = None,
        category_name: Optional[str] = None,
        tool_name: Optional[str] = None,
        since: Optional[datetime] = None,
        until: Optional[datetime] = None,
        limit: int = 200,
        offset: int = 0,
        ascending: bool = True,
    ) -> List[Event]:
        return self.event_repository.list_events(
            job_application_id=job_application_id,
            event_name=(
                event_name.value if isinstance(event_name, EventName) else event_name
            ),
            step=step.value if isinstance(step, PipelineStep) else step,
            status=status.value if isinstance(status, EventStatus) else status,
            category_name=category_name,
            tool_name=tool_name,
            since=since,
            until=until,
            limit=limit,
            offset=offset,
            ascending=ascending,
        )

    def latest_for_step(
        self, job_application_id: str, step: PipelineStep
    ) -> Optional[Event]:
        return self.event_repository.get_latest_by_step(
            job_application_id=job_application_id,
            step=step.value,
        )

    def clear_events(self, job_application_id: str) -> int:
        return self.event_repository.delete_by_job_application(job_application_id)
