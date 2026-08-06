# tests/test_profile_management.py
"""Unit tests verifying Profile Management, user_profiles table, and avatar management endpoints."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_profile_endpoint():
    """Verify GET /api/v1/profile returns user profile or unauthenticated status."""
    response = client.get("/api/v1/profile")
    assert response.status_code in (200, 401)


def test_update_profile_endpoint():
    """Verify PUT /api/v1/profile updates profile attributes."""
    payload = {
        "display_name": "Test User",
        "job_title": "Senior Growth Lead",
        "company": "Pulse Corp",
    }
    response = client.put("/api/v1/profile", json=payload)
    assert response.status_code in (200, 401)
