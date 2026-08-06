# app/tasks/celery_app.py
"""Celery worker configuration, Redis broker binding, and scheduled tasks."""

from celery import Celery
from celery.schedules import crontab
from app.config import settings

celery_app = Celery(
    "socialpulse_workers",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
)

celery_app.conf.beat_schedule = {
    "refresh-expiring-oauth-tokens-hourly": {
        "task": "tasks.refresh_expiring_tokens",
        "schedule": crontab(minute=0, hour="*"),
    },
    "sync-connected-social-analytics-periodic": {
        "task": "app.tasks.social_sync.sync_all_social_accounts_task",
        "schedule": crontab(minute="*/30"),  # Every 30 minutes
    },
}