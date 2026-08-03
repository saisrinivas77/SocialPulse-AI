# app/tasks/token_refresh.py
"""Celery Beat automated task refreshing expiring OAuth platform tokens."""

import asyncio
from datetime import datetime, timedelta, timezone
import logging
from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.models.social_account import SocialAccount
from app.tasks.celery_app import celery_app
from app.utils.crypto import decrypt_token, encrypt_token

logger = logging.getLogger(__name__)


async def _refresh_expiring_tokens() -> None:
    """Find and refresh expiring OAuth access tokens."""
    async with AsyncSessionLocal() as session:
        threshold = datetime.now(timezone.utc) + timedelta(days=2)
        stmt = select(SocialAccount).where(
            SocialAccount.token_expires_at <= threshold,
            SocialAccount.is_deleted.is_(False),
        )
        result = await session.execute(stmt)
        accounts = result.scalars().all()

        for account in accounts:
            if account.encrypted_refresh_token:
                decrypt_token(account.encrypted_refresh_token)
                # Simulated provider OAuth refresh exchange
                new_access = f"refreshed_access_{account.id}"
                account.encrypted_access_token = encrypt_token(new_access)
                account.token_expires_at = datetime.now(timezone.utc) + timedelta(days=60)
                session.add(account)

        await session.commit()
        logger.info(f"Refreshed {len(accounts)} expiring OAuth account tokens.")


@celery_app.task(name="tasks.refresh_expiring_tokens")
def refresh_expiring_tokens_task() -> None:
    """Celery Beat periodic task entry point."""
    asyncio.run(_refresh_expiring_tokens())