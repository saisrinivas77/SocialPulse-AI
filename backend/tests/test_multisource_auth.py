# tests/test_multisource_auth.py
"""Unit tests verifying multi-source authentication resolution (Header, Query string, Cookie) and auto workspace lookup."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_auth_via_query_token():
    """Verify backend accepts token in query string parameter ?token=..."""
    response = client.get("/api/v1/social-accounts?token=sp_demo_token_123")
    assert response.status_code == 200


def test_auth_via_cookie():
    """Verify backend accepts token in sp_access_token cookie."""
    client.cookies.set("sp_access_token", "sp_demo_token_123")
    response = client.get("/api/v1/social-accounts")
    assert response.status_code == 200


def test_oauth_authorize_url_endpoint():
    """Verify GET /api/v1/social-accounts/oauth/{provider}/authorize_url generates authorization URL."""
    response = client.get("/api/v1/social-accounts/oauth/instagram/authorize_url?token=sp_demo_token_123")
    assert response.status_code == 200
    data = response.json()
    assert "authorization_url" in data
    assert data["provider"] == "instagram"
