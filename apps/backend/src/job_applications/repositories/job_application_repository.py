from typing import List, Optional

from sqlmodel import Session, select

from src.job_applications.model import JobApplication


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

    def get_all(self) -> List[JobApplication]:
        """
        Retrieve all users.

        Returns:
            A list of all users
        """
        statement = select(JobApplication)
        results = self.session.exec(statement)
        return results.all()

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
