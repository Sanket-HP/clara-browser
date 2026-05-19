"""Pydantic request / response schemas shared across routers."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field

from app.models.enums import AgentRole, MessageRole, TaskStatus

# ── Chat ──────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: MessageRole
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ChatRequest(BaseModel):
    message: str
    conversation_id: str | None = None
    context: dict[str, str] | None = None


class ChatResponse(BaseModel):
    reply: str
    conversation_id: str
    agent_used: AgentRole
    actions_taken: list[str] = Field(default_factory=list)
    task_status: TaskStatus = TaskStatus.COMPLETED


# ── Browser ───────────────────────────────────────────────────────────

class BrowserAction(BaseModel):
    action: str  # navigate, click, type, extract, screenshot
    selector: str | None = None
    value: str | None = None
    url: str | None = None


class BrowserActionRequest(BaseModel):
    actions: list[BrowserAction]
    session_id: str | None = None


class BrowserActionResponse(BaseModel):
    success: bool
    results: list[dict[str, str | bool]]
    session_id: str
    screenshot_url: str | None = None


# ── Memory ────────────────────────────────────────────────────────────

class MemoryEntry(BaseModel):
    id: str
    content: str
    metadata: dict[str, str] = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class MemoryStoreRequest(BaseModel):
    content: str
    metadata: dict[str, str] = Field(default_factory=dict)
    category: str = "general"


class MemoryQueryRequest(BaseModel):
    query: str
    top_k: int = 5
    category: str | None = None


class MemoryQueryResponse(BaseModel):
    results: list[MemoryEntry]
    query: str


# ── Workspace ─────────────────────────────────────────────────────────

class WorkspaceItem(BaseModel):
    id: str
    title: str
    url: str | None = None
    notes: str = ""
    tags: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ── Settings ──────────────────────────────────────────────────────────

class SettingsPayload(BaseModel):
    theme: str = "dark"
    ai_model: str = "gpt-4o"
    search_engine: str = "google"
    voice_enabled: bool = False
    memory_enabled: bool = True
    auto_summarise: bool = True


# ── Agent ─────────────────────────────────────────────────────────────

class AgentResult(BaseModel):
    agent: AgentRole
    status: TaskStatus
    output: str
    actions: list[str] = Field(default_factory=list)
    metadata: dict[str, str] = Field(default_factory=dict)


# ── Health ────────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str = "healthy"
    version: str = "0.1.0"
    environment: str = "development"
