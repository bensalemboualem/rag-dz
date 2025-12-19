from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime

from app.schemas import (
    CreditBalanceResponse,
    CreditHistoryItem,
    PurchaseRequest,
)

router = APIRouter()

# In-memory storage (use DB in production)
user_credits = {"demo": 150}
credit_history = []


# Available credit packs
CREDIT_PACKS = {
    "starter": {"credits": 50, "price": 990, "name": "Starter"},
    "pro": {"credits": 200, "price": 2990, "name": "Pro"},
    "business": {"credits": 500, "price": 5990, "name": "Business"},
}


@router.get("/balance", response_model=CreditBalanceResponse)
async def get_balance():
    """Get current credit balance"""
    return CreditBalanceResponse(
        balance=user_credits.get("demo", 0),
        last_updated=datetime.utcnow(),
    )


@router.get("/history", response_model=List[CreditHistoryItem])
async def get_history():
    """Get credit usage history"""
    # Return mock history for demo
    return [
        CreditHistoryItem(
            id="1",
            type="generation",
            amount=-10,
            description="Génération vidéo: Promo Ramadan 2025",
            created_at=datetime.utcnow(),
        ),
        CreditHistoryItem(
            id="2",
            type="voice",
            amount=-5,
            description="Voix-off Darija",
            created_at=datetime.utcnow(),
        ),
        CreditHistoryItem(
            id="3",
            type="purchase",
            amount=200,
            description="Achat Pack Pro",
            created_at=datetime.utcnow(),
        ),
    ]


@router.post("/purchase")
async def purchase_credits(request: PurchaseRequest):
    """Purchase credits"""
    if request.pack_id not in CREDIT_PACKS:
        raise HTTPException(status_code=400, detail="Invalid pack ID")
    
    pack = CREDIT_PACKS[request.pack_id]
    
    # In production: integrate with payment gateway (CCP, Baridimob, Stripe, etc.)
    # For demo: just add credits
    user_credits["demo"] = user_credits.get("demo", 0) + pack["credits"]
    
    return {
        "success": True,
        "credits_added": pack["credits"],
        "new_balance": user_credits["demo"],
        "message": f"Pack {pack['name']} acheté avec succès!",
    }


@router.get("/packs")
async def list_packs():
    """List available credit packs"""
    return [
        {
            "id": pack_id,
            **pack,
        }
        for pack_id, pack in CREDIT_PACKS.items()
    ]
