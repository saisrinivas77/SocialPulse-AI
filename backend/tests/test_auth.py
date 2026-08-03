from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_openapi_includes_auth_route():
    response = client.get("/api/v1/openapi.json")

    assert response.status_code == 200
    assert "/api/v1/auth/register" in response.json()["paths"]
    assert "/api/v1/auth/login" in response.json()["paths"]