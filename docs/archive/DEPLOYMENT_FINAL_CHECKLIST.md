# 🚀 CHECKLIST DÉPLOIEMENT FINAL - 4 APPS

**Date**: 16 Décembre 2025
**Apps**: AI Agents, CAN 2025, News DZ, Sport Magazine
**Status**: READY TO DEPLOY

---

## ✅ PRÉ-REQUIS COMPLÉTÉS

### Infrastructure Locale
- [x] **4 apps buildées** (0 erreurs)
  - agents-ia: Build ✅
  - can2025: Build ✅
  - news-dz: Build ✅
  - sport-magazine: Build ✅

### Configuration
- [x] **Icônes PWA** (Étape 1)
  - icon-192x192.png ✅
  - icon-512x512.png ✅
  - apple-touch-icon.png ✅

- [x] **Clés VAPID** (Étape 2)
  - Public Key ✅
  - Private Key ✅
  - VAPID_KEYS_SECURE.txt ✅

- [x] **Scripts Déploiement**
  - deploy-all-apps.sh ✅
  - ecosystem.config.js ✅
  - .env.production.example ✅

### Documentation
- [x] GUIDE_DEPLOIEMENT_RAPIDE.md
- [x] DNS_CONFIGURATION_GUIDE.md
- [x] VERIFICATION_FINALE_2X_2025-12-16.md
- [x] SESSION_MARATHON_COMPLETE_2025-12-16.md

---

## 📋 AVANT DÉPLOIEMENT

### 1. VPS Prérequis

**Se connecter au VPS**:
```bash
ssh user@your-vps-ip
```

**Vérifier installations**:
```bash
# Node.js 18+
node --version  # v18.x.x ou plus

# PM2
pm2 --version   # 5.x.x ou plus

# Nginx
nginx -v        # 1.18+ ou plus

# Certbot
certbot --version  # 1.x.x ou plus
```

**Si manquant, installer**:
```bash
# Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2
sudo npm install -g pm2

# Nginx
sudo apt-get update
sudo apt-get install -y nginx

# Certbot
sudo apt-get install -y certbot python3-certbot-nginx
```

### 2. Créer Dossier VPS

```bash
# Créer répertoire apps
sudo mkdir -p /var/www/rag-dz
sudo chown -R $USER:$USER /var/www/rag-dz

# Vérifier
ls -la /var/www/
```

### 3. Configurer .env.production sur VPS

```bash
# Se connecter au VPS
ssh user@vps

# Créer .env.production
cd /var/www/rag-dz
nano .env.production
```

**Contenu** (copier depuis `.env.production.example`):
```bash
# ==========================================
# AI AGENTS (Port 3001)
# ==========================================
ANTHROPIC_API_KEY=sk-ant-api03-[VOTRE_CLE]
NODE_ENV=production
PORT=3001
NEXT_PUBLIC_APP_URL=https://agents.iafactory.dz

# ==========================================
# CAN 2025 (Port 3002)
# ==========================================
NEXT_PUBLIC_APP_URL=https://can2025.iafactory.dz

# Push Notifications
VAPID_PUBLIC_KEY=BBIvhU_j5McTgEcfGRXOf_GbmTKpSTqIVIqtQ0-nviAjlc8P0K_YAu79wSYGbj0TCta82Z4hbklPc0uysaK2RM4
VAPID_PRIVATE_KEY=GZdbwMHW_bQoQRRmfdGLjTz_61hLiyWuOCE4DBTk26s
VAPID_SUBJECT=mailto:admin@iafactory.dz

# ==========================================
# NEWS DZ (Port 3003)
# ==========================================
NEXT_PUBLIC_APP_URL=https://news.iafactory.dz
RSS_TIMEOUT=10000

# ==========================================
# SPORT MAGAZINE (Port 3004)
# ==========================================
NEXT_PUBLIC_APP_URL=https://sport.iafactory.dz
```

**Sauvegarder**: `Ctrl+X`, `Y`, `Enter`

### 4. DNS Propagation

**Vérifier que DNS a propagé**:
```bash
# Test depuis machine locale
nslookup agents.iafactory.dz
nslookup can2025.iafactory.dz
nslookup news.iafactory.dz
nslookup sport.iafactory.dz

# Tous doivent retourner l'IP VPS
```

**Ou via web**:
- https://dnschecker.org
- Tous checkmarks verts ✅

### 5. Configurer deploy-all-apps.sh

**Éditer le script**:
```bash
nano deploy-all-apps.sh
```

**Modifier ligne 13**:
```bash
# AVANT:
VPS_HOST="your-vps-ip"

# APRÈS:
VPS_HOST="123.45.67.89"  # Votre vraie IP VPS
```

**Sauvegarder** et vérifier exécutable:
```bash
chmod +x deploy-all-apps.sh
```

---

## 🚀 DÉPLOIEMENT

### Méthode 1: Script Automatique (Recommandé)

**Depuis votre machine locale**:
```bash
cd D:\IAFactory\rag-dz

# Lancer le déploiement complet
./deploy-all-apps.sh
```

**Le script va automatiquement**:
1. ✅ Upload code (rsync) → ~2 min
2. ✅ Build 4 apps sur VPS → ~10 min
3. ✅ Config Nginx (4 vhosts) → ~1 min
4. ✅ SSL Let's Encrypt (4 certs) → ~2 min
5. ✅ Démarrage PM2 (4 apps) → ~1 min

**Durée totale**: ~15-20 minutes

### Méthode 2: Manuelle (Si script échoue)

Voir [GUIDE_DEPLOIEMENT_RAPIDE.md](./GUIDE_DEPLOIEMENT_RAPIDE.md) - Méthode 2

---

## ✅ VÉRIFICATIONS POST-DÉPLOIEMENT

### 1. Vérifier PM2

```bash
# Se connecter au VPS
ssh user@vps

# Status apps
pm2 status

# Devrait afficher:
# ┌─────┬──────────────────┬─────────┬─────────┐
# │ id  │ name             │ status  │ cpu     │
# ├─────┼──────────────────┼─────────┼─────────┤
# │ 0   │ agents-ia        │ online  │ 0%      │
# │ 1   │ can2025          │ online  │ 0%      │
# │ 2   │ news-dz          │ online  │ 0%      │
# │ 3   │ sport-magazine   │ online  │ 0%      │
# └─────┴──────────────────┴─────────┴─────────┘
```

**Si erreurs**:
```bash
# Voir logs
pm2 logs agents-ia
pm2 logs can2025 --lines 50

# Redémarrer app
pm2 restart agents-ia
```

### 2. Tester Nginx

```bash
# Test config
sudo nginx -t

# Devrait afficher:
# nginx: configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# Recharger si besoin
sudo systemctl reload nginx
```

### 3. Vérifier SSL

```bash
# Lister certificats
sudo certbot certificates

# Devrait montrer 4 certificats:
# agents.iafactory.dz - Valid
# can2025.iafactory.dz - Valid
# news.iafactory.dz - Valid
# sport.iafactory.dz - Valid
```

### 4. Tester URLs

**Depuis browser**:
- ✅ https://agents.iafactory.dz → 5 AI Agents
- ✅ https://can2025.iafactory.dz → PWA CAN 2025
- ✅ https://news.iafactory.dz → Agrégateur News
- ✅ https://sport.iafactory.dz → Magazine Sport

**Depuis terminal**:
```bash
# Vérifier status HTTP
curl -I https://agents.iafactory.dz
curl -I https://can2025.iafactory.dz
curl -I https://news.iafactory.dz
curl -I https://sport.iafactory.dz

# Tous doivent retourner: HTTP/2 200
```

### 5. Tester PWA (CAN 2025)

**Mobile**:
1. Ouvrir https://can2025.iafactory.dz dans Chrome
2. Bannière "Ajouter à l'écran d'accueil" doit apparaître
3. Installer PWA
4. Autoriser notifications push
5. Tester navigation offline

**Desktop**:
1. Ouvrir dans Chrome/Edge
2. Icône "Installer" dans barre URL
3. Installer app
4. Tester window standalone

---

## 📊 MONITORING

### PM2 Monitoring

```bash
# Temps réel
pm2 monit

# Logs live
pm2 logs

# Métriques
pm2 show agents-ia
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log

# App-specific logs
sudo tail -f /var/log/nginx/agents-error.log
sudo tail -f /var/log/nginx/can2025-error.log
```

### Ressources Serveur

```bash
# CPU/RAM
htop

# Espace disque
df -h

# Processus Node
ps aux | grep node
```

---

## 🔧 MAINTENANCE

### Redémarrer une App

```bash
# Restart spécifique
pm2 restart agents-ia

# Restart toutes
pm2 restart all

# Stop puis start
pm2 stop agents-ia
pm2 start agents-ia
```

### Mettre à Jour une App

```bash
# 1. Sur machine locale, rebuild
cd apps/agents-ia
npm run build

# 2. Upload nouveau code
rsync -avz --exclude 'node_modules' --exclude '.next' \
  ./apps/agents-ia/ user@vps:/var/www/rag-dz/apps/agents-ia/

# 3. Sur VPS, rebuild
ssh user@vps
cd /var/www/rag-dz/apps/agents-ia
npm install
npm run build

# 4. Redémarrer
pm2 restart agents-ia
```

### Renouveler SSL

```bash
# Test renouvellement
sudo certbot renew --dry-run

# Renouvellement réel (auto tous les 60 jours)
sudo certbot renew
```

### Backup

```bash
# Backup code
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/rag-dz

# Backup .env
cp /var/www/rag-dz/.env.production ~/backup-env-$(date +%Y%m%d)

# Backup Nginx configs
sudo tar -czf nginx-backup-$(date +%Y%m%d).tar.gz /etc/nginx/sites-available
```

---

## ⚠️ TROUBLESHOOTING

### App ne démarre pas (errored)

```bash
# 1. Voir logs détaillés
pm2 logs app-name --err --lines 100

# 2. Erreurs courantes:
# - Port déjà utilisé: sudo netstat -tulpn | grep 3001
# - .env manquant: ls -la /var/www/rag-dz/.env.production
# - Dépendances manquantes: cd app && npm install

# 3. Restart
pm2 delete app-name
pm2 start ecosystem.config.js --only app-name
```

### Erreur 502 Bad Gateway

```bash
# 1. Vérifier app PM2
pm2 status  # App doit être 'online'

# 2. Vérifier port écoute
sudo netstat -tulpn | grep :3001

# 3. Test direct
curl http://localhost:3001

# 4. Vérifier config Nginx
sudo nginx -t
```

### Erreur 404 Not Found

```bash
# 1. Vérifier vhost Nginx
ls -la /etc/nginx/sites-enabled/

# 2. Vérifier server_name
sudo cat /etc/nginx/sites-available/agents.iafactory.dz | grep server_name

# 3. Reload Nginx
sudo nginx -t && sudo systemctl reload nginx
```

### SSL ne fonctionne pas

```bash
# 1. Vérifier certificats
sudo certbot certificates

# 2. Refaire SSL
sudo certbot --nginx -d agents.iafactory.dz --force-renewal

# 3. Test
curl -I https://agents.iafactory.dz
```

### Build échoue sur VPS

```bash
# 1. Nettoyer
cd /var/www/rag-dz/apps/app-name
rm -rf node_modules .next package-lock.json

# 2. Reinstall
npm install

# 3. Rebuild
npm run build

# 4. Si erreur mémoire
# Augmenter swap ou build en local puis rsync
```

---

## 🎯 CHECKLIST FINALE

### Avant Lancement
- [ ] VPS configuré (Node, PM2, Nginx, Certbot)
- [ ] Dossier /var/www/rag-dz créé
- [ ] .env.production créé sur VPS avec API keys
- [ ] DNS propagé (4 domaines → IP VPS)
- [ ] deploy-all-apps.sh édité (VPS_HOST)

### Déploiement
- [ ] Script lancé: `./deploy-all-apps.sh`
- [ ] Upload réussi (rsync)
- [ ] 4 builds réussis
- [ ] Nginx configuré (4 vhosts)
- [ ] SSL installé (4 certificats)
- [ ] PM2 démarré (4 apps online)

### Vérification
- [ ] pm2 status → 4 apps online
- [ ] nginx -t → OK
- [ ] certbot certificates → 4 valid
- [ ] https://agents.iafactory.dz → 200
- [ ] https://can2025.iafactory.dz → 200
- [ ] https://news.iafactory.dz → 200
- [ ] https://sport.iafactory.dz → 200

### Tests Fonctionnels
- [ ] AI Agents: Chat fonctionne (5 agents)
- [ ] CAN 2025: Countdown OK, PWA installable
- [ ] News DZ: 20+ sources chargent
- [ ] Sport Magazine: Articles s'affichent

### Monitoring
- [ ] pm2 save
- [ ] pm2 startup configuré
- [ ] Logs accessibles (pm2 logs, nginx)
- [ ] Auto-restart activé

---

## 📈 MÉTRIQUES DE SUCCÈS

### Performance
- ✅ Time to First Byte (TTFB) < 500ms
- ✅ Largest Contentful Paint (LCP) < 2.5s
- ✅ First Input Delay (FID) < 100ms

### Disponibilité
- ✅ Uptime > 99.9%
- ✅ Auto-restart PM2
- ✅ SSL renew automatique

### SEO
- ✅ HTTPS activé
- ✅ PWA manifest valide
- ✅ Service Worker actif
- ✅ Meta tags présents

---

## 🎉 SUCCÈS!

**Si toutes les vérifications passent**:

```
✅ 4 APPS EN PRODUCTION

🤖 AI Agents IA:      https://agents.iafactory.dz
⚽ CAN 2025 PWA:       https://can2025.iafactory.dz
📰 News DZ:           https://news.iafactory.dz
🏆 Sport Magazine:    https://sport.iafactory.dz

🚀 LANCÉ AVEC SUCCÈS!
```

---

## 📞 SUPPORT

### Commandes Utiles
```bash
# Status global
pm2 status && sudo nginx -t

# Logs toutes apps
pm2 logs --lines 50

# Restart complet
pm2 restart all && sudo systemctl reload nginx

# Monitoring ressources
htop
```

### Documentation
- [GUIDE_DEPLOIEMENT_RAPIDE.md](./GUIDE_DEPLOIEMENT_RAPIDE.md)
- [DNS_CONFIGURATION_GUIDE.md](./DNS_CONFIGURATION_GUIDE.md)
- [VERIFICATION_FINALE_2X_2025-12-16.md](./VERIFICATION_FINALE_2X_2025-12-16.md)

---

**Checklist Déploiement Final** ✅
**Prêt pour lancement production** 🚀

**IA Factory - Décembre 2025**
