# app/api/routes/audit_logs.py
"""Audit Logs API router."""

from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.audit_log import AuditLogResponse
from app.services.audit_log_service import AuditLogService

router = APIRouter(prefix="/audit-logs", tags=["Audit Logs"])


@router.get(
    "",
    response_model=List[AuditLogResponse],
    status_code=status.HTTP_200_OK,
    summary="List audit logs",
)
async def list_audit_logs(
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> List[AuditLogResponse]:
    service = AuditLogService(db)
    return await service.list_logs(limit=limit)


@router.get(
    "/{log_id}",
    response_model=AuditLogResponse,
    status_code=status.HTTP_200_OK,
    summary="Get audit log entry details",
)
async def get_audit_log(
    log_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> AuditLogResponse:
    service = AuditLogService(db)
    log = await service.repo.get_by_id(log_id)
    return AuditLogResponse.model_validate(log)
