import logging
import operator
from typing import Optional, Dict, Any, Annotated, List
from datetime import date
from langchain_mistralai import ChatMistralAI
from pydantic import BaseModel
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import START, END, StateGraph
from langgraph.graph.state import CompiledStateGraph
from langchain_core.messages import (
    SystemMessage,
    HumanMessage,
)
from langchain_core.runnables import RunnableConfig
from langgraph.types import Command, Send

from src.configs.database_config import get_session_context
from src.core.constants import MODEL_NAME, STRUCTURED_OUTPUT_MAX_RETRY
from src.core.service_registry import ServiceRegistry
from src.job_applications.types import ResearchPlan, EventStatus, PipelineStep
from src.job_applications.prompts.company_profiler import (
    research_planner_system_prompt,
)
from src.job_applications.agents.company_profiler_agents.research_executor_agent import (
    ResearchExecutor,
)
from src.job_applications.agents.company_profiler_agents.company_discovery_agent import (
    CompanyDiscoveryAgent,
)
from src.job_applications.types import DiscoveredCompanyProfile
from src.core.rate_limit_handlers import RateLimiter, retry_with_backoff
from src.job_applications.types import ResumeGenerationStatus

logger = logging.getLogger(__name__)


def merge_dicts_reducer(
    old: Optional[Dict[str, Any]], new: Optional[Dict[str, Any]]
) -> Dict[str, Any]:
    old = old or {}
    new = new or {}
    combined = dict(old)
    combined.update(new)
    return combined


def last_value_reducer(old, new):
    return new


class CompanyProfilerState(BaseModel):
    job_application_id: Annotated[str, last_value_reducer]
    job_role: Annotated[str, last_value_reducer]
    job_description: str
    company: Annotated[str, last_value_reducer]
    research_plan: Optional[ResearchPlan] = None
    research_results: Annotated[Dict[str, Any], merge_dicts_reducer] = {}
    company_discovery_results: Annotated[
        Optional[DiscoveredCompanyProfile], last_value_reducer
    ] = None
    failed_research_categories: Annotated[List[str], operator.add] = []


class CompanyProfilerAgent:
    def __init__(
        self,
        model: Optional[ChatMistralAI] = None,
        debug: bool = False,
        rate_limiter=None,
    ) -> None:
        self.model = model or ChatMistralAI(model=MODEL_NAME, max_tokens=1024)
        self.debug = debug
        self.rate_limiter = rate_limiter or RateLimiter(1.0)

    def build_graph(self, checkpointer=InMemorySaver()) -> CompiledStateGraph:
        """
        Build the graph for the Company profiler agent.
        """
        try:
            builder = StateGraph(CompanyProfilerState)
            company_discovery_agent = CompanyDiscoveryAgent(
                model=self.model, debug=self.debug, rate_limiter=self.rate_limiter
            )
            company_discovery_graph = company_discovery_agent.build_graph()
            research_executor = ResearchExecutor(
                model=self.model, debug=self.debug, rate_limiter=self.rate_limiter
            )
            research_executor_graph = research_executor.build_graph()
            builder.add_node("company_discovery", company_discovery_graph)
            builder.add_node("research_planner", self.research_planner)
            builder.add_node("research_executor", research_executor_graph)
            builder.add_node("finalize_research", self.finalize_research)
            builder.add_edge(START, "company_discovery")
            builder.add_edge("company_discovery", "research_planner")
            builder.add_edge("research_executor", "finalize_research")
            builder.add_edge("finalize_research", END)
            return builder.compile(checkpointer=checkpointer, debug=self.debug)
        except Exception as e:
            logger.error(
                "Error building the graph for the company profiler", error=str(e)
            )
            raise e

    async def research_planner(
        self, state: CompanyProfilerState, config: RunnableConfig
    ):
        try:
            with get_session_context() as session:
                event_service = ServiceRegistry.get_events_service(session)
                event_service.emit_pipeline_step(
                    job_application_id=state.job_application_id,
                    step=PipelineStep.RESEARCH_PLANNING,
                    status=EventStatus.STARTED,
                    message="Planning research",
                )
            async with self.rate_limiter:
                configured_model = self.model.with_structured_output(
                    ResearchPlan
                ).with_retry(stop_after_attempt=STRUCTURED_OUTPUT_MAX_RETRY)
                response = await retry_with_backoff(
                    lambda: configured_model.ainvoke(
                        [
                            SystemMessage(content=research_planner_system_prompt),
                            HumanMessage(
                                content=f"""
                                Today's date is: {date.today().isoformat()}
                                COMPANY: {state.company} \n\n 
                                JOB ROLE: {state.job_role}\n\n 
                                JOB DESCRIPTION: {state.job_description} \n\n 
                                COMPANY DISCOVERY RESULTS: {state.company_discovery_results}"""
                            ),
                        ]
                    )
                )
            with get_session_context() as session:
                job_application_service = ServiceRegistry.get_job_application_service(
                    session
                )
                job_application_service.update_company_profile_research_plan(
                    state.job_application_id, response
                )
                event_service = ServiceRegistry.get_events_service(session)
                event_service.emit_pipeline_step(
                    job_application_id=state.job_application_id,
                    step=PipelineStep.RESEARCH_PLANNING,
                    status=EventStatus.SUCCEEDED,
                    message="Generated research plan",
                )
                event_service.emit_pipeline_step(
                    job_application_id=state.job_application_id,
                    step=PipelineStep.RESEARCH,
                    status=EventStatus.STARTED,
                    message="Starting research execution",
                )
            logger.debug("RESPONSE FROM RESEARCH_PLANNER: ", response=response)
            sends = [
                Send(
                    "research_executor",
                    {
                        "job_application_id": state.job_application_id,
                        "company": state.company,
                        "job_role": state.job_role,
                        "research_category": category,
                        "company_discovery_results": state.company_discovery_results,
                        "messages": [],
                    },
                )
                for category in response.research_categories
            ]
            return Command(goto=sends, update={"research_plan": response})
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
                    step=PipelineStep.RESEARCH_PLANNING,
                    status=EventStatus.FAILED,
                    message="Research planning failed",
                    error={"message": str(e)},
                )
                event_service.emit_pipeline_failed(
                    job_application_id=state.job_application_id,
                    message="Research planning failed",
                    error={"message": str(e)},
                )
            logger.error(f"Error running the researcher planner: {str(e)}")
            raise e

    def finalize_research(self, state: CompanyProfilerState, config: RunnableConfig):
        try:
            total_categories = (
                len(state.research_plan.research_categories)
                if state.research_plan and state.research_plan.research_categories
                else 0
            )
            failed_categories = len(state.failed_research_categories or [])
            if total_categories > 0 and failed_categories >= total_categories:
                # Halt graph execution and mark step as failed via the except block below
                raise Exception("All research categories have failed.")

            with get_session_context() as session:
                event_service = ServiceRegistry.get_events_service(session)
                job_application_service = ServiceRegistry.get_job_application_service(
                    session
                )
                event_service.emit_pipeline_step(
                    job_application_id=state.job_application_id,
                    step=PipelineStep.RESEARCH,
                    status=EventStatus.SUCCEEDED,
                    message="Research completed",
                )
                job_application_service.update_job_application_status(
                    state.job_application_id,
                    ResumeGenerationStatus.PROCESSING_RESUME_GENERATION,
                )
                event_service.emit_pipeline_step(
                    job_application_id=state.job_application_id,
                    step=PipelineStep.RESUME_GENERATION,
                    status=EventStatus.STARTED,
                    message="Starting the resume generation process",
                )
            return state
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
                    step=PipelineStep.RESEARCH,
                    status=EventStatus.FAILED,
                    message="Research failed",
                    error={"message": str(e)},
                )

                event_service.emit_pipeline_failed(
                    job_application_id=state.job_application_id,
                    message="Finalizing research failed",
                    error={"message": str(e)},
                )
            logger.error(f"Error finalizing the research: {str(e)}")
            raise e
