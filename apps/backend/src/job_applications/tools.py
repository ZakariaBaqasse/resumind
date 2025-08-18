import os
from typing import List, Dict
import logging
from pydantic import BaseModel

from langchain_tavily import TavilySearch
from langchain_core.tools import tool
from langchain_community.document_loaders.firecrawl import FireCrawlLoader
from firecrawl import FirecrawlApp
from langchain_mistralai import ChatMistralAI
from langchain_core.messages import SystemMessage, HumanMessage

from src.core.constants import MODEL_NAME
from src.job_applications.prompts.company_profiler import (
    smart_scraper_summarizer_system_prompt,
)
from src.job_applications.types import DiscoveredCompanyProfile

logger = logging.getLogger(__name__)

tavily_api_key = os.environ.get("TAVILY_API_KEY")
tavily_tool = None
if tavily_api_key:
    tavily_tool = TavilySearch(max_results=5, name="tavily_tool")
else:
    logger.warning("TAVILY_API_KEY not found. Tavily search tool will be disabled.")


@tool
async def company_discovery_tool(company_name: str, additional_context: str = ""):
    """
    Multi-stage company discovery that tries different search strategies
    to find the official website and basic company information.
    """
    if not tavily_tool:
        message = "Tavily search is not available because TAVILY_API_KEY is not set."
        logger.error(message)
        return {"error": message}

    search_queries = [
        f'"{company_name}" official website',
        f"{company_name} company site:linkedin.com",
        f"{company_name} {additional_context} company",
        f"{company_name} careers jobs",
        f"{company_name} about us",
    ]

    results = {}
    for query in search_queries:
        try:
            search_results = await tavily_tool.ainvoke(query)
            results[query] = search_results
            # If we find a promising official website, prioritize it
            if any(
                domain in result.get("url", "")
                for result in search_results.get("results")
                for domain in [".com", ".org", ".io", ".ai"]
                if company_name.lower().replace(" ", "") in result.get("url", "")
            ):
                break
        except Exception as e:
            logger.warning(f"Search failed for query '{query}': {e}")
            continue

    return results


@tool
async def scraping_tool(url: str, data_to_extract: List[str]):
    """
    Intelligently scrapes content from a given URL and summarizes it,
    emphasizing specific data points to extract using an LLM.

    Args:
        url (str): The URL of the web page to scrape.
        data_to_extract (List[str]): A list of specific data points or questions
                                     to extract and emphasize in the summary.

    Returns:
        str: A concise summary of the web page content, with the requested
             data points highlighted and extracted.
    """
    try:
        firecrawl_app = FirecrawlApp()
        scrape_result = firecrawl_app.scrape_url(url, formats=["markdown"])
        model = ChatMistralAI(model=MODEL_NAME)
        response = await model.ainvoke(
            [
                SystemMessage(content=smart_scraper_summarizer_system_prompt),
                HumanMessage(
                    content=f"DATA POINTS: {data_to_extract} \n\n\n PAGE CONTENT: \n {scrape_result.markdown}"
                ),
            ]
        )
        return response.content
    except Exception as e:
        message = f"ERROR: failed to scrape content from the provided URL {str(e)}"
        logger.error(message)
        raise Exception(message) from e


class ResearchDoneTool(BaseModel):
    results: Dict[str, str]


class CompanyDiscoveryDoneTool(BaseModel):
    discovery_results: DiscoveredCompanyProfile
