"""Decision Agent — handles general queries and fallback conversations."""

from __future__ import annotations

from app.logger import get_logger
from app.models.enums import AgentRole, TaskStatus
from app.models.schemas import AgentResult
from app.services import ai_service, memory_service

log = get_logger(__name__)


class DecisionAgent:
    """Handles general conversation and decides on appropriate responses."""

    role = AgentRole.DECISION

    async def execute(self, message: str, intent: dict[str, str]) -> AgentResult:
        """Generate a conversational response, augmented with memory context."""
        try:
            context_entries = await memory_service.query_memory(query=message, top_k=3)
            context_block = ""
            if context_entries:
                context_block = (
                    "\n\nRelevant context from memory:\n"
                    + "\n".join(f"- {e.content}" for e in context_entries)
                )

            response = await ai_service.chat_completion(
                messages=[
                    {
                        "role": "user",
                        "content": f"{message}{context_block}",
                    }
                ],
            )

            return AgentResult(
                agent=self.role,
                status=TaskStatus.COMPLETED,
                output=response,
                actions=["Generated AI response"],
            )

        except Exception as exc:
            log.error("decision_failed", error=str(exc))
            return AgentResult(
                agent=self.role,
                status=TaskStatus.FAILED,
                output=f"I encountered an error processing your request: {exc}",
            )
