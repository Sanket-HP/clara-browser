"""ChromaDB vector memory service for persistent context storage."""

from __future__ import annotations

import uuid
from datetime import datetime

import chromadb

from app.config import settings
from app.logger import get_logger
from app.models.schemas import MemoryEntry

log = get_logger(__name__)

_client: chromadb.ClientAPI | None = None
_collection: chromadb.Collection | None = None


def _get_collection() -> chromadb.Collection:
    """Lazy-initialise the ChromaDB client and collection."""
    global _client, _collection  # noqa: PLW0603

    if _collection is not None:
        return _collection

    _client = chromadb.PersistentClient(path=settings.chroma_persist_dir)
    _collection = _client.get_or_create_collection(
        name=settings.chroma_collection_name,
        metadata={"hnsw:space": "cosine"},
    )
    log.info("chroma_initialised", collection=settings.chroma_collection_name)
    return _collection


async def store_memory(
    content: str,
    metadata: dict[str, str] | None = None,
    category: str = "general",
) -> MemoryEntry:
    """Store a piece of information in the vector memory."""
    collection = _get_collection()
    entry_id = str(uuid.uuid4())
    meta = {**(metadata or {}), "category": category, "stored_at": datetime.utcnow().isoformat()}

    collection.add(
        ids=[entry_id],
        documents=[content],
        metadatas=[meta],
    )
    log.info("memory_stored", id=entry_id, category=category)

    return MemoryEntry(id=entry_id, content=content, metadata=meta)


async def query_memory(
    query: str,
    top_k: int = 5,
    category: str | None = None,
) -> list[MemoryEntry]:
    """Query the vector memory for relevant entries."""
    collection = _get_collection()

    where_filter = {"category": category} if category else None
    results = collection.query(
        query_texts=[query],
        n_results=top_k,
        where=where_filter,
    )

    entries: list[MemoryEntry] = []
    if results["ids"] and results["documents"]:
        for idx, doc_id in enumerate(results["ids"][0]):
            entries.append(
                MemoryEntry(
                    id=doc_id,
                    content=results["documents"][0][idx],
                    metadata=results["metadatas"][0][idx] if results["metadatas"] else {},
                )
            )

    log.info("memory_queried", query=query[:80], results=len(entries))
    return entries


async def clear_memory(category: str | None = None) -> int:
    """Delete memory entries, optionally filtered by category."""
    collection = _get_collection()

    if category:
        existing = collection.get(where={"category": category})
        if existing["ids"]:
            collection.delete(ids=existing["ids"])
            return len(existing["ids"])
        return 0

    count = collection.count()
    global _collection  # noqa: PLW0603
    if _client:
        _client.delete_collection(settings.chroma_collection_name)
        _collection = None
    return count
