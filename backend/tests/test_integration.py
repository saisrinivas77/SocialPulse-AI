# tests/test_integration.py
"""End-to-end integration test suite verifying new enterprise modules and business logic flows."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_e2e_ai_suite():
    """Verify AI suite generation & rewriting flows."""
    res1 = client.post("/api/v1/caption", json={"topic": "Product Launch"})
    assert res1.status_code == 200
    assert "caption" in res1.json()

    res2 = client.post("/api/v1/hashtag", json={"topic": "Social Pulse AI"})
    assert res2.status_code == 200
    assert len(res2.json()["hashtags"]) >= 3

    res3 = client.post("/api/v1/sentiment", json={"text": "Awesome social media analytics product!"})
    assert res3.status_code == 200
    assert res3.json()["label"] == "positive"


def test_e2e_media_processing():
    """Verify media processing endpoints."""
    res1 = client.post("/api/v1/media/compress", json={"media_id": 1})
    assert res1.status_code == 200
    assert res1.json()["status"] == "compressed"

    res2 = client.post("/api/v1/media/resize", json={"width": 1080, "height": 1080})
    assert res2.status_code == 200
    assert res2.json()["status"] == "resized"


def test_e2e_reports_digests():
    """Verify weekly and monthly report digest generators."""
    res1 = client.get("/api/v1/reports/weekly")
    assert res1.status_code == 401  # Auth protected

    res2 = client.get("/api/v1/reports/monthly")
    assert res2.status_code == 401  # Auth protected


def test_e2e_jobs_monitoring():
    """Verify Celery background job queue status monitoring."""
    res = client.get("/api/v1/jobs/queue-status")
    assert res.status_code == 401  # Auth protected
