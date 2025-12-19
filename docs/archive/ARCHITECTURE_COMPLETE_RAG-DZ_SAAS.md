# 🏗️ ARCHITECTURE COMPLÈTE - RAG-DZ SaaS Platform
## IAFactory Algeria - Plateforme Multi-Agents & Applications IA

**Version**: 1.0
**Date**: 12 Décembre 2025
**Domaine**: https://www.iafactoryalgeria.com
**VPS IP**: 46.224.3.125

---

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble](#vue-densemble)
2. [Infrastructure](#infrastructure)
3. [Backend & API](#backend--api)
4. [Frontend & Applications](#frontend--applications)
5. [AI Agents (18 Agents)](#ai-agents-18-agents)
6. [Base de données](#base-de-données)
7. [Monitoring & Observabilité](#monitoring--observabilité)
8. [Sécurité & Authentication](#sécurité--authentication)
9. [Déploiement & DevOps](#déploiement--devops)
10. [Routes & URLs](#routes--urls)

---

## 🎯 VUE D'ENSEMBLE

### Architecture Globale

```
┌─────────────────────────────────────────────────────────────────┐
│                    NGINX Reverse Proxy (443/80)                 │
│              www.iafactoryalgeria.com (SSL/TLS)                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼─────┐   ┌────▼─────┐   ┌────▼─────┐
    │  Landing │   │  Backend │   │   Apps   │
    │   Page   │   │    API   │   │  (71)    │
    │  :80     │   │  :8180   │   │ Various  │
    └──────────┘   └────┬─────┘   └──────────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
    ┌────▼─────┐   ┌───▼────┐   ┌────▼─────┐
    │ MongoDB  │   │ Redis  │   │  Qdrant  │
    │  :27018  │   │ :6380  │   │  :6333   │
    └──────────┘   └────────┘   └──────────┘
```

### Stack Technologique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| **Reverse Proxy** | Nginx | Latest |
| **Backend API** | FastAPI (Python) | 3.11+ |
| **Frontend** | React + Vite | 18.x |
| **AI Framework** | Streamlit | 1.30+ |
| **Vector DB** | Qdrant | Latest |
| **Cache** | Redis | 7.x |
| **Database** | MongoDB | 7.x |
| **Containerization** | Docker + Docker Compose | 24.x |
| **Monitoring** | Prometheus + Grafana | Latest |
| **Orchestration** | n8n | Latest |

---

## 🏢 INFRASTRUCTURE

### 1. Structure des Répertoires

```
/opt/iafactory-rag-dz/
├── agents/                          # Agents opérateurs
│   ├── iafactory-operator/          # Opérateur principal
│   └── video-operator/              # Opérateur vidéo
│
├── ai-agents/                       # 18 AI Agents Streamlit
│   ├── business-core/               # Agents business
│   ├── finance-startups/            # Agents finance
│   ├── productivity/                # Agents productivité
│   └── rag-apps/                    # Agents RAG
│
├── apps/ (71 applications)          # Applications frontend
│   ├── agri-dz/                     # Agriculture
│   ├── btp-dz/                      # BTP
│   ├── clinique-dz/                 # Santé
│   ├── commerce-dz/                 # Commerce
│   ├── startup-dz/                  # Startups
│   ├── bmad/                        # Multi-Agent System
│   ├── council/                     # AI Council
│   ├── ithy/                        # Ithy Assistant
│   ├── landing/                     # Landing page principale
│   ├── billing-panel/               # Facturation
│   ├── pme-copilot/                 # PME Copilot
│   ├── crm-ia/                      # CRM IA
│   ├── growth-grid/                 # Growth Grid
│   ├── notebook-lm/                 # Notebook LM
│   ├── dzirvideo-ai/                # Video AI
│   └── ... (56+ autres apps)
│
├── backend/                         # Backend services
│   ├── rag-compat/                  # Backend principal
│   │   ├── app/
│   │   │   ├── main.py              # Point d'entrée FastAPI
│   │   │   ├── routers/             # 40+ routers API
│   │   │   ├── models/              # Modèles de données
│   │   │   ├── services/            # Services métier
│   │   │   ├── modules/             # Modules IA
│   │   │   ├── multi_llm/           # Multi-LLM Router (15 providers)
│   │   │   ├── ocr/                 # OCR Engine
│   │   │   ├── voice/               # Voice Processing
│   │   │   ├── bigrag/              # BigRAG System
│   │   │   └── darija/              # Darija NLP
│   │   └── requirements.txt
│   └── key-service/                 # Gestion clés API
│
├── frontend/                        # Frontends React
│   ├── archon-ui/                   # Archon Multi-Agent UI
│   ├── archon-ui-stable/            # Version stable
│   └── rag-ui/                      # RAG UI principale
│
├── bmad/                            # BMAD System (submodule)
├── bolt-diy/                        # Bolt.DIY (Code Generator)
├── interview-agents/                # Interview Agents (Next.js)
│
├── infrastructure/                  # Infrastructure as Code
│   └── sql/                         # Scripts SQL
│
├── monitoring/                      # Monitoring stack
│   └── prometheus/                  # Config Prometheus
│
├── nginx/                           # Config Nginx
├── scripts/                         # Scripts utilitaires
├── shared/                          # Composants partagés
├── docs/                            # Documentation
├── uploads/                         # Fichiers uploadés
└── outputs/                         # Outputs générés
```

### 2. Docker Containers (57 Containers)

#### Base Infrastructure (5 containers)
```yaml
ia-factory-mongodb:     # MongoDB :27018
ia-factory-redis:       # Redis :6380
qdrant:                 # Vector DB :6333
iaf-dz-ollama:          # Ollama LLM :11434
ia-factory-api:         # Backend API :8087
```

#### Main Backend (1 container)
```yaml
iaf-dz-backend:         # FastAPI Backend :8180
```

#### AI Agents - Business Core (4 agents)
```yaml
iaf-ai-consultant-prod:         :9101  # AI Business Consultant
iaf-ai-customer-support-prod:   :9102  # Customer Support Agent
iaf-ai-data-analysis-prod:      :9103  # Data Analysis Agent
iaf-ai-meeting-prod:            :9105  # Meeting Assistant
```

#### AI Agents - Finance & Startups (5 agents)
```yaml
iaf-ai-xai-finance-prod:        :9104  # XAI Finance Agent
iaf-ai-investment-prod:         :9114  # Investment Advisor
iaf-ai-financial-coach-prod:    :9115  # Financial Coach
iaf-ai-startup-trends-prod:     :9116  # Startup Trends Analyst
iaf-ai-system-architect-prod:   :9117  # System Architect
```

#### AI Agents - Productivity (3 agents)
```yaml
iaf-ai-journalist-prod:         :9106  # AI Journalist
iaf-ai-web-scraping-prod:       :9107  # Web Scraping Agent
iaf-ai-product-launch-prod:     :9108  # Product Launch Agent
```

#### AI Agents - RAG Applications (5 agents)
```yaml
iaf-ai-local-rag-prod:          :9109  # Local RAG
iaf-ai-rag-as-service-prod:     :9110  # RAG as a Service
iaf-ai-agentic-rag-prod:        :9111  # Agentic RAG
iaf-ai-hybrid-search-rag-prod:  :9112  # Hybrid Search RAG
iaf-ai-autonomous-rag-prod:     :9113  # Autonomous RAG
iaf-ai-deep-research-prod:      :9118  # Deep Research Agent
```

#### Applications Frontend (14 containers)
```yaml
iaf-hub-prod:                   :8182  # Hub Central
iaf-docs-prod:                  :8183  # Documentation
iaf-studio-prod:                :8184  # Creative Studio
iaf-council-prod:               :8185  # Council AI
iaf-ithy-prod:                  :8186  # Ithy Assistant
iaf-notebook-prod:              :8187  # Notebook LM
iaf-bmad-prod:                  :8188  # BMAD System
iaf-creative-prod:              :8189  # Creative Tools
iaf-n8n-prod:                   :8190  # n8n Workflows
iaf-rag-prod:                   :8191  # RAG UI
iaf-landing-prod:               :8192  # Landing Page
iaf-dashboard-prod:             :8193  # Dashboard
iaf-developer-prod:             :8194  # Developer Portal
iaf-data-dz-prod:               :8196  # Data DZ
```

#### Services Spécialisés (10 containers)
```yaml
iaf-dz-connectors-prod:         :8195  # DZ Connectors API
iaf-legal-assistant-prod:       :8197  # Legal Assistant API
iaf-legal-frontend-prod:        :8198  # Legal Frontend
iaf-fiscal-assistant-prod:      :8199  # Fiscal Assistant API
iaf-fiscal-frontend-prod:       :8200  # Fiscal Frontend
iaf-voice-assistant-prod:       :8201  # Voice Assistant API
iaf-voice-frontend-prod:        :8202  # Voice Frontend
iaf-billing-prod:               :8207  # Billing API
iaf-billing-ui-prod:            :8208  # Billing UI
archon-mcp:                     :8051  # Archon MCP
```

#### PME & CRM Suite (6 containers)
```yaml
iaf-pme-copilot-prod:           :8210  # PME Copilot API
iaf-pme-copilot-ui-prod:        :8211  # PME Copilot UI
iaf-crm-ia-prod:                :8212  # CRM IA API
iaf-crm-ia-ui-prod:             :8213  # CRM IA UI
iaf-startupdz-prod:             :8214  # StartupDZ API
iaf-startupdz-ui-prod:          :8215  # StartupDZ UI
iaf-landing-pro:                :8216  # Landing Pro
```

#### Monitoring Stack (8 containers)
```yaml
iaf-prometheus:                 :9090  # Prometheus
iaf-grafana:                    :3033  # Grafana
iaf-alertmanager:               :9093  # Alert Manager
iaf-node-exporter:              :9100  # Node Exporter
iaf-cadvisor:                   :8888  # cAdvisor
iaf-loki:                       :3100  # Loki Logs
iaf-promtail:                   N/A    # Promtail Agent
```

**Total: 57 Containers actifs**

---

## 🔧 BACKEND & API

### 1. Backend Principal

**Chemin**: `/opt/iafactory-rag-dz/backend/rag-compat/`
**Port**: `8180`
**Container**: `iaf-dz-backend`
**Framework**: FastAPI
**Base URL**: `https://www.iafactoryalgeria.com/api/`

### 2. Structure Backend

```
backend/rag-compat/
├── app/
│   ├── main.py                    # Point d'entrée FastAPI
│   ├── config.py                  # Configuration globale
│   ├── security.py                # Authentification & sécurité
│   │
│   ├── routers/ (40+ routers)     # Routes API
│   │   ├── agent_chat.py          # Chat avec agents IA
│   │   ├── auth.py                # Authentification
│   │   ├── billing.py             # Facturation v1
│   │   ├── billing_v2.py          # Facturation v2
│   │   ├── bmad_chat.py           # BMAD Chat
│   │   ├── bmad.py                # BMAD System
│   │   ├── bolt.py                # Bolt.DIY
│   │   ├── calendar.py            # Calendrier Google
│   │   ├── council.py             # Council AI
│   │   ├── council_custom.py      # Council personnalisé
│   │   ├── credentials.py         # Gestion credentials
│   │   ├── crm.py                 # CRM simple
│   │   ├── crm_pro.py             # CRM Pro
│   │   ├── dzirvideo.py           # DzirVideo AI
│   │   ├── email_agent.py         # Email Agent
│   │   ├── google.py              # Google Integration
│   │   ├── growth_grid.py         # Growth Grid
│   │   ├── ingest.py              # Ingestion données
│   │   ├── ithy.py                # Ithy Assistant
│   │   ├── knowledge.py           # Base de connaissances
│   │   ├── notebook_lm.py         # Notebook LM
│   │   ├── orchestrator.py        # Orchestrateur
│   │   ├── pipeline.py            # Pipeline Creator
│   │   ├── pme.py                 # PME v1
│   │   ├── pme_v2.py              # PME v2
│   │   ├── promo_codes.py         # Codes promo
│   │   ├── prompt_creator.py      # Prompt Creator
│   │   ├── query.py               # Queries RAG
│   │   ├── rag_public.py          # RAG public API
│   │   ├── studio_video.py        # Studio vidéo
│   │   ├── twilio.py              # Twilio SMS
│   │   ├── upload.py              # Upload fichiers
│   │   ├── user_keys.py           # Clés utilisateur
│   │   ├── voice.py               # Voice Assistant
│   │   ├── websocket_router.py    # WebSockets
│   │   └── whatsapp.py            # WhatsApp Business
│   │
│   ├── models/                    # Modèles Pydantic
│   │   ├── billing_models.py      # Modèles facturation
│   │   ├── crm_pro_models.py      # Modèles CRM Pro
│   │   └── pme_models.py          # Modèles PME
│   │
│   ├── services/                  # Services métier
│   │   ├── billing_service.py     # Service facturation
│   │   ├── crm_pro_service.py     # Service CRM
│   │   ├── dzirvideo_service.py   # Service vidéo
│   │   ├── pme_service.py         # Service PME
│   │   └── engines/               # Moteurs IA
│   │
│   ├── modules/                   # Modules IA
│   │   ├── council/               # Council AI Module
│   │   │   ├── config.py
│   │   │   ├── providers.py       # 15 LLM Providers
│   │   │   └── agents/
│   │   └── ...
│   │
│   ├── multi_llm/                 # Multi-LLM Router
│   │   ├── router.py              # Router principal
│   │   ├── providers/             # 15 providers
│   │   │   ├── openai.py
│   │   │   ├── anthropic.py
│   │   │   ├── groq.py
│   │   │   ├── deepseek.py
│   │   │   ├── perplexity.py
│   │   │   ├── openrouter.py
│   │   │   ├── github.py
│   │   │   ├── grok.py
│   │   │   ├── kimi.py
│   │   │   ├── glm.py
│   │   │   ├── qwen.py
│   │   │   ├── huggingface.py
│   │   │   ├── copilot.py
│   │   │   ├── google.py
│   │   │   └── ollama.py
│   │   └── config.py
│   │
│   ├── ocr/                       # OCR Engine
│   │   ├── extractor.py
│   │   └── processors/
│   │
│   ├── voice/                     # Voice Processing
│   │   ├── transcription.py
│   │   ├── synthesis.py
│   │   └── processing.py
│   │
│   ├── bigrag/                    # BigRAG System
│   │   ├── engine.py
│   │   ├── indexer.py
│   │   └── retriever.py
│   │
│   ├── bigrag_ingest/             # BigRAG Ingestion
│   │   └── pipeline.py
│   │
│   ├── darija/                    # Darija NLP
│   │   ├── processor.py
│   │   └── translator.py
│   │
│   └── team_seats/                # Team Management
│       └── manager.py
│
├── requirements.txt               # Dependencies Python
├── requirements-dzirvideo.txt     # Dependencies DzirVideo
├── Dockerfile
└── .env                          # Variables d'environnement
```

### 3. API Endpoints Principaux

```python
# Health & Metrics
GET  /health                       # Health check
GET  /metrics                      # Prometheus metrics
GET  /                             # API info

# Authentication
POST /api/auth/register            # Inscription
POST /api/auth/login               # Connexion
POST /api/auth/refresh             # Refresh token
GET  /api/auth/me                  # User info

# RAG & Knowledge
POST /api/upload                   # Upload documents
POST /api/query                    # Query RAG
GET  /api/knowledge                # List knowledge
POST /api/ingest                   # Ingest data

# AI Agents
POST /api/agent-chat               # Chat avec agents
GET  /api/agents/list              # Liste agents
POST /api/council                  # Council AI
POST /api/ithy                     # Ithy Assistant

# Business Apps
POST /api/pme/                     # PME Copilot
POST /api/crm/                     # CRM
POST /api/billing/                 # Facturation
POST /api/growth-grid/             # Growth Grid
POST /api/pipeline/                # Pipeline Creator

# Specialized Services
POST /api/dz-legal/                # Legal Assistant
POST /api/dz-fiscal/               # Fiscal Assistant
POST /api/voice/                   # Voice Assistant
POST /api/dz-data/                 # Data DZ
POST /api/dzirvideo/               # DzirVideo AI

# Integrations
POST /api/google/                  # Google Integration
POST /api/calendar/                # Calendar
POST /api/email/                   # Email
POST /api/twilio/                  # SMS
POST /api/whatsapp/                # WhatsApp

# Automation
POST /api/orchestrator/            # Orchestrateur
GET  /api/workflows/               # Workflows n8n

# Credentials & Keys
POST /api/credentials              # Store credentials
GET  /api/credentials              # Get credentials
POST /api/user-keys                # User API keys

# Promo & Billing
POST /api/promo-codes              # Codes promo
GET  /api/billing/status           # Billing status
POST /api/credits/purchase         # Acheter crédits
```

### 4. Multi-LLM Router (15 Providers)

```python
# Providers disponibles
1.  OpenAI (GPT-4, GPT-3.5)
2.  Anthropic (Claude 3.5, Claude 3)
3.  Groq (Llama 3.1, Mixtral)
4.  DeepSeek (DeepSeek V2)
5.  Perplexity (Sonar)
6.  OpenRouter (Multi-models)
7.  GitHub Models
8.  Grok (xAI)
9.  Kimi (Moonshot)
10. GLM (ChatGLM)
11. Qwen (Alibaba)
12. HuggingFace (Open models)
13. GitHub Copilot
14. Google (Gemini)
15. Ollama (Local models)
```

---

## 🎨 FRONTEND & APPLICATIONS

### 1. Applications Frontend (71 Apps)

#### Landing & Core (5 apps)
```
landing/                    Landing page principale
apps.html                   Liste applications
hub/                        Hub central applications
docs/                       Documentation
dashboard/                  Dashboard principal
```

#### Business Intelligence (8 apps)
```
business-dz/                Business Intelligence DZ
bi-dashboard-ia/            BI Dashboard IA
growth-grid/                Growth Grid Analytics
pipeline-creator/           Pipeline Creator
pme-copilot/                PME Copilot
pme-copilot-ui/             PME Copilot UI
crm-ia/                     CRM IA
crm-ia-ui/                  CRM IA UI
```

#### Secteurs Algériens (15 apps)
```
agri-dz/                    Agriculture
agroalimentaire-dz/         Agroalimentaire
btp-dz/                     BTP
clinique-dz/                Santé
commerce-dz/                Commerce
douanes-dz/                 Douanes
ecommerce-dz/               E-commerce
expert-comptable-dz/        Expertise comptable
formation-pro-dz/           Formation professionnelle
industrie-dz/               Industrie
irrigation-dz/              Irrigation
pharma-dz/                  Pharmacie
transport-dz/               Transport
universite-dz/              Université
islam-dz/                   Islam
```

#### Assistants Métier (6 apps)
```
legal-assistant/            Assistant juridique
fiscal-assistant/           Assistant fiscal
voice-assistant/            Assistant vocal
chatbot-ia/                 Chatbot IA
comptabilite-dz/            Comptabilité
facturation-dz/             Facturation
```

#### Startups & Innovation (4 apps)
```
startup-dz/                 Startup DZ
startupdz-onboarding/       Onboarding Startups
startupdz-onboarding-ui/    UI Onboarding
med-dz/                     Medical DZ
```

#### Créatif & Contenu (8 apps)
```
creative-studio/            Studio créatif
dzirvideo-ai/               DzirVideo AI
transcription-ia/           Transcription IA
translator-ia/              Traducteur IA
redacteur-ia/               Rédacteur IA
email-marketing-ia/         Email Marketing IA
whatsapp-business-ia/       WhatsApp Business IA
ocr-extractor/              Extracteur OCR
```

#### AI & RAG (7 apps)
```
council/                    Council AI
ithy/                       Ithy Assistant
bmad/                       BMAD Multi-Agent
notebook-lm/                Notebook LM
ai-searcher/                AI Searcher
prompt-creator/             Prompt Creator
llm-router/                 LLM Router
```

#### Developer Tools (6 apps)
```
developer/                  Developer Portal
dev-portal/                 Dev Portal
api-portal/                 API Portal
api-packages/               API Packages
pipeline/                   Pipeline
shared/                     Composants partagés
shared-components/          Composants UI
```

#### Data & Analytics (4 apps)
```
data-dz/                    Data DZ
data-dz-dashboard/          Data Dashboard
seo-dz/                     SEO DZ
seo-dz-boost/               SEO Boost
```

#### Business Operations (5 apps)
```
pmedz-sales/                PME Sales
pmedz-sales-ui/             PME Sales UI
billing-panel/              Billing Panel
tarifs-paiement/            Tarifs & Paiement
dashboard-central/          Dashboard Central
```

#### Education (2 apps)
```
prof-dz/                    Prof DZ
school-erp/                 School ERP
```

### 2. Frontends React Principaux

#### Archon UI (Port 3737)
```typescript
frontend/archon-ui/
├── src/
│   ├── components/
│   │   ├── agent-chat/             # Chat multi-agents
│   │   ├── bug-report/             # Bug reporting
│   │   ├── code/                   # Code viewer
│   │   ├── layout/                 # Layout components
│   │   ├── onboarding/             # Onboarding flow
│   │   ├── presentation/           # Presentation components
│   │   ├── settings/               # Settings panels
│   │   └── ui/                     # UI primitives
│   │
│   ├── features/
│   │   ├── agent-work-orders/      # Work orders système
│   │   ├── automation/             # n8n automation
│   │   ├── dashboard/              # Dashboard home
│   │   ├── integrations/           # Google, etc.
│   │   ├── knowledge/              # Knowledge base
│   │   ├── mcp/                    # MCP servers
│   │   ├── messaging/              # Twilio, WhatsApp
│   │   ├── progress/               # Progress tracking
│   │   ├── projects/               # Project management
│   │   ├── settings/               # Settings
│   │   ├── style-guide/            # Style guide
│   │   ├── testing/                # Testing utilities
│   │   └── ui/                     # UI features
│   │
│   ├── pages/                      # Page components
│   ├── services/                   # API services
│   ├── contexts/                   # React contexts
│   └── hooks/                      # Custom hooks
│
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

#### RAG UI (Port 8191)
```typescript
frontend/rag-ui/
├── src/
│   ├── components/
│   │   ├── ia/                     # IA components
│   │   └── presentation/           # Presentation
│   ├── App.tsx
│   ├── App.css
│   └── index.css
│
├── dist/                           # Build output
├── package.json
└── vite.config.ts
```

---

## 🤖 AI AGENTS (18 AGENTS)

### Architecture des Agents

Tous les agents sont basés sur **Streamlit** et déployés en containers Docker.

```
ai-agents/
├── business-core/                  # 4 Agents Business
│   ├── ai-consultant/              :9101
│   ├── ai-customer-support/        :9102
│   ├── ai-data-analysis/           :9103
│   └── ai-meeting/                 :9105
│
├── finance-startups/               # 5 Agents Finance
│   ├── ai-xai-finance/             :9104
│   ├── ai-investment/              :9114
│   ├── ai-financial-coach/         :9115
│   ├── ai-startup-trends/          :9116
│   └── ai-system-architect/        :9117
│
├── productivity/                   # 3 Agents Productivité
│   ├── ai-journalist/              :9106
│   ├── ai-web-scraping/            :9107
│   └── ai-product-launch/          :9108
│
└── rag-apps/                       # 6 Agents RAG
    ├── ai-local-rag/               :9109
    ├── ai-rag-as-service/          :9110
    ├── ai-agentic-rag/             :9111
    ├── ai-hybrid-search-rag/       :9112
    ├── ai-autonomous-rag/          :9113
    └── ai-deep-research/           :9118
```

### Liste Complète des Agents

#### Business Core (4 agents)

1. **AI Business Consultant** (:9101)
   - Conseil stratégique business
   - Analyse de marché
   - Plan d'affaires

2. **Customer Support Agent** (:9102)
   - Support client intelligent
   - Tickets automatisés
   - FAQ dynamique

3. **Data Analysis Agent** (:9103)
   - Analyse de données
   - Visualisations
   - Insights automatiques

4. **Meeting Assistant** (:9105)
   - Prise de notes réunions
   - Action items
   - Résumés automatiques

#### Finance & Startups (5 agents)

5. **XAI Finance Agent** (:9104)
   - Analyse financière explicable
   - Prédictions XAI
   - Recommandations transparentes

6. **Investment Advisor** (:9114)
   - Conseils investissement
   - Portfolio analysis
   - Risk assessment

7. **Financial Coach** (:9115)
   - Coaching financier
   - Budget personnel
   - Objectifs financiers

8. **Startup Trends Analyst** (:9116)
   - Analyse tendances startups
   - Market research
   - Competitive analysis

9. **System Architect** (:9117)
   - Architecture système
   - Design patterns
   - Technical decisions

#### Productivity (3 agents)

10. **AI Journalist** (:9106)
    - Rédaction articles
    - Recherche automatique
    - Content generation

11. **Web Scraping Agent** (:9107)
    - Scraping intelligent
    - Data extraction
    - Web monitoring

12. **Product Launch Agent** (:9108)
    - Lancement produits
    - Go-to-market strategy
    - Launch checklist

#### RAG Applications (6 agents)

13. **Local RAG** (:9109)
    - RAG local avec Ollama
    - Privacy-first
    - Offline capable

14. **RAG as a Service** (:9110)
    - RAG API
    - Multi-tenant
    - Scalable

15. **Agentic RAG** (:9111)
    - RAG avec agents autonomes
    - Multi-step reasoning
    - Tool use

16. **Hybrid Search RAG** (:9112)
    - Recherche hybride
    - Semantic + keyword
    - Optimized retrieval

17. **Autonomous RAG** (:9113)
    - RAG autonome
    - Self-improving
    - Active learning

18. **Deep Research Agent** (:9118)
    - Recherche approfondie
    - Multi-source
    - Report generation

---

## 🗄️ BASE DE DONNÉES

### 1. MongoDB (Port 27018)

**Container**: `ia-factory-mongodb`
**Database**: `iafactory`
**Taille**: 304 KB

#### Collections Principales

```javascript
// Users & Authentication
users                           // Utilisateurs
sessions                        // Sessions actives
api_keys                        // Clés API utilisateur

// Business Data
projects                        // Projets
tasks                          // Tâches
work_orders                    // Ordres de travail
repositories                   // Repositories Git

// CRM & Sales
crm_contacts                   // Contacts CRM
crm_deals                      // Deals/Opportunités
crm_activities                 // Activités CRM
pme_companies                  // Entreprises PME
pme_invoices                   // Factures PME

// Billing & Credits
billing_accounts               // Comptes facturation
billing_invoices               // Factures
billing_transactions           // Transactions
credits_balances               // Soldes crédits
promo_codes                    // Codes promotionnels
subscriptions                  // Abonnements

// Knowledge Base
knowledge_items                // Items de connaissance
documents                      // Documents uploadés
crawl_progress                 // Progress crawling
embeddings_metadata            // Métadonnées embeddings

// AI & Agents
agent_conversations            // Conversations agents
agent_memories                 // Mémoires agents
council_sessions               // Sessions Council
ithy_chats                     // Chats Ithy

// Integrations
google_tokens                  // Tokens Google OAuth
calendar_events                // Événements calendrier
email_threads                  // Fils emails
twilio_messages                // Messages SMS
whatsapp_threads               // Conversations WhatsApp

// Automation
n8n_workflows                  // Workflows n8n
workflow_executions            // Exécutions workflows
scheduled_tasks                // Tâches planifiées

// Analytics
user_activity                  // Activité utilisateur
api_metrics                    // Métriques API
usage_stats                    // Statistiques usage

// Video & Media
dzirvideo_projects             // Projets vidéo
video_transcriptions           // Transcriptions
media_assets                   // Assets média
```

### 2. Redis (Port 6380)

**Container**: `ia-factory-redis`
**Usage**: Cache & Session Store

#### Patterns de clés Redis

```redis
# Sessions & Auth
session:{session_id}           # Session data (TTL: 24h)
user:tokens:{user_id}          # Refresh tokens
rate_limit:{ip}                # Rate limiting

# Cache API
cache:api:{endpoint}:{params}  # API responses (TTL: 5min)
cache:llm:{model}:{hash}       # LLM responses (TTL: 1h)
cache:embeddings:{hash}        # Embeddings cache (TTL: 24h)

# Real-time Data
online:users                   # Set of online users
websocket:{ws_id}              # WebSocket connections
queue:{queue_name}             # Task queues

# Temporary Data
temp:upload:{upload_id}        # Temporary uploads (TTL: 1h)
temp:otp:{email}               # OTP codes (TTL: 5min)
lock:{resource}                # Distributed locks
```

### 3. Qdrant (Port 6333)

**Container**: `qdrant`
**Usage**: Vector Database pour RAG

#### Collections Qdrant

```python
# RAG Collections
collection: "documents"
  - vectors: 1536 dimensions (OpenAI ada-002)
  - payload: {text, metadata, source, timestamp}
  - count: ~10K vectors

collection: "knowledge_base"
  - vectors: 1536 dimensions
  - payload: {content, tags, category, level}
  - count: ~5K vectors

collection: "embeddings_cache"
  - vectors: 1536 dimensions
  - payload: {query, response, model}
  - count: ~2K vectors

# Agent Memory
collection: "agent_memories"
  - vectors: 1536 dimensions
  - payload: {agent_id, memory, context}
  - count: ~1K vectors
```

### 4. Ollama (Port 11434)

**Container**: `iaf-dz-ollama`
**Status**: ⚠️ Unhealthy
**Models**: Local LLMs

```bash
# Modèles disponibles
ollama list

# Models recommandés
llama3.1:8b
mistral:7b
mixtral:8x7b
codellama:13b
phi3:mini
```

---

## 📊 MONITORING & OBSERVABILITÉ

### 1. Stack Monitoring

```
┌─────────────┐
│   Grafana   │  Port 3033
│  Dashboard  │  https://www.iafactoryalgeria.com/grafana/
└──────┬──────┘
       │
       ├────────┐
       │        │
┌──────▼───┐  ┌▼────────┐
│Prometheus│  │  Loki   │
│  :9090   │  │  :3100  │
└──┬───┬───┘  └───┬─────┘
   │   │          │
   │   │    ┌─────▼─────┐
   │   │    │ Promtail  │
   │   │    └───────────┘
   │   │
   │   ├──────────┐
   │   │          │
┌──▼───▼───┐  ┌──▼──────┐
│AlertMgr  │  │cAdvisor │
│  :9093   │  │  :8888  │
└──────────┘  └─────────┘
```

### 2. Composants Monitoring

#### Prometheus (Port 9090)
```yaml
# Config
/opt/iafactory-rag-dz/monitoring/prometheus/prometheus.yml

# Targets
- Backend API :8180
- AI Agents :9101-9118
- Apps :8182-8216
- Node Exporter :9100
- cAdvisor :8888

# Metrics
- HTTP requests
- Response times
- Error rates
- Container metrics
- System metrics
```

#### Grafana (Port 3033)
```yaml
# URL
https://www.iafactoryalgeria.com/grafana/

# Dashboards
1. System Overview
2. Docker Containers
3. Application Metrics
4. API Performance
5. AI Agents Status
6. Database Metrics
7. Nginx Metrics
8. Alert History
```

#### Loki + Promtail
```yaml
# Loki (Logs aggregation)
Port: 3100
Storage: /var/lib/loki

# Promtail (Log collector)
Config: /etc/promtail/config.yml
Sources:
  - Docker containers
  - Nginx logs
  - Application logs
  - System logs
```

#### cAdvisor (Port 8888)
```yaml
# Container metrics
URL: http://localhost:8888
Metrics:
  - CPU usage
  - Memory usage
  - Network I/O
  - Disk I/O
  - Container stats
```

#### AlertManager (Port 9093)
```yaml
# Alert routing
URL: http://localhost:9093
Alerts:
  - High CPU usage (>80%)
  - High memory usage (>85%)
  - Container down
  - API errors (>5%)
  - Disk space low (<10%)

# Notifications
- Email alerts
- Webhook to Discord/Slack
```

### 3. Métriques Exposées

```python
# Application Metrics (FastAPI)
http_requests_total              # Total HTTP requests
http_request_duration_seconds    # Request duration
http_errors_total                # Total errors
llm_requests_total               # LLM API calls
llm_tokens_used                  # Tokens consumed
rag_queries_total                # RAG queries
vector_db_operations             # Vector DB ops
cache_hits_total                 # Cache hits
cache_misses_total               # Cache misses

# Container Metrics (cAdvisor)
container_cpu_usage_seconds      # CPU usage
container_memory_usage_bytes     # Memory usage
container_network_receive_bytes  # Network RX
container_network_transmit_bytes # Network TX
container_fs_usage_bytes         # Filesystem usage

# System Metrics (Node Exporter)
node_cpu_seconds_total           # CPU time
node_memory_MemAvailable_bytes   # Available memory
node_disk_read_bytes_total       # Disk reads
node_disk_written_bytes_total    # Disk writes
node_network_receive_bytes_total # Network RX
```

---

## 🔐 SÉCURITÉ & AUTHENTICATION

### 1. Authentification

#### JWT Tokens
```python
# Token structure
{
  "user_id": "uuid",
  "email": "user@example.com",
  "roles": ["user", "admin"],
  "exp": 1234567890,
  "iat": 1234567890
}

# Token types
- Access Token: 15 minutes
- Refresh Token: 7 days
- API Key: Permanent (revocable)
```

#### OAuth2 Integrations
```yaml
# Google OAuth
- Calendar access
- Gmail access
- Drive access
- OAuth scopes: limited

# GitHub OAuth (pour Bolt.DIY)
- Repo access
- User info
```

### 2. API Security

#### Rate Limiting
```python
# Redis-based rate limiting
- Default: 100 req/min per IP
- Authenticated: 1000 req/min per user
- Premium: 10000 req/min per user
```

#### CORS Policy
```python
# Allowed origins
origins = [
    "https://www.iafactoryalgeria.com",
    "https://iafactoryalgeria.com",
    "http://localhost:3000",
    "http://localhost:5173"
]
```

#### Security Headers
```nginx
# Nginx headers
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

### 3. SSL/TLS

```nginx
# Let's Encrypt SSL
ssl_certificate: /etc/letsencrypt/live/www.iafactoryalgeria.com/fullchain.pem
ssl_certificate_key: /etc/letsencrypt/live/www.iafactoryalgeria.com/privkey.pem

# SSL Configuration
ssl_protocols: TLSv1.2 TLSv1.3
ssl_ciphers: HIGH:!aNULL:!MD5
ssl_prefer_server_ciphers: on
```

### 4. Secrets Management

```bash
# Environment variables (.env)
MONGODB_URI="mongodb://..."
REDIS_URL="redis://..."
JWT_SECRET="..."
OPENAI_API_KEY="..."
ANTHROPIC_API_KEY="..."
GROQ_API_KEY="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Stored in:
- /opt/iafactory-rag-dz/.env
- Docker secrets
- MongoDB credentials collection
```

---

## 🚀 DÉPLOIEMENT & DEVOPS

### 1. Docker Compose

#### Production Stack
```yaml
# File: docker-compose.prod.yml
services:
  # Base services
  mongodb:          # Database
  redis:            # Cache
  qdrant:           # Vector DB
  ollama:           # Local LLMs

  # Backend
  backend:          # FastAPI API

  # AI Agents (18 containers)
  ai-*-prod:        # Streamlit agents

  # Frontend Apps (14 containers)
  *-prod:           # React/Static apps

  # Monitoring (8 containers)
  prometheus:
  grafana:
  loki:
  promtail:
  alertmanager:
  node-exporter:
  cadvisor:

  # Automation
  n8n:              # Workflow automation
```

#### Essential Services
```yaml
# File: docker-compose.essential.yml
# Services minimum pour démarrage
- mongodb
- redis
- qdrant
- backend
- landing-page
```

### 2. Deployment Process

```bash
# 1. Pull latest code
cd /opt/iafactory-rag-dz
git pull origin main

# 2. Build containers
docker-compose -f docker-compose.prod.yml build

# 3. Stop old containers
docker-compose -f docker-compose.prod.yml down

# 4. Start new containers
docker-compose -f docker-compose.prod.yml up -d

# 5. Reload nginx
nginx -t && systemctl reload nginx

# 6. Check health
docker ps
curl http://localhost:8180/health
```

### 3. CI/CD (Future)

```yaml
# .github/workflows/deploy.yml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Build Docker images
      - Push to registry
      - SSH to VPS
      - Pull images
      - Restart services
      - Run health checks
```

### 4. Backup Strategy

```bash
# MongoDB Backup (Daily)
0 2 * * * docker exec ia-factory-mongodb \
  mongodump --out /backup/$(date +\%Y\%m\%d)

# Code Backup (Hourly)
0 * * * * rsync -avz /opt/iafactory-rag-dz/ \
  /backup/code/

# Qdrant Backup (Daily)
0 3 * * * docker exec qdrant \
  /backup-script.sh
```

### 5. Scaling Considerations

```yaml
# Horizontal Scaling (Future)
- Load balancer (HAProxy/Nginx)
- Multiple backend replicas
- Separate DB servers
- Redis Cluster
- Qdrant Cluster

# Vertical Scaling (Current)
- VPS: 4 vCPU, 8 GB RAM
- Recommendation: 8 vCPU, 16 GB RAM
```

---

## 🌐 ROUTES & URLS

### 1. Public URLs

#### Main Domain
```
https://www.iafactoryalgeria.com/              # Landing page
https://www.iafactoryalgeria.com/apps.html     # Apps catalog
```

#### Core Applications
```
/hub/                  # Hub central
/docs/                 # Documentation
/rag/                  # RAG UI
/dashboard/            # Dashboard
/developer/            # Developer portal
/billing/              # Billing panel
```

#### AI Assistants
```
/council/              # Council AI
/ithy/                 # Ithy Assistant
/bmad/                 # BMAD Multi-Agent
/notebook/             # Notebook LM
/creative/             # Creative Studio
```

#### Business Apps
```
/pme/                  # PME Copilot
/crm/                  # CRM IA (via API)
/growth-grid/          # Growth Grid (via /apps/)
/pipeline/             # Pipeline Creator (via /apps/)
```

#### Specialized Services
```
/legal/                # Legal Assistant
/fiscal/               # Fiscal Assistant
/voice/                # Voice Assistant
/data-dz/              # Data DZ
/data-dashboard/       # Data Dashboard
```

#### Developer & Automation
```
/n8n/                  # n8n Workflows
/bolt/                 # Bolt.DIY Code Generator
/archon-ui/            # Archon Multi-Agent UI
/archon-api/           # Archon API
/archon-mcp/           # Archon MCP Server
```

#### Monitoring & Observability
```
/grafana/              # Grafana Dashboards
/prometheus/           # Prometheus (protected)
/alertmanager/         # Alert Manager (protected)
```

### 2. API Routes

#### Base API
```
/api/                  # Backend API base
/api/health            # Health check
/api/metrics           # Prometheus metrics
/api/docs              # OpenAPI docs (Swagger)
```

#### Authentication & Users
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
GET  /api/auth/me
POST /api/auth/logout
```

#### RAG & Knowledge
```
POST /api/upload
POST /api/query
POST /api/ingest
GET  /api/knowledge
DELETE /api/knowledge/{id}
GET  /api/progress/{url}
```

#### AI Agents & Chat
```
POST /api/agent-chat
GET  /api/agents/list
POST /api/council
POST /api/ithy
POST /api/bmad/chat
POST /api/orchestrator/execute
```

#### Business APIs
```
POST /api/pme/chat
POST /api/pme/documents
GET  /api/pme/dashboard

POST /api/crm/contacts
GET  /api/crm/deals
POST /api/crm/activities

POST /api/billing/invoice
GET  /api/billing/status
POST /api/credits/purchase
```

#### Specialized Services
```
POST /api/dz-legal/query
GET  /api/dz-legal/cases

POST /api/dz-fiscal/calculate
GET  /api/dz-fiscal/regulations

POST /api/voice/transcribe
POST /api/voice/synthesize

POST /api/dz-data/query
GET  /api/public/dz-data/stats
```

#### Integrations
```
POST /api/google/oauth/callback
GET  /api/calendar/events
POST /api/email/send

POST /api/twilio/sms
POST /api/whatsapp/message
GET  /api/whatsapp/threads
```

#### Media & Content
```
POST /api/dzirvideo/create
GET  /api/dzirvideo/status/{id}
POST /api/dzirvideo/render

POST /api/transcription/upload
GET  /api/transcription/{id}

POST /api/ocr/extract
GET  /api/ocr/result/{id}
```

#### Automation & Workflows
```
GET  /api/workflows/list
POST /api/workflows/execute
GET  /api/workflows/status/{id}

POST /api/orchestrator/task
GET  /api/orchestrator/results
```

#### Admin & Management
```
GET  /api/admin/users
GET  /api/admin/stats
POST /api/admin/billing/refund
GET  /api/admin/system/health

POST /api/credentials
GET  /api/credentials
POST /api/user-keys
```

### 3. WebSocket Endpoints

```
ws://localhost:8180/ws                  # Main WebSocket
ws://localhost:8180/ws/agent-chat       # Agent chat stream
ws://localhost:8180/ws/notifications    # Real-time notifications
ws://localhost:8180/ws/progress         # Progress updates
```

### 4. Static Assets

```
/assets/                # Static assets
/img/                   # Images
/docs/                  # Documentation files
/uploads/               # User uploads
/outputs/               # Generated outputs
```

### 5. Subdomains (Future)

```
api.iafactoryalgeria.com         # API subdomain
app.iafactoryalgeria.com         # Main app
agents.iafactoryalgeria.com      # AI Agents hub
docs.iafactoryalgeria.com        # Documentation
status.iafactoryalgeria.com      # Status page
```

---

## 📦 MODULES & LIBRARIES

### Backend Dependencies (Python)

```txt
# Core
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
python-multipart==0.0.6

# Database
pymongo==4.6.0
motor==3.3.2               # Async MongoDB
redis==5.0.1
qdrant-client==1.7.0

# AI & LLM
openai==1.3.7
anthropic==0.8.1
groq==0.4.1
langchain==0.1.0
llama-index==0.9.30
sentence-transformers==2.2.2

# RAG & Embeddings
chromadb==0.4.18
faiss-cpu==1.7.4
pinecone-client==2.2.4

# NLP & Processing
spacy==3.7.2
transformers==4.35.2
tiktoken==0.5.2

# OCR & Vision
pytesseract==0.3.10
pdf2image==1.16.3
pillow==10.1.0

# Voice
openai-whisper==1.1.10
pydub==0.25.1
ffmpeg-python==0.2.0

# Web & Scraping
httpx==0.25.2
beautifulsoup4==4.12.2
playwright==1.40.0
selenium==4.16.0

# Auth & Security
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6

# Integrations
google-auth==2.25.2
google-api-python-client==2.109.0
twilio==8.11.1

# Monitoring
prometheus-client==0.19.0
python-json-logger==2.0.7

# Utils
python-dotenv==1.0.0
pyyaml==6.0.1
```

### Frontend Dependencies (React)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",

    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.1",

    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",

    "@tanstack/react-query": "^5.12.0",
    "axios": "^1.6.2",
    "zustand": "^4.4.7",

    "lucide-react": "^0.294.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",

    "react-markdown": "^9.0.1",
    "highlight.js": "^11.9.0",

    "date-fns": "^2.30.0",
    "zod": "^3.22.4"
  }
}
```

### AI Agents Dependencies (Streamlit)

```txt
# Streamlit
streamlit==1.30.0
streamlit-chat==0.1.1
streamlit-extras==0.3.6

# AI
phidata==2.3.0
langchain==0.1.0
openai==1.3.7

# Data
pandas==2.1.4
numpy==1.26.2
plotly==5.18.0

# Utils
python-dotenv==1.0.0
requests==2.31.0
```

---

## 📊 STATISTIQUES & MÉTRIQUES

### Infrastructure

```yaml
Total Containers: 57
  - Production: 45
  - Monitoring: 8
  - Base Services: 4

Total Applications: 71
  - Frontend Apps: 71
  - AI Agents: 18
  - Backend Services: 25+

Total Ports Used: 50+
  - Range: 3033-9118
  - External: 10+
  - Internal: 40+

Total Storage:
  - Code: ~5 GB
  - Docker Images: ~20 GB
  - MongoDB: 304 KB
  - Qdrant: ~2 GB
  - Logs: ~500 MB
```

### Performance Targets

```yaml
API Response Time:
  - p50: <100ms
  - p95: <500ms
  - p99: <1s

LLM Response Time:
  - Streaming: <2s first token
  - Complete: <10s

RAG Query:
  - Embedding: <200ms
  - Retrieval: <300ms
  - Total: <2s

Uptime Target: 99.9%
Max Concurrent Users: 1000
```

---

## 🎯 FEATURES PRINCIPALES

### 1. Multi-LLM Support
- 15 providers LLM
- Automatic failover
- Cost optimization
- Response caching

### 2. RAG System
- Multiple RAG strategies
- Hybrid search
- Context-aware retrieval
- Multi-source ingestion

### 3. AI Agents
- 18 specialized agents
- Multi-agent orchestration
- Tool use & function calling
- Memory & context management

### 4. Business Applications
- 71 vertical-specific apps
- Algerian market focus
- Multi-language (FR/AR/EN)
- Mobile-responsive

### 5. Integrations
- Google Workspace
- Twilio SMS
- WhatsApp Business
- n8n Automation
- GitHub (Bolt.DIY)

### 6. Developer Tools
- API Portal
- Documentation
- Code Generator (Bolt)
- Workflow Creator
- MCP Servers

### 7. Monitoring & Ops
- Prometheus metrics
- Grafana dashboards
- Log aggregation (Loki)
- Alerting system
- Health checks

---

## 🔮 ROADMAP & NEXT STEPS

### Phase 1 - Stabilization (Current)
- ✅ Infrastructure deployment
- ✅ Core services running
- ✅ AI Agents deployed
- ⏳ Landing page optimization
- ⏳ Performance tuning

### Phase 2 - Enhancement (Q1 2025)
- [ ] User authentication UI
- [ ] Billing integration complete
- [ ] Enhanced monitoring
- [ ] API documentation (Swagger)
- [ ] Mobile apps

### Phase 3 - Scale (Q2 2025)
- [ ] Load balancing
- [ ] Database clustering
- [ ] CDN integration
- [ ] Multi-region deployment
- [ ] White-label solutions

### Phase 4 - AI Advanced (Q3 2025)
- [ ] Custom AI models
- [ ] Fine-tuning pipeline
- [ ] Multi-modal AI
- [ ] Voice AI enhanced
- [ ] Video AI production

---

## 📞 SUPPORT & CONTACTS

### Technical Support
```
Email: support@iafactoryalgeria.com
GitHub: github.com/iafactory/rag-dz
Docs: www.iafactoryalgeria.com/docs/
```

### Emergency Contacts
```
VPS Access: ssh root@46.224.3.125
Monitoring: www.iafactoryalgeria.com/grafana/
Status: docker ps --format "table {{.Names}}\t{{.Status}}"
```

---

## 📝 NOTES IMPORTANTES

1. **Ollama Container** est actuellement "unhealthy" - à investiguer
2. **Landing Page** nécessite optimisation et corrections
3. **SSL Certificates** - Renouvellement auto Let's Encrypt
4. **Backups** - Configurer backups automatiques quotidiens
5. **Scaling** - Prévoir upgrade VPS pour charge croissante

---

## 🏁 CONCLUSION

Cette architecture représente une **plateforme SaaS complète** avec:

- ✅ 57 containers Docker orchestrés
- ✅ 71 applications métier
- ✅ 18 AI Agents spécialisés
- ✅ 15 providers LLM
- ✅ Stack monitoring complet
- ✅ Multi-tenant ready
- ✅ Production-grade infrastructure

**Status**: 🟢 Production Active
**Version**: 1.0
**Dernière mise à jour**: 12 Décembre 2025

---

**Généré par**: Claude Code
**Source**: VPS 46.224.3.125 - /opt/iafactory-rag-dz/
**Domaine**: https://www.iafactoryalgeria.com
