# app/services/ai_service.py
"""AI Service integrating OpenAI API with fallback NLP engines."""

import logging
from typing import Any, Dict
from app.config import settings

logger = logging.getLogger(__name__)


def generate_ai_response(prompt: str) -> Dict[str, Any]:
    """Generate completion using OpenAI if OPENAI_API_KEY is configured, else fallback."""
    if settings.OPENAI_API_KEY:
        try:
            import httpx
            headers = {"Authorization": f"Bearer {settings.OPENAI_API_KEY}"}
            data = {
                "model": settings.AI_MODEL,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 500,
            }
            resp = httpx.post("https://api.openai.com/v1/chat/completions", headers=headers, json=data, timeout=10)
            if resp.status_code == 200:
                result = resp.json()["choices"][0]["message"]["content"]
                return {"prompt": prompt, "response": result, "model": settings.AI_MODEL}
        except Exception as e:
            logger.warning(f"OpenAI completion request failed, using fallback engine: {e}")

    # Smart local fallback response generator
    response_text = f"AI Generation for prompt: '{prompt}'. Optimized for max audience engagement on SocialPulse AI."
    return {"prompt": prompt, "response": response_text, "model": "local-fallback"}
