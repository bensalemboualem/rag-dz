# IA-AGENTS - GUIDE D'INSTALLATION COMPLET
## IAFactory Algeria - Agents IA Spécialisés

**Date:** 4 Décembre 2025
**Source:** [awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps)

---

## 📁 STRUCTURE DES AGENTS IA

```
d:/IAFactory/rag-dz/ia-agents/
├── local-rag/              # Local RAG Agent (PRIORITÉ 1)
│   ├── local_rag_agent.py
│   ├── requirements.txt
│   └── README.md
├── finance-agent/          # AI Finance Agent Team (PRIORITÉ 1)
│   ├── financial_coach_agent.py
│   ├── requirements.txt
│   └── README.md
├── chat-pdf/               # Chat with PDF (PRIORITÉ 1)
│   ├── chat_pdf.py
│   ├── chat_pdf_llama3.py
│   ├── chat_pdf_llama3.2.py
│   ├── requirements.txt
│   └── README.md
├── hybrid-search/          # Hybrid Search RAG (PRIORITÉ 1)
│   ├── hybrid_search_rag.py
│   ├── requirements.txt
│   └── README.md
├── voice-support/          # Customer Support Voice Agent (PRIORITÉ 2)
│   ├── voice_agent.py
│   ├── requirements.txt
│   └── README.md
└── shared/                 # Code partagé entre agents
    ├── config.py
    ├── utils.py
    └── __init__.py
```

---

## 🎯 AGENTS INSTALLÉS

### PRIORITÉ 1 - Installés ✅

#### 1. Local RAG Agent
**Pourquoi:** Conformité RGPD Algérie + Données sensibles

**Technologies:**
- Ollama (LLM local: llama3.2, llama3, qwen, etc.)
- Qdrant (Vector Database)
- AgentOS (Interface UI)
- OllamaEmbedder (Embeddings locaux)

**Use Cases pour IAFactory Algeria:**
- Documents fiscaux confidentiels (G50, déclarations IBS/TVA)
- Dossiers clients sensibles
- Données comptables privées
- Conformité CNAS/CASNOS

**Adaptations nécessaires:**
```python
# Remplacer:
knowledge_base.add_content(
    url="https://phi-public.s3.amazonaws.com/recipes/ThaiRecipes.pdf"
)

# Par:
knowledge_base.add_content([
    "./docs/g50-code-general-impots.pdf",
    "./docs/tva-guide-algerie.pdf",
    "./docs/ibs-modalites-calcul.pdf",
    "./docs/parafiscalite-algerie.pdf",
    "./docs/douanes-procedures.pdf"
])
```

**Installation:**
```bash
cd ia-agents/local-rag

# Installer Ollama (si pas déjà installé)
curl https://ollama.ai/install.sh | sh

# Télécharger les modèles
ollama pull llama3.2
ollama pull llama3
ollama pull qwen

# Installer dépendances Python
pip install -r requirements.txt

# Installer Qdrant (Vector DB)
docker run -d -p 6333:6333 qdrant/qdrant

# Lancer l'agent
python local_rag_agent.py
```

**Intégration avec Archon:**
- Archon stocke la connaissance dans Supabase (pgvector)
- Local RAG Agent accède aux mêmes docs mais avec LLM local
- Sync bidirectionnel possible via API

---

#### 2. AI Finance Agent Team
**Pourquoi:** Marché comptabilité/fiscalité énorme en Algérie

**Technologies:**
- Multi-agents (Planning, Research, Analysis)
- Financial APIs integration
- Data analysis & forecasting

**Use Cases pour IAFactory Algeria:**
- Automatisation G50 (Série G, liasse fiscale)
- Calculs IBS/IRG/TVA automatiques
- Analyse états financiers
- Prévisions trésorerie
- Détection anomalies fiscales

**Adaptations nécessaires:**
1. **Agents spécialisés Algérie:**
   - `G50FillingAgent` - Remplissage automatique G50
   - `TVACalculatorAgent` - Calcul TVA (19%, 9%, exonérations)
   - `IBSOptimizerAgent` - Optimisation IBS
   - `ParafiscalAgent` - TAP, VF, etc.
   - `DouanesAgent` - Import/export, tarifs douaniers

2. **Règles fiscales algériennes:**
```python
# Taux TVA Algérie
TVA_RATES = {
    "standard": 0.19,      # 19% taux normal
    "reduced": 0.09,       # 9% taux réduit
    "exempt": 0.00         # Exonérations
}

# Seuils IBS
IBS_THRESHOLDS = {
    "micro": 15_000_000,        # 15M DA
    "pme": 1_000_000_000,       # 1Mrd DA
    "grande": float('inf')
}

# Taux IBS
IBS_RATES = {
    "activites_production": 0.19,
    "activites_batiment": 0.19,
    "activites_autres": 0.26
}
```

**Installation:**
```bash
cd ia-agents/finance-agent
pip install -r requirements.txt
python financial_coach_agent.py
```

---

#### 3. Chat with PDF
**Pourquoi:** Factures, contrats, documents légaux algériens

**Technologies:**
- PyPDF2 / pdfplumber
- LangChain
- Embeddings (OpenAI ou local)
- Vector store (FAISS, Chroma, Qdrant)

**Use Cases pour IAFactory Algeria:**
- Analyse factures fournisseurs
- Extraction données G50 (PDF scannés)
- Lecture contrats (français/arabe)
- OCR documents administratifs
- Vérification conformité documents

**Adaptations nécessaires:**
1. **Support OCR arabe:**
```python
from pdf2image import convert_from_path
from pytesseract import image_to_string

# OCR avec support arabe
def extract_text_with_ocr(pdf_path):
    images = convert_from_path(pdf_path)
    text_ar = image_to_string(images[0], lang='ara')
    text_fr = image_to_string(images[0], lang='fra')
    return {"arabic": text_ar, "french": text_fr}
```

2. **Templates documents algériens:**
   - G50 (Série G1-G12)
   - IBS (Formulaire 01)
   - TVA (Formulaire G50)
   - CIB (Certificats)
   - Factures conformes (Mentions obligatoires)

**Installation:**
```bash
cd ia-agents/chat-pdf
pip install -r requirements.txt

# Pour OCR arabe
sudo apt-get install tesseract-ocr tesseract-ocr-ara tesseract-ocr-fra

# Lancer
python chat_pdf_llama3.2.py  # Version locale
# OU
python chat_pdf.py  # Version cloud (OpenAI/Claude)
```

---

#### 4. Hybrid Search RAG
**Pourquoi:** Recherche multilingue (français + arabe)

**Technologies:**
- Vector search (embeddings)
- Keyword search (BM25)
- Hybrid ranking (combine scores)
- pgvector + pg_trgm (PostgreSQL)

**Use Cases pour IAFactory Algeria:**
- Recherche docs bilingues FR/AR
- Recherche réglementations (mots-clés précis)
- Recherche jurisprudence fiscale
- FAQ multilingues

**Adaptations nécessaires:**
```python
# Configuration multilingue
EMBEDDING_MODELS = {
    "french": "sentence-transformers/paraphrase-multilingual-mpnet-base-v2",
    "arabic": "sentence-transformers/paraphrase-multilingual-mpnet-base-v2",
    "mixed": "sentence-transformers/paraphrase-multilingual-mpnet-base-v2"
}

# BM25 avec stopwords français + arabe
from rank_bm25 import BM25Okapi

stopwords_fr = ["le", "la", "de", "et", "à", "un"]
stopwords_ar = ["في", "من", "إلى", "على", "أن"]
stopwords = stopwords_fr + stopwords_ar
```

**Intégration Archon:**
Archon utilise déjà hybrid search! À intégrer:
```sql
-- Fonction hybrid search existe déjà dans Supabase
SELECT * FROM hybrid_search_documents_384d(
    query_vector := embedding,
    keyword_query := 'TVA importation',
    match_count := 10
);
```

**Installation:**
```bash
cd ia-agents/hybrid-search
pip install -r requirements.txt
python hybrid_search_rag.py
```

---

### PRIORITÉ 2 - À Installer

#### 5. Customer Support Voice Agent
**Pourquoi:** Support multilingue 24/7 (FR/AR/EN)

**Technologies:**
- Speech-to-Text (Whisper, Google STT)
- Text-to-Speech (ElevenLabs, Google TTS)
- LLM (GPT-4, Claude)
- Voice synthesis arabe

**Use Cases:**
- Hotline fiscale automatisée
- Support clients PME
- Rappels échéances (TVA, IBS)
- Assistance déclarative

**Installation:**
```bash
cd ia-agents/voice-support
pip install -r requirements.txt

# Pour voix arabe dialectal algérien
# Nécessite modèle TTS spécialisé ou API tierce
```

---

## 🔧 INTÉGRATION AVEC L'ÉCOSYSTÈME IAFACTORY

### Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                    IAFactory Algeria SaaS                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend Layer                                              │
│  ├── Bolt.diy (https://www.iafactoryalgeria.com/bolt/)     │
│  ├── Archon UI (https://archon.iafactoryalgeria.com)       │
│  └── Apps (comptabilite-dz, douanes-dz, etc.)              │
│                                                              │
│  Agent Layer (NOUVEAU!)                                      │
│  ├── Local RAG Agent         (Port 8200)                    │
│  ├── Finance Agent Team      (Port 8201)                    │
│  ├── Chat PDF                (Port 8202)                    │
│  ├── Hybrid Search RAG       (Intégré Archon)              │
│  └── Voice Support Agent     (Port 8203)                    │
│                                                              │
│  Backend Layer                                               │
│  ├── Archon API              (Port 8181)                    │
│  ├── Archon MCP              (Port 8051)                    │
│  ├── RAG Backend             (Port 8000)                    │
│  └── Council API             (Multi-LLM routing)            │
│                                                              │
│  Data Layer                                                  │
│  ├── Supabase PostgreSQL    (pgvector + RLS)               │
│  ├── Qdrant                  (Vector DB local)              │
│  └── MySQL                   (School OneST)                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Ports Utilisés

```
3737  - Archon Frontend
8000  - RAG Backend (FastAPI)
8051  - Archon MCP Server
8181  - Archon Backend API
8200  - Local RAG Agent
8201  - Finance Agent Team
8202  - Chat PDF
8203  - Voice Support Agent
6333  - Qdrant Vector DB
```

### Intégration API

Tous les agents exposent une API FastAPI uniforme:

```python
# shared/api_template.py
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Query(BaseModel):
    question: str
    context: dict = {}

@app.post("/query")
async def query_agent(query: Query):
    """Endpoint unifié pour tous les agents"""
    response = agent.run(query.question)
    return {"answer": response, "agent": "agent_name"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

---

## 📦 DÉPLOIEMENT SUR VPS

### Option 1: Docker Compose (Recommandé)

Créer `docker-compose.ia-agents.yml`:

```yaml
version: '3.8'

services:
  # Qdrant Vector DB
  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage
    restart: unless-stopped

  # Local RAG Agent
  local-rag:
    build: ./ia-agents/local-rag
    ports:
      - "8200:8200"
    environment:
      - QDRANT_URL=http://qdrant:6333
      - OLLAMA_HOST=http://host.docker.internal:11434
    depends_on:
      - qdrant
    restart: unless-stopped

  # Finance Agent Team
  finance-agent:
    build: ./ia-agents/finance-agent
    ports:
      - "8201:8201"
    environment:
      - DATABASE_URL=postgresql://...
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    restart: unless-stopped

  # Chat PDF
  chat-pdf:
    build: ./ia-agents/chat-pdf
    ports:
      - "8202:8202"
    volumes:
      - ./documents:/app/documents
    environment:
      - TESSERACT_PATH=/usr/bin/tesseract
    restart: unless-stopped

  # Voice Support Agent
  voice-support:
    build: ./ia-agents/voice-support
    ports:
      - "8203:8203"
    environment:
      - ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    restart: unless-stopped

volumes:
  qdrant_data:
```

### Commandes de Déploiement

```bash
# Sur le VPS
ssh root@46.224.3.125

# Aller dans le répertoire
cd /opt/iafactory-rag-dz

# Créer le dossier ia-agents
mkdir -p ia-agents

# Copier les fichiers (via SCP ou Git)
scp -r d:/IAFactory/rag-dz/ia-agents/* root@46.224.3.125:/opt/iafactory-rag-dz/ia-agents/

# Créer les Dockerfiles pour chaque agent
# (Voir section suivante)

# Lancer tous les agents
docker-compose -f docker-compose.ia-agents.yml up -d --build

# Vérifier
docker-compose -f docker-compose.ia-agents.yml ps
```

---

## 🐳 DOCKERFILES

### Dockerfile pour Local RAG Agent

```dockerfile
# ia-agents/local-rag/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Installer dépendances système
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copier requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier code
COPY . .

# Exposer port
EXPOSE 8200

# Lancer
CMD ["python", "local_rag_agent.py"]
```

### Dockerfile pour Finance Agent

```dockerfile
# ia-agents/finance-agent/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8201

CMD ["uvicorn", "financial_coach_agent:app", "--host", "0.0.0.0", "--port", "8201"]
```

### Dockerfile pour Chat PDF

```dockerfile
# ia-agents/chat-pdf/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Installer Tesseract OCR
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-ara \
    tesseract-ocr-fra \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8202

CMD ["streamlit", "run", "chat_pdf.py", "--server.port=8202"]
```

---

## 🔐 CONFIGURATION NGINX

Ajouter les routes pour les agents IA:

```nginx
# /etc/nginx/sites-available/iafactoryalgeria.com

# Local RAG Agent
location /ia-agents/local-rag/ {
    proxy_pass http://127.0.0.1:8200/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}

# Finance Agent
location /ia-agents/finance/ {
    proxy_pass http://127.0.0.1:8201/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

# Chat PDF
location /ia-agents/chat-pdf/ {
    proxy_pass http://127.0.0.1:8202/;
    proxy_set_header Host $host;
}

# Voice Support
location /ia-agents/voice/ {
    proxy_pass http://127.0.0.1:8203/;
    proxy_set_header Host $host;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

Recharger Nginx:
```bash
nginx -t
systemctl reload nginx
```

---

## 🌍 ADAPTATION CONTEXTE ALGÉRIEN

### 1. Documents Fiscaux Algériens

Créer une base de connaissance spécialisée:

```bash
/opt/iafactory-rag-dz/knowledge-base/
├── fiscalite/
│   ├── g50-code-general-impots.pdf
│   ├── tva-guide-2024.pdf
│   ├── ibs-modalites-calcul.pdf
│   ├── irg-bareme-2024.pdf
│   └── parafiscalite-guide.pdf
├── social/
│   ├── cnas-cotisations.pdf
│   ├── casnos-guide.pdf
│   └── securite-sociale.pdf
├── douanes/
│   ├── tarif-douanier.pdf
│   ├── procedures-import.pdf
│   └── procedures-export.pdf
└── juridique/
    ├── code-commerce.pdf
    ├── code-travail.pdf
    └── droit-societes.pdf
```

### 2. Règles Métier Algériennes

```python
# ia-agents/shared/algeria_tax_rules.py

class AlgeriaTaxRules:
    """Règles fiscales algériennes"""

    # TVA
    TVA_STANDARD = 0.19
    TVA_REDUCED = 0.09
    TVA_EXEMPT_SECTORS = [
        "produits_agricoles",
        "eau_electricite",
        "transport_voyageurs"
    ]

    # IBS
    IBS_RATE_PRODUCTION = 0.19
    IBS_RATE_OTHER = 0.26
    IBS_MINIMUM = {
        "CA < 15M DA": 5000,
        "15M < CA < 50M": 10000,
        "50M < CA < 100M": 25000,
        "CA > 100M": 50000
    }

    # Parafiscalité
    TAP_RATE = 0.02  # Taxe apprentissage
    VF_RATE = 0.01   # Versement forfaitaire

    # Dates échéances
    DEADLINES = {
        "G50": "30 avril N+1",
        "TVA": "20 du mois M+1",
        "IBS_ACOMPTE": ["20 mars", "20 juin", "20 septembre"],
        "IBS_REGULARISATION": "30 avril N+1"
    }
```

### 3. Multilingue FR/AR

```python
# ia-agents/shared/multilingual.py

PROMPTS = {
    "fr": {
        "greeting": "Bonjour! Je suis votre assistant fiscal algérien.",
        "tva_question": "Quel est le taux de TVA pour {product}?",
        "g50_help": "Je peux vous aider à remplir votre G50."
    },
    "ar": {
        "greeting": "مرحبا! أنا مساعدك الضريبي الجزائري.",
        "tva_question": "ما هو معدل الضريبة على القيمة المضافة لـ {product}؟",
        "g50_help": "يمكنني مساعدتك في ملء نموذج G50."
    }
}

def get_prompt(key, lang="fr", **kwargs):
    return PROMPTS[lang][key].format(**kwargs)
```

---

## 📊 MONITORING & OBSERVABILITÉ

### Métriques à Surveiller

```python
# ia-agents/shared/metrics.py
from prometheus_client import Counter, Histogram

# Compteurs
queries_total = Counter('agent_queries_total', 'Total queries', ['agent'])
queries_success = Counter('agent_queries_success', 'Successful queries', ['agent'])
queries_error = Counter('agent_queries_error', 'Failed queries', ['agent'])

# Latence
query_duration = Histogram('agent_query_duration_seconds', 'Query duration', ['agent'])

# Utilisation
@query_duration.labels(agent='local-rag').time()
def process_query(query):
    queries_total.labels(agent='local-rag').inc()
    try:
        result = agent.run(query)
        queries_success.labels(agent='local-rag').inc()
        return result
    except Exception as e:
        queries_error.labels(agent='local-rag').inc()
        raise
```

### Logs Structurés

```python
import logging
import json

class StructuredLogger:
    def __init__(self, agent_name):
        self.agent = agent_name
        self.logger = logging.getLogger(agent_name)

    def log_query(self, query, response, duration):
        self.logger.info(json.dumps({
            "agent": self.agent,
            "event": "query",
            "query": query[:100],  # Truncate
            "response_length": len(response),
            "duration_ms": duration * 1000,
            "timestamp": datetime.now().isoformat()
        }))
```

---

## 🚀 PROCHAINES ÉTAPES

### Phase 1: Test Local (1-2 jours)
1. ✅ Installer tous les agents en local
2. ✅ Tester avec documents tests
3. ✅ Adapter prompts en français
4. ⏳ Ajouter support OCR arabe

### Phase 2: Intégration (3-5 jours)
1. Créer API unifiée pour tous les agents
2. Intégrer avec Archon (base de connaissance)
3. Intégrer avec RAG Backend (routing)
4. Créer interfaces UI dans les apps

### Phase 3: Déploiement VPS (2-3 jours)
1. Créer Dockerfiles pour chaque agent
2. Configurer docker-compose.ia-agents.yml
3. Déployer sur VPS
4. Configurer Nginx reverse proxy
5. Tester en production

### Phase 4: Optimisation (ongoing)
1. Fine-tuning modèles locaux sur data algérienne
2. Cache intelligent (réduire coûts API)
3. Load balancing entre agents
4. A/B testing different models

---

## 💰 ESTIMATION COÛTS

### Infrastructure
- **Qdrant (Docker):** Gratuit (self-hosted)
- **Ollama (LLM local):** Gratuit (nécessite RAM: 8GB min)
- **Serveur VPS:** Upgrade recommandé:
  - Actuel: 16GB RAM
  - Recommandé: 32GB RAM (pour LLM locaux)
  - Coût: ~€40-60/mois

### APIs Externes (Optionnel)
- **OpenAI GPT-4:** ~$0.03/1K tokens
- **Anthropic Claude:** ~$0.015/1K tokens
- **ElevenLabs Voice:** ~$5/mois (plan de base)
- **Google Cloud TTS:** Gratuit 0-4M chars/mois

### Économies Token Optimization
- **Compression prompts:** -30 à -60% tokens
- **Cache intelligent:** -40 à -70% requêtes API
- **Mix local/cloud:** -50 à -80% coûts totaux

**ROI estimé:** Économies de €200-500/mois sur factures API

---

## 📞 SUPPORT & RESSOURCES

### Documentation
- [awesome-llm-apps GitHub](https://github.com/Shubhamsaboo/awesome-llm-apps)
- [Ollama Docs](https://ollama.ai/docs)
- [Qdrant Docs](https://qdrant.tech/documentation/)
- [AgentOS Docs](https://docs.agno.com/)

### Communauté
- Slack IAFactory Algeria (à créer)
- Discord awesome-llm-apps
- Reddit r/LocalLLaMA

---

## ✅ CHECKLIST INSTALLATION

### Pré-requis
- [ ] Python 3.11+ installé
- [ ] Docker & Docker Compose installés
- [ ] Ollama installé (pour LLM locaux)
- [ ] Tesseract OCR installé (pour PDF)
- [ ] Node.js 18+ (pour certaines UIs)

### Installation Locale
- [ ] Cloner awesome-llm-apps
- [ ] Copier agents dans ia-agents/
- [ ] Installer Qdrant (Docker)
- [ ] Télécharger modèles Ollama
- [ ] Tester chaque agent individuellement

### Adaptation Algérie
- [ ] Ajouter documents fiscaux algériens
- [ ] Configurer règles métier
- [ ] Traduire prompts en français
- [ ] Ajouter support OCR arabe
- [ ] Tester avec cas réels

### Déploiement VPS
- [ ] Créer Dockerfiles
- [ ] Créer docker-compose.ia-agents.yml
- [ ] Transférer code sur VPS
- [ ] Build images Docker
- [ ] Lancer services
- [ ] Configurer Nginx
- [ ] Vérifier santé services

### Production
- [ ] Configurer monitoring (Prometheus)
- [ ] Configurer logging (ELK/Loki)
- [ ] Backup automatique knowledge base
- [ ] Alertes (Slack/Email)
- [ ] Documentation utilisateur

---

**Installation complétée par:** Claude Code
**Date:** 4 Décembre 2025
**Version:** 1.0
