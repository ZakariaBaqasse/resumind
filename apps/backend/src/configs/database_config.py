import contextlib
import logging
import os

from sqlalchemy import inspect
from sqlalchemy.exc import DBAPIError, SQLAlchemyError
from sqlalchemy.schema import CreateSchema
from sqlmodel import Session, SQLModel, create_engine

# Initialize logger
logger = logging.getLogger(__name__)

# Get database URL from environment
DATABASE_URL = os.environ.get("DATABASE_URL")

# More conservative pool settings for production stability
DEFAULT_POOL_SIZE = int(os.getenv("DB_POOL_SIZE", "20"))
DEFAULT_MAX_OVERFLOW = int(os.getenv("DB_MAX_OVERFLOW", "10"))
DEFAULT_POOL_TIMEOUT = int(os.getenv("DB_POOL_TIMEOUT", "30"))
DEFAULT_POOL_RECYCLE = int(os.getenv("DB_POOL_RECYCLE", "180"))
DEFAULT_POOL_PRE_PING = os.getenv("DB_POOL_PRE_PING", "true").lower() == "true"
DEFAULT_POOL_USE_LIFO = os.getenv("DB_POOL_USE_LIFO", "true").lower() == "true"

KEEPALIVES = int(os.getenv("DB_KEEPALIVES", "1"))
KEEPALIVES_IDLE = int(os.getenv("DB_KEEPALIVES_IDLE", "15"))
KEEPALIVES_INTERVAL = int(os.getenv("DB_KEEPALIVES_INTERVAL", "5"))
KEEPALIVES_COUNT = int(os.getenv("DB_KEEPALIVES_COUNT", "5"))

# Create SQLAlchemy engine with optimized connection pooling
engine = create_engine(
    DATABASE_URL,
    echo=os.getenv("DB_ECHO", "false").lower() == "true",
    pool_size=DEFAULT_POOL_SIZE,
    max_overflow=DEFAULT_MAX_OVERFLOW,
    pool_timeout=DEFAULT_POOL_TIMEOUT,
    pool_recycle=DEFAULT_POOL_RECYCLE,
    pool_pre_ping=DEFAULT_POOL_PRE_PING,  # Verify connections before using them
    pool_use_lifo=DEFAULT_POOL_USE_LIFO,  # Use most recently used connections first
    # Add connect_args for SSL error handling
    connect_args={
        "keepalives": KEEPALIVES,
        "keepalives_idle": KEEPALIVES_IDLE,
        "keepalives_interval": KEEPALIVES_INTERVAL,
        "keepalives_count": KEEPALIVES_COUNT,
        "connect_timeout": 10,  # Add connection timeout
        "application_name": "resumind",  # application name for better monitoring
    },
)


def get_session():
    """
    Creates and yields a database session.
    To be used as a FastAPI dependency.
    """
    session = None
    try:
        session = Session(engine)
        yield session
        # Auto-commit at the end of request if not already committed
        if session.is_active:
            session.commit()
    except (DBAPIError, SQLAlchemyError) as e:
        if session:
            try:
                session.rollback()  # Roll back any failed transaction
                logger.warning(f"Transaction rolled back due to error: {str(e)}")
            except Exception as rollback_error:
                logger.error(f"Error during rollback: {str(rollback_error)}")
        logger.error(f"Database session error: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error in database session: {str(e)}")
        if session:
            try:
                session.rollback()
            except Exception:
                pass
        raise
    finally:
        if session:
            try:
                # Clean up services before closing session
                from src.core.service_registry import ServiceRegistry

                ServiceRegistry.clear_session(session)

                session.close()  # Ensure the session is always properly closed
                if os.getenv("DB_DEBUG_LOGGING", "false").lower() == "true":
                    logger.debug("Database session closed")
            except Exception as close_error:
                logger.error(f"Error closing database session: {str(close_error)}")


@contextlib.contextmanager
def get_session_context():
    """
    Context manager for database sessions.

    This provides a more reliable way to handle session lifecycle compared to
    the generator-based approach.
    Use this when you need manual control over session creation and cleanup, especially
    in services.

    Example:
        with get_session_context() as session:
            # Use session here
    """
    session = Session(engine)
    try:
        yield session
        session.commit()
    except Exception as e:
        session.rollback()
        logger.error(f"Database session error (context manager): {str(e)}")
        raise
    finally:
        # Clean up services before closing session
        try:
            from src.core.service_registry import ServiceRegistry

            ServiceRegistry.clear_session(session)
        except Exception as cleanup_error:
            logger.error(f"Error cleaning up services: {str(cleanup_error)}")

        session.close()


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
