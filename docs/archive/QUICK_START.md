# 🚀 QUICK START - Démarrer MAINTENANT

## ⚡ Commandes Copier/Coller (5 min setup)

### 1️⃣ Créer structure v2
```bash
cd d:\IAFactory\rag-dz

# Créer dossiers
mkdir -p apps/marketing apps/app services/api packages/ui infra/nginx infra/docker
```

### 2️⃣ Initialiser Astro (marketing)
```bash
cd apps/marketing

# Créer projet Astro avec Tailwind
npm create astro@latest . -- --template with-tailwind --no-install --no-git

# Installer dépendances
npm install

# Ajouter sitemap
npx astro add sitemap
```

### 3️⃣ Test local immédiat
```bash
npm run dev
```
**→ Ouvrir http://localhost:4321** (devrait afficher template Astro)

---

## 📁 Fichiers Créés pour Toi

### ✅ `.vscode/tasks.json`
**Utilisation** : `Ctrl+Shift+P` → "Run Task" → choisir :
- `marketing:dev` : lancer Astro en dev
- `marketing:build` : builder pour prod
- `deploy:marketing` : rsync vers VPS (après build)
- `vps:nginx:reload` : recharger Nginx
- `workflow:deploy-marketing-full` : tout automatique (build + deploy + reload)

### ✅ `CLAUDE.md`
**Utilisation** : Guide pour Claude Code avec :
- Conventions de code (nommage, structure)
- Limites (ne jamais éditer direct sur VPS)
- Stack technique (Astro/Next/FastAPI)
- Workflow local → VPS

### ✅ `JOUR_1_CHECKLIST.md`
**Utilisation** : Checklist détaillée pour aujourd'hui (4-6h)
- Étape par étape avec commandes exactes
- Troubleshooting inclus
- Critères de réussite

---

## 🎯 Workflow Recommandé (Aujourd'hui)

### Option A : Copier contenu existant (rapide - 2h)
```bash
# Copier assets
cp apps/landing/public/* apps/marketing/public/

# Migrer HTML → Astro (manuellement ou avec Claude Code)
```

### Option B : Partir du template (propre - 4h)
1. Garder template Astro de base
2. Ajouter sections une par une
3. Utiliser Tailwind pour styling
4. Importer seulement logo + favicon

**Recommandation** : Option B (base propre)

---

## 🖥️ VS Code : 2 Fenêtres Recommandées

### Fenêtre 1 : Local (dev/build)
```bash
code d:\IAFactory\rag-dz
```

### Fenêtre 2 : VPS (remote SSH)
- Installer extension : Remote - SSH
- Ctrl+Shift+P → "Remote-SSH: Connect to Host"
- Entrer : root@46.224.3.125

---

## 🚨 Règles d'Or

### ✅ À FAIRE
- Travailler en **local**
- **Builder** avant deploy
- Utiliser **VS Code Tasks**
- **Commit** après chaque étape

### ❌ NE PAS FAIRE
- Éditer direct sur VPS (sauf Nginx/Docker)
- Dupliquer HTML/CSS
- Commit secrets
- Skip build local

---

**🎯 Objectif Jour 1** : Landing propre, Lighthouse 90+
**⏱️ Temps** : 4-6h
**📈 Résultat** : https://iafactory.pro performant

---

**Prêt ?** → Ouvre `JOUR_1_CHECKLIST.md` ! 🚀
