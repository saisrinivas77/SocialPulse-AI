# app/api/routes/provider_health.py
"""FastAPI routes for Provider Health Diagnostics and Environment verification."""

from typing import Dict, Any
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.provider_health_service import ProviderHealthService

router = APIRouter(
    prefix="/health",
    tags=["Provider Health & Observability"],
)


@router.get(
    "/providers",
    status_code=status.HTTP_200_OK,
    summary="Get configuration and health diagnostic status for all 8 social network providers",
)
async def get_providers_health_status(
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """Inspect environment variables, credentials, redirect URIs, and database readiness for all providers."""
    return await ProviderHealthService.get_all_providers_health(db)
