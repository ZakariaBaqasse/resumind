from logging import getLogger
from typing import List, Optional, Dict, Tuple
from sqlalchemy.orm.attributes import flag_modified
from datetime import datetime, timezone

from src.core.types import Resume
from src.job_applications.model import JobApplication
from src.job_applications.repositories.job_application_repository import (
    JobApplicationRepository,
)
from src.job_applications.types import (
    DiscoveredCompanyProfile,
    ResearchPlan,
    ResumeGenerationStatus,
    ResumesCreationStats,
)


logger = getLogger(__name__)


class JobApplicationService:
    """
    Service for handling job application-related business logic.
    Uses JobApplicationRepository for data access and adds business logic layer.
    """

    def __init__(self, job_application_repository: JobApplicationRepository):
        self.job_application_repository = job_application_repository

    def create_job_application(
        self, application_data: JobApplication
    ) -> JobApplication:
        """
        Create a new job application.

        Args:
            application_data: Job application data to register

        Returns:
            The created job application
        """
        # Create the new user
        return self.job_application_repository.create(application_data)

    def get_job_application(
        self, application_id: str, *, refresh: bool = False
    ) -> Optional[JobApplication]:
        """
        Get a job application by ID.

        Args:
            application_id: The ID of the job application to retrieve
            refresh: If True, refresh the object from the database.

        Returns:
            The job application if found, None otherwise
        """
        return self.job_application_repository.get_by_id(
            application_id, refresh=refresh
        )

    def get_user_job_application(
        self, application_id: str, user_id: str, *, refresh: bool = False
    ) -> Optional[JobApplication]:
        """
        Get a job application by ID and user id.

        Args:
            application_id: The ID of the job application to retrieve
            user_id: The ID of the user to whom the job application belong
            refresh: If True, refresh the object from the database.

        Returns:
            The job application if found, None otherwise
        """
        return self.job_application_repository.get_by_id_and_user(
            application_id, user_id, refresh=refresh
        )

    def list_job_applications(self) -> List[JobApplication]:
        """
        List all users.

        Returns:
            A list of all users
        """
        return self.job_application_repository.get_all()

    def list_paginated(
        self, user_id: str, offset: int = 0, limit: int = 30
    ) -> Tuple[List[JobApplication], int]:
        """
        List job applications with pagination

        Args:
            user_id: the id of the authenticated user
            offset (int, optional): The number of job applications to skip. Defaults to 0.
            limit (int, optional): The maximum number of job applications to return. Defaults to 30.

        Returns:
            Tuple[List[JobApplication], int]: A tuple containing the list of job applications and the total count
        """
        try:
            return self.job_application_repository.list_paginated(
                user_id, offset, limit
            )
        except Exception as e:
            logger.error(f"Error listing paginated apps: {e}")
            raise e

    def search_job_applications(
        self, user_id: str, search_term: str, offset: int = 0, limit: int = 100
    ) -> Tuple[List[JobApplication], int]:
        """
        List job applications with names or descriptions that match a pattern using LIKE search
        """
        try:
            return self.job_application_repository.search_job_applications(
                user_id, search_term, offset, limit
            )
        except Exception as e:
            logger.error(
                f"Error searching job applications by name or description like '{search_term}': {e}"
            )
            return [], 0

    def delete_job_application(self, application_id: str) -> bool:
        """
        Delete a user account.

        Args:
            user_id: The ID of the user to delete

        Returns:
            True if the user was deleted, False otherwise
        """
        return self.job_application_repository.delete(application_id)

    def update_job_application(self, job_application: JobApplication):
        """
        Update an existing job application.

        Args:
            job_application: The job application object with updated data.

        Returns:
            The updated job application.
        """
        return self.job_application_repository.update(job_application)

    def update_company_profile_discovery_results(
        self, application_id: str, discovery_results: DiscoveredCompanyProfile
    ):
        try:
            job_application = self.job_application_repository.get_by_id(application_id)
            if not job_application:
                raise Exception("No job application found with the given ID")

            if not job_application.company_profile:
                job_application.company_profile = {}

            job_application.company_profile["company_discovery_results"] = (
                discovery_results.model_dump()
            )
            flag_modified(job_application, "company_profile")
            return self.job_application_repository.update(job_application)
        except Exception as e:
            logger.error(
                f"ERROR: in JobApplicationService in update_company_profile_discovery_results: {str(e)}"
            )
            raise e

    def update_company_profile_research_plan(
        self, application_id: str, research_plan: ResearchPlan
    ):
        try:
            job_application = self.job_application_repository.get_by_id(application_id)
            if not job_application:
                raise Exception("No job application found with the given ID")

            if not job_application.company_profile:
                job_application.company_profile = {}

            job_application.company_profile["research_plan"] = (
                research_plan.model_dump()
            )
            flag_modified(job_application, "company_profile")
            return self.job_application_repository.update(job_application)
        except Exception as e:
            logger.error(
                f"ERROR: in JobApplicationService in update_company_profile_research_plan: {str(e)}"
            )
            raise e

    def update_company_profile_research_results(
        self, application_id: str, research_results: Dict[str, str]
    ):
        try:
            job_application = self.job_application_repository.get_by_id(application_id)
            if not job_application:
                raise Exception("No job application found with the given ID")

            if not job_application.company_profile:
                job_application.company_profile = {}

            job_application.company_profile["research_results"] = research_results
            flag_modified(job_application, "company_profile")
            return self.job_application_repository.update(job_application)
        except Exception as e:
            logger.error(
                f"ERROR: in JobApplicationService in update_company_profile_research_plan: {str(e)}"
            )
            raise e

    def append_company_profile_category_research_results(
        self, application_id: str, category_name: str, results: str
    ):
        try:
            job_application = self.job_application_repository.get_by_id(application_id)
            if not job_application:
                raise Exception("No job application found with the given ID")

            if not job_application.company_profile:
                job_application.company_profile = {}
            if (
                "research_results" not in job_application.company_profile
                or not isinstance(
                    job_application.company_profile["research_results"], dict
                )
            ):
                job_application.company_profile["research_results"] = {}

            job_application.company_profile["research_results"][category_name] = results
            flag_modified(job_application, "company_profile")
            return self.job_application_repository.update(job_application)
        except Exception as e:
            logger.error(
                f"ERROR: in JobApplicationService in append_company_profile_category_research_results: {str(e)}"
            )
            raise e

    def update_job_application_status(
        self, job_application_id: str, status: ResumeGenerationStatus
    ):
        try:
            job_application = self.job_application_repository.get_by_id(
                job_application_id
            )
            if not job_application:
                raise Exception("No job application found with the given ID")
            job_application.resume_generation_status = status.value
            return self.update_job_application(job_application)
        except Exception as e:
            logger.error(
                f"ERROR: in JobApplicationService in update_job_application_status: {str(e)}"
            )
            raise e

    def save_generated_resume(self, job_application_id: str, generated_resume: Resume):
        try:
            job_application = self.job_application_repository.get_by_id(
                job_application_id
            )
            if not job_application:
                raise Exception("No job application found with the given ID")
            job_application.generated_resume = generated_resume.model_dump()
            return self.update_job_application(job_application)
        except Exception as e:
            logger.error(
                f"ERROR: in JobApplicationService in save_generated_resume: {str(e)}"
            )
            raise e

    def save_generated_cover_letter(
        self, job_application_id: str, generated_cover_letter: str
    ):
        try:
            job_application = self.job_application_repository.get_by_id(
                job_application_id
            )
            if not job_application:
                raise Exception("No job application found with the given ID")
            job_application.generated_cover_letter = generated_cover_letter
            return self.update_job_application(job_application)
        except Exception as e:
            logger.error(
                f"ERROR: in JobApplicationService in save_generated_cover_letter: {str(e)}"
            )
            raise e

    def get_stats(self, user_id: str) -> ResumesCreationStats:
        try:
            all_job_applications = self.job_application_repository.get_all(user_id)

            now = datetime.now(timezone.utc)
            created_this_month = [
                app
                for app in all_job_applications
                if app.created_at.year == now.year and app.created_at.month == now.month
            ]
            completed = [
                app
                for app in all_job_applications
                if app.resume_generation_status
                == ResumeGenerationStatus.COMPLETED.value
            ]
            return ResumesCreationStats(
                total_created=len(all_job_applications),
                created_this_month=len(created_this_month),
                completed=len(completed),
            )
        except Exception as e:
            logger.error(f"ERROR: in JobApplicationService in get_stats: {str(e)}")
            raise e
