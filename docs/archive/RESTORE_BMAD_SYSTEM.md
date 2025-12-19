# 🔧 RESTAURATION SYSTÈME BMAD COMPLET

## 📊 ÉTAT ACTUEL

### ✅ CE QUI EXISTE DÉJÀ:

1. **Version BOLT Intégrée** ⚡
   - `bolt-diy/app/components/chat/AgentSelector.tsx` ✅
   - `bolt-diy/app/components/chat/BMADAgentGrid.tsx` ✅
   - 19 agents BMAD chargés ✅
   - URL: http://localhost:5173

2. **API Backend** 🔌
   - `/api/orchestrator/*` - Agent orchestrator #20
   - `/api/coordination/*` - Coordination BMAD → ARCHON → BOLT
   - `/api/bmad/orchestration/*` - Orchestration BMAD
   - Routers enregistrés dans main.py ✅

3. **MCP Integration** 🧠
   - ARCHON MCP Server (port 8051)
   - BOLT MCP connection
   - Documentation complète ✅

### ❌ PROBLÈME:
- Backend ne répond pas aux endpoints orchestrator/coordination
- Services tournent sur différents ports (8207, 8199, etc.)
- Nginx pointe vers port 8180 qui ne répond pas

---

## 🚀 SOLUTION RAPIDE: UTILISER BOLT DIRECTEMENT

### Version BOLT avec BMAD (RECOMMANDÉ) ⭐

**Cette version fonctionne déjà!**

#### Étape 1: Démarrer BOLT

```bash
ssh root@46.224.3.125

# Vérifier si BOLT tourne
curl -s http://localhost:5173 | head -5

# Si pas de réponse, démarrer BOLT:
cd /opt/iafactory-rag-dz/bolt-diy
pnpm run dev --host 0.0.0.0 --port 5173
```

#### Étape 2: Configurer Nginx pour BOLT

```bash
# Ajouter route BOLT dans nginx
cat >> /etc/nginx/sites-enabled/iafactoryalgeria.com <<'EOF'

location /bolt/ {
    proxy_pass http://localhost:5173/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
EOF

nginx -s reload
```

#### Étape 3: Utiliser

```
URL: https://iafactoryalgeria.com/bolt/

1. Ouvrir l'URL
2. Sélectionner un agent BMAD dans le dropdown
3. Converser avec l'agent
4. BOLT → MCP → ARCHON → Projet créé
5. Code généré automatiquement
```

---

## 🎯 SOLUTION COMPLÈTE: RESTAURER TOUT

### Script de Déploiement Automatique

Créez ce fichier: `/opt/iafactory-rag-dz/restore-bmad.sh`

```bash
#!/bin/bash
set -e

echo "🚀 Restauration système BMAD complet..."

# 1. Arrêter anciens backends
echo "1️⃣ Arrêt anciens backends..."
pkill -9 -f 'uvicorn main:app' || true
sleep 2

# 2. Trouver Python avec uvicorn
echo "2️⃣ Recherche Python..."
PYTHON_CMD=$(which python3.11 || which python3.10 || which python3)
echo "Python trouvé: $PYTHON_CMD"

# 3. Démarrer backend principal sur port 8000
echo "3️⃣ Démarrage backend port 8000..."
cd /opt/iafactory-rag-dz/backend/rag-compat

nohup $PYTHON_CMD -m uvicorn main:app \
    --host 0.0.0.0 \
    --port 8000 \
    --workers 1 \
    > /var/log/rag-backend-8000.log 2>&1 &

sleep 5

# 4. Vérifier endpoints
echo "4️⃣ Vérification endpoints..."
curl -s http://localhost:8000/api/orchestrator/health && echo "✅ Orchestrator OK" || echo "❌ Orchestrator FAIL"
curl -s http://localhost:8000/api/coordination/health && echo "✅ Coordination OK" || echo "❌ Coordination FAIL"

# 5. Mettre à jour Nginx
echo "5️⃣ Mise à jour Nginx..."
sed -i 's/proxy_pass http:\/\/127.0.0.1:[0-9]*/proxy_pass http:\/\/127.0.0.1:8000/' \
    /etc/nginx/sites-enabled/iafactoryalgeria.com

nginx -t && nginx -s reload
echo "✅ Nginx rechargé"

# 6. Démarrer BOLT si pas running
echo "6️⃣ Vérification BOLT..."
if ! curl -s http://localhost:5173 > /dev/null 2>&1; then
    cd /opt/iafactory-rag-dz/bolt-diy
    nohup pnpm run dev --host 0.0.0.0 --port 5173 \
        > /var/log/bolt.log 2>&1 &
    echo "✅ BOLT démarré"
else
    echo "✅ BOLT déjà running"
fi

sleep 5

# 7. Tests finaux
echo ""
echo "🧪 TESTS FINAUX:"
echo "==============="

echo -n "Backend API: "
curl -s https://iafactoryalgeria.com/api/orchestrator/health > /dev/null && echo "✅ OK" || echo "❌ FAIL"

echo -n "Coordination: "
curl -s https://iafactoryalgeria.com/api/coordination/health > /dev/null && echo "✅ OK" || echo "❌ FAIL"

echo -n "BOLT: "
curl -s http://localhost:5173 > /dev/null && echo "✅ OK" || echo "❌ FAIL"

echo ""
echo "🎉 RESTAURATION TERMINÉE!"
echo ""
echo "📊 URLs disponibles:"
echo "  - BOLT avec BMAD: https://iafactoryalgeria.com/bolt/"
echo "  - API Orchestrator: https://iafactoryalgeria.com/api/orchestrator/"
echo "  - API Coordination: https://iafactoryalgeria.com/api/coordination/"
echo ""
```

### Exécuter le script:

```bash
ssh root@46.224.3.125
chmod +x /opt/iafactory-rag-dz/restore-bmad.sh
./opt/iafactory-rag-dz/restore-bmad.sh
```

---

## 📖 GUIDE D'UTILISATION

### Version 1: Agent Orchestrator (Chatbots Individuels)

**Architecture:**
```
User → Agent BMAD individuel → Orchestrator #20 → ARCHON → BOLT
```

**Endpoints:**
```bash
# Analyser si projet prêt
POST /api/orchestrator/analyze-readiness
{
  "messages": [...],
  "agents_used": ["winston", "amelia", "john"]
}

# Orchestration complète
POST /api/orchestrator/orchestrate-complete
{
  "messages": [...],
  "agents_used": ["winston", "amelia"],
  "auto_produce": true
}
```

**Utilisation:**
1. Chatter avec agents BMAD individuels
2. Orchestrator analyse quand projet est prêt (>80% confidence)
3. Crée projet ARCHON automatiquement
4. Lance BOLT pour production
5. Code généré!

### Version 2: BOLT Intégré (Tout-en-un)

**Architecture:**
```
User → BOLT UI → Sélecteur agents BMAD → MCP → ARCHON → Code généré
```

**Utilisation:**
1. Ouvrir https://iafactoryalgeria.com/bolt/
2. Sélectionner agent BMAD (dropdown en haut)
3. Converser avec l'agent dans BOLT
4. Agent analyse et crée projet
5. BOLT génère code directement
6. Télécharger le code!

**Composants:**
- `AgentSelector.tsx` - Dropdown 19 agents
- `BMADAgentGrid.tsx` - Grille visuelle agents
- MCP integration - Communication BOLT ↔ ARCHON
- Coordination automatique

---

## 🎯 WORKFLOW COMPLET

### Exemple: Créer E-commerce

#### Avec Version Orchestrator:

```
1. POST /api/orchestrator/orchestrate-complete
   Body: {
     "messages": [
       {"role": "user", "content": "Créer e-commerce artisanat DZ", "agent": "winston"},
       {"role": "assistant", "content": "Architecture: React + FastAPI...", "agent": "winston"},
       {"role": "user", "content": "Quelles features?", "agent": "john"},
       {"role": "assistant", "content": "MVP: Catalogue, Panier, Paiement...", "agent": "john"}
     ],
     "agents_used": ["winston", "john", "amelia"],
     "auto_produce": true
   }

2. Orchestrator analyse → 95% ready
3. Crée projet ARCHON (project_xxx)
4. Génère knowledge base
5. Lance BOLT avec contexte
6. Code produit!

Response: {
  "project_id": "project_xxx",
  "knowledge_base_id": "kb_xxx",
  "bolt_url": "https://bolt.iafactoryalgeria.com?project=xxx",
  "status": "production_launched"
}
```

#### Avec Version BOLT:

```
1. Ouvrir https://iafactoryalgeria.com/bolt/
2. Sélectionner "Winston - Architect" dans dropdown
3. Taper: "Créer e-commerce artisanat DZ"
4. Winston répond avec architecture
5. Sélectionner "John - Product Manager"
6. Taper: "Quelles features prioritaires?"
7. John répond avec roadmap
8. BOLT détecte projet → Bouton "Créer projet Archon" apparaît
9. Cliquer → Projet créé via MCP
10. BOLT génère code automatiquement
11. Télécharger!
```

---

## 🔍 DIAGNOSTIC

### Vérifier si tout fonctionne:

```bash
# Backend Orchestrator
curl -s http://localhost:8000/api/orchestrator/health

# Backend Coordination
curl -s http://localhost:8000/api/coordination/health

# BOLT
curl -s http://localhost:5173

# Via Nginx
curl -s https://iafactoryalgeria.com/api/orchestrator/health
curl -s https://iafactoryalgeria.com/bolt/
```

### Logs:

```bash
# Backend
tail -f /var/log/rag-backend-8000.log

# BOLT
tail -f /var/log/bolt.log

# Nginx
tail -f /var/log/nginx/error.log
```

---

## ✅ CHECKLIST FINAL

- [ ] Backend running sur port 8000
- [ ] Orchestrator API accessible
- [ ] Coordination API accessible
- [ ] BOLT running sur port 5173
- [ ] Nginx configuré pour /api/ et /bolt/
- [ ] Agents BMAD chargés (19)
- [ ] MCP Server running (port 8051)
- [ ] Test end-to-end réussi

---

## 🎁 BONUS: Interface Web Pipeline

Vous avez aussi `/pipeline` déployé qui utilise l'API coordination!

**URL:** https://iafactoryalgeria.com/pipeline

Pour l'activer:
```bash
# S'assurer que backend est sur port 8000
# Nginx est déjà configuré
# Juste ouvrir l'URL!
```

---

**Créé:** 2025-12-06
**Status:** Prêt à restaurer
**Temps estimé:** 5 minutes avec le script automatique
