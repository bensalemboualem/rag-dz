# ✅ JOUR 1 : Marketing SSG (Astro) - Checklist Complète

**Objectif** : Remplacer la landing actuelle par un site Astro propre, sans casser les apps existantes.
**Durée estimée** : 4-6h
**Résultat attendu** : https://iafactory.pro affiche un site SSG rapide (Lighthouse 90+)

---

## 📋 Prérequis (5 min)

### Vérifier versions local
```bash
node --version   # ≥ 18.x
npm --version    # ≥ 9.x
git --version    # ≥ 2.x
```

### Installer Git Bash (si pas encore fait)
- Windows : https://git-scm.com/download/win
- Permet d'utiliser `rsync` et `ssh` depuis VS Code

### Test connexion VPS
```bash
ssh root@46.224.3.125 "hostname && pwd"
# Résultat attendu : nom du serveur + /root
```

---

## 🏗️ ÉTAPE 1 : Créer structure v2 (15 min)

### 1.1 Créer dossier à la racine
```bash
# Dans d:\IAFactory\rag-dz
mkdir -p apps/marketing
mkdir -p apps/app
mkdir -p services/api
mkdir -p packages/ui
mkdir -p infra/nginx
mkdir -p infra/docker
```

### 1.2 Initialiser Astro (marketing)
```bash
cd apps/marketing

# Option 1 : Template minimal
npm create astro@latest . -- --template minimal --no-install --no-git

# Option 2 : Template avec Tailwind
npm create astro@latest . -- --template with-tailwind --no-install --no-git

# Installer dépendances
npm install

# Ajouter intégrations (si pas déjà incluses)
npx astro add tailwind
npx astro add sitemap
```

### 1.3 Structure fichiers Astro
```
apps/marketing/
├── src/
│   ├── layouts/
│   │   └── Layout.astro         # Layout principal
│   ├── pages/
│   │   ├── index.astro          # Accueil
│   │   ├── features.astro       # Fonctionnalités
│   │   ├── pricing.astro        # Tarifs
│   │   ├── apps.astro           # Catalogue apps
│   │   └── contact.astro        # Contact
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── AppCard.astro
│   └── styles/
│       └── global.css
├── public/
│   ├── favicon.png
│   └── logo-neon.png
└── astro.config.mjs
```

---

## 🎨 ÉTAPE 2 : Migrer contenu (60-90 min)

### 2.1 Copier assets existants
```bash
# Depuis apps/landing actuel
cp apps/landing/public/logo-neon.png apps/marketing/public/
cp apps/landing/public/favicon.png apps/marketing/public/

# CSS (si nécessaire)
cp apps/landing/iafactory-design-system.css apps/marketing/src/styles/
```

### 2.2 Créer Layout.astro
```astro
---
// apps/marketing/src/layouts/Layout.astro
export interface Props {
  title: string;
  description?: string;
}

const { title, description = "Plateforme IA pour les entreprises algériennes" } = Astro.props;
---

<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta name="description" content={description} />
    <title>{title} | RAG-DZ</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

### 2.3 Créer page index (accueil)
```astro
---
// apps/marketing/src/pages/index.astro
import Layout from '../layouts/Layout.astro';
---

<Layout title="Accueil">
  <main>
    <section class="hero">
      <h1>RAG-DZ - IA pour l'Algérie</h1>
      <p>Plateforme multi-agents pour PME, startups et professionnels</p>
      <a href="/pricing" class="cta">Commencer gratuitement</a>
    </section>

    <section class="features-preview">
      <h2>Nos solutions IA</h2>
      <!-- Reprendre sections de l'ancien landing -->
    </section>
  </main>
</Layout>
```

### 2.4 Configurer Tailwind (si utilisé)
```js
// apps/marketing/tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#00d4ff',
        secondary: '#7c3aed',
        dark: '#0f172a',
      },
    },
  },
  plugins: [],
}
```

---

## 🧪 ÉTAPE 3 : Test local (10 min)

### 3.1 Lancer dev server
```bash
cd apps/marketing
npm run dev
```
**Résultat attendu** : http://localhost:4321 affiche votre landing

### 3.2 Vérifier pages
- [ ] `/` (accueil)
- [ ] `/features` (fonctionnalités)
- [ ] `/pricing` (tarifs)
- [ ] `/apps` (catalogue)
- [ ] `/contact`

### 3.3 Tester responsive
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1920px)

---

## 🚀 ÉTAPE 4 : Build & Deploy VPS (30 min)

### 4.1 Build local
```bash
# Via commande directe
cd apps/marketing
npm run build

# OU via VS Code Task (Ctrl+Shift+P → "Run Task" → "marketing:build")
```
**Résultat** : dossier `apps/marketing/dist/` créé

### 4.2 Créer dossier sur VPS
```bash
ssh root@46.224.3.125 "mkdir -p /opt/rag-dz-v2/marketing-dist"
```

### 4.3 Deploy avec rsync
```bash
# Via commande directe
rsync -avz --delete ./apps/marketing/dist/ root@46.224.3.125:/opt/rag-dz-v2/marketing-dist/

# OU via VS Code Task : "deploy:marketing"
```

### 4.4 Backup config Nginx actuelle
```bash
ssh root@46.224.3.125 "cp /etc/nginx/sites-available/iafactory /etc/nginx/sites-available/iafactory.backup-$(date +%F)"
```

### 4.5 Modifier Nginx root
```bash
# SSH sur le VPS
ssh root@46.224.3.125

# Éditer config
nano /etc/nginx/sites-available/iafactory
```

**Modifier la section root (LIGNE 1-5)** :
```nginx
server {
    listen 80;
    server_name iafactory.pro www.iafactory.pro;

    # NOUVEAU ROOT (au lieu de /opt/landing ou autre)
    root /opt/rag-dz-v2/marketing-dist;
    index index.html;

    # Ajout pour SPA/SSG
    location / {
        try_files $uri $uri/ /index.html;
    }

    # GARDER toutes les locations existantes (/hub, /docs, /rag, etc.)
    location /hub {
        proxy_pass http://localhost:3009;
        # ... reste de la config proxy
    }

    # ... (garder tout le reste intact)
}
```

### 4.6 Tester & Recharger Nginx
```bash
# Test syntaxe
nginx -t

# Si OK, recharger
systemctl reload nginx

# Vérifier status
systemctl status nginx

# OU via VS Code Task : "vps:nginx:reload"
```

---

## ✅ ÉTAPE 5 : Validation (10 min)

### 5.1 Test navigation
- [ ] https://iafactory.pro (nouvelle landing Astro)
- [ ] https://iafactory.pro/features
- [ ] https://iafactory.pro/pricing
- [ ] https://iafactory.pro/apps
- [ ] https://iafactory.pro/contact

### 5.2 Test apps existantes (pas cassées)
- [ ] https://iafactory.pro/hub (portail actuel)
- [ ] https://iafactory.pro/rag (RAG UI)
- [ ] https://iafactory.pro/docs

### 5.3 Performance (Lighthouse)
```bash
# Via Chrome DevTools (F12 → Lighthouse → Desktop)
# Objectif :
# - Performance : > 90
# - SEO : > 95
# - Accessibility : > 90
```

### 5.4 Test responsive mobile
- [ ] Menu mobile fonctionne
- [ ] Textes lisibles
- [ ] Boutons cliquables

---

## 🎯 Commit & Push

### 5.5 Versionner changements
```bash
cd d:\IAFactory\rag-dz

git add apps/marketing
git add .vscode/tasks.json
git add CLAUDE.md
git add JOUR_1_CHECKLIST.md

git commit -m "feat: ajout marketing Astro SSG (Jour 1)

- Création apps/marketing avec Astro + Tailwind
- Migration 5 pages principales (/, features, pricing, apps, contact)
- VS Code tasks pour build/deploy automatisés
- Nginx root pointant vers /opt/rag-dz-v2/marketing-dist
- Lighthouse score 90+ (performance/SEO)
"

git push origin main
```

---

## 🐛 Troubleshooting

### Problème : rsync commande introuvable (Windows)
**Solution** : Installer Git Bash ou utiliser WSL
```bash
# Via Git Bash (installé avec Git for Windows)
# OU via WSL : wsl rsync -avz ...
```

### Problème : SSH demande password à chaque fois
**Solution** : Configurer clé SSH
```bash
# Générer clé (si pas déjà fait)
ssh-keygen -t ed25519 -C "votre@email.com"

# Copier sur VPS
ssh-copy-id root@46.224.3.125
```

### Problème : Nginx 404 sur toutes les pages
**Solution** : Vérifier permissions
```bash
ssh root@46.224.3.125
ls -la /opt/rag-dz-v2/marketing-dist
# Si vide : refaire rsync
# Si permissions 000 : chmod -R 755 /opt/rag-dz-v2/marketing-dist
```

### Problème : Build Astro échoue
**Solution** : Vérifier Node.js version
```bash
node --version  # Doit être ≥ 18.x
# Si plus ancien : installer nvm-windows ou mettre à jour Node
```

---

## 📊 Critères de Réussite Jour 1

- ✅ Structure `apps/marketing` créée avec Astro
- ✅ 5 pages fonctionnelles (/, features, pricing, apps, contact)
- ✅ Build local réussi (`npm run build`)
- ✅ Deploy VPS automatisé (via VS Code Task)
- ✅ Nginx root pointe vers nouveau SSG
- ✅ Apps existantes NON cassées (/hub, /rag, /docs)
- ✅ Performance Lighthouse > 90
- ✅ Responsive mobile/desktop OK
- ✅ Commité dans git

---

## 🚀 Prochaine Étape (Jour 2)

**Objectif Jour 2** : Finaliser contenu marketing + ajouter i18n (fr/ar/en)

Checklist :
1. Compléter sections features/pricing avec vraies données
2. Ajouter composant `LanguageSwitcher.astro`
3. Créer fichiers JSON traductions (`fr.json`, `ar.json`, `en.json`)
4. Tester RTL pour arabe
5. Ajouter formulaire contact (API endpoint)

---

**Date de création** : 2025-12-12
**Durée estimée** : 4-6h (avec pauses)
**Niveau difficulté** : Débutant/Intermédiaire
