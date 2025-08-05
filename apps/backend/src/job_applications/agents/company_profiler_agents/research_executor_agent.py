import asyncio
import logging
from typing import Annotated, List, Dict, Any
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
from src.job_applications.types import ResearchCategory, DiscoveredCompanyProfile
from src.job_applications.prompts.company_profiler import (
    research_executor_system_prompt,
)
from src.job_applications.tools import (
    tavily_tool,
    scraping_tool,
    ResearchDoneTool,
)
from src.core.rate_limit_handlers import RateLimiter, retry_with_backoff

logger = logging.getLogger(__name__)


class ResearchExecutorState(BaseModel):
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
        model=ChatMistralAI(model=MODEL_NAME),
        debug: bool = False,
        rate_limiter=None,
    ) -> None:
        self.model = model
        self.debug = debug
        self.rate_limiter = rate_limiter or RateLimiter(1.0)

    def build_graph(self, checkpointer=InMemorySaver()) -> CompiledStateGraph:
        """
        Build the graph for the Company profiler agent.

        Args:
            checkpointer: The checkpointer to use for the graph.

        Returns:
            The compiled graph.
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

            if response.tool_calls:
                if response.tool_calls[0]["name"] == "ResearchDoneTool":
                    final_results = response.tool_calls[0]["args"]["results"][
                        state.research_category.category_name
                    ]
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
            logger.error(f"Error running the researcher executor: {str(e)}")
            raise e

    async def run_research_tools(self, state: ResearchExecutorState):
        try:
            tool_responses = await asyncio.gather(
                *[
                    self.process_tool_call_safely(tool_call)
                    for tool_call in state.messages[-1].tool_calls
                ]
            )
            # Filter out None responses
            tool_responses = [
                response for response in tool_responses if response is not None
            ]
            return {"messages": tool_responses}
        except Exception as e:
            logger.error(f"Error running the researcher tools: {str(e)}")
            raise e

    async def process_tool_call_safely(self, tool_call: Dict[str, Any]):
        try:
            tools = [tavily_tool, scraping_tool]
            tool_to_invoke = next(
                (tool for tool in tools if tool.name == tool_call["name"]), None
            )
            if not tool_to_invoke:
                raise ValueError(f"Tool {tool_call['name']} not found")
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
            return ToolMessage(
                content=result, tool_call_id=tool_call["id"], status="success"
            )
        except Exception as e:
            logger.error(f"Error running process tool call {str(e)}")
            return ToolMessage(
                content=f"Error executing tool {tool_call["name"]} please try again",
                tool_call_id=tool_call["id"],
                status="error",
            )
