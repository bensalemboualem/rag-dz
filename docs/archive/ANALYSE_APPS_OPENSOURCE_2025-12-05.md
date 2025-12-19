# 📊 ANALYSE APPS OPEN SOURCE - IAFactory Algeria

**Date**: 5 Décembre 2025 09:30 UTC
**Serveur**: iafactorysuisse (46.224.3.125)

---

## 🔓 APPS OPEN SOURCE CLONÉES

### 1. **Bolt.diy** (StackBlitz)
- **Source**: https://github.com/stackblitz/bolt.diy
- **Type**: AI Code Editor / Full-stack web development
- **Dossier**: `/opt/iafactory-rag-dz/bolt-diy`
- **Status**: ⏸️ **EN ATTENTE** (crash au démarrage)
- **Port**: 5173 (fermé)
- **URL prévue**: https://bolt.iafactoryalgeria.com
- **Sous-domaine**: ✅ DNS et SSL déjà configurés
- **Action requise**: Démarrage via console Hetzner (voir `HETZNER_CONSOLE_FIX_BOLT.txt`)

**Fonctionnement**:
- Éditeur de code IA full-stack
- Génération d'apps web avec Claude/GPT
- Dev server Vite avec Node.js v20

---

### 2. **BMAD (BMad Method)**
- **Source**: https://github.com/bmad-code-org/BMAD-METHOD
- **Type**: Universal Human-AI Collaboration Platform
- **Dossier**: `/opt/iafactory-rag-dz/bmad`
- **Status**: ✅ **ACTIF** (container: `iaf-bmad-prod`)
- **Container**: iaf-bmad-prod
- **URL actuelle**: Servie via landing page
- **Sous-domaine recommandé**: ⚠️ **OUI** - `bmad.iafactoryalgeria.com`

**Fonctionnement**:
- Plateforme de collaboration IA
- Workflows agents IA
- Version Alpha v6 (near-beta quality)

**Action suggérée**: Créer sous-domaine dédié professionnel

---

## 🏢 APPS CUSTOM IAFactory (27 containers actifs)

Ces apps **NE SONT PAS** open source - ce sont vos applications custom:

### Applications Backend + Frontend (18 services)

| App | Backend Container | Frontend Container | Status |
|-----|-------------------|-------------------|--------|
| **Billing** | iaf-billing-prod | iaf-billing-ui-prod | ✅ Running |
| **CRM IA** | iaf-crm-ia-prod | iaf-crm-ia-ui-prod | ✅ Running |
| **PME Copilot** | iaf-pme-copilot-prod | iaf-pme-copilot-ui-prod | ✅ Running |
| **Startup DZ** | iaf-startupdz-prod | iaf-startupdz-ui-prod | ✅ Running |
| **Fiscal Assistant** | iaf-fiscal-assistant-prod | iaf-fiscal-frontend-prod | ✅ Running |
| **Legal Assistant** | iaf-legal-assistant-prod | iaf-legal-frontend-prod | ✅ Running |
| **Voice Assistant** | iaf-voice-assistant-prod | iaf-voice-frontend-prod | ✅ Running |
| **Backend API** | iaf-backend-prod | - | ✅ Running |
| **RAG** | iaf-rag-prod | - | ✅ Running |

### Applications Spécialisées (9 services)

| App | Container | Type | Status |
|-----|-----------|------|--------|
| **Council** | iaf-council-prod | AI Council | ✅ Running |
| **Creative Studio** | iaf-creative-prod | Création contenu | ✅ Running |
| **Data DZ** | iaf-data-dz-prod | Données Algérie | ✅ Running |
| **Developer** | iaf-developer-prod | Outils dev | ✅ Running |
| **DZ Connectors** | iaf-dz-connectors-prod | Connecteurs | ✅ Running |
| **Ithy** | iaf-ithy-prod | Assistant Ithy | ✅ Running |
| **Notebook LM** | iaf-notebook-prod | Notebook IA | ✅ Running |
| **Dashboard** | iaf-dashboard-prod | Tableau de bord | ✅ Running |
| **n8n** | iaf-n8n-prod | Automation | ✅ Running |
| **Landing** | iaf-landing-prod | Site principal | ✅ Running |

**Total**: 27 containers prod actifs
**Ces apps fonctionnent**: ✅ Toutes opérationnelles
**Besoin sous-domaines**: ❌ NON - Servies via reverse proxy Nginx

---

## 📁 APPS STATIQUES (70 frontends HTML)

**Localisation**: `/opt/iafactory-rag-dz/apps/`
**Total**: 70 apps avec `index.html`

**Exemples**:
- apps/agri-dz/index.html
- apps/agroalimentaire-dz/index.html
- apps/ai-searcher/index.html
- apps/btp-dz/index.html
- apps/clinique-dz/index.html
- apps/commerce-dz/index.html
- apps/ecommerce-dz/index.html
- apps/pharma-dz/index.html
- apps/transport-dz/index.html
- ... (61 autres)

**Fonctionnement**:
- Pages HTML statiques
- Servies via Nginx depuis landing page
- Accès: `https://www.iafactoryalgeria.com/apps/{nom-app}/`

**Besoin sous-domaines**: ❌ **NON**
- Ce sont des pages statiques simples
- Landing page les sert correctement
- Pas de backend séparé
- Pas de complexité justifiant un sous-domaine

---

## 🎯 RECOMMANDATIONS SOUS-DOMAINES

### ✅ À CRÉER (Apps open source à isoler)

| App | Sous-domaine | Raison | Priorité |
|-----|-------------|--------|----------|
| **Bolt.diy** | bolt.iafactoryalgeria.com | ✅ Déjà configuré (SSL+DNS OK) | 🔴 Haute |
| **BMAD** | bmad.iafactoryalgeria.com | App complexe, mérite isolation | 🟡 Moyenne |

### ❌ PAS NÉCESSAIRE

1. **27 apps custom IAFactory**: Déjà gérées par reverse proxy Nginx
2. **70 apps statiques HTML**: Trop simples, landing page suffit

---

## 📋 ACTIONS RECOMMANDÉES

### Priorité 1: Bolt.diy
```bash
# Action: Exécuter commandes console Hetzner
# Fichier: HETZNER_CONSOLE_FIX_BOLT.txt
# DNS: ✅ Déjà créé
# SSL: ✅ Déjà configuré
# Temps: 5 minutes
```

### Priorité 2: BMAD (Optionnel)
```bash
# Si vous voulez exposer BMAD professionnellement:

# 1. Créer DNS
Type: A
Nom: bmad
Pointe vers: 46.224.3.125
TTL: 300

# 2. Obtenir SSL
certbot --nginx -d bmad.iafactoryalgeria.com

# 3. Configurer Nginx
# Proxy vers container iaf-bmad-prod
```

---

## 🏆 CONCLUSION

### Apps Open Source
- **2 apps** clonées: Bolt.diy, BMAD
- **1 active**: BMAD (container running)
- **1 en attente**: Bolt.diy (nécessite fix console)

### Apps Custom IAFactory
- **27 containers**: ✅ Tous actifs et opérationnels
- **Pas open source**: Développement IAFactory custom
- **Sous-domaines**: ❌ Pas nécessaire (reverse proxy OK)

### Apps Statiques
- **70 apps**: Pages HTML simples
- **Servies par**: Landing page Nginx
- **Sous-domaines**: ❌ Pas nécessaire (trop simples)

### Recommandation Finale
**Créer sous-domaines uniquement pour**:
1. ✅ Bolt.diy (déjà configuré, juste à démarrer)
2. ⚠️ BMAD (optionnel, si exposition publique souhaitée)

**Ne PAS créer** de sous-domaines pour les 70 apps statiques ni les 27 apps custom (déjà bien gérées).

---

*Généré le 5 Décembre 2025 à 09:30 UTC*
*Infrastructure IAFactory Algeria*
