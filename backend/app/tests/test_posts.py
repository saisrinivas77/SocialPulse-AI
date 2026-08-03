# tests/test_posts_api.py
"""End-to-End integration test suite for multi-tenant workspace posts."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_full_workspace_post_lifecycle(async_client: AsyncClient):
    """Verify tenant registration, workspace discovery, and post creation."""
    reg_response = await async_client.post(
        "/api/v1/auth/register",
        json={
            "email": "owner@saas.com",
            "password": "StrongPassword123!",
            "full_name": "SaaS Owner",
            "organization_name": "Acme SaaS Corp",
        },
    )
    assert reg_response.status_code == 201

    login_res = await async_client.post(
        "/api/v1/auth/login",
        data={"username": "owner@saas.com", "password": "StrongPassword123!"},
    )
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    auth_headers = {"Authorization": f"Bearer {token}"}

    ws_res = await async_client.get("/api/v1/workspaces", headers=auth_headers)
    assert ws_res.status_code == 200
    workspaces = ws_res.json()
    assert len(workspaces) >= 1
    workspace_id = workspaces[0]["id"]

    headers = {**auth_headers, "X-Workspace-ID": workspace_id}
    create_post_res = await async_client.post(
        "/api/v1/posts",
        headers=headers,
        json={
            "title": "Tenant Post",
            "content": "Multi-tenant workspace post content",
            "status": "DRAFT",
        },
    )
    assert create_post_res.status_code == 201
    assert create_post_res.json()["title"] == "Tenant Post"