import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.auth.router import auth_router
from src.user.router import user_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


app = FastAPI(title="Template API", version="0.0.1")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.environ.get("FRONTEND_URL", "http://localhost:3000")
    ],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(user_router)


@app.get("/status")
def status_check() -> dict[str, str]:
    """A basic function to perform a status check on the API."""

    return {"status": "ok", "version": "0.0.1"}
