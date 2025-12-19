"""
StartupDZ-Onboarding — Assistant Création d'Entreprise en Algérie
==================================================================
Module wizard guidé pour accompagner la création d'entreprise :
- Recommandation forme juridique (EURL, SARL, Entreprise individuelle...)
- Étapes administratives (CNRC, DGI, CNAS, CASNOS, Banque, Notaire)
- Génération de documents (statuts, lettres, checklist)
- Intégration avec Legal, Fiscal, RAG, Park, CRM

Auteur: iaFactory Algeria
Date: Novembre 2025
"""

import os
import uuid
import asyncio
import httpx
from datetime import datetime
from typing import Optional, List, Dict, Any, Literal
from enum import Enum
from pydantic import BaseModel, Field
from fastapi import FastAPI, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import logging
import json

# Configuration logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("startupdz-onboarding")

# ============================================================================
# CONFIGURATION
# ============================================================================

# URLs des services internes
LEGAL_API_URL = os.getenv("LEGAL_API_URL", "http://iaf-dz-legal-prod:8200")
FISCAL_API_URL = os.getenv("FISCAL_API_URL", "http://iaf-dz-fiscal-prod:8201")
RAG_API_URL = os.getenv("RAG_API_URL", "http://iaf-rag-api-prod:8180")
PARK_API_URL = os.getenv("PARK_API_URL", "http://iaf-park-prod:8195")
BILLING_API_URL = os.getenv("BILLING_API_URL", "http://iaf-billing-prod:8207")
CRM_API_URL = os.getenv("CRM_API_URL", "http://iaf-crm-ia-prod:8212")

# Crédits par analyse
STARTUPDZ_CREDITS = int(os.getenv("STARTUPDZ_CREDITS", "10"))

# ============================================================================
# ENUMS
# ============================================================================

class TargetCustomers(str, Enum):
    B2B = "B2B"
    B2C = "B2C"
    MIX = "mix"

class RevenueRange(str, Enum):
    LESS_1M = "<1M"
    FROM_1_TO_5M = "1-5M"
    FROM_5_TO_20M = "5-20M"
    MORE_20M = ">20M"

class MainGoal(str, Enum):
    FREELANCE = "freelance"
    SMALL_COMPANY = "small_company"
    STARTUP_TECH = "startup_tech"
    REGULARISATION = "regularisation"

class LegalForm(str, Enum):
    PERSONNE_PHYSIQUE = "Personne physique / Entreprise individuelle"
    AUTO_ENTREPRENEUR = "Auto-entrepreneur"
    EURL = "EURL"
    SARL = "SARL"
    SPA = "SPA"
    SNC = "SNC"

class FiscalRegime(str, Enum):
    FORFAITAIRE = "forfaitaire"
    REEL = "réel"
    IFU = "IFU"
    SIMPLIFIE = "simplifié"

# ============================================================================
# MODÈLES DE REQUÊTE
# ============================================================================

class StartupOnboardRequest(BaseModel):
    """Requête pour l'analyse de création d'entreprise"""
    project_name: str = Field(..., min_length=2, description="Nom du projet / future entreprise")
    activity_sector: str = Field(..., description="Secteur d'activité (ex: dev web, commerce, café)")
    target_customers: TargetCustomers = Field(default=TargetCustomers.MIX)
    expected_revenue_range: RevenueRange = Field(default=RevenueRange.FROM_1_TO_5M)
    has_partners: bool = Field(default=False, description="A des associés")
    partners_count: int = Field(default=0, ge=0)
    wants_limited_liability: bool = Field(default=True, description="Souhaite limiter sa responsabilité")
    city: str = Field(default="Alger", description="Ville principale d'activité")
    main_goal: MainGoal = Field(default=MainGoal.SMALL_COMPANY)
    needs_employees: bool = Field(default=False)
    needs_import_export: bool = Field(default=False)
    needs_bank_financing: bool = Field(default=False)
    user_id: Optional[str] = None

# ============================================================================
# MODÈLES DE RÉPONSE
# ============================================================================

class LegalFormAlternative(BaseModel):
    form: str
    pros: List[str]
    cons: List[str]

class RecommendedLegalForm(BaseModel):
    form: str
    justification: str
    alternatives: List[LegalFormAlternative]

class AdminStep(BaseModel):
    title: str
    description: str
    checklist: List[str]
    estimated_duration: Optional[str] = None
    estimated_cost: Optional[str] = None

class AdminStepsBlock(BaseModel):
    summary: str
    steps: List[AdminStep]

class GeneratedTemplate(BaseModel):
    title: str
    type: str  # "statuts", "courrier", "checklist"
    content: str

class DocsBlock(BaseModel):
    required_documents: List[str]
    generated_templates: List[GeneratedTemplate]

class FiscalBlock(BaseModel):
    summary: str
    regime_suggested: str
    notes: List[str]
    obligations: List[str] = []

class ReferenceItem(BaseModel):
    label: str
    source_name: str
    source_url: Optional[str] = None
    date: Optional[str] = None

class ReferencesBlock(BaseModel):
    items: List[ReferenceItem]

class StartupOnboardResponse(BaseModel):
    """Réponse complète de l'analyse de création d'entreprise"""
    request_id: str
    project_name: str
    recommended_legal_form: RecommendedLegalForm
    admin_steps_block: AdminStepsBlock
    docs_block: DocsBlock
    fiscal_block: FiscalBlock
    references_block: ReferencesBlock
    global_summary: str
    followup_questions: List[str]
    credits_used: int = STARTUPDZ_CREDITS
    created_at: str
    crm_case_id: Optional[str] = None

# ============================================================================
# APPLICATION FASTAPI
# ============================================================================

app = FastAPI(
    title="StartupDZ-Onboarding API",
    description="Assistant IA pour la création d'entreprise en Algérie",
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

# ============================================================================
# FONCTIONS UTILITAIRES
# ============================================================================

def determine_legal_form(request: StartupOnboardRequest) -> RecommendedLegalForm:
    """Détermine la forme juridique recommandée basée sur le profil"""
    
    # Logique de décision
    if request.main_goal == MainGoal.FREELANCE and not request.has_partners:
        if request.expected_revenue_range == RevenueRange.LESS_1M:
            form = "Auto-entrepreneur"
            justification = (
                "Pour une activité freelance avec un chiffre d'affaires inférieur à 1M DZD/an, "
                "le statut d'auto-entrepreneur est idéal : simplicité administrative, régime fiscal "
                "forfaitaire avantageux (IFU), pas de capital requis."
            )
        else:
            form = "Personne physique / Entreprise individuelle"
            justification = (
                "Pour une activité solo avec des revenus plus importants, l'entreprise individuelle "
                "offre plus de flexibilité tout en restant simple à gérer. Attention : responsabilité "
                "illimitée sur le patrimoine personnel."
            )
    elif request.has_partners:
        if request.partners_count >= 2 or request.expected_revenue_range in [RevenueRange.FROM_5_TO_20M, RevenueRange.MORE_20M]:
            form = "SARL"
            justification = (
                f"Avec {request.partners_count + 1} associés et un potentiel de revenus significatif, "
                "la SARL est recommandée : responsabilité limitée aux apports, structure adaptée aux PME, "
                "capital minimum de 100,000 DZD."
            )
        else:
            form = "SARL"
            justification = (
                "Même avec peu d'associés, la SARL protège le patrimoine personnel de chacun "
                "et offre un cadre juridique solide pour développer l'activité."
            )
    elif request.wants_limited_liability:
        form = "EURL"
        justification = (
            "L'EURL (Entreprise Unipersonnelle à Responsabilité Limitée) est parfaite pour un "
            "entrepreneur solo souhaitant protéger son patrimoine personnel. Capital minimum : 100,000 DZD."
        )
    elif request.main_goal == MainGoal.STARTUP_TECH:
        form = "SARL" if not request.has_partners else "SARL"
        justification = (
            "Pour une startup tech, la SARL offre la flexibilité nécessaire pour accueillir "
            "des investisseurs, recruter, et structurer la croissance. Possibilité d'évoluer vers SPA."
        )
    else:
        form = "EURL"
        justification = (
            "Par défaut, l'EURL offre un bon équilibre entre protection juridique et simplicité "
            "de gestion pour un entrepreneur individuel."
        )
    
    # Alternatives
    alternatives = []
    
    if form != "Auto-entrepreneur":
        alternatives.append(LegalFormAlternative(
            form="Auto-entrepreneur",
            pros=["Simplicité maximale", "Régime fiscal IFU avantageux", "Pas de capital requis", "Cotisations réduites"],
            cons=["Plafonné à 5M DZD/an", "Pas d'associés possibles", "Image moins professionnelle"]
        ))
    
    if form != "Personne physique / Entreprise individuelle":
        alternatives.append(LegalFormAlternative(
            form="Personne physique / Entreprise individuelle",
            pros=["Création simple et rapide", "Gestion allégée", "Pas de capital minimum"],
            cons=["Responsabilité illimitée", "Pas de distinction patrimoine pro/perso"]
        ))
    
    if form != "EURL":
        alternatives.append(LegalFormAlternative(
            form="EURL",
            pros=["Responsabilité limitée", "Un seul associé", "Capital minimum 100,000 DZD"],
            cons=["Formalités de création plus lourdes", "Comptabilité obligatoire"]
        ))
    
    if form != "SARL" and request.has_partners:
        alternatives.append(LegalFormAlternative(
            form="SARL",
            pros=["Plusieurs associés (2-50)", "Responsabilité limitée", "Structure évolutive"],
            cons=["Statuts à rédiger", "AG obligatoires", "Coût de création plus élevé"]
        ))
    
    return RecommendedLegalForm(
        form=form,
        justification=justification,
        alternatives=alternatives[:3]  # Max 3 alternatives
    )


def generate_admin_steps(request: StartupOnboardRequest, legal_form: str) -> AdminStepsBlock:
    """Génère les étapes administratives détaillées"""
    
    steps = []
    
    # CNRC - Toujours nécessaire
    cnrc_checklist = [
        "Formulaire d'immatriculation au registre du commerce",
        "Copie CNI du gérant/entrepreneur",
        "Extrait de naissance n°12",
        "Justificatif de domiciliation (bail commercial ou attestation)",
        "Attestation de dépôt de capital (si société)"
    ]
    
    if legal_form in ["EURL", "SARL", "SPA"]:
        cnrc_checklist.extend([
            "Statuts notariés (2 exemplaires)",
            "PV de nomination du gérant",
            "Attestation de blocage du capital bancaire"
        ])
    
    steps.append(AdminStep(
        title="1. CNRC — Immatriculation au Registre du Commerce",
        description=(
            f"Première étape obligatoire : s'inscrire au Centre National du Registre du Commerce. "
            f"Pour une {legal_form}, prévoir un dossier complet avec toutes les pièces justificatives."
        ),
        checklist=cnrc_checklist,
        estimated_duration="3 à 7 jours ouvrables",
        estimated_cost="5,000 à 15,000 DZD selon la forme"
    ))
    
    # Notaire (si société)
    if legal_form in ["EURL", "SARL", "SPA"]:
        steps.append(AdminStep(
            title="2. Notaire — Rédaction et signature des statuts",
            description=(
                "Passage obligatoire chez le notaire pour rédiger, authentifier et enregistrer "
                "les statuts de votre société. Le notaire se charge aussi de l'enregistrement fiscal."
            ),
            checklist=[
                "CNI de tous les associés",
                "Informations sur l'objet social",
                "Montant et répartition du capital",
                "Adresse du siège social",
                "Désignation du gérant"
            ],
            estimated_duration="1 à 3 jours",
            estimated_cost="25,000 à 80,000 DZD selon le capital"
        ))
    
    # Banque
    bank_checklist = [
        "Copie du registre de commerce",
        "Copie CNI du gérant",
        "Statuts (si société)",
        "Cachet de l'entreprise"
    ]
    
    if legal_form in ["EURL", "SARL"]:
        bank_checklist.insert(0, "Attestation de blocage du capital (avant CNRC)")
    
    steps.append(AdminStep(
        title=f"{'3' if legal_form in ['EURL', 'SARL', 'SPA'] else '2'}. Banque — Ouverture du compte professionnel",
        description=(
            "Ouvrir un compte bancaire professionnel est obligatoire. Pour les sociétés, le capital "
            "doit être déposé et bloqué avant l'immatriculation au CNRC."
        ),
        checklist=bank_checklist,
        estimated_duration="1 à 5 jours",
        estimated_cost="Frais d'ouverture variables selon la banque"
    ))
    
    # DGI - Impôts
    dgi_step_num = 4 if legal_form in ["EURL", "SARL", "SPA"] else 3
    steps.append(AdminStep(
        title=f"{dgi_step_num}. DGI — Déclarations fiscales et obtention NIF",
        description=(
            "S'inscrire auprès de la Direction Générale des Impôts pour obtenir votre NIF "
            "(Numéro d'Identification Fiscale) et connaître votre régime d'imposition."
        ),
        checklist=[
            "Copie du registre de commerce",
            "Statuts (si société)",
            "Formulaire G50 (déclaration d'existence)",
            "Justificatif de siège social"
        ],
        estimated_duration="5 à 10 jours",
        estimated_cost="Gratuit"
    ))
    
    # CASNOS (toujours pour le gérant / indépendant)
    casnos_step_num = dgi_step_num + 1
    steps.append(AdminStep(
        title=f"{casnos_step_num}. CASNOS — Affiliation sécurité sociale du gérant",
        description=(
            "Affiliation obligatoire à la CASNOS (Caisse Nationale de Sécurité Sociale des "
            "Non-Salariés) pour le gérant ou l'entrepreneur individuel."
        ),
        checklist=[
            "Copie du registre de commerce",
            "Copie CNI",
            "Extrait de naissance",
            "Photo d'identité"
        ],
        estimated_duration="1 à 3 jours",
        estimated_cost="Cotisations trimestrielles (~18,000 DZD/trimestre minimum)"
    ))
    
    # CNAS (si employés)
    if request.needs_employees:
        cnas_step_num = casnos_step_num + 1
        steps.append(AdminStep(
            title=f"{cnas_step_num}. CNAS — Affiliation employeur",
            description=(
                "Si vous prévoyez d'embaucher des salariés, vous devez vous affilier à la CNAS "
                "(Caisse Nationale des Assurances Sociales) en tant qu'employeur."
            ),
            checklist=[
                "Copie du registre de commerce",
                "Statuts (si société)",
                "Liste des employés avec leurs CNI",
                "Contrats de travail"
            ],
            estimated_duration="3 à 7 jours",
            estimated_cost="Cotisations : ~35% du salaire brut (part patronale + salariale)"
        ))
    
    # Import/Export
    if request.needs_import_export:
        ie_step_num = (casnos_step_num + 2) if request.needs_employees else (casnos_step_num + 1)
        steps.append(AdminStep(
            title=f"{ie_step_num}. Douanes — Agrément import/export",
            description=(
                "Pour exercer une activité d'import/export, vous devez obtenir un agrément douanier "
                "et éventuellement une licence commerciale selon les produits."
            ),
            checklist=[
                "Registre de commerce avec activité import/export",
                "Attestation fiscale",
                "Attestation CNAS/CASNOS",
                "Demande d'agrément douanier"
            ],
            estimated_duration="15 à 30 jours",
            estimated_cost="Variable selon l'activité"
        ))
    
    summary = (
        f"Pour créer votre {legal_form} dans le secteur '{request.activity_sector}' à {request.city}, "
        f"vous devez suivre {len(steps)} étapes principales. Comptez environ 2 à 4 semaines pour "
        f"l'ensemble des démarches si vous êtes bien préparé."
    )
    
    return AdminStepsBlock(summary=summary, steps=steps)


def generate_documents(request: StartupOnboardRequest, legal_form: str) -> DocsBlock:
    """Génère la liste des documents et les modèles"""
    
    # Documents requis de base
    required_docs = [
        "Copie de la CNI (recto-verso) du gérant/entrepreneur",
        "Extrait de naissance n°12 (moins de 3 mois)",
        "Extrait du casier judiciaire n°3 (moins de 3 mois)",
        "2 photos d'identité récentes",
        "Justificatif de domicile personnel",
        "Bail commercial ou titre de propriété du local",
        "Plan de situation du local commercial"
    ]
    
    if legal_form in ["EURL", "SARL", "SPA"]:
        required_docs.extend([
            "Attestation de blocage du capital (banque)",
            "Statuts notariés (2 exemplaires originaux)",
            "PV de l'assemblée constitutive",
            "PV de nomination du gérant"
        ])
    
    if request.has_partners:
        required_docs.append("CNI et extraits de naissance de tous les associés")
    
    # Modèles générés
    templates = []
    
    # Statuts si société
    if legal_form in ["EURL", "SARL"]:
        capital = "100,000 DZD" if legal_form == "EURL" else "100,000 DZD"
        form_type = "unipersonnelle (EURL)" if legal_form == "EURL" else "(SARL)"
        apports_text = "L'associé unique apporte" if legal_form == "EURL" else "Les associés apportent"
        assemblees_text = "L'associé unique exerce les pouvoirs dévolus à l'assemblée des associés." if legal_form == "EURL" else "Les décisions collectives sont prises en assemblée générale."
        signature_text = "L'associé unique" if legal_form == "EURL" else "Les associés"
        separator = "=" * 50
        statuts_content = f"""
STATUTS DE LA SOCIÉTÉ {request.project_name.upper()}
{separator}

TITRE I — FORME, OBJET, DÉNOMINATION, SIÈGE, DURÉE

Article 1 — Forme
Il est formé entre les soussignés une société à responsabilité limitée {form_type} régie par le Code de commerce algérien.

Article 2 — Objet
La société a pour objet, en Algérie et à l'étranger :
- {request.activity_sector}
- Toutes opérations commerciales, industrielles, mobilières et immobilières se rattachant directement ou indirectement à l'objet social.

Article 3 — Dénomination
La société prend la dénomination : « {request.project_name.upper()} »
Dans tous les actes et documents, cette dénomination sera précédée ou suivie des mots "{legal_form}" et de l'indication du capital social.

Article 4 — Siège social
Le siège social est fixé à : {request.city}, Algérie
[Adresse complète à préciser]

Article 5 — Durée
La durée de la société est fixée à 99 années à compter de son immatriculation au registre du commerce.

TITRE II — APPORTS, CAPITAL SOCIAL

Article 6 — Capital social
Le capital social est fixé à la somme de {capital} divisé en parts sociales de 1,000 DZD chacune, numérotées de 1 à 100.

Article 7 — Apports
{apports_text} la totalité du capital en numéraire.

TITRE III — GÉRANCE

Article 8 — Gérant
La société est gérée par un ou plusieurs gérants, personnes physiques, associés ou non.
Le premier gérant est : [NOM PRÉNOM]

Article 9 — Pouvoirs du gérant
Le gérant est investi des pouvoirs les plus étendus pour agir au nom de la société.

TITRE IV — DÉCISIONS COLLECTIVES

Article 10 — Assemblées
{assemblees_text}

TITRE V — EXERCICE SOCIAL, RÉPARTITION DES BÉNÉFICES

Article 11 — Exercice social
L'exercice social commence le 1er janvier et se termine le 31 décembre de chaque année.

Article 12 — Bénéfices
Le bénéfice net, après déduction des frais et charges, est réparti conformément aux dispositions légales.

Fait à {request.city}, le [DATE]

{signature_text}

[SIGNATURES]
"""
        templates.append(GeneratedTemplate(
            title=f"Modèle de statuts {legal_form}",
            type="statuts",
            content=statuts_content.strip()
        ))
    
    # Lettre à la banque
    objet_blocage = "et blocage de capital" if legal_form in ["EURL", "SARL"] else ""
    capital_line = "Capital social : 100,000 DZD" if legal_form in ["EURL", "SARL"] else ""
    blocage_paragraph = "Je vous prie de bien vouloir procéder au blocage du capital social conformément à la réglementation en vigueur, en vue de l'immatriculation au registre du commerce." if legal_form in ["EURL", "SARL"] else ""
    
    lettre_banque = f"""
{request.city}, le [DATE]

À l'attention du Directeur de l'agence
[NOM DE LA BANQUE]
[ADRESSE DE L'AGENCE]

Objet : Demande d'ouverture d'un compte commercial {objet_blocage}

Monsieur le Directeur,

J'ai l'honneur de solliciter l'ouverture d'un compte commercial au nom de :

Dénomination : {request.project_name.upper()}
Forme juridique : {legal_form}
Activité : {request.activity_sector}
Adresse : {request.city}
{capital_line}

{blocage_paragraph}

Vous trouverez ci-joint les documents suivants :
- Copie de la CNI du gérant
- Projet de statuts (si société)
- Justificatif de domiciliation

Dans l'attente de votre réponse favorable, je vous prie d'agréer, Monsieur le Directeur, l'expression de mes salutations distinguées.

[NOM PRÉNOM]
Gérant

Pièces jointes : [Liste]
"""
    templates.append(GeneratedTemplate(
        title="Lettre de demande d'ouverture de compte bancaire",
        type="courrier",
        content=lettre_banque.strip()
    ))
    
    # Checklist avant CNRC
    separator2 = "=" * 40
    docs_societe_section = ""
    if legal_form in ["EURL", "SARL"]:
        docs_societe_section = """
✅ DOCUMENTS SOCIÉTÉ
[ ] Statuts notariés (2 exemplaires)
[ ] PV nomination gérant
[ ] Attestation blocage capital (banque)
"""
    
    checklist_cnrc = f"""
CHECKLIST AVANT VISITE AU CNRC
{separator2}

✅ DOCUMENTS PERSONNELS
[ ] CNI (copie recto-verso lisible)
[ ] Extrait de naissance n°12 (< 3 mois)
[ ] Casier judiciaire n°3 (< 3 mois)
[ ] 2 photos d'identité

✅ DOCUMENTS LOCAL COMMERCIAL
[ ] Bail commercial notarié OU
[ ] Titre de propriété OU
[ ] Attestation de domiciliation
[ ] Plan de situation
{docs_societe_section}
✅ À PRÉPARER
[ ] Montant des frais d'immatriculation (~10,000 DZD)
[ ] Cachet de l'entreprise (peut être fait après)
[ ] Formulaire d'immatriculation (sur place)

📍 CNRC de {request.city}
Horaires : 8h00 - 15h30 (dimanche-jeudi)

Conseil : Arrivez tôt le matin pour éviter l'attente !
"""
    templates.append(GeneratedTemplate(
        title="Checklist avant visite au CNRC",
        type="checklist",
        content=checklist_cnrc.strip()
    ))
    
    return DocsBlock(
        required_documents=required_docs,
        generated_templates=templates
    )


def determine_fiscal_regime(request: StartupOnboardRequest, legal_form: str) -> FiscalBlock:
    """Détermine le régime fiscal recommandé"""
    
    if legal_form == "Auto-entrepreneur":
        regime = "IFU"
        summary = (
            "En tant qu'auto-entrepreneur, vous bénéficiez du régime de l'Impôt Forfaitaire Unique (IFU). "
            "C'est le régime le plus simple : un seul impôt qui remplace l'IRG, la TVA et la TAP."
        )
        notes = [
            "Taux IFU : 5% du chiffre d'affaires pour les services, 12% pour le commerce",
            "Déclaration annuelle simplifiée (G12)",
            "Pas de TVA à collecter ni à déduire",
            "Plafond : 5,000,000 DZD/an de CA"
        ]
        obligations = [
            "Déclaration annuelle IFU avant le 30 juin",
            "Paiement trimestriel des acomptes",
            "Tenue d'un registre des recettes"
        ]
    elif request.expected_revenue_range in [RevenueRange.LESS_1M, RevenueRange.FROM_1_TO_5M]:
        regime = "forfaitaire"
        summary = (
            "Avec un chiffre d'affaires prévu inférieur à 5M DZD, vous pouvez opter pour le régime "
            "forfaitaire (IFU) qui simplifie vos obligations fiscales."
        )
        notes = [
            "IFU applicable si CA < 5,000,000 DZD/an",
            "Taux : 5% (services) ou 12% (commerce/industrie)",
            "Possibilité d'opter pour le réel si avantageux"
        ]
        obligations = [
            "Déclaration annuelle G12",
            "Paiement trimestriel",
            "Livre de recettes obligatoire"
        ]
    else:
        regime = "réel"
        summary = (
            "Avec un chiffre d'affaires prévu supérieur à 5M DZD, vous serez soumis au régime réel "
            "d'imposition avec une comptabilité complète obligatoire."
        )
        notes = [
            "IRG/IBS sur le bénéfice net",
            "TVA à collecter et déduire (19% taux normal)",
            "TAP (Taxe sur l'Activité Professionnelle) : 1% à 3% du CA",
            "Comptabilité en partie double obligatoire"
        ]
        obligations = [
            "Bilan annuel avant le 30 avril",
            "Déclarations TVA mensuelles (G50)",
            "Déclaration annuelle IRG/IBS",
            "Livre journal, grand livre, livre d'inventaire"
        ]
    
    # Ajouts spécifiques
    if request.needs_import_export:
        notes.append("Import/Export : droits de douane applicables selon les produits")
    
    if request.needs_employees:
        obligations.append("Déclarations sociales CNAS mensuelles")
        obligations.append("Retenue à la source IRG sur salaires")
    
    return FiscalBlock(
        summary=summary,
        regime_suggested=regime,
        notes=notes,
        obligations=obligations
    )


def get_legal_references(request: StartupOnboardRequest, legal_form: str) -> ReferencesBlock:
    """Retourne les références légales pertinentes"""
    
    items = [
        ReferenceItem(
            label="Code de commerce algérien — Livre II : Des sociétés commerciales",
            source_name="JORADP",
            source_url="https://www.joradp.dz/trv/fcommerce.pdf",
            date="2007"
        ),
        ReferenceItem(
            label="Décret exécutif 15-361 relatif au registre du commerce",
            source_name="CNRC",
            source_url="https://www.cnrc.org.dz",
            date="2015-12-31"
        ),
        ReferenceItem(
            label="Loi 07-11 relative au système comptable financier (SCF)",
            source_name="JORADP",
            source_url="https://www.joradp.dz",
            date="2007-11-25"
        )
    ]
    
    if legal_form == "Auto-entrepreneur":
        items.insert(0, ReferenceItem(
            label="Loi 22-24 relative au statut de l'auto-entrepreneur",
            source_name="JORADP",
            source_url="https://www.joradp.dz",
            date="2022"
        ))
    
    if legal_form in ["EURL", "SARL"]:
        items.append(ReferenceItem(
            label="Articles 564 à 591 Code de commerce — SARL",
            source_name="Code de commerce",
            source_url=None,
            date=None
        ))
    
    items.extend([
        ReferenceItem(
            label="Code des impôts directs et taxes assimilées",
            source_name="DGI",
            source_url="https://www.mfdgi.gov.dz",
            date="2024"
        ),
        ReferenceItem(
            label="Guide du contribuable — DGI Algérie",
            source_name="DGI",
            source_url="https://www.mfdgi.gov.dz/guide-contribuable",
            date="2024"
        )
    ])
    
    return ReferencesBlock(items=items)


def generate_global_summary(request: StartupOnboardRequest, legal_form: str, fiscal_regime: str) -> str:
    """Génère le résumé global"""
    
    return (
        f"Pour votre projet « {request.project_name} » dans le secteur {request.activity_sector} à {request.city}, "
        f"nous recommandons la création d'une **{legal_form}**. "
        f"{'Vous aurez ' + str(request.partners_count) + ' associé(s) avec vous. ' if request.has_partners else ''}"
        f"Le régime fiscal suggéré est le **régime {fiscal_regime}**. "
        f"Comptez environ 2 à 4 semaines pour accomplir toutes les formalités administratives "
        f"(CNRC, {'notaire, ' if legal_form in ['EURL', 'SARL'] else ''}banque, DGI, CASNOS"
        f"{', CNAS' if request.needs_employees else ''}"
        f"{', Douanes' if request.needs_import_export else ''}). "
        f"Préparez un budget de 50,000 à 150,000 DZD pour les frais de création "
        f"{'incluant les honoraires du notaire' if legal_form in ['EURL', 'SARL'] else ''}."
    )


def generate_followup_questions(request: StartupOnboardRequest) -> List[str]:
    """Génère des questions de suivi pertinentes"""
    
    questions = [
        "Comment choisir ma banque pour le compte professionnel ?",
        "Quelles sont les aides et subventions disponibles pour les entrepreneurs en Algérie ?",
        f"Quel est le détail des obligations fiscales pour mon secteur ({request.activity_sector}) ?"
    ]
    
    if request.needs_employees:
        questions.append("Comment établir un contrat de travail conforme en Algérie ?")
    
    if request.needs_import_export:
        questions.append("Quelles sont les formalités douanières pour l'import/export ?")
    
    if request.needs_bank_financing:
        questions.append("Comment préparer un dossier de financement bancaire ?")
    
    questions.append("Puis-je exercer depuis mon domicile ou ai-je besoin d'un local commercial ?")
    
    return questions[:5]  # Max 5 questions


async def call_external_services(request: StartupOnboardRequest) -> Dict[str, Any]:
    """Appelle les services externes (Legal, Fiscal, RAG) pour enrichir la réponse"""
    
    enriched_data = {
        "legal_insights": [],
        "fiscal_insights": [],
        "rag_references": []
    }
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        # Appel Legal API
        try:
            legal_response = await client.post(
                f"{LEGAL_API_URL}/api/dz-legal/answer",
                json={
                    "question": f"Quelle forme juridique pour une entreprise {request.activity_sector} en Algérie ?",
                    "category": "droit_des_affaires"
                }
            )
            if legal_response.status_code == 200:
                data = legal_response.json()
                enriched_data["legal_insights"] = data.get("key_points", [])
        except Exception as e:
            logger.warning(f"Legal API call failed: {e}")
        
        # Appel Fiscal API
        try:
            fiscal_response = await client.post(
                f"{FISCAL_API_URL}/api/dz-fiscal/simulate",
                json={
                    "revenue": 1000000 if request.expected_revenue_range == RevenueRange.LESS_1M else 5000000,
                    "entity_type": "sarl" if request.has_partners else "eurl",
                    "sector": request.activity_sector
                }
            )
            if fiscal_response.status_code == 200:
                data = fiscal_response.json()
                enriched_data["fiscal_insights"] = data.get("recommendations", [])
        except Exception as e:
            logger.warning(f"Fiscal API call failed: {e}")
        
        # Appel RAG API
        try:
            rag_response = await client.post(
                f"{RAG_API_URL}/api/rag/query",
                json={
                    "query": f"création entreprise {request.activity_sector} Algérie formalités CNRC",
                    "top_k": 3
                }
            )
            if rag_response.status_code == 200:
                data = rag_response.json()
                enriched_data["rag_references"] = data.get("sources", [])
        except Exception as e:
            logger.warning(f"RAG API call failed: {e}")
    
    return enriched_data


async def create_crm_case(request: StartupOnboardRequest, response: StartupOnboardResponse) -> Optional[str]:
    """Crée un dossier CRM pour le projet"""
    
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            # Créer le client
            client_response = await client.post(
                f"{CRM_API_URL}/api/crm/client",
                json={
                    "name": request.project_name,
                    "email": f"contact@{request.project_name.lower().replace(' ', '')}.dz",
                    "type": "pme",
                    "activity_sector": request.activity_sector,
                    "address": request.city
                }
            )
            
            if client_response.status_code == 200:
                client_data = client_response.json()
                client_id = client_data.get("id")
                
                # Créer le dossier
                case_response = await client.post(
                    f"{CRM_API_URL}/api/crm/case",
                    json={
                        "title": f"Création entreprise : {request.project_name}",
                        "client_id": client_id,
                        "case_type": "administratif",
                        "priority": "haute",
                        "description": response.global_summary
                    }
                )
                
                if case_response.status_code == 200:
                    case_data = case_response.json()
                    return case_data.get("id")
    except Exception as e:
        logger.warning(f"CRM case creation failed: {e}")
    
    return None


# ============================================================================
# ENDPOINTS
# ============================================================================

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "startupdz-onboarding",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.post("/api/startupdz/onboard", response_model=StartupOnboardResponse)
async def onboard_startup(request: StartupOnboardRequest, background_tasks: BackgroundTasks):
    """
    Endpoint principal : Analyse complète pour la création d'entreprise en Algérie.
    
    Retourne :
    - Forme juridique recommandée avec alternatives
    - Étapes administratives détaillées (CNRC, DGI, CNAS, etc.)
    - Documents requis et modèles générés
    - Régime fiscal suggéré
    - Références légales
    """
    
    request_id = str(uuid.uuid4())[:12]
    logger.info(f"[{request_id}] StartupDZ onboarding request for: {request.project_name}")
    
    try:
        # 1. Déterminer la forme juridique
        legal_form_result = determine_legal_form(request)
        
        # 2. Générer les étapes administratives
        admin_steps = generate_admin_steps(request, legal_form_result.form)
        
        # 3. Générer les documents
        docs_block = generate_documents(request, legal_form_result.form)
        
        # 4. Déterminer le régime fiscal
        fiscal_block = determine_fiscal_regime(request, legal_form_result.form)
        
        # 5. Obtenir les références légales
        references = get_legal_references(request, legal_form_result.form)
        
        # 6. Résumé global
        global_summary = generate_global_summary(request, legal_form_result.form, fiscal_block.regime_suggested)
        
        # 7. Questions de suivi
        followup = generate_followup_questions(request)
        
        # 8. Appeler les services externes en arrière-plan pour enrichissement
        # (Pour le MVP, on utilise la logique interne)
        # enriched = await call_external_services(request)
        
        response = StartupOnboardResponse(
            request_id=request_id,
            project_name=request.project_name,
            recommended_legal_form=legal_form_result,
            admin_steps_block=admin_steps,
            docs_block=docs_block,
            fiscal_block=fiscal_block,
            references_block=references,
            global_summary=global_summary,
            followup_questions=followup,
            credits_used=STARTUPDZ_CREDITS,
            created_at=datetime.utcnow().isoformat()
        )
        
        logger.info(f"[{request_id}] Onboarding completed. Recommended: {legal_form_result.form}")
        
        return response
        
    except Exception as e:
        logger.error(f"[{request_id}] Error during onboarding: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/startupdz/onboard-with-crm", response_model=StartupOnboardResponse)
async def onboard_startup_with_crm(request: StartupOnboardRequest):
    """
    Même analyse que /onboard mais crée aussi un dossier CRM automatiquement.
    """
    
    # Obtenir la réponse standard
    response = await onboard_startup(request, BackgroundTasks())
    
    # Créer le dossier CRM
    crm_case_id = await create_crm_case(request, response)
    
    if crm_case_id:
        response.crm_case_id = crm_case_id
        logger.info(f"[{response.request_id}] CRM case created: {crm_case_id}")
    
    return response


@app.get("/api/startupdz/legal-forms")
async def list_legal_forms():
    """Liste les formes juridiques disponibles en Algérie"""
    return {
        "forms": [
            {
                "code": "AUTO_ENTREPRENEUR",
                "name": "Auto-entrepreneur",
                "description": "Statut simplifié pour activités individuelles à faible CA",
                "capital_min": "Aucun",
                "associates": "0 (solo)",
                "liability": "Illimitée"
            },
            {
                "code": "PERSONNE_PHYSIQUE",
                "name": "Entreprise individuelle / Personne physique",
                "description": "Activité commerciale en nom propre",
                "capital_min": "Aucun",
                "associates": "0 (solo)",
                "liability": "Illimitée"
            },
            {
                "code": "EURL",
                "name": "EURL (Entreprise Unipersonnelle à Responsabilité Limitée)",
                "description": "Société unipersonnelle avec responsabilité limitée",
                "capital_min": "100,000 DZD",
                "associates": "1",
                "liability": "Limitée aux apports"
            },
            {
                "code": "SARL",
                "name": "SARL (Société à Responsabilité Limitée)",
                "description": "Société à responsabilité limitée pour 2 à 50 associés",
                "capital_min": "100,000 DZD",
                "associates": "2 à 50",
                "liability": "Limitée aux apports"
            },
            {
                "code": "SPA",
                "name": "SPA (Société Par Actions)",
                "description": "Grande société pour levées de fonds importantes",
                "capital_min": "1,000,000 DZD",
                "associates": "7 minimum",
                "liability": "Limitée aux apports"
            },
            {
                "code": "SNC",
                "name": "SNC (Société en Nom Collectif)",
                "description": "Société de personnes, tous associés commerçants",
                "capital_min": "Aucun",
                "associates": "2 minimum",
                "liability": "Illimitée et solidaire"
            }
        ]
    }


@app.get("/api/startupdz/sectors")
async def list_activity_sectors():
    """Liste les secteurs d'activité courants"""
    return {
        "sectors": [
            {"code": "tech", "name": "Technologies / Informatique / Développement"},
            {"code": "commerce", "name": "Commerce général / Distribution"},
            {"code": "services", "name": "Services aux entreprises"},
            {"code": "restauration", "name": "Restauration / Café / Hôtellerie"},
            {"code": "construction", "name": "BTP / Construction"},
            {"code": "transport", "name": "Transport / Logistique"},
            {"code": "sante", "name": "Santé / Paramédical"},
            {"code": "education", "name": "Éducation / Formation"},
            {"code": "agriculture", "name": "Agriculture / Agroalimentaire"},
            {"code": "industrie", "name": "Industrie / Fabrication"},
            {"code": "import_export", "name": "Import / Export"},
            {"code": "conseil", "name": "Conseil / Consulting"},
            {"code": "immobilier", "name": "Immobilier"},
            {"code": "artisanat", "name": "Artisanat"},
            {"code": "autre", "name": "Autre"}
        ]
    }


@app.get("/api/startupdz/cities")
async def list_cities():
    """Liste les principales villes d'Algérie"""
    return {
        "cities": [
            "Alger", "Oran", "Constantine", "Annaba", "Blida",
            "Batna", "Sétif", "Djelfa", "Biskra", "Tébessa",
            "Tlemcen", "Béjaïa", "Tiaret", "Tizi Ouzou", "Skikda",
            "Sidi Bel Abbès", "Chlef", "Bordj Bou Arreridj", "Ghardaïa", "Ouargla"
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8214)
