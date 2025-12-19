# 🚀 Déploiement Automatique - IAFactory RAG-DZ

**Domaine**: www.iafactoryalgeria.com
**Plateforme**: Hetzner Cloud
**Date**: 2025-11-24

---

## 📋 Vue d'Ensemble

Ce guide explique comment déployer **automatiquement** IAFactory RAG-DZ sur un serveur Hetzner Cloud en utilisant les scripts d'automatisation fournis.

### Scripts Disponibles

```bash
deploy-hetzner.sh              # Script principal de déploiement automatique
scripts/
├── setup-server.sh            # Configuration du serveur Ubuntu
├── configure-nginx.sh         # Configuration Nginx + SSL
└── monitoring.sh              # Monitoring et backups
```

---

## 🎯 Déploiement en 3 Étapes

### Étape 1: Prérequis

#### 1.1 Obtenir un Token API Hetzner

1. Connectez-vous à [Hetzner Cloud Console](https://console.hetzner.com/projects/12472562/servers)
2. Allez dans **Security** → **API Tokens**
3. Créez un nouveau token avec les permissions **Read & Write**
4. Copiez le token (il commence par `hetzner_`)

#### 1.2 Installer hcloud CLI

**Sur macOS:**
```bash
brew install hcloud
```

**Sur Linux:**
```bash
wget -O hcloud.tar.gz https://github.com/hetznercloud/cli/releases/latest/download/hcloud-linux-amd64.tar.gz
tar -xvf hcloud.tar.gz
sudo mv hcloud /usr/local/bin/
```

**Sur Windows (WSL):**
```bash
curl -L https://github.com/hetznercloud/cli/releases/latest/download/hcloud-linux-amd64.tar.gz -o hcloud.tar.gz
tar -xvf hcloud.tar.gz
sudo mv hcloud /usr/local/bin/
```

#### 1.3 Configurer votre DNS

Pointez votre domaine vers le serveur Hetzner:

**Chez votre registrar DNS:**
```
Type: A
Host: @
Value: [IP_DU_SERVEUR]
TTL: 300

Type: A
Host: www
Value: [IP_DU_SERVEUR]
TTL: 300
```

> ⚠️ **Important**: Attendez quelques minutes que la propagation DNS soit effective avant de continuer.

---

### Étape 2: Configuration Locale

#### 2.1 Cloner le projet

```bash
cd ~
git clone https://github.com/votre-repo/rag-dz.git
cd rag-dz
```

#### 2.2 Configurer les variables d'environnement

```bash
# Exporter les variables requises
export HETZNER_API_TOKEN="votre_token_hetzner_ici"
export DOMAIN="www.iafactoryalgeria.com"
export EMAIL="admin@iafactoryalgeria.com"
```

#### 2.3 Rendre les scripts exécutables

```bash
chmod +x deploy-hetzner.sh
chmod +x scripts/*.sh
```

---

### Étape 3: Lancer le Déploiement Automatique

#### 3.1 Déploiement complet (une seule commande)

```bash
./deploy-hetzner.sh
```

**Ce script va automatiquement:**
1. ✅ Créer un serveur CX41 (4 vCPU, 16GB RAM) sur Hetzner
2. ✅ Configurer Ubuntu 22.04 avec Docker, Nginx, etc.
3. ✅ Copier les fichiers du projet
4. ✅ Configurer les services Docker
5. ✅ Obtenir un certificat SSL Let's Encrypt
6. ✅ Configurer les backups automatiques
7. ✅ Installer les scripts de monitoring

**Durée estimée**: 10-15 minutes

#### 3.2 Suivre la progression

Le script affiche des logs détaillés:

```
[INFO] Vérification des prérequis...
[✓] Prérequis OK
[INFO] Création du serveur Hetzner...
[✓] Serveur créé avec l'IP: 95.217.XXX.XXX
[INFO] Configuration du serveur...
[✓] Serveur configuré
...
```

---

## 📊 Vérification du Déploiement

### Vérifier que tout fonctionne

```bash
# Via SSH (le script affiche la commande)
ssh -i ~/.ssh/iafactory_deploy root@95.217.XXX.XXX

# Sur le serveur
iafactory status
```

**Sortie attendue:**
```
═══════════════════════════════════════════════════════════════
  IAFactory RAG-DZ - État des Services
═══════════════════════════════════════════════════════════════

🐳 Services Docker:
iaf-dz-backend     Up (healthy)   0.0.0.0:8180->8180/tcp
iaf-dz-hub         Up             0.0.0.0:8182->3737/tcp
iaf-dz-docs        Up             0.0.0.0:8183->5173/tcp
iaf-dz-studio      Up             0.0.0.0:8184->5173/tcp
iaf-dz-n8n         Up             0.0.0.0:8185->5678/tcp
iaf-dz-postgres    Up (healthy)   0.0.0.0:6330->5432/tcp
iaf-dz-redis       Up (healthy)   0.0.0.0:6331->6379/tcp
iaf-dz-qdrant      Up             0.0.0.0:6332->6333/tcp

🔧 Backend API:
   ✓ Backend: Healthy

🌐 Frontends:
   ✓ Port 8182: Accessible
   ✓ Port 8183: Accessible
   ✓ Port 8184: Accessible

💾 Database:
   ✓ PostgreSQL: Ready

🔴 Cache:
   ✓ Redis: Responding
```

### Accéder aux interfaces

Une fois le déploiement terminé:

| Interface | URL | Description |
|-----------|-----|-------------|
| **Hub** | https://www.iafactoryalgeria.com | Dashboard principal |
| **API** | https://www.iafactoryalgeria.com/api | Backend API |
| **Docs** | https://www.iafactoryalgeria.com/docs | Upload documents |
| **Studio** | https://www.iafactoryalgeria.com/studio | Génération de code |
| **Automation** | https://www.iafactoryalgeria.com/automation | n8n workflows |

---

## ⚙️ Configuration Post-Déploiement

### 1. Configurer les API Keys

```bash
# Se connecter au serveur
ssh -i ~/.ssh/iafactory_deploy root@95.217.XXX.XXX

# Éditer le fichier .env
cd /opt/iafactory
nano .env
```

**Remplir les clés API:**

```bash
# AI Providers (au moins Groq recommandé - gratuit)
GROQ_API_KEY=gsk_votre_cle_groq_ici
OPENAI_API_KEY=sk-votre_cle_openai
ANTHROPIC_API_KEY=sk-ant-votre_cle_anthropic

# Email (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-app-password

# Twilio SMS (optionnel)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890
```

**Redémarrer après modification:**
```bash
iafactory restart
```

### 2. Obtenir les API Keys Gratuites

#### Groq (Recommandé - Gratuit et Rapide)

1. Allez sur https://console.groq.com/
2. Créez un compte
3. Générez une API key
4. Copiez la clé (commence par `gsk_`)

**Avantages:**
- ✅ Gratuit
- ✅ Ultra rapide (500 tokens/s)
- ✅ Llama 3.3 70B disponible

#### OpenAI (Payant)

1. https://platform.openai.com/api-keys
2. Créez une clé
3. Ajoutez du crédit (min $5)

#### Anthropic Claude (Payant)

1. https://console.anthropic.com/settings/keys
2. Créez une clé
3. Ajoutez du crédit

---

## 🛠️ Commandes d'Administration

Le script installe une commande rapide `iafactory`:

### Gestion des Services

```bash
iafactory start       # Démarrer tous les services
iafactory stop        # Arrêter tous les services
iafactory restart     # Redémarrer tous les services
iafactory status      # État des services
iafactory logs        # Voir les logs en temps réel
iafactory logs backend # Logs d'un service spécifique
```

### Backups

```bash
iafactory backup      # Créer un backup manuel
iafactory restore     # Restaurer depuis un backup
```

**Backups automatiques:**
- **Quotidien** à 2h du matin
- **Rétention**: 7 jours
- **Localisation**: `/backup/iafactory/`

### Maintenance

```bash
iafactory maintenance  # Nettoyer logs, optimiser DB
iafactory update      # Mettre à jour l'application
```

### Monitoring

```bash
# Health check complet
iafactory status

# Logs en temps réel
iafactory logs

# Métriques Docker
docker stats

# Espace disque
df -h

# Mémoire
free -h
```

---

## 🔒 Sécurité

### Ports Ouverts

Le firewall UFW est configuré automatiquement:

```bash
# Vérifier le firewall
ufw status

# Sortie:
22/tcp     ALLOW       # SSH
80/tcp     ALLOW       # HTTP (redirect to HTTPS)
443/tcp    ALLOW       # HTTPS
8180/tcp   ALLOW       # Backend API (direct)
8182/tcp   ALLOW       # Hub UI (direct)
8183/tcp   ALLOW       # Docs UI (direct)
8184/tcp   ALLOW       # Studio UI (direct)
8185/tcp   ALLOW       # n8n (direct)
```

### SSL/TLS

- ✅ Certificat Let's Encrypt automatique
- ✅ Renouvellement automatique tous les jours à 3h30
- ✅ TLS 1.2 et 1.3 uniquement
- ✅ Headers de sécurité HSTS, CSP, etc.

### Fail2Ban

Protection contre les attaques par force brute:

```bash
# Vérifier les bans
fail2ban-client status sshd
```

---

## 📈 Monitoring et Alertes

### Tâches Automatiques (Cron)

```
02:00 - Backup quotidien
03:00 - Maintenance hebdomadaire (dimanche)
03:30 - Renouvellement SSL
*/5   - Alertes (toutes les 5 minutes)
```

### Vérifier les logs

```bash
# Logs applicatifs
tail -f /var/log/iafactory/*.log

# Logs Docker
iafactory logs

# Logs Nginx
tail -f /var/log/nginx/iafactory-*.log
```

### Alertes Automatiques

Le script `iafactory-alerts.sh` vérifie:
- ✅ Backend API accessible
- ✅ PostgreSQL responsive
- ✅ Redis responsive
- ✅ Espace disque < 80%
- ✅ Mémoire < 90%

En cas de problème, une alerte est loggée dans `/var/log/iafactory/alerts.log`

---

## 🔧 Dépannage

### Le domaine ne résout pas

```bash
# Vérifier la résolution DNS
dig www.iafactoryalgeria.com +short
nslookup www.iafactoryalgeria.com

# Doit retourner l'IP du serveur Hetzner
```

**Solution**: Attendez 5-10 minutes pour la propagation DNS

### SSL ne s'installe pas

```bash
# Vérifier que le domaine pointe vers le serveur
curl -I http://www.iafactoryalgeria.com

# Réessayer l'installation SSL
sudo certbot --nginx -d www.iafactoryalgeria.com -d iafactoryalgeria.com
```

### Un service ne démarre pas

```bash
# Vérifier les logs du service
iafactory logs backend

# Redémarrer le service
docker-compose restart iafactory-backend

# Vérifier la santé
docker ps
```

### Erreur "Out of Memory"

```bash
# Vérifier la mémoire
free -h

# Redémarrer les services un par un
docker-compose restart iafactory-qdrant
docker-compose restart iafactory-backend
```

**Solution permanente**: Upgrader vers CX51 (8 vCPU, 32GB RAM)

```bash
hcloud server change-type iafactory-prod-01 --upgrade-disk cx51
```

### Backend ne répond pas

```bash
# Vérifier les variables d'environnement
cat /opt/iafactory/.env | grep API_KEY

# Vérifier la connectivité PostgreSQL
docker exec iaf-dz-postgres pg_isready

# Redémarrer le backend
docker-compose restart iafactory-backend

# Voir les logs en détail
docker logs iaf-dz-backend --tail 100
```

---

## 💰 Coûts Estimés

### Serveur Hetzner

| Type | vCPU | RAM | Disk | Prix/mois |
|------|------|-----|------|-----------|
| **CX41** | 4 | 16GB | 160GB | **€14.99** ⭐ Recommandé |
| CX31 | 2 | 8GB | 80GB | €7.49 |
| CX51 | 8 | 32GB | 240GB | €29.99 |

### API AI (optionnel)

| Provider | Coût |
|----------|------|
| **Groq** | **Gratuit** (rate limited) ⭐ |
| OpenAI GPT-4 | ~$0.03/1K tokens |
| Anthropic Claude | ~$0.015/1K tokens |
| DeepSeek | ~$0.001/1K tokens |

**Recommandation**: Commencer avec **Groq** (gratuit) puis basculer vers d'autres providers si nécessaire.

---

## 🚀 Mise à Jour

### Mise à jour manuelle

```bash
# Se connecter au serveur
ssh -i ~/.ssh/iafactory_deploy root@[IP]

# Mettre à jour le code
cd /opt/iafactory
git pull

# Rebuild et redémarrer
docker-compose pull
docker-compose up -d --build
```

### Mise à jour automatique

```bash
iafactory update
```

---

## 📞 Support

### Ressources

- **Documentation**: `/docs/*.md`
- **Logs**: `/var/log/iafactory/`
- **Backups**: `/backup/iafactory/`

### Commandes Utiles

```bash
# État complet du système
iafactory status

# Health check backend
curl http://localhost:8180/health

# Tester l'API
curl -X POST https://www.iafactoryalgeria.com/api/chat \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{"message": "Hello"}'

# Connexion à PostgreSQL
docker exec -it iaf-dz-postgres psql -U iafactory_admin -d iafactory_prod

# Connexion à Redis
docker exec -it iaf-dz-redis redis-cli
```

---

## ✅ Checklist Post-Déploiement

- [ ] Serveur créé sur Hetzner
- [ ] DNS configuré et propagé
- [ ] SSL installé et fonctionnel
- [ ] Tous les services UP et healthy
- [ ] API Keys configurées (au moins Groq)
- [ ] Backups automatiques testés
- [ ] Accès aux URLs vérifié
- [ ] Monitoring actif

---

## 🎉 Félicitations!

Votre instance IAFactory RAG-DZ est maintenant déployée et opérationnelle sur **www.iafactoryalgeria.com** 🚀

### Prochaines Étapes

1. **Configurer les intégrations** (Email, Twilio, etc.)
2. **Créer des workflows n8n** sur `/automation`
3. **Tester le RAG** en uploadant des documents sur `/docs`
4. **Générer du code** avec Bolt Studio sur `/studio`
5. **Monitorer** avec `iafactory status`

---

**Bon déploiement! 🎯**
