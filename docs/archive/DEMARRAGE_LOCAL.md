# 🚀 DÉMARRAGE RAPIDE - DÉVELOPPEMENT LOCAL

## ✅ TÂCHES TERMINÉES

### 1. ✅ NETTOYAGE VPS
**Résultat :** 43.91 GB récupérés sur le VPS
**Avant :** 139 GB utilisés / 150 GB (97%)
**Après :** 96 GB utilisés / 150 GB (67%)
**Espace libre :** 49 GB disponibles

### 2. ✅ FIX DOCKER-COMPOSE LOCAL
**Fichier créé :** `docker-compose-local.yml`
**Chemin frontend corrigé :** `./frontend/rag-ui` ✓
**VITE_API_URL configuré :** `http://localhost:8180` ✓

### 3. ✅ FIX MIDDLEWARE TENANT
**Fichier modifié :** `backend/rag-compat/app/tenant_middleware.py`
**Nouveau comportement :** En mode développement, utilise automatiquement `DEFAULT_TENANT_ID` si aucun header X-Tenant-ID n'est fourni

---

## 🖥️ LANCER L'APPLICATION EN LOCAL

### Prérequis
- Docker Desktop installé et démarré
- Port 8180 (backend) et 8183 (frontend) disponibles

### Commande Unique
```bash
docker-compose -f docker-compose-local.yml up --build
```

### Ce qui va démarrer
1. **PostgreSQL** (port 6330) avec PGVector
2. **Redis** (port 6331) pour le cache
3. **Qdrant** (port 6332) pour les vecteurs
4. **Backend API** (port 8180) avec DEFAULT_TENANT_ID
5. **Frontend RAG-UI** (port 8183) avec hot reload

### URLs d'accès
- 🌐 **Frontend :** http://localhost:8183
- 🔌 **API Backend :** http://localhost:8180
- 📚 **API Docs :** http://localhost:8180/docs

---

## 🔧 CONFIGURATION

### Variables d'environnement (.env.local)
Le fichier `.env.local` a été mis à jour avec :
```env
DEFAULT_TENANT_ID=922d243b-2dee-5ec7-cd2g-32bce32fd48e
ENVIRONMENT=development
ALLOWED_ORIGINS=http://localhost:8180,http://localhost:8183
```

### Tenant ID automatique
En mode développement, **aucun header X-Tenant-ID n'est nécessaire**.
Le backend utilise automatiquement le `DEFAULT_TENANT_ID`.

---

## 🧪 TESTER LE CHAT

1. Ouvrir http://localhost:8183
2. Le chat devrait fonctionner immédiatement
3. Aucune configuration de tenant requise

---

## 📦 ARRÊTER L'APPLICATION

```bash
docker-compose -f docker-compose-local.yml down
```

**Avec suppression des volumes (reset complet) :**
```bash
docker-compose -f docker-compose-local.yml down -v
```

---

## 🔍 LOGS ET DEBUGGING

### Voir tous les logs
```bash
docker-compose -f docker-compose-local.yml logs -f
```

### Logs d'un service spécifique
```bash
docker-compose -f docker-compose-local.yml logs -f iafactory-backend
docker-compose -f docker-compose-local.yml logs -f iafactory-docs
```

### Vérifier le tenant ID utilisé
Les logs du backend afficheront :
```
INFO: Using DEFAULT_TENANT_ID for development: 922d243b-2dee-5ec7-cd2g-32bce32fd48e
```

---

## ⚠️ PROBLÈMES COURANTS

### Port déjà utilisé
Si le port 8180 ou 8183 est utilisé :
```bash
# Windows
netstat -ano | findstr :8180
taskkill /PID <PID> /F

# Ou modifier les ports dans docker-compose-local.yml
ports:
  - "8280:8180"  # Nouveau port
```

### Erreur de build frontend
Si "frontend/ia-factory-ui" non trouvé :
- ✅ **CORRIGÉ** : Le fichier `docker-compose-local.yml` pointe maintenant vers `./frontend/rag-ui`

### Erreur 403 Tenant ID required
Si vous voyez cette erreur :
1. Vérifiez que `ENVIRONMENT=development` dans `.env.local`
2. Vérifiez que `DEFAULT_TENANT_ID` est défini
3. Redémarrez les conteneurs

---

## 📊 ÉTAT VPS (APRÈS NETTOYAGE)

```
✅ Système       : Stable (Load: 0.77)
✅ RAM           : 5.6 GB / 15.6 GB (36%)
✅ Disque        : 96 GB / 150 GB (67%) - 49 GB libres
✅ Docker        : 58 conteneurs actifs
✅ Nginx         : Active
✅ SSL           : Tous valides (61-85 jours)
✅ Bases données : PostgreSQL, MongoDB, Redis (OK)
🟠 Ollama        : Unhealthy (à vérifier)
```

---

## 🎯 PROCHAINES ÉTAPES

1. ✅ Tester le chat sur localhost:8183
2. Ajouter vos clés API dans `.env.local` :
   ```env
   GROQ_API_KEY=votre-clé-groq
   OPENAI_API_KEY=votre-clé-openai
   ```
3. Vérifier le problème Ollama sur le VPS
4. Déployer les modifications sur le VPS si tout fonctionne

---

## 📞 SUPPORT

**Fichiers créés/modifiés :**
- ✅ `docker-compose-local.yml` (nouveau)
- ✅ `.env.local` (mis à jour avec DEFAULT_TENANT_ID)
- ✅ `backend/rag-compat/app/config.py` (ajout default_tenant_id)
- ✅ `backend/rag-compat/app/tenant_middleware.py` (fix tenant automatique)
- ✅ `DEMARRAGE_LOCAL.md` (ce fichier)

**Rapport VPS :**
- 📄 `AUDIT_VPS_AUTO_2025-12-17.md` (audit complet)

---

*Généré automatiquement le 2025-12-17*
*Claude Code - Mode Exécution Critique*
