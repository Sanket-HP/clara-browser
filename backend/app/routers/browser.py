"""Browser automation router."""

import uuid

from fastapi import APIRouter

from app.models.schemas import BrowserActionRequest, BrowserActionResponse
from app.services import browser_service

router = APIRouter(prefix="/api/browser", tags=["browser"])


@router.post("/actions", response_model=BrowserActionResponse)
async def execute_browser_actions(request: BrowserActionRequest) -> BrowserActionResponse:
    """Execute a sequence of browser automation actions."""
    session_id = request.session_id or str(uuid.uuid4())
    results = await browser_service.execute_actions(request.actions)

    return BrowserActionResponse(
        success=all(r.get("success", False) for r in results),
        results=results,
        session_id=session_id,
    )


@router.get("/status")
async def browser_status() -> dict[str, str]:
    """Check if the browser automation service is available."""
    return {"status": "ready", "engine": "playwright-chromium"}
