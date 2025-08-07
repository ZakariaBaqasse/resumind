import os
import logging
import psycopg
from uuid import uuid4


from asgiref.sync import async_to_sync
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from langchain_core.runnables import RunnableConfig
from langfuse.langchain import CallbackHandler

from src.core.service_registry import ServiceRegistry
from src.configs.database_config import get_session_context
from src.job_applications.agents.company_profiler_agents.company_profiler import (
    CompanyProfilerAgent,
    CompanyProfilerState,
)
from src.celery_app import app

# Initialize structured logger
logger = logging.getLogger(__name__)

# Database connection settings
db_url = os.environ.get("DATABASE_URL")


@app.task(
    bind=True,
    track_started=True,
)
def start_resume_generation(self, job_application_id: str):
    """
    Given a workflow id, execute the workflow.
    """
    try:

        async_to_sync(start_resume_generation_async)(
            job_application_id=job_application_id,
        )

        return {"job_application_id": job_application_id}

    except Exception as e:
        logger.error(f"Error starting resume generation: {str(e)}")
        raise e


async def start_resume_generation_async(
    job_application_id: str,
):
    """
    Given a job application id, start the resume generation.
    """
    try:
        async with await psycopg.AsyncConnection.connect(db_url) as conn:
            await conn.set_autocommit(True)

            # Initialize the async checkpointer
            checkpointer = AsyncPostgresSaver(conn)
            await checkpointer.setup()

            # Build the execution graph with the async checkpointer
            executor = CompanyProfilerAgent()
            graph = executor.build_graph(checkpointer)
            with get_session_context() as session:
                job_application_service = ServiceRegistry.get_job_application_service(
                    session
                )
                job_application = job_application_service.get_job_application(
                    job_application_id
                )
                job_application_role = job_application.job_title
                job_application_description = job_application.job_description
                job_application_company = job_application.company_name

            input_state = CompanyProfilerState(
                job_application_id=job_application_id,
                job_role=job_application_role,
                job_description=job_application_description,
                company=job_application_company,
            )
            # Execute the workflow
            configurable = {
                "thread_id": job_application_id,
            }
            config = RunnableConfig(
                callbacks=[CallbackHandler()], configurable=configurable
            )

            await graph.ainvoke(
                input=input_state,
                config=config,
            )

            await conn.close()

    except psycopg.Error as db_error:
        logger.error(
            "Database error in start_resume_generation_async",
            error=str(db_error),
            exc_info=True,
        )
        raise db_error
    except Exception as exec_error:
        logger.error(
            "Error in start_resume_generation_async", error=exec_error, exc_info=True
        )
        raise exec_error
