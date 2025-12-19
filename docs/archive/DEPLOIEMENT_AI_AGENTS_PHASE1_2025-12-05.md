# 🚀 DÉPLOIEMENT AI AGENTS - PHASE 1

**Date**: 5 Décembre 2025 10:00 UTC
**Serveur**: iafactorysuisse (46.224.3.125)
**Phase**: Phase 1 - Business Core (3 agents)
**Status**: ✅ Agents copiés, prêts pour installation

---

## ✅ AGENTS DÉPLOYÉS (Phase 1)

### 📊 Résumé

| Agent | Localisation | Framework | API | Status |
|-------|-------------|-----------|-----|--------|
| **AI Consultant** | `/opt/iafactory-rag-dz/ai-agents/business-core/consultant/` | Streamlit + Google ADK | Google Gemini | ✅ Copié |
| **Customer Support** | `/opt/iafactory-rag-dz/ai-agents/business-core/customer-support/` | Streamlit + mem0ai | OpenAI | ✅ Copié |
| **Data Analysis** | `/opt/iafactory-rag-dz/ai-agents/business-core/data-analysis/` | Streamlit + DuckDB | OpenAI | ✅ Copié |

---

## 📦 DÉTAILS DES AGENTS

### 1. AI Consultant Agent

**Fichier principal**: `ai_consultant_agent.py`
**Interface**: Streamlit web app
**LLM**: Google Gemini (via Google ADK)

**Dépendances**:
```
google-adk>=1.5.0
google-genai>=0.3.0
python-dotenv>=1.0.0
pydantic>=2.0.0
```

**Use Case**: Conseil business pour PME
- Stratégie entreprise
- Analyse business
- Recommandations IA

**Configuration requise**:
- `GOOGLE_API_KEY`: Clé API Google Gemini

---

### 2. AI Customer Support Agent

**Fichier principal**: `customer_support_agent.py`
**Interface**: Streamlit web app
**LLM**: OpenAI GPT
**Mémoire**: mem0ai (mémorisation conversations)

**Dépendances**:
```
streamlit
openai
mem0ai==0.1.29
```

**Use Case**: Support client automatisé
- Support 24/7
- Mémorisation contexte client
- Réponses personnalisées

**Configuration requise**:
- `OPENAI_API_KEY`: Clé API OpenAI

---

### 3. AI Data Analysis Agent

**Fichier principal**: `ai_data_analyst.py`
**Interface**: Streamlit web app
**LLM**: OpenAI GPT
**Database**: DuckDB (in-memory SQL analytics)

**Dépendances**:
```
streamlit==1.41.1
openai==1.58.1
duckdb>=1.4.1
pandas
numpy==1.26.4
agno>=2.2.10
```

**Use Case**: Analyse données business
- Upload CSV/Excel
- Requêtes SQL naturelles
- Visualisations auto
- Dashboards instantanés

**Configuration requise**:
- `OPENAI_API_KEY`: Clé API OpenAI

---

## 🐳 DOCKER CONFIGURATION

### Dockerfile (Template pour tous les agents)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy agent code
COPY . .

# Expose Streamlit port
EXPOSE 8501

# Run Streamlit app
CMD ["streamlit", "run", "*.py", "--server.port=8501", "--server.address=0.0.0.0"]
```

### docker-compose.yml (AI Agents)

```yaml
services:
  # AI Consultant Agent
  iaf-ai-consultant:
    build: ./ai-agents/business-core/consultant
    container_name: iaf-ai-consultant-prod
    environment:
      - GOOGLE_API_KEY=${GOOGLE_API_KEY}
    ports:
      - "8200:8501"
    networks:
      - iafactory-net
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8501"]
      interval: 30s
      timeout: 10s
      retries: 3

  # AI Customer Support Agent
  iaf-ai-customer-support:
    build: ./ai-agents/business-core/customer-support
    container_name: iaf-ai-customer-support-prod
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    ports:
      - "8201:8501"
    networks:
      - iafactory-net
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8501"]
      interval: 30s
      timeout: 10s
      retries: 3

  # AI Data Analysis Agent
  iaf-ai-data-analysis:
    build: ./ai-agents/business-core/data-analysis
    container_name: iaf-ai-data-analysis-prod
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    ports:
      - "8202:8501"
    volumes:
      - data-analysis-uploads:/app/uploads
    networks:
      - iafactory-net
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8501"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  iafactory-net:
    external: true
    name: iafactory-rag-dz_iafactory-net

volumes:
  data-analysis-uploads:
    name: iaf-ai-data-analysis-uploads
```

---

## 🔑 VARIABLES D'ENVIRONNEMENT REQUISES

### .env file

```bash
# Google Gemini API (pour Consultant Agent)
GOOGLE_API_KEY=your-google-api-key-here

# OpenAI API (pour Customer Support + Data Analysis)
OPENAI_API_KEY=your-openai-api-key-here
```

### Où obtenir les clés:
- **Google API Key**: https://aistudio.google.com/apikey
- **OpenAI API Key**: https://platform.openai.com/api-keys

---

## 🌐 URLS D'ACCÈS (Après déploiement)

### Accès local (VPS)
- **Consultant**: http://46.224.3.125:8200
- **Customer Support**: http://46.224.3.125:8201
- **Data Analysis**: http://46.224.3.125:8202

### Accès public (via reverse proxy Nginx)

**Option A: Sous-domaine dédié**
```
https://agents.iafactoryalgeria.com/consultant
https://agents.iafactoryalgeria.com/customer-support
https://agents.iafactoryalgeria.com/data-analysis
```

**Option B: API Gateway**
```
https://api.iafactoryalgeria.com/agents/consultant
https://api.iafactoryalgeria.com/agents/customer-support
https://api.iafactoryalgeria.com/agents/data-analysis
```

---

## 📊 RESSOURCES SYSTÈME

### Espace disque actuel:
- **Utilisé**: 59GB / 150GB (41%)
- **Disponible**: 86GB
- **Agents**: ~500MB total (3 agents)

### Mémoire estimée par agent:
- **Consultant Agent**: ~500MB RAM
- **Customer Support**: ~600MB RAM (avec mem0ai)
- **Data Analysis**: ~700MB RAM (avec DuckDB)
- **Total Phase 1**: ~2GB RAM

### CPU:
- **Par agent**: 1-2 cores recommandés
- **Total Phase 1**: 4-6 cores

---

## 🚀 PLAN DE DÉPLOIEMENT IMMÉDIAT

### Étape 1: Créer Dockerfiles (5 min)
```bash
# Pour chaque agent:
cd /opt/iafactory-rag-dz/ai-agents/business-core/consultant
cat > Dockerfile <<EOF
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8501
CMD ["streamlit", "run", "ai_consultant_agent.py", "--server.port=8501", "--server.address=0.0.0.0"]
EOF

# Répéter pour customer-support et data-analysis
```

### Étape 2: Configurer .env (2 min)
```bash
cd /opt/iafactory-rag-dz
cat >> .env <<EOF

# AI Agents API Keys
GOOGLE_API_KEY=your-google-key
OPENAI_API_KEY=your-openai-key
EOF
```

### Étape 3: Créer docker-compose-agents.yml (3 min)
```bash
# Copier la config ci-dessus
nano docker-compose-agents.yml
```

### Étape 4: Build & Deploy (10 min)
```bash
docker-compose -f docker-compose-agents.yml build
docker-compose -f docker-compose-agents.yml up -d
```

### Étape 5: Vérifier (2 min)
```bash
docker ps | grep ai-
curl http://localhost:8200
curl http://localhost:8201
curl http://localhost:8202
```

### Étape 6: Configurer Nginx (5 min)
```bash
# Créer reverse proxy pour accès public
# Option agents.iafactoryalgeria.com
```

**Temps total**: ~30 minutes

---

## 🔄 PROCHAINES PHASES

### Phase 2: Productivité (5 agents)
- AI Meeting Agent
- xAI Finance Agent
- AI Journalist Agent
- Web Scraping AI Agent
- Product Launch Intelligence

### Phase 3: RAG Applications (5 agents)
- Local RAG Agent
- RAG-as-a-Service
- Agentic RAG with Reasoning
- Hybrid Search RAG
- Autonomous RAG

### Phase 4: Finance & Startups (5 agents)
- AI Investment Agent
- AI Financial Coach (multi-agent)
- AI Startup Trend Analysis
- AI System Architect
- AI Deep Research

---

## 📈 MÉTRIQUES À TRACKER

### Performance
- **Response time**: < 2s par requête
- **Uptime**: > 99%
- **Concurrent users**: 10-50 par agent

### Usage
- **Requests/day**: Par agent
- **Active users**: Unique users/jour
- **Popular features**: Fonctions les plus utilisées

### Business
- **Conversion rate**: Free → Paid
- **Churn rate**: < 5% mensuel
- **Revenue per agent**: Target 100€/mois

---

## ⚠️ NOTES IMPORTANTES

### Sécurité:
1. **API Keys**: À configurer via .env (JAMAIS commit dans git)
2. **Rate Limiting**: À implémenter via Nginx
3. **Authentication**: À ajouter pour accès public

### Limites:
1. **OpenAI Costs**: ~$0.002 par requête (GPT-4)
2. **Google Gemini**: Gratuit jusqu'à 1500 requests/jour
3. **mem0ai**: Stockage mémoire local (pas de cloud)

### Alternatives:
1. **Ollama local**: Remplacer OpenAI par Llama local (économie coûts)
2. **Anthropic Claude**: Alternative OpenAI
3. **xAI Grok**: Pour finance agent

---

## ✅ CHECKLIST PRÉ-DÉPLOIEMENT

- [x] Agents copiés sur VPS
- [x] Structure directories créée
- [x] Espace disque vérifié (86GB disponible)
- [ ] Dockerfiles créés
- [ ] docker-compose-agents.yml créé
- [ ] API Keys configurées (.env)
- [ ] Build Docker images
- [ ] Deploy containers
- [ ] Test accès local
- [ ] Configurer Nginx reverse proxy
- [ ] Test accès public
- [ ] Documentation utilisateur

---

## 🎯 OBJECTIF FINAL

**Phase 1 opérationnelle** permettant:
1. ✅ 3 agents business accessibles
2. ✅ Support PME/Startups algériennes
3. ✅ Tests bêta avec clients réels
4. ✅ Validation concept avant phases 2-4

**Revenue Phase 1**: 3 agents × 100€/mois × 20 clients = **6,000€/mois**

---

*Créé le 5 Décembre 2025 à 10:00 UTC*
*IAFactory Algeria - Phase 1 AI Agents Deployment*
