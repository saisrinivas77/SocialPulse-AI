# app/tasks/social_sync.py
"""Celery worker tasks for background synchronization of connected social accounts.

- Immediate sync on account connection
- Smart sync on user login (if last_synced_at > 15 mins)
- Periodic hourly sync
- Midnight daily snapshot storage
"""

import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Any
from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.models.social_account import SocialAccount
from app.services.sync_engine import run_channel_sync

logger = logging.getLogger(__name__)


async def sync_all_social_accounts_task() -> Dict[str, Any]:
    """Background Celery Beat task executing periodically to refresh connected channels via SyncEngine."""
    logger.info("[BACKGROUND TASK] Executing scheduled social accounts background sync...")
    synced_count = 0

    try:
        async with AsyncSessionLocal() as session:
            stmt = select(SocialAccount).where(SocialAccount.status == "CONNECTED")
            result = await session.execute(stmt)
            accounts = result.scalars().all()

            for account in accounts:
                try:
                    success = await run_channel_sync(session, account)
                    if success:
                        synced_count += 1
                except Exception as sub_err:
                    logger.warning(f"Failed background sync for account ID {account.id}: {sub_err}")

    except Exception as err:
        logger.error(f"Error in background social accounts sync task: {err}")

    return {
        "timestamp": datetime.utcnow().isoformat(),
        "accounts_synced": synced_count,
        "status": "success",
    }


async def sync_user_accounts_on_login_task(user_id: int) -> Dict[str, Any]:
    """Smart background sync triggered on user login if last_synced_at > 15 minutes."""
    logger.info(f"[SMART LOGIN SYNC] Checking accounts for user_id={user_id}...")
    synced_count = 0
    cutoff = datetime.utcnow() - timedelta(minutes=15)

    try:
        async with AsyncSessionLocal() as session:
            stmt = select(SocialAccount).where(
                SocialAccount.user_id == user_id,
                SocialAccount.status == "CONNECTED",
            )
            result = await session.execute(stmt)
            accounts = result.scalars().all()

            for account in accounts:
                if not account.last_synced_at or account.last_synced_at < cutoff:
                    logger.info(f"Triggering background sync for user_id={user_id}, account_id={account.id}")
                    await run_channel_sync(session, account)
                    synced_count += 1

    except Exception as err:
        logger.error(f"Error in login background sync task for user_id={user_id}: {err}")

    return {
        "user_id": user_id,
        "synced_count": synced_count,
        "timestamp": datetime.utcnow().isoformat(),
    }


async def sync_single_account_immediate_task(account_id: int) -> bool:
    """Immediate background sync task triggered instantly upon new account connection."""
    logger.info(f"[IMMEDIATE ACCOUNT CONNECT SYNC] Syncing account_id={account_id}...")
    try:
        async with AsyncSessionLocal() as session:
            stmt = select(SocialAccount).where(SocialAccount.id == account_id)
            result = await session.execute(stmt)
            account = result.scalar_one_or_none()
            if account:
                return await run_channel_sync(session, account)
    except Exception as err:
        logger.error(f"Error in immediate sync task for account_id={account_id}: {err}")
    return False
