"""Shared enumerations for the Clara agent system."""

from enum import StrEnum


class MessageRole(StrEnum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class AgentRole(StrEnum):
    ORCHESTRATOR = "orchestrator"
    NAVIGATION = "navigation"
    RESEARCH = "research"
    MEMORY = "memory"
    AUTOMATION = "automation"
    DECISION = "decision"


class TaskStatus(StrEnum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
