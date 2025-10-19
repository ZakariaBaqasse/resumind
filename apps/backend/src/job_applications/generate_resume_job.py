import asyncio
import logging
import os

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
        asyncio.run(start_resume_generation_async(job_application_id))
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
    import psycopg
    from langchain_core.runnables import RunnableConfig
    from langfuse.langchain import CallbackHandler
    from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver

    from src.configs.database_config import get_session_context
    from src.core.rate_limit_handlers import RateLimiter
    from src.core.service_registry import ServiceRegistry
    from src.job_applications.agents.main_graph import MainGraphAgent, MainGraphState

    try:
        async with await psycopg.AsyncConnection.connect(db_url) as conn:
            await conn.set_autocommit(True)

            # Initialize the async checkpointer
            checkpointer = AsyncPostgresSaver(conn)
            await checkpointer.setup()

            # Build the execution graph with the async checkpointer
            executor = MainGraphAgent(rate_limiter=RateLimiter())
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
                original_resume_snapshot = job_application.original_resume_snapshot[
                    "resume"
                ]

            input_state = MainGraphState(
                job_application_id=job_application_id,
                job_role=job_application_role,
                job_description=job_application_description,
                company=job_application_company,
                original_resume_snapshot=original_resume_snapshot,
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

            # Ensure all pending operations complete before closing
            await asyncio.sleep(0.1)

            await conn.close()

    except psycopg.Error as db_error:
        logger.error(f"Database error in start_resume_generation_async {str(db_error)}")
        raise db_error
    except Exception as exec_error:
        logger.error(f"Error in start_resume_generation_async {str(exec_error)}")
        raise exec_error
