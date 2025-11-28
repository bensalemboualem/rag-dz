# 🎯 INTERFACES COMPLÈTES - IA FACTORY RAG-DZ

## 📊 RÉSUMÉ GLOBAL

**Total:** 10 interfaces accessibles dans le projet rag-dz

---

## 🌐 INTERFACES WEB PRINCIPALES (8 interfaces)

### 1. **Backend API**
```
URL: http://localhost:8180
Service: iaf-dz-backend
```
**Description:** API REST principale pour toutes les fonctionnalités
**Swagger:** http://localhost:8180/docs

---

### 2. **IAFactory Hub** (Archon UI)
```
URL: http://localhost:8182
Service: iaf-dz-hub
Port Docker: 8182:3737
```
**Description:** Dashboard principal - Interface de gestion centralisée
**Fonctionnalités:**
- Dashboard
- Chat IA (6 agents)
- Calendrier & Rendez-vous
- Agent Vocal
- Emails & Intégrations
- Documents (RAG)
- Messagerie SMS
- Automatisations
- Paramètres

**Lancer:**
```bash
docker-compose up iafactory-hub
# OU
cd frontend/archon-ui && npm run dev
```

---

### 3. **IAFactory Docs** (RAG UI)
```
URL: http://localhost:8183
Service: iaf-dz-docs
Port Docker: 8183:5173
```
**Description:** Gestion documentaire et système RAG
**Fonctionnalités:**
- Upload documents (PDF, DOCX, TXT)
- Recherche sémantique
- Chat avec documents
- Gestion base de connaissances

**Lancer:**
```bash
docker-compose up iafactory-docs
# OU
cd frontend/rag-ui && npm run dev
```

---

### 4. **IAFactory Studio** (Bolt.DIY)
```
URL: http://localhost:8184
Service: iaf-dz-studio
Port Docker: 8184:5173
```
**Description:** Éditeur de code IA (nécessite profile `studio`)
**Fonctionnalités:**
- Génération de code assistée par IA
- Playground interactif
- Intégration NotebookLM
- Support multi-LLM (GPT-4o, Claude, Gemini, etc.)

**Lancer:**
```bash
docker-compose --profile studio up iafactory-studio
# OU
cd bolt-diy && npm run dev
```

---

### 5. **n8n Automation**
```
URL: http://localhost:8185
Service: iaf-dz-n8n
Port Docker: 8185:5678
```
**Description:** Workflows et automatisation
**Auth:** Basic Auth (admin/admin par défaut)
**Fonctionnalités:**
- Création de workflows
- Intégrations externes
- Webhooks
- Automatisations

**Lancer:**
```bash
docker-compose up iafactory-n8n
```

---

### 6. **Qdrant Dashboard**
```
URL: http://localhost:6332/dashboard
Service: iaf-dz-qdrant
Port Docker: 6332:6333
```
**Description:** Base de données vectorielle
**Fonctionnalités:**
- Visualisation des collections
- Recherche vectorielle
- Métriques et statistiques

**Lancer:**
```bash
docker-compose up iafactory-qdrant
```

---

### 7. **🏛️ Council Custom** (LLM Multi-expert)
```
URL: http://localhost:8189
Service: serve-council-custom.js
```
**Description:** Consultation avec plusieurs LLMs (Claude, Gemini, Llama)
**Fonctionnalités:**
- Questions à 3+ LLMs simultanés
- Synthèse finale
- Comparaison des réponses
- Mode revue croisée

**Lancer:**
```bash
node serve-council-custom.js
```

**Backend API:**
```
http://localhost:8180/api/council/*
```

---

### 8. **🎨 Ithy Presentation** (Style ithy.ai)
```
URL: http://localhost:8190
Service: serve-ithy.js
```
**Description:** Système de présentation RAG enrichi
**Fonctionnalités:**
- Articles HTML riches
- Tableaux comparatifs DZ 🇩🇿 vs CH 🇨🇭
- Graphiques interactifs (Recharts)
- FAQ expandables
- Citations sources avec pertinence
- Alertes juridiques

**Lancer:**
```bash
node serve-ithy.js
```

**Composants React:**
```
frontend/archon-ui/src/components/presentation/
```

---

## 📓 **9. NotebookLM IA Factory** (Génération Intelligente)
```
URL: http://localhost:8191
Service: serve-notebooklm.js
```
**Description:** Système complet de génération multi-format avec BMAD

### **🎯 3 Pages Intégrées:**

#### **Page 1: Prompting + Chat NLP** 💬
- Conversation en langage naturel
- Chatbot BMAD intelligent
- Bouton "Générer Prompt"
- Sortie:
  1. **Texte explicatif** - Comprendre la demande
  2. **Prompt structuré** - Optimisé pour l'IA

**Exemple:**
```
User: "Je veux une vidéo sur l'entrepreneuriat en Algérie"

BMAD génère:
→ Explication: "Vidéo de 5-10s, style professionnel, provider Wan 2.2"
→ Prompt: "Professional video about entrepreneurship in Algeria,
          cinematic style, 16:9, 30fps, French audio, Algerian context..."
```

#### **Page 2: Génération Automatique** 🎨
- User approuve le prompt
- Clique "Générer"
- **BMAD détecte automatiquement le type:**
  - 🎥 **Vidéo** → Wan 2.2 (PiAPI), Sora 2, MiniMax, Seedance
  - 🖼️ **Image** → FLUX Pro, DALL-E 3, Ideogram
  - 📊 **Présentation** → BMAD + Reveal.js
  - 🎵 **Audio** → ElevenLabs, OpenAI TTS
- Lance la production automatiquement
- Affiche progression en temps réel
- Résultat téléchargeable

**Providers configurés:**
```
Gratuits:
- FLUX (images)
- Qwen/Llama (LLM local)

Payants:
- Wan 2.2 via PiAPI (~$0.02/vidéo)
- DALL-E 3 (~$0.04/image)
- ElevenLabs (~$0.015/audio)
```

#### **Page 3: Gestion Crédit/Wallet** 💳
- Solde actuel affiché
- Options de recharge:
  - $5 → ~500 générations
  - $10 → ~1000 générations
  - $25 → ~2500 générations (+10% bonus)
  - $50 → ~5000 générations (+20% bonus)
- Montant personnalisé
- Bouton "Procéder au Paiement"
- Historique des transactions

**Si crédit insuffisant:**
- Alerte automatique
- Redirection vers page crédit
- Blocage de la génération

**Lancer:**
```bash
node serve-notebooklm.js
```

**Backend API requis:**
```python
# À créer: backend/rag-compat/app/routers/notebook.py
@router.post("/api/notebook/query")
@router.post("/api/notebook/generate")
```

---

## 📊 **10-11. Monitoring** (Optionnelles - Profile `monitoring`)

### 10. **Prometheus**
```
URL: http://localhost:8187
Service: iaf-dz-prometheus
```
**Lancer:**
```bash
docker-compose --profile monitoring up iafactory-prometheus
```

### 11. **Grafana**
```
URL: http://localhost:8188
Service: iaf-dz-grafana
Auth: admin/admin
```
**Lancer:**
```bash
docker-compose --profile monitoring up iafactory-grafana
```

---

## 🚀 DÉMARRAGE RAPIDE

### **Tout démarrer (services principaux):**
```bash
docker-compose up -d
```

### **Services standalones:**
```bash
# Council Custom
node serve-council-custom.js &

# Ithy Presentation
node serve-ithy.js &

# NotebookLM IA Factory
node serve-notebooklm.js &
```

### **Avec profiles:**
```bash
# Studio
docker-compose --profile studio up iafactory-studio

# Monitoring
docker-compose --profile monitoring up
```

---

## 📋 TABLEAU RÉCAPITULATIF

| # | Interface | Port | Service | Type |
|---|-----------|------|---------|------|
| 1 | Backend API | 8180 | Docker | API |
| 2 | IAFactory Hub | 8182 | Docker | Dashboard |
| 3 | IAFactory Docs | 8183 | Docker | Documents/RAG |
| 4 | IAFactory Studio | 8184 | Docker | Code Editor |
| 5 | n8n Automation | 8185 | Docker | Workflows |
| 6 | Qdrant | 6332 | Docker | Vector DB |
| 7 | Council Custom | **8189** | Node.js | LLM Multi-expert |
| 8 | Ithy Presentation | **8190** | Node.js | RAG Enrichi |
| 9 | **NotebookLM IA Factory** | **8191** | Node.js | **Génération IA** |
| 10 | Prometheus | 8187 | Docker | Metrics (opt.) |
| 11 | Grafana | 8188 | Docker | Dashboard (opt.) |

---

## 🎯 WORKFLOWS RECOMMANDÉS

### **Workflow 1: Génération de Contenu**
```
1. NotebookLM (8191) - Page 1
   └─→ Chat NLP: "Créer une vidéo sur le Sahara"
   └─→ BMAD génère prompt optimisé

2. NotebookLM (8191) - Page 2
   └─→ User approuve
   └─→ Détection auto: Type Vidéo
   └─→ Provider: Wan 2.2
   └─→ Génération lancée

3. NotebookLM (8191) - Page 3
   └─→ Crédit déduit (-$0.02)
   └─→ Si insuffisant → Recharge

4. Résultat
   └─→ Téléchargement MP4
   └─→ Partage sur réseaux (via n8n 8185)
```

### **Workflow 2: Consultation Juridique**
```
1. IAFactory Docs (8183)
   └─→ Upload documents légaux DZ/CH

2. Backend API (8180)
   └─→ Indexation Qdrant (6332)

3. Council Custom (8189)
   └─→ Question juridique
   └─→ 3 LLMs consultés (Claude, Gemini, Llama)
   └─→ Synthèse finale

4. Ithy Presentation (8190)
   └─→ Réponse enrichie
   └─→ Tableau comparatif DZ vs CH
   └─→ Citations sources avec pertinence
```

### **Workflow 3: Automatisation Complète**
```
1. Hub (8182) - Calendrier
   └─→ Nouveau RDV client

2. n8n (8185) - Workflow déclenché
   └─→ Email automatique
   └─→ SMS via Twilio
   └─→ Création tâche

3. NotebookLM (8191)
   └─→ Génération présentation auto
   └─→ Envoi au client

4. Council (8189)
   └─→ Brief pré-réunion par LLMs
```

---

## 🔧 DÉPENDANCES NODEJS

### **Pour lancer les serveurs standalone:**
```bash
# Aucune dépendance externe nécessaire
node serve-council-custom.js
node serve-ithy.js
node serve-notebooklm.js
```

Utilisent uniquement les modules Node.js natifs:
- `http`
- `fs`
- `path`

---

## 📝 NOTES IMPORTANTES

### **Ports utilisés (plage 8180-8191):**
- ✅ **8180:** Backend API
- ✅ **8182:** Hub (Dashboard)
- ✅ **8183:** Docs (RAG)
- ✅ **8184:** Studio (Bolt.DIY)
- ✅ **8185:** n8n (Automation)
- ❌ **8186:** Ollama (API interne)
- ✅ **8187:** Prometheus (monitoring)
- ✅ **8188:** Grafana (monitoring)
- ✅ **8189:** Council Custom (standalone)
- ✅ **8190:** Ithy Presentation (standalone)
- ✅ **8191:** NotebookLM IA Factory (standalone)

### **Autres ports:**
- **6330:** PostgreSQL
- **6331:** Redis
- **6332:** Qdrant

---

## 🐛 TROUBLESHOOTING

### **Port déjà utilisé:**
```bash
# Windows
netstat -ano | findstr :<PORT>
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :<PORT>
kill -9 <PID>
```

### **Docker services ne démarrent pas:**
```bash
docker-compose down
docker-compose up -d --force-recreate
```

### **Serveurs Node.js:**
```bash
# Vérifier qu'ils tournent
ps aux | grep node

# Kill tous les serveurs Node
pkill -f "serve-"
```

---

## 📞 SUPPORT

**Documentation:**
- `docs/` - Guides complets
- `README.md` - Guide principal
- `CHANGELOG_STUDIO.md` - Historique

**Logs:**
```bash
# Docker
docker logs iaf-dz-backend --tail 50 --follow
docker logs iaf-dz-hub --tail 50 --follow

# Serveurs standalone
# (Affichés dans le terminal)
```

---

**Version:** 2.0.0
**Dernière mise à jour:** 18 janvier 2025
**Région:** Algérie 🇩🇿 / Suisse 🇨🇭
**Système:** IA Factory RAG Souverain
