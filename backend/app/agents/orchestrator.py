"""Central orchestrator that routes tasks to specialised agents."""

from __future__ import annotations

import uuid

from app.agents.automation import AutomationAgent
from app.agents.decision import DecisionAgent
from app.agents.memory_agent import MemoryAgent
from app.agents.navigation import NavigationAgent
from app.agents.research import ResearchAgent
from app.logger import get_logger
from app.models.schemas import AgentResult, ChatRequest, ChatResponse
from app.services import ai_service

log = get_logger(__name__)


class Orchestrator:
    """Coordinates specialised agents based on intent classification."""

    def __init__(self) -> None:
        self.navigation = NavigationAgent()
        self.research = ResearchAgent()
        self.memory = MemoryAgent()
        self.automation = AutomationAgent()
        self.decision = DecisionAgent()

    async def process(self, request: ChatRequest) -> ChatResponse:
        """Classify intent, delegate to the right agent, and return a unified response."""
        conversation_id = request.conversation_id or str(uuid.uuid4())

        intent = await ai_service.classify_intent(request.message)
        category = intent.get("category", "general")
        log.info("intent_classified", category=category, entity=intent.get("entity"))

        result = await self._dispatch(category, request.message, intent)

        await self.memory.remember(
            content=f"User: {request.message}\nClara: {result.output}",
            category="conversation",
        )

        return ChatResponse(
            reply=result.output,
            conversation_id=conversation_id,
            agent_used=result.agent,
            actions_taken=result.actions,
            task_status=result.status,
        )

    async def _dispatch(
        self,
        category: str,
        message: str,
        intent: dict[str, str],
    ) -> AgentResult:
        """Route to the appropriate agent based on classified category."""
        match category:
            case "navigation":
                return await self.navigation.execute(message, intent)
            case "research":
                return await self.research.execute(message, intent)
            case "automation":
                return await self.automation.execute(message, intent)
            case "memory":
                return await self.memory.execute(message, intent)
            case _:
                return await self.decision.execute(message, intent)
