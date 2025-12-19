# 📋 INVENTAIRE COMPLET - AGENTS & APPLICATIONS IAFactory

**Date**: 6 décembre 2025
**Projet**: IAFactory RAG-DZ
**Total Applications**: 58 apps
**Total Agents Backend**: 40+ routers/agents

---

## 🎯 APPLICATIONS FRONTEND (apps/)

### 🌾 SECTEUR AGRICULTURE (5 apps)
1. **agri-dz/** - Agriculture Algérie
2. **agroalimentaire-dz/** - Agroalimentaire Algérie
3. **irrigation-dz/** - Systèmes irrigation

### 🏗️ SECTEUR BTP & INDUSTRIE (3 apps)
4. **btp-dz/** - Bâtiment & Travaux Publics
5. **industrie-dz/** - Industrie manufacturière
6. **transport-dz/** - Transport & Logistique

### 💼 BUSINESS & PME (8 apps)
7. **business-dz/** - Business général Algérie
8. **pme-copilot/** - Copilote PME (backend)
9. **pme-copilot-ui/** - Copilote PME (frontend)
10. **pmedz-sales/** - Ventes PME DZ (backend)
11. **pmedz-sales-ui/** - Ventes PME DZ (frontend)
12. **startup-dz/** - Startups Algérie
13. **startupdz-onboarding/** - Onboarding startups (backend)
14. **startupdz-onboarding-ui/** - Onboarding startups (frontend)

### 🏥 SECTEUR SANTÉ (3 apps)
15. **clinique-dz/** - Cliniques & Cabinets médicaux
16. **med-dz/** - Médecine générale
17. **pharma-dz/** - Pharmacies

### 💰 FINANCE & SERVICES (5 apps)
18. **expert-comptable-dz/** - Expertise comptable
19. **fiscal-assistant/** - Assistant fiscal
20. **legal-assistant/** - Assistant juridique
21. **douanes-dz/** - Douanes & Import/Export
22. **tarifs-paiement/** - Tarifs & Paiements

### 🛍️ COMMERCE & E-COMMERCE (2 apps)
23. **commerce-dz/** - Commerce général
24. **ecommerce-dz/** - E-commerce

### 🎓 ÉDUCATION (3 apps)
25. **formation-pro-dz/** - Formation professionnelle
26. **prof-dz/** - Professeurs & Enseignants
27. **universite-dz/** - Universités

### 🕌 CULTURE & SOCIÉTÉ (1 app)
28. **islam-dz/** - Islam & Culture islamique

### 🤖 IA & DÉVELOPPEMENT (15 apps)
29. **ai-searcher/** - Recherche IA
30. **bmad/** - BMAD (Build, Manage, Automate, Deploy)
31. **bmad-origin/** - BMAD Original version
32. **chatbot-ia/** - Chatbot IA général
33. **council/** - LLM Council (délibération multi-IA)
34. **creative-studio/** - Studio créatif (vidéo/image/présentation)
35. **developer/** - Outils développeurs
36. **dev-portal/** - Portail développeurs
37. **ithy/** - Ithy MoA (Mixture-of-Agents)
38. **notebook-lm/** - Document Q&A avec RAG
39. **pipeline-creator/** - Créateur de pipelines
40. **prompt-creator/** - Générateur de prompts pro
41. **dzirvideo-ai/** - Génération vidéo IA DZ
42. **growth-grid/** - Business Plan Generator IA
43. **voice-assistant/** - Assistant vocal

### 📊 CRM & SALES (3 apps)
44. **crm-ia/** - CRM IA (backend)
45. **crm-ia-ui/** - CRM IA (frontend)
46. **billing-panel/** - Panel facturation

### 🌐 INFRASTRUCTURE & API (9 apps)
47. **api-packages/** - Landing page API packages (NOUVEAU)
48. **api-portal/** - Portail API
49. **dashboard/** - Dashboard général
50. **dashboard-central/** - Dashboard central
51. **data-dz/** - Data Algérie
52. **data-dz-dashboard/** - Dashboard Data DZ
53. **landing/** - Landing page principale
54. **landing-pro/** - Landing page PRO
55. **shared/** - Composants partagés
56. **shared-components/** - Composants partagés UI

### 🔍 SEO & MARKETING (2 apps)
57. **seo-dz/** - SEO Algérie
58. **seo-dz-boost/** - SEO Boost avancé

---

## 🤖 AGENTS BACKEND (backend/rag-compat/app/)

### 🔐 AUTHENTIFICATION & SÉCURITÉ
1. **auth** - Authentification & autorisation
2. **credentials** - Gestion credentials AI providers
3. **user_keys** - Gestion clés API (Key Reselling)

### 📚 RAG & KNOWLEDGE
4. **knowledge** - Gestion base de connaissances
5. **query** - Requêtes RAG
6. **upload** - Upload documents
7. **ingest** - Ingestion documents
8. **rag_public** - RAG API publique pour Bolt
9. **bigrag_router** - RAG Multi-Pays DZ/CH/GLOBAL
10. **bigrag_ingest** - Ingestion documents RAG multi-pays
11. **progress** - Progression ingestion

### 🤝 ORCHESTRATION & COORDINATION
12. **orchestrator** - Orchestrateur général
13. **coordination** - Coordination agents
14. **bmad** - BMAD core
15. **bmad_chat** - Chat BMAD
16. **bmad_orchestration** - Orchestration BMAD
17. **bolt** - Bolt SuperPower
18. **council** - LLM Council multi-IA délibération
19. **council_custom** - Council personnalisable
20. **ithy** - Ithy MoA (Mixture-of-Agents)

### 💬 CHAT & COMMUNICATION
21. **agent_chat** - Chat agent (compatibilité Archon-UI)
22. **websocket_router** - WebSocket temps réel
23. **email_agent** - Agent Email (6ème agent)
24. **whatsapp** - WhatsApp Business via Twilio
25. **twilio** - SMS et rappels Twilio

### 🎙️ VOICE & AUDIO
26. **voice** - Agent vocal Vapi.ai
27. **voice_agent_router** - Agent vocal complet DZ
28. **stt_router** - Speech-to-Text arabe/darija
29. **tts_router** - Text-to-Speech arabe/darija

### 📅 PRODUCTIVITÉ
30. **calendar** - Gestion rendez-vous
31. **google** - Google Calendar & Gmail

### 💳 BILLING & CRM
32. **billing** - Gestion crédits et facturation
33. **billing_v2** - Gestion crédits SaaS PRO
34. **crm** - Gestion des leads
35. **crm_pro** - CRM HubSpot-like DZ/CH powered by IA
36. **pme** - Analyse PME DZ (v1)
37. **pme_v2** - Analyse PME DZ PRO

### 🎬 CRÉATION CONTENU
38. **studio_video** - Studio Créatif (Video/Image/Presentation)
39. **dzirvideo** - Dzir IA Video - Génération vidéo IA
40. **growth_grid** - Business Plan Generator IA
41. **notebook_lm** - Document Q&A avec RAG
42. **prompt_creator** - Générateur de prompts pro

### 🌍 MULTI-LANGUE & LOCALISATION
43. **darija_router** - NLP Darija algérienne
44. **ocr_router** - OCR multilingue arabe/français/anglais

### 🤖 IA MULTI-PROVIDERS
45. **multi_llm_router** - Multi-providers IA + Crédit Manager
46. **team_seats_router** - ChatGPT Team Seats Manager

### 🎁 PROMO & MARKETING
47. **promo_codes** - Codes promo lancement 30 clients (NOUVEAU)

### 🧪 TESTS
48. **test** - Routes de test

---

## 🎯 AGENTS IA STANDALONE (ia-agents/)

### 📄 TRAITEMENT DOCUMENTS
1. **chat-pdf/** - Chat avec PDFs
2. **local-rag/** - RAG local

### 🔍 RECHERCHE & ANALYSE
3. **hybrid-search/** - Recherche hybride (dense + sparse)

### 💰 FINANCE
4. **finance-agent/** - Agent finance

### 🎤 VOICE
5. **voice-support/** - Support vocal

### 🔧 SHARED
6. **shared/** - Utilitaires partagés

---

## 📊 STATISTIQUES GLOBALES

### Applications
- **Total apps**: 58 applications
- **Secteur Business**: 8 apps
- **Secteur IA/Dev**: 15 apps
- **Secteur Santé**: 3 apps
- **Secteur Agriculture**: 5 apps
- **Infrastructure**: 9 apps

### Agents Backend
- **Total routers**: 48 routers/agents
- **RAG & Knowledge**: 11 agents
- **Orchestration**: 9 agents
- **Voice & Audio**: 4 agents
- **Billing & CRM**: 6 agents
- **IA Multi-providers**: 2 agents

### Agents IA Standalone
- **Total agents**: 6 agents spécialisés

---

## 🗂️ ORGANISATION PAR STACK

### Frontend React/Vite
```
apps/
├── *-ui/ (interfaces utilisateur)
├── dashboard*/ (dashboards)
└── landing*/ (pages marketing)
```

### Backend FastAPI
```
backend/rag-compat/app/routers/
├── auth, credentials, user_keys (auth)
├── knowledge, query, upload, rag_public (RAG)
├── billing*, crm*, pme* (business)
├── voice*, stt*, tts* (voice)
└── promo_codes (marketing)
```

### Agents Python Standalone
```
ia-agents/
├── chat-pdf/ (Streamlit)
├── finance-agent/ (FastAPI)
├── voice-support/ (Twilio)
└── local-rag/ (LlamaIndex)
```

---

## 🔗 INTÉGRATIONS PRINCIPALES

### AI Providers
- OpenAI (GPT-4, GPT-3.5, Whisper, TTS)
- Anthropic (Claude Sonnet, Opus, Haiku)
- Google (Gemini, PaLM)
- Groq (Llama 3.3-70B, Mixtral)
- DeepSeek (DeepSeek-Chat)
- Ollama (modèles locaux)

### Services Externes
- Twilio (SMS, WhatsApp)
- Google Calendar & Gmail
- Vapi.ai (Voice AI)
- Supabase (Database)
- Qdrant (Vector DB)
- PostgreSQL (Primary DB)

### Outils Dev
- BMAD (Build, Manage, Automate, Deploy)
- Bolt SuperPower (code generation)
- Archon UI (interface)

---

## 🚀 APPS PRIORITAIRES (PRODUCTION)

### Top 10 Apps Actives
1. **landing/** - Landing page principale ✅ LIVE
2. **api-packages/** - Landing API packages ✅ LIVE (NOUVEAU)
3. **bmad/** - Build, Manage, Automate, Deploy ✅
4. **council/** - LLM Council délibération ✅
5. **ithy/** - Mixture-of-Agents ✅
6. **crm-pro/** - CRM HubSpot-like ✅
7. **pme-copilot/** - Copilote PME ✅
8. **dzirvideo-ai/** - Génération vidéo IA ✅
9. **notebook-lm/** - Document Q&A ✅
10. **growth-grid/** - Business Plan Generator ✅

### Top 10 Agents Backend Actifs
1. **multi_llm_router** - Multi-providers IA ✅
2. **promo_codes** - Codes promo (NOUVEAU) ✅
3. **council** - LLM Council ✅
4. **ithy** - Mixture-of-Agents ✅
5. **voice_agent_router** - Agent vocal DZ ✅
6. **bigrag_router** - RAG Multi-Pays ✅
7. **crm_pro** - CRM PRO ✅
8. **pme_v2** - Analyse PME PRO ✅
9. **billing_v2** - Billing SaaS PRO ✅
10. **dzirvideo** - Génération vidéo ✅

---

## 📍 URLS DÉPLOYÉES

### Production (VPS 46.224.3.125)
- **Landing principale**: https://www.iafactoryalgeria.com/
- **API Packages**: https://www.iafactoryalgeria.com/api-packages/ ✅ (NOUVEAU)
- **BMAD**: https://www.iafactoryalgeria.com/bmad/
- **Bolt**: https://bolt.iafactoryalgeria.com/
- **Archon**: https://archon.iafactoryalgeria.com/
- **Grafana**: https://grafana.iafactoryalgeria.com/

### API Backend
- **Base URL**: https://www.iafactoryalgeria.com/api/
- **Health**: /health
- **Docs**: /docs (dev only)
- **Metrics**: /metrics (Prometheus)

### API Promo (NOUVEAU)
- **Health**: /api/promo/health ✅
- **Places**: /api/promo/launch30/remaining ✅
- **Validate**: /api/promo/validate ✅
- **Signup**: /api/promo/signup ✅
- **Stats**: /api/promo/stats ✅

---

## 🎯 ROADMAP APPS

### Phase 1 (Terminé)
- ✅ BMAD core
- ✅ Council & Ithy
- ✅ Multi-LLM Router
- ✅ Promo Codes System

### Phase 2 (En cours)
- 🔄 DzirVideo AI optimisation
- 🔄 CRM PRO enrichissement
- 🔄 PME Copilot V3
- 🔄 Voice Agent DZ perfectionnement

### Phase 3 (Planifié)
- 📋 E-commerce DZ full feature
- 📋 Legal Assistant complet
- 📋 Fiscal Assistant DZ
- 📋 Expert Comptable DZ automation

---

## 📞 SUPPORT & DOCUMENTATION

### Documentation
- `STATUS_FINAL_SESSION_2025-12-06_21H.md` - Status complet
- `TACHES_URGENTES_APRES_SESSION.md` - Tâches prioritaires
- `PROMPT_POUR_CURSOR_VSCODE_2025-12-06.md` - Prompt autres IA

### Contact
- **Email**: contact@iafactoryalgeria.com
- **VPS**: 46.224.3.125
- **Backend Port**: 8180
- **Frontend Port**: 5173 (dev)

---

**Créé par**: Claude Code
**Date**: 6 décembre 2025 - 22:10
**Version**: 1.0
**Status**: ✅ INVENTAIRE COMPLET À JOUR
