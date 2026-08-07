# app/api/routes/oauth_health.py
"""Dedicated OAuth Health Diagnostic Endpoint."""

from typing import Any, Dict
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db
from app.services.provider_health_service import ProviderHealthService

router = APIRouter(prefix="/oauth", tags=["OAuth Health"])


@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    summary="Get configuration health status for all 8 supported social network OAuth providers",
)
async def get_oauth_health(db: AsyncSession = Depends(get_db)) -> Dict[str, Any]:
    """Audit and report configuration health status for Google, GitHub, Microsoft, LinkedIn, Meta, TikTok, Pinterest, and X."""
    return await ProviderHealthService.get_all_providers_health(db)
