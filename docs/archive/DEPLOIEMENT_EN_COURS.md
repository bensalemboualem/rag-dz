# 🚀 DÉPLOIEMENT EN COURS

**Date**: 2 décembre 2025, 23:20
**Status**: ⏳ EN COURS

---

## 📊 Informations VPS

```
Serveur: iafactorysuisse
IP: 46.224.3.125
IPv6: 2a01:4f8:c17:8922::/64
OS: Ubuntu 6.8.0-71 (Linux)
Domaine: www.iafactoryalgeria.com
```

---

## ⏱️ Progression du Déploiement

| Étape | Status | Durée estimée |
|-------|--------|---------------|
| ✅ Test connexion SSH | **TERMINÉ** | 10 sec |
| ⏳ **Copie fichiers** | **EN COURS** | 2-5 min |
| ⏳ Configuration .env | EN ATTENTE | 30 sec |
| ⏳ Installation Docker | EN ATTENTE | 2-3 min |
| ⏳ Installation Nginx | EN ATTENTE | 1-2 min |
| ⏳ Configuration firewall | EN ATTENTE | 30 sec |
| ⏳ Démarrage services | EN ATTENTE | 3-5 min |
| ⏳ Configuration SSL | EN ATTENTE | 2-3 min |

**Durée totale estimée**: 15-20 minutes

---

## 📦 Ce Qui Est Déployé

### Applications (47)
- agri-dz, agroalimentaire-dz, billing-panel
- bmad, btp-dz, business-dz, clinique-dz
- commerce-dz, creative-studio, crm-ia
- dashboard, data-dz, dev-portal, developer
- Et 33 autres applications...

### Backend Services
- FastAPI Backend (API principale)
- PostgreSQL + PGVector (Base de données)
- Redis Cache (Cache rapide)
- Qdrant (Vector Database)

### Frontend
- Landing page avec Chat IA
- 47 applications professionnelles
- Directory IA (agents, tools, workflows)

### Infrastructure
- Docker Compose (conteneurisation)
- Nginx (reverse proxy)
- SSL/HTTPS (Let's Encrypt)
- Firewall UFW

---

## 🌐 URLs Après Déploiement

```
https://www.iafactoryalgeria.com              → Landing page
https://www.iafactoryalgeria.com/apps/        → 47 applications
https://www.iafactoryalgeria.com/docs/        → Directory IA
https://www.iafactoryalgeria.com/api/         → API Backend
http://46.224.3.125:8180/health                → Health check
```

---

## 📝 Commandes de Monitoring

Pendant le déploiement, vous pouvez:

```bash
# Se connecter au VPS
ssh root@46.224.3.125

# Voir les logs en temps réel
cd /opt/iafactory-rag-dz
tail -f /var/log/nginx/access.log

# Status des conteneurs Docker
docker-compose ps

# Logs du backend
docker-compose logs -f iafactory-backend
```

---

## ⏳ Prochaines Étapes

### Après le Déploiement (Optionnel)

1. **Configurer les Clés API** (5 min)
   ```bash
   ssh root@46.224.3.125
   nano /opt/iafactory-rag-dz/.env
   # Ajouter GROQ_API_KEY, OPENAI_API_KEY, etc.
   docker-compose restart
   ```

2. **Tester les Applications** (10 min)
   - Ouvrir https://www.iafactoryalgeria.com
   - Tester le chat IA
   - Vérifier quelques apps

3. **Ajouter AR/EN** (1-2 jours)
   - Voir guide: LANGUES_AR_EN_GUIDE.md
   - Utiliser script de traduction automatique
   - Réviser les traductions

---

## 🔧 Dépannage

### Si le déploiement échoue

```bash
# Se connecter au VPS
ssh root@46.224.3.125

# Vérifier les logs
cd /opt/iafactory-rag-dz
docker-compose logs

# Redémarrer si nécessaire
docker-compose down
docker-compose up -d
```

### Si le site ne s'affiche pas

```bash
# Vérifier Nginx
systemctl status nginx

# Vérifier les conteneurs
docker-compose ps

# Tester avec l'IP directement
curl http://46.224.3.125:8180/health
```

---

## 📞 Status Actuel

**Temps écoulé**: ~2 minutes
**Status**: ⏳ Copie des fichiers en cours
**Prochaine étape**: Configuration et installation

**ETA fin du déploiement**: ~13-18 minutes

---

*Ce fichier sera mis à jour avec le status final une fois le déploiement terminé.*
