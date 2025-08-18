from logging import getLogger
from typing import List, Optional, Dict
from sqlalchemy.orm.attributes import flag_modified

from src.job_applications.model import JobApplication
from src.job_applications.repositories.job_application_repository import (
    JobApplicationRepository,
)
from src.job_applications.types import (
    DiscoveredCompanyProfile,
    ResearchPlan,
    ResumeGenerationStatus,
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

    def list_job_applications(self) -> List[JobApplication]:
        """
        List all users.

        Returns:
            A list of all users
        """
        return self.job_application_repository.get_all()

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
            job_application.resume_generation_status = status
            return self.update_job_application(job_application)
        except Exception as e:
            logger.error(
                f"ERROR: in JobApplicationService in update_job_application_status: {str(e)}"
            )
            raise e
