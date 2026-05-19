"""Memory Agent — stores and retrieves contextual information."""

from __future__ import annotations

from app.logger import get_logger
from app.models.enums import AgentRole, TaskStatus
from app.models.schemas import AgentResult
from app.services import memory_service

log = get_logger(__name__)


class MemoryAgent:
    """Manages persistent memory: store, recall, and contextualise information."""

    role = AgentRole.MEMORY

    async def execute(self, message: str, intent: dict[str, str]) -> AgentResult:
        """Handle memory-related requests (store or recall)."""
        action = intent.get("action", "recall")
        entity = intent.get("entity", message)

        try:
            if action in ("store", "remember", "save"):
                entry = await memory_service.store_memory(
                    content=entity,
                    category="user_note",
                )
                return AgentResult(
                    agent=self.role,
                    status=TaskStatus.COMPLETED,
                    output=f"Got it — I've stored that in memory (id: {entry.id}).",
                    actions=["Stored to memory"],
                )

            results = await memory_service.query_memory(query=entity, top_k=5)
            if results:
                memories = "\n".join(
                    f"- {r.content}" for r in results
                )
                return AgentResult(
                    agent=self.role,
                    status=TaskStatus.COMPLETED,
                    output=f"Here's what I remember:\n{memories}",
                    actions=["Retrieved from memory"],
                )

            return AgentResult(
                agent=self.role,
                status=TaskStatus.COMPLETED,
                output="I don't have any relevant memories for that query.",
                actions=["Memory search returned empty"],
            )

        except Exception as exc:
            log.error("memory_agent_failed", error=str(exc))
            return AgentResult(
                agent=self.role,
                status=TaskStatus.FAILED,
                output=f"Memory operation failed: {exc}",
            )

    async def remember(self, content: str, category: str = "conversation") -> None:
        """Convenience method for the orchestrator to store conversation context."""
        try:
            await memory_service.store_memory(content=content, category=category)
        except Exception as exc:
            log.warning("memory_store_silent_fail", error=str(exc))
