# RAG.dz - Plateforme RAG Professionnelle Multilingue

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)](docker-compose.yml)
[![Python](https://img.shields.io/badge/python-3.11+-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/react-18+-61DAFB.svg)](https://reactjs.org)

> Système RAG (Retrieval-Augmented Generation) professionnel avec support multilingue (Français, Arabe, Anglais), architecture microservices, et monitoring complet.

## 🎯 Caractéristiques

### Architecture & Performance
- ✅ **Microservices** - Docker Compose avec 10 services
- ✅ **Multi-tenancy** - Isolation des données par tenant
- ✅ **Cache intelligent** - Redis pour embeddings et queries
- ✅ **Recherche hybride** - Vectorielle (Qdrant) + Lexicale (Meilisearch)
- ✅ **WebSocket** - Mises à jour en temps réel
- ✅ **Monitoring complet** - Prometheus + Grafana

### Intelligence Artificielle
- ✅ **Embeddings multilingues** - `paraphrase-multilingual-mpnet-base-v2`
- ✅ **LLM Cloud** - OpenAI (GPT-3.5/4) ou Anthropic (Claude)
- ✅ **Génération contextualisée** - Réponses RAG basées sur documents
- ✅ **Détection de langue** - Français, Arabe, Anglais

### Sécurité & Scalabilité
- ✅ **Authentication API Key** - SHA256 hashed
- ✅ **Rate limiting** - 60/min, 1000/h, burst protection
- ✅ **CORS & Security headers** - Production-ready
- ✅ **Health checks** - Auto-healing containers
- ✅ **Métriques Prometheus** - Monitoring temps réel

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│           Tailwind + TanStack Query + WebSocket              │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/WS
┌──────────────────────────▼──────────────────────────────────┐
│                    Backend API (FastAPI)                     │
│    Rate Limiting │ Auth │ Metrics │ WebSocket │ Cloud LLM   │
└──┬────────┬─────────┬──────────┬─────────────┬─────────────┬┘
   │        │         │          │             │             │
   ▼        ▼         ▼          ▼             ▼             ▼
┌──────┐ ┌─────┐ ┌───────┐ ┌──────────┐ ┌─────────┐ ┌────────┐
│Postgres│Redis│ Qdrant │ │OpenAI/   │ │Prometheus│Grafana │
│ Data   │Cache│Vectors │ │Anthropic │ │ Metrics  │Dashboard│
└────────┘└─────┘└────────┘ └──────────┘ └──────────┘└────────┘
```

## 🚀 Démarrage Rapide

### Prérequis

- Docker & Docker Compose
- 4GB RAM minimum (8GB recommandé)
- 2GB espace disque
- **API Key OpenAI ou Anthropic** pour le LLM

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/yourusername/rag-dz.git
cd rag-dz
```

2. **Configurer les variables d'environnement**
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer .env et ajouter votre API key
# Pour OpenAI:
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-votre-cle-openai-ici
LLM_MODEL=gpt-3.5-turbo

# Ou pour Anthropic Claude:
# LLM_PROVIDER=anthropic
# ANTHROPIC_API_KEY=sk-ant-votre-cle-anthropic-ici
# LLM_MODEL=claude-3-haiku-20240307
```

3. **Lancer les services**
```bash
# Démarrer tous les services
docker-compose up -d

# Attendre que tout soit prêt (2-3 minutes)
docker-compose ps
```

4. **Initialiser la démo**
```bash
# Linux/Mac
bash scripts/init-demo.sh

# Windows (Git Bash)
bash scripts/init-demo.sh

# Ou manuellement
docker exec -i ragdz-postgres psql -U postgres -d archon <<EOF
INSERT INTO tenants (id, name, plan, status)
VALUES ('00000000-0000-0000-0000-000000000001'::uuid, 'Demo Company', 'pro', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO api_keys (key_hash, tenant_id, name, plan)
VALUES ('e8c4f7b8d9e6c8a5f3b2d1a9e7c6b5a4d3c2b1a0f9e8d7c6b5a4d3c2b1a0f9e8',
        '00000000-0000-0000-0000-000000000001'::uuid, 'Demo API Key', 'pro')
ON CONFLICT (key_hash) DO NOTHING;
EOF
```

5. **Accéder aux services**

| Service | URL | Identifiants |
|---------|-----|--------------|
| Frontend | http://localhost:5173 | - |
| Backend API | http://localhost:8180 | API Key (voir ci-dessous) |
| API Docs | http://localhost:8180/docs | - |
| Grafana | http://localhost:3001 | admin / admin |
| Prometheus | http://localhost:9090 | - |

**API Key de démo:** `ragdz_dev_demo_key_12345678901234567890`

## 📖 Utilisation

### Upload de document

```bash
curl -X POST http://localhost:8180/api/upload \
  -H "X-API-Key: ragdz_dev_demo_key_12345678901234567890" \
  -F "file=@document.txt"
```

### Recherche sémantique

```bash
curl -X POST http://localhost:8180/api/query \
  -H "X-API-Key: ragdz_dev_demo_key_12345678901234567890" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Comment fonctionne le système ?",
    "max_results": 5,
    "score_threshold": 0.3
  }'
```

### WebSocket (temps réel)

```javascript
const ws = new WebSocket(
  'ws://localhost:8180/ws?api_key=ragdz_dev_demo_key_12345678901234567890'
);

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  console.log('Progress:', update);
};
```

## 🔧 Configuration

### Variables d'environnement

Créer `.env` à la racine :

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=ragdz2024secure
POSTGRES_DB=archon

# Redis
REDIS_PASSWORD=

# Cloud LLM
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-api-key-here
LLM_MODEL=gpt-3.5-turbo

# Backend
API_SECRET_KEY=your-secret-key-here
ENABLE_RATE_LIMITING=true
RATE_LIMIT_PER_MINUTE=60

# Frontend
VITE_API_URL=http://localhost:8180
VITE_WS_URL=ws://localhost:8180/ws

# Monitoring
GRAFANA_USER=admin
GRAFANA_PASSWORD=admin
```

### Production Build

Pour le frontend en production :

```bash
# Utiliser le Dockerfile de production
docker build -f rag-ui/Dockerfile.prod -t rag-dz-frontend:prod ./rag-ui

# Ou modifier docker-compose.yml
services:
  frontend:
    build:
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
```

## 📊 Monitoring

### Prometheus Metrics

- **Backend:** http://localhost:8180/metrics
- **Qdrant:** http://localhost:6333/metrics
- **PostgreSQL:** http://localhost:9187/metrics
- **Redis:** http://localhost:9121/metrics

### Grafana Dashboards

1. Accéder à http://localhost:3001
2. Login: admin / admin
3. Dashboards disponibles:
   - RAG.dz Overview
   - Database Performance
   - Cache Statistics

## 🧪 Tests

```bash
# Backend tests
cd rag-compat
pip install -r requirements.txt
pytest tests/

# Frontend tests
cd rag-ui
npm install
npm test
```

## 🏢 Services

### Backend (Port 8180)
- **Framework:** FastAPI
- **Embeddings:** Sentence-Transformers
- **Cache:** Redis
- **Base vectorielle:** Qdrant

### Frontend (Port 5173)
- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **State:** TanStack Query
- **UI:** Tailwind CSS + Radix UI

### Databases
- **PostgreSQL (5432):** Metadata, tenants, usage
- **Redis (6379):** Cache embeddings & queries
- **Qdrant (6333):** Vecteurs embeddings

### AI/ML
- **OpenAI/Anthropic:** LLM cloud pour génération RAG
- **Sentence-Transformers:** Embeddings multilingues

### Monitoring
- **Prometheus (9090):** Collecte métriques
- **Grafana (3001):** Visualisation

## 📦 Structure du Projet

```
rag-dz/
├── rag-compat/              # Backend API
│   ├── app/
│   │   ├── clients/         # Clients (Qdrant, LLM, Embeddings)
│   │   ├── routers/         # Routes API
│   │   ├── security.py      # Auth & Rate limiting
│   │   ├── websocket.py     # WebSocket manager
│   │   └── main.py          # FastAPI app
│   └── Dockerfile
├── rag-ui/                  # Frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── features/        # Feature modules
│   │   └── services/        # API services
│   ├── Dockerfile           # Dev
│   └── Dockerfile.prod      # Production
├── sql/                     # Database schemas
│   ├── init.sql            # Tables & indexes
│   └── seed.sql            # Demo data
├── monitoring/              # Prometheus & Grafana
│   ├── prometheus.yml
│   └── alerts.yml
├── scripts/                 # Utilitaires
│   └── init-demo.sh        # Init script
└── docker-compose.yml       # Orchestration
```

## 🔐 Sécurité

### Production Checklist

- [ ] Changer `API_SECRET_KEY` dans `.env`
- [ ] Changer `POSTGRES_PASSWORD`
- [ ] Changer `GRAFANA_PASSWORD`
- [ ] Activer HTTPS (reverse proxy nginx)
- [ ] Configurer CORS (domaines autorisés)
- [ ] Activer rate limiting stricte
- [ ] Logs centralisés (ELK/Loki)
- [ ] Backups automatiques
- [ ] Monitoring alertes

### API Key Management

Les API keys sont hashées en SHA256 avant stockage. Pour créer une nouvelle clé:

```python
import hashlib
key = "ragdz_prod_your_random_key_here"
key_hash = hashlib.sha256(key.encode()).hexdigest()
print(key_hash)
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Pull Request

## 📝 Roadmap

- [ ] Meilisearch integration complète
- [ ] Support PDF/DOCX natif
- [ ] Multi-modal (images, audio)
- [ ] Fine-tuning embeddings
- [ ] Analytics dashboard
- [ ] Kubernetes deployment
- [ ] CI/CD pipeline
- [ ] Tests E2E

## 🐛 Problèmes Connus

### API Keys Cloud
Les LLM cloud (OpenAI/Anthropic) sont payants. Configurez des limites de coût sur votre compte provider.

### Windows
Les volumes montés peuvent causer des problèmes de performance. Ils sont commentés dans docker-compose.yml.

### Fallback Mode
Si aucune API key LLM n'est configurée, le système fonctionne en mode fallback avec extraction de contexte simple.

## 📄 License

MIT License - voir [LICENSE](LICENSE)

## 👥 Auteurs

- **Votre Nom** - *Initial work*

## 🙏 Remerciements

- Sentence-Transformers pour les embeddings
- Qdrant pour la base vectorielle
- Ollama pour l'intégration LLM
- FastAPI & React pour les frameworks

---

**⭐ Si ce projet vous aide, n'hésitez pas à lui donner une étoile !**
