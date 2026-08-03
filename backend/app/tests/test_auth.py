def test_register_and_login(client):
    register_payload = {
        "first_name": "Sai",
        "last_name": "Reddy",
        "username": "newuser",
        "email": "new@example.com",
        "password": "password123",
    }

    r = client.post(
        "/api/v1/auth/register",
        json=register_payload,
    )

    assert r.status_code == 201

    body = r.json()

    assert body["email"] == register_payload["email"]
    assert body["username"] == register_payload["username"]

    r2 = client.post(
        "/api/v1/auth/login",
        data={
            "username": register_payload["email"],
            "password": register_payload["password"],
        },
    )

    assert r2.status_code == 200

    token = r2.json()

    assert "access_token" in token
    assert "refresh_token" in token
    assert token["token_type"] == "bearer"


def test_invalid_login(client):
    r = client.post(
        "/api/v1/auth/login",
        data={
            "username": "new@example.com",
            "password": "wrongpassword",
        },
    )

    assert r.status_code == 401