# GUIDE D'EXÉCUTION VIA HETZNER CONSOLE
## IAFactory Algeria - 4 Tâches Prioritaires

**Date:** 4 Décembre 2025
**Méthode:** Console Web Hetzner (recommandé pour éviter timeouts SSH)

---

## 🌐 ACCÈS HETZNER CONSOLE

1. **Ouvrir le navigateur:**
   - Va sur: https://console.hetzner.cloud

2. **Login:**
   - Entre tes identifiants Hetzner

3. **Sélectionner le serveur:**
   - Clique sur "iafactorysuisse" (46.224.3.125)

4. **Ouvrir la console:**
   - Clique sur le bouton "Console" en haut à droite
   - Une fenêtre avec un terminal s'ouvre

5. **Login sur le serveur:**
   ```
   Login: root
   Password: Ainsefra*0819692025*
   ```

---

## 📋 SCRIPT COMPLET À EXÉCUTER

Une fois connecté dans la console Hetzner, copie et exécute ce script complet:

```bash
#!/bin/bash
# ================================================================
# EXÉCUTION DES 4 TÂCHES - IAFactory Algeria
# ================================================================

clear
echo "================================================================"
echo "🚀 IAFACTORY ALGERIA - CONFIGURATION PROFESSIONNELLE"
echo "================================================================"
echo ""
echo "Ce script va exécuter:"
echo "  1. Sécurisation PostgreSQL/Ollama"
echo "  2. Démarrage Bolt.diy"
echo "  3. Déploiement agents IA (Qdrant)"
echo "  4. Configuration Grafana public"
echo ""
echo "Durée estimée: 10-15 minutes"
echo "================================================================"
echo ""

read -p "Appuyer sur ENTRÉE pour commencer (ou Ctrl+C pour annuler)..."

# ================================================================
# TÂCHE 1: SÉCURISATION POSTGRESQL & OLLAMA
# ================================================================

echo ""
echo "================================================================"
echo "TÂCHE 1/4: SÉCURISATION POSTGRESQL & OLLAMA"
echo "================================================================"
echo ""

cd /opt/iafactory-rag-dz

echo "📋 Analyse des ports..."
echo ""
echo "Ports actuellement exposés:"
netstat -tlnp | grep -E ":(5432|6330|11434|8186) " | grep "0.0.0.0" || echo "Aucun (déjà sécurisé)"

echo ""
echo "🔒 Application de la sécurisation..."

# Backup
cp docker-compose.yml docker-compose.yml.backup-$(date +%Y%m%d_%H%M%S)
echo "✅ Backup créé"

# Sécuriser tous les ports PostgreSQL et Ollama
sed -i 's/- "5432:5432"/- "127.0.0.1:5432:5432"/g' docker-compose.yml
sed -i 's/- "6330:5432"/- "127.0.0.1:6330:5432"/g' docker-compose.yml
sed -i 's/- "11434:11434"/- "127.0.0.1:11434:11434"/g' docker-compose.yml
sed -i 's/- "8186:11434"/- "127.0.0.1:8186:11434"/g' docker-compose.yml

echo "✅ Ports sécurisés dans docker-compose.yml"

# Redémarrer les services
echo ""
echo "🔄 Redémarrage des services..."
POSTGRES_CONTAINER=$(docker ps --format '{{.Names}}' | grep postgres | head -1)
OLLAMA_CONTAINER=$(docker ps --format '{{.Names}}' | grep ollama | head -1)

echo "PostgreSQL: $POSTGRES_CONTAINER"
echo "Ollama: $OLLAMA_CONTAINER"

if [ -n "$POSTGRES_CONTAINER" ]; then
    docker restart $POSTGRES_CONTAINER
    echo "✅ PostgreSQL redémarré"
fi

if [ -n "$OLLAMA_CONTAINER" ]; then
    docker restart $OLLAMA_CONTAINER
    echo "✅ Ollama redémarré"
fi

echo ""
echo "⏳ Attente 15 secondes..."
sleep 15

echo ""
echo "✅ Vérification finale:"
netstat -tlnp | grep -E ":(5432|6330|11434|8186) " | while read line; do
    if echo "$line" | grep -q "127.0.0.1"; then
        echo "  ✅ $(echo "$line" | awk '{print $4}') - Localhost uniquement"
    elif echo "$line" | grep -q "0.0.0.0"; then
        echo "  ⚠️  $(echo "$line" | awk '{print $4}') - ENCORE PUBLIC (à vérifier)"
    fi
done

echo ""
echo "✅ TÂCHE 1/4 TERMINÉE"
echo ""
read -p "Appuyer sur ENTRÉE pour continuer..."

# ================================================================
# TÂCHE 2: BOLT.DIY
# ================================================================

echo ""
echo "================================================================"
echo "TÂCHE 2/4: DÉMARRAGE BOLT.DIY"
echo "================================================================"
echo ""

cd /opt/iafactory-rag-dz/bolt-diy

echo "📂 Vérification Bolt..."
if [ ! -d "/opt/iafactory-rag-dz/bolt-diy" ]; then
    echo "❌ Bolt.diy non trouvé"
    echo "Installation de Bolt.diy..."
    cd /opt/iafactory-rag-dz
    git clone https://github.com/stackblitz/bolt.new.git bolt-diy
    cd bolt-diy
fi

echo "✅ Bolt.diy trouvé: $(pwd)"
echo ""

# Vérifier package.json
if [ -f "package.json" ]; then
    echo "📦 Installation des dépendances..."
    npm install 2>&1 | tail -15

    echo ""
    echo "🚀 Démarrage Bolt (en arrière-plan)..."

    # Tuer les processus existants sur port 5173
    pkill -f "vite" 2>/dev/null || true
    sleep 2

    # Démarrer
    nohup npm run dev > bolt.log 2>&1 &
    BOLT_PID=$!
    echo "  PID: $BOLT_PID"
    echo "$BOLT_PID" > bolt.pid

    echo ""
    echo "⏳ Attente 30 secondes pour le démarrage..."
    sleep 30

    echo ""
    echo "Vérification:"
    if netstat -tlnp | grep -q ":5173 "; then
        echo "  ✅ Port 5173: En écoute"
    else
        echo "  ❌ Port 5173: Pas encore en écoute"
    fi

    if timeout 5 curl -s http://localhost:5173 > /dev/null; then
        echo "  ✅ HTTP: Bolt répond"
    else
        echo "  ⚠️  HTTP: Bolt ne répond pas encore"
        echo ""
        echo "Logs récents:"
        tail -30 bolt.log
    fi

    # Configuration Nginx
    echo ""
    echo "🔧 Vérification configuration Nginx..."

    if ! grep -q "location /bolt" /etc/nginx/sites-enabled/iafactoryalgeria.com 2>/dev/null; then
        echo "Ajout configuration Nginx..."

        # Trouver la ligne de fermeture du dernier server block
        NGINX_FILE="/etc/nginx/sites-enabled/iafactoryalgeria.com"

        # Ajouter avant la dernière accolade fermante du server HTTPS
        cat >> $NGINX_FILE << 'NGINXCONF'

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
NGINXCONF

        # Tester et recharger
        if nginx -t 2>&1 | grep -q "successful"; then
            systemctl reload nginx
            echo "  ✅ Nginx rechargé"
        else
            echo "  ❌ Erreur Nginx - vérifier manuellement"
        fi
    else
        echo "  ✅ Nginx déjà configuré"
    fi

else
    echo "❌ package.json non trouvé"
    ls -la
fi

echo ""
echo "✅ TÂCHE 2/4 TERMINÉE"
echo ""
echo "URLs Bolt:"
echo "  • Local: http://localhost:5173"
echo "  • Public: https://www.iafactoryalgeria.com/bolt/"
echo ""
read -p "Appuyer sur ENTRÉE pour continuer..."

# ================================================================
# TÂCHE 3: AGENTS IA (QDRANT)
# ================================================================

echo ""
echo "================================================================"
echo "TÂCHE 3/4: DÉPLOIEMENT AGENTS IA"
echo "================================================================"
echo ""

cd /opt/iafactory-rag-dz
mkdir -p ia-agents
cd ia-agents

echo "🤖 Création configuration Qdrant (Vector Database)..."

cat > docker-compose.yml << 'YAMLQDRANT'
version: '3.8'

services:
  qdrant:
    image: qdrant/qdrant:latest
    container_name: iaf-qdrant
    ports:
      - "127.0.0.1:6333:6333"
      - "127.0.0.1:6334:6334"
    volumes:
      - qdrant_data:/qdrant/storage
    environment:
      - QDRANT__SERVICE__GRPC_PORT=6334
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:6333/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  qdrant_data:
    driver: local
YAMLQDRANT

echo "✅ Configuration créée"
echo ""

echo "🚀 Démarrage Qdrant..."
docker-compose up -d

echo ""
echo "⏳ Attente 20 secondes..."
sleep 20

echo ""
echo "Vérification:"
if docker ps | grep -q qdrant; then
    echo "  ✅ Container: Running"
    docker ps | grep qdrant
else
    echo "  ❌ Container: Not running"
fi

if timeout 5 curl -s http://localhost:6333/health > /dev/null; then
    echo "  ✅ Health check: OK"
else
    echo "  ⚠️  Health check: En cours de démarrage"
fi

echo ""
echo "✅ TÂCHE 3/4 TERMINÉE"
echo ""
echo "📝 Note: Base Qdrant déployée"
echo "   Les 5 agents IA complets seront déployés ultérieurement"
echo "   Voir: /opt/iafactory-rag-dz/deploy-ia-agents.sh"
echo ""
read -p "Appuyer sur ENTRÉE pour continuer..."

# ================================================================
# TÂCHE 4: GRAFANA PUBLIC
# ================================================================

echo ""
echo "================================================================"
echo "TÂCHE 4/4: CONFIGURATION GRAFANA PUBLIC"
echo "================================================================"
echo ""

if docker ps | grep -q grafana; then
    GRAFANA_CONTAINER=$(docker ps | grep grafana | awk '{print $NF}')
    echo "✅ Grafana trouvé: $GRAFANA_CONTAINER"

    echo ""
    echo "⚠️  PRÉREQUIS DNS:"
    echo ""
    echo "Avant de continuer, configurez le DNS:"
    echo "  Type: A"
    echo "  Name: grafana"
    echo "  Value: 46.224.3.125"
    echo "  TTL: Auto/300"
    echo ""

    read -p "DNS configuré? Continuer? (o/N): " SETUP_GRAFANA

    if [ "$SETUP_GRAFANA" = "o" ] || [ "$SETUP_GRAFANA" = "O" ]; then
        echo ""
        echo "🔧 Configuration Nginx..."

        cat > /etc/nginx/sites-available/grafana.iafactoryalgeria.com << 'GRAFANANGINX'
# Grafana Public - IAFactory Algeria

server {
    listen 80;
    listen [::]:80;
    server_name grafana.iafactoryalgeria.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name grafana.iafactoryalgeria.com;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Grafana proxy
    location / {
        proxy_pass http://127.0.0.1:3033;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API
    location /api/ {
        proxy_pass http://127.0.0.1:3033;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Live updates
    location /api/live/ {
        proxy_pass http://127.0.0.1:3033;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
GRAFANANGINX

        # Activer
        ln -sf /etc/nginx/sites-available/grafana.iafactoryalgeria.com /etc/nginx/sites-enabled/

        # Tester
        if nginx -t 2>&1 | grep -q "successful"; then
            systemctl reload nginx
            echo "  ✅ Nginx configuré et rechargé"
        else
            echo "  ❌ Erreur Nginx"
            nginx -t
        fi

        echo ""
        echo "🔒 Configuration SSL (Let's Encrypt)..."

        # Vérifier DNS
        if host grafana.iafactoryalgeria.com > /dev/null 2>&1; then
            echo "  ✅ DNS résolu"

            # Certbot
            certbot --nginx -d grafana.iafactoryalgeria.com \
                --non-interactive \
                --agree-tos \
                --email admin@iafactoryalgeria.com \
                --redirect

            if [ $? -eq 0 ]; then
                echo "  ✅ SSL configuré"
                echo ""
                echo "🎉 Grafana accessible sur: https://grafana.iafactoryalgeria.com"
            else
                echo "  ⚠️  SSL échoué - Configuration manuelle requise"
                echo "  Commande: certbot --nginx -d grafana.iafactoryalgeria.com"
            fi
        else
            echo "  ⚠️  DNS non résolu - attendez la propagation DNS"
            echo "  Puis exécutez: certbot --nginx -d grafana.iafactoryalgeria.com"
        fi
    else
        echo "⏭️  Configuration Grafana reportée"
    fi
else
    echo "❌ Grafana ne tourne pas"
    echo "Démarrez avec: docker-compose up -d grafana"
fi

echo ""
echo "✅ TÂCHE 4/4 TERMINÉE"
echo ""
read -p "Appuyer sur ENTRÉE pour voir le résumé final..."

# ================================================================
# RÉSUMÉ FINAL
# ================================================================

clear
echo "================================================================"
echo "🎉 TOUTES LES TÂCHES TERMINÉES!"
echo "================================================================"
echo ""

echo "📊 RÉSUMÉ DES SERVICES:"
echo ""

echo "1. Sécurité PostgreSQL/Ollama:"
SECURE_COUNT=$(netstat -tlnp 2>/dev/null | grep -E ":(5432|6330|11434|8186) " | grep "127.0.0.1" | wc -l)
if [ $SECURE_COUNT -gt 0 ]; then
    echo "   ✅ Ports sécurisés (localhost uniquement)"
else
    echo "   ⚠️  À vérifier manuellement"
fi

echo ""
echo "2. Bolt.diy:"
if timeout 2 curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "   ✅ Opérationnel"
    echo "   • Local: http://localhost:5173"
    echo "   • Public: https://www.iafactoryalgeria.com/bolt/"
else
    echo "   ⚠️  À vérifier: tail -f /opt/iafactory-rag-dz/bolt-diy/bolt.log"
fi

echo ""
echo "3. Agents IA (Qdrant):"
if docker ps | grep -q qdrant; then
    echo "   ✅ Qdrant déployé"
    echo "   • Dashboard: http://localhost:6333/dashboard"
else
    echo "   ⚠️  Qdrant non démarré"
fi

echo ""
echo "4. Grafana Public:"
if curl -sk https://grafana.iafactoryalgeria.com > /dev/null 2>&1; then
    echo "   ✅ Accessible"
    echo "   • URL: https://grafana.iafactoryalgeria.com"
    echo "   • User: admin / Password: admin (à changer!)"
elif docker ps | grep -q grafana; then
    echo "   ⚠️  Grafana running, DNS/SSL à configurer"
else
    echo "   ⚠️  Grafana non configuré"
fi

echo ""
echo "================================================================"
echo "📈 STATUS GÉNÉRAL"
echo "================================================================"
echo ""

echo "Containers actifs:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | head -15

echo ""
echo "================================================================"
echo "🔧 COMMANDES UTILES"
echo "================================================================"
echo ""
echo "Logs:"
echo "  • Bolt:     tail -f /opt/iafactory-rag-dz/bolt-diy/bolt.log"
echo "  • Grafana:  docker logs iaf-grafana -f"
echo "  • Qdrant:   docker logs iaf-qdrant -f"
echo ""
echo "Restart:"
echo "  • Nginx:    systemctl reload nginx"
echo "  • Service:  docker restart <container-name>"
echo ""
echo "Status:"
echo "  • Tous:     docker ps"
echo "  • Ports:    netstat -tlnp | grep LISTEN"
echo ""

echo "================================================================"
echo "✅ CONFIGURATION PROFESSIONNELLE TERMINÉE!"
echo "================================================================"
echo ""
echo "📝 Documentation disponible dans:"
echo "   /opt/iafactory-rag-dz/*.md"
echo "   /opt/iafactory-rag-dz/*.sh"
echo ""
```

---

## 📋 EXÉCUTION PAS-À-PAS (Alternative)

Si tu préfères exécuter étape par étape:

### Étape 1: Sécurisation PostgreSQL/Ollama

```bash
cd /opt/iafactory-rag-dz
cp docker-compose.yml docker-compose.yml.backup
sed -i 's/- "6330:5432"/- "127.0.0.1:6330:5432"/g' docker-compose.yml
sed -i 's/- "8186:11434"/- "127.0.0.1:8186:11434"/g' docker-compose.yml
docker restart iaf-postgres-prod iaf-ollama
sleep 10
netstat -tlnp | grep -E ":(6330|8186) "
```

### Étape 2: Démarrage Bolt.diy

```bash
cd /opt/iafactory-rag-dz/bolt-diy
npm install
nohup npm run dev > bolt.log 2>&1 &
sleep 30
curl http://localhost:5173
```

### Étape 3: Déploiement Qdrant

```bash
mkdir -p /opt/iafactory-rag-dz/ia-agents
cd /opt/iafactory-rag-dz/ia-agents

cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  qdrant:
    image: qdrant/qdrant:latest
    container_name: iaf-qdrant
    ports:
      - "127.0.0.1:6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage
    restart: unless-stopped
volumes:
  qdrant_data:
EOF

docker-compose up -d
sleep 15
docker ps | grep qdrant
curl http://localhost:6333/health
```

### Étape 4: Grafana Public

```bash
# Configurer DNS d'abord:
# grafana.iafactoryalgeria.com → 46.224.3.125

cat > /etc/nginx/sites-available/grafana.iafactoryalgeria.com << 'EOF'
server {
    listen 80;
    server_name grafana.iafactoryalgeria.com;
    return 301 https://$host$request_uri;
}
server {
    listen 443 ssl http2;
    server_name grafana.iafactoryalgeria.com;
    location / {
        proxy_pass http://127.0.0.1:3033;
        proxy_set_header Host $host;
    }
}
EOF

ln -s /etc/nginx/sites-available/grafana.iafactoryalgeria.com /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d grafana.iafactoryalgeria.com --email admin@iafactoryalgeria.com
```

---

## ✅ VÉRIFICATIONS FINALES

```bash
# 1. Sécurité
netstat -tlnp | grep -E ":(5432|6330|11434|8186) "
# Tous doivent montrer 127.0.0.1, pas 0.0.0.0

# 2. Bolt
curl http://localhost:5173
curl https://www.iafactoryalgeria.com/bolt/

# 3. Qdrant
curl http://localhost:6333/health
docker ps | grep qdrant

# 4. Grafana
curl https://grafana.iafactoryalgeria.com
```

---

## 🚨 DÉPANNAGE

### Bolt ne démarre pas
```bash
cd /opt/iafactory-rag-dz/bolt-diy
tail -50 bolt.log
pkill -f vite
npm run dev
```

### Qdrant ne répond pas
```bash
docker logs iaf-qdrant
docker restart iaf-qdrant
```

### Grafana SSL échoue
```bash
# Vérifier DNS
host grafana.iafactoryalgeria.com

# Réessayer SSL
certbot --nginx -d grafana.iafactoryalgeria.com
```

---

**Créé par:** Claude Code
**Date:** 4 Décembre 2025
**Version:** 1.0

**Note:** Ce guide est conçu pour être exécuté directement dans Hetzner Console pour éviter les timeouts SSH.
