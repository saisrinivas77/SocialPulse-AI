# tests/conftest.py
"""Pytest setup with strict temporary environment secrets."""

import asyncio
import os
from typing import AsyncGenerator

os.environ["POSTGRES_PASSWORD"] = "postgres"
os.environ["SECRET_KEY"] = "test-secret-key-1234567890-test-secret-key"
os.environ["ENCRYPTION_KEY"] = "c3Ryb25nLWJhc2U2NC1zZWNyZXQta2V5LXRlc3QtMTIzNDU="
os.environ["AWS_ACCESS_KEY_ID"] = "mock_access_key"
os.environ["AWS_SECRET_ACCESS_KEY"] = "mock_secret_key"

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.api.dependencies import get_db
from app.config import settings
from app.database import Base
from app.main import app

engine_test = create_async_engine(
    settings.ASYNC_SQLALCHEMY_DATABASE_URI, echo=False
)
TestingSessionLocal = async_sessionmaker(
    engine_test, class_=AsyncSession, expire_on_commit=False
)


@pytest.fixture(scope="session")
def event_loop():
    """Create session-wide event loop."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session", autouse=True)
async def setup_test_db():
    """Initialize clean database tables."""
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Provide isolated transactional test session."""
    async with TestingSessionLocal() as session:
        yield session


@pytest.fixture
async def async_client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Provide AsyncClient instance."""
    async def _override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
    app.dependency_overrides.clear()