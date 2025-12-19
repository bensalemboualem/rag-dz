"""
Pack PME DZ - CoPilot IA pour petites entreprises en Algérie
============================================================
Module orchestrateur qui unifie RAG DZ, DZ-LegalAssistant, DZ-FiscalAssistant et iaFactoryPark
pour offrir une expérience simplifiée aux entrepreneurs algériens.

Auteur: iaFactory Algeria
Date: Novembre 2025
"""

import os
import asyncio
import httpx
from datetime import datetime
from typing import Optional, List, Dict, Any, Literal
from enum import Enum
from pydantic import BaseModel, Field
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
import logging

# Configuration logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("pme-copilot")

# ============================================================================
# CONFIGURATION
# ============================================================================

# URLs des services internes (sur le même réseau Docker)
LEGAL_API_URL = os.getenv("LEGAL_API_URL", "http://iaf-dz-legal-prod:8200")
FISCAL_API_URL = os.getenv("FISCAL_API_URL", "http://iaf-dz-fiscal-prod:8201")
RAG_API_URL = os.getenv("RAG_API_URL", "http://iaf-rag-api-prod:8180")
PARK_API_URL = os.getenv("PARK_API_URL", "http://iaf-park-prod:8195")
BILLING_API_URL = os.getenv("BILLING_API_URL", "http://iaf-billing-prod:8207")

# Configuration OpenAI pour synthèse
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# Crédits par analyse PME
PME_ANALYSIS_CREDITS = int(os.getenv("PME_ANALYSIS_CREDITS", "8"))

# ============================================================================
# MODÈLES DE DONNÉES
# ============================================================================

class GoalType(str, Enum):
    CREATION_ENTREPRISE = "creation_entreprise"
    GESTION = "gestion"
    FISCALITE = "fiscalite"
    AUTRE = "autre"

class ProfileType(str, Enum):
    FREELANCE = "freelance"
    PME = "pme"
    COMMERCANT = "commercant"
    AUTRE = "autre"

class RevenueHint(BaseModel):
    known: bool = False
    period: Literal["mensuel", "annuel"] = "mensuel"
    amount: float = 0

class PMEAnalyzeRequest(BaseModel):
    """Requête d'analyse PME"""
    description: str = Field(..., min_length=10, description="Description de la situation / projet")
    goal_type: GoalType = GoalType.AUTRE
    profile_type: ProfileType = ProfileType.AUTRE
    activity_sector: Optional[str] = Field(None, description="Secteur d'activité")
    revenue_hint: Optional[RevenueHint] = None
    user_id: Optional[str] = None

class Step(BaseModel):
    title: str
    description: str
    checklist: List[str] = []

class JuridicalBlock(BaseModel):
    summary: str
    steps: List[Step] = []
    risks_and_limits: List[str] = []

class TaxBreakdown(BaseModel):
    label: str
    amount: float
    notes: List[str] = []

class FiscalEstimates(BaseModel):
    currency: str = "DZD"
    estimated_tax_total: float = 0
    estimated_social_total: float = 0
    estimated_net_income: float = 0

class FiscalBlock(BaseModel):
    summary: str
    estimates: FiscalEstimates = FiscalEstimates()
    breakdown: List[TaxBreakdown] = []
    risks_and_limits: List[str] = []

class ChecklistBlock(BaseModel):
    items: List[str] = []

class SuggestedDocument(BaseModel):
    title: str
    type: Literal["statuts", "contrat", "courrier", "checklist", "autre"] = "autre"
    description: str
    template_generated: Optional[str] = None

class DocumentsBlock(BaseModel):
    suggested_documents: List[SuggestedDocument] = []

class ReferenceItem(BaseModel):
    label: str
    source_name: str
    source_url: Optional[str] = None
    date: Optional[str] = None

class ReferencesBlock(BaseModel):
    items: List[ReferenceItem] = []

class PMEAnalyzeResponse(BaseModel):
    """Réponse unifiée de l'analyse PME"""
    success: bool = True
    global_summary: str
    juridical_block: JuridicalBlock
    fiscal_block: FiscalBlock
    checklist_block: ChecklistBlock
    documents_block: DocumentsBlock
    references_block: ReferencesBlock
    followup_questions: List[str] = []
    credits_used: int = 0
    analysis_timestamp: str = ""
    request_id: str = ""

# ============================================================================
# APPLICATION FASTAPI
# ============================================================================

app = FastAPI(
    title="Pack PME DZ - CoPilot IA",
    description="Assistant IA unifié pour les petites entreprises en Algérie",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# SERVICES D'ORCHESTRATION
# ============================================================================

async def call_legal_api(description: str, goal_type: GoalType) -> Dict[str, Any]:
    """Appelle DZ-LegalAssistant pour obtenir les informations juridiques"""
    try:
        # Mapper goal_type vers catégorie Legal
        category_map = {
            GoalType.CREATION_ENTREPRISE: "droit_des_affaires",
            GoalType.GESTION: "droit_travail",
            GoalType.FISCALITE: "droit_fiscal",
            GoalType.AUTRE: "procédure_administrative"
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{LEGAL_API_URL}/api/dz-legal/answer",
                json={
                    "question": description,
                    "category": category_map.get(goal_type, "procédure_administrative"),
                    "include_references": True
                }
            )
            if response.status_code == 200:
                return response.json()
            else:
                logger.warning(f"Legal API returned {response.status_code}")
                return {"error": "Service Legal non disponible"}
    except Exception as e:
        logger.error(f"Error calling Legal API: {e}")
        return {"error": str(e)}

async def call_fiscal_api(description: str, profile_type: ProfileType, revenue_hint: Optional[RevenueHint]) -> Dict[str, Any]:
    """Appelle DZ-FiscalAssistant pour simulation fiscale"""
    try:
        # Préparer les données de simulation
        revenue = 0
        if revenue_hint and revenue_hint.known:
            revenue = revenue_hint.amount
            if revenue_hint.period == "mensuel":
                revenue *= 12  # Annualiser

        # Mapper profile vers régime fiscal
        regime_map = {
            ProfileType.FREELANCE: "microentreprise",
            ProfileType.PME: "reel_simplifie",
            ProfileType.COMMERCANT: "forfaitaire",
            ProfileType.AUTRE: "microentreprise"
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{FISCAL_API_URL}/api/dz-fiscal/simulate",
                json={
                    "revenu_brut_annuel": revenue or 2000000,  # Défaut 2M DZD si non spécifié
                    "regime_fiscal": regime_map.get(profile_type, "microentreprise"),
                    "secteur_activite": "services",
                    "include_social_charges": True,
                    "question_context": description
                }
            )
            if response.status_code == 200:
                return response.json()
            else:
                logger.warning(f"Fiscal API returned {response.status_code}")
                return {"error": "Service Fiscal non disponible"}
    except Exception as e:
        logger.error(f"Error calling Fiscal API: {e}")
        return {"error": str(e)}

async def call_rag_api(description: str) -> Dict[str, Any]:
    """Appelle RAG DZ pour récupérer les références officielles"""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{RAG_API_URL}/api/rag/query",
                json={
                    "query": description,
                    "top_k": 5,
                    "include_sources": True
                }
            )
            if response.status_code == 200:
                return response.json()
            else:
                logger.warning(f"RAG API returned {response.status_code}")
                return {"error": "Service RAG non disponible"}
    except Exception as e:
        logger.error(f"Error calling RAG API: {e}")
        return {"error": str(e)}

async def call_park_api(description: str, goal_type: GoalType) -> Dict[str, Any]:
    """Appelle iaFactoryPark pour générer une fiche structurée"""
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{PARK_API_URL}/api/park/sparkpage",
                json={
                    "theme": f"Guide PME Algérie : {description[:100]}",
                    "style": "professional",
                    "sections": ["introduction", "etapes", "checklist", "ressources"],
                    "context": f"Type d'objectif: {goal_type.value}"
                }
            )
            if response.status_code == 200:
                return response.json()
            else:
                logger.warning(f"Park API returned {response.status_code}")
                return {"error": "Service Park non disponible"}
    except Exception as e:
        logger.error(f"Error calling Park API: {e}")
        return {"error": str(e)}

async def check_and_consume_credits(user_id: str, credits: int) -> bool:
    """Vérifie et consomme les crédits via le module Billing"""
    if not user_id:
        return True  # Mode démo sans authentification
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Vérifier les crédits
            check_response = await client.get(
                f"{BILLING_API_URL}/api/credits/{user_id}/balance"
            )
            if check_response.status_code != 200:
                return False
            
            balance = check_response.json().get("balance", 0)
            if balance < credits:
                return False
            
            # Consommer les crédits
            consume_response = await client.post(
                f"{BILLING_API_URL}/api/credits/{user_id}/consume",
                json={
                    "amount": credits,
                    "module": "pme_copilot",
                    "description": "Analyse PME DZ"
                }
            )
            return consume_response.status_code == 200
    except Exception as e:
        logger.error(f"Error with credits: {e}")
        return True  # En cas d'erreur, on laisse passer (fail-open)

def generate_global_summary(legal_data: Dict, fiscal_data: Dict, description: str, goal_type: GoalType) -> str:
    """Génère un résumé global à partir des données collectées"""
    
    # Extraire les éléments clés
    legal_summary = legal_data.get("summary", legal_data.get("answer", ""))
    fiscal_summary = fiscal_data.get("summary", "")
    
    # Construire le résumé
    if goal_type == GoalType.CREATION_ENTREPRISE:
        return f"""
📋 **Analyse de votre projet de création d'entreprise en Algérie**

Votre situation : {description[:200]}...

**Côté juridique :** {legal_summary[:300] if legal_summary else 'Les démarches de création nécessitent plusieurs étapes administratives auprès du CNRC, des impôts et de la CNAS.'}

**Côté fiscal :** {fiscal_summary[:300] if fiscal_summary else 'Selon votre profil, plusieurs régimes fiscaux sont possibles. Les obligations dépendent de votre chiffre d affaires prévisionnel.'}

👉 Consultez les blocs ci-dessous pour le détail des démarches, estimations fiscales et documents nécessaires.
""".strip()
    
    elif goal_type == GoalType.FISCALITE:
        return f"""
💰 **Analyse fiscale pour votre activité en Algérie**

Votre situation : {description[:200]}...

**Obligations fiscales :** {fiscal_summary[:400] if fiscal_summary else 'Les obligations fiscales dépendent de votre statut (freelance, société, commerçant) et de votre chiffre d affaires.'}

**Références légales :** {legal_summary[:200] if legal_summary else 'Les textes fiscaux algériens prévoient différents régimes adaptés aux PME.'}

👉 Consultez le bloc fiscal pour les estimations détaillées de vos impôts et charges sociales.
""".strip()
    
    else:
        return f"""
🏢 **Analyse de votre situation PME en Algérie**

Votre situation : {description[:200]}...

**Points juridiques :** {legal_summary[:250] if legal_summary else 'Plusieurs aspects légaux sont à considérer selon votre activité.'}

**Points fiscaux :** {fiscal_summary[:250] if fiscal_summary else 'Les obligations fiscales varient selon votre régime et votre chiffre d affaires.'}

👉 Consultez les différents blocs pour une vue complète de votre situation.
""".strip()

def extract_juridical_block(legal_data: Dict, goal_type: GoalType) -> JuridicalBlock:
    """Extrait le bloc juridique des données Legal"""
    
    # Valeurs par défaut selon le type d'objectif
    default_steps = {
        GoalType.CREATION_ENTREPRISE: [
            Step(
                title="1. Réservation de la dénomination",
                description="Réserver le nom de votre entreprise auprès du CNRC",
                checklist=["Choisir 3 noms possibles", "Formulaire CNRC", "Frais: ~1000 DZD"]
            ),
            Step(
                title="2. Rédaction des statuts",
                description="Rédiger et faire authentifier les statuts par un notaire",
                checklist=["Statuts conformes au Code de Commerce", "Acte notarié", "Capital social"]
            ),
            Step(
                title="3. Immatriculation au CNRC",
                description="Inscription au Centre National du Registre de Commerce",
                checklist=["Formulaire d'immatriculation", "Copie des statuts", "PV d'AG", "Attestation bancaire"]
            ),
            Step(
                title="4. Immatriculation fiscale",
                description="Obtenir le NIF auprès de la Direction des Impôts",
                checklist=["Registre de commerce", "Statuts", "Pièce d'identité"]
            ),
            Step(
                title="5. Affiliation CNAS/CASNOS",
                description="Inscription aux organismes sociaux",
                checklist=["CNAS pour les salariés", "CASNOS pour les non-salariés", "Déclaration d'activité"]
            )
        ],
        GoalType.GESTION: [
            Step(
                title="Gestion administrative courante",
                description="Obligations administratives régulières pour votre entreprise",
                checklist=["Tenue des registres légaux", "AG annuelle", "Dépôt des comptes"]
            ),
            Step(
                title="Gestion du personnel",
                description="Obligations liées aux employés",
                checklist=["Contrats de travail", "Déclarations CNAS", "Fiches de paie"]
            )
        ],
        GoalType.FISCALITE: [
            Step(
                title="Déclarations fiscales",
                description="Obligations déclaratives auprès des impôts",
                checklist=["G50 mensuelle/trimestrielle", "Bilan annuel", "Déclaration TAP"]
            )
        ],
        GoalType.AUTRE: [
            Step(
                title="Analyse de votre situation",
                description="Évaluation personnalisée de vos besoins",
                checklist=["Identifier les obligations applicables", "Vérifier la conformité"]
            )
        ]
    }
    
    # Essayer d'extraire depuis les données API
    summary = legal_data.get("summary", legal_data.get("answer", ""))
    steps = legal_data.get("steps", [])
    risks = legal_data.get("risks", legal_data.get("limitations", []))
    
    if not summary:
        summary = "Consultez un professionnel du droit pour valider ces informations."
    
    if not steps:
        steps = default_steps.get(goal_type, default_steps[GoalType.AUTRE])
    else:
        # Convertir les steps API en notre format
        steps = [
            Step(
                title=s.get("title", f"Étape {i+1}"),
                description=s.get("description", ""),
                checklist=s.get("checklist", s.get("items", []))
            )
            for i, s in enumerate(steps)
        ]
    
    if not risks:
        risks = [
            "Ces informations sont données à titre indicatif",
            "La réglementation peut évoluer, vérifiez les textes en vigueur",
            "Consultez un avocat ou expert-comptable pour votre cas spécifique"
        ]
    
    return JuridicalBlock(
        summary=summary[:500] if summary else "Analyse juridique en cours...",
        steps=steps,
        risks_and_limits=risks
    )

def extract_fiscal_block(fiscal_data: Dict, profile_type: ProfileType, revenue_hint: Optional[RevenueHint]) -> FiscalBlock:
    """Extrait le bloc fiscal des données Fiscal"""
    
    # Extraire les données de l'API ou utiliser des valeurs par défaut
    summary = fiscal_data.get("summary", "")
    
    # Estimations
    estimates_data = fiscal_data.get("estimates", fiscal_data.get("simulation", {}))
    estimates = FiscalEstimates(
        currency="DZD",
        estimated_tax_total=estimates_data.get("total_impots", estimates_data.get("irg", 0)),
        estimated_social_total=estimates_data.get("total_social", estimates_data.get("cnas", 0) + estimates_data.get("casnos", 0)),
        estimated_net_income=estimates_data.get("revenu_net", 0)
    )
    
    # Ventilation
    breakdown_data = fiscal_data.get("breakdown", fiscal_data.get("details", []))
    breakdown = []
    
    if breakdown_data:
        for item in breakdown_data:
            breakdown.append(TaxBreakdown(
                label=item.get("label", item.get("name", "Taxe")),
                amount=item.get("amount", item.get("montant", 0)),
                notes=item.get("notes", [])
            ))
    else:
        # Valeurs indicatives par défaut selon le profil
        if profile_type == ProfileType.FREELANCE:
            breakdown = [
                TaxBreakdown(label="IRG (Impôt sur le Revenu Global)", amount=0, notes=["Barème progressif de 0% à 35%"]),
                TaxBreakdown(label="CASNOS (Cotisation sociale)", amount=0, notes=["15% du revenu déclaré"]),
                TaxBreakdown(label="TAP (Taxe sur l'Activité Professionnelle)", amount=0, notes=["1% à 2% du CA"])
            ]
        else:
            breakdown = [
                TaxBreakdown(label="IBS (Impôt sur les Bénéfices des Sociétés)", amount=0, notes=["19% à 26% selon activité"]),
                TaxBreakdown(label="TVA", amount=0, notes=["19% taux normal, 9% taux réduit"]),
                TaxBreakdown(label="CNAS (Cotisations employeur)", amount=0, notes=["26% de la masse salariale"]),
                TaxBreakdown(label="TAP", amount=0, notes=["1% à 2% du CA"])
            ]
    
    # Résumé par défaut
    if not summary:
        if profile_type == ProfileType.FREELANCE:
            summary = """
En tant que freelance en Algérie, vous êtes soumis à l'IRG (barème progressif), au CASNOS (15% minimum), 
et à la TAP (1-2% du CA). Le régime micro-entreprise est souvent avantageux pour les petits CA.
"""
        elif profile_type == ProfileType.PME:
            summary = """
Les PME en Algérie sont généralement soumises à l'IBS (19-26%), la TVA (si CA > seuil), 
les charges sociales CNAS (26% employeur + 9% salarié), et la TAP (1-2% du CA).
"""
        elif profile_type == ProfileType.COMMERCANT:
            summary = """
Les commerçants peuvent opter pour le régime forfaitaire (IFU) si leur CA est inférieur aux seuils, 
ou le régime réel. Les obligations incluent IRG/IBS, TVA éventuelle, et cotisations CASNOS.
"""
        else:
            summary = "Les obligations fiscales dépendent de votre statut juridique et de votre chiffre d'affaires."
    
    risks = fiscal_data.get("risks", fiscal_data.get("limitations", [
        "Les montants sont des estimations basées sur les taux en vigueur",
        "Consultez un expert-comptable pour une simulation précise",
        "Les taux peuvent être modifiés par les lois de finances"
    ]))
    
    return FiscalBlock(
        summary=summary.strip(),
        estimates=estimates,
        breakdown=breakdown,
        risks_and_limits=risks
    )

def generate_checklist(goal_type: GoalType, profile_type: ProfileType) -> ChecklistBlock:
    """Génère une checklist adaptée au profil"""
    
    items = []
    
    if goal_type == GoalType.CREATION_ENTREPRISE:
        items = [
            "☐ Choisir la forme juridique (EURL, SARL, SPA, Auto-entrepreneur)",
            "☐ Réserver la dénomination au CNRC",
            "☐ Ouvrir un compte bancaire professionnel",
            "☐ Déposer le capital social",
            "☐ Rédiger les statuts (avec notaire si société)",
            "☐ Obtenir le registre de commerce",
            "☐ S'inscrire aux impôts (NIF)",
            "☐ S'affilier à la CNAS/CASNOS",
            "☐ Déclarer l'activité à la mairie",
            "☐ Souscrire les assurances obligatoires"
        ]
    elif goal_type == GoalType.FISCALITE:
        items = [
            "☐ Vérifier votre régime fiscal actuel",
            "☐ Calculer votre CA prévisionnel/réel",
            "☐ Préparer les déclarations G50",
            "☐ Tenir à jour la comptabilité",
            "☐ Provisionner les impôts et charges",
            "☐ Vérifier les délais de déclaration",
            "☐ Conserver les justificatifs 10 ans"
        ]
    elif goal_type == GoalType.GESTION:
        items = [
            "☐ Mettre à jour les registres légaux",
            "☐ Préparer l'AG annuelle",
            "☐ Déposer les comptes au CNRC",
            "☐ Renouveler les contrats et assurances",
            "☐ Vérifier les obligations sociales",
            "☐ Mettre à jour les contrats de travail"
        ]
    else:
        items = [
            "☐ Identifier votre statut juridique",
            "☐ Lister vos obligations administratives",
            "☐ Vérifier vos obligations fiscales",
            "☐ Consulter un professionnel si besoin"
        ]
    
    # Ajouter des éléments spécifiques au profil
    if profile_type == ProfileType.FREELANCE:
        items.append("☐ Vérifier l'éligibilité au statut auto-entrepreneur")
        items.append("☐ S'inscrire sur les plateformes de facturation")
    elif profile_type == ProfileType.COMMERCANT:
        items.append("☐ Vérifier les autorisations commerciales nécessaires")
        items.append("☐ S'inscrire au registre des commerçants")
    
    return ChecklistBlock(items=items)

def generate_documents(goal_type: GoalType, profile_type: ProfileType) -> DocumentsBlock:
    """Génère les modèles de documents suggérés"""
    
    documents = []
    
    if goal_type == GoalType.CREATION_ENTREPRISE:
        if profile_type == ProfileType.FREELANCE:
            documents = [
                SuggestedDocument(
                    title="Déclaration d'activité Auto-entrepreneur",
                    type="courrier",
                    description="Formulaire de déclaration d'activité pour le statut auto-entrepreneur",
                    template_generated="""
DÉCLARATION D'ACTIVITÉ - AUTO-ENTREPRENEUR

Je soussigné(e) : [NOM PRÉNOM]
Né(e) le : [DATE] à [LIEU]
Adresse : [ADRESSE COMPLÈTE]

Déclare exercer l'activité de : [ACTIVITÉ]
À compter du : [DATE DE DÉBUT]

Lieu d'exercice : [ADRESSE PROFESSIONNELLE]

Fait à ____________, le ___/___/______

Signature
"""
                ),
                SuggestedDocument(
                    title="Modèle de facture",
                    type="autre",
                    description="Template de facture conforme aux exigences légales algériennes",
                    template_generated="""
FACTURE N° [NUMÉRO]

[VOTRE NOM / RAISON SOCIALE]
[ADRESSE]
NIF : [NUMÉRO]
RC : [NUMÉRO]

Client : [NOM CLIENT]
Adresse : [ADRESSE CLIENT]

Date : ___/___/______

| Désignation | Quantité | Prix Unitaire | Total |
|-------------|----------|---------------|-------|
| [SERVICE]   | 1        | _____ DZD     | _____ |

Total HT : _____ DZD
TVA (19%) : _____ DZD
Total TTC : _____ DZD

Mode de paiement : [VIREMENT/CHÈQUE]
"""
                )
            ]
        else:
            documents = [
                SuggestedDocument(
                    title="Modèle de statuts EURL/SARL",
                    type="statuts",
                    description="Modèle de statuts pour société à responsabilité limitée",
                    template_generated="""
STATUTS DE LA SOCIÉTÉ [NOM]
EURL / SARL AU CAPITAL DE [MONTANT] DZD

ARTICLE 1 - FORME
Il est formé entre les soussignés une société à responsabilité limitée...

ARTICLE 2 - OBJET
La société a pour objet : [ACTIVITÉS]

ARTICLE 3 - DÉNOMINATION
La dénomination sociale est : [NOM DE LA SOCIÉTÉ]

ARTICLE 4 - SIÈGE SOCIAL
Le siège social est fixé à : [ADRESSE]

ARTICLE 5 - DURÉE
La durée de la société est fixée à 99 années...

ARTICLE 6 - CAPITAL SOCIAL
Le capital social est fixé à [MONTANT] DZD...

[À COMPLÉTER AVEC UN NOTAIRE]
"""
                ),
                SuggestedDocument(
                    title="PV d'Assemblée Générale Constitutive",
                    type="autre",
                    description="Procès-verbal de l'AG de constitution",
                    template_generated="""
PROCÈS-VERBAL DE L'ASSEMBLÉE GÉNÉRALE CONSTITUTIVE

L'an [ANNÉE], le [DATE]
Les associés de la société [NOM] se sont réunis en Assemblée Générale Constitutive...

ORDRE DU JOUR :
1. Adoption des statuts
2. Nomination du gérant
3. Pouvoirs pour les formalités

RÉSOLUTIONS :
Première résolution : Les statuts sont adoptés à l'unanimité...
"""
                )
            ]
        
        # Documents communs création
        documents.append(SuggestedDocument(
            title="Lettre à la Direction des Impôts",
            type="courrier",
            description="Demande d'immatriculation fiscale (NIF)",
            template_generated="""
À : Direction des Impôts de [WILAYA]
Objet : Demande d'immatriculation fiscale

Madame, Monsieur le Directeur,

J'ai l'honneur de solliciter l'immatriculation fiscale de mon entreprise :

Dénomination : [NOM]
Forme juridique : [FORME]
Activité : [ACTIVITÉ]
Adresse : [ADRESSE]
N° Registre de Commerce : [RC]

Vous trouverez ci-joint les pièces justificatives requises.

Dans l'attente d'une suite favorable, veuillez agréer...

[SIGNATURE]
"""
        ))
    
    elif goal_type == GoalType.FISCALITE:
        documents = [
            SuggestedDocument(
                title="Modèle déclaration G50",
                type="autre",
                description="Aide au remplissage de la déclaration G50",
                template_generated="""
DÉCLARATION G50 - GUIDE DE REMPLISSAGE

Période : Mois de [MOIS] [ANNÉE]

SECTION 1 - CHIFFRE D'AFFAIRES
- CA du mois : _____ DZD
- Cumul annuel : _____ DZD

SECTION 2 - TVA
- TVA collectée : _____ DZD
- TVA déductible : _____ DZD
- TVA à payer : _____ DZD

SECTION 3 - TAP
- Base imposable : _____ DZD
- Taux applicable : ___%
- TAP à payer : _____ DZD

À déposer avant le 20 du mois suivant
"""
            )
        ]
    
    return DocumentsBlock(suggested_documents=documents)

def extract_references(rag_data: Dict, legal_data: Dict) -> ReferencesBlock:
    """Extrait les références des données RAG et Legal"""
    
    items = []
    
    # Extraire les références du RAG
    rag_sources = rag_data.get("sources", rag_data.get("documents", []))
    for source in rag_sources[:5]:  # Limiter à 5 références
        items.append(ReferenceItem(
            label=source.get("title", source.get("name", "Document"))[:100],
            source_name=source.get("source", source.get("origin", "Base documentaire DZ")),
            source_url=source.get("url", None),
            date=source.get("date", None)
        ))
    
    # Extraire les références du Legal
    legal_refs = legal_data.get("references", legal_data.get("sources", []))
    for ref in legal_refs[:3]:
        items.append(ReferenceItem(
            label=ref.get("title", ref.get("text", "Référence juridique"))[:100],
            source_name=ref.get("source", "Code Algérien"),
            source_url=ref.get("url", None),
            date=ref.get("date", None)
        ))
    
    # Ajouter des références par défaut si vide
    if not items:
        items = [
            ReferenceItem(
                label="Code de Commerce Algérien",
                source_name="Journal Officiel",
                source_url="https://www.joradp.dz",
                date="2023"
            ),
            ReferenceItem(
                label="Code des Impôts Directs et Taxes Assimilées",
                source_name="DGI Algérie",
                source_url="https://www.mfdgi.gov.dz",
                date="2024"
            ),
            ReferenceItem(
                label="Guide CNRC - Création d'entreprise",
                source_name="CNRC",
                source_url="https://www.cnrc.org.dz",
                date="2024"
            ),
            ReferenceItem(
                label="CNAS - Affiliation et cotisations",
                source_name="CNAS",
                source_url="https://www.cnas.dz",
                date="2024"
            )
        ]
    
    return ReferencesBlock(items=items)

def generate_followup_questions(goal_type: GoalType, profile_type: ProfileType) -> List[str]:
    """Génère des questions de suivi pertinentes"""
    
    base_questions = [
        "Voulez-vous plus de détails sur une étape spécifique ?",
        "Avez-vous besoin d'aide pour trouver un expert-comptable ou avocat ?"
    ]
    
    if goal_type == GoalType.CREATION_ENTREPRISE:
        return base_questions + [
            "Quelle forme juridique vous intéresse le plus (EURL, SARL, auto-entrepreneur) ?",
            "Avez-vous déjà un local commercial ou travaillez-vous depuis chez vous ?",
            "Prévoyez-vous d'embaucher des salariés dès le départ ?",
            "Quel est votre capital de départ estimé ?"
        ]
    elif goal_type == GoalType.FISCALITE:
        return base_questions + [
            "Voulez-vous une simulation fiscale plus détaillée ?",
            "Êtes-vous à jour dans vos déclarations précédentes ?",
            "Avez-vous des crédits de TVA à récupérer ?",
            "Souhaitez-vous optimiser votre situation fiscale ?"
        ]
    elif goal_type == GoalType.GESTION:
        return base_questions + [
            "Avez-vous des difficultés avec la gestion du personnel ?",
            "Vos comptes annuels sont-ils à jour ?",
            "Avez-vous besoin d'aide pour un contentieux ?",
            "Souhaitez-vous revoir vos contrats commerciaux ?"
        ]
    else:
        return base_questions + [
            "Pouvez-vous préciser votre situation ?",
            "Quel est votre objectif principal à court terme ?",
            "Avez-vous des contraintes particulières ?"
        ]

# ============================================================================
# ENDPOINTS
# ============================================================================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "pme-copilot",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/pme/info")
async def get_info():
    """Informations sur le service"""
    return {
        "name": "Pack PME DZ - CoPilot IA",
        "description": "Assistant IA unifié pour les petites entreprises en Algérie",
        "version": "1.0.0",
        "credits_per_analysis": PME_ANALYSIS_CREDITS,
        "modules_integrated": ["rag-dz", "dz-legal", "dz-fiscal", "ia-factory-park"],
        "supported_goals": [g.value for g in GoalType],
        "supported_profiles": [p.value for p in ProfileType]
    }

@app.post("/api/pme/analyze", response_model=PMEAnalyzeResponse)
async def analyze_pme_situation(request: PMEAnalyzeRequest):
    """
    Analyse complète de la situation PME
    
    Orchestre les appels vers Legal, Fiscal, RAG et Park pour fournir
    une réponse unifiée et actionnable.
    """
    import uuid
    request_id = str(uuid.uuid4())[:8]
    
    logger.info(f"[{request_id}] Nouvelle analyse PME: {request.goal_type.value} / {request.profile_type.value}")
    
    # Vérifier et consommer les crédits
    if request.user_id:
        credits_ok = await check_and_consume_credits(request.user_id, PME_ANALYSIS_CREDITS)
        if not credits_ok:
            raise HTTPException(
                status_code=402,
                detail={
                    "error": "Crédits insuffisants",
                    "required": PME_ANALYSIS_CREDITS,
                    "message": "Veuillez recharger vos crédits pour utiliser le Pack PME DZ"
                }
            )
    
    # Appeler les services en parallèle
    try:
        legal_task = call_legal_api(request.description, request.goal_type)
        fiscal_task = call_fiscal_api(request.description, request.profile_type, request.revenue_hint)
        rag_task = call_rag_api(request.description)
        
        # Attendre toutes les réponses
        legal_data, fiscal_data, rag_data = await asyncio.gather(
            legal_task, fiscal_task, rag_task,
            return_exceptions=True
        )
        
        # Gérer les exceptions
        if isinstance(legal_data, Exception):
            logger.error(f"[{request_id}] Legal API error: {legal_data}")
            legal_data = {}
        if isinstance(fiscal_data, Exception):
            logger.error(f"[{request_id}] Fiscal API error: {fiscal_data}")
            fiscal_data = {}
        if isinstance(rag_data, Exception):
            logger.error(f"[{request_id}] RAG API error: {rag_data}")
            rag_data = {}
        
        logger.info(f"[{request_id}] Services appelés avec succès")
        
    except Exception as e:
        logger.error(f"[{request_id}] Orchestration error: {e}")
        legal_data, fiscal_data, rag_data = {}, {}, {}
    
    # Construire la réponse unifiée
    try:
        response = PMEAnalyzeResponse(
            success=True,
            global_summary=generate_global_summary(legal_data, fiscal_data, request.description, request.goal_type),
            juridical_block=extract_juridical_block(legal_data, request.goal_type),
            fiscal_block=extract_fiscal_block(fiscal_data, request.profile_type, request.revenue_hint),
            checklist_block=generate_checklist(request.goal_type, request.profile_type),
            documents_block=generate_documents(request.goal_type, request.profile_type),
            references_block=extract_references(rag_data, legal_data),
            followup_questions=generate_followup_questions(request.goal_type, request.profile_type),
            credits_used=PME_ANALYSIS_CREDITS if request.user_id else 0,
            analysis_timestamp=datetime.now().isoformat(),
            request_id=request_id
        )
        
        logger.info(f"[{request_id}] Analyse terminée avec succès")
        return response
        
    except Exception as e:
        logger.error(f"[{request_id}] Response building error: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur lors de la construction de la réponse: {str(e)}")

@app.get("/api/pme/examples")
async def get_examples():
    """Exemples de cas d'usage pour guider les utilisateurs"""
    return {
        "examples": [
            {
                "description": "Je veux créer une EURL pour faire du commerce en ligne de produits informatiques",
                "goal_type": "creation_entreprise",
                "profile_type": "pme",
                "activity_sector": "e-commerce informatique"
            },
            {
                "description": "Je suis développeur web freelance, quels impôts et charges dois-je payer ?",
                "goal_type": "fiscalite",
                "profile_type": "freelance",
                "activity_sector": "développement web"
            },
            {
                "description": "Je veux ouvrir un restaurant à Alger, quelles sont les démarches ?",
                "goal_type": "creation_entreprise",
                "profile_type": "commercant",
                "activity_sector": "restauration"
            },
            {
                "description": "Je veux embaucher mon premier salarié, que dois-je déclarer ?",
                "goal_type": "gestion",
                "profile_type": "pme",
                "activity_sector": "général"
            },
            {
                "description": "Comment passer du statut auto-entrepreneur à une SARL ?",
                "goal_type": "gestion",
                "profile_type": "freelance",
                "activity_sector": "services"
            }
        ]
    }

# Point d'entrée
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8210)
