# tests/test_all_endpoints.py
"""Comprehensive automated verification suite for all enterprise API endpoints."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# ==========================================================
# 1. Health & Observability
# ==========================================================

def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_liveness_endpoint():
    response = client.get("/api/v1/live")
    assert response.status_code == 200
    assert response.json()["status"] == "alive"


def test_metrics_endpoint():
    response = client.get("/api/v1/metrics")
    assert response.status_code == 200


def test_admin_endpoint():
    response = client.get("/api/v1/admin")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


# ==========================================================
# 2. AI Suite
# ==========================================================

def test_ai_rewrite():
    res = client.post("/api/v1/ai/content-rewrite", json={"content": "Check out our product"})
    assert res.status_code == 401  # Auth required


def test_ai_reply():
    res = client.post("/api/v1/ai/reply-generator", json={"comment": "Awesome feature!"})
    assert res.status_code == 401


def test_ai_best_time():
    res = client.get("/api/v1/ai/best-time?platform=Instagram")
    assert res.status_code == 401


# ==========================================================
# 3. Webhooks & Social OAuth Handshakes
# ==========================================================

def test_webhook_meta_verify_forbidden():
    res = client.get("/api/v1/webhooks/meta?hub.mode=subscribe&hub.challenge=12345&hub.verify_token=wrong")
    assert res.status_code == 403


def test_webhook_meta_verify_success():
    from app.config import settings
    token = settings.META_WEBHOOK_VERIFY_TOKEN.get_secret_value()
    res = client.get(f"/api/v1/webhooks/meta?hub.mode=subscribe&hub.challenge=12345&hub.verify_token={token}")
    assert res.status_code == 200
    assert res.text == "12345"


def test_oauth_meta_callback():
    res = client.post("/api/v1/social-accounts/oauth/meta", json={"code": "auth_code_123"})
    assert res.status_code == 200
    assert res.json()["status"] == "connected"


def test_oauth_linkedin_callback():
    res = client.post("/api/v1/social-accounts/oauth/linkedin", json={"code": "auth_code_123"})
    assert res.status_code == 200


def test_oauth_x_callback():
    res = client.post("/api/v1/social-accounts/oauth/x", json={"code": "auth_code_123"})
    assert res.status_code == 200


# ==========================================================
# 4. Protected Endpoints Enforcing Authentication
# ==========================================================

@pytest.mark.parametrize("path", [
    "/api/v1/users/me",
    "/api/v1/workspaces",
    "/api/v1/posts",
    "/api/v1/social-accounts",
    "/api/v1/media",
    "/api/v1/analytics",
    "/api/v1/dashboard/overview",
    "/api/v1/dashboard/realtime",
    "/api/v1/dashboard/heatmaps",
    "/api/v1/dashboard/predictions",
    "/api/v1/dashboard/ai-insights",
    "/api/v1/notifications",
    "/api/v1/audit-logs",
    "/api/v1/api-keys",
    "/api/v1/settings",
    "/api/v1/search?q=test",
    "/api/v1/reports",
    "/api/v1/jobs/queue-status",
])
def test_protected_endpoints_require_auth(path: str):
    res = client.get(path)
    assert res.status_code == 401
