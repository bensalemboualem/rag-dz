# 🏭 IA FACTORY

> **AI for All** - Solutions IA Suisse & Algérie

## 📧 Contacts

| Marché | Email | Website |
|--------|-------|---------|
| 🇨🇭 Suisse | contact@iafactory.ch | www.iafactory.ch |
| 🇩🇿 Algérie | contact@iafactoryalgeria.com | www.iafactoryalgeria.com |

## 🚀 Quick Start

```bash
# Lancer le serveur
python RUN.py

# Générer tous les documents
python generate_all.py
```

## 📡 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | Status |
| `GET /health` | Health check |
| `GET /kpis` | KPIs business |
| `GET /clients` | Liste clients |
| `GET /contacts` | Contacts CH/DZ |
| `POST /clients/create` | Créer client |
| `POST /documents/proposal` | Générer proposition |
| `POST /documents/deck` | Générer présentation |
| `POST /documents/dashboard` | Générer dashboard |

## 📁 Structure
```
rag-dz/
├── api/                    # FastAPI endpoints
├── core/                   # RAG engine, agents, LLM
├── workflows/              # Sales, delivery, support
├── templates/              # Documents, presentations
├── infrastructure/         # Docker, Kubernetes, scripts
├── outputs/                # Fichiers générés
└── config/                 # Configuration
```

## 🛠️ Services

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | Health check |
| `POST /clients/create` | Créer client |
| `POST /leads/capture` | Capturer lead |
| `POST /documents/proposal` | Générer proposition |
| `POST /documents/presentation` | Générer deck |
| `GET /analytics/kpis` | KPIs business |

### Génération Documents

```python
# Proposition commerciale
from templates.documents.proposition_commerciale import PropositionGenerator
gen = PropositionGenerator()
gen.generate(client_data, services, market="CH")

# Deck Teaching Assistant
from templates.presentations.teaching_assistant_deck import TeachingAssistantDeck
deck = TeachingAssistantDeck()
deck.generate()

# Dashboard KPIs
from templates.dashboards.kpi_dashboard import KPIDashboard
dashboard = KPIDashboard()
dashboard.generate()
```

## 🐳 Docker

```bash
# Démarrer tous les services
cd infrastructure/docker
docker-compose up -d

# Services disponibles:
# - API: http://localhost:8000
# - Grafana: http://localhost:3000
# - Prometheus: http://localhost:9090
# - Qdrant: http://localhost:6333
```

## 📊 KPIs Cibles 2025

| Métrique | Q1 | Q2 | Q3 | Q4 |
|----------|----|----|----|----|
| Clients | 20 | 40 | 70 | 100 |
| MRR | 10K | 22K | 40K | 60K |
| Profit | 85% | 85% | 85% | 85% |

---

© 2024 IA Factory Sàrl - Genève, Suisse
