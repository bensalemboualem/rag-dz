# 🚀 IAFactory RAG-DZ - Déploiement Rapide

## Domaine: www.iafactoryalgeria.com

---

## ⚡ Déploiement en 3 Commandes

```bash
# 1. Configurer les variables
export HETZNER_API_TOKEN="votre_token_hetzner"
export DOMAIN="www.iafactoryalgeria.com"
export EMAIL="admin@iafactoryalgeria.com"

# 2. Rendre le script exécutable
chmod +x deploy-hetzner.sh

# 3. Lancer le déploiement
./deploy-hetzner.sh
```

**C'est tout! ✨** Le script va:
- Créer le serveur Hetzner (CX41)
- Installer Docker, Nginx, SSL
- Déployer l'application complète
- Configurer les backups automatiques

**Durée**: ~15 minutes

---

## 📚 Documentation Complète

- **[DEPLOIEMENT_AUTOMATIQUE.md](./DEPLOIEMENT_AUTOMATIQUE.md)** - Guide complet étape par étape
- **[DEPLOIEMENT_HETZNER.md](./DEPLOIEMENT_HETZNER.md)** - Déploiement manuel (si besoin)

---

## 🔑 Prérequis

### 1. Token API Hetzner

Obtenez-le sur: https://console.hetzner.com/projects/12472562/servers
- Security → API Tokens → Générer un token

### 2. CLI Hetzner

**macOS:**
```bash
brew install hcloud
```

**Linux/WSL:**
```bash
wget -O hcloud.tar.gz https://github.com/hetznercloud/cli/releases/latest/download/hcloud-linux-amd64.tar.gz
tar -xvf hcloud.tar.gz
sudo mv hcloud /usr/local/bin/
```

### 3. DNS Configuré

Pointez votre domaine vers le serveur:
```
Type: A
Host: @
Value: [IP_DU_SERVEUR]

Type: A
Host: www
Value: [IP_DU_SERVEUR]
```

---

## 🌐 URLs d'Accès

Après déploiement:

| Interface | URL |
|-----------|-----|
| **Hub** | https://www.iafactoryalgeria.com |
| **API** | https://www.iafactoryalgeria.com/api |
| **Docs** | https://www.iafactoryalgeria.com/docs |
| **Studio** | https://www.iafactoryalgeria.com/studio |
| **n8n** | https://www.iafactoryalgeria.com/automation |

---

## ⚙️ Configuration Post-Déploiement

### Se connecter au serveur

```bash
ssh -i ~/.ssh/iafactory_deploy root@[IP_DU_SERVEUR]
```

### Configurer les API Keys

```bash
cd /opt/iafactory
nano .env
```

**Minimum requis (gratuit):**
```bash
GROQ_API_KEY=gsk_votre_cle_groq    # Obtenir sur https://console.groq.com
```

**Optionnel:**
```bash
OPENAI_API_KEY=sk-...              # https://platform.openai.com
ANTHROPIC_API_KEY=sk-ant-...       # https://console.anthropic.com
```

### Redémarrer après configuration

```bash
iafactory restart
```

---

## 🛠️ Commandes Utiles

```bash
iafactory status       # État des services
iafactory logs         # Logs en temps réel
iafactory backup       # Créer un backup
iafactory restart      # Redémarrer les services
iafactory help         # Aide complète
```

---

## 📊 Monitoring

### État des services

```bash
iafactory status
```

**Sortie attendue:**
```
🐳 Services Docker:
   ✓ Backend: Healthy
   ✓ Hub: Running
   ✓ Docs: Running
   ✓ Studio: Running
   ✓ n8n: Running
   ✓ PostgreSQL: Ready
   ✓ Redis: Responding
   ✓ Qdrant: Running
```

### Backups Automatiques

- **Quotidien** à 2h du matin
- **Rétention** 7 jours
- **Localisation** `/backup/iafactory/`

---

## 💰 Coût Mensuel

| Service | Coût |
|---------|------|
| Serveur Hetzner CX41 | €14.99/mois |
| Groq API (gratuit) | €0 |
| **Total** | **€14.99/mois** |

---

## 🔒 Sécurité

✅ Firewall UFW configuré
✅ SSL Let's Encrypt automatique
✅ Fail2Ban actif
✅ Backups quotidiens
✅ Headers de sécurité HSTS

---

## 🐛 Dépannage

### Service ne démarre pas

```bash
iafactory logs [nom_du_service]
docker-compose restart [nom_du_service]
```

### SSL ne fonctionne pas

```bash
# Vérifier le DNS
dig www.iafactoryalgeria.com +short

# Réinstaller SSL
sudo certbot --nginx -d www.iafactoryalgeria.com
```

### Mémoire saturée

```bash
free -h                    # Vérifier la RAM
iafactory maintenance      # Nettoyer
```

---

## 📞 Support

### Documentation

- [DEPLOIEMENT_AUTOMATIQUE.md](./DEPLOIEMENT_AUTOMATIQUE.md) - Guide complet
- [DEPLOIEMENT_HETZNER.md](./DEPLOIEMENT_HETZNER.md) - Déploiement manuel

### Logs

```bash
# Logs applicatifs
/var/log/iafactory/*.log

# Logs Docker
iafactory logs

# Logs Nginx
/var/log/nginx/iafactory-*.log
```

---

## ✅ Checklist de Déploiement

- [ ] Token Hetzner obtenu
- [ ] CLI hcloud installé
- [ ] DNS configuré et propagé
- [ ] Script lancé avec succès
- [ ] SSL fonctionnel (HTTPS)
- [ ] Tous les services UP
- [ ] API Keys configurées
- [ ] Backup testé

---

## 🎯 Architecture Déployée

```
┌─────────────────────────────────────────────────┐
│          www.iafactoryalgeria.com               │
│              (Nginx + SSL)                      │
└────────────────┬────────────────────────────────┘
                 │
    ┌────────────┼────────────┬──────────┬─────────┐
    │            │            │          │         │
    v            v            v          v         v
┌────────┐  ┌────────┐  ┌────────┐ ┌────────┐ ┌────────┐
│  Hub   │  │  API   │  │  Docs  │ │ Studio │ │  n8n   │
│  8182  │  │  8180  │  │  8183  │ │  8184  │ │  8185  │
└────────┘  └────┬───┘  └────────┘ └────────┘ └────────┘
                 │
         ┌───────┼───────┐
         v       v       v
     ┌─────┐ ┌─────┐ ┌──────┐
     │ PG  │ │Redis│ │Qdrant│
     └─────┘ └─────┘ └──────┘
```

---

## 🎉 Prêt à Déployer!

**Une seule commande pour tout déployer:**

```bash
export HETZNER_API_TOKEN="votre_token" && \
export DOMAIN="www.iafactoryalgeria.com" && \
export EMAIL="admin@iafactoryalgeria.com" && \
chmod +x deploy-hetzner.sh && \
./deploy-hetzner.sh
```

**Bonne chance! 🚀**
