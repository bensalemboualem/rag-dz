# 🚀 GUIDE DÉPLOIEMENT RAPIDE VPS

## ⚡ DÉPLOIEMENT EN 5 ÉTAPES

### PRÉ-REQUIS VPS

**Installer d'abord sur le VPS**:
```bash
# 1. Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. PM2
sudo npm install -g pm2

# 3. Nginx
sudo apt-get install -y nginx

# 4. Certbot (SSL)
sudo apt-get install -y certbot python3-certbot-nginx

# 5. Créer dossier
sudo mkdir -p /var/www/rag-dz
sudo chown -R $USER:$USER /var/www/rag-dz
```

---

## 🚀 MÉTHODE 1: SCRIPT AUTOMATIQUE (RECOMMANDÉ)

### 1. Configurer le script

Éditer `deploy-all-apps.sh`:
```bash
VPS_USER="root"              # Ton user SSH
VPS_HOST="123.456.789.10"    # IP de ton VPS
```

### 2. Configurer les variables d'environnement

Sur le **VPS**, créer `/var/www/rag-dz/.env.production`:
```bash
ssh user@vps
cd /var/www/rag-dz
nano .env.production
```

Copier depuis `.env.production.example` et remplir:
```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### 3. Lancer le déploiement

**Sur ta machine locale**:
```bash
cd D:\IAFactory\rag-dz

# Rendre le script exécutable
chmod +x deploy-all-apps.sh

# Lancer le déploiement
./deploy-all-apps.sh
```

Le script va automatiquement:
- ✅ Upload le code (rsync)
- ✅ Build les 4 apps
- ✅ Configurer Nginx (4 vhosts)
- ✅ Installer SSL (Let's Encrypt)
- ✅ Démarrer PM2

**Durée**: ~15-20 minutes

---

## 🔧 MÉTHODE 2: MANUELLE (ÉTAPE PAR ÉTAPE)

### ÉTAPE 1: Upload Code

```bash
# Depuis ta machine
cd D:\IAFactory\rag-dz

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

### ÉTAPE 2: Build sur VPS

```bash
# Connecte-toi au VPS
ssh user@vps
cd /var/www/rag-dz

# Build AI Agents
cd apps/agents-ia
npm install
npm run build

# Build CAN 2025
cd ../can2025
npm install
npm run build

# Build News DZ
cd ../news-dz
npm install
npm run build

# Build Sport Magazine
cd ../sport-magazine
npm install
npm run build
```

### ÉTAPE 3: Nginx Configuration

```bash
# Sur le VPS
sudo nano /etc/nginx/sites-available/agents.iafactory.dz
```

Copier cette config:
```nginx
server {
    listen 80;
    server_name agents.iafactory.dz;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Répéter pour:
- `can2025.iafactory.dz` (port 3002)
- `news.iafactory.dz` (port 3003)
- `sport.iafactory.dz` (port 3004)

**Activer les sites**:
```bash
sudo ln -s /etc/nginx/sites-available/agents.iafactory.dz /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/can2025.iafactory.dz /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/news.iafactory.dz /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/sport.iafactory.dz /etc/nginx/sites-enabled/

# Tester et recharger
sudo nginx -t
sudo systemctl reload nginx
```

### ÉTAPE 4: SSL Certificates

```bash
sudo certbot --nginx -d agents.iafactory.dz
sudo certbot --nginx -d can2025.iafactory.dz
sudo certbot --nginx -d news.iafactory.dz
sudo certbot --nginx -d sport.iafactory.dz
```

### ÉTAPE 5: PM2 Start

```bash
cd /var/www/rag-dz
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Suivre les instructions affichées
```

---

## 🔍 VÉRIFICATION

### Checker PM2
```bash
pm2 status
pm2 logs
pm2 monit
```

### Tester les URLs
```bash
curl https://agents.iafactory.dz
curl https://can2025.iafactory.dz
curl https://news.iafactory.dz
curl https://sport.iafactory.dz
```

### Voir les logs Nginx
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🛠️ MAINTENANCE

### Redémarrer une app
```bash
pm2 restart agents-ia
pm2 restart can2025
pm2 restart news-dz
pm2 restart sport-magazine
```

### Mettre à jour une app
```bash
# 1. Upload nouveau code
rsync -avz --exclude 'node_modules' --exclude '.next' \
  ./apps/agents-ia/ user@vps:/var/www/rag-dz/apps/agents-ia/

# 2. Rebuild sur VPS
ssh user@vps
cd /var/www/rag-dz/apps/agents-ia
npm install
npm run build

# 3. Redémarrer PM2
pm2 restart agents-ia
```

### Voir les logs d'une app
```bash
pm2 logs agents-ia
pm2 logs can2025 --lines 100
```

### Monitoring ressources
```bash
pm2 monit            # Interface interactive
htop                 # CPU/RAM général
df -h                # Espace disque
```

---

## ⚠️ TROUBLESHOOTING

### App ne démarre pas
```bash
# Voir les logs
pm2 logs [app-name] --err

# Vérifier le port est libre
sudo netstat -tulpn | grep 3001

# Restart
pm2 restart [app-name]
```

### Erreur Nginx
```bash
# Tester la config
sudo nginx -t

# Voir les logs
sudo tail -f /var/log/nginx/error.log
```

### SSL ne marche pas
```bash
# Renouveler les certificats
sudo certbot renew

# Tester le renouvellement
sudo certbot renew --dry-run
```

### Build échoue
```bash
# Nettoyer et rebuild
cd /var/www/rag-dz/apps/[app-name]
rm -rf node_modules .next
npm install
npm run build
```

---

## 📊 URLS FINALES

Après déploiement:

- 🤖 **AI Agents**: https://agents.iafactory.dz
- ⚽ **CAN 2025**: https://can2025.iafactory.dz
- 📰 **News DZ**: https://news.iafactory.dz
- 🏆 **Sport Magazine**: https://sport.iafactory.dz

---

## 🎉 C'EST TOUT!

**4 apps en production** avec:
- ✅ HTTPS (SSL)
- ✅ Auto-restart (PM2)
- ✅ Reverse proxy (Nginx)
- ✅ Logs centralisés
- ✅ Monitoring

**Prêt à scaler! 🚀**
