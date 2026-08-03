# app/api/routes/health.py
"""Kubernetes health check routes and Prometheus metrics endpoint."""

from fastapi import APIRouter, Depends, Response, status
from prometheus_client import CONTENT_TYPE_LATEST, generate_latest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db

router = APIRouter(tags=["Health & Observability"])


@router.get("/health", status_code=status.HTTP_200_OK, summary="Service health status")
async def health_check() -> dict:
    """General service status probe."""
    return {"status": "ok", "service": "SocialPulse AI Engine"}


@router.get("/live", status_code=status.HTTP_200_OK, summary="Kubernetes liveness probe")
async def liveness_probe() -> dict:
    """Liveness probe verifying process responsiveness."""
    return {"status": "alive"}


@router.get("/ready", status_code=status.HTTP_200_OK, summary="Kubernetes readiness probe")
async def readiness_probe(db: AsyncSession = Depends(get_db)) -> dict:
    """Readiness probe verifying database connectivity."""
    try:
        await db.execute(text("SELECT 1"))
        return {"status": "ready", "database": "connected"}
    except Exception:
        return {"status": "unready", "database": "disconnected"}


@router.get("/metrics", summary="Prometheus application metrics")
async def metrics() -> Response:
    """Scrape Prometheus application performance metrics."""
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)