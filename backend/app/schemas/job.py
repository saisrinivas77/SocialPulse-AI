# app/schemas/job.py
"""Pydantic schemas for Celery & Background Jobs monitoring."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class JobStatusResponse(BaseModel):
    """Job status DTO."""

    job_id: str
    name: str
    status: str
    result: Optional[str] = None
    created_at: Optional[datetime] = None


class JobQueueStatusResponse(BaseModel):
    """Queue metric DTO."""

    active_tasks: int
    scheduled_tasks: int
    completed_tasks: int
    failed_tasks: int
