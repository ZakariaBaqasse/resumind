import logging
import operator
from datetime import date
from typing import Annotated, Any, Dict, List, Optional

from langchain_core.messages import (
    HumanMessage,
    SystemMessage,
)
from langchain_core.runnables import RunnableConfig
from langchain_mistralai import ChatMistralAI
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.graph.state import CompiledStateGraph
from langgraph.types import Command, Send
from pydantic import BaseModel

from src.configs.database_config import get_session_context
from src.core.constants import MODEL_NAME, STRUCTURED_OUTPUT_MAX_RETRY
from src.core.rate_limit_handlers import RateLimiter, retry_with_backoff
from src.core.service_registry import ServiceRegistry
from src.core.types import Resume
from src.job_applications.prompts.resume_generator import (
    resume_generator_system_prompt,
    resume_evaluator_system_prompt,
)
from src.job_applications.types import (
    EventStatus,
    GeneratedResumeEvaluation,
    PipelineStep,
    ResumeGenerationStatus,
)

logger = logging.getLogger(__name__)


class ResumeGeneratorState(BaseModel):
    job_application_id: str
    original_resume_snapshot: Resume
    job_role: str
    job_description: str
    company: str
    research_results: Dict[str, Any]
    max_evaluations: int = 5
    current_evaluation: int = 0
    generated_resume: Optional[Resume] = None
    evaluation_results: Optional[GeneratedResumeEvaluation] = None
    evaluation_grade_threshold: int = 90


class ResumeGeneratorAgent:
    def __init__(
        self,
        model: Optional[ChatMistralAI] = None,
        debug: bool = False,
        rate_limiter=None,
    ) -> None:
        self.model = model or ChatMistralAI(model=MODEL_NAME, max_tokens=8192)
        self.debug = debug
        self.rate_limiter = rate_limiter or RateLimiter(1.0)

    def build_graph(self, checkpointer=InMemorySaver()) -> CompiledStateGraph:
        """
        Build the graph for the Resume generator agent.
        """
        try:
            builder = StateGraph(ResumeGeneratorState)

            builder.add_node("generator", self.generator)
            builder.add_node("evaluator", self.evaluator)
            builder.add_node("finalize_generation", self.finalize_generation)
            builder.add_edge(START, "generator")
            builder.add_edge("finalize_generation", END)
            return builder.compile(checkpointer=checkpointer, debug=self.debug)
        except Exception as e:
            logger.error(
                "Error building the graph for the resume generator", error=str(e)
            )
            raise e

    async def generator(self, state: ResumeGeneratorState, config: RunnableConfig):
        try:
            with get_session_context() as session:
                events_service = ServiceRegistry.get_events_service(session)
                events_service.emit_pipeline_step(
                    job_application_id=state.job_application_id,
                    step=PipelineStep.RESUME_DRAFTING,
                    status=EventStatus.STARTED,
                    message="Drafting an enhanced version of the resume",
                    data={
                        "iteration": state.current_evaluation,
                        "max_iterations": state.max_evaluations,
                    },
                )

            messages = [SystemMessage(content=resume_generator_system_prompt)]
            if not state.evaluation_results and state.current_evaluation == 0:
                messages.append(
                    HumanMessage(
                        content=f"""ROLE: {state.job_role} \n\n 
                        CURRENT DATE: {date.today().isoformat()}
                        JOB DESCRIPTION:{state.job_description} \n\n 
                        ORIGINAL RESUME: {state.original_resume_snapshot} \n\n 
                        COMPANY RESEARCH RESULTS: {state.research_results}"""
                    ),
                )
            else:
                messages.append(
                    HumanMessage(
                        content=f"""TODO: fix the REQUESTED CHANGES in the PREVIOUS GENERATED VERSION of the resume
                                    ROLE: {state.job_role} \n\n
                                    JOB DESCRIPTION: {state.job_description}
                                    ORIGINAL RESUME:{state.original_resume_snapshot}
                                    PREVIOUS GENERATED VERSION: {state.generated_resume}
                                    REQUESTED CHANGES: {state.evaluation_results}
                                    COMPANY RESEARCH RESULTS: {state.research_results}
                                    """
                    )
                )
            async with self.rate_limiter:
                configured_model = self.model.with_structured_output(Resume).with_retry(
                    stop_after_attempt=STRUCTURED_OUTPUT_MAX_RETRY
                )
                response = await retry_with_backoff(
                    lambda: configured_model.ainvoke(messages)
                )
            with get_session_context() as session:
                event_service = ServiceRegistry.get_events_service(session)
                event_service.emit_pipeline_step(
                    job_application_id=state.job_application_id,
                    step=PipelineStep.RESUME_DRAFTING,
                    status=EventStatus.SUCCEEDED,
                    message=f"Generated an enhanced version of the resume",
                    data={
                        "iteration": state.current_evaluation,
                        "max_iterations": state.max_evaluations,
                    },
                )

            logger.debug("RESPONSE FROM RESUME GENERATOR: ", response=response)
            return Command(goto="evaluator", update={"generated_resume": response})
        except Exception as e:
            with get_session_context() as session:
                job_application_service = ServiceRegistry.get_job_application_service(
                    session
                )
                event_service = ServiceRegistry.get_events_service(session)
                job_application_service.update_job_application_status(
                    state.job_application_id, ResumeGenerationStatus.FAILED
                )
                event_service.emit_pipeline_step(
                    job_application_id=state.job_application_id,
                    step=PipelineStep.RESUME_GENERATION,
                    status=EventStatus.FAILED,
                    message="Resume generation failed",
                    error={"message": str(e)},
                )
                event_service.emit_pipeline_failed(
                    job_application_id=state.job_application_id,
                    message="Resume generation failed",
                    error={"message": str(e)},
                )
            logger.error(f"Error running the resume generator: {str(e)}")
            raise e

    async def evaluator(self, state: ResumeGeneratorState, config: RunnableConfig):
        try:
            if state.current_evaluation >= state.max_evaluations:
                return Command(goto="finalize_generation")
            with get_session_context() as session:
                events_service = ServiceRegistry.get_events_service(session)
                events_service.emit_pipeline_step(
                    job_application_id=state.job_application_id,
                    step=PipelineStep.RESUME_EVALUATION,
                    status=EventStatus.STARTED,
                    message="Evaluating the generated version of the resume",
                    data={
                        "iteration": state.current_evaluation,
                        "max_iterations": state.max_evaluations,
                    },
                )

            messages = [SystemMessage(content=resume_evaluator_system_prompt)]
            if not state.evaluation_results and state.current_evaluation == 0:
                messages.append(
                    HumanMessage(
                        content=f"""ROLE: {state.job_role} \n\n 
                        JOB DESCRIPTION:{state.job_description} \n\n 
                        ORIGINAL RESUME: {state.original_resume_snapshot} \n\n 
                        GENERATED RESUME: {state.generated_resume} \n\n
                        COMPANY RESEARCH RESULTS: {state.research_results} \n\n
                        """
                    ),
                )
            else:
                messages.append(
                    HumanMessage(
                        content=f"""TODO: This is the {state.current_evaluation}th iteration. Re-evaluate the GENERATED RESUME.
                                    CURRENT DATE: {date.today().isoformat()}
                                    ROLE: {state.job_role} \n\n
                                    JOB DESCRIPTION: {state.job_description}
                                    ORIGINAL RESUME:{state.original_resume_snapshot}
                                    GENERATED VERSION: {state.generated_resume}
                                    PREVIOUS EVALUATION: {state.evaluation_results}
                                    COMPANY RESEARCH RESULTS: {state.research_results}
                                    """
                    )
                )
            async with self.rate_limiter:
                configured_model = self.model.with_structured_output(
                    GeneratedResumeEvaluation
                ).with_retry(stop_after_attempt=STRUCTURED_OUTPUT_MAX_RETRY)
                response = await retry_with_backoff(
                    lambda: configured_model.ainvoke(messages)
                )
            with get_session_context() as session:
                event_service = ServiceRegistry.get_events_service(session)
                event_service.emit_pipeline_step(
                    job_application_id=state.job_application_id,
                    step=PipelineStep.RESUME_EVALUATION,
                    status=EventStatus.SUCCEEDED,
                    message=f"Suggested improvements to enhance the generated resume",
                    data={
                        "iteration": state.current_evaluation,
                        "evaluation_summary": response.summary,
                        "evaluation_grade": response.grade,
                        "max_iterations": state.max_evaluations,
                    },
                )
            if response.grade < state.evaluation_grade_threshold:
                return Command(
                    goto="generator",
                    update={
                        "evaluation_results": response,
                        "current_evaluation": state.current_evaluation + 1,
                    },
                )
            else:
                return Command(goto="finalize_generation")
        except Exception as e:
            with get_session_context() as session:
                job_application_service = ServiceRegistry.get_job_application_service(
                    session
                )
                event_service = ServiceRegistry.get_events_service(session)
                job_application_service.update_job_application_status(
                    state.job_application_id, ResumeGenerationStatus.FAILED
                )
                event_service.emit_pipeline_step(
                    job_application_id=state.job_application_id,
                    step=PipelineStep.RESUME_GENERATION,
                    status=EventStatus.FAILED,
                    message="Resume evaluation failed",
                    error={"message": str(e)},
                )
                event_service.emit_pipeline_failed(
                    job_application_id=state.job_application_id,
                    message="Resume evaluation failed",
                    error={"message": str(e)},
                )
            logger.error(f"Error running the resume evaluator: {str(e)}")
            raise e

    async def finalize_generation(
        self, state: ResumeGeneratorState, config: RunnableConfig
    ):
        try:
            with get_session_context() as session:
                job_application_service = ServiceRegistry.get_job_application_service(
                    session
                )
                events_service = ServiceRegistry.get_events_service(session)
                job_application_service.save_generated_resume(
                    state.job_application_id, state.generated_resume
                )
                events_service.emit_pipeline_step(
                    job_application_id=state.job_application_id,
                    step=PipelineStep.RESUME_GENERATION,
                    status=EventStatus.SUCCEEDED,
                    message="Successfully generated enhanced resume",
                )
                job_application_service.update_job_application_status(
                    state.job_application_id,
                    ResumeGenerationStatus.PROCESSING_COVER_LETTER,
                )
                events_service.emit_pipeline_step(
                    job_application_id=state.job_application_id,
                    step=PipelineStep.COVER_LETTER_GENERATION,
                    status=EventStatus.STARTED,
                    message="Starting the cover letter generation process",
                )

        except Exception as e:
            with get_session_context() as session:
                job_application_service = ServiceRegistry.get_job_application_service(
                    session
                )
                event_service = ServiceRegistry.get_events_service(session)
                job_application_service.update_job_application_status(
                    state.job_application_id, ResumeGenerationStatus.FAILED
                )
                event_service.emit_pipeline_step(
                    job_application_id=state.job_application_id,
                    step=PipelineStep.RESUME_GENERATION,
                    status=EventStatus.FAILED,
                    message="Resume finalization failed",
                    error={"message": str(e)},
                )
                event_service.emit_pipeline_failed(
                    job_application_id=state.job_application_id,
                    message="Resume finalization failed",
                    error={"message": str(e)},
                )
            logger.error(f"Error finalizing resume generation: {str(e)}")
            raise e
