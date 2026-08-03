# app/services/api_key_service.py
"""API Key Service."""

import uuid
import secrets
from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.api_key_repository import APIKeyRepository
from app.schemas.api_key import APIKeyCreate, APIKeyResponse
from app.utils.security import get_password_hash


class APIKeyService:
    def __init__(self, session: AsyncSession):
        self.repo = APIKeyRepository(session)

    async def generate_api_key(self, user_id: int, payload: APIKeyCreate):
        raw_key = f"sp_{secrets.token_urlsafe(32)}"
        key_prefix = raw_key[:7]
        hashed_key = get_password_hash(raw_key)

        expires_at = None
        if payload.expires_in_days:
            expires_at = datetime.now(timezone.utc) + timedelta(days=payload.expires_in_days)

        record = await self.repo.create(
            user_id=user_id,
            name=payload.name,
            key_prefix=key_prefix,
            hashed_key=hashed_key,
            scopes=payload.scopes,
            expires_at=expires_at,
        )

        response = APIKeyResponse.model_validate(record)
        response.api_key = raw_key
        return response

    async def list_user_keys(self, user_id: int):
        keys = await self.repo.get_by_user(user_id)
        return [APIKeyResponse.model_validate(k) for k in keys]

    async def revoke_key(self, key_id: int, user_id: int):
        key = await self.repo.get_by_id(key_id)
        if key and key.user_id == user_id:
            await self.repo.soft_delete(key)
