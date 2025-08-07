import os
import logging
import json
from celery import Celery
from celery.signals import (
    task_failure,
)


logger = logging.getLogger(__name__)

broker_url = os.environ.get("CELERY_BROKER_URL")
if not broker_url:
    raise ValueError("CELERY_BROKER_URL environment variable not set.")
else:
    logger.info("Using Celery broker URL", broker_url=broker_url)

# Optional: Read transport options (e.g., for region)
broker_transport_options = {}
transport_options_json = os.environ.get("CELERY_BROKER_TRANSPORT_OPTIONS")
if transport_options_json:
    try:
        broker_transport_options = json.loads(transport_options_json)
        logger.info(
            f"Using Celery broker transport options: {broker_transport_options}"
        )
    except json.JSONDecodeError:
        logger.error("Failed to parse CELERY_BROKER_TRANSPORT_OPTIONS")
else:
    logger.info("No Celery broker transport options set")

# Set SSL options for Redis connections if using rediss:// scheme
ssl_options = None
if broker_url and broker_url.startswith("rediss://"):
    logger.info("Configuring SSL options for Redis broker connection")
    ssl_options = {
        "ssl_cert_reqs": None,  # Equivalent to CERT_NONE
        "ssl_check_hostname": False,  # Disable hostname checking to match CERT_NONE
    }

# --- Result Backend Configuration ---
database_url = os.environ.get("DATABASE_URL")
if not database_url:
    raise ValueError(
        "DATABASE_URL environment variable not set for Celery result backend."
    )
else:
    logger.info("Using Celery result backend", database_url=database_url)

# Ensure the database URL uses the correct dialect name
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)
    logger.info("Fixed database URL to use 'postgresql://' instead of 'postgres://'")

result_backend = f"db+{database_url}"

# Configure SQLAlchemy to handle circular dependencies
os.environ["SQLALCHEMY_DEFER_MAPPER_CONFIGURATION"] = "1"


# TODO: Configure Sentry for Celery with enhanced logging


# Create Celery app
app = Celery(
    "resumind",
    broker=broker_url,
    backend=result_backend,
    broker_transport_options=broker_transport_options,
    broker_use_ssl=ssl_options,  # Add SSL options here if using rediss://
    include=["src.job_applications.generate_resume_job"],
)

# Logger is already initialized at the top of the file
logger.info(f"Celery queue configured with broker: {app.conf.broker_url}!")

task_routes = {
    "src.job_applications.generate_resume_job.*": {"queue": "generate_resume"},
}
# Optional configuration
app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=60 * 60 * 24,  # 24 hours timeout for tasks
    worker_hijack_root_logger=False,
    # Fix upcoming deprecation warning
    broker_connection_retry_on_startup=True,
    # Enable events for better Flower integration
    worker_send_task_events=True,
    task_send_sent_event=True,
    result_extended=True,
    # Add task routing
    # Set concurrency for different queues (can be overridden at worker start)
    worker_concurrency=os.environ.get("CELERY_CONCURRENCY", 4),
    # Prefetch multiplier (lower for longer tasks)
    worker_prefetch_multiplier=1,
    # Task acks late to prevent losing tasks if worker crashes
    task_acks_late=True,
    # Add result backend settings
    result_backend_transport_options={
        "retry_policy": {
            "timeout": 5.0,  # Timeout for operations
            "max_retries": 3,  # Maximum number of retries
            "interval_start": 0,  # Initial retry interval
            "interval_step": 0.2,  # Increment between retries
            "interval_max": 0.6,  # Maximum retry interval
        },
        "connect_args": {
            "keepalives": 1,
            "keepalives_idle": 15,
            "keepalives_interval": 5,
            "keepalives_count": 5,
            "connect_timeout": 10,
            "application_name": "resumind",
        },
    },
    task_routes=task_routes,
)


# # Prevent Celery from setting up its own logging
# @celery_setup_logging.connect
# def configure_celery_logging(**kwargs):
#     logger.info("Celery requested to set up logging, but we're handling it ourselves")
#     return True


# Task failure handler with better error reporting
@task_failure.connect
def on_task_failure(sender=None, task_id=None, exception=None, einfo=None, **kwargs):
    logger.error("Task failed", task_id=task_id, exception=str(exception))


# @worker_process_init.connect
# def configure_worker(**kwargs):
#     worker_id = f"worker-{os.getpid()}"
#     structlog.contextvars.bind_contextvars(worker_id=worker_id)
#     logger.info("Celery worker initialized", worker_id=worker_id)


# # Add task middleware for adding task_id to all logs within a task context
# @task_prerun.connect
# def on_task_prerun(task_id, task, args, kwargs, **_):
#     structlog.contextvars.bind_contextvars(task_id=task_id, task_name=task.name)
#     logger.info("Task started", task_name=task.name, task_id=task_id)


# @task_postrun.connect
# def on_task_postrun(task_id, task, args, kwargs, retval, state, **_):
#     logger.info("Task completed", task_name=task.name, task_id=task_id, state=state)
#     structlog.contextvars.clear_contextvars()


if __name__ == "__main__":
    app.start()
