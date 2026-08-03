"""Background job model used by the automation and workflow engine."""

from __future__ import annotations

from datetime import datetime
from enum import StrEnum
from uuid import uuid4

from sqlalchemy import DateTime, Index, Integer, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class JobStatus(StrEnum):
    """Supported background job states."""

    PENDING = "pending"
    QUEUED = "queued"
    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"
    RETRYING = "retrying"
    CANCELLED = "cancelled"
    PAUSED = "paused"
    DEAD_LETTER = "dead_letter"


class JobType(StrEnum):
    """Supported background job categories."""

    ONE_TIME = "one_time"
    DELAYED = "delayed"
    RECURRING = "recurring"
    SCHEDULED_POST = "scheduled_post"
    ANALYTICS_SYNC = "analytics_sync"
    AI_REPORT = "ai_report"
    NOTIFICATION = "notification"
    WORKFLOW = "workflow"
    CLEANUP = "cleanup"


class BackgroundJob(Base):
    """Persisted background job metadata for queue processing and retries."""

    __tablename__ = "background_jobs"
    __table_args__ = (
        Index("ix_background_jobs_user_status", "user_id", "status"),
        Index("ix_background_jobs_job_type_status", "job_type", "status"),
        Index("ix_background_jobs_next_run_at", "next_run_at"),
        Index("ix_background_jobs_priority_status", "priority", "status"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    uuid: Mapped[str] = mapped_column(
        String(36),
        unique=True,
        nullable=False,
        default=lambda: str(uuid4()),
        index=True,
    )
    user_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
        index=True,
    )
    scheduled_post_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
        index=True,
    )
    workflow_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
        index=True,
    )
    job_type: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default=JobStatus.PENDING.value,
        server_default=JobStatus.PENDING.value,
        index=True,
    )
    queue_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="default",
        server_default="default",
        index=True,
    )
    priority: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=100,
        server_default="100",
        index=True,
    )
    payload: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    result: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    retries: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        server_default="0",
    )
    max_retries: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=3,
        server_default="3",
    )
    retry_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        server_default="0",
    )
    retry_delay_seconds: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=60,
        server_default="60",
    )
    run_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        index=True,
    )
    next_run_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    started_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    last_attempt_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    locked_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    locked_by: Mapped[str | None] = mapped_column(String(120), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
