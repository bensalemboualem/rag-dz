# 🌐 DNS CONFIGURATION - iafactoryalgeria.com

**Domaine**: iafactoryalgeria.com
**Date**: 16 Décembre 2025
**Apps**: 5

---

## 📋 6 ENREGISTREMENTS DNS À CRÉER

```dns
Type    Nom                             Valeur          TTL
─────────────────────────────────────────────────────────────
A       iafactoryalgeria.com            [IP_VPS]       3600
A       www.iafactoryalgeria.com        [IP_VPS]       3600
A       agents.iafactoryalgeria.com     [IP_VPS]       3600
A       can2025.iafactoryalgeria.com    [IP_VPS]       3600
A       news.iafactoryalgeria.com       [IP_VPS]       3600
A       sport.iafactoryalgeria.com      [IP_VPS]       3600
```

---

## 🎯 MAPPING APPS → DOMAINES

| Domaine | App | Type | Port |
|---------|-----|------|------|
| **www.iafactoryalgeria.com** | Landing SaaS | Static | - |
| **agents.iafactoryalgeria.com** | AI Agents (5) | Next.js | 3001 |
| **can2025.iafactoryalgeria.com** | CAN 2025 PWA | Next.js | 3002 |
| **news.iafactoryalgeria.com** | News Algérie | Next.js | 3003 |
| **sport.iafactoryalgeria.com** | Sport Magazine | Next.js | 3004 |

---

## ⚡ CONFIGURATION RAPIDE

### 1. Obtenir IP VPS
```bash
ssh root@votre-vps
curl ifconfig.me

# Exemple: 135.181.123.45
```

### 2. Dans Votre Registrar

**Exemples par registrar**:

#### Namecheap
```
1. Dashboard → Domain List → iafactoryalgeria.com → Manage
2. Advanced DNS → Add New Record
3. Ajouter 6 enregistrements A:

   Type: A Record
   Host: @                  Value: [IP_VPS]
   Host: www                Value: [IP_VPS]
   Host: agents             Value: [IP_VPS]
   Host: can2025            Value: [IP_VPS]
   Host: news               Value: [IP_VPS]
   Host: sport              Value: [IP_VPS]
```

#### GoDaddy
```
1. My Products → DNS → iafactoryalgeria.com
2. Add Record (×6):

   Type: A
   Name: @, www, agents, can2025, news, sport
   Value: [IP_VPS]
   TTL: 1 Hour
```

#### Cloudflare (Recommandé)
```
1. Dashboard → iafactoryalgeria.com → DNS → Records
2. Add Record (×6):

   Type: A
   Name: @, www, agents, can2025, news, sport
   IPv4 address: [IP_VPS]
   Proxy status: Proxied (orange cloud) ✅
   TTL: Auto
```

**Avantages Cloudflare**:
- ✅ SSL automatique (pas besoin certbot)
- ✅ CDN global (rapide partout)
- ✅ DDoS protection
- ✅ Cache intelligent
- ✅ Analytics gratuits

---

## ⏱️ PROPAGATION DNS

### Durée Attendue
```
Local:          5-15 minutes
Régional:       30-60 minutes
Global:         2-6 heures
Maximum:        24-48 heures
```

### Vérifier la Propagation

#### En Ligne (Recommandé)
- https://dnschecker.org
- Entrer: `agents.iafactoryalgeria.com`
- Type: A
- Voir checkmarks verts globalement ✅

#### Terminal (Local)
```bash
# Windows
nslookup agents.iafactoryalgeria.com

# Linux/Mac
dig agents.iafactoryalgeria.com +short

# Résultat attendu: [IP_VPS]
```

---

## 🚀 APRÈS PROPAGATION DNS

### Lancer le Déploiement
```bash
cd D:\IAFactory\rag-dz

# Configurer IP (une fois)
.\setup-vps-ip.ps1

# Déployer tout
./deploy-all-apps.sh
```

### Durée: ~20 minutes
```
[1/5] Upload 5 apps
[2/5] Build 4 Next.js
[3/5] Config 5 Nginx vhosts
[4/5] SSL 6 domaines
[5/5] PM2 start 4 apps
```

---

## ✅ VÉRIFICATION FINALE

### Tester les URLs
```bash
# Commande unique
curl -I https://www.iafactoryalgeria.com
curl -I https://agents.iafactoryalgeria.com
curl -I https://can2025.iafactoryalgeria.com
curl -I https://news.iafactoryalgeria.com
curl -I https://sport.iafactoryalgeria.com

# Tous doivent retourner: HTTP/2 200
```

### Browser
```
✅ https://www.iafactoryalgeria.com
✅ https://agents.iafactoryalgeria.com
✅ https://can2025.iafactoryalgeria.com
✅ https://news.iafactoryalgeria.com
✅ https://sport.iafactoryalgeria.com
```

---

## 📊 RÉCAPITULATIF

### Domaines (6)
```
iafactoryalgeria.com          → Landing
www.iafactoryalgeria.com      → Landing (www)
agents.iafactoryalgeria.com   → AI Agents
can2025.iafactoryalgeria.com  → CAN 2025
news.iafactoryalgeria.com     → News
sport.iafactoryalgeria.com    → Sport Magazine
```

### Apps (5)
```
Landing SaaS       → Static HTML (Nginx direct)
AI Agents          → Next.js (PM2 port 3001)
CAN 2025 PWA       → Next.js (PM2 port 3002)
News DZ            → Next.js (PM2 port 3003)
Sport Magazine     → Next.js (PM2 port 3004)
```

### Infrastructure
```
Nginx vhosts:     5
SSL certificats:  5 (6 domaines)
PM2 processes:    4
```

---

## 🎉 PRÊT!

**Fichiers mis à jour**:
- ✅ deploy-all-apps.sh
- ✅ .env.production.example
- ✅ ecosystem.config.js

**Actions requises**:
1. Configurer 6 DNS records
2. Attendre propagation (2-6h)
3. Lancer déploiement

**Résultat**: 5 sites en ligne avec HTTPS! 🚀

---

**Domaine**: www.iafactoryalgeria.com
**Status**: Configuration DNS requise
**Déploiement**: Ready to launch
