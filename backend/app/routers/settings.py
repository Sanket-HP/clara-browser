"""Settings router — user preferences and configuration."""

from fastapi import APIRouter

from app.models.schemas import SettingsPayload

router = APIRouter(prefix="/api/settings", tags=["settings"])

_current_settings = SettingsPayload()


@router.get("/", response_model=SettingsPayload)
async def get_settings() -> SettingsPayload:
    """Return the current application settings."""
    return _current_settings


@router.put("/", response_model=SettingsPayload)
async def update_settings(payload: SettingsPayload) -> SettingsPayload:
    """Update application settings."""
    global _current_settings  # noqa: PLW0603
    _current_settings = payload
    return _current_settings
