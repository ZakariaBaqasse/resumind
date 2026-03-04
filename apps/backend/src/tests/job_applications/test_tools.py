"""Tests for job application tools.

This module contains unit tests for the scraping_tool functionality,
verifying that it correctly extracts and returns data from web pages.
"""

import asyncio
from src.job_applications.tools import scraping_tool


def test_scraping_tool():
    """Test the scraping_tool with a sample URL and data extraction instructions."""
    inputs = {
        "url": "https://lumenalta.com/careers/culture",
        "data_to_extract": [
            "Company mission statement",
            "Core values and principles",
            "Company culture and work environment",
        ],
    }
    # When a function is expected to run without raising an exception,
    # simply calling it is sufficient. If an exception is raised,
    # the test will fail automatically.
    # The `scraping_tool` is type-hinted to return a `str`.
    # Therefore, we should assert that the result is of the expected type
    # and potentially contains some content.
    result = asyncio.run(scraping_tool.ainvoke(input=inputs))
    assert isinstance(result, str)
    assert len(result) > 0
