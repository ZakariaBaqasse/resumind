import asyncio
import random
import time
import logging

logger = logging.getLogger(__name__)


class RateLimiter:
    def __init__(self, rate_per_second: float = 1.0):
        self.rate_per_second = rate_per_second
        self.min_interval = 1.0 / rate_per_second
        self.lock = asyncio.Lock()
        self.last_call = 0.0

    async def __aenter__(self):
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
        pass


async def retry_with_backoff(fn, max_retries=5, base_delay=1.0):
    for attempt in range(max_retries):
        try:
            return await fn()
        except Exception as e:
            if "429" in str(e) or "rate limit" in str(e).lower():
                delay = base_delay * (2**attempt) + random.uniform(0, 0.5)
                logger.error(
                    f"JUST HIT a rate limit error, waiting before retrying again the request"
                )
                await asyncio.sleep(delay)
            else:
                raise e
    raise RuntimeError("Max retries exceeded after hitting rate limits")
