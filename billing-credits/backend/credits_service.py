"""
iaFactoryDZ Credits Service
Service central pour la gestion des crédits IA
"""

from datetime import datetime, timedelta
from typing import Optional
from uuid import uuid4

from models import (
    Plan, UserCredits, UsageEvent, PlanSlug, ModuleType, UsageStatus,
    CREDIT_COSTS
)


class InsufficientCreditsException(Exception):
    """Exception levée quand les crédits sont insuffisants"""
    def __init__(self, current: int, required: int, message: str = None):
        self.current = current
        self.required = required
        self.message = message or f"Crédits insuffisants: {current} disponibles, {required} requis"
        super().__init__(self.message)


class AccountBlockedException(Exception):
    """Exception levée quand le compte est bloqué"""
    def __init__(self, reason: str = None):
        self.reason = reason
        self.message = reason or "Votre compte a été temporairement bloqué"
        super().__init__(self.message)


class NoPlanException(Exception):
    """Exception levée quand l'utilisateur n'a pas de plan"""
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.message = f"Aucun plan associé à l'utilisateur {user_id}"
        super().__init__(self.message)


class CreditsService:
    """
    Service central de gestion des crédits IA.
    Gère la vérification, réservation et consommation des crédits.
    """
    
    def __init__(self, plans_store: dict, credits_store: dict, events_store: list):
        """
        Initialise le service avec les stores (en mémoire pour démo).
        En production, utiliser une session DB.
        """
        self.plans = plans_store
        self.credits = credits_store
        self.events = events_store
    
    def get_plan(self, plan_id: str) -> Optional[Plan]:
        """Récupère un plan par son ID"""
        return self.plans.get(plan_id)
    
    def get_plan_by_slug(self, slug: str) -> Optional[Plan]:
        """Récupère un plan par son slug"""
        for plan in self.plans.values():
            if plan.slug.value == slug or plan.slug == slug:
                return plan
        return None
    
    def get_user_credits(self, user_id: str) -> Optional[UserCredits]:
        """Récupère les crédits d'un utilisateur"""
        return self.credits.get(user_id)
    
    def get_or_create_user_credits(self, user_id: str, email: str = None) -> UserCredits:
        """Récupère ou crée les crédits d'un utilisateur (plan Free par défaut)"""
        if user_id in self.credits:
            return self.credits[user_id]
        
        # Créer avec plan Free
        free_plan = self.get_plan_by_slug("free")
        if not free_plan:
            raise Exception("Plan Free non trouvé")
        
        user_credits = UserCredits(
            user_id=user_id,
            email=email,
            plan_id=free_plan.id,
            current_credits=free_plan.monthly_credits,
            monthly_reset_day=1
        )
        self.credits[user_id] = user_credits
        return user_credits
    
    def compute_credits_for_call(
        self, 
        module: ModuleType, 
        operation: str = "default",
        payload: dict = None,
        response_meta: dict = None
    ) -> int:
        """
        Calcule le nombre de crédits à consommer pour un appel.
        Peut être affiné avec les tokens, taille contexte, etc.
        """
        module_costs = CREDIT_COSTS.get(module, CREDIT_COSTS[ModuleType.OTHER])
        base_cost = module_costs.get(operation, module_costs.get("default", 1))
        
        # Ajustements optionnels basés sur la payload/response
        if payload and response_meta:
            # Exemple: ajuster selon le nombre de tokens
            tokens = response_meta.get("total_tokens", 0)
            if tokens > 2000:
                base_cost += 1
            if tokens > 5000:
                base_cost += 2
        
        return base_cost
    
    def check_credits(self, user_id: str, required_credits: int) -> None:
        """
        Vérifie si l'utilisateur a suffisamment de crédits.
        Lève une exception si pas assez.
        """
        user_credits = self.get_user_credits(user_id)
        
        if not user_credits:
            raise NoPlanException(user_id)
        
        if user_credits.hard_block:
            raise AccountBlockedException(user_credits.block_reason)
        
        total_available = user_credits.current_credits + user_credits.bonus_credits
        
        if total_available < required_credits:
            raise InsufficientCreditsException(
                current=total_available,
                required=required_credits,
                message="Vous avez épuisé vos crédits IA pour ce mois. Veuillez contacter l'administrateur ou mettre à niveau votre plan."
            )
    
    def check_and_reserve(self, user_id: str, estimated_credits: int) -> None:
        """
        Vérifie si l'utilisateur a suffisamment de crédits.
        Peut éventuellement faire une "réservation" logique (à implémenter si besoin).
        """
        self.check_credits(user_id, estimated_credits)
    
    def consume(
        self,
        user_id: str,
        module: ModuleType,
        operation: str = "default",
        credits_used: int = None,
        meta: dict = None,
        api_key_id: str = None
    ) -> UsageEvent:
        """
        Débite les crédits et enregistre un événement d'usage.
        Retourne l'événement créé.
        """
        user_credits = self.get_user_credits(user_id)
        
        if not user_credits:
            raise NoPlanException(user_id)
        
        # Calculer les crédits si non spécifié
        if credits_used is None:
            credits_used = self.compute_credits_for_call(module, operation, meta)
        
        # Débiter d'abord les crédits bonus, puis les crédits normaux
        if user_credits.bonus_credits >= credits_used:
            user_credits.bonus_credits -= credits_used
        elif user_credits.bonus_credits > 0:
            remaining = credits_used - user_credits.bonus_credits
            user_credits.bonus_credits = 0
            user_credits.current_credits -= remaining
        else:
            user_credits.current_credits -= credits_used
        
        user_credits.updated_at = datetime.utcnow()
        
        # Créer l'événement d'usage
        event = UsageEvent(
            user_id=user_id,
            api_key_id=api_key_id,
            module=module,
            operation=operation,
            credits_spent=credits_used,
            status=UsageStatus.SUCCESS,
            meta=meta or {},
            request_id=str(uuid4())[:8]
        )
        
        self.events.append(event)
        
        return event
    
    def refund(self, event_id: str, reason: str = None) -> bool:
        """
        Rembourse les crédits d'un événement (en cas d'erreur par exemple).
        """
        for event in self.events:
            if event.id == event_id and event.status == UsageStatus.SUCCESS:
                user_credits = self.get_user_credits(event.user_id)
                if user_credits:
                    user_credits.current_credits += event.credits_spent
                    event.status = UsageStatus.REFUNDED
                    event.meta["refund_reason"] = reason
                    event.meta["refund_at"] = datetime.utcnow().isoformat()
                    return True
        return False
    
    def get_balance(self, user_id: str) -> dict:
        """
        Retourne les crédits restants pour affichage UI.
        """
        user_credits = self.get_user_credits(user_id)
        
        if not user_credits:
            return {"current": 0, "bonus": 0, "total": 0, "plan": None}
        
        plan = self.get_plan(user_credits.plan_id)
        
        return {
            "current": user_credits.current_credits,
            "bonus": user_credits.bonus_credits,
            "total": user_credits.current_credits + user_credits.bonus_credits,
            "monthly_limit": plan.monthly_credits if plan else 0,
            "plan_name": plan.name if plan else "Unknown",
            "is_blocked": user_credits.hard_block
        }
    
    def get_usage_stats(self, user_id: str, days: int = 30) -> dict:
        """
        Retourne les statistiques d'usage sur une période.
        """
        cutoff = datetime.utcnow() - timedelta(days=days)
        today = datetime.utcnow().date()
        
        user_events = [
            e for e in self.events 
            if e.user_id == user_id and e.timestamp >= cutoff
        ]
        
        # Agrégats par module
        by_module = {}
        for event in user_events:
            mod = event.module.value if isinstance(event.module, ModuleType) else event.module
            if mod not in by_module:
                by_module[mod] = {"credits": 0, "requests": 0}
            by_module[mod]["credits"] += event.credits_spent
            by_module[mod]["requests"] += 1
        
        # Agrégats par jour
        by_day = {}
        for event in user_events:
            day = event.timestamp.strftime("%Y-%m-%d")
            if day not in by_day:
                by_day[day] = {"credits": 0, "requests": 0}
            by_day[day]["credits"] += event.credits_spent
            by_day[day]["requests"] += 1
        
        # Stats aujourd'hui
        today_events = [e for e in user_events if e.timestamp.date() == today]
        
        # Stats ce mois
        month_start = today.replace(day=1)
        month_events = [e for e in user_events if e.timestamp.date() >= month_start]
        
        return {
            "by_module": by_module,
            "by_day": by_day,
            "today": {
                "requests": len(today_events),
                "credits": sum(e.credits_spent for e in today_events)
            },
            "this_month": {
                "requests": len(month_events),
                "credits": sum(e.credits_spent for e in month_events)
            },
            "total": {
                "requests": len(user_events),
                "credits": sum(e.credits_spent for e in user_events)
            }
        }
    
    def grant_bonus_credits(self, user_id: str, amount: int, reason: str = None) -> bool:
        """
        Ajoute des crédits bonus à un utilisateur.
        """
        user_credits = self.get_user_credits(user_id)
        if not user_credits:
            return False
        
        user_credits.bonus_credits += amount
        user_credits.updated_at = datetime.utcnow()
        
        # Log l'action
        event = UsageEvent(
            user_id=user_id,
            module=ModuleType.OTHER,
            operation="bonus_grant",
            credits_spent=-amount,  # Négatif = ajout
            status=UsageStatus.SUCCESS,
            meta={"reason": reason or "Admin grant", "amount": amount}
        )
        self.events.append(event)
        
        return True
    
    def change_plan(self, user_id: str, new_plan_slug: str) -> bool:
        """
        Change le plan d'un utilisateur.
        """
        user_credits = self.get_user_credits(user_id)
        if not user_credits:
            return False
        
        new_plan = self.get_plan_by_slug(new_plan_slug)
        if not new_plan:
            return False
        
        old_plan_id = user_credits.plan_id
        user_credits.plan_id = new_plan.id
        
        # Optionnel: ajuster les crédits si upgrade
        old_plan = self.get_plan(old_plan_id)
        if old_plan and new_plan.monthly_credits > old_plan.monthly_credits:
            # Ajouter la différence pro-rata (simplifié: on ajoute tout)
            user_credits.current_credits = new_plan.monthly_credits
        
        user_credits.updated_at = datetime.utcnow()
        
        return True
    
    def block_user(self, user_id: str, reason: str = None) -> bool:
        """Bloque un utilisateur."""
        user_credits = self.get_user_credits(user_id)
        if not user_credits:
            return False
        
        user_credits.hard_block = True
        user_credits.block_reason = reason
        user_credits.updated_at = datetime.utcnow()
        return True
    
    def unblock_user(self, user_id: str) -> bool:
        """Débloque un utilisateur."""
        user_credits = self.get_user_credits(user_id)
        if not user_credits:
            return False
        
        user_credits.hard_block = False
        user_credits.block_reason = None
        user_credits.updated_at = datetime.utcnow()
        return True
    
    def reset_monthly_credits(self) -> list:
        """
        Reset mensuel des crédits. À appeler par un job quotidien.
        Retourne la liste des user_id reset.
        """
        today = datetime.utcnow()
        reset_users = []
        
        for user_id, user_credits in self.credits.items():
            plan = self.get_plan(user_credits.plan_id)
            if not plan:
                continue
            
            # Vérifier si c'est le jour de reset
            should_reset = False
            
            if today.day == user_credits.monthly_reset_day:
                # C'est le jour de reset mensuel
                if user_credits.last_reset_at.month != today.month:
                    should_reset = True
            
            # Ou si plus de 30 jours depuis dernier reset
            days_since_reset = (today - user_credits.last_reset_at).days
            if days_since_reset >= 30:
                should_reset = True
            
            if should_reset:
                user_credits.current_credits = plan.monthly_credits
                user_credits.last_reset_at = today
                user_credits.updated_at = today
                reset_users.append(user_id)
        
        return reset_users
