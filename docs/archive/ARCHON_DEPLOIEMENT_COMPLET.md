# ARCHON - DÉPLOIEMENT COMPLET
## IAFactory Algeria SaaS Platform

**Date de déploiement:** 4 Décembre 2025
**Status:** ✅ OPÉRATIONNEL

---

## 🌐 ACCÈS

### URL Principale
**https://archon.iafactoryalgeria.com**

### Endpoints Disponibles
- **Frontend:** `https://archon.iafactoryalgeria.com/`
- **API Backend:** `https://archon.iafactoryalgeria.com/api/`
- **WebSocket:** `https://archon.iafactoryalgeria.com/socket.io/`
- **Health Check:** `https://archon.iafactoryalgeria.com/health`

---

## 📊 ARCHITECTURE

### Services Docker (3 conteneurs)

#### 1. archon-server (Backend API)
- **Image:** archon-ui-stable_archon-server
- **Port interne:** 8181
- **État:** Up (healthy)
- **Technologie:** Python 3.12, FastAPI, Uvicorn
- **Fonctions:**
  - API REST pour la gestion de projets/tâches
  - Crawling de documentation web
  - WebSocket en temps réel (Socket.IO)
  - Recherche hybride (Vector + Full-text)

#### 2. archon-mcp (MCP Server)
- **Image:** archon-ui-stable_archon-mcp
- **Port interne:** 8051
- **État:** Up (healthy)
- **Technologie:** Python 3.12
- **Fonctions:**
  - Model Context Protocol Server
  - Interface pour assistants AI (Claude, GPT, etc.)
  - Accès à la base de connaissances

#### 3. archon-ui (Frontend)
- **Image:** archon-ui-stable_archon-frontend
- **Port interne:** 3737
- **État:** Up (healthy)
- **Technologie:** Node.js 18, React, Vite
- **Fonctions:**
  - Interface utilisateur web
  - Gestion de projets/tâches en mode Kanban
  - Visualisation de la base de connaissances
  - Recherche et navigation

### Reverse Proxy
- **Serveur:** Nginx 1.24.0 (Ubuntu)
- **Configuration:** `/etc/nginx/sites-available/archon.iafactoryalgeria.com`
- **SSL/TLS:** Let's Encrypt (Certbot)
- **Certificat valide jusqu'au:** 2026-03-04

---

## 💾 BASE DE DONNÉES SUPABASE

### Connexion
- **URL:** https://cxzcmmolfgijhjbevtzi.supabase.co
- **Project ID:** cxzcmmolfgijhjbevtzi
- **Region:** US East (Virginie)

### Service Role Key (Backend uniquement)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4emNtbW9sZmdpamhqYmV2dHppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDg3MjY1NSwiZXhwIjoyMDgwNDQ4NjU1fQ.MMfoTv4RRcbUSuuQDEDWlUZM9bzoK-t0cCQ7jcCISh0
```

### Schéma de Base de Données
- **Fichier source:** `archon-supabase-setup.sql` (1376 lignes)
- **Extensions:**
  - `vector` - Stockage et recherche vectorielle
  - `pgcrypto` - Chiffrement des clés API
  - `pg_trgm` - Recherche full-text trigram

### Tables Principales

#### archon_settings
- Stockage des paramètres utilisateur
- Clés API chiffrées (OpenAI, Anthropic, Google, etc.)
- Configuration provider/model par défaut

#### archon_projects
- Gestion de projets
- Champs: name, description, status, priority
- Timestamps de création/mise à jour

#### archon_tasks
- Tâches liées aux projets
- Champs: title, description, status, priority, assignee
- Support Kanban (todo, in_progress, done, archived)

#### archon_sources
- Sources de connaissances
- Support multi-types: URL, PDF, Document, Code
- Métadonnées: title, description, tags, level
- État de crawling avec progress tracking

#### archon_crawled_pages
- Pages web crawlées
- Contenu brut (HTML, Markdown, texte)
- Screenshots au format base64
- Relations avec archon_sources

#### archon_code_examples
- Exemples de code extraits
- Langage, framework, description
- Code source et contexte

### Support Vector Multi-Dimensions
- **384D:** sentence-transformers/all-MiniLM-L6-v2
- **768D:** sentence-transformers/all-mpnet-base-v2
- **1024D:** OpenAI text-embedding-3-small
- **1536D:** OpenAI text-embedding-3-large
- **3072D:** Modèles haute dimension

### Fonctions de Recherche

#### hybrid_search_documents_384d()
```sql
SELECT * FROM hybrid_search_documents_384d(
    query_vector,
    keyword_query,
    match_count,
    filter_project_id
);
```
Combine:
- Similarité cosinus vectorielle (pgvector)
- Recherche BM25 (ts_rank_cd)
- Filtrage par projet optionnel

#### RLS (Row Level Security)
- Politiques de sécurité par utilisateur
- Isolation des données multi-tenant
- Accès sécurisé via Supabase Auth

---

## 🔧 CONFIGURATION VPS

### Serveur Hetzner
- **IP:** 46.224.3.125
- **IPv6:** 2a01:4f8:c17:8922::1
- **OS:** Ubuntu 24.04.3 LTS
- **RAM:** ~30% utilisée
- **Disque:** 34.9% de 149.92GB utilisé

### DNS
- **Domaine:** archon.iafactoryalgeria.com
- **Type:** A Record
- **Valeur:** 46.224.3.125
- **TTL:** Default

### Chemins sur le VPS

#### Archon
```
/opt/iafactory-rag-dz/frontend/archon-ui-stable/
├── .env                          # Variables d'environnement
├── docker-compose.yml            # Orchestration services
├── python/                       # Backend Python
│   ├── src/server/              # FastAPI server
│   ├── src/mcp_server/          # MCP server
│   └── Dockerfile.*             # Images Docker
├── archon-ui-main/              # Frontend React
│   ├── src/
│   ├── public/
│   └── vite.config.ts
└── migration/
    └── complete_setup.sql       # Schema Supabase
```

#### Nginx
```
/etc/nginx/sites-available/archon.iafactoryalgeria.com
/etc/nginx/sites-enabled/archon.iafactoryalgeria.com  (symlink)
```

#### SSL
```
/etc/letsencrypt/live/archon.iafactoryalgeria.com/
├── fullchain.pem
└── privkey.pem
```

### Fichier .env
```bash
SUPABASE_URL=https://cxzcmmolfgijhjbevtzi.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci...
LOG_LEVEL=INFO
HOST=localhost
ARCHON_SERVER_PORT=8181
ARCHON_MCP_PORT=8051
ARCHON_AGENTS_PORT=8052
ARCHON_UI_PORT=3737
VITE_ALLOWED_HOSTS=archon.iafactoryalgeria.com,www.iafactoryalgeria.com,iafactoryalgeria.com,localhost
VITE_SHOW_DEVTOOLS=false
PROD=false
```

---

## 🔐 SÉCURITÉ

### SSL/TLS
- **Fournisseur:** Let's Encrypt
- **Type de certificat:** ECDSA
- **Validité:** 89 jours (jusqu'au 2026-03-04)
- **Renouvellement:** Automatique via Certbot
- **Protocoles:** TLS 1.2, TLS 1.3
- **Ciphers:** Configuration sécurisée Mozilla (Intermediate)

### Headers de Sécurité (Nginx)
```nginx
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: no-referrer-when-downgrade
```

### Allowed Hosts (Vite)
- archon.iafactoryalgeria.com
- www.iafactoryalgeria.com
- iafactoryalgeria.com
- localhost
- 127.0.0.1
- ::1

---

## 📋 COMMANDES UTILES

### Connexion SSH
```bash
ssh root@46.224.3.125
# Password: Ainsefra*0819692025*
```

### Gestion Docker
```bash
# Aller dans le répertoire Archon
cd /opt/iafactory-rag-dz/frontend/archon-ui-stable

# Status des conteneurs
docker-compose ps

# Logs en temps réel
docker logs archon-server -f
docker logs archon-mcp -f
docker logs archon-ui -f

# Logs tous services
docker-compose logs -f

# Redémarrer un service
docker-compose restart archon-server
docker-compose restart archon-mcp
docker-compose restart archon-ui

# Redémarrer tous les services
docker-compose restart

# Arrêter tous les services
docker-compose down

# Démarrer tous les services
docker-compose up -d

# Rebuild complet
docker-compose down
docker-compose up -d --build

# Vérifier la santé
docker inspect archon-server --format='{{.State.Health.Status}}'
docker inspect archon-mcp --format='{{.State.Health.Status}}'
docker inspect archon-ui --format='{{.State.Health.Status}}'
```

### Gestion Nginx
```bash
# Tester la configuration
nginx -t

# Recharger Nginx (sans downtime)
systemctl reload nginx

# Redémarrer Nginx
systemctl restart nginx

# Status Nginx
systemctl status nginx

# Voir les logs d'erreur
tail -f /var/log/nginx/error.log

# Voir les logs d'accès
tail -f /var/log/nginx/access.log
```

### Gestion SSL (Certbot)
```bash
# Lister les certificats
certbot certificates

# Renouveler manuellement
certbot renew

# Renouveler en mode dry-run (test)
certbot renew --dry-run

# Révoquer un certificat
certbot revoke --cert-path /etc/letsencrypt/live/archon.iafactoryalgeria.com/fullchain.pem
```

### Monitoring
```bash
# Utilisation CPU/RAM
htop

# Espace disque
df -h

# Ports ouverts
netstat -tlnp | grep -E ':(3737|8181|8051)'

# Processus Docker
docker stats

# Taille des images
docker images | grep archon

# Nettoyage Docker
docker system prune -f
```

---

## 🎯 INTÉGRATION AVEC L'ÉCOSYSTÈME IAFACTORY

### Architecture Complète
```
IAFactory Algeria SaaS Platform
│
├── Bolt.diy (Générateur d'applications AI)
│   URL: https://www.iafactoryalgeria.com/bolt/
│   Port interne: 5173
│
├── Archon (Base de connaissances + MCP)
│   URL: https://archon.iafactoryalgeria.com
│   Ports: 3737 (UI), 8181 (API), 8051 (MCP)
│   ✅ DÉPLOYÉ
│
├── School OneST (Plateforme éducative)
│   URL: https://school.iafactoryalgeria.com
│   Database: MySQL (onest_school)
│
└── Backend RAG (Python FastAPI)
    URL: https://www.iafactoryalgeria.com/api/
    Port interne: 8000
    Features: Multi-LLM, Council, Credentials, RAG
```

### Intégration MCP avec Bolt.diy
Pour permettre à Bolt d'utiliser Archon comme base de connaissances:

1. **Configuration MCP dans Bolt:**
   - Ajouter le serveur MCP: `https://archon.iafactoryalgeria.com/api/`
   - Port MCP: 8051
   - Transport: SSE (Server-Sent Events)

2. **Flux de données:**
   ```
   Utilisateur → Bolt.diy → MCP (port 8051) → Archon API (port 8181) → Supabase
   ```

3. **Use Cases:**
   - Bolt génère du code → stocke dans Archon comme code_examples
   - Bolt accède à la doc algérienne (G50, IBS, TVA) via Archon
   - Bolt crée des tâches de développement dans Archon

---

## 📚 PROCHAINES ÉTAPES

### 1. Peupler la Base de Connaissances Algérienne
```bash
# Se connecter à Archon
# Aller dans "Knowledge Base" → "Add Source"

# Sources prioritaires:
1. Documentation G50 (Code général des impôts)
   Type: URL
   URL: [site officiel DGI]

2. Guide IBS/IRG/TVA
   Type: PDF
   Upload: guides fiscaux algériens

3. CIB (Centre d'information bancaire)
   Type: URL
   URL: documentation bancaire

4. BaridiMob API
   Type: URL + Document
   Documentation technique de paiement mobile

5. Douanes algériennes
   Type: URL
   Procédures import/export

6. CNAS/CASNOS
   Type: URL
   Documentation sécurité sociale
```

### 2. Tester les Fonctionnalités Principales

#### Projets
- Créer un projet "SaaS PME Algeria"
- Définir les features/tâches
- Assigner aux développeurs

#### Recherche Hybride
- Chercher "TVA importation Algérie"
- Tester la pertinence des résultats
- Vérifier le classement (Vector + BM25)

#### Crawling Web
- Ajouter une source URL
- Monitorer le progress
- Vérifier les pages crawlées
- Examiner les screenshots

#### Code Examples
- Ajouter des snippets Python/FastAPI
- Ajouter des snippets React/TypeScript
- Taguer par framework/langage

### 3. Configuration Production

#### Activer les Agents (Optionnel)
Pour activer les agents ML (reranking):
```bash
cd /opt/iafactory-rag-dz/frontend/archon-ui-stable
docker-compose --profile agents up -d
```

#### Monitoring et Logs

**Option 1: Logfire (Pydantic)**
```bash
# Obtenir un token Logfire
# https://logfire.pydantic.dev

# Ajouter dans .env
LOGFIRE_TOKEN=your_token_here
```

**Option 2: Logs locaux**
```bash
# Créer un volume pour persistance
docker-compose down
# Modifier docker-compose.yml pour ajouter volumes de logs
docker-compose up -d
```

#### Backup Automatique

**Supabase:**
- Backup quotidien automatique (inclus dans plan)
- Point-in-time recovery disponible
- Export manuel via Supabase Dashboard

**Docker Volumes:**
```bash
# Backup .env et config
tar czf archon-config-$(date +%Y%m%d).tar.gz \
    /opt/iafactory-rag-dz/frontend/archon-ui-stable/.env \
    /opt/iafactory-rag-dz/frontend/archon-ui-stable/docker-compose.yml

# Backup complet (images + volumes)
docker save archon-ui-stable_archon-server archon-ui-stable_archon-mcp archon-ui-stable_archon-frontend | gzip > archon-images-$(date +%Y%m%d).tar.gz
```

---

## 🚨 DÉPANNAGE

### Conteneur ne démarre pas
```bash
# Vérifier les logs
docker logs archon-server --tail 100
docker logs archon-mcp --tail 100
docker logs archon-ui --tail 100

# Vérifier les variables d'environnement
docker exec archon-ui env | grep VITE
docker exec archon-server env | grep SUPABASE

# Reconstruire proprement
docker-compose down
docker system prune -f
docker-compose up -d --build
```

### Erreur 403 Forbidden
```bash
# Vérifier VITE_ALLOWED_HOSTS
docker exec archon-ui env | grep VITE_ALLOWED_HOSTS

# Doit contenir le domaine exact
# Si manquant, éditer .env et recréer le conteneur
docker-compose up -d archon-frontend
```

### Erreur 502 Bad Gateway
```bash
# Vérifier que les services backend sont UP
docker-compose ps

# Vérifier les ports
netstat -tlnp | grep -E ':(3737|8181|8051)'

# Vérifier Nginx proxy
nginx -t
systemctl status nginx
```

### Supabase Connection Error
```bash
# Tester la connexion
curl https://cxzcmmolfgijhjbevtzi.supabase.co/rest/v1/

# Vérifier le service_role key dans .env
grep SUPABASE_SERVICE_KEY /opt/iafactory-rag-dz/frontend/archon-ui-stable/.env

# Redémarrer le backend
docker-compose restart archon-server archon-mcp
```

### SSL Certificate Renewal Failed
```bash
# Tester le renouvellement
certbot renew --dry-run

# Renouveler manuellement
certbot renew --force-renewal

# Vérifier la configuration Nginx
nginx -t

# Recharger Nginx
systemctl reload nginx
```

---

## 📞 SUPPORT

### Documentation Officielle
- **Archon GitHub:** https://github.com/coleam00/Archon
- **Supabase Docs:** https://supabase.com/docs
- **Vite Docs:** https://vite.dev
- **FastAPI Docs:** https://fastapi.tiangolo.com

### Logs Importants
- Nginx errors: `/var/log/nginx/error.log`
- Nginx access: `/var/log/nginx/access.log`
- Certbot: `/var/log/letsencrypt/letsencrypt.log`
- Docker: `docker-compose logs -f`

### Commandes de Diagnostic
```bash
# Statut général
/opt/iafactory-rag-dz/frontend/archon-ui-stable/
docker-compose ps
systemctl status nginx
certbot certificates

# Test connectivité
curl -I https://archon.iafactoryalgeria.com
curl https://archon.iafactoryalgeria.com/health

# Test API
curl https://archon.iafactoryalgeria.com/api/health

# Test WebSocket
curl -I https://archon.iafactoryalgeria.com/socket.io/
```

---

## ✅ STATUT ACTUEL

**Dernière mise à jour:** 4 Décembre 2025 21:48 UTC

- ✅ Archon déployé et opérationnel
- ✅ SSL configuré et valide
- ✅ Base Supabase configurée
- ✅ Tous les services healthy
- ✅ DNS propagé
- ✅ Nginx reverse proxy fonctionnel
- ⏳ Base de connaissances à peupler
- ⏳ Intégration MCP avec Bolt.diy à configurer

**Temps de déploiement total:** ~2 heures
**Problèmes rencontrés:** SSH timeouts, VITE_ALLOWED_HOSTS config
**Status final:** ✅ SUCCÈS
