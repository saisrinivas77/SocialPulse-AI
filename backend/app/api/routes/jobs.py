# app/api/routes/jobs.py
"""Background Jobs & Celery Monitoring router."""

from fastapi import APIRouter, Depends, status
from app.api.dependencies import get_current_user
from app.models.user import User
from app.schemas.job import JobQueueStatusResponse, JobStatusResponse
from app.services.job_service import JobService

router = APIRouter(prefix="/jobs", tags=["Background Jobs & Queue"])


@router.get(
    "/queue-status",
    response_model=JobQueueStatusResponse,
    status_code=status.HTTP_200_OK,
    summary="Get background worker queue metrics",
)
async def get_queue_status(current_user: User = Depends(get_current_user)) -> JobQueueStatusResponse:
    return JobService.get_queue_status()


@router.post(
    "/{job_id}/retry",
    response_model=JobStatusResponse,
    status_code=status.HTTP_200_OK,
    summary="Retry failed background task",
)
async def retry_job(job_id: str, current_user: User = Depends(get_current_user)) -> JobStatusResponse:
    return JobService.retry_job(job_id)
