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


@router.get(
    "/debug/meta",
    status_code=status.HTTP_200_OK,
    summary="Meta / Instagram OAuth diagnostic health endpoint",
)
async def get_meta_oauth_debug(db: AsyncSession = Depends(get_db)) -> Dict[str, Any]:
    """Test environment variables, database connection, redirect URIs, and Graph API connectivity for Meta/Instagram."""
    import os, httpx
    meta_id = os.getenv("META_APP_ID", os.getenv("META_CLIENT_ID", os.getenv("FACEBOOK_CLIENT_ID", ""))).strip()
    meta_secret = os.getenv("META_APP_SECRET", os.getenv("META_CLIENT_SECRET", os.getenv("FACEBOOK_CLIENT_SECRET", ""))).strip()
    backend_url = os.getenv("BACKEND_URL", "http://localhost:8000").strip()
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000").strip()

    db_status = "HEALTHY"
    try:
        from sqlalchemy import text
        await db.execute(text("SELECT 1"))
    except Exception as exc:
        db_status = f"UNHEALTHY: {exc}"

    graph_api_status = "UNKNOWN"
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            res = await client.get("https://graph.facebook.com/v20.0/")
            graph_api_status = f"REACHABLE (HTTP {res.status_code})"
    except Exception as exc:
        graph_api_status = f"UNREACHABLE: {exc}"

    return {
        "provider": "meta",
        "environment_variables": {
            "META_APP_ID": f"{meta_id[:6]}..." if meta_id else "MISSING",
            "META_APP_SECRET": "CONFIGURED" if meta_secret else "MISSING",
            "BACKEND_URL": backend_url,
            "FRONTEND_URL": frontend_url,
        },
        "redirect_uri": f"{backend_url}/api/v1/social-accounts/oauth/meta/callback",
        "database_status": db_status,
        "facebook_graph_api_status": graph_api_status,
        "is_ready_for_oauth": bool(meta_id and meta_secret and db_status == "HEALTHY"),
    }
