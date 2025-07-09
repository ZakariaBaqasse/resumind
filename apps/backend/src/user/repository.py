from typing import List, Optional

from sqlmodel import Session, select

from src.user.model import User


class UserRepository:
    """
    Repository for handling User model database operations.
    Provides methods for CRUD operations on User objects.
    """

    def __init__(self, session: Session):
        self.session = session

    def create(self, user: User) -> User:
        """
        Create a new user in the database.

        Args:
            user: The user object to be created

        Returns:
            The created user with updated fields
        """
        self.session.add(user)
        self.session.commit()
        created_user = self.get_by_id(user.id)
        return created_user

    def get_by_id(self, user_id: str) -> Optional[User]:
        """
        Retrieve a user by their ID.

        Args:
            user_id: The ID of the user to retrieve

        Returns:
            The user if found, None otherwise
        """
        self.session.expire_all()
        statement = select(User).where(User.id == user_id)
        results = self.session.exec(statement)
        return results.first()

    def get_by_email(self, email: str) -> Optional[User]:
        """
        Retrieve a user by their email address.

        Args:
            email: The email of the user to retrieve

        Returns:
            The user if found, None otherwise
        """
        statement = select(User).where(User.email == email)
        results = self.session.exec(statement)
        return results.first()

    def get_all(self) -> List[User]:
        """
        Retrieve all users.

        Returns:
            A list of all users
        """
        statement = select(User)
        results = self.session.exec(statement)
        return results.all()

    def update(self, user: User) -> User:
        """
        Update an existing user.

        Args:
            user: The user object with updated fields

        Returns:
            The updated user
        """
        self.session.add(user)
        self.session.commit()
        updated_user = self.get_by_id(user.id)
        return updated_user

    def delete(self, user_id: str) -> bool:
        """
        Delete a user by their ID.

        Args:
            user_id: The ID of the user to delete

        Returns:
            True if the user was deleted, False otherwise
        """
        user = self.get_by_id(user_id)
        if user:
            self.session.delete(user)
            self.session.commit()
            return True
        return False
