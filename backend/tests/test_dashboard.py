from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_dashboard_route_registered():
    response = client.get("/api/v1/openapi.json")

    assert response.status_code == 200

    paths = response.json()["paths"]

    assert "/api/v1/dashboard/overview" in paths
    assert "/api/v1/dashboard/top-posts" in paths