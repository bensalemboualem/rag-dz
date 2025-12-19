# 🚀 Déploiement VPS - Guide Rapide

**Date**: 2 décembre 2025
**Projet**: IAFactory RAG-DZ
**Status**: ✅ PRÊT À DÉPLOYER

---

## 📋 Prérequis VPS

### Serveur Recommandé: Hetzner CX22
- **CPU**: 2 vCPU AMD
- **RAM**: 4 GB
- **SSD**: 40 GB
- **Trafic**: 20 TB
- **Prix**: €5.83/mois
- **OS**: Ubuntu 22.04 LTS

### Alternative: Hetzner CX32
- **CPU**: 2 vCPU AMD
- **RAM**: 8 GB
- **SSD**: 80 GB
- **Prix**: €11.05/mois

---

## 🎯 Déploiement en 3 Étapes

### ÉTAPE 1: Commander le VPS Hetzner

1. Aller sur https://www.hetzner.com/cloud
2. Créer un compte
3. Commander un serveur CX22 ou CX32
4. Choisir Ubuntu 22.04 LTS
5. Ajouter votre clé SSH publique
6. Noter l'adresse IP du serveur

### ÉTAPE 2: Configurer le DNS

Chez votre registrar de domaine (ex: Namecheap, GoDaddy):

```
Type    Host    Value                TTL
A       @       <IP_VPS>             300
A       www     <IP_VPS>             300
```

Attendre 5-10 minutes pour la propagation DNS.

### ÉTAPE 3: Déployer Automatiquement

#### Option A: Déploiement Automatique (RECOMMANDÉ)

1. **Copier le projet sur le VPS**:
```bash
# Sur votre machine locale
cd d:\IAFactory\rag-dz
scp -r . root@<IP_VPS>:/tmp/rag-dz/
```

2. **Connecter au VPS**:
```bash
ssh root@<IP_VPS>
```

3. **Lancer le déploiement automatique**:
```bash
cd /tmp/rag-dz
chmod +x deploy-vps-master.sh
export DOMAIN="iafactory-algeria.com"
export EMAIL="admin@iafactory-algeria.com"
./deploy-vps-master.sh
```

**C'est tout !** Le script fait automatiquement:
- ✅ Installation de Docker, Nginx, Certbot
- ✅ Configuration du firewall
- ✅ Déploiement de tous les services
- ✅ Configuration SSL/HTTPS
- ✅ Configuration Nginx

#### Option B: Déploiement Manuel (Avancé)

<details>
<summary>Cliquer pour voir les commandes manuelles</summary>

```bash
# 1. Installer les dépendances
apt-get update
apt-get install -y docker.io docker-compose nginx certbot python3-certbot-nginx git

# 2. Cloner/copier le projet
mkdir -p /opt/iafactory-rag-dz
cd /opt/iafactory-rag-dz
# ... copier les fichiers

# 3. Configurer .env
cp .env.example .env
nano .env
# Configurer les clés API

# 4. Démarrer Docker
docker-compose up -d

# 5. Configurer Nginx
cp nginx/iafactory.conf /etc/nginx/sites-available/iafactory
ln -s /etc/nginx/sites-available/iafactory /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# 6. Configurer SSL
certbot --nginx -d iafactory-algeria.com
```

</details>

---

## ⚙️ Configuration Post-Déploiement

### 1. Configurer les Clés API

```bash
# Sur le VPS
cd /opt/iafactory-rag-dz
nano .env
```

Ajouter vos clés API:
```bash
# Groq (Recommandé - rapide et gratuit)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx

# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx

# Google AI
GOOGLE_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxx

# DeepSeek
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
```

### 2. Redémarrer les Services

```bash
cd /opt/iafactory-rag-dz
docker-compose restart
```

### 3. Vérifier le Statut

```bash
# Status des conteneurs
docker-compose ps

# Logs du backend
docker-compose logs -f iafactory-backend

# Health check
curl https://iafactory-algeria.com/health
```

---

## 🧪 Tests Post-Déploiement

### 1. Tester la Landing Page
```bash
curl -I https://iafactory-algeria.com
# Devrait retourner: HTTP/2 200
```

### 2. Tester les Applications
```bash
# Test app agri-dz
curl -I https://iafactory-algeria.com/apps/agri-dz/
# Devrait retourner: HTTP/2 200
```

### 3. Tester le Backend API
```bash
curl https://iafactory-algeria.com/api/health
# Devrait retourner: {"status":"healthy"}
```

### 4. Tester le Directory IA
```bash
curl -I https://iafactory-algeria.com/docs/directory/
# Devrait retourner: HTTP/2 200
```

### 5. Tester le Chat IA
Ouvrir dans le navigateur:
```
https://iafactory-algeria.com
```
- Vérifier que la landing page s'affiche
- Tester le chat avec un message
- Vérifier que les apps sont listées dans la sidebar

---

## 📊 Monitoring et Maintenance

### Commandes Utiles

```bash
# Voir les logs en temps réel
docker-compose logs -f

# Redémarrer un service
docker-compose restart iafactory-backend

# Arrêter tous les services
docker-compose down

# Démarrer tous les services
docker-compose up -d

# Voir l'utilisation des ressources
docker stats

# Espace disque
df -h

# Mémoire
free -h
```

### Logs Importants

```bash
# Logs Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Logs Docker
docker-compose logs --tail=100 iafactory-backend
docker-compose logs --tail=100 iafactory-postgres

# Logs système
journalctl -u docker -f
```

### Backups Automatiques

Le script de backup est déjà configuré dans `/opt/iafactory-rag-dz/scripts/backup.sh`.

Pour l'activer:
```bash
# Ajouter au crontab
crontab -e

# Ajouter cette ligne (backup tous les jours à 2h du matin)
0 2 * * * /opt/iafactory-rag-dz/scripts/backup.sh
```

---

## 🔧 Troubleshooting

### Problème: Service ne démarre pas

```bash
# Vérifier les logs
docker-compose logs iafactory-backend

# Redémarrer
docker-compose restart iafactory-backend

# Rebuild si nécessaire
docker-compose build --no-cache iafactory-backend
docker-compose up -d
```

### Problème: Certificat SSL expiré

```bash
# Renouveler le certificat
certbot renew

# Redémarrer Nginx
systemctl reload nginx
```

### Problème: Base de données corrompue

```bash
# Restaurer depuis backup
cd /opt/iafactory-rag-dz
./scripts/restore.sh backup-2025-12-02.tar.gz
```

### Problème: Espace disque plein

```bash
# Nettoyer Docker
docker system prune -a

# Nettoyer les logs
truncate -s 0 /var/log/nginx/*.log

# Nettoyer les backups anciens
find /backups -mtime +30 -delete
```

---

## 📈 Scaling et Optimisations

### Augmenter les Ressources

Si le serveur devient lent, upgrader vers CX32 ou CX42:

```bash
# Sur Hetzner Cloud Console:
1. Éteindre le serveur
2. Changer le type de serveur
3. Redémarrer
```

### Optimiser PostgreSQL

```bash
# Éditer postgresql.conf dans le conteneur
docker exec -it iaf-dz-postgres bash
nano /var/lib/postgresql/data/postgresql.conf

# Optimisations recommandées:
shared_buffers = 512MB
effective_cache_size = 1GB
work_mem = 10MB
```

### Activer le Cache Redis

Le cache Redis est déjà configuré. Pour vérifier:

```bash
# Connecter à Redis
docker exec -it iaf-dz-redis redis-cli

# Vérifier les stats
INFO stats
```

---

## 🔐 Sécurité

### Configurer le Firewall

Le script de déploiement configure déjà UFW, mais pour vérifier:

```bash
ufw status verbose
```

### Mettre à Jour le Système

```bash
# Mettre à jour Ubuntu
apt-get update && apt-get upgrade -y

# Redémarrer si nécessaire
reboot
```

### Sauvegarder les Clés

Sauvegarder localement:
- `/opt/iafactory-rag-dz/.env`
- `/etc/letsencrypt/` (certificats SSL)

---

## 📞 Support

### Commandes de Diagnostic

```bash
# Générer un rapport complet
cd /opt/iafactory-rag-dz
cat > diagnostic.sh <<'EOF'
#!/bin/bash
echo "=== DIAGNOSTIC IAFACTORY RAG-DZ ==="
echo ""
echo "Date: $(date)"
echo "Hostname: $(hostname)"
echo "IP: $(curl -s ifconfig.me)"
echo ""
echo "=== DOCKER ==="
docker --version
docker-compose --version
docker-compose ps
echo ""
echo "=== DISK ==="
df -h
echo ""
echo "=== MEMORY ==="
free -h
echo ""
echo "=== NGINX ==="
nginx -t
systemctl status nginx --no-pager
echo ""
echo "=== SSL ==="
certbot certificates
EOF

chmod +x diagnostic.sh
./diagnostic.sh > diagnostic-report.txt
```

Envoyer `diagnostic-report.txt` pour support.

---

## ✅ Checklist de Déploiement

- [ ] VPS Hetzner commandé (CX22 ou CX32)
- [ ] DNS configuré (A record vers IP VPS)
- [ ] Connexion SSH testée
- [ ] Projet copié sur VPS
- [ ] Script `deploy-vps-master.sh` exécuté
- [ ] Clés API configurées dans `.env`
- [ ] Services Docker démarrés
- [ ] SSL/HTTPS configuré
- [ ] Landing page accessible
- [ ] Applications testées
- [ ] Backend API testé
- [ ] Monitoring configuré
- [ ] Backups configurés

---

## 🎉 Résultat Final

Après déploiement, vous aurez:

✅ **47 Applications** accessibles sur `https://iafactory-algeria.com/apps/`
✅ **Landing Page** professionnelle avec chat IA intégré
✅ **Backend API** avec 35+ endpoints RAG
✅ **Directory IA** avec agents, outils, workflows
✅ **Multi-LLM** support (Groq, OpenAI, Anthropic, Google, DeepSeek)
✅ **SSL/HTTPS** automatique avec Let's Encrypt
✅ **Auto-scaling** avec Docker Compose
✅ **Backups** automatiques quotidiens

---

**🚀 Prêt à déployer ? Lancez le script maintenant !**

```bash
ssh root@<IP_VPS>
cd /tmp/rag-dz
chmod +x deploy-vps-master.sh
export DOMAIN="iafactory-algeria.com"
export EMAIL="admin@iafactory-algeria.com"
./deploy-vps-master.sh
```

**Durée estimée**: 10-15 minutes pour un déploiement complet.
