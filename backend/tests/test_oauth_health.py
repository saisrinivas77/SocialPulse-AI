# tests/test_oauth_health.py
"""Unit test suite for GET /api/v1/oauth/health diagnostic endpoint."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_oauth_health_endpoint():
    """Verify GET /api/v1/oauth/health returns structured status for all 8 providers."""
    response = client.get("/api/v1/oauth/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "providers" in data
    
    providers = data["providers"]
    expected_keys = ["google", "github", "microsoft", "linkedin", "meta", "tiktok", "pinterest", "x"]
    for key in expected_keys:
        assert key in providers
        p = providers[key]
        assert "name" in p
        assert "status" in p
        assert "redirect_uri" in p
        assert p["status"] in ["READY", "MISSING_CREDENTIALS", "CONFIGURATION ERROR"]
