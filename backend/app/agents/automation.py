"""Automation Agent — executes multi-step browser workflows."""

from __future__ import annotations

from app.logger import get_logger
from app.models.enums import AgentRole, TaskStatus
from app.models.schemas import AgentResult, BrowserAction
from app.services import ai_service, browser_service

log = get_logger(__name__)


class AutomationAgent:
    """Executes complex browser workflows like filling forms, clicking sequences, etc."""

    role = AgentRole.AUTOMATION

    async def execute(self, message: str, intent: dict[str, str]) -> AgentResult:
        """Parse user instruction into browser actions and execute them."""
        actions_taken: list[str] = []

        try:
            plan = await self._plan_actions(message)
            actions_taken.append("Created automation plan")

            browser_actions = self._parse_plan(plan)

            if browser_actions:
                results = await browser_service.execute_actions(browser_actions)
                for i, result in enumerate(results):
                    status = "success" if result.get("success") else "failed"
                    actions_taken.append(
                        f"Step {i + 1} ({browser_actions[i].action}): {status}"
                    )

            return AgentResult(
                agent=self.role,
                status=TaskStatus.COMPLETED,
                output=f"Automation complete. Executed {len(browser_actions)} steps.",
                actions=actions_taken,
            )

        except Exception as exc:
            log.error("automation_failed", error=str(exc))
            return AgentResult(
                agent=self.role,
                status=TaskStatus.FAILED,
                output=f"Automation failed: {exc}",
                actions=actions_taken,
            )

    async def _plan_actions(self, instruction: str) -> str:
        """Use AI to break down the instruction into step-by-step browser actions."""
        return await ai_service.chat_completion(
            messages=[
                {
                    "role": "user",
                    "content": (
                        "Break down this browser task into steps. For each step output one line:\n"
                        "ACTION|SELECTOR_OR_URL|VALUE\n"
                        "Valid actions: navigate, click, type, extract, wait\n\n"
                        f"Task: {instruction}"
                    ),
                }
            ],
            temperature=0.2,
            max_tokens=512,
        )

    def _parse_plan(self, plan: str) -> list[BrowserAction]:
        """Parse the AI-generated plan into BrowserAction objects."""
        actions: list[BrowserAction] = []
        for line in plan.strip().splitlines():
            parts = line.strip().split("|")
            if len(parts) >= 2:
                action_type = parts[0].strip().lower()
                target = parts[1].strip()
                value = parts[2].strip() if len(parts) > 2 else None

                if action_type in ("navigate", "click", "type", "extract", "wait"):
                    actions.append(
                        BrowserAction(
                            action=action_type,
                            selector=target if action_type != "navigate" else None,
                            url=target if action_type == "navigate" else None,
                            value=value,
                        )
                    )
        return actions
