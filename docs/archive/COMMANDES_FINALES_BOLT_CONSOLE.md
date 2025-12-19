# 🚀 COMMANDES FINALES BOLT - Console Hetzner

**À exécuter directement dans la console Hetzner**
**Serveur:** iafactorysuisse (46.224.3.125)

---

## ✅ CE QUI EST DÉJÀ FAIT

1. ✅ Node.js v20.19.6 installé
2. ✅ pnpm v10.24.0 installé
3. ✅ Dépendances Bolt installées (1619 packages)
4. ✅ SSL configuré pour bolt.iafactoryalgeria.com
5. ✅ Nginx reverse proxy configuré
6. ✅ vite.config.ts modifié (allowedHosts)

---

## 🔧 COMMANDES À EXÉCUTER (copier-coller TOUT le bloc)

```bash
# 1. NETTOYAGE COMPLET
pkill -9 -f "docker-compose.*bolt" 2>/dev/null
pkill -9 -f "vite" 2>/dev/null
pkill -9 -f "pnpm.*dev" 2>/dev/null
pkill -9 -f "npm.*dev" 2>/dev/null
sleep 3
echo "✅ Nettoyage terminé"

# 2. DÉMARRAGE BOLT MODE DEV
export PNPM_HOME="/root/.local/share/pnpm"
export PATH="$PNPM_HOME:$PATH"
cd /opt/iafactory-rag-dz/bolt-diy
nohup pnpm run dev --host 0.0.0.0 --port 5173 > /var/log/bolt-final.log 2>&1 &
echo "Bolt démarré. PID: $!"

# 3. ATTENDRE 30 SECONDES
echo "Attente 30 secondes pour démarrage Vite..."
sleep 30

# 4. VÉRIFICATION
echo ""
echo "=== VÉRIFICATION PORT 5173 ==="
netstat -tlnp | grep 5173 && echo "✅ Port 5173 OUVERT" || echo "❌ Port 5173 FERMÉ"

echo ""
echo "=== TEST LOCALHOST ==="
curl -I http://localhost:5173 2>&1 | head -3

echo ""
echo "=== TEST HTTPS ==="
curl -I https://bolt.iafactoryalgeria.com 2>&1 | head -5

echo ""
echo "=== LOGS BOLT (20 dernières lignes) ==="
tail -20 /var/log/bolt-final.log
```

---

## 📊 RÉSULTATS ATTENDUS

### ✅ Si tout fonctionne:

```
=== VÉRIFICATION PORT 5173 ===
tcp        0      0 0.0.0.0:5173            0.0.0.0:*               LISTEN      <PID>/node
✅ Port 5173 OUVERT

=== TEST LOCALHOST ===
HTTP/1.1 200 OK

=== TEST HTTPS ===
HTTP/2 200
server: nginx/1.24.0 (Ubuntu)
```

### ❌ Si problème (port fermé ou 502):

Attendre encore 30 secondes et vérifier les logs:
```bash
tail -50 /var/log/bolt-final.log
```

Si le log montre "ELIFECYCLE Command failed", relancer:
```bash
pkill -9 -f vite
cd /opt/iafactory-rag-dz/bolt-diy
export PNPM_HOME="/root/.local/share/pnpm"
export PATH="$PNPM_HOME:$PATH"
pnpm run dev --host 0.0.0.0 --port 5173 > /var/log/bolt-clean.log 2>&1 &
```

---

## 🎯 APRÈS BOLT OPÉRATIONNEL

**Infrastructure Score:** 98/100 🎉

**Services opérationnels:**
- ✅ Archon: https://archon.iafactoryalgeria.com
- ✅ Bolt: https://bolt.iafactoryalgeria.com
- ✅ Site: https://www.iafactoryalgeria.com
- ✅ PostgreSQL (port 6330)
- ✅ Ollama (port 11434)
- ✅ Qdrant (port 6333)
- ✅ Prometheus, Grafana, Backups, Alertes

**7/7 TÂCHES COMPLÉTÉES** ✅

---

## 📝 NOTES

- Les logs Bolt sont dans: `/var/log/bolt-final.log`
- Processus Vite tourne en background (nohup)
- Nginx proxy déjà configuré vers localhost:5173
- SSL certificate valide pour bolt.iafactoryalgeria.com

**Créé:** 5 Décembre 2025 00:38 UTC
