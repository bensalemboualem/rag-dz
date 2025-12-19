"""
iaFactoryDZ Billing & Credits - Backend API
Système de crédits et abonnements pour iaFactory Algeria
"""

from fastapi import FastAPI, HTTPException, Query, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta
from typing import Optional
import random

from models import (
    Plan, UserCredits, UsageEvent, PlanSlug, ModuleType, UsageStatus,
    PlanInfo, CreditsInfo, UsagePreview, BillingMeResponse,
    UsageEventDetail, UsageHistoryResponse, AdminUserBilling,
    AdminGrantRequest, InsufficientCreditsError, BlockedAccountError,
    CREDIT_COSTS
)
from credits_service import (
    CreditsService, InsufficientCreditsException, 
    AccountBlockedException, NoPlanException
)

app = FastAPI(
    title="iaFactoryDZ Billing & Credits API",
    description="Système de crédits et abonnements pour iaFactory Algeria",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== IN-MEMORY DATA STORES ====================

plans_store: dict[str, Plan] = {}
credits_store: dict[str, UserCredits] = {}
events_store: list[UsageEvent] = []

# Initialiser les plans
def init_plans():
    global plans_store
    
    plans_data = [
        {
            "name": "Free",
            "slug": PlanSlug.FREE,
            "monthly_credits": 100,
            "daily_hard_limit": 20,
            "api_access": False,
            "price_dzd": 0,
            "features": {
                "rag": True,
                "legal": False,
                "fiscal": False,
                "park": False,
                "voice": False,
                "api_access": False,
                "support": "community"
            }
        },
        {
            "name": "Starter",
            "slug": PlanSlug.STARTER,
            "monthly_credits": 500,
            "daily_hard_limit": 100,
            "api_access": False,
            "price_dzd": 2000,
            "features": {
                "rag": True,
                "legal": True,
                "fiscal": False,
                "park": False,
                "voice": False,
                "api_access": False,
                "support": "email"
            }
        },
        {
            "name": "Pro",
            "slug": PlanSlug.PRO,
            "monthly_credits": 2000,
            "daily_hard_limit": 500,
            "api_access": True,
            "price_dzd": 5000,
            "features": {
                "rag": True,
                "legal": True,
                "fiscal": True,
                "park": True,
                "voice": True,
                "api_access": True,
                "support": "priority"
            }
        },
        {
            "name": "Business",
            "slug": PlanSlug.BUSINESS,
            "monthly_credits": 10000,
            "daily_hard_limit": 2000,
            "api_access": True,
            "price_dzd": 15000,
            "features": {
                "rag": True,
                "legal": True,
                "fiscal": True,
                "park": True,
                "voice": True,
                "api_access": True,
                "custom_models": True,
                "support": "dedicated"
            }
        },
        {
            "name": "Enterprise",
            "slug": PlanSlug.ENTERPRISE,
            "monthly_credits": 100000,
            "daily_hard_limit": None,
            "api_access": True,
            "price_dzd": 50000,
            "features": {
                "rag": True,
                "legal": True,
                "fiscal": True,
                "park": True,
                "voice": True,
                "api_access": True,
                "custom_models": True,
                "white_label": True,
                "sla": "99.9%",
                "support": "24/7"
            }
        }
    ]
    
    for plan_data in plans_data:
        plan = Plan(**plan_data)
        plans_store[plan.id] = plan


def generate_demo_data():
    """Génère des données de démonstration"""
    global credits_store, events_store
    
    credits_store = {}
    events_store = []
    
    now = datetime.utcnow()
    
    # Créer quelques utilisateurs de démo
    demo_users = [
        {"user_id": "user_demo_1", "email": "demo@iafactory.dz", "plan": "pro"},
        {"user_id": "user_demo_2", "email": "startup@algiers.dz", "plan": "business"},
        {"user_id": "user_demo_3", "email": "student@univ-alger.dz", "plan": "free"},
        {"user_id": "user_demo_4", "email": "lawyer@cabinet.dz", "plan": "pro"},
        {"user_id": "user_demo_5", "email": "accountant@expert.dz", "plan": "starter"},
    ]
    
    for user_data in demo_users:
        plan = None
        for p in plans_store.values():
            if p.slug.value == user_data["plan"]:
                plan = p
                break
        
        if not plan:
            continue
        
        # Calculer crédits restants (random)
        used_percent = random.uniform(0.1, 0.8)
        current_credits = int(plan.monthly_credits * (1 - used_percent))
        
        user_credits = UserCredits(
            user_id=user_data["user_id"],
            email=user_data["email"],
            plan_id=plan.id,
            current_credits=current_credits,
            bonus_credits=random.randint(0, 50),
            monthly_reset_day=1,
            last_reset_at=now.replace(day=1)
        )
        credits_store[user_data["user_id"]] = user_credits
        
        # Générer des événements d'usage
        modules = list(ModuleType)
        for _ in range(random.randint(20, 100)):
            days_ago = random.randint(0, 30)
            event_time = now - timedelta(days=days_ago, hours=random.randint(0, 23))
            module = random.choice(modules[:5])  # Exclure OTHER
            
            event = UsageEvent(
                user_id=user_data["user_id"],
                module=module,
                operation="simple",
                credits_spent=random.randint(1, 5),
                timestamp=event_time,
                meta={"demo": True}
            )
            events_store.append(event)


# Initialiser au démarrage
init_plans()
generate_demo_data()

# Service de crédits
credits_service = CreditsService(plans_store, credits_store, events_store)


# ==================== HELPER FUNCTIONS ====================

def get_current_user(authorization: Optional[str] = Header(None)) -> str:
    """Simule l'authentification - en prod, valider le JWT"""
    # Pour la démo, on utilise un user par défaut
    if authorization and authorization.startswith("Bearer "):
        token = authorization[7:]
        # En prod: valider le token et extraire user_id
        if token.startswith("user_"):
            return token
    return "user_demo_1"


def get_admin_user(authorization: Optional[str] = Header(None)) -> str:
    """Vérifie les droits admin"""
    user_id = get_current_user(authorization)
    # En prod: vérifier le rôle admin
    return user_id


# ==================== API ENDPOINTS ====================

@app.get("/")
async def root():
    return {
        "service": "iaFactoryDZ Billing & Credits API",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": {
            "user": {
                "billing_me": "GET /api/billing/me",
                "usage": "GET /api/billing/usage",
                "plans": "GET /api/billing/plans"
            },
            "admin": {
                "users": "GET /api/admin/billing/users",
                "grant": "POST /api/admin/billing/grant",
                "stats": "GET /api/admin/billing/stats"
            },
            "credits": {
                "check": "POST /api/credits/check",
                "consume": "POST /api/credits/consume"
            }
        }
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "iaFactoryDZ Billing & Credits",
        "timestamp": datetime.utcnow().isoformat(),
        "users_count": len(credits_store),
        "plans_available": list(plans_store.keys())
    }


# ==================== USER BILLING ENDPOINTS ====================

@app.get("/api/billing/me", response_model=BillingMeResponse)
async def get_billing_me(user_id: str = Depends(get_current_user)):
    """Affiche la situation billing de l'utilisateur"""
    
    user_credits = credits_service.get_or_create_user_credits(user_id)
    plan = credits_service.get_plan(user_credits.plan_id)
    
    if not plan:
        raise HTTPException(status_code=404, detail="Plan non trouvé")
    
    usage_stats = credits_service.get_usage_stats(user_id, days=30)
    
    return BillingMeResponse(
        plan=PlanInfo(
            id=plan.id,
            name=plan.name,
            slug=plan.slug.value,
            monthly_credits=plan.monthly_credits,
            daily_hard_limit=plan.daily_hard_limit,
            api_access=plan.api_access,
            price_dzd=plan.price_dzd,
            features=plan.features
        ),
        credits=CreditsInfo(
            current=user_credits.current_credits,
            bonus=user_credits.bonus_credits,
            total=user_credits.current_credits + user_credits.bonus_credits,
            last_reset_at=user_credits.last_reset_at.isoformat(),
            monthly_reset_day=user_credits.monthly_reset_day,
            is_blocked=user_credits.hard_block
        ),
        usage_preview=UsagePreview(
            today_requests=usage_stats["today"]["requests"],
            today_credits=usage_stats["today"]["credits"],
            this_month_requests=usage_stats["this_month"]["requests"],
            this_month_credits=usage_stats["this_month"]["credits"]
        )
    )


@app.get("/api/billing/usage")
async def get_billing_usage(
    range: str = Query("30d", regex="^(7d|30d|90d)$"),
    user_id: str = Depends(get_current_user)
):
    """Retourne l'historique d'usage pour graphiques et tableau"""
    
    days_map = {"7d": 7, "30d": 30, "90d": 90}
    days = days_map.get(range, 30)
    
    usage_stats = credits_service.get_usage_stats(user_id, days=days)
    
    # Récupérer les événements récents
    cutoff = datetime.utcnow() - timedelta(days=days)
    user_events = [
        e for e in events_store 
        if e.user_id == user_id and e.timestamp >= cutoff
    ]
    user_events = sorted(user_events, key=lambda x: x.timestamp, reverse=True)[:50]
    
    events = [
        UsageEventDetail(
            id=e.id,
            timestamp=e.timestamp.isoformat(),
            module=e.module.value if isinstance(e.module, ModuleType) else e.module,
            operation=e.operation,
            credits_spent=e.credits_spent,
            status=e.status.value if isinstance(e.status, UsageStatus) else e.status
        )
        for e in user_events
    ]
    
    # Formater les agrégats
    by_module = [
        {"module": mod, "credits": data["credits"], "requests": data["requests"]}
        for mod, data in usage_stats["by_module"].items()
    ]
    
    by_day = [
        {"date": day, "credits": data["credits"], "requests": data["requests"]}
        for day, data in sorted(usage_stats["by_day"].items())
    ]
    
    return {
        "events": events,
        "aggregates": {
            "by_module": by_module,
            "by_day": by_day
        },
        "total_credits": usage_stats["total"]["credits"],
        "total_requests": usage_stats["total"]["requests"]
    }


@app.get("/api/billing/plans")
async def get_plans():
    """Liste des plans disponibles"""
    return {
        "plans": [
            {
                "id": plan.id,
                "name": plan.name,
                "slug": plan.slug.value,
                "monthly_credits": plan.monthly_credits,
                "daily_hard_limit": plan.daily_hard_limit,
                "api_access": plan.api_access,
                "price_dzd": plan.price_dzd,
                "features": plan.features,
                "is_active": plan.is_active
            }
            for plan in plans_store.values()
            if plan.is_active
        ]
    }


@app.get("/api/billing/credit-costs")
async def get_credit_costs():
    """Retourne le coût en crédits par module/opération"""
    return {
        "costs": {
            module.value: costs 
            for module, costs in CREDIT_COSTS.items()
        }
    }


# ==================== ADMIN BILLING ENDPOINTS ====================

@app.get("/api/admin/billing/users")
async def admin_get_users(
    search: Optional[str] = None,
    plan: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    admin_id: str = Depends(get_admin_user)
):
    """Liste des utilisateurs avec leurs infos billing (admin)"""
    
    users = []
    
    for user_id, user_credits in credits_store.items():
        plan_obj = credits_service.get_plan(user_credits.plan_id)
        
        # Filtres
        if search and search.lower() not in (user_credits.email or "").lower():
            continue
        if plan and plan_obj and plan_obj.slug.value != plan:
            continue
        
        # Stats usage ce mois
        usage_stats = credits_service.get_usage_stats(user_id, days=30)
        
        # Dernière activité
        user_events = [e for e in events_store if e.user_id == user_id]
        last_activity = None
        if user_events:
            last_event = max(user_events, key=lambda x: x.timestamp)
            last_activity = last_event.timestamp.isoformat()
        
        users.append(AdminUserBilling(
            user_id=user_id,
            email=user_credits.email,
            plan_name=plan_obj.name if plan_obj else "Unknown",
            plan_slug=plan_obj.slug.value if plan_obj else "unknown",
            current_credits=user_credits.current_credits,
            bonus_credits=user_credits.bonus_credits,
            monthly_credits=plan_obj.monthly_credits if plan_obj else 0,
            usage_this_month=usage_stats["this_month"]["credits"],
            is_blocked=user_credits.hard_block,
            last_activity=last_activity
        ))
    
    # Tri par usage décroissant
    users = sorted(users, key=lambda x: x.usage_this_month, reverse=True)[:limit]
    
    return {"users": users, "total": len(credits_store)}


@app.post("/api/admin/billing/grant")
async def admin_grant(
    request: AdminGrantRequest,
    admin_id: str = Depends(get_admin_user)
):
    """Ajoute des crédits bonus ou change de plan (admin)"""
    
    user_credits = credits_service.get_user_credits(request.user_id)
    if not user_credits:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    actions = []
    
    # Ajouter des crédits bonus
    if request.bonus_credits and request.bonus_credits > 0:
        credits_service.grant_bonus_credits(
            request.user_id, 
            request.bonus_credits, 
            f"Admin grant by {admin_id}"
        )
        actions.append(f"Added {request.bonus_credits} bonus credits")
    
    # Changer de plan
    if request.new_plan_slug:
        success = credits_service.change_plan(request.user_id, request.new_plan_slug)
        if success:
            actions.append(f"Changed plan to {request.new_plan_slug}")
        else:
            raise HTTPException(status_code=400, detail="Plan non trouvé")
    
    # Bloquer/débloquer
    if request.block is not None:
        if request.block:
            credits_service.block_user(request.user_id, request.block_reason)
            actions.append("User blocked")
        else:
            credits_service.unblock_user(request.user_id)
            actions.append("User unblocked")
    
    return {
        "success": True,
        "actions": actions,
        "user_id": request.user_id
    }


@app.get("/api/admin/billing/stats")
async def admin_get_stats(
    range: str = Query("30d", regex="^(7d|30d|90d)$"),
    admin_id: str = Depends(get_admin_user)
):
    """Statistiques globales de consommation (admin)"""
    
    days_map = {"7d": 7, "30d": 30, "90d": 90}
    days = days_map.get(range, 30)
    cutoff = datetime.utcnow() - timedelta(days=days)
    
    # Filtrer les événements
    period_events = [e for e in events_store if e.timestamp >= cutoff]
    
    # Agrégats par module
    by_module = {}
    for event in period_events:
        mod = event.module.value if isinstance(event.module, ModuleType) else event.module
        if mod not in by_module:
            by_module[mod] = {"credits": 0, "requests": 0}
        by_module[mod]["credits"] += event.credits_spent
        by_module[mod]["requests"] += 1
    
    # Agrégats par jour
    by_day = {}
    for event in period_events:
        day = event.timestamp.strftime("%Y-%m-%d")
        if day not in by_day:
            by_day[day] = {"credits": 0, "requests": 0}
        by_day[day]["credits"] += event.credits_spent
        by_day[day]["requests"] += 1
    
    # Top users
    user_usage = {}
    for event in period_events:
        if event.user_id not in user_usage:
            user_usage[event.user_id] = {"credits": 0, "requests": 0}
        user_usage[event.user_id]["credits"] += event.credits_spent
        user_usage[event.user_id]["requests"] += 1
    
    top_users = sorted(
        [{"user_id": uid, **data} for uid, data in user_usage.items()],
        key=lambda x: x["credits"],
        reverse=True
    )[:10]
    
    # Stats plans
    plan_stats = {}
    for user_id, user_credits in credits_store.items():
        plan = credits_service.get_plan(user_credits.plan_id)
        if plan:
            slug = plan.slug.value
            if slug not in plan_stats:
                plan_stats[slug] = {"users": 0, "total_credits": 0}
            plan_stats[slug]["users"] += 1
            plan_stats[slug]["total_credits"] += user_credits.current_credits + user_credits.bonus_credits
    
    return {
        "period": range,
        "total_credits_consumed": sum(e.credits_spent for e in period_events),
        "total_requests": len(period_events),
        "unique_users": len(set(e.user_id for e in period_events)),
        "by_module": [{"module": m, **d} for m, d in by_module.items()],
        "by_day": [{"date": d, **data} for d, data in sorted(by_day.items())],
        "top_users": top_users,
        "plan_distribution": plan_stats
    }


# ==================== CREDITS API (for other modules) ====================

@app.post("/api/credits/check")
async def check_credits(
    user_id: str,
    required_credits: int,
    module: str = "other"
):
    """Vérifie si l'utilisateur a assez de crédits (appelé par autres modules)"""
    
    try:
        credits_service.check_credits(user_id, required_credits)
        balance = credits_service.get_balance(user_id)
        return {
            "ok": True,
            "current_credits": balance["total"],
            "required_credits": required_credits,
            "remaining_after": balance["total"] - required_credits
        }
    except InsufficientCreditsException as e:
        return JSONResponse(
            status_code=402,
            content={
                "detail": "INSUFFICIENT_CREDITS",
                "message": e.message,
                "current_credits": e.current,
                "required_credits": e.required,
                "upgrade_url": "/billing/upgrade"
            }
        )
    except AccountBlockedException as e:
        return JSONResponse(
            status_code=403,
            content={
                "detail": "ACCOUNT_BLOCKED",
                "message": e.message,
                "reason": e.reason,
                "contact_url": "/support"
            }
        )
    except NoPlanException:
        return JSONResponse(
            status_code=404,
            content={
                "detail": "NO_PLAN",
                "message": "Aucun plan associé à cet utilisateur"
            }
        )


@app.post("/api/credits/consume")
async def consume_credits(
    user_id: str,
    module: str,
    operation: str = "default",
    credits: Optional[int] = None,
    meta: Optional[dict] = None
):
    """Consomme des crédits (appelé par autres modules après traitement)"""
    
    try:
        module_type = ModuleType(module) if module in ModuleType.__members__.values() else ModuleType.OTHER
        
        event = credits_service.consume(
            user_id=user_id,
            module=module_type,
            operation=operation,
            credits_used=credits,
            meta=meta or {}
        )
        
        balance = credits_service.get_balance(user_id)
        
        return {
            "success": True,
            "event_id": event.id,
            "credits_consumed": event.credits_spent,
            "remaining_credits": balance["total"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/credits/reset-monthly")
async def trigger_monthly_reset(admin_id: str = Depends(get_admin_user)):
    """Déclenche le reset mensuel des crédits (admin/cron)"""
    
    reset_users = credits_service.reset_monthly_credits()
    
    return {
        "success": True,
        "users_reset": len(reset_users),
        "user_ids": reset_users
    }


@app.post("/api/demo/refresh")
async def refresh_demo_data():
    """Régénère les données de démo"""
    global credits_service
    
    generate_demo_data()
    credits_service = CreditsService(plans_store, credits_store, events_store)
    
    return {
        "success": True,
        "users": len(credits_store),
        "events": len(events_store)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8207)
