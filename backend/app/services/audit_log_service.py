# app/services/audit_log_service.py
"""Audit Log Service."""

from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.audit_log_repository import AuditLogRepository
from app.schemas.audit_log import AuditLogResponse


class AuditLogService:
    def __init__(self, session: AsyncSession):
        self.repo = AuditLogRepository(session)

    async def log_action(
        self, user_id: int | None, action: str, resource: str, ip: str | None = None, user_agent: str | None = None, details: str | None = None
    ):
        log = await self.repo.create(
            user_id=user_id,
            action=action,
            resource=resource,
            ip_address=ip,
            user_agent=user_agent,
            details=details,
        )
        return AuditLogResponse.model_validate(log)

    async def list_logs(self, limit: int = 50):
        logs = await self.repo.list_logs(limit=limit)
        return [AuditLogResponse.model_validate(l) for l in logs]
