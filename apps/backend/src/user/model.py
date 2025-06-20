from typing import Optional
from datetime import datetime
from sqlmodel import Field, SQLModel
from uuid import uuid4


class UserBase(SQLModel):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    name: Optional[str] = None
    email: str = Field(unique=True, index=True)
    emailVerified: Optional[datetime] = Field(default=None)
    image: Optional[str] = None


class User(UserBase, table=True):
    """User model for authentication and profile information"""

    __tablename__ = "user"
    __table_args__ = {
        "schema": "auth",
    }
    password: Optional[str] = Field(default=None)

    class Config:
        orm_mode = True
