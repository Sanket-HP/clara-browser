"""Navigation Agent — handles URL navigation and page interactions."""

from __future__ import annotations

from app.logger import get_logger
from app.models.enums import AgentRole, TaskStatus
from app.models.schemas import AgentResult, BrowserAction
from app.services import browser_service

log = get_logger(__name__)


class NavigationAgent:
    """Opens websites, navigates pages, and interacts with web elements."""

    role = AgentRole.NAVIGATION

    async def execute(self, message: str, intent: dict[str, str]) -> AgentResult:
        """Navigate to a URL or interact with the current page."""
        entity = intent.get("entity", "")
        action_type = intent.get("action", "navigate")
        actions_taken: list[str] = []

        try:
            if action_type == "navigate" and entity:
                url = entity if entity.startswith("http") else f"https://{entity}"
                actions = [BrowserAction(action="navigate", url=url)]
                results = await browser_service.execute_actions(actions)
                title = results[0].get("title", "") if results else ""
                actions_taken.append(f"Navigated to {url}")

                return AgentResult(
                    agent=self.role,
                    status=TaskStatus.COMPLETED,
                    output=f"Navigated to {url}. Page title: {title}",
                    actions=actions_taken,
                )

            if action_type == "click" and entity:
                actions = [BrowserAction(action="click", selector=entity)]
                await browser_service.execute_actions(actions)
                actions_taken.append(f"Clicked element: {entity}")

                return AgentResult(
                    agent=self.role,
                    status=TaskStatus.COMPLETED,
                    output=f"Clicked on element matching '{entity}'.",
                    actions=actions_taken,
                )

            return AgentResult(
                agent=self.role,
                status=TaskStatus.COMPLETED,
                output="Ready to navigate. Tell me a URL or describe what you'd like to open.",
                actions=actions_taken,
            )

        except Exception as exc:
            log.error("navigation_failed", error=str(exc))
            return AgentResult(
                agent=self.role,
                status=TaskStatus.FAILED,
                output=f"Navigation failed: {exc}",
                actions=actions_taken,
            )
