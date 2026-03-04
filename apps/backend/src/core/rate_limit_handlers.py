"""Rate limiting and retry logic for handling API request throttling.

This module provides:
- RateLimiter: async context manager for enforcing rate limits
- retry_with_backoff: async function for retrying failed requests with exponential backoff
"""

import asyncio
import random
import time
import logging

logger = logging.getLogger(__name__)


class RateLimiter:
    """Async context manager for enforcing rate limits on API requests.

    Attributes:
    ----------
    rate_per_second : float
        The maximum number of requests allowed per second.
    min_interval : float
        The minimum time interval between requests in seconds.
    lock : asyncio.Lock
        Lock to ensure thread-safe access to rate limiting state.
    last_call : float
        Timestamp of the last API request.
    """

    def __init__(self, rate_per_second: float = 1.0):
        """Initialize the RateLimiter with a specified rate.

        Parameters:
        -----------
        rate_per_second : float, optional
            The maximum number of requests allowed per second (default: 1.0).
        """
        self.rate_per_second = rate_per_second
        self.min_interval = 1.0 / rate_per_second
        self.lock = asyncio.Lock()
        self.last_call = 0.0

    async def __aenter__(self):
        """Enter the async context manager and enforce rate limiting."""
        async with self.lock:
            now = time.monotonic()
            elapsed = now - self.last_call
            wait_time = self.min_interval - elapsed
            if wait_time > 0:
                logger.warn(
                    f"EXCEEDED RATE LIMIT OF {self.rate_per_second} per second, waiting before sending request"
                )
                await asyncio.sleep(wait_time)
            self.last_call = time.monotonic()

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Exit the async context manager."""
        pass


async def retry_with_backoff(fn, max_retries=5, base_delay=1.0):
    """Retry a failed async function with exponential backoff on rate limit errors.

    Parameters:
    -----------
    fn : callable
        An async function to retry.
    max_retries : int, optional
        The maximum number of retry attempts (default: 5).
    base_delay : float, optional
        The base delay in seconds for exponential backoff (default: 1.0).

    Returns:
    --------
    Any
        The result of the function call.

    Raises:
    -------
    RuntimeError
        If max retries are exceeded after hitting rate limits.
    Exception
        Any exception that is not a rate limit error.
    """
    for attempt in range(max_retries):
        try:
            return await fn()
        except Exception as e:
            if "429" in str(e) or "rate limit" in str(e).lower():
                delay = base_delay * (2**attempt) + random.uniform(0, 0.5)
                logger.error(
                    "JUST HIT a rate limit error, waiting before retrying again the request"
                )
                await asyncio.sleep(delay)
            else:
                raise e
    raise RuntimeError("Max retries exceeded after hitting rate limits")
