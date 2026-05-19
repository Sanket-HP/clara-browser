"""Chat router — conversational AI interface."""

from fastapi import APIRouter

from app.agents.orchestrator import Orchestrator
from app.models.schemas import ChatRequest, ChatResponse

router = APIRouter(prefix="/api/chat", tags=["chat"])

orchestrator = Orchestrator()


@router.post("/", response_model=ChatResponse)
async def send_message(request: ChatRequest) -> ChatResponse:
    """Process a user message through the agent orchestrator."""
    return await orchestrator.process(request)


@router.post("/classify")
async def classify_message(request: ChatRequest) -> dict[str, str]:
    """Classify a message's intent without executing actions."""
    from app.services import ai_service

    return await ai_service.classify_intent(request.message)
