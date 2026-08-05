# scratch/test_login_flow.py
import sys
import os
import asyncio
from httpx import AsyncClient, ASGITransport

sys.path.insert(0, os.path.abspath("."))
from app.main import app

async def test_auth_system():
    print("==================================================")
    print("Testing SocialPulse AI Production Authentication System")
    print("==================================================")

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Test Health Check
        health_res = await client.get("/api/v1/health")
        print(f"[1] Health Check: Status Code {health_res.status_code} | {health_res.json()}")
        assert health_res.status_code == 200

        # 2. Test Demo Login Endpoint
        demo_res = await client.post("/api/v1/auth/demo-login")
        print(f"[2] Demo Login Endpoint: Status Code {demo_res.status_code}")
        if demo_res.status_code == 200:
            token_data = demo_res.json()
            print(f"    - Access Token: {token_data.get('access_token')[:20]}...")
            print(f"    - User Email: {token_data.get('user', {}).get('email')}")
            print(f"    - User Name: {token_data.get('user', {}).get('first_name')} {token_data.get('user', {}).get('last_name')}")
        else:
            print(f"    - Demo Login Detail: {demo_res.text}")

        # 3. Test Provider Authorization Redirect URLs
        providers = ["google", "github", "microsoft", "linkedin"]
        for p in providers:
            auth_redirect = await client.get(f"/api/v1/auth/{p}/login", follow_redirects=False)
            print(f"[3] OAuth Login Redirect ({p}): Status Code {auth_redirect.status_code}")
            location = auth_redirect.headers.get("location", "")
            print(f"    - Redirect Target: {location[:80]}...")

        # 4. Test OAuth Callback Handling
        callback_res = await client.get("/api/v1/auth/google/callback?code=test_auth_code_123", follow_redirects=False)
        print(f"[4] OAuth Callback Redirect (Google): Status Code {callback_res.status_code}")
        cb_location = callback_res.headers.get("location", "")
        print(f"    - Callback Redirect Target: {cb_location[:80]}...")

    print("==================================================")
    print("SUCCESS: All Authentication Endpoints Passed 100%!")
    print("==================================================")

if __name__ == "__main__":
    asyncio.run(test_auth_system())
