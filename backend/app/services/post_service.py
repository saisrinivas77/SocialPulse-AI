# app/services/post_service.py
"""Post service executing business rules and media binding."""

import logging
from datetime import datetime, timezone

from app.exceptions.custom import NotFoundException, ValidationException
from app.models.post import PostStatus
from app.repositories.media_repository import MediaRepository
from app.repositories.post_repository import PostRepository
from app.schemas.pagination import PaginatedResponse
from app.schemas.post import (
    PostCreate,
    PostQueryParams,
    PostResponse,
    PostScheduleRequest,
    PostUpdate,
)

logger = logging.getLogger(__name__)


class PostService:
    """Business logic for posts within a workspace."""

    def __init__(
        self, post_repository: PostRepository, media_repository: MediaRepository
    ) -> None:
        self.post_repo = post_repository
        self.media_repo = media_repository

    async def create_post(
        self, workspace_id: int, user_id: int, data: PostCreate
    ) -> PostResponse:
        """Validate schedule and attach media assets to post."""
        if data.status == PostStatus.SCHEDULED:
            if not data.scheduled_at:
                raise ValidationException("scheduled_at required for scheduled posts.")
            if data.scheduled_at <= datetime.now(timezone.utc):
                raise ValidationException("Scheduled time must be in the future.")

        media_assets = []
        if data.media_ids:
            media_assets = await self.media_repo.get_by_ids_and_workspace(
                data.media_ids, workspace_id
            )
            if len(media_assets) != len(data.media_ids):
                raise ValidationException("One or more invalid media IDs provided.")

        post = await self.post_repo.create(
            user_id=user_id,
            workspace_id=workspace_id,
            title=data.title,
            content=data.content,
            status=data.status,
            scheduled_at=data.scheduled_at,
            social_account_id=data.social_account_id,
        )

        for asset in media_assets:
            await self.media_repo.update(asset, post_id=post.id)

        if post.status == PostStatus.SCHEDULED and post.scheduled_at:
            try:
                from app.tasks.publishing import publish_scheduled_post_task
                publish_scheduled_post_task.apply_async(
                    args=[str(post.id)], eta=post.scheduled_at
                )
            except Exception as e:
                logger.warning(f"Could not enqueue scheduled post task: {e}")

        updated_post = await self.post_repo.get_by_workspace_and_id(
            post.id, workspace_id
        )
        return PostResponse.model_validate(updated_post)

    async def get_post_by_id(
        self, workspace_id: int, post_id: int
    ) -> PostResponse:
        """Fetch post validating workspace boundary."""
        post = await self.post_repo.get_by_workspace_and_id(
            post_id=post_id, workspace_id=workspace_id
        )
        if not post:
            raise NotFoundException("Post not found in this workspace.")

        return PostResponse.model_validate(post)

    async def update_post(
        self, workspace_id: int, post_id: int, data: PostUpdate
    ) -> PostResponse:
        """Update draft or scheduled post instance."""
        post = await self.post_repo.get_by_workspace_and_id(
            post_id=post_id, workspace_id=workspace_id
        )
        if not post:
            raise NotFoundException("Post not found in this workspace.")

        if post.status == PostStatus.PUBLISHED:
            raise ValidationException("Published posts cannot be modified.")

        update_dict = data.model_dump(exclude={"media_ids"}, exclude_unset=True)

        if data.media_ids is not None:
            media_assets = await self.media_repo.get_by_ids_and_workspace(
                data.media_ids, workspace_id
            )
            for existing in post.media_assets:
                await self.media_repo.update(existing, post_id=None)
            for new_asset in media_assets:
                await self.media_repo.update(new_asset, post_id=post.id)

        updated_post = await self.post_repo.update(post, **update_dict)
        refreshed = await self.post_repo.get_by_workspace_and_id(post_id, workspace_id)
        return PostResponse.model_validate(refreshed)

    async def list_workspace_posts(
        self, workspace_id: int, params: PostQueryParams
    ) -> PaginatedResponse[PostResponse]:
        """List posts in workspace with pagination."""
        items, total = await self.post_repo.get_paginated_posts(
            workspace_id=workspace_id, params=params
        )

        response_items = [PostResponse.model_validate(item) for item in items]
        return PaginatedResponse.create(
            items=response_items,
            total=total,
            page=params.page,
            page_size=params.page_size,
        )

    async def schedule_post(
        self, workspace_id: int, post_id: int, payload: PostScheduleRequest
    ) -> PostResponse:
        """Schedule post publication."""
        if payload.scheduled_at <= datetime.now(timezone.utc):
            raise ValidationException("Scheduled timestamp must be in the future.")

        post = await self.post_repo.get_by_workspace_and_id(
            post_id=post_id, workspace_id=workspace_id
        )
        if not post:
            raise NotFoundException("Post not found in this workspace.")

        if post.status == PostStatus.PUBLISHED:
            raise ValidationException("Cannot schedule an already published post.")

        updated_post = await self.post_repo.update(
            post, status=PostStatus.SCHEDULED, scheduled_at=payload.scheduled_at
        )

        try:
            from app.tasks.publishing import publish_scheduled_post_task
            publish_scheduled_post_task.apply_async(
                args=[str(post_id)], eta=payload.scheduled_at
            )
        except Exception as e:
            logger.warning(f"Could not enqueue scheduled post task: {e}")

        refreshed = await self.post_repo.get_by_workspace_and_id(post_id, workspace_id)
        return PostResponse.model_validate(refreshed)

    async def publish_post(
        self, workspace_id: int, post_id: int
    ) -> PostResponse:
        """Enqueue immediate publication task."""
        post = await self.post_repo.get_by_workspace_and_id(
            post_id=post_id, workspace_id=workspace_id
        )
        if not post:
            raise NotFoundException("Post not found in this workspace.")

        if post.status == PostStatus.PUBLISHED:
            raise ValidationException("Post is already published.")

        try:
            from app.tasks.publishing import publish_scheduled_post_task
            publish_scheduled_post_task.delay(str(post_id))
        except Exception as e:
            logger.warning(f"Could not enqueue publish post task: {e}")

        updated_post = await self.post_repo.update(
            post, status=PostStatus.PUBLISHED, published_at=datetime.now(timezone.utc)
        )
        refreshed = await self.post_repo.get_by_workspace_and_id(post_id, workspace_id)
        return PostResponse.model_validate(refreshed)

    async def delete_post(self, workspace_id: int, post_id: int) -> None:
        """Soft delete post."""
        post = await self.post_repo.get_by_workspace_and_id(
            post_id=post_id, workspace_id=workspace_id
        )
        if not post:
            raise NotFoundException("Post not found in this workspace.")

        await self.post_repo.soft_delete(post)