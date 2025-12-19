"""
iaFactoryDZ Billing & Credits - ORM Models
Tables pour les plans, crédits utilisateurs et événements d'usage
"""

from datetime import datetime
from typing import Optional
from uuid import uuid4
from pydantic import BaseModel, Field
from enum import Enum


# ==================== ENUMS ====================

class PlanSlug(str, Enum):
    FREE = "free"
    STARTER = "starter"
    PRO = "pro"
    BUSINESS = "business"
    ENTERPRISE = "enterprise"


class ModuleType(str, Enum):
    RAG = "rag"
    LEGAL = "legal"
    FISCAL = "fiscal"
    PARK = "park"
    VOICE = "voice"
    API = "api"
    OTHER = "other"


class UsageStatus(str, Enum):
    SUCCESS = "success"
    FAILED = "failed"
    REFUNDED = "refunded"


# ==================== CREDIT COSTS ====================

# Coût en crédits par module et type d'opération
CREDIT_COSTS = {
    ModuleType.RAG: {
        "simple": 1,      # Requête simple
        "complex": 3,     # Requête avec long contexte
        "batch": 5        # Batch de requêtes
    },
    ModuleType.LEGAL: {
        "simple": 2,      # Question simple
        "analysis": 5,    # Analyse de document
        "contract": 10    # Génération contrat
    },
    ModuleType.FISCAL: {
        "simple": 2,      # Simulation basique
        "detailed": 5,    # Simulation détaillée
        "report": 8       # Rapport fiscal complet
    },
    ModuleType.PARK: {
        "sparkpage": 3,   # Génération page
        "template": 2,    # Personnalisation template
        "full_site": 15   # Site complet
    },
    ModuleType.VOICE: {
        "stt": 1,         # Speech-to-text seul
        "tts": 1,         # Text-to-speech seul
        "full": 2         # Conversation complète
    },
    ModuleType.API: {
        "standard": 1,    # Appel API standard
        "heavy": 3        # Appel lourd
    },
    ModuleType.OTHER: {
        "default": 1
    }
}


# ==================== DATABASE MODELS ====================

class Plan(BaseModel):
    """Plan d'abonnement"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    slug: PlanSlug
    monthly_credits: int
    daily_hard_limit: Optional[int] = None
    api_access: bool = False
    price_dzd: int = 0  # Prix en dinars algériens
    features: dict = Field(default_factory=dict)
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class UserCredits(BaseModel):
    """Crédits d'un utilisateur"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    user_id: str
    email: Optional[str] = None
    plan_id: str
    current_credits: int
    bonus_credits: int = 0  # Crédits bonus offerts
    monthly_reset_day: int = 1  # Jour du mois pour reset (1-28)
    last_reset_at: datetime = Field(default_factory=datetime.utcnow)
    hard_block: bool = False  # Blocage manuel par admin
    block_reason: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class UsageEvent(BaseModel):
    """Événement de consommation de crédits"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    user_id: Optional[str] = None
    api_key_id: Optional[str] = None
    module: ModuleType
    operation: str = "default"  # Type d'opération dans le module
    credits_spent: int
    status: UsageStatus = UsageStatus.SUCCESS
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    meta: dict = Field(default_factory=dict)  # Détails: tokens, taille, etc.
    request_id: Optional[str] = None


# ==================== API REQUEST/RESPONSE MODELS ====================

class PlanInfo(BaseModel):
    """Info plan pour affichage"""
    id: str
    name: str
    slug: str
    monthly_credits: int
    daily_hard_limit: Optional[int]
    api_access: bool
    price_dzd: int
    features: dict


class CreditsInfo(BaseModel):
    """Info crédits pour affichage"""
    current: int
    bonus: int
    total: int  # current + bonus
    last_reset_at: str
    monthly_reset_day: int
    is_blocked: bool


class UsagePreview(BaseModel):
    """Aperçu usage"""
    today_requests: int
    today_credits: int
    this_month_requests: int
    this_month_credits: int


class BillingMeResponse(BaseModel):
    """Réponse GET /api/billing/me"""
    plan: PlanInfo
    credits: CreditsInfo
    usage_preview: UsagePreview


class UsageEventDetail(BaseModel):
    """Détail d'un événement usage"""
    id: str
    timestamp: str
    module: str
    operation: str
    credits_spent: int
    status: str


class ModuleAggregate(BaseModel):
    """Agrégat par module"""
    module: str
    credits: int
    requests: int


class DailyAggregate(BaseModel):
    """Agrégat par jour"""
    date: str
    credits: int
    requests: int


class UsageHistoryResponse(BaseModel):
    """Réponse GET /api/billing/usage"""
    events: list[UsageEventDetail]
    aggregates: dict
    total_credits: int
    total_requests: int


class AdminUserBilling(BaseModel):
    """Info billing d'un user pour admin"""
    user_id: str
    email: Optional[str]
    plan_name: str
    plan_slug: str
    current_credits: int
    bonus_credits: int
    monthly_credits: int
    usage_this_month: int
    is_blocked: bool
    last_activity: Optional[str]


class AdminGrantRequest(BaseModel):
    """Requête pour ajouter crédits/changer plan"""
    user_id: str
    bonus_credits: Optional[int] = None
    new_plan_slug: Optional[str] = None
    block: Optional[bool] = None
    block_reason: Optional[str] = None


class InsufficientCreditsError(BaseModel):
    """Erreur crédits insuffisants"""
    detail: str = "INSUFFICIENT_CREDITS"
    message: str
    current_credits: int
    required_credits: int
    upgrade_url: str = "/billing/upgrade"


class BlockedAccountError(BaseModel):
    """Erreur compte bloqué"""
    detail: str = "ACCOUNT_BLOCKED"
    message: str
    reason: Optional[str]
    contact_url: str = "/support"
