# 🚀 Guide de Déploiement VPS - IAFactory RAG Algérie

**Version**: 1.0.0
**Date**: 2 Décembre 2025
**Auteur**: IAFactory Team

---

## 📋 **TABLE DES MATIÈRES**

1. [Prérequis](#prérequis)
2. [Configuration VPS](#configuration-vps)
3. [Installation Automatique](#installation-automatique)
4. [Installation Manuelle](#installation-manuelle)
5. [Configuration SSL](#configuration-ssl)
6. [Configuration des Clés API](#configuration-des-clés-api)
7. [Vérification & Tests](#vérification--tests)
8. [Monitoring & Logs](#monitoring--logs)
9. [Backup & Restauration](#backup--restauration)
10. [Maintenance](#maintenance)
11. [Dépannage](#dépannage)

---

## 1️⃣ **PRÉREQUIS**

### **VPS Recommandé**

| Composant | Minimum | Recommandé | Production |
|-----------|---------|------------|------------|
| CPU | 2 cores | 4 cores | 8 cores |
| RAM | 4 GB | 8 GB | 16 GB |
| Stockage | 40 GB SSD | 80 GB SSD | 200 GB SSD |
| Bande passante | 1 TB/mois | 2 TB/mois | Illimité |

### **Système d'exploitation supporté**:
- ✅ Ubuntu 22.04 LTS (Recommandé)
- ✅ Debian 11
- ✅ AlmaLinux 9
- ✅ RHEL 9

### **Domaines DNS** (à configurer avant):
```
A     www.iafactoryalgeria.com        → VOTRE_IP_VPS
A     api.iafactoryalgeria.com        → VOTRE_IP_VPS
A     hub.iafactoryalgeria.com        → VOTRE_IP_VPS
A     studio.iafactoryalgeria.com     → VOTRE_IP_VPS
A     n8n.iafactoryalgeria.com        → VOTRE_IP_VPS
A     monitoring.iafactoryalgeria.com → VOTRE_IP_VPS
```

### **Ports à ouvrir** (Firewall):
- `22` - SSH
- `80` - HTTP
- `443` - HTTPS

---

## 2️⃣ **CONFIGURATION VPS**

### **Connexion SSH**

```bash
ssh root@VOTRE_IP_VPS
```

### **Mise à jour du système**

```bash
# Ubuntu/Debian
apt update && apt upgrade -y

# AlmaLinux/RHEL
yum update -y
```

### **Configuration du hostname**

```bash
hostnamectl set-hostname iafactory-prod
```

### **Ajout d'un utilisateur (optionnel mais recommandé)**

```bash
adduser iafactory
usermod -aG sudo iafactory
su - iafactory
```

---

## 3️⃣ **INSTALLATION AUTOMATIQUE** ⭐ (Recommandé)

### **Option A: Script d'installation complet**

```bash
# Télécharger le script
curl -o deploy-vps-complete.sh https://raw.githubusercontent.com/votre-org/rag-dz/main/deploy-vps-complete.sh

# Rendre exécutable
chmod +x deploy-vps-complete.sh

# Lancer l'installation (en root)
sudo DOMAIN=www.iafactoryalgeria.com \
     EMAIL=admin@iafactoryalgeria.com \
     ./deploy-vps-complete.sh
```

Le script va automatiquement:
- ✅ Installer Docker & Docker Compose
- ✅ Configurer le firewall
- ✅ Installer Nginx
- ✅ Configurer SSL avec Let's Encrypt
- ✅ Cloner le repository
- ✅ Démarrer les services
- ✅ Configurer le monitoring
- ✅ Configurer les backups automatiques

**Durée estimée**: 15-20 minutes

### **Variables d'environnement disponibles**:

```bash
DOMAIN=www.iafactoryalgeria.com     # Domaine principal
EMAIL=admin@iafactoryalgeria.com    # Email admin (SSL)
INSTALL_DIR=/opt/iafactory          # Répertoire d'installation
GIT_REPO=https://...                # Repository Git
GIT_BRANCH=main                     # Branche à déployer
ENABLE_SSL=true                     # Activer SSL
ENABLE_MONITORING=true              # Activer monitoring
ENABLE_BACKUP=true                  # Activer backups
```

---

## 4️⃣ **INSTALLATION MANUELLE**

Si vous préférez installer manuellement:

### **Étape 1: Installation de Docker**

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl start docker
sudo systemctl enable docker

# Vérifier
docker --version
docker-compose --version
```

### **Étape 2: Clone du repository**

```bash
cd /opt
sudo git clone https://github.com/votre-org/rag-dz.git iafactory
cd /opt/iafactory
```

### **Étape 3: Configuration de l'environnement**

```bash
# Copier le template
cp .env.production.template .env.production

# Éditer avec vos clés API
nano .env.production
```

**Variables CRITIQUES à configurer**:
```bash
# Domaines
DOMAIN=www.iafactoryalgeria.com
ADMIN_EMAIL=admin@iafactoryalgeria.com

# Security (générez avec: openssl rand -hex 32)
API_SECRET_KEY=<GÉNÉREZ_UN_SECRET_FORT>
JWT_SECRET_KEY=<GÉNÉREZ_UN_SECRET_FORT>

# Database
POSTGRES_PASSWORD=<MOT_DE_PASSE_SÉCURISÉ>
REDIS_PASSWORD=<MOT_DE_PASSE_SÉCURISÉ>

# LLM Provider (au minimum 1)
GROQ_API_KEY=gsk_VOTRE_CLE_GROQ
# OU
OPENAI_API_KEY=sk-VOTRE_CLE_OPENAI
```

### **Étape 4: Démarrage des services**

```bash
# Build des images
docker-compose build --parallel

# Démarrage en mode détaché
docker-compose up -d

# Vérifier les services
docker-compose ps
```

### **Étape 5: Configuration Nginx**

```bash
# Copier la configuration
sudo cp nginx/nginx.conf /etc/nginx/nginx.conf

# Copier les landing pages
sudo cp landing-complete-responsive.html /var/www/html/
sudo cp -r docs /var/www/html/
sudo cp -r apps /var/www/html/

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

---

## 5️⃣ **CONFIGURATION SSL**

### **Automatique avec le script**

```bash
cd /opt/iafactory
sudo chmod +x nginx/setup-ssl.sh
sudo DOMAIN=www.iafactoryalgeria.com EMAIL=admin@iafactoryalgeria.com nginx/setup-ssl.sh
```

### **Manuelle avec Certbot**

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir les certificats
sudo certbot --nginx \
    -d www.iafactoryalgeria.com \
    -d api.iafactoryalgeria.com \
    -d hub.iafactoryalgeria.com \
    -d studio.iafactoryalgeria.com \
    --email admin@iafactoryalgeria.com \
    --agree-tos \
    --no-eff-email

# Renouvellement automatique (déjà configuré)
sudo systemctl status certbot.timer
```

### **Vérifier SSL**

```bash
# Test en ligne
# https://www.ssllabs.com/ssltest/

# Test local
curl -I https://www.iafactoryalgeria.com
```

---

## 6️⃣ **CONFIGURATION DES CLÉS API**

### **Éditez le fichier .env.production**

```bash
cd /opt/iafactory
sudo nano .env.production
```

### **Providers LLM essentiels**:

#### **1. Groq (Gratuit et rapide)** ⭐ Recommandé

```bash
# 1. Créer un compte: https://console.groq.com/
# 2. Obtenir une clé API
# 3. Ajouter dans .env.production:
GROQ_API_KEY=gsk_VOTRE_CLE_ICI
LLM_PROVIDER=groq
LLM_MODEL=llama-3.3-70b-versatile
```

#### **2. OpenAI (Payant - haute qualité)**

```bash
# 1. Créer un compte: https://platform.openai.com/
# 2. Ajouter un moyen de paiement
# 3. Générer une clé API
OPENAI_API_KEY=sk-VOTRE_CLE_ICI
```

#### **3. Anthropic Claude (Payant - excellent pour le code)**

```bash
# 1. Créer un compte: https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-VOTRE_CLE_ICI
```

### **Services optionnels**:

#### **ElevenLabs (Voice TTS)**

```bash
# https://elevenlabs.io/
ELEVENLABS_API_KEY=VOTRE_CLE_ICI
```

#### **Twilio (SMS/WhatsApp)**

```bash
# https://www.twilio.com/
TWILIO_ACCOUNT_SID=VOTRE_SID
TWILIO_AUTH_TOKEN=VOTRE_TOKEN
TWILIO_PHONE_NUMBER=+213XXXXXXXXX
```

### **Redémarrer après modification**

```bash
cd /opt/iafactory
docker-compose restart
```

---

## 7️⃣ **VÉRIFICATION & TESTS**

### **Vérifier les services Docker**

```bash
cd /opt/iafactory
docker-compose ps

# Tous les services doivent être "Up"
```

### **Test du Backend API**

```bash
# Health check
curl https://api.iafactoryalgeria.com/health

# Réponse attendue:
# {"status":"healthy","timestamp":...}

# Documentation API
curl https://api.iafactoryalgeria.com/docs
```

### **Test des Frontends**

```bash
# Landing page
curl -I https://www.iafactoryalgeria.com
# → 200 OK

# Archon Hub
curl -I https://hub.iafactoryalgeria.com
# → 200 OK

# Bolt Studio
curl -I https://studio.iafactoryalgeria.com
# → 200 OK
```

### **Test de l'API Chat**

```bash
curl -X POST https://api.iafactoryalgeria.com/api/agent-chat/messages \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test",
    "content": "Bonjour, comment ça va?"
  }'
```

### **Vérifier les logs**

```bash
# Logs de tous les services
docker-compose logs -f

# Backend uniquement
docker-compose logs -f iafactory-backend

# Rechercher les erreurs
docker-compose logs | grep -i error
```

---

## 8️⃣ **MONITORING & LOGS**

### **Accès Grafana**

```bash
# URL: https://monitoring.iafactoryalgeria.com
# Login: admin
# Password: (configuré dans .env.production)
```

### **Dashboards disponibles**:
- 📊 Système (CPU, RAM, Disk)
- 🐳 Docker Containers
- 📈 Backend API (Requests, Latency)
- 💾 PostgreSQL
- 🔥 Redis Cache

### **Prometheus Metrics**

```bash
# Métriques brutes
curl http://localhost:8187/metrics
```

### **Logs en temps réel**

```bash
# Tous les services
docker-compose logs -f --tail=100

# Backend API
docker-compose logs -f iafactory-backend

# Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### **Logs système**

```bash
# Journal système
sudo journalctl -u docker -f

# Logs IAFactory
tail -f /var/log/iafactory-*.log
```

---

## 9️⃣ **BACKUP & RESTAURATION**

### **Backup Automatique**

Le script de backup est configuré pour s'exécuter automatiquement à 2h du matin:

```bash
# Vérifier le cron job
crontab -l | grep backup

# Lancer un backup manuel
sudo /opt/iafactory/scripts/backup.sh
```

### **Contenu des backups**:
- ✅ PostgreSQL (dump SQL)
- ✅ Redis (dump RDB)
- ✅ Volumes Docker
- ✅ Fichiers de configuration
- ✅ Certificats SSL

### **Localisation des backups**:
```
/var/backups/iafactory/
├── 2025-12-01/
│   ├── postgres_20251201_020000.sql.gz
│   ├── redis_20251201_020000.rdb.gz
│   ├── config_20251201_020000.tar.gz
│   └── volume_*.tar.gz
├── 2025-12-02/
└── ...
```

### **Restauration PostgreSQL**

```bash
# Arrêter le backend
docker-compose stop iafactory-backend

# Restaurer la base de données
gunzip < /var/backups/iafactory/2025-12-01/postgres_20251201_020000.sql.gz | \
  docker exec -i iaf-dz-postgres psql -U postgres

# Redémarrer
docker-compose start iafactory-backend
```

### **Restauration volume Docker**

```bash
# Arrêter le service
docker-compose stop iafactory-postgres

# Supprimer l'ancien volume
docker volume rm iaf-dz-postgres-data

# Créer un nouveau volume
docker volume create iaf-dz-postgres-data

# Restaurer depuis le backup
docker run --rm \
  -v iaf-dz-postgres-data:/data \
  -v /var/backups/iafactory/2025-12-01:/backup \
  alpine \
  tar xzf /backup/volume_iaf-dz-postgres-data_20251201_020000.tar.gz -C /data

# Redémarrer
docker-compose start iafactory-postgres
```

### **Upload vers S3** (optionnel)

```bash
# Installer AWS CLI
sudo apt install awscli

# Configurer
aws configure

# Activer dans .env.production
S3_ENABLED=true
S3_BUCKET=iafactory-backups-dz
AWS_REGION=eu-central-1
```

---

## 🔟 **MAINTENANCE**

### **Mise à jour du code**

```bash
cd /opt/iafactory

# Sauvegarder
sudo ./scripts/backup.sh

# Pull des dernières modifications
git pull origin main

# Rebuild et redémarrage
docker-compose build --parallel
docker-compose up -d
```

### **Mise à jour des images Docker**

```bash
# Pull des nouvelles images
docker-compose pull

# Redémarrage avec les nouvelles images
docker-compose up -d
```

### **Nettoyage Docker**

```bash
# Supprimer les images inutilisées
docker image prune -a

# Supprimer les volumes inutilisés
docker volume prune

# Nettoyage complet
docker system prune -a --volumes
```

### **Rotation des logs**

```bash
# Configuration logrotate
sudo nano /etc/logrotate.d/iafactory
```

```conf
/var/log/iafactory-*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0640 root root
}
```

### **Redémarrage des services**

```bash
# Redémarrage gracieux
docker-compose restart

# Redémarrage forcé
docker-compose down
docker-compose up -d

# Redémarrage d'un service spécifique
docker-compose restart iafactory-backend
```

---

## 🔧 **DÉPANNAGE**

### **Service ne démarre pas**

```bash
# Voir les logs
docker-compose logs <service-name>

# Vérifier l'état
docker-compose ps

# Redémarrer
docker-compose restart <service-name>
```

### **Erreur de connexion à la base de données**

```bash
# Vérifier PostgreSQL
docker exec iaf-dz-postgres pg_isready -U postgres

# Vérifier les credentials dans .env.production
cat .env.production | grep POSTGRES

# Redémarrer PostgreSQL
docker-compose restart iafactory-postgres
```

### **Erreur SSL**

```bash
# Vérifier les certificats
sudo certbot certificates

# Renouveler manuellement
sudo certbot renew

# Test
curl -I https://www.iafactoryalgeria.com
```

### **Manque d'espace disque**

```bash
# Vérifier l'espace
df -h

# Nettoyer Docker
docker system prune -a --volumes

# Nettoyer les logs
sudo rm -rf /var/log/nginx/*.gz
sudo rm -rf /var/log/*.gz
```

### **Performance lente**

```bash
# Vérifier les ressources
docker stats

# Vérifier la charge système
htop

# Redimensionner les ressources dans docker-compose.yml
nano docker-compose.yml
# Augmenter memory et cpus
```

### **API retourne des erreurs**

```bash
# Logs backend
docker-compose logs -f iafactory-backend

# Vérifier les variables d'environnement
docker exec iaf-dz-backend env | grep API_

# Vérifier les clés LLM
docker exec iaf-dz-backend env | grep -E '(GROQ|OPENAI|ANTHROPIC)_API_KEY'
```

---

## 📞 **SUPPORT**

### **Documentation**:
- 📖 [README.md](README.md)
- 📋 [INVENTAIRE_COMPLET_RAG-DZ.md](INVENTAIRE_COMPLET_RAG-DZ.md)
- 🔧 [API Documentation](https://api.iafactoryalgeria.com/docs)

### **Logs importants**:
```bash
/var/log/iafactory-install.log      # Installation
/var/log/iafactory-backup.log       # Backups
/var/log/nginx/access.log           # Nginx accès
/var/log/nginx/error.log            # Nginx erreurs
```

### **Commandes utiles**:

```bash
# État des services
docker-compose ps

# Logs en temps réel
docker-compose logs -f

# Restart complet
docker-compose down && docker-compose up -d

# Backup manuel
sudo /opt/iafactory/scripts/backup.sh

# Santé du système
docker stats
htop
df -h
```

---

## ✅ **CHECKLIST POST-DÉPLOIEMENT**

- [ ] Tous les services Docker sont "Up"
- [ ] API répond sur `/health`
- [ ] SSL configuré (A+ sur SSL Labs)
- [ ] DNS configurés correctement
- [ ] Clés API LLM configurées
- [ ] Firewall configuré (ports 80, 443 ouverts)
- [ ] Fail2Ban actif
- [ ] Backups automatiques configurés
- [ ] Monitoring Grafana accessible
- [ ] Tests des endpoints API réussis
- [ ] Landing page accessible
- [ ] Hub accessible
- [ ] Studio accessible

---

**🎉 Félicitations ! Votre instance IAFactory RAG Algérie est maintenant en production !**

---

**Dernière mise à jour**: 2 Décembre 2025
**Version**: 1.0.0
**Contact**: admin@iafactoryalgeria.com
