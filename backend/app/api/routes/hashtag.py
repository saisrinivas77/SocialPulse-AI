# app/api/routes/hashtag.py
from fastapi import APIRouter
from app.services.hashtag_service import generate_hashtags as generate_hashtags_service

router = APIRouter(
    prefix="/hashtag",
    tags=["Hashtag"],
)

@router.post("")
@router.post("/generate")
def generate_hashtags(payload: dict):
    topic = payload.get("topic", "socialpulse")
    hashtags = generate_hashtags_service(topic)
    return {
        "hashtags": hashtags,
        "densityScore": "High Virality Potential (98/100)",
    }
