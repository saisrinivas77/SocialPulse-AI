# app/api/routes/billing.py
"""SaaS Tiered Subscription & Usage Quota Management Router."""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any, List

from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/billing", tags=["Billing & Subscriptions"])

class SubscriptionPlan(BaseModel):
    id: str
    name: str
    price_monthly: int
    ai_credits_limit: int
    social_accounts_limit: int
    team_seats_limit: int
    features: List[str]

SUBSCRIPTION_PLANS: Dict[str, SubscriptionPlan] = {
    "free": SubscriptionPlan(
        id="free",
        name="Free Creator",
        price_monthly=0,
        ai_credits_limit=500,
        social_accounts_limit=2,
        team_seats_limit=1,
        features=["Basic Post Scheduling", "2 Connected Social Accounts", "500 AI Generation Credits"]
    ),
    "pro": SubscriptionPlan(
        id="pro",
        name="Pro Marketer",
        price_monthly=49,
        ai_credits_limit=5000,
        social_accounts_limit=8,
        team_seats_limit=3,
        features=["8 Connected Accounts", "5,000 AI Credits", "Multi-Channel Analytics", "PDF Exports"]
    ),
    "business": SubscriptionPlan(
        id="business",
        name="Business Agency",
        price_monthly=149,
        ai_credits_limit=20000,
        social_accounts_limit=25,
        team_seats_limit=10,
        features=["25 Connected Accounts", "20,000 AI Credits", "Custom AI Model Fine-Tuning", "10 Team Seats", "Priority API Access"]
    ),
    "enterprise": SubscriptionPlan(
        id="enterprise",
        name="Enterprise OS",
        price_monthly=499,
        ai_credits_limit=100000,
        social_accounts_limit=100,
        team_seats_limit=50,
        features=["Unlimited Telemetry Sync", "100,000 AI Credits", "Dedicated Account Manager", "Custom SSO & SLA"]
    ),
}

@router.get("/plans", response_model=List[SubscriptionPlan], summary="List all SaaS subscription plans")
async def list_plans():
    return list(SUBSCRIPTION_PLANS.values())

@router.get("/current-usage", summary="Get workspace subscription status and quota consumption")
async def get_current_usage(current_user: User = Depends(get_current_user)):
    return {
        "active_plan": SUBSCRIPTION_PLANS["business"],
        "usage": {
            "ai_credits_used": 14250,
            "ai_credits_limit": 20000,
            "connected_accounts": 8,
            "connected_accounts_limit": 25,
            "team_seats_used": 4,
            "team_seats_limit": 10,
        },
        "billing_cycle_ends": "2026-08-31T23:59:59Z",
        "payment_status": "Active"
    }

@router.post("/upgrade", summary="Upgrade or switch subscription tier")
async def upgrade_plan(plan_id: str, current_user: User = Depends(get_current_user)):
    if plan_id not in SUBSCRIPTION_PLANS:
        raise HTTPException(status_code=400, detail="Invalid subscription plan ID.")
    return {
        "message": f"Successfully updated subscription to {SUBSCRIPTION_PLANS[plan_id].name}",
        "new_plan": SUBSCRIPTION_PLANS[plan_id]
    }
