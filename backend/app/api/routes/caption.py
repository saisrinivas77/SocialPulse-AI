# app/api/routes/caption.py
from fastapi import APIRouter
from app.services.caption_service import generate_caption as generate_caption_service

router = APIRouter(
    prefix="/caption",
    tags=["Caption"],
)

@router.post("")
@router.post("/generate")
def generate_caption(payload: dict):
    topic = payload.get("topic") or payload.get("prompt", "SocialPulse AI")
    caption = generate_caption_service(topic)
    return {
        "caption": caption,
        "hashtags": ["#SocialPulse", "#AIGrowth", "#SocialMedia", "#ContentStrategy"],
        "sentiment": "Highly Positive (94%)",
        "suggestedBestPostingTime": "Today at 6:45 PM EST",
    }
