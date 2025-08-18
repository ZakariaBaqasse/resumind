import asyncio
import logging
from typing import Annotated, List, Dict, Any, Optional
from datetime import date
from langchain_mistralai import ChatMistralAI
from pydantic import BaseModel
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import START, END, StateGraph
from langgraph.graph.state import CompiledStateGraph
from langchain_core.messages import (
    BaseMessage,
    SystemMessage,
    HumanMessage,
    ToolMessage,
)
import operator
from langgraph.types import Command

from src.core.constants import MODEL_NAME
from src.job_applications.types import (
    ResearchCategory,
    DiscoveredCompanyProfile,
    EventStatus,
    PipelineStep,
)
from src.job_applications.prompts.company_profiler import (
    research_executor_system_prompt,
)
from src.job_applications.tools import (
    tavily_tool,
    scraping_tool,
    ResearchDoneTool,
)
from src.core.rate_limit_handlers import RateLimiter, retry_with_backoff
from src.configs.database_config import get_session_context
from src.core.service_registry import ServiceRegistry
from src.job_applications.types import ResumeGenerationStatus

logger = logging.getLogger(__name__)


class ResearchExecutorState(BaseModel):
    job_application_id: str
    company: str
    job_role: str
    messages: Annotated[List[BaseMessage], operator.add]
    research_category: ResearchCategory
    research_results: Dict[str, Any] = {}
    iteration: int = 0
    max_iterations: int = 7
    company_discovery_results: DiscoveredCompanyProfile


class ResearchExecutor:
    def __init__(
        self,
        model: Optional[ChatMistralAI] = None,
        debug: bool = False,
        rate_limiter=None,
    ) -> None:
        self.model = model or ChatMistralAI(model=MODEL_NAME)
        self.debug = debug
        self.rate_limiter = rate_limiter or RateLimiter(1.0)

    def build_graph(self, checkpointer=InMemorySaver()) -> CompiledStateGraph:
        """
        Build the graph for the Company profiler agent.
        """
        try:
            builder = StateGraph(ResearchExecutorState)
            builder.add_node("research_executor", self.research_executor)
            builder.add_node("run_research_tools", self.run_research_tools)
            builder.add_edge(START, "research_executor")
            builder.add_edge("run_research_tools", "research_executor")
            return builder.compile(checkpointer=checkpointer, debug=self.debug)
        except Exception as e:
            logger.error(
                "Error building the graph for the company profiler", error=str(e)
            )
            raise e

    async def research_executor(self, state: ResearchExecutorState):
        try:
            if state.iteration >= state.max_iterations:
                return Command(
                    goto=END, update={"research_results": state.research_results}
                )
            state.iteration += 1
            model_with_tools = self.model.bind_tools(
                [tavily_tool, ResearchDoneTool, scraping_tool]
            )
            # Prepare messages for invocation without modifying state
            messages_for_invocation = list(state.messages)
            new_messages = []
            if state.iteration == 1:
                with get_session_context() as session:
                    event_service = ServiceRegistry.get_events_service(session)
                    event_service.emit_research_category(
                        job_application_id=state.job_application_id,
                        category_name=state.research_category.category_name,
                        status=EventStatus.STARTED,
                        iteration=1,
                        message="Starting research category",
                    )
                initial_messages = [
                    SystemMessage(content=research_executor_system_prompt),
                    HumanMessage(
                        content=f"""
                        Today's date is: {date.today().isoformat()}
                        COMPANY: {state.company} \n\n 
                        JOB ROLE: {state.job_role}\n\n 
                        SEARCH CATEGORY: {state.research_category}
                        COMPANY DISCOVERY CONTEXT: {state.company_discovery_results}
                       """
                    ),
                ]
                messages_for_invocation.extend(initial_messages)
                new_messages.extend(initial_messages)
            async with self.rate_limiter:
                response = await retry_with_backoff(
                    lambda: model_with_tools.ainvoke(messages_for_invocation)
                )
            new_messages.append(response)
            tool_calls = getattr(response, "tool_calls", None) or getattr(
                response, "additional_kwargs", {}
            ).get("tool_calls", [])
            if tool_calls and len(tool_calls) > 0:
                if tool_calls[0]["name"] == "ResearchDoneTool":
                    final_results = tool_calls[0]["args"]["results"][
                        state.research_category.category_name
                    ]
                    data_payload = None
                    try:
                        if isinstance(final_results, list):
                            data_payload = {"findings_count": len(final_results)}
                        elif isinstance(final_results, dict):
                            data_payload = {"keys_count": len(final_results)}
                    except Exception:
                        data_payload = None
                    with get_session_context() as session:
                        job_application_service = (
                            ServiceRegistry.get_job_application_service(session)
                        )
                        job_application_service.append_company_profile_category_research_results(
                            state.job_application_id,
                            state.research_category.category_name,
                            final_results,
                        )
                        event_service = ServiceRegistry.get_events_service(session)
                        event_service.emit_research_category(
                            job_application_id=state.job_application_id,
                            category_name=state.research_category.category_name,
                            status=EventStatus.SUCCEEDED,
                            iteration=state.iteration,
                            message="Finished research category",
                            data=data_payload,
                        )
                    return Command(
                        goto=END,
                        update={
                            "research_results": {
                                state.research_category.category_name: final_results
                            }
                        },
                    )
                else:
                    return Command(
                        goto="run_research_tools",
                        update={
                            "messages": new_messages,
                            "iteration": state.iteration,
                        },
                    )
            else:
                feedback_message = HumanMessage(
                    content="Please make sure to call the appropriate tools to either conduct the research or complete it"
                )
                new_messages.append(feedback_message)
                return Command(
                    goto="research_executor",
                    update={"messages": new_messages},
                )
        except Exception as e:
            with get_session_context() as session:
                event_service = ServiceRegistry.get_events_service(session)
                event_service.emit_research_category(
                    job_application_id=state.job_application_id,
                    category_name=state.research_category.category_name,
                    status=EventStatus.FAILED,
                    iteration=state.iteration,
                    message=f"Research for {state.research_category.category_name} has failed",
                    error={"message": str(e)},
                )
            logger.error(f"Error running the researcher executor: {str(e)}")
            return Command(
                goto=END,
                update={
                    "failed_research_categories": [
                        state.research_category.category_name
                    ]
                },
            )

    async def run_research_tools(self, state: ResearchExecutorState):
        try:
            tool_responses = await asyncio.gather(
                *[
                    self.process_tool_call_safely(tool_call, state.job_application_id)
                    for tool_call in state.messages[-1].tool_calls
                ]
            )
            # Filter out None responses
            tool_responses = [
                response for response in tool_responses if response is not None
            ]
            return {"messages": tool_responses}
        except Exception as e:
            with get_session_context() as session:
                event_service = ServiceRegistry.get_events_service(session)
                event_service.emit_research_category(
                    job_application_id=state.job_application_id,
                    category_name=state.research_category.category_name,
                    status=EventStatus.FAILED,
                    iteration=state.iteration,
                    message=f"Research for {state.research_category.category_name} has failed",
                    error={"message": str(e)},
                )
            logger.error(f"Error running the researcher tools: {str(e)}")
            raise {"messages": []}

    async def process_tool_call_safely(
        self, tool_call: Dict[str, Any], job_application_id: str
    ):
        try:
            tools = [tavily_tool, scraping_tool]
            tool_to_invoke = next(
                (tool for tool in tools if tool.name == tool_call["name"]), None
            )
            if not tool_to_invoke:
                raise ValueError(f"Tool {tool_call['name']} not found")
            with get_session_context() as session:
                event_service = ServiceRegistry.get_events_service(session)
                args = tool_call.get("args", {}) or {}
                friendly_message = "Starting tool execution"
                args_summary = {}

                if tool_to_invoke.name == tavily_tool.name:
                    q = str(args.get("query", ""))[:200]
                    friendly_message = f"Performing a web search for '{q[:80]}'"
                    args_summary = {"query": q}

                elif tool_to_invoke.name == scraping_tool.name:
                    url = str(args.get("url", ""))[:200]
                    friendly_message = f"Scraping {url}"
                    args_summary = {"url": url}

                event_service.emit_tool_execution(
                    job_application_id=job_application_id,
                    tool_name=tool_to_invoke.name,
                    status=EventStatus.STARTED,
                    step=PipelineStep.RESEARCH,  # or COMPANY_DISCOVERY where relevant
                    message=friendly_message,
                    data={"args_summary": args_summary} if args_summary else None,
                )

            result = None
            if tool_to_invoke.name == scraping_tool.name:
                logger.debug("Invoking tool scraping tool")
                async with self.rate_limiter:
                    result = await retry_with_backoff(
                        lambda: tool_to_invoke.ainvoke(input=tool_call["args"])
                    )
            else:
                logger.debug("Invoking tool other tool")
                result = await retry_with_backoff(
                    lambda: tool_to_invoke.ainvoke(input=tool_call["args"])
                )

            with get_session_context() as session:
                event_service = ServiceRegistry.get_events_service(session)
                event_service.emit_tool_execution(
                    job_application_id=job_application_id,
                    tool_name=tool_to_invoke.name,
                    status=EventStatus.SUCCEEDED,
                    step=PipelineStep.RESEARCH,
                    message="Tool execution completed",
                )
            return ToolMessage(
                content=result, tool_call_id=tool_call["id"], status="success"
            )
        except Exception as e:
            logger.error(f"Error running process tool call {str(e)}")
            with get_session_context() as session:
                event_service = ServiceRegistry.get_events_service(session)
                event_service.emit_tool_execution(
                    job_application_id=job_application_id,
                    tool_name=tool_call.get("name", "unknown"),
                    status=EventStatus.FAILED,
                    step=PipelineStep.RESEARCH,
                    message="Tool execution failed",
                    error={"message": str(e)},
                )
            return ToolMessage(
                content=f"Error executing tool {tool_call['name']} please try again",
                tool_call_id=tool_call["id"],
                status="error",
            )
