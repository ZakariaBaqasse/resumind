import threading
from logging import getLogger
from typing import Any, Dict

from sqlmodel import Session

# Initialize structured logger
logger = getLogger(__name__)


class ServiceRegistry:
    """
    Thread-safe registry that maintains service singletons by database session.

    This class ensures that for any given database session, only one instance
    of each service type is created, promoting efficient resource usage and
    consistent state within transactions.
    """

    _instances: Dict[str, Dict[int, Any]] = {}
    _lock = threading.RLock()

    @classmethod
    def clear_session(cls, session: Session):
        """Remove all services associated with a session"""
        with cls._lock:
            session_id = id(session)
            services_cleared = 0

            for service_type in cls._instances:
                if session_id in cls._instances[service_type]:
                    # Remove the service instance
                    del cls._instances[service_type][session_id]
                    services_cleared += 1

    @classmethod
    def get_user_service(cls, session: Session):
        """Get or create a UserService singleton for this session"""
        with cls._lock:
            session_id = id(session)
            service_type = "user_service"

            # Initialize container if needed
            if service_type not in cls._instances:
                cls._instances[service_type] = {}

            # Return existing instance if available
            if session_id in cls._instances[service_type]:
                return cls._instances[service_type][session_id]

            from src.user.repository import UserRepository
            from src.user.service import UserService

            user_repository = UserRepository(session)
            service = UserService(user_repository)

            # Store the service instance
            cls._instances[service_type][session_id] = service
            return service

    @classmethod
    def get_job_application_service(cls, session: Session):
        """Get or create a JobApplication singleton for this session"""
        with cls._lock:
            session_id = id(session)
            service_type = "job_application_service"

            # Initialize container if needed
            if service_type not in cls._instances:
                cls._instances[service_type] = {}

            # Return existing instance if available
            if session_id in cls._instances[service_type]:
                return cls._instances[service_type][session_id]

            from src.job_applications.repositories.job_application_repository import (
                JobApplicationRepository,
            )
            from src.job_applications.services.job_application_service import (
                JobApplicationService,
            )

            job_application_repository = JobApplicationRepository(session)
            service = JobApplicationService(job_application_repository)

            # Store the service instance
            cls._instances[service_type][session_id] = service
            return service

    @classmethod
    def get_events_service(cls, session: Session):
        """Get or create an EventService singleton for this session"""
        with cls._lock:
            session_id = id(session)
            service_type = "events_service"

            # Initialize container if needed
            if service_type not in cls._instances:
                cls._instances[service_type] = {}

            # Return existing instance if available
            if session_id in cls._instances[service_type]:
                return cls._instances[service_type][session_id]

            from src.job_applications.repositories.events_repository import (
                EventRepository,
            )
            from src.job_applications.services.events_service import (
                EventService,
            )

            events_repository = EventRepository(session)
            service = EventService(events_repository)

            # Store the service instance
            cls._instances[service_type][session_id] = service
            return service
