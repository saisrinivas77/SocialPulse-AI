# app/services/sentiment_service.py
"""Sentiment Analysis Service."""

from typing import Any, Dict


def analyze_sentiment(text: str) -> Dict[str, Any]:
    """Analyze sentiment polarity of text."""
    lower = text.lower()
    positive_words = ["great", "awesome", "excellent", "good", "love", "amazing", "best"]
    negative_words = ["bad", "terrible", "poor", "hate", "worst", "fail", "slow"]

    pos_score = sum(1 for w in positive_words if w in lower)
    neg_score = sum(1 for w in negative_words if w in lower)

    if pos_score > neg_score:
        label = "positive"
        score = 0.85
    elif neg_score > pos_score:
        label = "negative"
        score = 0.20
    else:
        label = "neutral"
        score = 0.50

    return {"label": label, "score": score, "text": text}
