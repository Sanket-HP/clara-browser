"""Structured logging configuration using structlog."""

import logging
import sys

import structlog

from app.config import settings


def setup_logging() -> None:
    """Configure structlog + stdlib logging for the application."""
    log_level = getattr(logging, settings.clara_log_level.upper(), logging.INFO)

    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.dev.ConsoleRenderer()
            if settings.is_dev
            else structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(log_level),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )

    logging.basicConfig(format="%(message)s", stream=sys.stdout, level=log_level)


def get_logger(name: str) -> structlog.stdlib.BoundLogger:
    """Return a named logger instance."""
    return structlog.get_logger(name)  # type: ignore[return-value]
