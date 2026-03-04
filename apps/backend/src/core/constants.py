"""Core constants used throughout the application.

This module defines configuration constants including:
- MODEL_NAME: The primary AI model identifier
- GEMINI_MODEL_NAME: The Gemini AI model identifier
- STRUCTURED_OUTPUT_MAX_RETRY: Maximum retry attempts for structured outputs
- BLOCKED_SCRAPING_SITES: List of sites blocked from web scraping
"""

MODEL_NAME = "mistral-medium-2505"
GEMINI_MODEL_NAME = "gemini-2.0-flash-lite"
STRUCTURED_OUTPUT_MAX_RETRY = 5
BLOCKED_SCRAPING_SITES = ["linkedin.com"]
