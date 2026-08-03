# app/repositories/post_repository.py
"""Post-specific repository enforcing workspace multi-tenant boundaries."""

import logging
from typing import Any, Dict, Optional, Sequence

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.post import Post
from app.repositories.base import BaseRepository
from app.schemas.post import PostQueryParams
from app.utils.query_builder import QueryBuilder

logger = logging.getLogger(__name__)


class PostRepository(BaseRepository[Post]):
    """Data access layer for Post resources."""

    def __init__(self, session: AsyncSession) -> None:
        super().__init__(Post, session)

    async def get_by_workspace_and_id(
        self, post_id: Any, workspace_id: Any, include_deleted: bool = False
    ) -> Optional[Post]:
        """Fetch post with media preloaded in a single query."""
        builder = QueryBuilder(Post)
        builder.filter_exact({Post.id: post_id, Post.workspace_id: workspace_id})
        builder.apply_soft_delete_filter(include_deleted)
        builder.stmt = builder.stmt.options(selectinload(Post.media_assets))

        result = await self.session.execute(builder.build())
        return result.scalars().first()

    async def get_paginated_posts(
        self,
        workspace_id: Any,
        params: PostQueryParams,
    ) -> tuple[Sequence[Post], int]:
        """Fetch workspace-scoped posts matching search and date criteria."""
        builder = QueryBuilder(Post)
        builder.filter_by_owner("workspace_id", workspace_id)
        builder.apply_soft_delete_filter(include_deleted=False)
        builder.stmt = builder.stmt.options(selectinload(Post.media_assets))

        exact_filters: Dict[Any, Any] = {}
        if params.status:
            exact_filters[Post.status] = params.status
        if params.social_account_id:
            exact_filters[Post.social_account_id] = params.social_account_id

        builder.filter_exact(exact_filters)
        builder.filter_range(
            Post.created_at, min_val=params.date_from, max_val=params.date_to
        )
        builder.search(params.search, search_fields=["content", "title"])
        builder.sort(params.sort_by, params.sort_order)

        return await self.list_paginated(
            builder, page=params.page, page_size=params.page_size
        )