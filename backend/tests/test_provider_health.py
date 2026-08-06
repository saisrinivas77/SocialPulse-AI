# tests/test_provider_health.py
"""Unit tests verifying Provider Health Diagnostics and Provider Environment Validation Engine."""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.provider_health_service import ProviderHealthService

client = TestClient(app)


def test_provider_health_service_validation():
    """Verify ProviderHealthService returns diagnostic info for supported providers."""
    diag_google = ProviderHealthService.validate_provider_credentials("google")
    assert diag_google["provider"] == "google"
    assert "ready" in diag_google
    assert "redirect_uri" in diag_google

    diag_meta = ProviderHealthService.validate_provider_credentials("instagram")
    assert diag_meta["provider"] == "meta"
    assert "ready" in diag_meta

    diag_unsupported = ProviderHealthService.validate_provider_credentials("unsupported_platform")
    assert diag_unsupported["status"] == "UNSUPPORTED"
    assert diag_unsupported["ready"] is False


def test_provider_health_endpoint():
    """Verify GET /api/v1/health/providers returns status diagnostic object."""
    response = client.get("/api/v1/health/providers")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "providers" in data
    assert "google" in data["providers"]
    assert "github" in data["providers"]
    assert "linkedin" in data["providers"]
    assert "meta" in data["providers"]
    assert "tiktok" in data["providers"]
    assert "pinterest" in data["providers"]
    assert "x" in data["providers"]
