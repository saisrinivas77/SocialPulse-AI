# app/services/cache_service.py
"""High-Performance Redis Cache Layer for Enterprise Database-First Architecture."""

import json
import logging
from typing import Any, Optional

from app.config import settings

logger = logging.getLogger(__name__)


class CacheService:
    """Manages Redis caching with 10-minute TTL for zero-latency dashboard loads."""

    DEFAULT_TTL: int = 600  # 10 Minutes in seconds

    def __init__(self) -> None:
        self._redis_client = None

    def _get_redis(self):
        """Lazy-load Redis client connection."""
        if self._redis_client is None:
            try:
                import redis
                url = getattr(settings, "REDIS_URL", None) or f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}"
                self._redis_client = redis.Redis.from_url(url, decode_responses=True)
            except Exception as exc:
                logger.warning(f"Could not connect to Redis server: {exc}")
                self._redis_client = False
        return self._redis_client if self._redis_client else None

    # ─── KEY SCHEMAS ─────────────────────────────────────────────────────────────
    @staticmethod
    def user_dashboard_key(user_id: int) -> str:
        return f"dashboard:user:{user_id}"

    @staticmethod
    def account_analytics_key(platform: str, account_id: int) -> str:
        return f"analytics:{platform.lower()}:{account_id}"

    @staticmethod
    def user_analytics_key(user_id: int) -> str:
        return f"analytics:user:{user_id}"

    @staticmethod
    def user_reports_key(user_id: int) -> str:
        return f"reports:{user_id}"

    # ─── CORE GET / SET / INVALIDATE ──────────────────────────────────────────────
    async def get(self, key: str) -> Optional[Any]:
        """Fetch cached data from Redis. Returns None on cache miss or error."""
        client = self._get_redis()
        if not client:
            return None
        try:
            val = client.get(key)
            if val:
                return json.loads(val)
        except Exception as exc:
            logger.debug(f"Redis get cache miss for key '{key}': {exc}")
        return None

    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """Store value in Redis with TTL (defaults to 10 minutes)."""
        client = self._get_redis()
        if not client:
            return False
        try:
            expire_seconds = ttl if ttl is not None else self.DEFAULT_TTL
            client.setex(name=key, time=expire_seconds, value=json.dumps(value, default=str))
            return True
        except Exception as exc:
            logger.warning(f"Redis set error for key '{key}': {exc}")
            return False

    async def invalidate_user(self, user_id: int) -> None:
        """Invalidate all cached keys for a user upon background sync completion."""
        client = self._get_redis()
        if not client:
            return
        try:
            keys_to_delete = [
                self.user_dashboard_key(user_id),
                self.user_analytics_key(user_id),
                self.user_reports_key(user_id),
            ]
            client.delete(*keys_to_delete)
        except Exception as exc:
            logger.warning(f"Redis invalidation error for user_id={user_id}: {exc}")

    async def warmup_user_dashboard(self, user_id: int, data: dict) -> None:
        """Warms up dashboard cache immediately after background worker completes sync."""
        key = self.user_dashboard_key(user_id)
        await self.set(key, data, ttl=self.DEFAULT_TTL)


cache_service = CacheService()
