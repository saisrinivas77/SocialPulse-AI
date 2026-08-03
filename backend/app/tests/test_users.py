def test_get_profile(client, auth_headers):
    r = client.get("/api/v1/users/me", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["success"] is True

def test_unauthorized_access(client):
    r = client.get("/api/v1/users/me")
    assert r.status_code == 401
