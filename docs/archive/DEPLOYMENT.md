# 🚀 IAFactory RAG-DZ - Guide de Déploiement

## 📋 Prérequis

### Matériel Recommandé (VPS)
- **Serveur**: Hetzner CPX51 ou équivalent
- **CPU**: 16 cores minimum
- **RAM**: 32GB minimum
- **Disque**: 200GB SSD
- **Coût**: ~€49/mois

### Logiciels Requis
- Docker 24+ et Docker Compose V2
- Git
- SSH access au VPS
- Nom de domaine (optionnel mais recommandé)

---

## 🔧 Préparation

### 1. Configurer le VPS

```bash
# Connexion au VPS
ssh root@YOUR_VPS_IP

# Installer Docker
curl -fsSL https://get.docker.com | bash

# Installer Docker Compose V2
apt-get install docker-compose-plugin

# Vérifier installation
docker --version
docker compose version
```

### 2. Configurer les Variables d'Environnement

```bash
# Sur votre machine locale
cp .env.production .env

# Éditer .env et remplir TOUTES les valeurs requises
nano .env
```

**Variables OBLIGATOIRES:**
- `API_SECRET_KEY` - Clé secrète (32+ caractères)
- `POSTGRES_PASSWORD` - Mot de passe PostgreSQL
- `REDIS_PASSWORD` - Mot de passe Redis
- Au moins UNE clé API LLM (Groq, OpenAI, Anthropic, etc.)

### 3. Configurer SSH (si pas déjà fait)

```bash
# Générer une clé SSH si vous n'en avez pas
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copier la clé vers le VPS
ssh-copy-id root@YOUR_VPS_IP
```

---

## 🚀 Déploiement Automatique

### Méthode 1: Script de Déploiement (Recommandé)

```bash
# Rendre le script exécutable
chmod +x deploy-to-vps.sh

# Déployer en production
./deploy-to-vps.sh prod

# Ou pour un environnement de développement
./deploy-to-vps.sh dev
```

Le script va:
1. ✅ Vérifier les prérequis
2. ✅ Créer le dossier sur le VPS
3. ✅ Synchroniser les fichiers (rsync)
4. ✅ Configurer l'environnement
5. ✅ Construire les containers Docker
6. ✅ Démarrer les services
7. ✅ Vérifier le déploiement

### Méthode 2: Déploiement Manuel

```bash
# 1. Copier les fichiers vers le VPS
scp -r . root@YOUR_VPS_IP:/opt/iafactory-rag-dz/

# 2. Se connecter au VPS
ssh root@YOUR_VPS_IP

# 3. Aller dans le dossier
cd /opt/iafactory-rag-dz

# 4. Créer .env depuis le template
cp .env.production .env
nano .env  # Remplir les valeurs

# 5. Construire et démarrer
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

# 6. Vérifier
docker compose ps
docker compose logs -f
```

---

## ✅ Vérification du Déploiement

### Vérifier les Services

```bash
# Se connecter au VPS
ssh root@YOUR_VPS_IP
cd /opt/iafactory-rag-dz

# Voir les containers actifs
docker compose ps

# Vérifier les logs
docker compose logs -f

# Vérifier la santé du backend
curl http://localhost:8181/health

# Vérifier le frontend
curl http://localhost:3000
```

### Résultat Attendu

Vous devriez voir:
- ✅ `iaf-backend-prod` - Running (healthy)
- ✅ `iaf-studio-prod` - Running (healthy)
- ✅ `iaf-postgres-prod` - Running (healthy)
- ✅ `iaf-redis-prod` - Running (healthy)

### URLs d'Accès

Une fois déployé:
- **Frontend**: http://YOUR_VPS_IP:3000
- **Backend API**: http://YOUR_VPS_IP:8181
- **API Docs**: http://YOUR_VPS_IP:8181/docs
- **Health Check**: http://YOUR_VPS_IP:8181/health

---

## 🔐 Configuration Nginx + SSL (Recommandé)

### 1. Installer Nginx sur le VPS

```bash
apt-get update
apt-get install nginx certbot python3-certbot-nginx
```

### 2. Configurer Nginx

```nginx
# /etc/nginx/sites-available/iafactory

server {
    listen 80;
    server_name iafactory.dz www.iafactory.dz;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8181/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /ws {
        proxy_pass http://localhost:8181/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

### 3. Activer et Obtenir SSL

```bash
# Activer le site
ln -s /etc/nginx/sites-available/iafactory /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Obtenir certificat SSL (Let's Encrypt)
certbot --nginx -d iafactory.dz -d www.iafactory.dz
```

---

## 🔄 Commandes Utiles

### Gestion des Services

```bash
# Voir les logs en temps réel
docker compose logs -f

# Voir les logs d'un service spécifique
docker compose logs -f iafactory-backend

# Redémarrer tous les services
docker compose restart

# Redémarrer un service spécifique
docker compose restart iafactory-backend

# Arrêter tous les services
docker compose down

# Arrêter et supprimer les volumes
docker compose down -v

# Reconstruire et redémarrer
docker compose up -d --build
```

### Mise à Jour du Code

```bash
# Sur votre machine locale
./deploy-to-vps.sh prod

# Ou manuellement sur le VPS
cd /opt/iafactory-rag-dz
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

### Backup de la Base de Données

```bash
# Backup PostgreSQL
docker compose exec postgres-prod pg_dump -U postgres archon > backup_$(date +%Y%m%d).sql

# Restaurer depuis backup
cat backup_20240101.sql | docker compose exec -T postgres-prod psql -U postgres archon
```

### Monitoring

```bash
# Voir l'utilisation des ressources
docker stats

# Voir les processus
docker compose top

# Espace disque
df -h
du -sh /var/lib/docker
```

---

## 🐛 Dépannage

### Backend ne démarre pas

```bash
# Vérifier les logs
docker compose logs iafactory-backend

# Problèmes courants:
# 1. Variables d'environnement manquantes
cat .env | grep API_SECRET_KEY

# 2. Base de données pas prête
docker compose logs postgres-prod

# 3. Redémarrer
docker compose restart iafactory-backend
```

### Frontend erreur 502

```bash
# Vérifier que Vite écoute sur le bon port
docker compose logs iafactory-frontend

# Vérifier les variables d'env
docker compose exec iafactory-frontend env | grep VITE
```

### Base de données corrompue

```bash
# Supprimer et recréer
docker compose down
docker volume rm iaf-postgres-prod-data
docker compose up -d
```

---

## 📊 Monitoring et Métriques

### Prometheus + Grafana (Optionnel)

Décommenter les services dans `docker-compose.prod.yml`:

```bash
# Démarrer avec monitoring
docker compose --profile monitoring up -d
```

Accès:
- **Prometheus**: http://YOUR_VPS_IP:9090
- **Grafana**: http://YOUR_VPS_IP:3001 (admin/admin)

---

## 🔒 Sécurité - Checklist

Avant de mettre en production:

- [ ] Tous les secrets dans `.env` sont forts (32+ caractères)
- [ ] `.env` n'est PAS commité dans git
- [ ] Firewall configuré (ufw enable)
- [ ] SSL/TLS activé (HTTPS)
- [ ] Rate limiting activé
- [ ] CORS configuré correctement
- [ ] Backups automatiques configurés
- [ ] Monitoring activé
- [ ] Logs rotationnés
- [ ] Mises à jour système automatiques

---

## 📞 Support

Pour des questions ou problèmes:
- Documentation: https://github.com/iafactory/rag-dz
- Issues: https://github.com/iafactory/rag-dz/issues
- Email: support@iafactory.dz

---

## 📝 Licence

Copyright © 2024 IAFactory Algeria. All rights reserved.
