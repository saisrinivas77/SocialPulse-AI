# app/services/caption_service.py
"""Caption Service for social post generation."""

from app.services.ai_service import generate_ai_response


def generate_caption(topic: str) -> str:
    """Generate AI caption for topic."""
    prompt = f"Write an engaging social media post caption about: {topic}"
    res = generate_ai_response(prompt)
    return res.get("response", f"Explore {topic} with SocialPulse AI.")
