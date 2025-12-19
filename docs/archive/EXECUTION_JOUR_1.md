# 🚀 EXÉCUTION JOUR 1 - Commandes Exactes

**Date** : 2025-12-12
**Objectif** : Déployer marketing Astro SSG sans casser prod
**Durée** : 4-6h

---

## 📋 PRÉREQUIS (5 min)

### 1. Vérifier versions
```bash
node --version   # Devrait être ≥ 18.x
npm --version    # Devrait être ≥ 9.x
git --version    # Devrait être ≥ 2.x
```

### 2. Test connexion VPS
```bash
ssh root@46.224.3.125 "hostname && pwd"
```
**Résultat attendu** : nom du serveur + `/root`

---

## 🏗️ PHASE 1 : CRÉATION LOCAL (1-2h)

### ÉTAPE 1.1 : Créer structure (Terminal Git Bash)
```bash
cd d:\IAFactory\rag-dz

# Créer dossiers v2
mkdir -p apps/marketing
mkdir -p apps/app
mkdir -p services/api
mkdir -p packages/ui
mkdir -p infra/nginx
mkdir -p infra/docker

# Vérifier
ls -la apps/
```

### ÉTAPE 1.2 : Initialiser Astro
```bash
cd apps/marketing

# Init Astro avec template Tailwind
npm create astro@latest . -- --template with-tailwind --no-install --no-git --yes

# Installer dépendances
npm install

# Ajouter sitemap
npx astro add sitemap --yes
```

### ÉTAPE 1.3 : Test dev server
```bash
npm run dev
```
**→ Ouvre http://localhost:4321** (Ctrl+C pour arrêter après test)

---

### ÉTAPE 1.4 : Créer page d'accueil

**Fichier** : `apps/marketing/src/pages/index.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="RAG-DZ - Plateforme IA pour l'Algérie">
  <main class="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-20">
      <div class="text-center">
        <h1 class="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          RAG-DZ
        </h1>
        <p class="text-xl md:text-2xl text-gray-300 mb-8">
          Plateforme IA Multi-Agents pour les Entreprises Algériennes
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/pricing" class="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-lg font-semibold transition-colors">
            Commencer Gratuitement
          </a>
          <a href="/features" class="px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-lg font-semibold transition-colors">
            Découvrir les Fonctionnalités
          </a>
        </div>
      </div>
    </section>

    <!-- Features Preview -->
    <section class="container mx-auto px-4 py-16">
      <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">
        Nos Solutions IA
      </h2>
      <div class="grid md:grid-cols-3 gap-8">
        <!-- Feature 1 -->
        <div class="bg-slate-800/50 rounded-lg p-6 border border-slate-700 hover:border-cyan-500 transition-colors">
          <div class="text-4xl mb-4">🤖</div>
          <h3 class="text-xl font-semibold mb-3">Multi-Agents IA</h3>
          <p class="text-gray-400">
            15 providers IA (Claude, GPT-4, Grok, DeepSeek, etc.) avec fallback automatique
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="bg-slate-800/50 rounded-lg p-6 border border-slate-700 hover:border-purple-500 transition-colors">
          <div class="text-4xl mb-4">📚</div>
          <h3 class="text-xl font-semibold mb-3">RAG Avancé</h3>
          <p class="text-gray-400">
            Recherche vectorielle avec Qdrant, traitement multilingue (fr/ar/en)
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="bg-slate-800/50 rounded-lg p-6 border border-slate-700 hover:border-cyan-500 transition-colors">
          <div class="text-4xl mb-4">🏢</div>
          <h3 class="text-xl font-semibold mb-3">Multi-tenant SaaS</h3>
          <p class="text-gray-400">
            Gestion d'organisations, quotas par plan, API sécurisée
          </p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="container mx-auto px-4 py-16 text-center">
      <h2 class="text-3xl md:text-4xl font-bold mb-6">
        Prêt à Transformer Votre Entreprise avec l'IA ?
      </h2>
      <a href="/contact" class="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-lg text-lg font-semibold transition-all">
        Contactez-nous
      </a>
    </section>
  </main>
</Layout>
```

### ÉTAPE 1.5 : Créer pages additionnelles

**Fichier** : `apps/marketing/src/pages/features.astro`
```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Fonctionnalités - RAG-DZ">
  <main class="min-h-screen bg-slate-900 text-white">
    <div class="container mx-auto px-4 py-20">
      <h1 class="text-4xl md:text-6xl font-bold text-center mb-12">
        Fonctionnalités
      </h1>
      <p class="text-xl text-center text-gray-300 max-w-3xl mx-auto">
        Découvrez toutes les capacités de la plateforme RAG-DZ
      </p>
      <!-- Ajouter contenu features ici -->
    </div>
  </main>
</Layout>
```

**Fichier** : `apps/marketing/src/pages/pricing.astro`
```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Tarifs - RAG-DZ">
  <main class="min-h-screen bg-slate-900 text-white">
    <div class="container mx-auto px-4 py-20">
      <h1 class="text-4xl md:text-6xl font-bold text-center mb-12">
        Tarifs
      </h1>
      <p class="text-xl text-center text-gray-300 max-w-3xl mx-auto mb-16">
        Choisissez le plan adapté à vos besoins
      </p>

      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <!-- Plan Gratuit -->
        <div class="bg-slate-800/50 rounded-lg p-8 border border-slate-700">
          <h3 class="text-2xl font-bold mb-4">Gratuit</h3>
          <div class="text-4xl font-bold mb-6">0 DZD</div>
          <ul class="space-y-3 mb-8">
            <li>✓ 1000 requêtes/mois</li>
            <li>✓ 3 providers IA</li>
            <li>✓ Support communauté</li>
          </ul>
          <a href="/contact" class="block text-center px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
            Commencer
          </a>
        </div>

        <!-- Plan Pro -->
        <div class="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg p-8 border-2 border-cyan-500">
          <div class="text-sm font-semibold text-cyan-400 mb-2">POPULAIRE</div>
          <h3 class="text-2xl font-bold mb-4">Pro</h3>
          <div class="text-4xl font-bold mb-6">15,000 DZD<span class="text-lg text-gray-400">/mois</span></div>
          <ul class="space-y-3 mb-8">
            <li>✓ 100,000 requêtes/mois</li>
            <li>✓ Tous les providers IA</li>
            <li>✓ Support prioritaire</li>
            <li>✓ API personnalisée</li>
          </ul>
          <a href="/contact" class="block text-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-lg transition-all">
            Choisir Pro
          </a>
        </div>

        <!-- Plan Enterprise -->
        <div class="bg-slate-800/50 rounded-lg p-8 border border-slate-700">
          <h3 class="text-2xl font-bold mb-4">Enterprise</h3>
          <div class="text-4xl font-bold mb-6">Sur mesure</div>
          <ul class="space-y-3 mb-8">
            <li>✓ Requêtes illimitées</li>
            <li>✓ Infrastructure dédiée</li>
            <li>✓ Support 24/7</li>
            <li>✓ SLA garanti</li>
          </ul>
          <a href="/contact" class="block text-center px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
            Contactez-nous
          </a>
        </div>
      </div>
    </div>
  </main>
</Layout>
```

**Fichier** : `apps/marketing/src/pages/contact.astro`
```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Contact - RAG-DZ">
  <main class="min-h-screen bg-slate-900 text-white">
    <div class="container mx-auto px-4 py-20">
      <h1 class="text-4xl md:text-6xl font-bold text-center mb-12">
        Contactez-nous
      </h1>
      <div class="max-w-2xl mx-auto">
        <form class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">Nom</label>
            <input type="text" class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Email</label>
            <input type="email" class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Message</label>
            <textarea rows="5" class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"></textarea>
          </div>
          <button type="submit" class="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-lg font-semibold transition-all">
            Envoyer
          </button>
        </form>
      </div>
    </div>
  </main>
</Layout>
```

---

### ÉTAPE 1.6 : Test final local
```bash
# Relancer dev server
npm run dev

# Tester toutes les pages :
# - http://localhost:4321/
# - http://localhost:4321/features
# - http://localhost:4321/pricing
# - http://localhost:4321/contact
```

---

## 📦 PHASE 2 : BUILD LOCAL (10 min)

### ÉTAPE 2.1 : Build production
```bash
# Dans apps/marketing/
npm run build
```
**✓ Vérifier** : Dossier `dist/` créé avec `index.html`, `_astro/`, etc.

### ÉTAPE 2.2 : Preview build
```bash
npm run preview
```
**→ Ouvre http://localhost:4321** et teste navigation

---

## 🚀 PHASE 3 : DÉPLOIEMENT VPS (30 min)

### ÉTAPE 3.1 : Créer dossier sur VPS
```bash
ssh root@46.224.3.125 "mkdir -p /opt/rag-dz-v2/marketing-dist"
```

### ÉTAPE 3.2 : Rsync dist vers VPS
```bash
# Depuis d:\IAFactory\rag-dz\apps\marketing
rsync -avz --delete dist/ root@46.224.3.125:/opt/rag-dz-v2/marketing-dist/
```

**✓ Vérifier deploy** :
```bash
ssh root@46.224.3.125 "ls -la /opt/rag-dz-v2/marketing-dist"
# Devrait lister : index.html, _astro/, features.html, pricing.html, contact.html
```

---

## 🔧 PHASE 4 : CONFIGURATION NGINX (20 min)

### ÉTAPE 4.1 : Backup config actuelle
```bash
ssh root@46.224.3.125 "cp /etc/nginx/sites-available/iafactoryalgeria /etc/nginx/sites-available/iafactoryalgeria.backup-$(date +%F)"
```

### ÉTAPE 4.2 : Éditer config Nginx (sur VPS)

**Connexion SSH** :
```bash
ssh root@46.224.3.125
```

**Éditer fichier** :
```bash
nano /etc/nginx/sites-available/iafactoryalgeria
```

**MODIFIER UNIQUEMENT LA LIGNE 40** (root) :

**AVANT** :
```nginx
root /opt/iafactory-rag-dz/apps;
```

**APRÈS** :
```nginx
root /opt/rag-dz-v2/marketing-dist;
```

**Sauvegarder** : `Ctrl+O`, `Enter`, `Ctrl+X`

### ÉTAPE 4.3 : Tester & Recharger Nginx
```bash
# Test syntaxe
nginx -t

# Si OK → Recharger
systemctl reload nginx

# Vérifier status
systemctl status nginx
```

---

## ✅ PHASE 5 : VALIDATION (10 min)

### ÉTAPE 5.1 : Test navigation

**Ouvre navigateur** :
- https://www.iafactoryalgeria.com/ (nouvelle landing Astro)
- https://www.iafactoryalgeria.com/features
- https://www.iafactoryalgeria.com/pricing
- https://www.iafactoryalgeria.com/contact

### ÉTAPE 5.2 : Vérifier apps existantes (IMPORTANT)

**NE DOIVENT PAS ÊTRE CASSÉES** :
- https://www.iafactoryalgeria.com/hub (portail Archon)
- https://www.iafactoryalgeria.com/archon/ (Archon UI)
- https://www.iafactoryalgeria.com/rag-ui/ (RAG interface)
- https://www.iafactoryalgeria.com/api/health (API backend)

### ÉTAPE 5.3 : Performance Lighthouse

**Chrome DevTools** : `F12` → Onglet Lighthouse → Run analysis
**Objectifs** :
- Performance : > 90
- SEO : > 95
- Accessibility : > 90
- Best Practices : > 90

---

## 🎯 COMMIT & PUSH (5 min)

```bash
cd d:\IAFactory\rag-dz

git add apps/marketing
git add .vscode/tasks.json
git add CLAUDE.md
git add JOUR_1_CHECKLIST.md
git add EXECUTION_JOUR_1.md

git commit -m "feat(marketing): déploiement Astro SSG v1

- Création apps/marketing avec Astro + Tailwind
- Pages : index, features, pricing, contact
- Build local + deploy VPS vers /opt/rag-dz-v2/marketing-dist
- Nginx root mis à jour (apps existantes intactes)
- Lighthouse score : 90+ (performance/SEO)

Closes #JOUR-1
"

git push origin main
```

---

## 🐛 TROUBLESHOOTING

### Erreur : `npm create astro` échoue
**Solution** : Vérifier Node.js version ≥ 18
```bash
node --version
# Si < 18 : installer via https://nodejs.org
```

### Erreur : `rsync: command not found` (Windows)
**Solution** : Utiliser Git Bash (installé avec Git for Windows)
```bash
# Ouvrir "Git Bash" au lieu de PowerShell/CMD
```

### Erreur : SSH demande password
**Solution** : Configurer clé SSH
```bash
ssh-copy-id root@46.224.3.125
```

### Erreur : Nginx 502 après reload
**Solution** : Vérifier que le dossier existe et a le bon contenu
```bash
ssh root@46.224.3.125 "ls -la /opt/rag-dz-v2/marketing-dist"
# Doit contenir index.html
```

### Erreur : Pages vides sur VPS
**Solution** : Vérifier permissions
```bash
ssh root@46.224.3.125 "chmod -R 755 /opt/rag-dz-v2/marketing-dist"
```

---

## ✅ CRITÈRES DE SUCCÈS JOUR 1

- [x] Structure `apps/marketing` créée avec Astro
- [x] 4 pages fonctionnelles (/, features, pricing, contact)
- [x] Build local réussi (`npm run build`)
- [x] Deploy VPS automatisé (rsync)
- [x] Nginx root pointe vers nouveau SSG
- [x] Apps existantes NON cassées (/hub, /archon, /rag-ui, /api)
- [x] Performance Lighthouse > 90
- [x] Responsive mobile/desktop OK
- [x] Commité dans git

---

## 🚀 JOUR 2 : Preview

**Objectifs Jour 2** (4-6h) :
1. Améliorer contenu (vraies sections features/pricing)
2. Ajouter i18n (fr/ar/en) avec fichiers JSON
3. Créer composants Header/Footer réutilisables
4. Ajouter page `/apps` (catalogue apps en JSON)
5. Optimiser images + SEO

---

**Durée totale Jour 1** : 4-6h
**Date création** : 2025-12-12
**Maintenu par** : IAFactory Team
