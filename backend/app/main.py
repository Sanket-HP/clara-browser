"""Clara AI Browser — FastAPI application entry point."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.logger import get_logger, setup_logging
from app.middleware.auth import AuthMiddleware
from app.models.schemas import HealthResponse
from app.routers import browser, chat, memory, workspace
from app.routers import settings as settings_router
from app.services.browser_service import shutdown_browser

setup_logging()
log = get_logger(__name__)


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    """Application startup and shutdown lifecycle."""
    log.info("clara_starting", env=settings.clara_env)
    yield
    log.info("clara_shutting_down")
    await shutdown_browser()


app = FastAPI(
    title="Clara AI Browser",
    description="Next-generation AI-powered autonomous browser backend",
    version="0.1.0",
    lifespan=lifespan,
)

# ── Middleware ─────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(AuthMiddleware)

# ── Routers ───────────────────────────────────────────────────────────

app.include_router(chat.router)
app.include_router(browser.router)
app.include_router(memory.router)
app.include_router(workspace.router)
app.include_router(settings_router.router)


# ── Root endpoints ────────────────────────────────────────────────────


@app.get("/", tags=["root"])
async def root() -> dict[str, str]:
    """Root endpoint with API information."""
    return {
        "name": "Clara AI Browser API",
        "version": "0.1.0",
        "docs": "/docs",
    }


@app.get("/health", response_model=HealthResponse, tags=["root"])
async def health_check() -> HealthResponse:
    """Health check endpoint."""
    return HealthResponse(environment=settings.clara_env)
