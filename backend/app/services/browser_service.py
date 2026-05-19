"""Playwright-based browser automation service."""

from __future__ import annotations

import asyncio
from typing import Any

from app.logger import get_logger
from app.models.schemas import BrowserAction

log = get_logger(__name__)

_playwright: Any = None
_browser: Any = None


async def _ensure_browser() -> Any:
    """Lazy-initialise Playwright and return a browser instance."""
    global _playwright, _browser  # noqa: PLW0603

    if _browser is not None:
        return _browser

    from playwright.async_api import async_playwright

    _playwright = await async_playwright().start()
    _browser = await _playwright.chromium.launch(headless=True)
    log.info("browser_launched")
    return _browser


async def execute_actions(actions: list[BrowserAction]) -> list[dict[str, str | bool]]:
    """Execute a sequence of browser actions and return results."""
    browser = await _ensure_browser()
    page = await browser.new_page()
    results: list[dict[str, str | bool]] = []

    for action in actions:
        try:
            result = await _run_single_action(page, action)
            results.append({"success": True, "action": action.action, **result})
        except Exception as exc:
            log.error("browser_action_failed", action=action.action, error=str(exc))
            results.append({"success": False, "action": action.action, "error": str(exc)})

    await page.close()
    return results


async def _run_single_action(page: Any, action: BrowserAction) -> dict[str, str]:
    """Execute one browser action on the given page."""
    match action.action:
        case "navigate":
            url = action.url or action.value or ""
            await page.goto(url, wait_until="domcontentloaded")
            log.info("navigated", url=url)
            return {"url": page.url, "title": await page.title()}

        case "click":
            if action.selector:
                await page.click(action.selector)
                log.info("clicked", selector=action.selector)
            return {"clicked": action.selector or ""}

        case "type":
            if action.selector and action.value:
                await page.fill(action.selector, action.value)
                log.info("typed", selector=action.selector)
            return {"typed_into": action.selector or ""}

        case "extract":
            selector = action.selector or "body"
            content = await page.inner_text(selector)
            return {"content": content[:5000]}

        case "screenshot":
            screenshot_bytes = await page.screenshot()
            log.info("screenshot_taken", size=len(screenshot_bytes))
            return {"screenshot_size": str(len(screenshot_bytes))}

        case "wait":
            delay = float(action.value or "1")
            await asyncio.sleep(delay)
            return {"waited": str(delay)}

        case _:
            return {"error": f"Unknown action: {action.action}"}


async def shutdown_browser() -> None:
    """Gracefully close the browser and playwright instances."""
    global _playwright, _browser  # noqa: PLW0603

    if _browser:
        await _browser.close()
        _browser = None
    if _playwright:
        await _playwright.stop()
        _playwright = None
    log.info("browser_shutdown")
