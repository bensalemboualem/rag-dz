# CORRECTION BOLT.DIY - INSTRUCTIONS RAPIDES
## IAFactory Algeria

**Date:** 4 Décembre 2025

---

## 🚨 PROBLÈME DÉTECTÉ

Le VPS est actuellement **inaccessible** (SSH timeout, HTTPS timeout).

**Causes possibles:**
1. Serveur Hetzner down/reboot
2. Firewall bloquant les connexions
3. Problème réseau chez Hetzner
4. Serveur surchargé

---

## ✅ SOLUTION IMMÉDIATE

### Option A: Via Hetzner Console (Recommandé)

1. **Connecte-toi à Hetzner Cloud Console:**
   - https://console.hetzner.cloud
   - Login avec tes credentials

2. **Vérifier l'état du serveur:**
   - Clique sur ton serveur dans le dashboard
   - Status: Running / Stopped / Error?
   - Si "Stopped": Clique sur "Power On"

3. **Accéder via Console Web:**
   - Clique sur "Console" dans Hetzner
   - Cela ouvre un terminal dans le navigateur
   - Login: root
   - Password: Ainsefra*0819692025*

### Option B: Attendre que SSH revienne

Si le serveur est simplement surchargé, attend 5-10 minutes puis essaie:

```bash
ssh root@46.224.3.125
# Password: Ainsefra*0819692025*
```

---

## 🔧 CORRECTION BOLT (Une fois connecté)

### Méthode Automatique (Recommandée)

```bash
# 1. Télécharger le script
cd /tmp
wget https://raw.githubusercontent.com/... # (ou copier depuis local)

# OU copier manuellement:
cat > fix-bolt.sh << 'SCRIPTEOF'
[Copier le contenu de fix-bolt-complete.sh ici]
SCRIPTEOF

# 2. Rendre exécutable
chmod +x fix-bolt.sh

# 3. Exécuter
./fix-bolt.sh

# Le script va:
# - Diagnostiquer le problème
# - Trouver Bolt
# - Vérifier Docker/Nginx
# - Corriger la configuration
# - Redémarrer les services
```

### Méthode Manuelle (Si script échoue)

#### Étape 1: Trouver Bolt

```bash
# Chercher Bolt
find /opt -name "*bolt*" -type d

# Probablement dans:
# /opt/iafactory-rag-dz/bolt-diy
# OU
# /opt/iafactory-rag-dz/frontend/bolt-diy
```

#### Étape 2: Vérifier si Bolt tourne

```bash
# Vérifier Docker
docker ps | grep bolt

# Vérifier processus Node
ps aux | grep bolt

# Vérifier port 5173
netstat -tlnp | grep 5173
```

#### Étape 3: Démarrer Bolt

**Si Docker:**
```bash
cd /opt/iafactory-rag-dz
docker-compose up -d bolt

# OU si dans bolt-diy/
cd /opt/iafactory-rag-dz/bolt-diy
docker-compose up -d
```

**Si npm:**
```bash
cd /opt/iafactory-rag-dz/bolt-diy
npm install
npm run dev
```

#### Étape 4: Vérifier Nginx

```bash
# Tester config
nginx -t

# Vérifier si /bolt/ existe
grep -A 5 "location /bolt" /etc/nginx/sites-available/iafactoryalgeria.com

# Si absent, ajouter:
nano /etc/nginx/sites-available/iafactoryalgeria.com
```

Ajouter cette section dans le bloc `server` HTTPS (port 443):

```nginx
    # Bolt.diy - AI Code Generator
    location /bolt/ {
        proxy_pass http://127.0.0.1:5173/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    # HMR WebSocket
    location /bolt/@vite/ {
        proxy_pass http://127.0.0.1:5173/@vite/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
```

Sauvegarder (Ctrl+O, Enter, Ctrl+X) puis:

```bash
# Tester
nginx -t

# Recharger
systemctl reload nginx
```

#### Étape 5: Tester

```bash
# Tester localement
curl http://localhost:5173

# Tester via Nginx
curl http://localhost/bolt/

# Tester HTTPS
curl -k https://localhost/bolt/
```

---

## 🌐 OPTION: CRÉER SOUS-DOMAINE (Recommandé)

Au lieu de `www.iafactoryalgeria.com/bolt/`, créer `bolt.iafactoryalgeria.com`:

### 1. Ajouter DNS

Dans ton provider DNS (Cloudflare, Hetzner DNS, etc.):

```
Type: A
Name: bolt
Value: 46.224.3.125
TTL: Auto/300
```

```
Type: A
Name: www.bolt
Value: 46.224.3.125
TTL: Auto/300
```

### 2. Créer config Nginx

```bash
cat > /etc/nginx/sites-available/bolt.iafactoryalgeria.com << 'NGINXEOF'
# HTTP → HTTPS Redirect
server {
    listen 80;
    listen [::]:80;
    server_name bolt.iafactoryalgeria.com www.bolt.iafactoryalgeria.com;
    return 301 https://$host$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name bolt.iafactoryalgeria.com www.bolt.iafactoryalgeria.com;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINXEOF

# Activer
ln -sf /etc/nginx/sites-available/bolt.iafactoryalgeria.com /etc/nginx/sites-enabled/

# Tester
nginx -t

# Recharger
systemctl reload nginx

# SSL automatique
certbot --nginx -d bolt.iafactoryalgeria.com -d www.bolt.iafactoryalgeria.com \
    --non-interactive --agree-tos --email admin@iafactoryalgeria.com --redirect
```

---

## 🐛 DÉPANNAGE

### Bolt ne démarre pas

```bash
# Voir les logs
cd /opt/iafactory-rag-dz/bolt-diy
cat bolt.log

# OU si Docker
docker logs bolt -f
```

**Erreurs communes:**

1. **Port 5173 déjà utilisé:**
   ```bash
   # Tuer le processus
   kill $(lsof -t -i:5173)

   # Redémarrer Bolt
   npm run dev
   ```

2. **Dépendances manquantes:**
   ```bash
   npm install
   ```

3. **Permissions:**
   ```bash
   chown -R $(whoami):$(whoami) /opt/iafactory-rag-dz/bolt-diy
   ```

### Nginx 502 Bad Gateway

```bash
# Vérifier que Bolt tourne
curl http://localhost:5173

# Vérifier Nginx logs
tail -f /var/log/nginx/error.log
```

### Certificat SSL invalide

```bash
# Renouveler
certbot renew --force-renewal

# OU recréer
certbot --nginx -d bolt.iafactoryalgeria.com --force-renewal
```

---

## 📊 VÉRIFICATION FINALE

Une fois tout fait, teste:

```bash
# Status services
systemctl status nginx
docker ps | grep bolt

# Test HTTP local
curl http://localhost:5173

# Test via Nginx
curl http://localhost/bolt/

# Test HTTPS
curl https://www.iafactoryalgeria.com/bolt/

# OU si sous-domaine
curl https://bolt.iafactoryalgeria.com
```

**Depuis ton PC:**
- Ouvre https://www.iafactoryalgeria.com/bolt/
- OU https://bolt.iafactoryalgeria.com

Tu devrais voir l'interface Bolt.diy!

---

## 📞 SI RIEN NE MARCHE

### Redéploiement complet Bolt

```bash
# 1. Arrêter Bolt
docker stop bolt
# OU
pkill -f bolt

# 2. Sauvegarder config
cp /opt/iafactory-rag-dz/bolt-diy/.env /tmp/bolt.env.backup

# 3. Supprimer et re-cloner
cd /opt/iafactory-rag-dz
rm -rf bolt-diy
git clone https://github.com/stackblitz/bolt.new.git bolt-diy

# 4. Restaurer .env
cp /tmp/bolt.env.backup /opt/iafactory-rag-dz/bolt-diy/.env

# 5. Installer
cd bolt-diy
npm install

# 6. Build
npm run build

# 7. Démarrer
npm run dev
```

---

## ✅ CHECKLIST

- [ ] VPS accessible (SSH/Console)
- [ ] Bolt trouvé dans /opt/iafactory-rag-dz/
- [ ] Bolt démarré (Docker OU npm)
- [ ] Port 5173 en écoute
- [ ] Config Nginx ajoutée
- [ ] Nginx testé et rechargé
- [ ] Test HTTP local: OK
- [ ] Test HTTPS externe: OK
- [ ] (Optionnel) Sous-domaine DNS ajouté
- [ ] (Optionnel) SSL pour sous-domaine

---

**Créé par:** Claude Code
**Date:** 4 Décembre 2025

**Note:** Le script automatique [fix-bolt-complete.sh](./fix-bolt-complete.sh) fait tout ça automatiquement!
