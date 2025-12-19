# 🏗️ IAFactory DZ/CH - Infrastructure Overview

## 📋 Résumé Exécutif

**IAFactory** est une plateforme SaaS d'intelligence artificielle souveraine pour l'Algérie 🇩🇿 et la Suisse 🇨🇭, offrant des services de :
- 📚 **BIG RAG Multi-Pays** : Base de connaissances fiscales, juridiques et administratives
- 🎙️ **Voice AI** : Agent vocal en arabe (MSA + Darija algérienne) et français
- 💼 **CRM PRO** : Gestion clients powered by IA
- 💰 **Billing PRO** : Système de crédits et facturation SaaS
- 🏢 **PME Copilot** : Analyse financière pour PME algériennes

---

## 🖥️ Infrastructure VPS Hetzner

| Paramètre | Valeur |
|-----------|--------|
| **IP** | `46.224.3.125` |
| **OS** | Ubuntu 22.04 LTS |
| **Région** | Nuremberg, DE (proche DZ/CH) |
| **Ports** | 8180-8191 |

### Domaines configurés
- `www.iafactoryalgeria.com` → Frontend DZ
- `www.iafactory.ch` → Frontend CH
- `api.iafactoryalgeria.com` → API Backend

---

## 🐳 Services Docker

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| **Backend API** | `iaf-dz-backend` | 8180 | FastAPI + tous les modules |
| **PostgreSQL** | `iaf-dz-postgres` | 6330 | DB + PGVector |
| **Redis** | `iaf-dz-redis` | 6331 | Cache |
| **Qdrant** | `iaf-dz-qdrant` | 6332 | Vector DB |
| **Hub UI** | `iaf-dz-hub` | 8182 | Dashboard Archon |
| **Docs UI** | `iaf-dz-docs` | 8183 | Interface RAG |
| **n8n** | `iaf-dz-n8n` | 8185 | Workflows |
| **Ollama** | `iaf-dz-ollama` | 8186 | LLM local |
| **Prometheus** | `iaf-dz-prometheus` | 8187 | Metrics |
| **Grafana** | `iaf-dz-grafana` | 8188 | Dashboards |

---

## 🔌 API Endpoints

### Core
| Endpoint | Description |
|----------|-------------|
| `GET /health` | Santé du backend |
| `GET /docs` | Swagger UI |
| `GET /metrics` | Prometheus metrics |

### Billing & CRM
| Endpoint | Description |
|----------|-------------|
| `GET /api/billing/v2/health` | Billing PRO V2 |
| `GET /api/crm-pro/health` | CRM PRO |
| `GET /api/pme/v2/health` | PME Analyzer V2 |

### BIG RAG Multi-Pays 🌍
| Endpoint | Description |
|----------|-------------|
| `GET /api/rag/multi/status` | Status BIG RAG |
| `GET /api/rag/multi/collections` | Collections disponibles |
| `POST /api/rag/multi/query` | Recherche unifiée |
| `POST /api/rag/multi/seed/search` | Recherche par collection |
| `POST /api/rag/multi/ingest/file` | Ingestion fichier |
| `POST /api/rag/multi/ingest/url` | Ingestion URL |

### Voice AI 🎙️
| Endpoint | Description |
|----------|-------------|
| `GET /api/voice/stt/status` | Speech-to-Text status |
| `GET /api/voice/tts/status` | Text-to-Speech status |
| `GET /api/agent/voice/status` | Voice Agent status |
| `POST /api/agent/voice/chat` | Chat vocal complet |
| `POST /api/agent/voice/text` | Chat texte |

### NLP & OCR 📄
| Endpoint | Description |
|----------|-------------|
| `GET /api/darija/status` | Darija NLP status |
| `POST /api/darija/detect` | Détection dialecte |
| `POST /api/darija/normalize` | Normalisation |
| `GET /api/ocr/status` | OCR status |
| `POST /api/ocr/process` | OCR image |

---

## 📊 Collections RAG

| Collection | Pays | Contenu |
|------------|------|---------|
| `rag_dz` | 🇩🇿 Algérie | Fiscalité, juridique, admin |
| `rag_ch` | 🇨🇭 Suisse | Fiscalité, AVS, juridique |
| `rag_global` | 🌍 Global | Docs multilingues communs |

---

## 🚀 Déploiement

### Quick Deploy
```bash
ssh root@46.224.3.125
cd /path/to/iafactory
./deploy.sh --backend
```

### Options
```bash
./deploy.sh --full      # Rebuild tout
./deploy.sh --backend   # Backend seulement
./deploy.sh --frontend  # Frontend seulement
./deploy.sh --no-cache  # Sans cache Docker
./deploy.sh --logs      # Afficher logs après
```

### Health Check
```bash
./health_check.sh              # Local
./health_check.sh 46.224.3.125 # VPS
```

---

## 🔐 Sécurité

- **API Keys** : Authentification par X-API-Key header
- **Rate Limiting** : 60/min, 1000/h par défaut
- **CORS** : Origines whitelist configurées
- **JWT** : Pour authentification utilisateurs
- **TLS** : Let's Encrypt via Traefik/Nginx

---

## 📈 Monitoring

### Endpoints de monitoring
- `GET /metrics` → Prometheus
- `GET /health` → Health check

### Grafana Dashboards
- API Performance
- RAG Usage
- Voice Agent Stats
- Credit Consumption

---

## 🔧 Variables d'environnement clés

```env
# LLM
GROQ_API_KEY=xxx
OPENAI_API_KEY=xxx
ANTHROPIC_API_KEY=xxx

# Voice
ELEVENLABS_API_KEY=xxx

# Database
POSTGRES_PASSWORD=xxx
REDIS_URL=redis://iafactory-redis:6379/0

# Security
API_SECRET_KEY=xxx
JWT_SECRET_KEY=xxx
```

---

## 📞 Support

- **Email** : support@iafactoryalgeria.com
- **WhatsApp** : +213 xxx xxx xxx
- **Docs** : https://docs.iafactoryalgeria.com

---

*Dernière mise à jour : Novembre 2025*
