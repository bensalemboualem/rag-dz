# 🚀 Module 12 : StartupDZ-Onboarding

## Assistant IA pour la Création d'Entreprise en Algérie

**StartupDZ** est un assistant intelligent qui guide les entrepreneurs algériens dans la création de leur entreprise, étape par étape.

## 🎯 Fonctionnalités

### 1. Recommandation de Forme Juridique
- **Auto-entrepreneur** : Activités individuelles à faible CA
- **Entreprise individuelle** : Activité en nom propre
- **EURL** : Société unipersonnelle à responsabilité limitée
- **SARL** : Société à responsabilité limitée (2-50 associés)
- **SPA** : Société par actions (grandes structures)

### 2. Étapes Administratives Détaillées
- **CNRC** : Immatriculation au registre du commerce
- **Notaire** : Rédaction des statuts (sociétés)
- **Banque** : Ouverture compte + blocage capital
- **DGI** : Déclarations fiscales et NIF
- **CASNOS** : Sécurité sociale du gérant
- **CNAS** : Affiliation employeur (si salariés)
- **Douanes** : Agrément import/export (si applicable)

### 3. Documents Générés Automatiquement
- ✅ Modèle de statuts EURL/SARL
- ✅ Lettre de demande d'ouverture de compte bancaire
- ✅ Checklist avant visite au CNRC
- ✅ Liste des pièces à fournir

### 4. Régime Fiscal Suggéré
- **IFU** : Impôt Forfaitaire Unique (auto-entrepreneurs)
- **Forfaitaire** : CA < 5M DZD/an
- **Réel** : CA > 5M DZD/an

## 🔗 URLs d'accès

| Service | URL |
|---------|-----|
| **StartupDZ UI** | https://www.iafactoryalgeria.com/startupdz/ |
| **StartupDZ API** | https://www.iafactoryalgeria.com/api/startupdz/ |

## 📡 Endpoints API

### Analyse de Création d'Entreprise
```
POST /api/startupdz/onboard
```

**Requête :**
```json
{
  "project_name": "TechDZ Solutions",
  "activity_sector": "Développement web",
  "target_customers": "B2B",
  "expected_revenue_range": "1-5M",
  "has_partners": false,
  "partners_count": 0,
  "wants_limited_liability": true,
  "city": "Alger",
  "main_goal": "startup_tech",
  "needs_employees": true,
  "needs_import_export": false,
  "needs_bank_financing": true
}
```

**Réponse :**
```json
{
  "request_id": "abc123",
  "project_name": "TechDZ Solutions",
  "recommended_legal_form": {
    "form": "EURL",
    "justification": "L'EURL est parfaite pour un entrepreneur solo...",
    "alternatives": [...]
  },
  "admin_steps_block": {
    "summary": "5 étapes principales...",
    "steps": [...]
  },
  "docs_block": {
    "required_documents": [...],
    "generated_templates": [...]
  },
  "fiscal_block": {
    "regime_suggested": "forfaitaire",
    "summary": "...",
    "notes": [...],
    "obligations": [...]
  },
  "references_block": {
    "items": [...]
  },
  "global_summary": "Résumé complet...",
  "followup_questions": [...]
}
```

### Autres Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/startupdz/legal-forms` | Liste des formes juridiques |
| GET | `/api/startupdz/sectors` | Liste des secteurs d'activité |
| GET | `/api/startupdz/cities` | Liste des villes algériennes |
| POST | `/api/startupdz/onboard-with-crm` | Analyse + création dossier CRM |

## 🖥️ Interface Utilisateur (Wizard)

### Étape 1 : Informations de Base
- Nom du projet
- Ville d'activité
- Secteur d'activité
- Type de clients (B2B/B2C/Mix)
- Chiffre d'affaires prévu

### Étape 2 : Profil & Objectifs
- Objectif principal (Freelance / PME / Startup / Régularisation)
- Associés (oui/non + nombre)
- Limitation de responsabilité
- Prévision d'employés
- Import/Export
- Besoin de financement bancaire

### Étape 3 : Résultats IA
- Résumé global
- Forme juridique recommandée + alternatives
- Étapes administratives détaillées
- Documents requis
- Modèles générés (statuts, lettres, checklist)
- Régime fiscal suggéré
- Références légales

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 StartupDZ Interface                         │
│               (Port 8215 - Wizard UI)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │   Étape 1   │───▶│   Étape 2   │───▶│  Résultats  │    │
│  │  Projet     │    │   Profil    │    │     IA      │    │
│  └─────────────┘    └─────────────┘    └─────────────┘    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│               StartupDZ API Backend                         │
│                (Port 8214 - FastAPI)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │   Legal     │    │   Fiscal    │    │     RAG     │    │
│  │  Assistant  │    │  Assistant  │    │    Query    │    │
│  │   (8200)    │    │   (8201)    │    │   (8180)    │    │
│  └─────────────┘    └─────────────┘    └─────────────┘    │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐                        │
│  │   CRM IA    │    │    Park     │                        │
│  │   (8212)    │    │   (8195)    │                        │
│  └─────────────┘    └─────────────┘                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🐳 Conteneurs Docker

| Conteneur | Port | Image | Status |
|-----------|------|-------|--------|
| iaf-startupdz-prod | 8214 | iaf-startupdz:latest | ✅ Running (healthy) |
| iaf-startupdz-ui-prod | 8215 | iaf-startupdz-ui:latest | ✅ Running |

## 📊 Exemples de Projets

### 1. Freelance Développeur Web
```json
{
  "project_name": "DevPro Services",
  "activity_sector": "Développement web et applications mobiles",
  "expected_revenue_range": "<1M",
  "main_goal": "freelance"
}
```
**Recommandation : Auto-entrepreneur**

### 2. Commerce Import Matériel Informatique
```json
{
  "project_name": "TechImport DZ",
  "activity_sector": "Import et vente de matériel informatique",
  "expected_revenue_range": "5-20M",
  "has_partners": true,
  "needs_import_export": true,
  "main_goal": "small_company"
}
```
**Recommandation : SARL**

### 3. Startup SaaS B2B
```json
{
  "project_name": "CloudDZ Platform",
  "activity_sector": "Services cloud et SaaS pour entreprises",
  "expected_revenue_range": ">20M",
  "needs_employees": true,
  "needs_bank_financing": true,
  "main_goal": "startup_tech"
}
```
**Recommandation : SARL (évoluant vers SPA)**

### 4. Café / Restaurant
```json
{
  "project_name": "Café El Djazaïr",
  "activity_sector": "Restauration et café",
  "expected_revenue_range": "1-5M",
  "city": "Oran",
  "main_goal": "small_company"
}
```
**Recommandation : EURL ou Entreprise individuelle**

## 💳 Crédits (Module 8)

Chaque analyse complète consomme **10 crédits**.

L'analyse inclut :
- Recommandation forme juridique
- 5-7 étapes administratives
- 3 modèles de documents
- Régime fiscal suggéré
- Références légales

## 🔗 Intégration avec autres modules

| Module | Utilisation |
|--------|-------------|
| **DZ-LegalAssistant** | Recommandation forme juridique |
| **DZ-FiscalAssistant** | Régime fiscal suggéré |
| **RAG DZ** | Références légales JORADP, DGI, CNRC |
| **iaFactoryPark** | Fiche projet (pitch/business plan) |
| **CRM IA** | Création automatique de dossier client |

## 📚 Références Légales Intégrées

- Code de commerce algérien (Livre II)
- Décret exécutif 15-361 (registre du commerce)
- Loi 22-24 (statut auto-entrepreneur)
- Code des impôts directs
- Guide du contribuable DGI

## 🛡️ Points Forts

1. **Expérience guidée** : Wizard étape par étape, pas juste un chat
2. **Documents prêts à l'emploi** : Statuts, lettres, checklists générés
3. **Contexte algérien** : Réglementation locale respectée
4. **Multi-formes juridiques** : Du freelance à la SPA
5. **Intégration CRM** : Suivi du dossier client

## 📈 Évolutions Futures

1. **Export PDF** : Téléchargement de la fiche complète
2. **Rendez-vous CNRC** : Prise de RDV automatisée
3. **Suivi étapes** : Progression temps réel
4. **Multi-langues** : Arabe, Français, Anglais
5. **Notifications** : Rappels pour les démarches

---

**iaFactory Algeria** - Module StartupDZ-Onboarding v1.0  
*Créez votre entreprise en Algérie, guidé par l'IA* 🇩🇿🚀
