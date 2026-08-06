# app/repositories/social_account_repository.py
"""Repository for SocialAccount database queries and token encryption management."""

import json
from datetime import datetime
from typing import List, Optional, Dict, Any, Tuple
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.social_account import SocialAccount, PlatformType
from app.schemas.pagination import PaginationParams
from app.utils.crypto import encrypt_token, decrypt_token


class SocialAccountRepository:
    """Async database repository for multi-tenant social account persistence."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_workspace_and_id(
        self, account_id: int, workspace_id: int
    ) -> Optional[SocialAccount]:
        """Fetch account by ID and workspace_id."""
        stmt = select(SocialAccount).where(
            SocialAccount.id == account_id,
            SocialAccount.workspace_id == workspace_id,
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_user(self, user_id: int) -> List[SocialAccount]:
        """Fetch all connected social accounts for a specific user."""
        stmt = select(SocialAccount).where(SocialAccount.user_id == user_id)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def list_workspace_accounts(
        self,
        workspace_id: int,
        params: Optional[PaginationParams] = None,
        platform: Optional[PlatformType] = None,
    ) -> Tuple[List[SocialAccount], int]:
        """Fetch workspace channels with pagination."""
        query = select(SocialAccount).where(SocialAccount.workspace_id == workspace_id)
        if platform:
            query = query.where(SocialAccount.platform == platform)

        count_query = select(func.count()).select_from(query.subquery())
        total_res = await self.session.execute(count_query)
        total = total_res.scalar_one_or_none() or 0

        if params:
            offset = (params.page - 1) * params.page_size
            query = query.offset(offset).limit(params.page_size)

        result = await self.session.execute(query)
        return list(result.scalars().all()), total

    def _resolve_platform_enum(self, platform_str: str) -> PlatformType:
        p = platform_str.upper().strip()
        if p in ["X", "TWITTER"]:
            return PlatformType.TWITTER
        if p in ["META", "FACEBOOK"]:
            return PlatformType.FACEBOOK
        if p in ["GOOGLE", "YOUTUBE"]:
            return PlatformType.YOUTUBE
        try:
            return PlatformType(p)
        except ValueError:
            return PlatformType.INSTAGRAM

    async def get_by_provider_account(
        self, user_id: int, platform: str, external_account_id: str
    ) -> Optional[SocialAccount]:
        """Get existing social account by user, provider platform, and external account ID."""
        platform_enum = self._resolve_platform_enum(platform)

        stmt = select(SocialAccount).where(
            SocialAccount.user_id == user_id,
            SocialAccount.platform == platform_enum,
            SocialAccount.external_account_id == external_account_id,
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def create_or_update(
        self,
        user_id: int,
        workspace_id: int,
        platform_str: str,
        external_account_id: str,
        username: str,
        display_name: str,
        profile_picture: Optional[str],
        plain_access_token: str,
        plain_refresh_token: Optional[str],
        token_expires_at: Optional[datetime],
        follower_count: int = 0,
        reach_count: int = 0,
        posts_count: int = 0,
        engagement_rate: float = 0.0,
        metadata_dict: Optional[Dict[str, Any]] = None,
    ) -> SocialAccount:
        """Upsert connected social account with AES-256 encrypted tokens."""
        platform_enum = self._resolve_platform_enum(platform_str)
        existing = await self.get_by_provider_account(user_id, platform_str, external_account_id)

        encrypted_acc = encrypt_token(plain_access_token)
        encrypted_ref = encrypt_token(plain_refresh_token) if plain_refresh_token else None
        meta_json_str = json.dumps(metadata_dict) if metadata_dict else None

        if existing:
            existing.account_name = display_name
            existing.account_handle = username
            existing.avatar_url = profile_picture
            existing.encrypted_access_token = encrypted_acc
            if encrypted_ref:
                existing.encrypted_refresh_token = encrypted_ref
            existing.token_expires_at = token_expires_at
            existing.follower_count = follower_count
            existing.reach_count = reach_count
            existing.posts_count = posts_count
            existing.engagement_rate = engagement_rate
            existing.status = "CONNECTED"
            existing.last_synced_at = datetime.utcnow()
            if meta_json_str:
                existing.metadata_json = meta_json_str
            await self.session.commit()
            await self.session.refresh(existing)
            return existing

        new_account = SocialAccount(
            user_id=user_id,
            workspace_id=workspace_id,
            platform=platform_enum,
            external_account_id=external_account_id,
            account_name=display_name,
            account_handle=username,
            avatar_url=profile_picture,
            encrypted_access_token=encrypted_acc,
            encrypted_refresh_token=encrypted_ref,
            token_expires_at=token_expires_at,
            follower_count=follower_count,
            reach_count=reach_count,
            posts_count=posts_count,
            engagement_rate=engagement_rate,
            status="CONNECTED",
            last_synced_at=datetime.utcnow(),
            metadata_json=meta_json_str,
        )
        self.session.add(new_account)
        await self.session.commit()
        await self.session.refresh(new_account)
        return new_account

    async def soft_disconnect_account(self, account_id: int, workspace_id: int) -> bool:
        """Disconnect account: delete tokens, mark DISCONNECTED, keep historical analytics."""
        account = await self.get_by_workspace_and_id(account_id, workspace_id)
        if not account:
            return False

        account.encrypted_access_token = ""
        account.encrypted_refresh_token = None
        account.status = "DISCONNECTED"
        await self.session.commit()
        return True

    async def delete_account(self, account_id: int, user_id: int) -> bool:
        """Permanently disconnect and delete connected social account."""
        stmt = select(SocialAccount).where(SocialAccount.id == account_id, SocialAccount.user_id == user_id)
        result = await self.session.execute(stmt)
        account = result.scalar_one_or_none()
        if not account:
            return False

        await self.session.delete(account)
        await self.session.commit()
        return True