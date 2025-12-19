# GUIDE DE VÉRIFICATION MANUELLE
## IAFactory Algeria - Infrastructure Complete

**Date:** 4 Décembre 2025
**Pour:** Accès via Hetzner Console ou SSH

---

## 🚀 ACCÈS AU VPS

### Option 1: Hetzner Console (Recommandé si SSH timeout)
1. Va sur https://console.hetzner.cloud
2. Login avec tes credentials
3. Clique sur ton serveur "iafactorysuisse"
4. Clique sur "Console" (ouvre terminal web)
5. Login: `root` / Password: `Ainsefra*0819692025*`

### Option 2: SSH Direct
```bash
ssh root@46.224.3.125
# Password: Ainsefra*0819692025*
```

---

## ✅ SCRIPT DE VÉRIFICATION COMPLÈTE

Une fois connecté au VPS, copie et exécute ce script:

```bash
#!/bin/bash
# Vérification complète infrastructure IAFactory

echo "================================================================"
echo "🔍 AUDIT INFRASTRUCTURE IAFACTORY ALGERIA"
echo "================================================================"
echo ""

# ================================================================
# 1. SERVICES DOCKER
# ================================================================
echo "=== 1. DOCKER CONTAINERS (43 attendus) ==="
echo ""
RUNNING=$(docker ps --format "{{.Names}}" | wc -l)
echo "Conteneurs en cours: $RUNNING/43"
echo ""

# Archon
echo "🌟 ARCHON:"
docker ps --filter "name=archon" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Apps Business
echo "💼 BUSINESS APPS:"
docker ps --filter "name=pme\|crm\|startup\|voice\|legal\|fiscal\|billing\|landing" --format "table {{.Names}}\t{{.Status}}"
echo ""

# Monitoring
echo "📊 MONITORING:"
docker ps --filter "name=grafana\|prometheus\|loki\|alert" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Core Services
echo "🔧 CORE SERVICES:"
docker ps --filter "name=backend\|postgres\|ollama\|n8n" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

# ================================================================
# 2. NGINX
# ================================================================
echo "=== 2. NGINX & SSL ==="
echo ""

systemctl is-active nginx && echo "✅ Nginx: Running" || echo "❌ Nginx: Stopped"
nginx -t 2>&1 | grep -q "successful" && echo "✅ Config: Valid" || echo "❌ Config: Invalid"

echo ""
echo "Sites configurés:"
ls -1 /etc/nginx/sites-enabled/ 2>/dev/null | grep -v default

echo ""
echo "Certificats SSL:"
certbot certificates 2>&1 | grep -E "(Certificate Name|Domains|Expiry Date)" | head -20

echo ""
echo "Ports en écoute:"
netstat -tlnp | grep -E ":(80|443|8180|8181|3737|11434|5432) " | awk '{print $4 "\t" $7}'

# ================================================================
# 3. BOLT.DIY
# ================================================================
echo ""
echo "=== 3. BOLT.DIY ==="
echo ""

# Trouver Bolt
BOLT_PATH=""
if [ -d "/opt/iafactory-rag-dz/bolt-diy" ]; then
    BOLT_PATH="/opt/iafactory-rag-dz/bolt-diy"
elif [ -d "/opt/iafactory-rag-dz/frontend/bolt-diy" ]; then
    BOLT_PATH="/opt/iafactory-rag-dz/frontend/bolt-diy"
fi

if [ -n "$BOLT_PATH" ]; then
    echo "📂 Bolt trouvé: $BOLT_PATH"

    # Docker ou npm?
    if docker ps | grep -q bolt; then
        echo "✅ Bolt Docker: Running"
        docker ps | grep bolt
    else
        echo "⚠️  Bolt Docker: Not running"
    fi

    # Port 5173
    if netstat -tlnp | grep -q ":5173 "; then
        echo "✅ Port 5173: En écoute"
    else
        echo "❌ Port 5173: NON en écoute"
    fi

    # Test local
    if timeout 3 curl -s http://localhost:5173 > /dev/null; then
        echo "✅ Bolt répond: http://localhost:5173"
    else
        echo "❌ Bolt ne répond pas"
    fi

    # Nginx config
    if grep -q "location /bolt" /etc/nginx/sites-enabled/* 2>/dev/null; then
        echo "✅ Nginx /bolt/: Configuré"
    else
        echo "⚠️  Nginx /bolt/: NON configuré"
    fi
else
    echo "❌ Bolt NON trouvé"
fi

# ================================================================
# 4. DOMAINES
# ================================================================
echo ""
echo "=== 4. DOMAINES & HTTPS ==="
echo ""

DOMAINS=(
    "www.iafactoryalgeria.com"
    "archon.iafactoryalgeria.com"
    "bolt.iafactoryalgeria.com"
)

for domain in "${DOMAINS[@]}"; do
    echo -n "$domain: "
    if timeout 5 curl -Is "https://$domain" 2>/dev/null | head -1 | grep -q "200\|301\|302"; then
        echo "✅ Accessible"
    else
        echo "❌ Timeout/Error"
    fi
done

# ================================================================
# 5. RESSOURCES SYSTÈME
# ================================================================
echo ""
echo "=== 5. RESSOURCES SYSTÈME ==="
echo ""

echo "Uptime: $(uptime -p)"
echo "Load: $(uptime | awk -F'load average:' '{print $2}')"
echo ""
echo "RAM:"
free -h | grep -E "Mem|Swap"
echo ""
echo "Disk:"
df -h / | tail -1

# ================================================================
# RÉSUMÉ
# ================================================================
echo ""
echo "================================================================"
echo "📊 RÉSUMÉ"
echo "================================================================"
echo ""

SCORE=0
TOTAL=10

# Checks
docker ps | grep -q archon-server && ((SCORE++))
docker ps | grep -q archon-ui && ((SCORE++))
systemctl is-active --quiet nginx && ((SCORE++))
nginx -t 2>&1 | grep -q "successful" && ((SCORE++))
[ -n "$(certbot certificates 2>&1 | grep 'Certificate Name')" ] && ((SCORE++))
netstat -tlnp | grep -q ":443 " && ((SCORE++))
docker ps | grep -q ollama && ((SCORE++))
docker ps | grep -q postgres && ((SCORE++))
docker ps | grep -q grafana && ((SCORE++))
[ $RUNNING -ge 35 ] && ((SCORE++))

PERCENT=$((SCORE * 100 / TOTAL))

echo "Score Infrastructure: $SCORE/$TOTAL ($PERCENT%)"
echo ""

if [ $PERCENT -ge 90 ]; then
    echo "✅ ✅ ✅ INFRASTRUCTURE: EXCELLENTE"
elif [ $PERCENT -ge 70 ]; then
    echo "✅ INFRASTRUCTURE: BONNE"
elif [ $PERCENT -ge 50 ]; then
    echo "⚠️  INFRASTRUCTURE: ACCEPTABLE"
else
    echo "❌ INFRASTRUCTURE: PROBLÈMES"
fi

echo ""
echo "================================================================"
echo "Audit terminé: $(date)"
echo "================================================================"
```

---

## 🔧 ACTIONS RAPIDES

### Vérifier Archon
```bash
cd /opt/iafactory-rag-dz/frontend/archon-ui-stable
docker compose ps
docker compose logs -f --tail=50
```

### Vérifier Bolt
```bash
# Trouver Bolt
find /opt -name "*bolt*" -type d 2>/dev/null

# Si trouvé dans /opt/iafactory-rag-dz/bolt-diy:
cd /opt/iafactory-rag-dz/bolt-diy
docker compose ps
# OU
ps aux | grep bolt

# Tester
curl http://localhost:5173
```

### Corriger Bolt (si problème)
```bash
cd /opt/iafactory-rag-dz
bash fix-bolt-complete.sh
```

### Vérifier Nginx
```bash
nginx -t
systemctl status nginx
cat /etc/nginx/sites-enabled/iafactoryalgeria.com | grep -A 10 "location /bolt"
```

### Vérifier SSL
```bash
certbot certificates
certbot renew --dry-run
```

### Redémarrer services si besoin
```bash
# Nginx
systemctl restart nginx

# Archon
cd /opt/iafactory-rag-dz/frontend/archon-ui-stable
docker compose restart

# Tout redémarrer
cd /opt/iafactory-rag-dz
docker compose restart
```

---

## 📊 COMMANDES DE MONITORING

### Voir tous les containers
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### Logs en temps réel
```bash
# Tous les logs
docker compose logs -f

# Service spécifique
docker logs archon-server -f
docker logs iaf-grafana -f
```

### Ressources
```bash
# CPU/RAM par container
docker stats --no-stream

# Système
htop
# OU
top
```

### Réseau
```bash
# Ports en écoute
netstat -tlnp | grep LISTEN

# Connexions actives
netstat -an | grep ESTABLISHED | wc -l
```

---

## 🚨 PROBLÈMES COURANTS

### 1. Bolt ne répond pas
```bash
cd /opt/iafactory-rag-dz/bolt-diy
docker compose up -d --build
# Attendre 2 minutes
curl http://localhost:5173
```

### 2. Nginx 502 Bad Gateway
```bash
# Vérifier que le service backend tourne
docker ps | grep <nom-service>

# Vérifier la config
nginx -t

# Logs
tail -f /var/log/nginx/error.log
```

### 3. SSL expiré
```bash
certbot renew
systemctl reload nginx
```

### 4. Container unhealthy
```bash
# Voir les logs
docker logs <container-name> --tail=100

# Redémarrer
docker restart <container-name>
```

### 5. Manque de RAM
```bash
# Voir l'usage
free -h

# Arrêter services non-critiques temporairement
docker stop <container-non-critique>
```

---

## ✅ CHECKLIST COMPLÈTE

Copie cette checklist et coche au fur et à mesure:

```
INFRASTRUCTURE GÉNÉRALE:
[ ] VPS accessible (SSH ou Console)
[ ] 40+ containers Docker running
[ ] Nginx running et config valid
[ ] Ports 80 et 443 en écoute

ARCHON:
[ ] archon-server: healthy (port 8181)
[ ] archon-mcp: healthy (port 8051)
[ ] archon-ui: healthy (port 3737)
[ ] https://archon.iafactoryalgeria.com accessible

CORE SERVICES:
[ ] PostgreSQL + pgvector running (port 5432)
[ ] Ollama running (port 11434)
[ ] Backend API running (port 8180)
[ ] N8N running

MONITORING:
[ ] Grafana accessible (port 3033)
[ ] Prometheus running (port 9090)
[ ] Loki running (port 3100)

BOLT.DIY:
[ ] Bolt trouvé dans filesystem
[ ] Port 5173 en écoute
[ ] http://localhost:5173 répond
[ ] Nginx /bolt/ configuré
[ ] https://www.iafactoryalgeria.com/bolt/ accessible

SSL:
[ ] Certificats Let's Encrypt valides
[ ] Expiration > 30 jours
[ ] Tous domaines couverts

BUSINESS APPS:
[ ] PME Copilot running
[ ] CRM IA running
[ ] StartupDZ Onboarding running
[ ] Landing Page accessible
```

---

## 📞 AIDE SUPPLÉMENTAIRE

Si tu rencontres des problèmes:

1. **Copie l'output du script de vérification complète**
2. **Note les erreurs spécifiques**
3. **Vérifie les logs Docker**

Scripts disponibles:
- `fix-bolt-complete.sh` - Correction automatique Bolt
- `audit-infrastructure-complete.sh` - Audit complet
- `install-archon.sh` - Réinstaller Archon si besoin

---

**Créé par:** Claude Code
**Date:** 4 Décembre 2025
**Version:** 1.0

**Note:** Ce guide est conçu pour être copié-collé directement dans le terminal VPS via Hetzner Console.
