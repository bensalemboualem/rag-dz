# 🔥 FIX RAPIDE - 2 MINUTES

## ⚡ OPTION 1: Automatique (Recommandé)

**DOUBLE-CLIQUEZ SUR:**
```
📁 FIX_TOUT_MAINTENANT.bat
```

Entrez le mot de passe VPS et c'est tout! ✅

---

## ⚡ OPTION 2: Manuel sur VPS (Si Option 1 échoue)

### 1. Connectez-vous:
```bash
ssh root@46.224.3.125
```

### 2. Copiez-collez CE BLOC COMPLET:

```bash
# === FIX COMPLET ===
systemctl stop nginx

# Config Nginx CH
cat > /etc/nginx/sites-available/iafactory.ch << 'EOF'
server {
    listen 80;
    server_name iafactory.ch www.iafactory.ch;
    return 301 https://$server_name$request_uri;
}
server {
    listen 443 ssl http2;
    server_name iafactory.ch www.iafactory.ch;
    ssl_certificate /etc/letsencrypt/live/iafactory.ch/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/iafactory.ch/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Tenant-ID "814c132a-1cdd-4db6-bc1f-21abd21ec37d";
    }
    location /api/ {
        proxy_pass http://localhost:8002;
        proxy_set_header X-Tenant-ID "814c132a-1cdd-4db6-bc1f-21abd21ec37d";
    }
}
EOF

# Config Nginx DZ
cat > /etc/nginx/sites-available/iafactoryalgeria.com << 'EOF'
server {
    listen 80;
    server_name iafactoryalgeria.com www.iafactoryalgeria.com;
    return 301 https://$server_name$request_uri;
}
server {
    listen 443 ssl http2;
    server_name iafactoryalgeria.com www.iafactoryalgeria.com;
    ssl_certificate /etc/letsencrypt/live/iafactoryalgeria.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/iafactoryalgeria.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    location / {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Tenant-ID "922d243b-2dee-5ec7-cd2g-32bce32fd48e";
    }
    location /api/ {
        proxy_pass http://localhost:8002;
        proxy_set_header X-Tenant-ID "922d243b-2dee-5ec7-cd2g-32bce32fd48e";
    }
}
EOF

# Activer
ln -sf /etc/nginx/sites-available/iafactory.ch /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/iafactoryalgeria.com /etc/nginx/sites-enabled/

# Fix SSL
certbot delete --cert-name iafactory.ch --non-interactive || true
certbot delete --cert-name iafactoryalgeria.com --non-interactive || true

certbot certonly --standalone --non-interactive --agree-tos \
    --email support@iafactory.ch \
    -d iafactory.ch -d www.iafactory.ch

certbot certonly --standalone --non-interactive --agree-tos \
    --email support@iafactoryalgeria.com \
    -d iafactoryalgeria.com -d www.iafactoryalgeria.com

# Redémarrer
nginx -t && systemctl start nginx

# Vérifier
echo "=== VÉRIFICATION ==="
curl -I https://iafactory.ch | head -3
curl -I https://iafactoryalgeria.com | head -3
certbot certificates
```

### 3. Appuyez sur ENTER

**Durée**: 2-3 minutes

---

## ✅ Après le Fix

Testez avec **Ctrl+Shift+R** (hard refresh):
- https://iafactory.ch
- https://iafactoryalgeria.com

Le cadenas doit être vert! 🔒✅

---

## 🆘 Si ça ne marche toujours pas

```bash
# Vérifier les containers
docker ps

# Si manquants, lancer:
cd ~/rag-dz
docker-compose up -d

# Vérifier les ports
curl http://localhost:3001
curl http://localhost:3002
curl http://localhost:8002/health
```

---

**Temps total**: 2-3 minutes
**Fichier**: INSTRUCTIONS_FIX_RAPIDE.md
