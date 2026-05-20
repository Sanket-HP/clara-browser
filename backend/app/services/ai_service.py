"""OpenAI integration service for conversational intelligence."""

from __future__ import annotations

from openai import AsyncOpenAI

from app.config import settings
from app.logger import get_logger
from app.models.enums import MessageRole

log = get_logger(__name__)

_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    global _client  # noqa: PLW0603
    if _client is None:
        _client = AsyncOpenAI(api_key=settings.openai_api_key or "sk-placeholder")
    return _client


SYSTEM_PROMPT = (
    "You are Clara, an advanced AI browser assistant. You help users navigate the web, "
    "research topics, automate browser tasks, and manage information. You are precise, "
    "helpful, and proactive. When users ask you to perform browser actions, output structured "
    "instructions that the agent system can execute. Keep responses concise but thorough."
)


async def chat_completion(
    messages: list[dict[str, str]],
    model: str = "gpt-4o",
    temperature: float = 0.7,
    max_tokens: int = 2048,
) -> str:
    """Send a chat completion request to OpenAI and return the response text."""
    client = _get_client()

    full_messages = [{"role": MessageRole.SYSTEM, "content": SYSTEM_PROMPT}, *messages]

    log.info("openai_request", model=model, message_count=len(full_messages))

    response = await client.chat.completions.create(
        model=model,
        messages=full_messages,  # type: ignore[arg-type]
        temperature=temperature,
        max_tokens=max_tokens,
    )

    content = response.choices[0].message.content or ""
    log.info("openai_response", tokens=response.usage.total_tokens if response.usage else 0)
    return content


async def classify_intent(user_message: str) -> dict[str, str]:
    """Classify the user's intent to route to the correct agent."""
    client = _get_client()

    classification_prompt = (
        "Classify the following user message into exactly one category "
        "and extract the key entity.\n"
        "Categories: navigation, research, automation, memory, general\n"
        "Respond in JSON: {\"category\": \"...\", \"entity\": \"...\", \"action\": \"...\"}\n\n"
        f"User message: {user_message}"
    )

    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": classification_prompt}],
        temperature=0.0,
        max_tokens=256,
    )

    import json

    text = response.choices[0].message.content or "{}"
    text = text.strip().removeprefix("```json").removesuffix("```").strip()

    try:
        return json.loads(text)  # type: ignore[no-any-return]
    except json.JSONDecodeError:
        log.warning("intent_parse_failed", raw=text)
        return {"category": "general", "entity": "", "action": "chat"}
