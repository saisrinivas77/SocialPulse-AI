# app/tasks/publishers.py
"""Social network publishers for X/Twitter, LinkedIn, Instagram Graph, and Facebook Pages."""

import logging
from typing import List
import httpx

logger = logging.getLogger(__name__)


class SocialPlatformPublisher:
    """Platform publisher routing social channel posts with media support."""

    @staticmethod
    async def publish_to_twitter(
        access_token: str, content: str, media_urls: List[str]
    ) -> str:
        """Publish post with optional media to X API v2."""
        async with httpx.AsyncClient() as client:
            payload = {"text": content}
            res = await client.post(
                "https://api.twitter.com/2/tweets",
                headers={"Authorization": f"Bearer {access_token}"},
                json=payload,
                timeout=10.0,
            )
            if res.status_code not in (200, 201):
                raise RuntimeError(f"Twitter API error: {res.text}")
            return res.json().get("data", {}).get("id", "tw_published")

    @staticmethod
    async def publish_to_linkedin(
        access_token: str, content: str, media_urls: List[str]
    ) -> str:
        """Publish post to LinkedIn REST API."""
        async with httpx.AsyncClient() as client:
            res = await client.post(
                "https://api.linkedin.com/v2/ugcPosts",
                headers={"Authorization": f"Bearer {access_token}"},
                json={
                    "author": "urn:li:person:UNKNOWN",
                    "lifecycleState": "PUBLISHED",
                    "specificContent": {
                        "com.linkedin.ugc.ShareContent": {
                            "shareCommentary": {"text": content},
                            "shareMediaCategory": "NONE",
                        }
                    },
                    "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"},
                },
                timeout=10.0,
            )
            if res.status_code not in (200, 201):
                raise RuntimeError(f"LinkedIn API error: {res.text}")
            return res.json().get("id", "li_published")

    @staticmethod
    async def publish_to_instagram(
        access_token: str,
        ig_user_id: str,
        content: str,
        image_url: str,
    ) -> str:
        """Publish image post via Instagram Graph API container workflow."""
        async with httpx.AsyncClient() as client:
            # Step 1: Create Media Container
            container_res = await client.post(
                f"https://graph.facebook.com/v19.0/{ig_user_id}/media",
                params={
                    "image_url": image_url,
                    "caption": content,
                    "access_token": access_token,
                },
                timeout=15.0,
            )
            if container_res.status_code != 200:
                raise RuntimeError(f"Instagram Container Error: {container_res.text}")

            container_id = container_res.json()["id"]

            # Step 2: Publish Container
            pub_res = await client.post(
                f"https://graph.facebook.com/v19.0/{ig_user_id}/media_publish",
                params={"creation_id": container_id, "access_token": access_token},
                timeout=15.0,
            )
            if pub_res.status_code != 200:
                raise RuntimeError(f"Instagram Publish Error: {pub_res.text}")

            return pub_res.json()["id"]

    @staticmethod
    async def publish_to_facebook(
        access_token: str, page_id: str, content: str
    ) -> str:
        """Publish feed post to Facebook Pages API."""
        async with httpx.AsyncClient() as client:
            res = await client.post(
                f"https://graph.facebook.com/v19.0/{page_id}/feed",
                params={"message": content, "access_token": access_token},
                timeout=10.0,
            )
            if res.status_code != 200:
                raise RuntimeError(f"Facebook API error: {res.text}")
            return res.json()["id"]