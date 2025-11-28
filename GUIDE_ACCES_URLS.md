# 🌐 Guide d'Accès - IAFactory RAG-DZ

**Date**: 2025-11-24
**Version**: 1.0.0

---

## ⚠️ IMPORTANT : Hostnames Docker vs URLs Navigateur

### 🔴 NE FONCTIONNE PAS dans le navigateur :
```
❌ http://iafactory-backend:8180
❌ http://iafactory-hub:3737
❌ http://iafactory-postgres:5432
```

**Raison** : Ce sont des hostnames **internes Docker**, uniquement accessibles entre containers.

### ✅ URLs CORRECTES depuis votre PC Windows :
```
✅ http://localhost:8180   (Backend API)
✅ http://localhost:8182   (Hub UI)
✅ http://localhost:8183   (Docs UI)
✅ http://localhost:8184   (Bolt Studio)
✅ http://localhost:8185   (n8n Workflows)
```

---

## 🎯 URLs d'Accès Principal

| Service | URL Navigateur | Description |
|---------|----------------|-------------|
| **Backend API** | http://localhost:8180 | API principale IAFactory |
| **API Docs** | http://localhost:8180/docs | Documentation Swagger interactive |
| **Hub UI (Archon)** | http://localhost:8182 | Interface principale + Settings |
| **Docs UI** | http://localhost:8183 | Upload & Chat RAG |
| **Bolt Studio** | http://localhost:8184 | Éditeur de code IA |
| **n8n Workflows** | http://localhost:8185 | Automation (admin/admin) |

---

## 🤖 BMAD Agents - Endpoints API

### Liste des Agents
```bash
GET http://localhost:8180/api/bmad/agents
```

**Exemple Réponse** :
```json
{
  "agents": [
    {"id": "bmm-dev", "name": "Amelia", "description": "Developer Agent"},
    {"id": "bmm-architect", "name": "Winston", "description": "Architect"},
    ...
  ],
  "total": 20
}
```

### Chat avec un Agent

**Endpoint** :
```
POST http://localhost:8180/api/bmad/chat
```

**Format de Requête** :
```json
{
  "agent_id": "bmm-dev",
  "messages": [
    {
      "role": "user",
      "content": "Bonjour, peux-tu te présenter?"
    }
  ],
  "temperature": 0.7
}
```

**Exemple Réponse** :
```json
{
  "message": "Bonjour, je suis un agent BMAD, membre de l'équipe spécialisée dans le développement de produits...",
  "agent_id": "bmm-dev",
  "timestamp": "2025-11-24T20:08:19.136587"
}
```

---

## 🧪 Tests avec cURL (Windows PowerShell/CMD)

### Test 1 : Santé du Backend
```bash
curl http://localhost:8180/health
```

**Réponse attendue** :
```json
{
  "status": "healthy",
  "timestamp": 1764014189.504654,
  "service": "IAFactory"
}
```

### Test 2 : Liste des Agents BMAD
```bash
curl http://localhost:8180/api/bmad/agents
```

### Test 3 : Chat avec un Agent (fichier JSON)

**1. Créer un fichier `test-bmad.json`** :
```json
{
  "agent_id": "bmm-dev",
  "messages": [
    {
      "role": "user",
      "content": "Explique-moi comment créer une API REST en Python"
    }
  ],
  "temperature": 0.7
}
```

**2. Envoyer la requête** :
```bash
curl -X POST http://localhost:8180/api/bmad/chat ^
  -H "Content-Type: application/json" ^
  -d @test-bmad.json
```

---

## 🔑 AI Provider Keys (Interface Web)

### Accès à la Gestion des Clés
1. Ouvrir http://localhost:8182
2. Aller dans **Settings** (menu latéral)
3. Section **"AI Provider Keys"** (première carte à droite)

### Providers Disponibles
- ✅ **Groq** (Primary - Free)
- ✅ **OpenAI** (GPT-4)
- ✅ **Anthropic** (Claude)
- ✅ **DeepSeek**
- ✅ **Google Gemini**
- ✅ **Mistral**
- ✅ **Cohere**
- ✅ **Together AI**
- ✅ **OpenRouter**

### Modifier une Clé
1. Entrer la nouvelle clé dans le champ (les clés existantes sont masquées)
2. Cliquer sur l'icône 👁️ pour voir/masquer
3. Cliquer **"Save Changes"**
4. Les clés sont automatiquement masquées après sauvegarde

---

## 🔌 Endpoints API Complets

### Backend API (Port 8180)

#### Authentication
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `POST /api/auth/refresh` - Rafraîchir le token

#### AI Provider Credentials
- `GET /api/credentials/` - Liste tous les providers (clés masquées)
- `GET /api/credentials/{provider}` - Récupère un provider
- `POST /api/credentials/` - Crée/met à jour un provider
- `PUT /api/credentials/{provider}` - Met à jour un provider
- `DELETE /api/credentials/{provider}` - Supprime (vide) une clé

#### BMAD Agents
- `GET /api/bmad/agents` - Liste des 20 agents
- `POST /api/bmad/chat` - Chat avec un agent
- `POST /api/bmad/orchestration` - Orchestration multi-agents
- `GET /api/bmad/workflows` - Liste des workflows

#### RAG & Documents
- `POST /api/upload` - Upload de documents
- `POST /api/query` - Requête RAG
- `GET /api/knowledge` - Liste des documents
- `DELETE /api/knowledge/{id}` - Supprimer un document

#### Bolt Integration
- `POST /api/bolt/direct` - Génération directe de code
- `POST /api/bolt/bmad-workflow` - Génération orchestrée
- `GET /api/bolt/status/{id}` - Status d'un workflow
- `POST /api/bolt/export-zip` - Export projet ZIP

#### Calendar (Cal.com)
- `GET /api/calendar/events` - Liste des événements
- `POST /api/calendar/book` - Réserver un RDV

#### Voice Agent (Vapi.ai)
- `POST /api/voice/call` - Démarrer un appel vocal
- `GET /api/voice/status/{id}` - Status d'un appel

#### Google Integration
- `GET /api/google/auth` - OAuth2 Google
- `GET /api/google/calendar` - Google Calendar
- `GET /api/google/gmail` - Gmail API

#### Twilio (SMS/WhatsApp)
- `POST /api/twilio/sms` - Envoyer un SMS
- `POST /api/whatsapp/send` - Envoyer un WhatsApp

#### Orchestrator
- `POST /api/orchestrator/coordinate` - Coordination d'agents
- `GET /api/orchestrator/status/{id}` - Status orchestration

#### Creative Studio
- `POST /api/studio_video/generate` - Générer une vidéo
- `GET /api/studio_video/status/{id}` - Status génération

---

## 🛠️ Exemples d'Utilisation Avancés

### Exemple 1 : Conversation Multi-tours avec BMAD

**Fichier `conversation.json`** :
```json
{
  "agent_id": "bmm-architect",
  "messages": [
    {
      "role": "user",
      "content": "Je veux créer une application e-commerce"
    },
    {
      "role": "assistant",
      "content": "Super! Pour concevoir une architecture solide, j'ai besoin de quelques informations..."
    },
    {
      "role": "user",
      "content": "Avec React, Node.js et PostgreSQL"
    }
  ],
  "temperature": 0.7
}
```

```bash
curl -X POST http://localhost:8180/api/bmad/chat ^
  -H "Content-Type: application/json" ^
  -d @conversation.json
```

### Exemple 2 : Test RAG Query

**Fichier `rag-query.json`** :
```json
{
  "query": "Comment configurer PostgreSQL dans Docker?",
  "top_k": 5,
  "use_reranking": true
}
```

```bash
curl -X POST http://localhost:8180/api/query ^
  -H "Content-Type: application/json" ^
  -d @rag-query.json
```

### Exemple 3 : Orchestration BMAD (Workflow Complet)

**Fichier `workflow.json`** :
```json
{
  "project_name": "E-Commerce Platform",
  "description": "Plateforme e-commerce avec paiement Stripe",
  "tech_stack": ["React", "Node.js", "PostgreSQL", "Stripe"],
  "agents": ["bmm-architect", "bmm-dev", "bmm-ux-designer", "bmm-tea"],
  "save_to_archon": true
}
```

```bash
curl -X POST http://localhost:8180/api/bmad/orchestration ^
  -H "Content-Type: application/json" ^
  -d @workflow.json
```

---

## 🌐 Accès depuis d'autres Machines (Réseau Local)

### Configuration Requise
1. Ouvrir les ports dans le pare-feu Windows :
   - 8180 (Backend)
   - 8182 (Hub UI)
   - 8183 (Docs UI)
   - 8184 (Bolt Studio)
   - 8185 (n8n)

2. Trouver votre IP locale :
```bash
ipconfig
```
Chercher `Adresse IPv4` (ex: 192.168.1.100)

3. Accéder depuis autre PC :
```
http://192.168.1.100:8182   (remplacer par votre IP)
```

---

## 🐳 Hostnames Docker Internes (Pour Référence)

Ces hostnames **NE FONCTIONNENT QUE** dans les containers Docker :

| Hostname Docker | Port Interne | Service |
|-----------------|--------------|---------|
| `iafactory-backend` | 8180 | Backend API |
| `iafactory-hub` | 3737 | Hub UI |
| `iafactory-docs` | 5173 | Docs UI |
| `iafactory-studio` | 5173 | Bolt Studio |
| `iafactory-postgres` | 5432 | PostgreSQL |
| `iafactory-redis` | 6379 | Redis |
| `iafactory-qdrant` | 6333 | Qdrant |
| `iafactory-n8n` | 5678 | n8n |

**Utilisation** : Dans les fichiers de config Docker (docker-compose.yml, .env, etc.)

---

## 📱 Accès Mobile (Optionnel)

Si vous voulez accéder depuis votre téléphone sur le même WiFi :

1. Trouver l'IP de votre PC (voir section précédente)
2. Sur mobile, ouvrir navigateur :
```
http://192.168.1.100:8182
```

**Note** : Nécessite pare-feu configuré.

---

## 🔒 Authentification

### n8n (Port 8185)
- **Username** : `admin` (par défaut)
- **Password** : `admin` (par défaut)
- **Changement** : Modifier `.env.local` → `N8N_BASIC_AUTH_USER` et `N8N_BASIC_AUTH_PASSWORD`

### Backend API
- Certains endpoints nécessitent un JWT token
- Obtenir via `/api/auth/login`
- Passer dans header : `Authorization: Bearer <token>`

---

## 🧪 Tests Rapides (Checklist)

Cocher chaque test après exécution :

- [ ] ✅ Backend Health : `curl http://localhost:8180/health`
- [ ] ✅ API Docs accessible : http://localhost:8180/docs
- [ ] ✅ Hub UI chargé : http://localhost:8182
- [ ] ✅ Docs UI chargé : http://localhost:8183
- [ ] ✅ Bolt Studio chargé : http://localhost:8184
- [ ] ✅ n8n accessible : http://localhost:8185 (admin/admin)
- [ ] ✅ Liste agents BMAD : `curl http://localhost:8180/api/bmad/agents`
- [ ] ✅ Chat BMAD fonctionne : Test avec `test-bmad.json`
- [ ] ✅ Provider Keys visibles : Settings → AI Provider Keys
- [ ] ✅ PostgreSQL connecté : Backend logs sans erreur

---

## 🆘 Dépannage

### Problème : "Site inaccessible" ou DNS_PROBE_FINISHED_NXDOMAIN

**Cause** : Vous utilisez un hostname Docker au lieu de localhost

**Solution** :
```
❌ http://iafactory-backend:8180
✅ http://localhost:8180
```

### Problème : "Connection refused" sur localhost

**Solution** :
1. Vérifier que les containers sont actifs :
```bash
docker ps
```

2. Redémarrer le container concerné :
```bash
docker restart iaf-dz-backend
```

### Problème : BMAD chat renvoie erreur 422

**Cause** : Format JSON incorrect

**Solution** : Utiliser le format exact avec fichier JSON :
```json
{
  "agent_id": "bmm-dev",
  "messages": [{"role": "user", "content": "votre message"}],
  "temperature": 0.7
}
```

### Problème : "Field required: messages"

**Cause** : Mauvais format de requête

**Solution** : Le champ `messages` doit être un **tableau** d'objets, pas une chaîne unique.

---

## 📚 Ressources Supplémentaires

- **Documentation complète** : `DIAGNOSTIC_COMPLET.md`
- **Architecture** : `docs/ARCHITECTURE_INTEGREE.md`
- **Workflows BMAD** : `WORKFLOW_BMAD_FONCTIONNEL.md`
- **API Backend** : http://localhost:8180/docs (Swagger interactif)

---

## ✅ Résumé : URLs à Retenir

```
Backend API  : http://localhost:8180
Hub UI       : http://localhost:8182
Docs UI      : http://localhost:8183
Bolt Studio  : http://localhost:8184
n8n          : http://localhost:8185

API Docs     : http://localhost:8180/docs
Health Check : http://localhost:8180/health
BMAD Agents  : http://localhost:8180/api/bmad/agents
```

**Hostnames Docker = Pour config interne uniquement**

---

**Mis à jour** : 2025-11-24 20:10 UTC
**Version** : 1.0.0
**Généré par** : Claude Code
