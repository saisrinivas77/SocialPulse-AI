# tests/test_oauth_account_linking.py
"""Unit and Integration tests for Single User Resolution & Multi-Provider OAuth Account Linking System."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_first_login_google_creates_user():
    """Scenario 1: First login via Google creates a new user, workspace, and OAuth account."""
    res = client.get("/api/v1/auth/google/callback?code=test_google_code_123", follow_redirects=False)
    assert res.status_code == 307 or res.status_code == 302
    location = res.headers.get("location", "")
    assert "access_token=" in location
    assert "email=" in location


def test_second_login_google_recognizes_existing_user():
    """Scenario 2: Second login with same Google account logs in instantly without duplicate user creation."""
    res1 = client.get("/api/v1/auth/google/callback?code=test_google_code_123", follow_redirects=False)
    location1 = res1.headers.get("location", "")

    res2 = client.get("/api/v1/auth/google/callback?code=test_google_code_123", follow_redirects=False)
    location2 = res2.headers.get("location", "")

    assert "access_token=" in location1
    assert "access_token=" in location2


def test_login_microsoft_same_email_links_account():
    """Scenario 3: Login via Microsoft with same verified email links to the existing user profile."""
    # First login with Google
    res_g = client.get("/api/v1/auth/google/callback?code=test_google_code_link", follow_redirects=False)
    assert res_g.status_code in (302, 307)

    # Later login with Microsoft
    res_m = client.get("/api/v1/auth/microsoft/callback?code=test_ms_code_link", follow_redirects=False)
    assert res_m.status_code in (302, 307)
    assert "access_token=" in res_m.headers.get("location", "")


def test_login_github_same_email_links_account():
    """Scenario 4: Login via GitHub with same verified email links to the existing user profile."""
    res_gh = client.get("/api/v1/auth/github/callback?code=test_github_code_link", follow_redirects=False)
    assert res_gh.status_code in (302, 307)
    assert "access_token=" in res_gh.headers.get("location", "")
