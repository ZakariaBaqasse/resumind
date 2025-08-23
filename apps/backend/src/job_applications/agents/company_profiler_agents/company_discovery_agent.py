import asyncio
import operator
import logging
from typing import Dict, Any, Annotated, List, Optional
from datetime import date
from pydantic import BaseModel
from langchain_mistralai import ChatMistralAI
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import START, END, StateGraph
from langgraph.graph.state import CompiledStateGraph
from langgraph.types import Command
from langchain_core.messages import (
    HumanMessage,
    SystemMessage,
    ToolMessage,
    BaseMessage,
)

from src.configs.database_config import get_session_context
from src.job_applications.types import (
    DiscoveredCompanyProfile,
    EventStatus,
    PipelineStep,
)
from src.job_applications.prompts.company_profiler import (
    company_discovery_system_prompt,
)
from src.job_applications.tools import (
    company_discovery_tool,
    tavily_tool,
    CompanyDiscoveryDoneTool,
)
from src.core.constants import MODEL_NAME
from src.core.rate_limit_handlers import RateLimiter, retry_with_backoff
from src.core.service_registry import ServiceRegistry
from src.job_applications.types import ResumeGenerationStatus

logger = logging.getLogger(__name__)


class CompanyDiscoveryAgentState(BaseModel):
    job_application_id: str
    company: str
    job_role: str
    job_description: str
    company_discovery_results: DiscoveredCompanyProfile = None
    iteration: int = 0
    max_iterations: int = 7
    messages: Annotated[List[BaseMessage], operator.add]


class CompanyDiscoveryAgent:
    def __init__(
        self,
        model: Optional[ChatMistralAI] = None,
        debug: bool = False,
        rate_limiter=None,
    ):
        self.model = model or ChatMistralAI(model=MODEL_NAME, max_tokens=8192)
        self.debug = debug
        self.rate_limiter = rate_limiter or RateLimiter(1.0)

    def build_graph(self, checkpointer=InMemorySaver()) -> CompiledStateGraph:
        try:
            builder = StateGraph(CompanyDiscoveryAgentState)
            builder.add_node("plan_research", self.plan_research)
            builder.add_node("call_tool", self.call_tool)
            builder.add_edge(START, "plan_research")
            builder.add_edge("call_tool", "plan_research")
            return builder.compile(checkpointer=checkpointer)
        except Exception as e:
            logger.error(f"Error building company discovery agent graph: {e}")
            raise e

    async def plan_research(self, state: CompanyDiscoveryAgentState):
        try:
            if state.iteration >= state.max_iterations:
                return Command(
                    goto=END,
                    update={
                        "company_discovery_results": state.company_discovery_results
                    },
                )
            state.iteration += 1
            model_with_tools = self.model.bind_tools(
                [tavily_tool, CompanyDiscoveryDoneTool, company_discovery_tool]
            )

            # Prepare messages for invocation without modifying state
            messages_for_invocation = list(state.messages)
            new_messages = []

            if state.iteration == 1:
                with get_session_context() as session:
                    job_application_service = (
                        ServiceRegistry.get_job_application_service(session)
                    )
                    event_service = ServiceRegistry.get_events_service(session)
                    job_application_service.update_job_application_status(
                        state.job_application_id,
                        ResumeGenerationStatus.PROCESSING_COMPANY_PROFILE,
                    )
                    event_service.emit_pipeline_step(
                        job_application_id=state.job_application_id,
                        step=PipelineStep.COMPANY_DISCOVERY,
                        status=EventStatus.STARTED,
                        message="Starting company discovery",
                    )
                initial_messages = [
                    SystemMessage(content=company_discovery_system_prompt),
                    HumanMessage(
                        content=f"""CURRENT DATE: {date.today().isoformat()}
                                    COMPANY: {state.company} 
                                    JOB ROLE: {state.job_role}
                                    JOB DESCRIPTION: {state.job_description}"""
                    ),
                ]
                messages_for_invocation.extend(initial_messages)
                new_messages.extend(initial_messages)
            async with self.rate_limiter:
                response = await retry_with_backoff(
                    lambda: model_with_tools.ainvoke(messages_for_invocation)
                )
            new_messages.append(response)

            if response.tool_calls:
                if response.tool_calls[0]["name"] == "CompanyDiscoveryDoneTool":
                    tool_args = response.tool_calls[0]["args"]

                    final_results = DiscoveredCompanyProfile.model_validate(
                        tool_args["discovery_results"]
                    )
                    with get_session_context() as session:
                        job_application_service = (
                            ServiceRegistry.get_job_application_service(session)
                        )
                        event_service = ServiceRegistry.get_events_service(session)
                        job_application_service.update_company_profile_discovery_results(
                            state.job_application_id, final_results
                        )
                        event_service.emit_pipeline_step(
                            job_application_id=state.job_application_id,
                            step=PipelineStep.COMPANY_DISCOVERY,
                            status=EventStatus.SUCCEEDED,
                            message="Company discovery completed",
                        )
                        event_service.emit_artifact_generated(
                            job_application_id=state.job_application_id,
                            artifact_type="company_profile",
                            summary="Company discovery results stored",
                            step=PipelineStep.COMPANY_DISCOVERY,
                        )
                    return Command(
                        goto=END,
                        update={"company_discovery_results": final_results},
                    )
                else:
                    return Command(
                        goto="call_tool",
                        update={
                            "messages": new_messages,
                            "iteration": state.iteration,
                        },
                    )
            else:
                # If no tool calls, add a message to prompt the model again.
                feedback_message = HumanMessage(
                    content="Please make sure to call the appropriate tools to either conduct the research or complete it"
                )
                new_messages.append(feedback_message)
                return Command(
                    goto="plan_research",
                    update={"messages": new_messages},
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
                    step=PipelineStep.COMPANY_DISCOVERY,
                    status=EventStatus.FAILED,
                    message="Company discovery failed",
                    error={"message": str(e)},
                )
                event_service.emit_pipeline_failed(
                    job_application_id=state.job_application_id,
                    message="Company discovery failed",
                    error={"message": str(e)},
                )
            logger.error(f"Error running the company discovery agent: {str(e)}")
            raise e

    async def call_tool(self, state: CompanyDiscoveryAgentState):
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
                job_application_service = ServiceRegistry.get_job_application_service(
                    session
                )
                event_service = ServiceRegistry.get_events_service(session)
                job_application_service.update_job_application_status(
                    state.job_application_id, ResumeGenerationStatus.FAILED
                )
                event_service.emit_pipeline_step(
                    job_application_id=state.job_application_id,
                    step=PipelineStep.COMPANY_DISCOVERY,
                    status=EventStatus.FAILED,
                    message="Company discovery failed",
                    error={"message": str(e)},
                )
                event_service.emit_pipeline_failed(
                    job_application_id=state.job_application_id,
                    message="Error while executing discovery tools",
                    error={"message": str(e)},
                )
            logger.error(f"Error running the researcher tools: {str(e)}")
            raise e

    async def process_tool_call_safely(
        self, tool_call: Dict[str, Any], job_application_id: str
    ):
        try:
            tools = [tavily_tool, company_discovery_tool]
            tool_to_invoke = next(
                (tool for tool in tools if tool.name == tool_call["name"]), None
            )
            if not tool_to_invoke:
                raise ValueError(f"Tool {tool_call['name']} not found")
            logger.debug(f"Invoking tool {tool_call['name']}")
            with get_session_context() as session:
                event_service = ServiceRegistry.get_events_service(session)
                args = tool_call.get("args", {}) or {}
                friendly_message = "Starting tool execution"
                args_summary = {}

                if tool_to_invoke.name == tavily_tool.name:
                    q = str(args.get("query", ""))[:200]
                    friendly_message = f"Performing a web search for '{q[:80]}'"
                    args_summary = {"query": q}

                elif tool_to_invoke.name == company_discovery_tool.name:
                    company_name = str(args.get("company_name", ""))[:200]
                    friendly_message = f"Discovering company details for {company_name}"
                    args_summary = {"company_name": company_name}

                event_service.emit_tool_execution(
                    job_application_id=job_application_id,
                    tool_name=tool_to_invoke.name,
                    status=EventStatus.STARTED,
                    step=PipelineStep.COMPANY_DISCOVERY,  # or COMPANY_DISCOVERY where relevant
                    message=friendly_message,
                    data={"args_summary": args_summary} if args_summary else None,
                )
            async with self.rate_limiter:
                result = await retry_with_backoff(
                    lambda: tool_to_invoke.ainvoke(input=tool_call["args"])
                )
            with get_session_context() as session:
                event_service = ServiceRegistry.get_events_service(session)
                event_service.emit_tool_execution(
                    job_application_id=job_application_id,
                    tool_name=tool_to_invoke.name,
                    status=EventStatus.SUCCEEDED,
                    step=PipelineStep.COMPANY_DISCOVERY,
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
                    step=PipelineStep.COMPANY_DISCOVERY,
                    message="Tool execution failed",
                    error={"message": str(e)},
                )
            return ToolMessage(
                content=f"Error executing tool {tool_call['name']} please try again",
                tool_call_id=tool_call["id"],
                status="error",
            )
