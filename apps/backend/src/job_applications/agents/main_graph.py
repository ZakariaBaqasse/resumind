import logging
from typing import Optional, Dict, Any
from langchain_mistralai import ChatMistralAI
from pydantic import BaseModel
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import START, END, StateGraph
from langgraph.graph.state import CompiledStateGraph


from src.core.constants import MODEL_NAME
from src.job_applications.agents.company_profiler_agents.company_profiler import (
    CompanyProfilerAgent,
)

from src.core.types import Resume
from src.core.rate_limit_handlers import RateLimiter
from src.job_applications.agents.drafts_generators.resume_generator import (
    ResumeGeneratorAgent,
)

logger = logging.getLogger(__name__)


class MainGraphState(BaseModel):
    job_application_id: str
    job_role: str
    job_description: str
    company: str
    original_resume_snapshot: Resume
    research_results: Optional[Dict[str, Any]] = {}
    generated_resume: Optional[Resume] = None


class MainGraphAgent:
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
        Build the main orchestrator graph for Resumind.
        """
        try:
            builder = StateGraph(MainGraphState)
            company_profiler = CompanyProfilerAgent(
                rate_limiter=self.rate_limiter, model=self.model, debug=self.debug
            )
            company_profiler_graph = company_profiler.build_graph(
                checkpointer=checkpointer
            )
            resume_generator = ResumeGeneratorAgent(
                model=self.model, debug=self.debug, rate_limiter=self.rate_limiter
            )
            resume_generator_graph = resume_generator.build_graph(
                checkpointer=checkpointer
            )

            builder.add_node("company_profiler", company_profiler_graph)
            builder.add_node("resume_generator", resume_generator_graph)
            builder.add_edge(START, "company_profiler")
            builder.add_edge("company_profiler", "resume_generator")
            builder.add_edge("resume_generator", END)
            return builder.compile(checkpointer=checkpointer, debug=self.debug)
        except Exception as e:
            logger.error("Error building the main graph", error=str(e))
            raise e
