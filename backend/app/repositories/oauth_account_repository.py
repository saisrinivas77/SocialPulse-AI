# app/repositories/oauth_account_repository.py
"""Repository for querying, linking, and managing OAuth login accounts."""

from datetime import datetime
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.oauth_account import OAuthAccount
from app.utils.crypto import encrypt_token, decrypt_token


class OAuthAccountRepository:
    """Async database repository for multi-provider OAuth account persistence."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_provider_and_id(
        self, provider: str, provider_user_id: str
    ) -> Optional[OAuthAccount]:
        """Find connected OAuth account by provider name and provider_user_id."""
        stmt = select(OAuthAccount).where(
            OAuthAccount.provider == provider.lower(),
            OAuthAccount.provider_user_id == str(provider_user_id),
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_user_and_provider(
        self, user_id: int, provider: str
    ) -> Optional[OAuthAccount]:
        """Find OAuth account by user ID and provider name."""
        stmt = select(OAuthAccount).where(
            OAuthAccount.user_id == user_id,
            OAuthAccount.provider == provider.lower(),
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all_by_user_id(self, user_id: int) -> List[OAuthAccount]:
        """Fetch all connected OAuth accounts for a user."""
        stmt = select(OAuthAccount).where(OAuthAccount.user_id == user_id)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def create_or_update(
        self,
        user_id: int,
        provider: str,
        provider_user_id: str,
        provider_email: Optional[str] = None,
        provider_username: Optional[str] = None,
        provider_avatar: Optional[str] = None,
        plain_access_token: Optional[str] = None,
        plain_refresh_token: Optional[str] = None,
        expires_at: Optional[datetime] = None,
        is_primary: bool = False,
    ) -> OAuthAccount:
        """Create a new OAuth provider link or update an existing one for a user."""
        existing = await self.get_by_provider_and_id(provider, provider_user_id)
        if not existing:
            existing = await self.get_by_user_and_provider(user_id, provider)

        encrypted_acc = encrypt_token(plain_access_token) if plain_access_token else None
        encrypted_ref = encrypt_token(plain_refresh_token) if plain_refresh_token else None

        if existing:
            existing.user_id = user_id
            existing.provider_email = provider_email or existing.provider_email
            existing.provider_username = provider_username or existing.provider_username
            if provider_avatar:
                existing.provider_avatar = provider_avatar
            if encrypted_acc:
                existing.encrypted_access_token = encrypted_acc
            if encrypted_ref:
                existing.encrypted_refresh_token = encrypted_ref
            if expires_at:
                existing.expires_at = expires_at
            existing.last_login = datetime.utcnow()
            await self.session.commit()
            await self.session.refresh(existing)
            return existing

        new_account = OAuthAccount(
            user_id=user_id,
            provider=provider.lower(),
            provider_user_id=str(provider_user_id),
            provider_email=provider_email,
            provider_username=provider_username,
            provider_avatar=provider_avatar,
            encrypted_access_token=encrypted_acc,
            encrypted_refresh_token=encrypted_ref,
            expires_at=expires_at,
            connected_at=datetime.utcnow(),
            last_login=datetime.utcnow(),
            is_primary=is_primary,
        )
        self.session.add(new_account)
        await self.session.commit()
        await self.session.refresh(new_account)
        return new_account

    async def unlink_provider(self, user_id: int, provider: str) -> bool:
        """Unlink an OAuth provider from a user account."""
        account = await self.get_by_user_and_provider(user_id, provider)
        if not account:
            return False

        await self.session.delete(account)
        await self.session.commit()
        return True
