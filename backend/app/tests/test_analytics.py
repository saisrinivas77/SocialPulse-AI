from fastapi.testclient import TestClient


def test_create_update_delete_analytics(client: TestClient, auth_headers):
    # Create social account first
    account = client.post(
        "/api/v1/social-accounts",
        headers=auth_headers,
        json={
            "platform": "Instagram",
            "account_name": "Sai",
            "account_username": "sai",
        },
    ).json()

    # Create analytics
    response = client.post(
        "/api/v1/analytics",
        headers=auth_headers,
        json={
            "social_account_id": account["id"],
            "platform": "Instagram",
            "followers": 100,
            "following": 50,
            "posts": 10,
            "likes": 200,
            "comments": 20,
            "shares": 5,
            "views": 500,
            "reach": 400,
            "impressions": 600,
            "profile_visits": 40,
            "website_clicks": 10,
        },
    )

    assert response.status_code == 201

    analytics = response.json()

    assert analytics["platform"] == "Instagram"
    assert analytics["followers"] == 100
    assert analytics["likes"] == 200
    assert analytics["comments"] == 20
    assert analytics["shares"] == 5

    analytics_id = analytics["id"]

    # Get all analytics
    response = client.get(
        "/api/v1/analytics",
        headers=auth_headers,
    )

    assert response.status_code == 200

    analytics_list = response.json()

    assert isinstance(analytics_list, list)
    assert len(analytics_list) >= 1

    # Get analytics by id
    response = client.get(
        f"/api/v1/analytics/{analytics_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    analytics = response.json()

    assert analytics["id"] == analytics_id

    # Update analytics
    response = client.put(
        f"/api/v1/analytics/{analytics_id}",
        headers=auth_headers,
        json={
            "followers": 150,
            "likes": 250,
            "comments": 30,
        },
    )

    assert response.status_code == 200

    updated = response.json()

    assert updated["followers"] == 150
    assert updated["likes"] == 250
    assert updated["comments"] == 30

    # Delete analytics
    response = client.delete(
        f"/api/v1/analytics/{analytics_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Analytics deleted successfully."