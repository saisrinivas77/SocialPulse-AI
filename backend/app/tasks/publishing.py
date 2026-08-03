# app/tasks/publishing.py
"""Celery task executing background publishing with retries and exponential backoff."""

import asyncio
import logging
from typing import Any

from app.database import AsyncSessionLocal
from app.models.post import PostStatus
from app.models.social_account import PlatformType
from app.repositories.post_repository import PostRepository
from app.tasks.celery_app import celery_app
from app.tasks.publishers import SocialPlatformPublisher
from app.utils.crypto import decrypt_token

logger = logging.getLogger(__name__)


async def _execute_publish_job(post_id_val: Any) -> None:
    """Async execution job delivering text/media content to social platform."""
    post_id = int(post_id_val)
    async with AsyncSessionLocal() as session:
        repo = PostRepository(session)
        post = await repo.get_by_id(post_id)
        if not post or post.status == PostStatus.PUBLISHED:
            return

        if not post.social_account:
            post.status = PostStatus.FAILED
            await repo.update(post)
            await session.commit()
            return

        token = decrypt_token(post.social_account.encrypted_access_token)
        media_urls = [asset.url for asset in post.media_assets]

        try:
            if post.social_account.platform == PlatformType.TWITTER:
                await SocialPlatformPublisher.publish_to_twitter(
                    token, post.content, media_urls
                )
            elif post.social_account.platform == PlatformType.LINKEDIN:
                await SocialPlatformPublisher.publish_to_linkedin(
                    token, post.content, media_urls
                )
            elif post.social_account.platform == PlatformType.INSTAGRAM:
                img_url = media_urls[0] if media_urls else "https://via.placeholder.com/1080"
                await SocialPlatformPublisher.publish_to_instagram(
                    token, post.social_account.external_account_id, post.content, img_url
                )
            elif post.social_account.platform == PlatformType.FACEBOOK:
                await SocialPlatformPublisher.publish_to_facebook(
                    token, post.social_account.external_account_id, post.content
                )

            post.status = PostStatus.PUBLISHED
            await repo.update(post)
            await session.commit()
            logger.info(f"Published post {post.id} successfully.")
        except Exception as exc:
            logger.error(f"Failed to publish post {post.id}: {str(exc)}")
            raise exc


@celery_app.task(
    name="tasks.publish_scheduled_post",
    bind=True,
    max_retries=3,
    autoretry_for=(RuntimeError,),
    retry_backoff=True,
    retry_backoff_max=600,
)
def publish_scheduled_post_task(self, post_id: str) -> None:
    """Celery task entry point with automatic exponential backoff retries."""
    asyncio.run(_execute_publish_job(post_id))