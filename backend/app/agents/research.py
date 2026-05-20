"""Research Agent — performs web research, summarisation, and content extraction."""

from __future__ import annotations

from app.logger import get_logger
from app.models.enums import AgentRole, TaskStatus
from app.models.schemas import AgentResult, BrowserAction
from app.services import ai_service, browser_service

log = get_logger(__name__)


class ResearchAgent:
    """Researches topics by searching the web and summarising content."""

    role = AgentRole.RESEARCH

    async def execute(self, message: str, intent: dict[str, str]) -> AgentResult:
        """Research a topic using browser automation and AI summarisation."""
        entity = intent.get("entity", message)
        actions_taken: list[str] = []

        try:
            search_url = f"https://www.google.com/search?q={entity.replace(' ', '+')}"
            nav_actions = [BrowserAction(action="navigate", url=search_url)]
            await browser_service.execute_actions(nav_actions)
            actions_taken.append(f"Searched for: {entity}")

            extract_actions = [BrowserAction(action="extract", selector="body")]
            results = await browser_service.execute_actions(extract_actions)
            raw_content = results[0].get("content", "") if results else ""
            actions_taken.append("Extracted search results")

            summary = await ai_service.chat_completion(
                messages=[
                    {
                        "role": "user",
                        "content": (
                            f"Summarise the following search results about '{entity}'. "
                            f"Provide key findings in a clear, structured format.\n\n"
                            f"{raw_content[:3000]}"
                        ),
                    }
                ],
                max_tokens=1024,
            )
            actions_taken.append("Generated AI summary")

            return AgentResult(
                agent=self.role,
                status=TaskStatus.COMPLETED,
                output=summary,
                actions=actions_taken,
                metadata={"topic": entity},
            )

        except Exception as exc:
            log.error("research_failed", error=str(exc))
            fallback = await ai_service.chat_completion(
                messages=[{"role": "user", "content": f"Tell me about: {entity}"}],
                max_tokens=1024,
            )
            return AgentResult(
                agent=self.role,
                status=TaskStatus.COMPLETED,
                output=fallback,
                actions=[*actions_taken, "Fell back to AI knowledge"],
            )
