# 🚀 DÉMARRAGE RAPIDE - 7 TÂCHES
## IAFactory Algeria - Hetzner Console

**Vous êtes dans:** `root@iafactorysuisse:~#`

---

## ✅ DÉJÀ COMPLÉTÉ

1. **Archon déployé** - 3 containers actifs:
   - archon-server
   - archon-mcp
   - archon-ui
   - URL: https://archon.iafactoryalgeria.com

2. **PostgreSQL sécurisé** - Port 6330 sur localhost uniquement

---

## 📋 À FAIRE MAINTENANT - Copier-Coller dans Console

### ÉTAPE 1: Ouvrir le Guide Complet

Le fichier complet avec toutes les commandes est ici:
**d:\IAFactory\rag-dz\CONSOLE_COMMANDS_7_TASKS.md**

### ÉTAPE 2: Exécuter les 7 Tâches

Ouvrir `CONSOLE_COMMANDS_7_TASKS.md` et copier-coller chaque bloc dans la console Hetzner dans l'ordre:

1. **TÂCHE 1**: Sécurisation PostgreSQL/Ollama
   - ⚠️ Commencer par le nettoyage si port 8186 occupé
   - Puis démarrer les services

2. **TÂCHE 2**: Bolt.diy
   - Démarrage application sur port 5173
   - Configuration Nginx reverse proxy

3. **TÂCHE 3**: Qdrant Vector DB
   - Déploiement container Qdrant
   - Base pour agents IA

4. **TÂCHE 4**: Grafana Public SSL
   - ⚠️ VÉRIFIER DNS D'ABORD: `host grafana.iafactoryalgeria.com`
   - Si DNS OK → exécuter les commandes
   - Si DNS pas configuré → sauter et revenir plus tard

5. **TÂCHE 5**: Backups PostgreSQL
   - Script backup automatique
   - Cron job quotidien à 2h AM
   - Premier backup immédiat

6. **TÂCHE 6**: Documentation
   - Génération auto de la doc
   - Liste des 43+ services

7. **TÂCHE 7**: Alertes Monitoring
   - Configuration Prometheus alerts
   - AlertManager

### ÉTAPE 3: Vérification Finale

À la fin de `CONSOLE_COMMANDS_7_TASKS.md`, il y a un bloc **"VÉRIFICATION FINALE"**.

Copier-coller ce bloc pour voir le résumé complet de toutes les tâches.

---

## 🎯 RÉSULTAT ATTENDU

Après les 7 tâches:

```
Infrastructure Score: 98/100 ⭐⭐⭐⭐⭐

✅ 43+ containers actifs
✅ PostgreSQL/Ollama sécurisés (localhost only)
✅ Bolt.diy accessible (port 5173 + proxy)
✅ Qdrant vector DB déployé
✅ Grafana monitoring public (si DNS configuré)
✅ Backups PostgreSQL quotidiens
✅ Documentation à jour
✅ Alertes monitoring actives
```

---

## ⏱️ DURÉE ESTIMÉE

- **TÂCHE 1**: 2 minutes (+ 2 min nettoyage si nécessaire)
- **TÂCHE 2**: 3-5 minutes (npm install)
- **TÂCHE 3**: 1 minute
- **TÂCHE 4**: 2-3 minutes (si DNS configuré)
- **TÂCHE 5**: 2 minutes
- **TÂCHE 6**: 30 secondes
- **TÂCHE 7**: 1 minute

**TOTAL**: 12-17 minutes

---

## 🆘 SI PROBLÈME

### Commande échoue?
- Lire le message d'erreur
- Vérifier que Docker tourne: `systemctl status docker`
- Relancer la commande (scripts sont idempotents)

### Besoin de logs?
```bash
# Logs d'un container
docker logs -f <nom-container>

# Logs Nginx
tail -f /var/log/nginx/error.log

# Liste containers actifs
docker ps
```

### SSH timeout pendant exécution?
- **Pas grave!** Hetzner Console ne timeout pas
- Le script continue de tourner
- Attendre simplement qu'il finisse

---

## 📁 FICHIERS IMPORTANTS

**Sur votre machine Windows:**
- `d:\IAFactory\rag-dz\CONSOLE_COMMANDS_7_TASKS.md` ← **OUVRIR CE FICHIER**
- `d:\IAFactory\rag-dz\GUIDE_EXECUTION_IMMEDIATE.md` ← Guide détaillé
- `d:\IAFactory\rag-dz\START_HERE_CONSOLE.md` ← Ce fichier

**Sur le serveur (après exécution):**
- `/opt/iafactory-rag-dz/DOCUMENTATION_SERVICES_GENERATED.md` ← Doc finale
- `/opt/backups/postgresql/daily/` ← Backups PostgreSQL
- `/opt/iafactory-rag-dz/bolt-diy/bolt.log` ← Logs Bolt

---

## 🎓 APRÈS LES 7 TÂCHES

1. Changer mot de passe Grafana (login: admin/admin)
2. Configurer DNS grafana si pas fait
3. Tester les URLs:
   - https://www.iafactoryalgeria.com
   - https://archon.iafactoryalgeria.com
   - https://www.iafactoryalgeria.com/bolt/
   - https://grafana.iafactoryalgeria.com (si DNS configuré)

---

**Date**: 4 Décembre 2025
**Serveur**: iafactorysuisse (46.224.3.125)
**Status**: Prêt pour exécution ✅
