# app/services/hashtag_service.py
"""Hashtag Service for topic extraction."""

from typing import List


def generate_hashtags(topic: str) -> List[str]:
    """Generate relevant hashtags for topic."""
    cleaned = topic.replace(" ", "")
    return [f"#{cleaned}", f"#{cleaned}AI", f"#{cleaned}Trends", "#SocialPulse"]
