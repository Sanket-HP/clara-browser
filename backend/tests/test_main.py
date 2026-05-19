"""Basic tests for the Clara backend API."""

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_root(client: AsyncClient):
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Clara AI Browser API"


@pytest.mark.asyncio
async def test_health(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_get_settings(client: AsyncClient):
    response = await client.get("/api/settings/")
    assert response.status_code == 200
    data = response.json()
    assert data["theme"] == "dark"


@pytest.mark.asyncio
async def test_workspace_empty(client: AsyncClient):
    response = await client.get("/api/workspace/")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_browser_status(client: AsyncClient):
    response = await client.get("/api/browser/status")
    assert response.status_code == 200
    assert response.json()["status"] == "ready"
