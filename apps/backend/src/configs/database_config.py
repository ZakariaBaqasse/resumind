import os

from sqlalchemy import inspect
from sqlalchemy.schema import CreateSchema
from sqlmodel import Session, SQLModel, create_engine

# Get database URL from environment
DATABASE_URL = os.environ.get("DATABASE_URL")

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL, echo=os.getenv("DB_ECHO", "false").lower() == "true"
)


def get_session():
    """
    Creates and yields a database session.
    To be used as a FastAPI dependency.
    """
    with Session(engine) as session:
        yield session


def init_db():
    """Initialize the database by creating schemas and tables"""
    inspector = inspect(engine)
    schemas = inspector.get_schema_names()
    # Create app schema if it doesn't exist
    if "app" not in schemas:
        print("Creating app schema")
        with engine.connect() as conn:
            conn.execute(CreateSchema("app"))
            conn.commit()

    if "auth" not in schemas:
        print("Creating auth schema")
        with engine.connect() as conn:
            conn.execute(CreateSchema("auth"))
            conn.commit()

    tables = [table for table in SQLModel.metadata.tables.values()]

    for table in tables:
        table.create(engine, checkfirst=True)
