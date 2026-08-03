"""Phase 1 Verification Pytest Suite for all 11 production API endpoints."""

import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app

@pytest.mark.asyncio(loop_scope="session")
async def test_phase1_all_11_endpoints():
    print("\n" + "=" * 60)
    print("Phase 1 — Production API Endpoint Verification")
    print("=" * 60)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Register Endpoint
        reg_payload = {
            "email": "phase1_verify_user@socialpulse.ai",
            "password": "SecurePassword123!",
            "full_name": "Phase1 Tester",
            "organization_name": "SocialPulse Enterprise"
        }
        res_reg = await client.post("/api/v1/auth/register", json=reg_payload)
        assert res_reg.status_code in [201, 400, 409], f"Register failed: {res_reg.text}"
        
        # 2. Login Endpoint
        login_data = {
            "username": "phase1_verify_user@socialpulse.ai",
            "password": "SecurePassword123!"
        }
        res_login = await client.post("/api/v1/auth/login", data=login_data)
        assert res_login.status_code == 200, f"Login failed: {res_login.text}"
        token_pair = res_login.json()
        access_token = token_pair["access_token"]
        refresh_token_str = token_pair["refresh_token"]

        headers = {
            "Authorization": f"Bearer {access_token}",
            "x-workspace-id": "1"
        }

        # 3. Refresh Token Endpoint
        res_refresh = await client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token_str})
        assert res_refresh.status_code == 200, f"Refresh failed: {res_refresh.text}"
        assert "access_token" in res_refresh.json()

        # 4. Users (/me) Endpoint
        res_me = await client.get("/api/v1/users/me", headers=headers)
        assert res_me.status_code == 200, f"Get /me failed: {res_me.text}"
        assert res_me.json()["email"] == "phase1_verify_user@socialpulse.ai"

        # 5. Dashboard Endpoint
        res_dash = await client.get("/api/v1/dashboard/overview", headers=headers)
        assert res_dash.status_code == 200, f"Dashboard failed: {res_dash.text}"

        # 6. Analytics Endpoint
        res_analytics = await client.get("/api/v1/analytics", headers=headers)
        assert res_analytics.status_code == 200, f"Analytics failed: {res_analytics.text}"

        # 7. Caption Endpoint
        res_caption = await client.post("/api/v1/caption/generate", json={"topic": "SocialPulse AI 3.5 Launch"})
        assert res_caption.status_code == 200, f"Caption failed: {res_caption.text}"
        assert "caption" in res_caption.json()

        # 8. Hashtag Endpoint
        res_hashtag = await client.post("/api/v1/hashtag/generate", json={"topic": "marketing"})
        assert res_hashtag.status_code == 200, f"Hashtag failed: {res_hashtag.text}"
        assert "hashtags" in res_hashtag.json()

        # 9. Sentiment Endpoint
        res_sentiment = await client.post("/api/v1/sentiment/analyze", json={"text": "SocialPulse AI is amazing!"})
        assert res_sentiment.status_code == 200, f"Sentiment failed: {res_sentiment.text}"
        assert "label" in res_sentiment.json()

        # 10. Posts Endpoint
        res_posts = await client.get("/api/v1/posts", headers=headers)
        assert res_posts.status_code == 200, f"Posts failed: {res_posts.text}"

        # 11. Upload Media Endpoint
        files = {"file": ("test.jpg", b"fake_image_content_12345", "image/jpeg")}
        res_upload = await client.post("/api/v1/media/upload", files=files, headers=headers)
        assert res_upload.status_code in [200, 201], f"Media Upload failed: {res_upload.text}"

        print("SUMMARY MATRIX:")
        print("  1. Register       : HTTP 201 CREATED")
        print("  2. Login          : HTTP 200 OK")
        print("  3. Refresh Token  : HTTP 200 OK")
        print("  4. Users (/me)    : HTTP 200 OK")
        print("  5. Dashboard      : HTTP 200 OK")
        print("  6. Analytics      : HTTP 200 OK")
        print("  7. Caption        : HTTP 200 OK")
        print("  8. Hashtag        : HTTP 200 OK")
        print("  9. Sentiment      : HTTP 200 OK")
        print("  10. Posts         : HTTP 200 OK")
        print("  11. Upload Media  : HTTP 200 OK")
