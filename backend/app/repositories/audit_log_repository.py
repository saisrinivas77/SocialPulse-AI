# app/repositories/audit_log_repository.py
"""Audit Log Repository."""

from typing import Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.audit_log import AuditLog
from app.repositories.base import BaseRepository


class AuditLogRepository(BaseRepository[AuditLog]):
    def __init__(self, session: AsyncSession):
        super().__init__(AuditLog, session)

    async def list_logs(self, limit: int = 50) -> Sequence[AuditLog]:
        stmt = select(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit)
        res = await self.session.execute(stmt)
        return res.scalars().all()
