from fastapi.testclient import TestClient
import uuid


def test_create_update_delete_account(client: TestClient, auth_headers):
    username = f"user_{uuid.uuid4().hex[:8]}"

    # Create
    response = client.post(
        "/api/v1/social-accounts",
        headers=auth_headers,
        json={
            "platform": "Instagram",
            "account_name": "Sai",
            "account_username": username,
        },
    )

    assert response.status_code == 201

    account = response.json()

    assert account["platform"] == "Instagram"
    assert account["account_name"] == "Sai"
    assert account["account_username"] == username
    assert account["followers"] == 0
    assert account["following"] == 0
    assert account["posts_count"] == 0
    assert account["is_connected"] is True

    account_id = account["id"]

    # Get all
    response = client.get(
        "/api/v1/social-accounts",
        headers=auth_headers,
    )

    assert response.status_code == 200

    accounts = response.json()

    assert isinstance(accounts, list)
    assert len(accounts) >= 1

    # Get one
    response = client.get(
        f"/api/v1/social-accounts/{account_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    account = response.json()

    assert account["id"] == account_id

    # Update
    response = client.put(
        f"/api/v1/social-accounts/{account_id}",
        headers=auth_headers,
        json={
            "account_name": "Sai Updated",
            "account_username": f"{username}_updated",
        },
    )

    assert response.status_code == 200

    updated = response.json()

    assert updated["account_name"] == "Sai Updated"
    assert updated["account_username"] == f"{username}_updated"

    # Delete
    response = client.delete(
        f"/api/v1/social-accounts/{account_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Social account disconnected successfully."