# 🔍 RAPPORT D'AUDIT COMPLET - IAFactory RAG-DZ
**Date**: 2025-12-09
**Serveur**: root@46.224.3.125
**Projet**: /opt/iafactory-rag-dz

---

## 📊 RÉSUMÉ EXÉCUTIF

### ✅ Points Positifs
- ✅ **29 services Docker actifs** et fonctionnels (18 AI agents + 11 services core)
- ✅ **Tous les services web accessibles** (backend, archon, agents, landing page)
- ✅ **Nginx + SSL configuré** avec 12 domaines actifs
- ✅ **Firewall UFW actif** (ports 22, 80, 443)
- ✅ **Règles de sécurité nginx** bloquent accès aux fichiers sensibles (.env, etc.)
- ✅ **Monitoring actif** (Grafana port 3033)

### ⚠️ Problèmes Critiques
1. 🔴 **API_SECRET_KEY = valeur par défaut** ("temp-secret-key-for-testing-only")
2. 🔴 **Espace disque 86% utilisé** (123GB/150GB, seulement 21GB libre)
3. 🟠 **75GB d'images Docker inutilisées** (91% récupérables)
4. 🟠 **Fail2ban service failed** (pas de protection brute force)
5. 🟠 **Permissions .env trop permissives** (644 au lieu de 600)
6. 🟠 **Ollama container unhealthy** (pas de GPU, pas de modèles)

### 📈 Score Global: **68/100**
- Infrastructure: 75/100
- Sécurité: 55/100
- Performance: 70/100
- Fiabilité: 72/100

---

## 🗂️ STRUCTURE DU PROJET

### Dossiers Principaux
```
/opt/iafactory-rag-dz/
├── agents/          7.4GB    (4 agents operators)
├── bolt-diy/        1.5GB    (Bolt.DIY frontend dev)
├── frontend/        1.2GB    (archon-ui, rag-ui)
├── apps/            323MB    (71 applications)
├── awesome-llm-apps/256MB    (exemples LLM)
├── backend/         5.8MB    (FastAPI rag-compat)
├── bmad/           26MB      (BMAD système)
├── docs/           1.8MB     (documentation)
├── ai-agents/      972KB     (4 catégories AI agents)
└── scripts/        312KB     (scripts déploiement)
```

### Applications Déployées
- **71 applications** dans `/apps/`
- **18 AI agents Streamlit** (ports 9101-9118)
- **4 AI agents operators** dans `/agents/`
- **2 frontends**: archon-ui (3737), rag-ui

---

## 🐳 SERVICES DOCKER

### Containers Actifs: **29/64**

#### Services Core (6)
| Service | Container | Port | Status | Santé |
|---------|-----------|------|--------|-------|
| Backend API | iaf-dz-backend | 8180 | ✅ Up 2 days | healthy |
| Archon Server | archon-server | 8181 | ✅ Up 3 days | healthy |
| Archon UI | archon-ui | 3737 | ✅ Up 12h | healthy |
| MongoDB | ia-factory-mongodb | 27018 | ✅ Up 2 days | healthy |
| Redis | ia-factory-redis | 6380 | ✅ Up 2 days | healthy |
| Qdrant | qdrant | 6333 | ✅ Up 3 days | healthy |

#### AI Agents Streamlit (18)
| Agent | Port | Status | Santé |
|-------|------|--------|-------|
| AI Consultant | 9101 | ✅ Up 3 days | - |
| AI Customer Support | 9102 | ✅ Up 3 days | - |
| AI Data Analysis | 9103 | ✅ Up 3 days | - |
| AI XAI Finance | 9104 | ✅ Up 3 days | healthy |
| AI Meeting | 9105 | ✅ Up 3 days | healthy |
| AI Journalist | 9106 | ✅ Up 3 days | healthy |
| AI Web Scraping | 9107 | ✅ Up 3 days | healthy |
| AI Product Launch | 9108 | ✅ Up 3 days | healthy |
| AI Local RAG | 9109 | ✅ Up 3 days | healthy |
| AI RAG as Service | 9110 | ✅ Up 3 days | healthy |
| AI Agentic RAG | 9111 | ✅ Up 3 days | healthy |
| AI Hybrid Search RAG | 9112 | ✅ Up 3 days | healthy |
| AI Autonomous RAG | 9113 | ✅ Up 3 days | healthy |
| AI Investment | 9114 | ✅ Up 3 days | healthy |
| AI Financial Coach | 9115 | ✅ Up 3 days | healthy |
| AI Startup Trends | 9116 | ✅ Up 3 days | healthy |
| AI System Architect | 9117 | ✅ Up 3 days | healthy |
| AI Deep Research | 9118 | ✅ Up 3 days | healthy |

#### Services Annexes (5)
| Service | Container | Port | Status |
|---------|-----------|------|--------|
| Landing Pro | iaf-landing-pro | 8216 | ✅ Up 3 days |
| Archon MCP | archon-mcp | 8051 | ✅ Up 3 days |
| Grafana | iaf-grafana | 3033 | ✅ Up 3 days |
| Ollama | iaf-dz-ollama | 11434 | ⚠️ unhealthy |
| IA Factory API | ia-factory-api | 8087 | ✅ Up 2 days |

### Utilisation Ressources Docker
- **CPU Moyen**: <1% par container
- **RAM Totale Utilisée**: ~950MB (6% de 15.25GB)
- **Container le plus lourd**: iaf-dz-backend (278MB RAM)
- **Containers légers**: AI agents (7-45MB chacun)

---

## 💾 ESPACE DISQUE

### Partitions
```
/dev/sda1     150GB    123GB (82%)    21GB libre    ⚠️ CRITIQUE
/dev/sda15    253MB    146KB          252MB         ✅ OK
```

### Utilisation Docker
```
Images:          82.83GB    (75.58GB récupérables = 91%)
Containers:      417.3MB    (21.26MB récupérables = 5%)
Local Volumes:   10.39GB    (8.77GB récupérables = 84%)
Build Cache:     0B
─────────────────────────────────────────────────────
TOTAL:           93.6GB     (84.6GB récupérables)
```

### ⚠️ ACTION URGENTE REQUISE
**Nettoyage Docker recommandé** pour libérer ~85GB:
```bash
docker system prune -a --volumes
```

**Risques si pas de nettoyage**:
- Disque plein dans 2-3 semaines
- Impossibilité de build de nouvelles images
- Logs qui ne peuvent plus s'écrire
- Services qui crashent

---

## 🔐 SÉCURITÉ

### 🔴 VULNÉRABILITÉS CRITIQUES

#### 1. API_SECRET_KEY = Valeur par défaut
**Gravité**: 🔴 CRITIQUE
**Fichier**: `/opt/iafactory-rag-dz/.env`
**Problème**:
```bash
API_SECRET_KEY=temp-secret-key-for-testing-only-change-in-production
```
**Impact**: N'importe qui peut générer des tokens JWT valides
**Correctif**:
```bash
# Générer une clé forte
openssl rand -hex 32 > /tmp/new_secret
# Mettre à jour .env
sed -i "s/^API_SECRET_KEY=.*/API_SECRET_KEY=$(cat /tmp/new_secret)/" .env
# Redémarrer services
docker restart iaf-dz-backend archon-server
```

#### 2. Permissions .env trop permissives
**Gravité**: 🟠 HAUTE
**Problème**: `-rw-r--r--` (644) → readable par tous les users
**Correctif**:
```bash
chmod 600 /opt/iafactory-rag-dz/.env
```

#### 3. Fail2ban service failed
**Gravité**: 🟠 HAUTE
**Problème**: Pas de protection contre brute force SSH/HTTP
**Détails**:
```
ERROR Found no accessible config files for 'filter.d/nginx-noscript'
```
**Correctif**:
```bash
# Réinstaller fail2ban
apt-get install --reinstall fail2ban
systemctl restart fail2ban
```

### ✅ Points Positifs Sécurité
- ✅ Nginx bloque accès à `.env`, `.git`, fichiers sensibles
- ✅ Firewall UFW actif (22, 80, 443)
- ✅ SSL/TLS configuré sur tous les domaines
- ✅ Tentatives de scan/hacking bloquées (logs nginx)

### ⚠️ Améliorations Recommandées
1. **Ajouter ports AI agents au firewall**:
   ```bash
   ufw allow 9101:9118/tcp comment "AI Agents"
   ```

2. **Durcir SSH**:
   ```bash
   # /etc/ssh/sshd_config
   PermitRootLogin prohibit-password
   PasswordAuthentication no
   PubkeyAuthentication yes
   Port 2222  # changer port par défaut
   ```

3. **Mettre à jour système** (14 packages en attente):
   ```bash
   apt update && apt upgrade -y
   ```

---

## 🌐 NGINX & DOMAINES

### Sites Actifs: **12**
```
✅ archon.iafactoryalgeria.com
✅ bolt.iafactoryalgeria.com
✅ bolt.iafactory.ch
✅ consultant
✅ data
✅ grafana.iafactoryalgeria.com
✅ iafactoryalgeria.com (principal)
✅ iafactory.ch
✅ invest
✅ rag
✅ school.iafactoryalgeria.com
✅ support
```

### Tests Accessibilité
```
Backend API (8180):    200 ✅
Archon Server (8181):  200 ✅
AI Agent 9101:         200 ✅
Landing Page (nginx):  200 ✅
```

### Warnings Nginx (Non-critiques)
```
protocol options redefined for 0.0.0.0:443 in:
  - /etc/nginx/sites-enabled/data:8
  - /etc/nginx/sites-enabled/grafana.iafactoryalgeria.com:15
  - /etc/nginx/sites-enabled/invest:8
  - /etc/nginx/sites-enabled/school.iafactoryalgeria.com:37
  - /etc/nginx/sites-enabled/support:8
```
**Impact**: Aucun (warnings informationnels)

---

## 📝 LOGS & ERREURS

### Nginx Error Log (dernières 24h)
**Tentatives de hacking** (194.180.49.170):
- ❌ Accès à `.env`, `.env.example`, `.env.production` → BLOQUÉ ✅
- ❌ Accès à `phpinfo.php`, `admin/phpinfo.php` → BLOQUÉ ✅
- ❌ Accès à `.aws/credentials` → BLOQUÉ ✅

**Problème school-erp** (44.220.48.213):
- ⚠️ Fichiers JS manquants (double "public/public/" dans paths)
- Correctif: revoir nginx config de school.iafactoryalgeria.com

### Backend Logs
- ✅ Aucune erreur détectée (grep ERROR/Exception/Failed)

### Ollama Logs
- ⚠️ Status "unhealthy" (health check échoue)
- Cause: Pas de GPU détecté ("low vram mode", 0B VRAM)
- ℹ️ Fonctionne en mode CPU
- ℹ️ Aucun modèle téléchargé ("total blobs: 0")

---

## 📦 FICHIERS CRITIQUES

### ✅ Présents
```
✅ .env (8.4KB)
✅ .env.example (6.2KB)
✅ .env.local (8.4KB)
✅ docker-compose.yml (15KB)
✅ docker-compose.prod.yml (9KB)
✅ docker-compose.essential.yml
✅ docker-compose-ai-agents.yml (4 phases)
✅ deploy-vps-master.sh
✅ start-archon.sh
✅ restore-bmad.sh
✅ backend/rag-compat/Dockerfile
✅ backend/rag-compat/requirements.txt
✅ frontend/*/package.json
```

### ⚠️ Permissions à Corriger
```
❌ backend/: UID 197609 (Windows UID)
❌ frontend/: UID 197609 (Windows UID)
✅ apps/: www-data:www-data (OK)
✅ apps/landing/: www-data:www-data (OK)
```

**Correctif**:
```bash
chown -R root:root /opt/iafactory-rag-dz/backend
chown -R root:root /opt/iafactory-rag-dz/frontend
```

---

## 📊 MÉTRIQUES SYSTÈME

### CPU & Mémoire
- **RAM**: 15.25GB total, ~950MB utilisée par Docker (6%)
- **CPU Docker**: 2h17min cumulées (depuis 3 jours)
- **Swap**: 90.3MB utilisé (OK)

### Inodes
```
Total: 9,732,496
Utilisés: 2,478,000 (26%)
Libres: 7,254,496
```
✅ Pas de risque d'épuisement inodes

---

## 🎯 PLAN D'ACTION PRIORITAIRE

### 🔴 URGENT (À faire aujourd'hui)

#### 1. Changer API_SECRET_KEY
```bash
ssh root@46.224.3.125
cd /opt/iafactory-rag-dz
openssl rand -hex 32 > /tmp/new_secret
NEW_KEY=$(cat /tmp/new_secret)
sed -i "s/^API_SECRET_KEY=.*/API_SECRET_KEY=$NEW_KEY/" .env
docker restart iaf-dz-backend archon-server
rm /tmp/new_secret
```

#### 2. Nettoyer Docker
```bash
# Afficher ce qui sera supprimé
docker system df

# Nettoyer (ATTENTION: supprime images inutilisées)
docker system prune -a --volumes

# Vérifier gain
df -h
```

#### 3. Corriger permissions .env
```bash
chmod 600 /opt/iafactory-rag-dz/.env
ls -lh /opt/iafactory-rag-dz/.env  # vérifier
```

### 🟠 IMPORTANT (Cette semaine)

#### 4. Réparer Fail2ban
```bash
apt-get install --reinstall fail2ban
systemctl enable fail2ban
systemctl start fail2ban
systemctl status fail2ban
```

#### 5. Mettre à jour système
```bash
apt update
apt upgrade -y
# Redémarrer si kernel mis à jour
reboot
```

#### 6. Ajouter ports AI agents au firewall
```bash
ufw allow 9101:9118/tcp comment "AI Agents Streamlit"
ufw status
```

#### 7. Corriger permissions fichiers
```bash
cd /opt/iafactory-rag-dz
chown -R root:root backend/ frontend/
chmod 600 .env .env.local
```

### 🟢 RECOMMANDÉ (Ce mois)

#### 8. Durcir SSH
```bash
# Éditer /etc/ssh/sshd_config:
PermitRootLogin prohibit-password
PasswordAuthentication no
Port 2222  # optionnel mais recommandé

systemctl restart sshd
```

#### 9. Configurer monitoring Grafana
- Accéder: http://46.224.3.125:3033
- Créer dashboards Docker, Nginx, System
- Configurer alertes (disk space, CPU, RAM)

#### 10. Corriger school-erp paths
```bash
# Revoir nginx config de school.iafactoryalgeria.com
# Supprimer double "public/public/" dans les paths
```

---

## 📈 RECOMMANDATIONS LONG TERME

### Infrastructure

1. **Upgrade disque** (+100GB minimum)
   - Actuel: 150GB, 86% utilisé
   - Recommandé: 250-300GB
   - Alternative: Ajouter volume séparé pour Docker (`/var/lib/docker`)

2. **Backups automatiques**
   ```bash
   # Backup quotidien des données critiques
   0 2 * * * /usr/local/bin/backup-iafactory.sh
   ```

3. **Monitoring avancé**
   - Prometheus metrics
   - Alertes email/SMS (disk >90%, services down)
   - Logs centralisés (ELK ou Loki)

### Sécurité

4. **Audit de sécurité professionnel**
   - Scan vulnérabilités (Nessus, OpenVAS)
   - Pentest externe

5. **Rotation des secrets**
   - API keys tous les 90 jours
   - Certificats SSL auto-renouvelés (Let's Encrypt)

6. **WAF (Web Application Firewall)**
   - ModSecurity pour Nginx
   - CloudFlare en front

### Performance

7. **CDN pour assets statiques**
   - CloudFlare CDN
   - Réduire bande passante serveur

8. **Optimisation Docker**
   - Multi-stage builds
   - Réduire taille images
   - Health checks optimisés

9. **Database tuning**
   - PostgreSQL: shared_buffers, work_mem
   - MongoDB: indices optimisés
   - Redis: persistence strategy

---

## 📞 CONTACTS & RESSOURCES

### Documentation
- Projet: `/opt/iafactory-rag-dz/docs/`
- README: `/opt/iafactory-rag-dz/README.md`
- Guides déploiement: `DEPLOYMENT*.md`

### Logs Importants
- Nginx: `/var/log/nginx/`
- Docker: `docker logs <container>`
- Système: `journalctl -u docker`

### Commandes Utiles
```bash
# Status services
docker ps
systemctl status docker nginx

# Logs
docker logs iaf-dz-backend --tail 100 -f
tail -f /var/log/nginx/error.log

# Espace disque
df -h
docker system df

# Ressources
docker stats
htop
```

---

## ✅ CHECKLIST QUOTIDIENNE

- [ ] Vérifier espace disque: `df -h`
- [ ] Vérifier services Docker: `docker ps`
- [ ] Vérifier logs erreurs: `tail /var/log/nginx/error.log`
- [ ] Tester URLs principales (backend, archon, landing)
- [ ] Vérifier backups (si configurés)

---

**Rapport généré le**: 2025-12-09 09:10 UTC
**Prochaine révision recommandée**: 2025-12-16
