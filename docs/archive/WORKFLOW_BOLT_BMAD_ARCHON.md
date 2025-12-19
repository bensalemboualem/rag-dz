# Workflow Bolt → BMAD → Archon → Bolt

## 🎯 Vue d'ensemble

Ce document décrit le workflow complet permettant d'utiliser **Bolt.DIY** pour initier des projets qui sont ensuite analysés par les **agents BMAD**, stockés dans **Archon** comme base de connaissance, puis retournés à **Bolt** avec des instructions de génération.

## 🏗️ Architecture

```
┌─────────────┐
│  Bolt.DIY   │ ← Interface utilisateur pour décrire le projet
│  :5174      │
└──────┬──────┘
       │ 1. POST /api/orchestrator/bolt-workflow
       │    {task, description}
       ▼
┌─────────────┐
│  RAG.dz UI  │ ← Interface simple Upload + Chatbot
│  :5173      │
└──────┬──────┘
       │ 2. Envoyer à BMAD Orchestrator
       ▼
┌─────────────┐
│   Backend   │ ← API FastAPI
│  :8180      │
└──────┬──────┘
       │ 3. Orchestration complète
       ▼
┌─────────────┐
│ BMAD Agents │ ← Analyse multi-agents
│             │   • Architect
│             │   • Backend Dev
│             │   • Frontend Dev
│             │   • DevOps
└──────┬──────┘
       │ 4. Synthèse knowledge
       ▼
┌─────────────┐
│   Archon    │ ← Knowledge Base + Projects
│  :3737      │
└──────┬──────┘
       │ 5. Retour instructions
       ▼
┌─────────────┐
│  Bolt.DIY   │ ← Génération du code final
│  :5174      │
└─────────────┘
```

## 📋 Workflow Détaillé

### Étape 1: Initiation depuis RAG.dz UI (http://localhost:5173)

L'utilisateur peut:
- **Uploader des documents** (PDF, TXT, DOCX, MD) qui alimentent la knowledge base
- **Poser des questions** via le chatbot RAG
- **Envoyer à BMAD** pour orchestration complète

```typescript
// Frontend RAG-UI
const handleSendToBMAD = async () => {
  const res = await fetch(`${API_URL}/api/orchestrator/bolt-workflow`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'ragdz_dev_demo_key_12345678901234567890'
    },
    body: JSON.stringify({
      task: 'create_project',
      description: userMessages.join('\\n'),
      target: 'bolt'
    })
  });
};
```

### Étape 2: Endpoint d'Orchestration

```python
# Backend: app/routers/orchestrator.py

@router.post("/bolt-workflow")
async def create_bolt_workflow(
    task: str,
    description: str,
    target: str = "bolt"
):
    """
    Workflow Bolt.DIY → BMAD → Archon → Bolt
    """
    workflow_id = str(uuid.uuid4())

    # 1. Construire messages pour agents
    messages = [
        {"role": "user", "content": f"Task: {task}"},
        {"role": "user", "content": f"Description: {description}"}
    ]

    # 2. Orchestration complète
    orchestration_request = CompleteOrchestrationRequest(
        messages=[Message(**msg) for msg in messages],
        agents_used=["architect", "backend", "frontend", "devops"],
        auto_produce=True
    )

    result = await complete_orchestration(orchestration_request)

    return {
        "workflow_id": workflow_id,
        "project_id": result["project"]["project_id"],
        "archon_url": result["project"]["archon_url"],
        "bolt_url": result["bolt_production_url"],
        "instructions": result["production_command"]["instructions"]
    }
```

### Étape 3: Analyse par Agents BMAD

Les agents BMAD analysent le projet en parallèle:

1. **Architect Agent** (#1)
   - Définit l'architecture globale
   - Choix technologiques
   - Patterns et best practices

2. **Backend Agent** (#2)
   - API design
   - Database schema
   - Authentication/Authorization

3. **Frontend Agent** (#3)
   - UI/UX specifications
   - Component architecture
   - State management

4. **DevOps Agent** (#4)
   - Deployment strategy
   - CI/CD pipeline
   - Infrastructure as Code

### Étape 4: Création Projet Archon

```python
# L'orchestrateur synthétise la connaissance et crée le projet

knowledge_doc = orchestrator_service.synthesize_knowledge(
    messages=messages_dict,
    agents_used=agents_used
)

# Création dans Archon
project_result = await create_project_from_conversation(create_request)

# Résultat:
# - project_id: Identifiant unique
# - knowledge_base_id: ID dans Qdrant
# - archon_url: http://localhost:3737/projects/{id}
```

### Étape 5: Ordre de Production à Bolt

```python
production_command = orchestrator_service.order_bolt_production(
    project_id=project_result["project_id"],
    project_name=project_result["analysis"]["project_name"],
    tech_stack=tech_stack,
    knowledge_base_id=project_result["knowledge_source_id"]
)

# Retourne:
{
    "instructions": "Générer une app React avec...",
    "bolt_url": "http://localhost:5174?prompt=...",
    "tech_stack": ["React", "FastAPI", "PostgreSQL"],
    "knowledge_base_ref": "archon://projects/{id}"
}
```

## 🚀 Utilisation

### 1. Démarrer les services

```bash
# Démarrer tous les containers
docker-compose up -d

# Vérifier le statut
docker ps
```

### 2. Accéder aux interfaces

| Service | URL | Description |
|---------|-----|-------------|
| RAG.dz UI | http://localhost:5173 | Upload + Chat + BMAD |
| Archon | http://localhost:3737 | Knowledge Base + Projects |
| Bolt.DIY | http://localhost:5174 | AI Code Generator |
| Backend API | http://localhost:8180 | FastAPI Backend |
| API Docs | http://localhost:8180/docs | Swagger UI |

### 3. Workflow complet (exemple)

#### A. Via RAG.dz UI (http://localhost:5173)

1. Uploader un document de spécifications
2. Poser des questions au chatbot pour affiner
3. Cliquer sur "🚀 Envoyer à BMAD Orchestrator"
4. Attendre l'orchestration (analyse + création projet)
5. Récupérer le lien Archon et Bolt

#### B. Via API directe

```bash
# Créer un workflow Bolt → BMAD → Archon
curl -X POST http://localhost:8180/api/orchestrator/bolt-workflow \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ragdz_dev_demo_key_12345678901234567890" \\
  -d '{
    "task": "create_project",
    "description": "Créer une application e-commerce avec React, FastAPI et PostgreSQL. Features: auth, products, cart, checkout, admin panel.",
    "target": "bolt"
  }'

# Réponse:
{
  "workflow_id": "uuid-xxx",
  "project_id": 123,
  "archon_url": "http://localhost:3737/projects/123",
  "bolt_url": "http://localhost:5174?prompt=...",
  "instructions": "Generated instructions for Bolt",
  "message": "✅ Workflow Bolt → BMAD → Archon completed"
}
```

#### C. Consulter le projet dans Archon

```bash
# Ouvrir Archon
open http://localhost:3737

# Voir le projet créé
# - Knowledge base synthétisée
# - Contributions de chaque agent
# - Tech stack recommandé
# - Architecture diagrams
```

#### D. Générer le code dans Bolt

```bash
# Ouvrir Bolt avec les instructions
open http://localhost:5174

# Bolt utilise les instructions de l'orchestrateur
# pour générer le code complet du projet
```

## 🔑 API Endpoints

### Backend (port 8180)

#### Health Check
```http
GET /health
```

#### Orchestrator Health
```http
GET /api/orchestrator/health
Headers: X-API-Key: ragdz_dev_demo_key_12345678901234567890
```

#### Bolt Workflow
```http
POST /api/orchestrator/bolt-workflow
Headers:
  Content-Type: application/json
  X-API-Key: ragdz_dev_demo_key_12345678901234567890
Body:
{
  "task": "create_project",
  "description": "Description du projet...",
  "target": "bolt"
}
```

#### Complete Orchestration
```http
POST /api/orchestrator/complete-orchestration
Headers:
  Content-Type: application/json
  X-API-Key: ragdz_dev_demo_key_12345678901234567890
Body:
{
  "messages": [
    {"role": "user", "content": "..."},
    {"role": "assistant", "content": "...", "agent": "architect"}
  ],
  "agents_used": ["architect", "backend", "frontend", "devops"],
  "auto_produce": true
}
```

#### Project Status
```http
GET /api/orchestrator/status/{project_id}
Headers: X-API-Key: ragdz_dev_demo_key_12345678901234567890
```

#### Upload Document
```http
POST /api/upload
Headers: X-API-Key: ragdz_dev_demo_key_12345678901234567890
Body: multipart/form-data
  file: document.pdf
```

#### Query RAG
```http
POST /api/query
Headers:
  Content-Type: application/json
  X-API-Key: ragdz_dev_demo_key_12345678901234567890
Body:
{
  "query": "Question sur les documents...",
  "max_results": 5,
  "use_llm": true
}
```

## 📊 Données Stockées

### PostgreSQL
- Users
- Projects
- Orchestrator state
- BMAD workflows
- API keys

### Qdrant (Vector DB)
- Document embeddings
- Project knowledge embeddings
- Semantic search

### Redis (Cache)
- Embeddings cache
- Query cache
- Rate limiting

## 🔐 Sécurité

### API Key
Toutes les requêtes nécessitent une API key:

```bash
X-API-Key: ragdz_dev_demo_key_12345678901234567890
```

### Rate Limiting
- 60 requêtes/minute
- 1000 requêtes/heure
- Burst protection

## 🎨 Interfaces

### RAG.dz UI (5173)
- **Simple et fonctionnelle**
- Upload de documents
- Chatbot RAG
- Bouton "Envoyer à BMAD"
- Liens vers Archon et Bolt

### Archon (3737)
- **Knowledge Base complète**
- Projets orchestrés
- Contributions des agents
- Analytics et métriques

### Bolt.DIY (5174)
- **Génération de code AI**
- Reçoit instructions de BMAD
- Génère code complet
- Live preview

## 🐛 Troubleshooting

### Backend ne démarre pas
```bash
# Vérifier les logs
docker logs ragdz-backend --tail 50

# Redémarrer
docker restart ragdz-backend
```

### RAG-UI ne se charge pas
```bash
# Vérifier les logs
docker logs ragdz-rag-ui --tail 20

# Rebuild
docker-compose up -d --build rag-ui
```

### Bases de données non accessibles
```bash
# Démarrer PostgreSQL, Redis, Qdrant
docker start ragdz-postgres ragdz-redis ragdz-qdrant

# Attendre qu'ils soient healthy
docker ps
```

## 📝 TODO

- [ ] Implémenter WebSocket pour updates en temps réel
- [ ] Ajouter preview des instructions Bolt dans RAG-UI
- [ ] Créer interface d'admin pour gérer workflows
- [ ] Ajouter analytics dashboard
- [ ] Améliorer gestion d'erreurs
- [ ] Tests end-to-end automatisés
- [ ] Documentation API complète
- [ ] Exemples de projets type

## 🤝 Contribution

Le workflow est modulaire et extensible:

1. **Ajouter un agent BMAD**: Modifier `agents_used` dans l'orchestration
2. **Modifier l'analyse**: Éditer `orchestrator_service.py`
3. **Customiser Bolt**: Modifier `order_bolt_production()`
4. **Étendre RAG-UI**: Éditer `frontend/rag-ui/src/App.tsx`

---

**Version**: 1.0.0
**Date**: 2025-01-19
**Auteur**: RAG.dz Team
