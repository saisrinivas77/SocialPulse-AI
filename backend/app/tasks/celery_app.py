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
        "task": "tasks.sync_platform_analytics",
        "schedule": crontab(minute="*/15"), # Every 15 minutes
    },
}