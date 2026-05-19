"""Memory router — vector memory CRUD operations."""

from fastapi import APIRouter

from app.models.schemas import (
    MemoryEntry,
    MemoryQueryRequest,
    MemoryQueryResponse,
    MemoryStoreRequest,
)
from app.services import memory_service

router = APIRouter(prefix="/api/memory", tags=["memory"])


@router.post("/store", response_model=MemoryEntry)
async def store_memory(request: MemoryStoreRequest) -> MemoryEntry:
    """Store a piece of information in the vector memory."""
    return await memory_service.store_memory(
        content=request.content,
        metadata=request.metadata,
        category=request.category,
    )


@router.post("/query", response_model=MemoryQueryResponse)
async def query_memory(request: MemoryQueryRequest) -> MemoryQueryResponse:
    """Query the vector memory for relevant entries."""
    results = await memory_service.query_memory(
        query=request.query,
        top_k=request.top_k,
        category=request.category,
    )
    return MemoryQueryResponse(results=results, query=request.query)


@router.delete("/clear")
async def clear_memory(category: str | None = None) -> dict[str, int | str]:
    """Clear memory entries, optionally filtered by category."""
    count = await memory_service.clear_memory(category=category)
    return {"deleted": count, "category": category or "all"}
