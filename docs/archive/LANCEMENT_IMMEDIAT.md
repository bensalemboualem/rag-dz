# 🚀 LANCEMENT IMMÉDIAT - 3 COMMANDES

**Date**: 16 Décembre 2025
**Action**: DÉPLOIEMENT VPS

---

## ⚡ DÉPLOIEMENT RAPIDE (3 étapes)

### ÉTAPE 1: Obtenir IP VPS (30 secondes)

```bash
# Se connecter au VPS
ssh user@your-vps-ip

# Obtenir l'IP publique
curl ifconfig.me

# Exemple résultat: 123.45.67.89
# ⬇️ COPIER CETTE IP
```

---

### ÉTAPE 2: Configurer Script (1 minute)

**Sur votre machine locale (Windows)**:

```bash
cd D:\IAFactory\rag-dz

# Éditer deploy-all-apps.sh
notepad deploy-all-apps.sh

# Ligne 13: Remplacer
VPS_HOST="your-vps-ip"

# Par (exemple):
VPS_HOST="123.45.67.89"

# Sauvegarder: Ctrl+S
```

**OU en une commande (PowerShell)**:
```powershell
(Get-Content deploy-all-apps.sh) -replace 'your-vps-ip', '123.45.67.89' | Set-Content deploy-all-apps.sh
```

---

### ÉTAPE 3: LANCER! (15-20 minutes)

```bash
# Dans Git Bash ou WSL
cd /d/IAFactory/rag-dz

# LANCEMENT
./deploy-all-apps.sh
```

**Le script va automatiquement**:
```
[1/5] 📦 Upload code (rsync)         → 2 min
[2/5] 🔧 Build 4 apps sur VPS        → 10 min
[3/5] 🌐 Config Nginx (4 vhosts)     → 1 min
[4/5] 🔒 SSL Let's Encrypt (4 certs) → 2 min
[5/5] 🚀 Démarrage PM2 (4 apps)      → 1 min

✅ TERMINÉ!
```

---

## 🎯 COMMANDES ALTERNATIVES

### Option A: Déploiement Complet Auto
```bash
./deploy-all-apps.sh
```

### Option B: Déploiement Manuel (si auto échoue)

**1. Upload**:
```bash
rsync -avz --exclude 'node_modules' --exclude '.next' \
  ./apps/agents-ia/ user@vps:/var/www/rag-dz/apps/agents-ia/

rsync -avz --exclude 'node_modules' --exclude '.next' \
  ./apps/can2025/ user@vps:/var/www/rag-dz/apps/can2025/

rsync -avz --exclude 'node_modules' --exclude '.next' \
  ./apps/news-dz/ user@vps:/var/www/rag-dz/apps/news-dz/

rsync -avz --exclude 'node_modules' --exclude '.next' \
  ./apps/sport-magazine/ user@vps:/var/www/rag-dz/apps/sport-magazine/

rsync -avz ./ecosystem.config.js user@vps:/var/www/rag-dz/
```

**2. Build sur VPS**:
```bash
ssh user@vps
cd /var/www/rag-dz

# Build chaque app
cd apps/agents-ia && npm install && npm run build
cd ../can2025 && npm install && npm run build
cd ../news-dz && npm install && npm run build
cd ../sport-magazine && npm install && npm run build
```

**3. PM2**:
```bash
cd /var/www/rag-dz
pm2 delete all || true
pm2 start ecosystem.config.js
pm2 save
```

**4. Nginx** (si pas déjà fait):
```bash
# Voir GUIDE_DEPLOIEMENT_RAPIDE.md section "ÉTAPE 3: Nginx Configuration"
```

---

## ⚠️ PRÉREQUIS VPS

**Vérifier avant lancement**:

```bash
ssh user@vps

# 1. Node.js 18+
node --version  # doit être v18.x.x+

# 2. PM2
pm2 --version   # doit être installé

# 3. Nginx
nginx -v        # doit être installé

# 4. Dossier
ls -la /var/www/rag-dz  # doit exister avec bonnes permissions
```

**Si manquant, installer**:
```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2
sudo npm install -g pm2

# Nginx
sudo apt-get install -y nginx

# Dossier
sudo mkdir -p /var/www/rag-dz
sudo chown -R $USER:$USER /var/www/rag-dz
```

---

## ✅ APRÈS DÉPLOIEMENT

### Vérifier PM2
```bash
ssh user@vps
pm2 status

# Doit afficher 4 apps 'online':
# agents-ia, can2025, news-dz, sport-magazine
```

### Tester URLs
```bash
# HTTP (avant SSL)
curl http://localhost:3001  # agents-ia
curl http://localhost:3002  # can2025
curl http://localhost:3003  # news-dz
curl http://localhost:3004  # sport-magazine

# HTTPS (après SSL)
curl https://agents.iafactory.dz
curl https://can2025.iafactory.dz
curl https://news.iafactory.dz
curl https://sport.iafactory.dz
```

### Browser
```
✅ https://agents.iafactory.dz
✅ https://can2025.iafactory.dz
✅ https://news.iafactory.dz
✅ https://sport.iafactory.dz
```

---

## 🔧 TROUBLESHOOTING RAPIDE

### Erreur SSH
```bash
# Vérifier connexion
ssh -v user@vps

# Vérifier clés SSH
ls -la ~/.ssh/
```

### Erreur rsync
```bash
# Installer rsync sur Windows (Git Bash inclus)
# Ou utiliser SCP:
scp -r apps/agents-ia user@vps:/var/www/rag-dz/apps/
```

### Build échoue
```bash
# Sur VPS, nettoyer et rebuild
ssh user@vps
cd /var/www/rag-dz/apps/agents-ia
rm -rf node_modules .next
npm install
npm run build
```

### PM2 errored
```bash
# Voir logs
pm2 logs agents-ia --err

# Redémarrer
pm2 restart agents-ia
```

---

## 📊 TIMELINE LANCEMENT

```
Maintenant:   Configuration VPS_HOST (1 min)
↓
+1 min:       Lancement ./deploy-all-apps.sh
↓
+3 min:       Upload code (rsync)
↓
+13 min:      Builds terminés
↓
+14 min:      Nginx configuré
↓
+16 min:      SSL installés
↓
+17 min:      PM2 démarré
↓
+20 min:      ✅ 4 APPS EN LIGNE!
```

---

## 🎉 SUCCÈS = 4 URLs ACTIVES

```
🤖 https://agents.iafactory.dz    → 5 AI Agents
⚽ https://can2025.iafactory.dz   → PWA CAN 2025
📰 https://news.iafactory.dz      → News Algérie
🏆 https://sport.iafactory.dz     → Magazine Sport
```

---

**PRÊT À LANCER!** 🚀

**Commande**: `./deploy-all-apps.sh`
