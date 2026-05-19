"""Workspace router — manage saved items and research collections."""

import uuid
from datetime import datetime

from fastapi import APIRouter, HTTPException

from app.models.schemas import WorkspaceItem

router = APIRouter(prefix="/api/workspace", tags=["workspace"])

_workspace_store: dict[str, WorkspaceItem] = {}


@router.get("/", response_model=list[WorkspaceItem])
async def list_workspace_items() -> list[WorkspaceItem]:
    """Return all workspace items."""
    return list(_workspace_store.values())


@router.post("/", response_model=WorkspaceItem)
async def create_workspace_item(item: WorkspaceItem) -> WorkspaceItem:
    """Create a new workspace item."""
    item.id = str(uuid.uuid4())
    item.created_at = datetime.utcnow()
    _workspace_store[item.id] = item
    return item


@router.get("/{item_id}", response_model=WorkspaceItem)
async def get_workspace_item(item_id: str) -> WorkspaceItem:
    """Retrieve a single workspace item by ID."""
    if item_id not in _workspace_store:
        raise HTTPException(status_code=404, detail="Workspace item not found")
    return _workspace_store[item_id]


@router.delete("/{item_id}")
async def delete_workspace_item(item_id: str) -> dict[str, str]:
    """Delete a workspace item."""
    if item_id not in _workspace_store:
        raise HTTPException(status_code=404, detail="Workspace item not found")
    del _workspace_store[item_id]
    return {"deleted": item_id}
