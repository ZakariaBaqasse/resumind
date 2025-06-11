from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.configs.database_config import init_db
import os
from src.user.model import User
from src.auth.router import auth_router
from fastapi.middleware.cors import CORSMiddleware
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def database_lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Template API", version="0.0.1", lifespan=database_lifespan)

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


@app.get("/status")
def status_check() -> dict[str, str]:
    """A basic function to perform a status check on the API."""

    return {"status": "ok", "version": "0.0.1"}
