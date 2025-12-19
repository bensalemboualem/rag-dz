# 🔧 BOLT.DIY - SOLUTION FINALE

**Date:** 5 Décembre 2025
**Problème:** Container iaf-docs-prod causait 403
**Solution:** Utiliser le vrai Bolt.diy avec docker-compose

---

## ✅ DÉJÀ FAIT

1. Containers problématiques supprimés (iaf-docs-prod, iaf-studio-prod)
2. Build Bolt.diy démarré en background
3. SSL configuré pour bolt.iafactoryalgeria.com

---

## 📋 COMMANDES FINALES - HETZNER CONSOLE

### 1. Vérifier si le build est terminé

```bash
cd /opt/iafactory-rag-dz/bolt-diy
docker-compose ps
```

**Si le container n'est pas "Up"**, lancer manuellement:

```bash
cd /opt/iafactory-rag-dz/bolt-diy
docker-compose up -d --build
```

**Attendre 3-5 minutes** pour le build Docker...

### 2. Vérifier que Bolt répond

```bash
# Attendre que le build soit fini
sleep 180  # 3 minutes

# Vérifier le container
docker ps | grep bolt

# Tester le port 5173
curl -I http://localhost:5173
```

**Résultat attendu:** `HTTP/1.1 200 OK`

### 3. Mettre à jour Nginx (si port différent)

```bash
# Vérifier la config actuelle
grep proxy_pass /etc/nginx/sites-available/bolt.iafactoryalgeria.com

# Si nécessaire, mettre à jour vers 5173
cat > /etc/nginx/sites-available/bolt.iafactoryalgeria.com <<'EOF'
server {
    server_name bolt.iafactoryalgeria.com;

    location / {
        proxy_pass http://127.0.0.1:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
        proxy_buffering off;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/bolt.iafactoryalgeria.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bolt.iafactoryalgeria.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = bolt.iafactoryalgeria.com) {
        return 301 https://$host$request_uri;
    }
    listen 80;
    server_name bolt.iafactoryalgeria.com;
    return 404;
}
EOF

# Recharger Nginx
nginx -t && systemctl reload nginx
```

### 4. Test final

```bash
# Test HTTPS
curl -I https://bolt.iafactoryalgeria.com

# Devrait afficher: HTTP/2 200
```

---

## 🆘 SI LE BUILD PREND TROP DE TEMPS

**Alternative rapide:** Utiliser le mode dev sans build

```bash
cd /opt/iafactory-rag-dz/bolt-diy

# Installer pnpm si pas présent
curl -fsSL https://get.pnpm.io/install.sh | sh -
export PATH="/root/.local/share/pnpm:$PATH"

# Installer dépendances (une seule fois)
pnpm install

# Démarrer en mode dev
nohup pnpm run dev --host 0.0.0.0 --port 5173 > /var/log/bolt-dev.log 2>&1 &

# Attendre 30 secondes
sleep 30

# Vérifier
curl -I http://localhost:5173
```

---

## 📊 VÉRIFICATION COMPLÈTE

Une fois Bolt démarré, vérifier tous les services:

```bash
echo "=== SERVICES PRINCIPAUX ==="
echo ""
echo "Archon:"
curl -I https://archon.iafactoryalgeria.com | head -1
echo ""
echo "Bolt:"
curl -I https://bolt.iafactoryalgeria.com | head -1
echo ""
echo "Site principal:"
curl -I https://www.iafactoryalgeria.com | head -1
echo ""
echo "=== CONTAINERS ==="
docker ps --format "{{.Names}}: {{.Status}}" | grep -E "(bolt|archon|postgres|ollama|qdrant)"
```

**Tous doivent afficher:** `HTTP/2 200` ou `HTTP/1.1 200`

---

## ✅ RÉSULTAT FINAL ATTENDU

```
✅ Archon:           200 OK (https://archon.iafactoryalgeria.com)
✅ Bolt:             200 OK (https://bolt.iafactoryalgeria.com)
✅ Site principal:   200 OK (https://www.iafactoryalgeria.com)
✅ PostgreSQL:       Healthy (localhost:6330)
✅ Ollama:           Running (localhost:11434)
✅ Qdrant:           Running (localhost:6333)
✅ Prometheus:       Running (localhost:9090)
✅ Grafana:          Running (localhost:3033)
✅ Backups:          Configurés (cron 2h AM)
```

**Infrastructure Score:** 100/100 🎉

---

## 🔍 LOGS UTILES

```bash
# Logs Bolt container
docker logs -f bolt-diy-app-prod-1

# Logs Bolt dev (si mode alternatif)
tail -f /var/log/bolt-dev.log

# Logs Nginx
tail -f /var/log/nginx/error.log | grep bolt

# Status tous containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

---

**Temps total:** 5-10 minutes (incluant build Docker)
**Difficulté:** ⭐⭐ Facile
**Impact:** ✅ Tous les services opérationnels

