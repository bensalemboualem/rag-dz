# 🚀 Guide de Déploiement Hetzner - IAFactory RAG-DZ

**Cible** : Hetzner Cloud (VPS)
**Projet** : IAFactory RAG-DZ
**Date** : 2025-11-24

---

## 📋 Prérequis

### 1. Serveur Hetzner Recommandé

**Configuration minimale** :
- **Type** : CX31 ou supérieur
- **CPU** : 2 vCPU (4 vCPU recommandé)
- **RAM** : 8 GB minimum (16 GB recommandé)
- **Disque** : 80 GB SSD minimum (160 GB recommandé)
- **OS** : Ubuntu 22.04 LTS
- **Localisation** : Allemagne (Nuremberg/Falkenstein) ou Helsinki

**Coût estimé** :
- CX31 (2 vCPU, 8GB RAM) : ~€7.49/mois
- CX41 (4 vCPU, 16GB RAM) : ~€14.99/mois ⭐ Recommandé

### 2. Ressources Nécessaires

**IAFactory RAG-DZ consomme** :
```
Backend API      : 400MB RAM
Hub UI           : 150MB RAM
Docs UI          : 120MB RAM
Bolt Studio      : 180MB RAM
n8n              : 250MB RAM
PostgreSQL       : 100MB RAM
Redis            : 20MB RAM
Qdrant           : 200MB RAM
──────────────────────────
Total            : ~1.4GB RAM
Disque           : ~3GB

+ Marge sécurité : 2GB RAM
──────────────────────────
Minimum requis   : 4GB RAM
```

---

## 🏗️ Étape 1 : Créer le Serveur sur Hetzner

### Via Console Web (https://console.hetzner.com)

1. **Projet** : Accédez à votre projet `12472562`
2. **Serveurs** : Cliquez sur "Ajouter un serveur"
3. **Configuration** :
   ```
   Localisation : Nuremberg (Allemagne)
   Type         : CX41 (4 vCPU, 16GB RAM)
   Image        : Ubuntu 22.04
   Réseau       : IPv4 + IPv6
   SSH Key      : Ajoutez votre clé SSH publique
   Nom          : iafactory-ragdz-prod
   ```

4. **Firewall** (Important) :
   ```
   Créer un nouveau firewall :

   Règles entrantes :
   - SSH (22)        : Votre IP uniquement
   - HTTP (80)       : 0.0.0.0/0 (tout le monde)
   - HTTPS (443)     : 0.0.0.0/0 (tout le monde)
   - 8180            : 0.0.0.0/0 (Backend API)
   - 8182            : 0.0.0.0/0 (Hub UI)
   - 8183            : 0.0.0.0/0 (Docs UI)
   - 8184            : 0.0.0.0/0 (Bolt Studio)
   - 8185            : Votre IP uniquement (n8n admin)

   Règles sortantes :
   - Autoriser tout
   ```

5. **Créer le serveur** : Cliquez sur "Créer et Acheter"

**Vous recevrez** :
- IP publique : `X.X.X.X`
- Mot de passe root (par email)

---

## 🔧 Étape 2 : Configuration Initiale du Serveur

### Connexion SSH

```bash
# Remplacez X.X.X.X par l'IP de votre serveur
ssh root@X.X.X.X
```

### Installation des Dépendances

```bash
# 1. Mise à jour du système
apt update && apt upgrade -y

# 2. Installation Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. Installation Docker Compose
apt install docker-compose-plugin -y

# 4. Vérification
docker --version
docker compose version

# 5. Installation utilitaires
apt install git curl wget nano htop -y

# 6. Configuration firewall UFW (optionnel si firewall Hetzner)
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 8180/tcp  # Backend
ufw allow 8182/tcp  # Hub
ufw allow 8183/tcp  # Docs
ufw allow 8184/tcp  # Bolt
ufw --force enable
```

---

## 📦 Étape 3 : Transfert du Projet

### Option A : Via Git (Recommandé)

```bash
# 1. Créer dossier projet
mkdir -p /opt/iafactory
cd /opt/iafactory

# 2. Cloner depuis votre repo (si vous en avez un)
git clone https://github.com/VOTRE_USERNAME/rag-dz.git .

# Ou initialiser un nouveau repo
git init
```

### Option B : Via SCP (depuis votre PC Windows)

```bash
# Sur votre PC Windows (Git Bash ou PowerShell)
cd C:\Users\bbens\rag-dz

# Compresser le projet (exclure node_modules)
tar -czf ragdz.tar.gz \
  --exclude='node_modules' \
  --exclude='frontend/*/node_modules' \
  --exclude='frontend/*/dist' \
  --exclude='frontend/*/build' \
  --exclude='.git' \
  --exclude='__pycache__' \
  .

# Transférer vers le serveur (remplacez X.X.X.X)
scp ragdz.tar.gz root@X.X.X.X:/opt/iafactory/

# Sur le serveur, extraire
cd /opt/iafactory
tar -xzf ragdz.tar.gz
rm ragdz.tar.gz
```

---

## ⚙️ Étape 4 : Configuration pour Production

### 1. Créer `.env` pour Production

```bash
cd /opt/iafactory
cp .env.example .env.prod
nano .env.prod
```

**Configuration `.env.prod`** :
```bash
# === SERVEUR PRODUCTION ===
SERVER_HOST=X.X.X.X  # Remplacez par IP Hetzner
SERVER_DOMAIN=iafactory.votredomaine.com  # Si vous avez un domaine

# === POSTGRESQL ===
POSTGRES_USER=postgres
POSTGRES_PASSWORD=CHANGEZ_CE_MOT_DE_PASSE_SECURISE_123!
POSTGRES_DB=iafactory_dz

# === REDIS ===
REDIS_PASSWORD=CHANGEZ_MOT_DE_PASSE_REDIS_456!

# === GROQ API (Primary LLM) ===
GROQ_API_KEY=votre_cle_groq_ici

# === OpenAI (Fallback) ===
OPENAI_API_KEY=votre_cle_openai_ici

# === Anthropic (Claude) ===
ANTHROPIC_API_KEY=votre_cle_anthropic_ici

# === DeepSeek ===
DEEPSEEK_API_KEY=votre_cle_deepseek_ici

# === Google Gemini ===
GOOGLE_API_KEY=votre_cle_google_ici

# === Mistral ===
MISTRAL_API_KEY=votre_cle_mistral_ici

# === Cohere ===
COHERE_API_KEY=votre_cle_cohere_ici

# === Together AI ===
TOGETHER_API_KEY=votre_cle_together_ici

# === OpenRouter ===
OPENROUTER_API_KEY=votre_cle_openrouter_ici

# === Video Studio ===
PIAPI_KEY=votre_cle_piapi_ici
REPLICATE_API_TOKEN=votre_token_replicate_ici
HF_API_TOKEN=votre_token_huggingface_ici

# === Intégrations ===
VAPI_API_KEY=votre_cle_vapi_ici
VAPI_PHONE_NUMBER_ID=votre_numero_vapi

CAL_COM_API_KEY=votre_cle_calcom_ici

TWILIO_ACCOUNT_SID=votre_sid_twilio
TWILIO_AUTH_TOKEN=votre_token_twilio
TWILIO_PHONE_NUMBER=+15551234567

# === n8n ===
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=CHANGEZ_MOT_DE_PASSE_N8N_789!

# === SECURITE ===
SECRET_KEY=GENEREZ_UNE_CLE_SECRETE_ALEATOIRE_LONGUE_64_CHARS
JWT_SECRET=GENEREZ_AUTRE_CLE_SECRETE_ALEATOIRE_64_CHARS
```

**Générer des clés sécurisées** :
```bash
# Générer SECRET_KEY
openssl rand -hex 32

# Générer JWT_SECRET
openssl rand -hex 32

# Générer mot de passe fort
openssl rand -base64 24
```

### 2. Créer `docker-compose.prod.yml`

```bash
nano docker-compose.prod.yml
```

**Contenu** :
```yaml
version: '3.8'

services:
  iafactory-postgres:
    image: pgvector/pgvector:pg16
    container_name: iaf-prod-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
      TZ: Europe/Berlin
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./infrastructure/sql/init.sql:/docker-entrypoint-initdb.d/01-init.sql
      - ./infrastructure/sql/pgvector_migration.sql:/docker-entrypoint-initdb.d/02-pgvector.sql
    ports:
      - "127.0.0.1:6330:5432"  # Accessible uniquement en local
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - iafactory-network

  iafactory-redis:
    image: redis:7-alpine
    container_name: iaf-prod-redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    ports:
      - "127.0.0.1:6331:6379"  # Accessible uniquement en local
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    volumes:
      - redis_data:/data
    networks:
      - iafactory-network

  iafactory-qdrant:
    image: qdrant/qdrant:latest
    container_name: iaf-prod-qdrant
    restart: unless-stopped
    ports:
      - "127.0.0.1:6332:6333"  # Accessible uniquement en local
    volumes:
      - qdrant_data:/qdrant/storage
    networks:
      - iafactory-network

  iafactory-backend:
    build:
      context: ./backend/rag-compat
      dockerfile: Dockerfile
    container_name: iaf-prod-backend
    restart: unless-stopped
    env_file:
      - .env.prod
    depends_on:
      iafactory-postgres:
        condition: service_healthy
      iafactory-redis:
        condition: service_healthy
      iafactory-qdrant:
        condition: service_started
    ports:
      - "0.0.0.0:8180:8180"  # Accessible publiquement
    volumes:
      - ./backend/rag-compat/app:/app/app
      - backend_uploads:/app/uploads
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8180/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - iafactory-network

  iafactory-hub:
    build:
      context: ./frontend/archon-ui
      dockerfile: Dockerfile
    container_name: iaf-prod-hub
    restart: unless-stopped
    environment:
      VITE_API_URL: http://${SERVER_HOST}:8180
      VITE_WS_URL: ws://${SERVER_HOST}:8180
    ports:
      - "0.0.0.0:8182:3737"  # Accessible publiquement
    depends_on:
      - iafactory-backend
    networks:
      - iafactory-network

  iafactory-docs:
    build:
      context: ./frontend/rag-ui
      dockerfile: Dockerfile
    container_name: iaf-prod-docs
    restart: unless-stopped
    environment:
      VITE_API_URL: http://${SERVER_HOST}:8180
    ports:
      - "0.0.0.0:8183:5173"  # Accessible publiquement
    depends_on:
      - iafactory-backend
    networks:
      - iafactory-network

  iafactory-studio:
    build:
      context: ./bolt-diy
      dockerfile: Dockerfile
    container_name: iaf-prod-studio
    restart: unless-stopped
    environment:
      VITE_API_URL: http://${SERVER_HOST}:8180
    ports:
      - "0.0.0.0:8184:5173"  # Accessible publiquement
    volumes:
      - ./bolt-diy:/app
      - /app/node_modules
    networks:
      - iafactory-network

  iafactory-n8n:
    image: docker.n8n.io/n8nio/n8n:latest
    container_name: iaf-prod-n8n
    restart: unless-stopped
    depends_on:
      iafactory-postgres:
        condition: service_healthy
    environment:
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: iafactory-postgres
      DB_POSTGRESDB_PORT: 5432
      DB_POSTGRESDB_DATABASE: ${POSTGRES_DB}
      DB_POSTGRESDB_USER: ${POSTGRES_USER}
      DB_POSTGRESDB_PASSWORD: ${POSTGRES_PASSWORD}
      DB_POSTGRESDB_SCHEMA: n8n
      N8N_BASIC_AUTH_ACTIVE: "true"
      N8N_BASIC_AUTH_USER: ${N8N_BASIC_AUTH_USER}
      N8N_BASIC_AUTH_PASSWORD: ${N8N_BASIC_AUTH_PASSWORD}
      N8N_HOST: ${SERVER_HOST}
      N8N_PORT: 5678
      N8N_PROTOCOL: http
      WEBHOOK_URL: http://${SERVER_HOST}:8185/
    ports:
      - "127.0.0.1:8185:5678"  # Accessible uniquement en local (admin)
    volumes:
      - n8n_data:/home/node/.n8n
      - ./infrastructure/n8n/workflows:/home/node/.n8n/workflows
    networks:
      - iafactory-network

volumes:
  postgres_data:
  redis_data:
  qdrant_data:
  backend_uploads:
  n8n_data:

networks:
  iafactory-network:
    driver: bridge
```

---

## 🚀 Étape 5 : Déploiement

### 1. Exécuter les Migrations SQL

```bash
cd /opt/iafactory

# Démarrer uniquement PostgreSQL
docker compose -f docker-compose.prod.yml up -d iafactory-postgres

# Attendre que PostgreSQL soit prêt
sleep 10

# Exécuter les migrations
for sql_file in backend/rag-compat/migrations/*.sql; do
  echo "=== Executing $sql_file ==="
  docker exec -i iaf-prod-postgres psql -U postgres -d iafactory_dz < "$sql_file"
done

# Vérifier les tables
docker exec iaf-prod-postgres psql -U postgres -d iafactory_dz -c "\dt"
```

### 2. Build et Démarrage

```bash
# Build toutes les images
docker compose -f docker-compose.prod.yml build

# Démarrer tous les services
docker compose -f docker-compose.prod.yml up -d

# Vérifier le status
docker compose -f docker-compose.prod.yml ps

# Voir les logs
docker compose -f docker-compose.prod.yml logs -f
```

### 3. Vérification

```bash
# Test backend
curl http://localhost:8180/health

# Test depuis l'extérieur (remplacez X.X.X.X)
curl http://X.X.X.X:8180/health
```

---

## 🌐 Étape 6 : Configuration Domaine (Optionnel)

### Avec Nginx Reverse Proxy + Let's Encrypt

```bash
# 1. Installer Nginx
apt install nginx certbot python3-certbot-nginx -y

# 2. Configuration Nginx
nano /etc/nginx/sites-available/iafactory
```

**Contenu** :
```nginx
server {
    listen 80;
    server_name iafactory.votredomaine.com;

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8180/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Hub UI
    location / {
        proxy_pass http://localhost:8182/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Docs UI
    location /docs/ {
        proxy_pass http://localhost:8183/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Bolt Studio
    location /bolt/ {
        proxy_pass http://localhost:8184/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 3. Activer le site
ln -s /etc/nginx/sites-available/iafactory /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# 4. Obtenir certificat SSL
certbot --nginx -d iafactory.votredomaine.com
```

---

## 📊 Étape 7 : Monitoring

### Installation Portainer (Optionnel)

```bash
docker volume create portainer_data

docker run -d \
  -p 9000:9000 \
  --name portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```

**Accès** : http://X.X.X.X:9000

### Logs et Monitoring

```bash
# Logs en temps réel
docker compose -f docker-compose.prod.yml logs -f

# Logs d'un service spécifique
docker compose -f docker-compose.prod.yml logs -f iafactory-backend

# Utilisation ressources
docker stats

# Espace disque
df -h
```

---

## 🔒 Étape 8 : Sécurité

### 1. Fail2ban (Protection SSH)

```bash
apt install fail2ban -y

# Configuration
nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
```

```bash
systemctl enable fail2ban
systemctl start fail2ban
```

### 2. Mises à Jour Automatiques

```bash
apt install unattended-upgrades -y
dpkg-reconfigure --priority=low unattended-upgrades
```

### 3. Backup Automatique

```bash
# Créer script backup
nano /root/backup-iafactory.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backup/iafactory"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup PostgreSQL
docker exec iaf-prod-postgres pg_dump -U postgres iafactory_dz | gzip > $BACKUP_DIR/postgres_$DATE.sql.gz

# Backup volumes
docker run --rm \
  -v iafactory_postgres_data:/data \
  -v $BACKUP_DIR:/backup \
  alpine tar czf /backup/volumes_$DATE.tar.gz /data

# Nettoyer vieux backups (garder 7 jours)
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup terminé: $DATE"
```

```bash
chmod +x /root/backup-iafactory.sh

# Cron quotidien à 3h du matin
crontab -e
```

Ajouter :
```
0 3 * * * /root/backup-iafactory.sh >> /var/log/backup-iafactory.log 2>&1
```

---

## ✅ Vérification Finale

### URLs Publiques (Remplacez X.X.X.X par votre IP)

- **Backend API** : http://X.X.X.X:8180/docs
- **Hub UI** : http://X.X.X.X:8182
- **Docs UI** : http://X.X.X.X:8183
- **Bolt Studio** : http://X.X.X.X:8184
- **n8n** : http://X.X.X.X:8185 (uniquement depuis serveur)

### Tests

```bash
# Health check
curl http://X.X.X.X:8180/health

# Agents BMAD
curl http://X.X.X.X:8180/api/bmad/agents

# Credentials
curl http://X.X.X.X:8180/api/credentials/
```

---

## 🚨 Dépannage

### Services ne démarrent pas

```bash
# Voir les logs
docker compose -f docker-compose.prod.yml logs

# Redémarrer un service
docker compose -f docker-compose.prod.yml restart iafactory-backend

# Rebuild complet
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

### Problème de mémoire

```bash
# Vérifier utilisation
free -h
docker stats

# Augmenter swap
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### Problème de connexion

```bash
# Vérifier firewall
ufw status
iptables -L

# Vérifier ports ouverts
netstat -tulpn | grep -E '8180|8182|8183|8184|8185'
```

---

## 💰 Coûts Mensuels Estimés

### Hetzner Cloud
- **CX41 (4 vCPU, 16GB)** : ~€14.99/mois
- **Backup automatique** : +€1.50/mois (optionnel)
- **Floating IP** : +€1.19/mois (optionnel)

### API Keys (si vous les utilisez toutes)
- **Groq** : Gratuit (rate limited)
- **OpenAI** : $5-20/mois selon usage
- **Anthropic** : $10-30/mois selon usage
- Autres : Gratuits ou usage

**Total estimé** : €15-50/mois selon API usage

---

## 📞 Support

En cas de problème :
1. Vérifiez les logs : `docker compose logs`
2. Vérifiez les ressources : `docker stats`
3. Vérifiez le réseau : `docker network inspect iafactory-network`

---

**Guide créé par** : Claude Code
**Date** : 2025-11-24
**Version** : 1.0 - Production Ready
