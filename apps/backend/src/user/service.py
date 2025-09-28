import os
from logging import getLogger
from typing import List, Optional

from fastapi import HTTPException
from langchain_community.document_loaders import PDFPlumberLoader
from langchain_mistralai import ChatMistralAI
from langfuse.langchain import CallbackHandler

from src.core.constants import MODEL_NAME
from src.core.types import Resume
from src.user.model import User
from src.user.prompts.extract_resume_content_prompt import (
    extract_resume_content_system_prompt,
)
from src.user.repository import UserRepository

logger = getLogger(__name__)


class UserService:
    """
    Service for handling user-related business logic.
    Uses UserRepository for data access and adds business logic layer.
    """

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def create_user(self, user_data: User) -> User:
        """
        Register a new user with validation.

        Args:
            user_data: User data to register

        Returns:
            The created user
        """
        # Create the new user
        return self.user_repository.create(user_data)

    def get_user(self, user_id: str) -> Optional[User]:
        """
        Get a user by ID.

        Args:
            user_id: The ID of the user to retrieve

        Returns:
            The user if found, None otherwise
        """
        return self.user_repository.get_by_id(user_id)

    def get_user_by_email(self, email: str) -> Optional[User]:
        """
        Get a user by email.

        Args:
            email: The email of the user to retrieve

        Returns:
            The user if found, None otherwise
        """
        return self.user_repository.get_by_email(email)

    def list_users(self) -> List[User]:
        """
        List all users.

        Returns:
            A list of all users
        """
        return self.user_repository.get_all()

    def delete_user(self, user_id: str) -> bool:
        """
        Delete a user account.

        Args:
            user_id: The ID of the user to delete

        Returns:
            True if the user was deleted, False otherwise
        """
        return self.user_repository.delete(user_id)

    def save_resume(self, user_id: str, resume: Resume):
        try:
            user = self.get_user(user_id)
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            if not resume:
                raise HTTPException(status_code=400, detail="Resume data is required")
            # Update the user's resume
            user.initial_resume = resume.model_dump()
            return self.user_repository.update(user)
        except HTTPException as e:
            logger.error(f"HTTP error saving resume for user {user_id}: {e.detail}")
            raise e
        except Exception:
            message = f"Error saving resume for user: {user_id}"
            logger.error(message)
            raise HTTPException(status_code=500, detail=message)

    async def extract_initial_resume(self, save_path: str, user: User) -> None:
        try:
            loader = PDFPlumberLoader(save_path)
            docs = loader.load()
            resume_content = "\n\n".join([doc.page_content for doc in docs])
            langfuse_handler = CallbackHandler()
            model = ChatMistralAI(
                model=MODEL_NAME, callbacks=[langfuse_handler]
            ).with_structured_output(schema=Resume)

            # Add more specific instruction in the user message
            user_message = f"""Please extract information from this resume and ensure:
                            1. Group all responsibilities under each unique job position
                            2. Do not create duplicate entries for the same job title 
                            and date range
                            3. Include complete descriptions without truncation
                            4. For missing information 
                            (like grades, end dates for current positions),
                            use "Not provided" instead of null/None
                            5. For current positions, use "Present" as the end_date

                            Resume content:
                            {resume_content}"""

            response = await model.ainvoke(
                [
                    ("system", extract_resume_content_system_prompt),
                    ("user", user_message),
                ]
            )
            logger.info(f"Extracted resume content for user {user.id}")

            # Validate and clean the response before saving
            validated_resume = Resume.model_validate(response)
            user.initial_resume = validated_resume.model_dump()
            self.user_repository.update(user)
            return user

        except HTTPException as http_exc:
            logger.error(
                f"HTTP error uploading resume for user {user.id}: {http_exc.detail}"
            )
            raise http_exc
        except Exception as e:
            # Store user_id before potential session issues
            user_id = user.id if hasattr(user, "id") else "unknown"
            logger.error(f"Error uploading resume for user {user_id}: {e}")
            raise HTTPException(status_code=500, detail="Error uploading resume")
        finally:
            try:
                if os.path.exists(save_path):
                    os.remove(save_path)
                    logger.info(f"Deleted resume file at {save_path}")
            except Exception as cleanup_error:
                logger.error(
                    f"Failed to delete resume file at {save_path}: {cleanup_error}"
                )
