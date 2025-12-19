# ⚡ QUICK START: Pipeline BMAD → ARCHON → BOLT

## **Créer une Application Complète en 3 Étapes**

---

## **Prérequis** (Installation One-Time)

```bash
# 1. Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Python 3.11+
sudo apt install python3.11 python3-pip

# 3. Docker & Docker Compose
sudo apt install docker.io docker-compose

# 4. Vérifier que les services sont démarrés
docker ps | grep -E "(iaf-rag-backend|iaf-archon|iaf-bolt)"
```

---

## **Option 1: Script Automatisé** (RECOMMANDÉ)

### **Usage Simple:**

```bash
cd /opt/iafactory-rag-dz

# Rendre le script exécutable (une seule fois)
chmod +x scripts/pipeline-auto.sh

# Lancer le pipeline
./scripts/pipeline-auto.sh "Mon E-commerce"
```

### **Ce que fait le script:**

1. ✅ Vérifie que Backend RAG, ARCHON et BOLT sont accessibles
2. ✅ Crée le projet BMAD dans `/opt/iafactory-rag-dz/projects/mon-e-commerce/`
3. ✅ Installe BMAD localement dans le projet
4. ⏸️ **PAUSE** → Vous devez exécuter les workflows BMAD manuellement
5. ✅ Collecte les outputs BMAD (PRD, Architecture, Stories)
6. ✅ Crée la Knowledge Base ARCHON
7. ✅ Upload les documents dans ARCHON
8. ✅ Lance l'indexation (embeddings)
9. ✅ Crée le projet BOLT
10. ✅ Lance la génération de code
11. ✅ Sauvegarde le résumé dans `pipeline-summary.json`

### **Workflows BMAD à Exécuter:**

Quand le script fait la pause, ouvrez votre IDE (VS Code, Cursor, Claude Code):

```bash
# Charger l'agent Mary (Analyst)
# Fichier: /opt/iafactory-rag-dz/projects/mon-e-commerce/.bmad/src/modules/bmm/agents/analyst.agent.yaml

# Puis exécuter ces workflows:
*workflow-init                          # 1. Initialisation (5 min)
*brainstorm-project                     # 2. Brainstorming (10-15 min)
/bmad:bmm:workflows:prd                 # 3. PRD (15-20 min)
/bmad:bmm:workflows:architecture        # 4. Architecture (10-15 min)
/bmad:bmm:workflows:create-stories      # 5. User Stories (10-15 min)
```

**Total time BMAD:** 50 min - 1h30

Ensuite, revenez au terminal et appuyez sur **ENTER**.

Le reste est 100% automatique! ⚡

---

## **Option 2: Manuel Step-by-Step**

### **Étape 1: BMAD (Planification)**

```bash
# 1. Créer le dossier projet
mkdir -p /opt/iafactory-rag-dz/projects/mon-ecommerce
cd /opt/iafactory-rag-dz/projects/mon-ecommerce

# 2. Installer BMAD
npx bmad-method@alpha install

# 3. Suivre les prompts:
# - Modules: BMM (BMad Method)
# - Votre nom: Votre Nom
# - Langue: French
# - Game dev: No

# 4. Charger l'agent dans votre IDE
# Fichier: .bmad/src/modules/bmm/agents/analyst.agent.yaml

# 5. Exécuter les workflows (voir ci-dessus)
```

### **Étape 2: ARCHON (Knowledge Base)**

```bash
# 1. Créer la KB
curl -X POST http://localhost:8000/api/v1/knowledge \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mon E-commerce - KB",
    "description": "Base de connaissances pour mon e-commerce",
    "type": "project_specs"
  }'

# Output: {"id": "kb_abc123", ...}
# Copier le KB_ID

# 2. Uploader le PRD
PRD_CONTENT=$(cat .bmad/docs/planning/prd.md)
curl -X POST http://localhost:8000/api/v1/knowledge/kb_abc123/documents \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Product Requirements Document\",
    \"type\": \"prd\",
    \"content\": \"$PRD_CONTENT\"
  }"

# 3. Uploader l'Architecture
ARCH_CONTENT=$(cat .bmad/docs/design/architecture.md)
curl -X POST http://localhost:8000/api/v1/knowledge/kb_abc123/documents \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Architecture\",
    \"type\": \"architecture\",
    \"content\": \"$ARCH_CONTENT\"
  }"

# 4. Uploader les Stories (répéter pour chaque story)
STORY_CONTENT=$(cat .bmad/docs/implementation/story-1.md)
curl -X POST http://localhost:8000/api/v1/knowledge/kb_abc123/documents \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"User Story 1\",
    \"type\": \"user_story\",
    \"content\": \"$STORY_CONTENT\"
  }"

# 5. Lancer l'indexation
curl -X POST http://localhost:8000/api/v1/knowledge/kb_abc123/index
```

### **Étape 3: BOLT (Génération Code)**

```bash
# 1. Créer le projet BOLT
curl -X POST http://localhost:5173/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mon E-commerce",
    "knowledge_base_id": "kb_abc123",
    "template": "auto"
  }'

# Output: {"id": "proj_xyz789", ...}
# Copier le PROJECT_ID

# 2. Lancer la génération
curl -X POST http://localhost:5173/api/projects/proj_xyz789/generate \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "auto",
    "use_rag": true,
    "knowledge_base_id": "kb_abc123"
  }'

# 3. Ouvrir BOLT dans le navigateur
# http://localhost:5173/projects/proj_xyz789
```

---

## **Option 3: Via Web UI**

### **Méthode la Plus Simple (Pour Non-Développeurs):**

1. **Ouvrir:** https://iafactoryalgeria.com/bmad
2. **Cliquer:** "Nouveau Projet"
3. **Remplir:** Nom du projet, description
4. **Suivre:** Les workflows guidés BMAD
5. **Attendre:** Génération automatique ARCHON + BOLT
6. **Télécharger:** Le code généré

**Temps total:** 1-2 heures

---

## **Vérification du Pipeline**

### **Après Exécution, Vérifier:**

```bash
# 1. Vérifier le projet BMAD
ls -la /opt/iafactory-rag-dz/projects/mon-ecommerce/.bmad/docs/

# Doit contenir:
# - planning/prd.md
# - design/architecture.md
# - implementation/story-*.md

# 2. Vérifier la KB ARCHON
curl http://localhost:8000/api/v1/knowledge/kb_abc123/stats

# Doit retourner:
# {
#   "documents_count": 8+,
#   "chunks_count": 200+,
#   "embeddings_count": 200+
# }

# 3. Vérifier le projet BOLT
curl http://localhost:5173/api/projects/proj_xyz789

# Doit retourner:
# {
#   "status": "completed",
#   "files_generated": 50+,
#   "code_size": "~500KB"
# }
```

---

## **Troubleshooting**

### **Problème 1: Services non démarrés**

```bash
# Vérifier les containers
docker ps | grep -E "(rag-backend|archon|bolt)"

# Si manquants, démarrer:
docker-compose up -d iaf-rag-backend-prod
cd /opt/iafactory-rag-dz/frontend/archon-ui && npm run dev &
cd /opt/iafactory-rag-dz/bolt-diy && pnpm run dev &
```

### **Problème 2: BMAD workflows ne s'exécutent pas**

```bash
# Vérifier Node.js version
node --version  # Doit être >= 20.0.0

# Réinstaller BMAD
cd /opt/iafactory-rag-dz/projects/mon-ecommerce
rm -rf .bmad
npx bmad-method@alpha install
```

### **Problème 3: ARCHON KB non créée**

```bash
# Vérifier le backend RAG
curl http://localhost:8000/health

# Vérifier les logs
docker logs iaf-rag-backend-prod | tail -50

# Redémarrer si nécessaire
docker restart iaf-rag-backend-prod
```

### **Problème 4: BOLT ne génère pas de code**

```bash
# Vérifier BOLT
curl http://localhost:5173/health

# Vérifier les logs
cd /opt/iafactory-rag-dz/bolt-diy
cat nohup.out | tail -50

# Redémarrer si nécessaire
pkill -f "vite"
pnpm run dev &
```

---

## **Exemples de Projets**

### **E-commerce Simple:**
```bash
./scripts/pipeline-auto.sh "Boutique Artisanat DZ"

# Temps: ~1h
# Résultat: Site e-commerce avec panier, paiement, admin
```

### **SaaS Dashboard:**
```bash
./scripts/pipeline-auto.sh "Dashboard Analytics Entreprise"

# Temps: ~1h30
# Résultat: Dashboard avec charts, tables, exports
```

### **Blog Multi-auteurs:**
```bash
./scripts/pipeline-auto.sh "Blog Tech Algérie"

# Temps: ~45min
# Résultat: Blog avec CMS, markdown editor, commentaires
```

---

## **Next Steps Après Génération**

```bash
# 1. Récupérer le code
cd /opt/iafactory-rag-dz/projects/mon-ecommerce/output

# 2. Installer les dépendances
npm install

# 3. Lancer en dev
npm run dev

# 4. Tester
# Frontend: http://localhost:3000
# Backend: http://localhost:8080

# 5. Builder pour production
npm run build

# 6. Déployer
# (voir DEPLOYMENT.md)
```

---

## **Support**

Besoin d'aide?

- 📖 **Docs complètes:** [PROPOSITION_VALEUR_PIPELINE.md](./PROPOSITION_VALEUR_PIPELINE.md)
- 💬 **Discord:** https://discord.gg/iafactoryalgeria
- 📧 **Email:** support@iafactoryalgeria.com
- 🌐 **Site:** https://iafactoryalgeria.com

---

**Bon développement! 🚀**
