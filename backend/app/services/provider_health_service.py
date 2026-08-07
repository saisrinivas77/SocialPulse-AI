# app/services/provider_health_service.py
"""Centralized Provider Configuration & Health Diagnostics Service for 8 Social Networks.
Validates environment variables, client IDs, secrets, redirect URIs, and DB readiness.
"""

import os
import logging
from typing import Dict, Any, List
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.settings import settings

logger = logging.getLogger(__name__)


class ProviderHealthService:
    """Diagnostic health checker for OAuth social network integrations."""

    @staticmethod
    def get_provider_configs() -> Dict[str, Dict[str, Any]]:
        """Extract and normalize provider configuration settings."""
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        backend_url = os.getenv("BACKEND_URL", "http://localhost:8000")
        api_base = f"{backend_url}/api/v1"

        return {
            "google": {
                "name": "Google / YouTube",
                "client_id": settings.GOOGLE_CLIENT_ID or os.getenv("GOOGLE_CLIENT_ID", ""),
                "client_secret": settings.GOOGLE_CLIENT_SECRET.get_secret_value() if hasattr(settings.GOOGLE_CLIENT_SECRET, "get_secret_value") else os.getenv("GOOGLE_CLIENT_SECRET", ""),
                "redirect_uri": settings.GOOGLE_REDIRECT_URI or f"{api_base}/social-accounts/oauth/google/callback",
                "required_vars": ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
            },
            "github": {
                "name": "GitHub",
                "client_id": settings.GITHUB_CLIENT_ID or os.getenv("GITHUB_CLIENT_ID", ""),
                "client_secret": settings.GITHUB_CLIENT_SECRET.get_secret_value() if hasattr(settings.GITHUB_CLIENT_SECRET, "get_secret_value") else os.getenv("GITHUB_CLIENT_SECRET", ""),
                "redirect_uri": f"{api_base}/social-accounts/oauth/github/callback",
                "required_vars": ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"],
            },
            "microsoft": {
                "name": "Microsoft",
                "client_id": settings.MICROSOFT_CLIENT_ID or os.getenv("MICROSOFT_CLIENT_ID", ""),
                "client_secret": settings.MICROSOFT_CLIENT_SECRET.get_secret_value() if hasattr(settings.MICROSOFT_CLIENT_SECRET, "get_secret_value") else os.getenv("MICROSOFT_CLIENT_SECRET", ""),
                "tenant_id": settings.MICROSOFT_TENANT_ID or os.getenv("MICROSOFT_TENANT_ID", "common"),
                "redirect_uri": f"{api_base}/social-accounts/oauth/microsoft/callback",
                "required_vars": ["MICROSOFT_CLIENT_ID", "MICROSOFT_CLIENT_SECRET"],
            },
            "linkedin": {
                "name": "LinkedIn",
                "client_id": settings.LINKEDIN_CLIENT_ID or os.getenv("LINKEDIN_CLIENT_ID", ""),
                "client_secret": settings.LINKEDIN_CLIENT_SECRET.get_secret_value() if hasattr(settings.LINKEDIN_CLIENT_SECRET, "get_secret_value") else os.getenv("LINKEDIN_CLIENT_SECRET", ""),
                "redirect_uri": f"{api_base}/social-accounts/oauth/linkedin/callback",
                "required_vars": ["LINKEDIN_CLIENT_ID", "LINKEDIN_CLIENT_SECRET"],
            },
            "meta": {
                "name": "Meta (Instagram / Facebook / Threads)",
                "client_id": settings.META_APP_ID or os.getenv("META_CLIENT_ID", os.getenv("META_APP_ID", os.getenv("FACEBOOK_CLIENT_ID", ""))),
                "client_secret": settings.META_APP_SECRET.get_secret_value() if hasattr(settings.META_APP_SECRET, "get_secret_value") else os.getenv("META_CLIENT_SECRET", os.getenv("META_APP_SECRET", os.getenv("FACEBOOK_CLIENT_SECRET", ""))),
                "redirect_uri": f"{api_base}/social-accounts/oauth/meta/callback",
                "required_vars": ["META_APP_ID", "META_APP_SECRET"],
            },
            "tiktok": {
                "name": "TikTok",
                "client_id": settings.TIKTOK_CLIENT_ID or os.getenv("TIKTOK_CLIENT_KEY", os.getenv("TIKTOK_CLIENT_ID", "")),
                "client_secret": settings.TIKTOK_CLIENT_SECRET.get_secret_value() if hasattr(settings.TIKTOK_CLIENT_SECRET, "get_secret_value") else os.getenv("TIKTOK_CLIENT_SECRET", ""),
                "redirect_uri": f"{api_base}/social-accounts/oauth/tiktok/callback",
                "required_vars": ["TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET"],
            },
            "pinterest": {
                "name": "Pinterest",
                "client_id": settings.PINTEREST_CLIENT_ID or os.getenv("PINTEREST_CLIENT_ID", ""),
                "client_secret": settings.PINTEREST_CLIENT_SECRET.get_secret_value() if hasattr(settings.PINTEREST_CLIENT_SECRET, "get_secret_value") else os.getenv("PINTEREST_CLIENT_SECRET", ""),
                "redirect_uri": f"{api_base}/social-accounts/oauth/pinterest/callback",
                "required_vars": ["PINTEREST_CLIENT_ID", "PINTEREST_CLIENT_SECRET"],
            },
            "x": {
                "name": "X (Twitter)",
                "client_id": settings.TWITTER_CLIENT_ID or os.getenv("TWITTER_CLIENT_ID", os.getenv("X_CLIENT_ID", "")),
                "client_secret": settings.TWITTER_CLIENT_SECRET.get_secret_value() if hasattr(settings.TWITTER_CLIENT_SECRET, "get_secret_value") else os.getenv("TWITTER_CLIENT_SECRET", os.getenv("X_CLIENT_SECRET", "")),
                "redirect_uri": f"{api_base}/social-accounts/oauth/x/callback",
                "required_vars": ["TWITTER_CLIENT_ID", "TWITTER_CLIENT_SECRET"],
            },
        }

    @classmethod
    def validate_provider_credentials(cls, provider: str) -> Dict[str, Any]:
        """Validate credentials for a specific provider and return diagnostic results."""
        provider_clean = provider.lower().strip()
        configs = cls.get_provider_configs()

        if provider_clean in ["instagram", "facebook", "threads"]:
            provider_clean = "meta"
        elif provider_clean in ["youtube"]:
            provider_clean = "google"
        elif provider_clean in ["twitter"]:
            provider_clean = "x"

        cfg = configs.get(provider_clean)
        if not cfg:
            return {
                "provider": provider,
                "status": "UNSUPPORTED",
                "ready": False,
                "error": f"Provider '{provider}' is not supported.",
            }

        missing = []
        if not cfg["client_id"]:
            missing.append("Missing Client ID")
        if not cfg["client_secret"]:
            missing.append("Missing Client Secret")

        if missing:
            return {
                "provider": provider_clean,
                "name": cfg["name"],
                "status": "MISSING_CREDENTIALS",
                "ready": False,
                "client_id_configured": bool(cfg["client_id"]),
                "secret_configured": bool(cfg["client_secret"]),
                "redirect_uri": cfg["redirect_uri"],
                "error": ", ".join(missing),
            }

        return {
            "provider": provider_clean,
            "name": cfg["name"],
            "status": "READY",
            "ready": True,
            "client_id_configured": True,
            "secret_configured": True,
            "client_id_preview": f"{cfg['client_id'][:8]}..." if len(cfg["client_id"]) > 8 else cfg["client_id"],
            "redirect_uri": cfg["redirect_uri"],
            "error": None,
        }

    @classmethod
    async def get_all_providers_health(cls, db: AsyncSession) -> Dict[str, Any]:
        """Check health status across all 8 social network providers and DB table readiness."""
        db_status = "HEALTHY"
        db_error = None
        try:
            await db.execute(text("SELECT 1 FROM social_accounts LIMIT 1"))
        except Exception as e:
            db_status = "ERROR"
            db_error = str(e)

        configs = cls.get_provider_configs()
        results = {}

        for p_key, cfg in configs.items():
            diag = cls.validate_provider_credentials(p_key)
            results[p_key] = {
                "name": cfg["name"],
                "status": "READY" if diag["ready"] and db_status == "HEALTHY" else diag["status"],
                "ready": diag["ready"] and db_status == "HEALTHY",
                "client_id_configured": bool(cfg["client_id"]),
                "secret_configured": bool(cfg["client_secret"]),
                "client_id": cfg["client_id"][:12] + "..." if cfg["client_id"] else "Not Configured",
                "redirect_uri": cfg["redirect_uri"],
                "error": diag.get("error"),
            }

        return {
            "status": "ok",
            "database_status": db_status,
            "database_error": db_error,
            "total_providers": len(results),
            "ready_providers": sum(1 for p in results.values() if p["ready"]),
            "providers": results,
        }
