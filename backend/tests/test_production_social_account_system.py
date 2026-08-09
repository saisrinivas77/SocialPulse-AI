# tests/test_production_social_account_system.py
"""Production unit & integration tests for Social Account connection & real-data dashboard system."""

import pytest
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.database import Base
from app.models.social_account import SocialAccount, PlatformType
from app.repositories.social_account_repository import SocialAccountRepository
from app.utils.crypto import encrypt_token, decrypt_token
from app.utils.security import create_oauth_state_token, decode_oauth_state_token
from app.schemas.social_account import SocialAccountResponse

@pytest.mark.asyncio
async def test_token_encryption_at_rest():
    raw_token = "secret_access_token_12345_xyz"
    encrypted = encrypt_token(raw_token)
    assert encrypted != raw_token
    assert "secret_access_token" not in encrypted
    
    decrypted = decrypt_token(encrypted)
    assert decrypted == raw_token

@pytest.mark.asyncio
async def test_oauth_state_token_security():
    state = create_oauth_state_token(user_id=42, workspace_id=10, provider="instagram")
    decoded = decode_oauth_state_token(state)
    
    assert decoded is not None
    assert str(decoded.get("sub")) == "42"
    assert str(decoded.get("workspace_id")) == "10"
    assert decoded.get("provider") == "instagram"

@pytest.mark.asyncio
async def test_schema_never_exposes_access_tokens():
    account = SocialAccount(
        id=1,
        user_id=1,
        workspace_id=1,
        platform=PlatformType.INSTAGRAM,
        external_account_id="ig_123456",
        account_name="Official Instagram",
        account_handle="@official_ig",
        follower_count=1000,
        reach_count=5000,
        posts_count=20,
        engagement_rate=4.5,
        sync_health=100,
        status="CONNECTED",
        connection_status="CONNECTED",
        sync_status="completed",
        token_status="VALID",
        encrypted_access_token=encrypt_token("super_secret_token"),
        encrypted_refresh_token=encrypt_token("super_secret_refresh"),
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    
    response = SocialAccountResponse.model_validate(account)
    dump = response.model_dump()
    
    assert "encrypted_access_token" not in dump
    assert "encrypted_refresh_token" not in dump
    assert "access_token" not in dump
    assert dump["account_handle"] == "@official_ig"
    assert dump["external_account_id"] == "ig_123456"
    assert dump["follower_count"] == 1000

@pytest.mark.asyncio
async def test_social_account_upsert_duplicate_prevention():
    from unittest.mock import AsyncMock, MagicMock
    from app.repositories.social_account_repository import SocialAccountRepository
    
    mock_session = AsyncMock()
    mock_session.execute = AsyncMock()
    mock_session.commit = AsyncMock()
    mock_session.refresh = AsyncMock()
    mock_session.add = MagicMock()
    
    existing_account = SocialAccount(
        id=42,
        user_id=101,
        workspace_id=202,
        platform=PlatformType.INSTAGRAM,
        external_account_id="ext_ig_999",
        account_name="Creator Account",
        account_handle="@creator_one",
        follower_count=5000,
        reach_count=12000,
        posts_count=45,
        engagement_rate=3.5,
        encrypted_access_token=encrypt_token("token_v1"),
        encrypted_refresh_token=encrypt_token("refresh_v1"),
    )
    
    # Mock scalar result returning existing account for upsert query
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = existing_account
    mock_session.execute.return_value = mock_result
    
    repo = SocialAccountRepository(mock_session)
    
    # Execute upsert call with updated values
    updated_acc = await repo.create_or_update(
        user_id=101,
        workspace_id=202,
        platform_str="INSTAGRAM",
        external_account_id="ext_ig_999",
        username="@creator_one_renamed",
        display_name="Updated Creator Account",
        profile_picture="https://example.com/avatar_new.jpg",
        plain_access_token="token_v2",
        plain_refresh_token="refresh_v2",
        token_expires_at=None,
        follower_count=5500,
        reach_count=15000,
        posts_count=50,
        engagement_rate=4.1,
    )
    
    assert updated_acc.id == 42
    assert updated_acc.account_handle == "@creator_one_renamed"
    assert updated_acc.follower_count == 5500
    assert decrypt_token(updated_acc.encrypted_access_token) == "token_v2"
