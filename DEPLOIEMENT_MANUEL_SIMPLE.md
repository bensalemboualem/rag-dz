# 🚀 Déploiement Manuel Simple - IAFactory RAG-DZ
## Domaine: www.iafactoryalgeria.com

> **Note**: Ce guide est simplifié pour Windows. Le script automatique fonctionne mieux sous Linux/macOS/WSL.

---

## 📋 Option 1: Déploiement Via Interface Web Hetzner (Recommandé pour Windows)

### Étape 1: Créer le Serveur sur Hetzner

1. **Allez sur**: https://console.hetzner.com/projects/12472562/servers

2. **Créez un serveur**:
   - Cliquez sur "**Add Server**"
   - **Location**: Nuremberg (nbg1)
   - **Image**: Ubuntu 22.04
   - **Type**: **CX41** (4 vCPU, 16 GB RAM) - €14.99/mois
   - **Networking**: IPv4 + IPv6
   - **SSH Key**: Créez-en une ou utilisez existante
   - **Name**: `iafactory-prod-01`

3. **Notez l'IP publique** une fois créé (ex: 95.217.XXX.XXX)

---

### Étape 2: Configurer le DNS

Chez votre registrar DNS (où vous avez acheté iafactoryalgeria.com):

```
Type: A
Host: @
Value: 95.217.XXX.XXX    [l'IP de votre serveur]
TTL: 300

Type: A
Host: www
Value: 95.217.XXX.XXX    [l'IP de votre serveur]
TTL: 300
```

**Attendez 5-10 minutes** pour la propagation DNS.

---

### Étape 3: Se Connecter au Serveur

Depuis Git Bash:

```bash
ssh root@95.217.XXX.XXX
```

(Remplacez par votre IP réelle)

---

### Étape 4: Copier les Scripts sur le Serveur

**Sur votre machine Windows**, depuis le dossier `rag-dz`:

```bash
# Créer une archive
tar czf iafactory-deploy.tar.gz \
  scripts/ \
  docker-compose.prod.yml \
  .env.prod.example \
  backend/ \
  frontend/ \
  bolt-diy/

# Copier sur le serveur
scp iafactory-deploy.tar.gz root@95.217.XXX.XXX:/root/
```

---

### Étape 5: Installation Automatique sur le Serveur

**Sur le serveur** (via SSH):

```bash
# Extraire l'archive
cd /root
tar xzf iafactory-deploy.tar.gz
mv rag-dz /opt/iafactory

# Rendre les scripts exécutables
cd /opt/iafactory
chmod +x scripts/*.sh

# 1. Configurer le serveur (Docker, Nginx, etc.)
bash scripts/setup-server.sh

# 2. Configurer les variables d'environnement
cp .env.prod.example .env
nano .env

# Modifiez au minimum:
# DOMAIN=www.iafactoryalgeria.com
# EMAIL=admin@iafactoryalgeria.com
# POSTGRES_PASSWORD=[générer mot de passe]
# REDIS_PASSWORD=[générer mot de passe]
# GROQ_API_KEY=[votre clé Groq]

# Générer des mots de passe sécurisés:
openssl rand -base64 32  # Pour PostgreSQL
openssl rand -base64 32  # Pour Redis
openssl rand -hex 32     # Pour JWT_SECRET_KEY
openssl rand -hex 32     # Pour RAG_API_KEY

# 3. Démarrer les services
docker-compose -f docker-compose.prod.yml up -d

# 4. Configurer Nginx et SSL
export DOMAIN="www.iafactoryalgeria.com"
export EMAIL="admin@iafactoryalgeria.com"
bash scripts/configure-nginx.sh

# 5. Configurer monitoring et backups
bash scripts/monitoring.sh
```

---

### Étape 6: Vérifier le Déploiement

```bash
# Sur le serveur
iafactory status

# Vérifier les services
docker-compose ps

# Tester l'API
curl http://localhost:8180/health
```

**Accéder aux interfaces**:
- Hub: https://www.iafactoryalgeria.com
- API: https://www.iafactoryalgeria.com/api
- Docs: https://www.iafactoryalgeria.com/docs
- Studio: https://www.iafactoryalgeria.com/studio
- n8n: https://www.iafactoryalgeria.com/automation

---

## 📋 Option 2: Script Automatique (Linux/macOS/WSL uniquement)

Si vous êtes sur **WSL** (Windows Subsystem for Linux) ou **macOS/Linux**:

```bash
# 1. Configurer les variables
export HETZNER_API_TOKEN="votre_token_hetzner"
export DOMAIN="www.iafactoryalgeria.com"
export EMAIL="admin@iafactoryalgeria.com"

# 2. Lancer le déploiement
chmod +x deploy-hetzner.sh
./deploy-hetzner.sh
```

---

## 🔑 Obtenir les API Keys Gratuites

### Groq (Recommandé - Gratuit)

1. Allez sur: https://console.groq.com/
2. Créez un compte
3. Allez dans "**API Keys**"
4. Créez une nouvelle clé
5. Copiez la clé (commence par `gsk_`)

### Configuration sur le serveur

```bash
ssh root@95.217.XXX.XXX
cd /opt/iafactory
nano .env

# Ajoutez:
GROQ_API_KEY=gsk_votre_cle_groq_ici

# Redémarrez
iafactory restart
```

---

## 🛠️ Commandes Utiles

Une fois installé, vous avez accès à la commande `iafactory`:

```bash
iafactory status       # État des services
iafactory logs         # Logs en temps réel
iafactory backup       # Créer un backup
iafactory restore      # Restaurer un backup
iafactory restart      # Redémarrer les services
iafactory maintenance  # Maintenance système
iafactory help         # Aide complète
```

---

## 📊 Monitoring

### Health Check

```bash
iafactory status
```

**Sortie attendue**:
```
🐳 Services Docker:
   ✓ Backend: Healthy
   ✓ Hub: Running
   ✓ Docs: Running
   ✓ Studio: Running
   ✓ PostgreSQL: Ready
   ✓ Redis: Responding
```

### Logs

```bash
# Tous les services
iafactory logs

# Un service spécifique
iafactory logs backend
iafactory logs hub

# Logs Nginx
tail -f /var/log/nginx/iafactory-access.log
tail -f /var/log/nginx/iafactory-error.log
```

---

## 🔧 Dépannage

### Service ne démarre pas

```bash
# Voir les logs
docker-compose logs -f [nom_service]

# Redémarrer
docker-compose restart [nom_service]

# Reconstruire
docker-compose up -d --build [nom_service]
```

### SSL ne fonctionne pas

```bash
# Vérifier DNS
dig www.iafactoryalgeria.com +short
nslookup www.iafactoryalgeria.com

# Réinstaller SSL
sudo certbot --nginx -d www.iafactoryalgeria.com -d iafactoryalgeria.com --force-renew
```

### Backend inaccessible

```bash
# Vérifier le backend
curl http://localhost:8180/health

# Vérifier les variables
cat /opt/iafactory/.env | grep -E "POSTGRES|REDIS|API_KEY"

# Redémarrer
docker-compose restart iafactory-backend
```

---

## 💰 Coût Mensuel

| Service | Prix |
|---------|------|
| Serveur Hetzner CX41 | €14.99/mois |
| Groq API (gratuit) | €0 |
| **Total** | **€14.99/mois** |

---

## 🔒 Sécurité

Après installation:

- ✅ Firewall UFW configuré
- ✅ SSL Let's Encrypt automatique
- ✅ Fail2Ban anti-bruteforce
- ✅ Backups quotidiens automatiques
- ✅ Monitoring et alertes

---

## 📦 Backups

### Automatiques

- **Quand**: Tous les jours à 2h du matin
- **Rétention**: 7 jours
- **Localisation**: `/backup/iafactory/`

### Manuel

```bash
# Créer un backup
iafactory backup

# Lister les backups
ls -lh /backup/iafactory/

# Restaurer
iafactory restore
```

---

## ✅ Checklist Finale

- [ ] Serveur créé sur Hetzner (CX41)
- [ ] DNS configuré (A records)
- [ ] Connexion SSH fonctionnelle
- [ ] Scripts copiés sur le serveur
- [ ] Docker et Nginx installés
- [ ] Services Docker démarrés
- [ ] SSL configuré (HTTPS)
- [ ] API Keys configurées (minimum Groq)
- [ ] Monitoring installé
- [ ] Backup testé
- [ ] Accès aux URLs vérifié

---

## 🎉 Félicitations!

Votre instance IAFactory RAG-DZ est maintenant déployée sur **www.iafactoryalgeria.com**!

### Prochaines Étapes

1. **Tester le RAG**: Uploadez des documents sur `/docs`
2. **Générer du code**: Utilisez Bolt Studio sur `/studio`
3. **Créer des workflows**: Configurez n8n sur `/automation`
4. **Monitorer**: `iafactory status` régulièrement

---

**Support**: Consultez `DEPLOIEMENT_AUTOMATIQUE.md` pour plus de détails.
