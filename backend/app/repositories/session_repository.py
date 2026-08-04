# app/repositories/session_repository.py
"""Repository for UserSession management and device tracking."""

from typing import Sequence
from datetime import datetime
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.session import UserSession
from app.repositories.base import BaseRepository


class SessionRepository(BaseRepository[UserSession]):
    """Repository handling active user sessions and device telemetry."""

    def __init__(self, session: AsyncSession) -> None:
        super().__init__(UserSession, session)
        self.session = session

    async def create_session(
        self,
        user_id: int,
        jti: str,
        ip_address: str | None = None,
        user_agent: str | None = None,
        device_type: str = "desktop",
        os_name: str | None = None,
        browser_name: str | None = None,
        expires_at: datetime | None = None,
    ) -> UserSession:
        user_session = UserSession(
            user_id=user_id,
            refresh_token_jti=jti,
            ip_address=ip_address,
            user_agent=user_agent,
            device_type=device_type,
            os_name=os_name,
            browser_name=browser_name,
            is_active=True,
            expires_at=expires_at,
        )
        self.session.add(user_session)
        await self.session.flush()
        return user_session

    async def get_by_jti(self, jti: str) -> UserSession | None:
        stmt = select(UserSession).where(UserSession.refresh_token_jti == jti)
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()

    async def list_active_user_sessions(self, user_id: int) -> Sequence[UserSession]:
        stmt = (
            select(UserSession)
            .where(UserSession.user_id == user_id, UserSession.is_active == True)
            .order_by(UserSession.last_active.desc())
        )
        res = await self.session.execute(stmt)
        return res.scalars().all()

    async def revoke_session_by_jti(self, jti: str) -> None:
        stmt = (
            update(UserSession)
            .where(UserSession.refresh_token_jti == jti)
            .values(is_active=False)
        )
        await self.session.execute(stmt)
        await self.session.flush()

    async def revoke_all_user_sessions(self, user_id: int) -> None:
        stmt = (
            update(UserSession)
            .where(UserSession.user_id == user_id)
            .values(is_active=False)
        )
        await self.session.execute(stmt)
        await self.session.flush()
