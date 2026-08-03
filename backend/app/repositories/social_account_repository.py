# app/repositories/social_account_repository.py
"""Workspace-scoped Social Account repository implementation."""

from typing import Optional, Sequence
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.social_account import PlatformType, SocialAccount
from app.repositories.base import BaseRepository
from app.schemas.pagination import PaginationParams
from app.utils.query_builder import QueryBuilder


class SocialAccountRepository(BaseRepository[SocialAccount]):
    """Data access layer for connected Social Accounts."""

    def __init__(self, session: AsyncSession) -> None:
        super().__init__(SocialAccount, session)

    async def get_by_workspace_and_id(
        self, account_id: int, workspace_id: int, include_deleted: bool = False
    ) -> Optional[SocialAccount]:
        """Fetch social account asserting workspace ownership in a single query."""
        builder = QueryBuilder(SocialAccount)
        builder.filter_exact(
            {SocialAccount.id: account_id, SocialAccount.workspace_id: workspace_id}
        )
        builder.apply_soft_delete_filter(include_deleted)

        result = await self.session.execute(builder.build())
        return result.scalars().first()

    async def get_by_external_id(
        self, external_account_id: str, platform: PlatformType
    ) -> Optional[SocialAccount]:
        """Fetch social account by provider's external ID."""
        stmt = select(SocialAccount).where(
            SocialAccount.external_account_id == external_account_id,
            SocialAccount.platform == platform,
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def list_workspace_accounts(
        self,
        workspace_id: int,
        params: PaginationParams,
        platform: Optional[PlatformType] = None,
    ) -> tuple[Sequence[SocialAccount], int]:
        """List connected accounts in target workspace."""
        builder = QueryBuilder(SocialAccount)
        builder.filter_by_owner("workspace_id", workspace_id)
        builder.apply_soft_delete_filter(include_deleted=False)

        if platform:
            builder.filter_exact({SocialAccount.platform: platform})

        builder.search(params.search, search_fields=["account_name", "account_handle"])
        builder.sort(params.sort_by, params.sort_order)

        return await self.list_paginated(
            builder, page=params.page, page_size=params.page_size
        )