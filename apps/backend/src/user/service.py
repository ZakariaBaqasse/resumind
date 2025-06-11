from typing import List, Optional
from src.user.model import User
from src.user.repository import UserRepository
from uuid import UUID


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
