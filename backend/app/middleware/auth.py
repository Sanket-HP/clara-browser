"""Authentication-ready middleware scaffold."""

from __future__ import annotations

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from app.logger import get_logger

log = get_logger(__name__)


class AuthMiddleware(BaseHTTPMiddleware):
    """Placeholder authentication middleware.

    In production, this would validate JWT tokens, API keys, or session cookies.
    Currently passes all requests through for development convenience.
    """

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        auth_header = request.headers.get("Authorization")

        if auth_header:
            log.debug("auth_header_present", path=request.url.path)
            # Future: validate token here
            # token = auth_header.removeprefix("Bearer ").strip()
            # user = await validate_token(token)
            # request.state.user = user

        response = await call_next(request)
        return response
