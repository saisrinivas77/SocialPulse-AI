# app/schemas/audit_log.py
"""Pydantic schemas for Audit Logs."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class AuditLogResponse(BaseModel):
    """Audit log entry DTO."""

    id: int
    user_id: Optional[int] = None
    action: str
    resource: str
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    details: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
