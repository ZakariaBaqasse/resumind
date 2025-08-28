import logging
from typing import List, Optional, Tuple

from sqlmodel import Session, desc, func, select

from src.job_applications.model import JobApplication

logger = logging.getLogger(__name__)


class JobApplicationRepository:
    """
    Repository for handling User model database operations.
    Provides methods for CRUD operations on User objects.
    """

    def __init__(self, session: Session):
        self.session = session

    def create(self, job_application: JobApplication) -> JobApplication:
        """
        Create a new job application in the database.

        Args:
            job_application: The job application object to be created

        Returns:
            The created job application with updated fields
        """
        self.session.add(job_application)
        self.session.commit()
        created_application = self.get_by_id(job_application.id)
        return created_application

    def get_by_id(
        self, job_application_id: str, *, refresh: bool = False
    ) -> Optional[JobApplication]:
        """
        Retrieve a job application by its ID.

        Args:
            job_application_id: The ID of the application to retrieve
            refresh: If True, refresh the object from the database to get the latest state.

        Returns:
            The job application if found, None otherwise
        """
        statement = select(JobApplication).where(
            JobApplication.id == job_application_id
        )
        results = self.session.exec(statement)
        job_app = results.first()
        if job_app and refresh:
            self.session.refresh(job_app)
        return job_app

    def get_by_id_and_user(
        self, job_application_id: str, user_id: str, *, refresh: bool = False
    ) -> Optional[JobApplication]:
        """
        Retrieve a job application by its ID and user id.

        Args:
            job_application_id: The ID of the application to retrieve
            user_id: The ID of the user to whom the job application belong
            refresh: If True, refresh the object from the database to get the latest state.

        Returns:
            The job application if found, None otherwise
        """
        statement = (
            select(JobApplication)
            .where(JobApplication.id == job_application_id)
            .where(JobApplication.user_id == user_id)
        )
        results = self.session.exec(statement)
        job_app = results.first()
        if job_app and refresh:
            self.session.refresh(job_app)
        return job_app

    def get_all(self) -> List[JobApplication]:
        """
        Retrieve all users.

        Returns:
            A list of all users
        """
        statement = select(JobApplication)
        results = self.session.exec(statement)
        return results.all()

    def list_paginated(
        self, user_id: str, offset: int = 0, limit: int = 30
    ) -> Tuple[List[JobApplication], int]:
        """
        List job applications with pagination

        Args:
            user_id: The ID of the user to list job applications for.
            offset (int, optional): The number of job applications to skip. Defaults to 0.
            limit (int, optional): The maximum number of job applications to return. Defaults to 30.

        Returns:
            Tuple[List[JobApplication], int]: A tuple containing the list of matching apps and the total count
        """
        try:
            # Get total count efficiently using func.count()
            count_statement = select(func.count(JobApplication.id)).where(
                JobApplication.user_id == user_id
            )
            total = self.session.exec(count_statement).one()

            # Get paginated results
            statement = (
                select(JobApplication)
                .where(JobApplication.user_id == user_id)
                .offset(offset)
                .limit(limit)
                .order_by(desc(JobApplication.created_at))
            )
            result = self.session.exec(statement)
            return result.all(), total
        except Exception as e:
            logger.error(f"Error listing paginated job applications: {e}")
            raise e

    def search_job_applications(
        self, user_id: str, search_term: str, offset: int = 0, limit: int = 30
    ) -> Tuple[List[JobApplication], int]:
        """
        List job applications with names or descriptions that match a pattern using LIKE search

        Args:
            search_term (str): The search term to match against name or description
            offset (int, optional): The number of job applications to skip. Defaults to 0.
            limit (int, optional): The maximum number of job applications to return. Defaults to 30.

        Returns:
            Tuple[List[App], int]: A tuple containing the list of matching apps and the total count
        """
        try:
            # Create the LIKE pattern (case-insensitive)
            like_pattern = f"%{search_term}%"

            # Create OR condition for name and description
            search_condition = (
                (JobApplication.job_title.ilike(like_pattern))
                | (JobApplication.job_description.ilike(like_pattern))
                | (JobApplication.company_name.ilike(like_pattern))
            ) & (JobApplication.user_id == user_id)

            # Get total count efficiently using func.count()
            count_statement = select(func.count(JobApplication.id)).where(
                search_condition
            )
            total = self.session.exec(count_statement).one()

            # Get paginated results
            statement = (
                select(JobApplication)
                .where(search_condition)
                .offset(offset)
                .limit(limit)
                .order_by(desc(JobApplication.created_at))
            )
            result = self.session.exec(statement)
            return result.all(), total
        except Exception as e:
            logger.error(
                f"Error searching job applications by name or description like '{search_term}': {e}"
            )
            raise e

    def update(self, job_application: JobApplication) -> JobApplication:
        """
        Update an existing user.

        Args:
            user: The user object with updated fields

        Returns:
            The updated user
        """
        self.session.add(job_application)
        self.session.commit()
        updated_application = self.get_by_id(job_application.id)
        return updated_application

    def delete(self, job_application_id: str) -> bool:
        """
        Delete a user by their ID.

        Args:
            user_id: The ID of the user to delete

        Returns:
            True if the user was deleted, False otherwise
        """
        job_application = self.get_by_id(job_application_id)
        if job_application:
            self.session.delete(job_application)
            self.session.commit()
            return True
        return False
