# AUDIT COMPLET VPS - INSTRUCTIONS
## IAFactory Algeria - Check Professionnel Complet

**Date:** 4 Décembre 2025

---

## 🚨 PROBLÈME: VPS INACCESSIBLE

Le VPS ne répond pas aux connexions SSH ni HTTPS. Actions immédiates:

### OPTION 1: Console Hetzner (RECOMMANDÉ)

1. **Connecte-toi à Hetzner Cloud Console:**
   ```
   https://console.hetzner.cloud/
   ```

2. **Vérifier l'état du serveur:**
   - Tableau de bord → Ton projet
   - Clique sur le serveur (46.224.3.125)
   - Status: Running / Stopped / Error?

3. **Si Stopped:**
   - Bouton "Power On"
   - Attendre 2-3 minutes

4. **Si Running mais inaccessible:**
   - Clique sur "Console" (terminal dans le navigateur)
   - Login: root
   - Password: Ainsefra*0819692025*

---

## 🔍 AUDIT COMPLET (À exécuter via Console Hetzner)

Une fois connecté à la console, copie-colle ce script:

```bash
# ================================================================
# AUDIT RAPIDE - COMMANDE UNIQUE
# ================================================================

cat << 'AUDIT_EOF' > /tmp/quick-audit.sh
#!/bin/bash

echo "================================================================"
echo "🔍 AUDIT RAPIDE - IAFactory Algeria"
echo "================================================================"
echo ""

# 1. Système
echo "📊 SYSTÈME:"
echo "  Uptime: $(uptime -p)"
echo "  Load: $(uptime | awk -F'load average:' '{print $2}')"
echo "  Mémoire: $(free -h | grep Mem | awk '{print $3 "/" $2 " (" int($3/$2*100) "%)"}')"
echo "  Disque: $(df -h / | tail -1 | awk '{print $3 "/" $2 " (" $5 ")"}')"
echo ""

# 2. Docker
echo "🐳 DOCKER:"
docker ps --format "  {{.Names}}: {{.Status}}"
echo ""

# 3. Nginx
echo "🌐 NGINX:"
if systemctl is-active nginx &>/dev/null; then
    echo "  ✅ Status: Active"
    echo "  Connexions: $(ss -tn | grep ':80\|:443' | wc -l)"
else
    echo "  ❌ Status: Inactive"
fi
echo ""

# 4. Ports
echo "🔌 PORTS EN ÉCOUTE:"
netstat -tlnp | grep -E ':(80|443|3737|5173|8000|8181|8051)' | awk '{print "  "$4" → "$7}'
echo ""

# 5. SSL
echo "🔐 CERTIFICATS SSL:"
certbot certificates 2>/dev/null | grep -E "Certificate Name|Expiry Date" | sed 's/^/  /'
echo ""

# 6. Problèmes
echo "⚠️  PROBLÈMES DÉTECTÉS:"
ISSUES=0

# Mémoire
MEM=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
if [ $MEM -gt 80 ]; then
    echo "  ❌ Mémoire élevée: ${MEM}%"
    ISSUES=$((ISSUES+1))
fi

# Disque
DISK=$(df / | tail -1 | awk '{print int($5)}')
if [ $DISK -gt 80 ]; then
    echo "  ❌ Disque plein: ${DISK}%"
    ISSUES=$((ISSUES+1))
fi

# Conteneurs arrêtés
STOPPED=$(docker ps -a -f status=exited | wc -l)
if [ $STOPPED -gt 1 ]; then
    echo "  ⚠️  $STOPPED conteneurs arrêtés"
    docker ps -a -f status=exited --format "    • {{.Names}}"
fi

if [ $ISSUES -eq 0 ]; then
    echo "  ✅ Aucun problème critique"
fi

echo ""
echo "================================================================"
echo "✅ Audit terminé: $(date)"
echo "================================================================"
AUDIT_EOF

chmod +x /tmp/quick-audit.sh
/tmp/quick-audit.sh
```

---

## 📋 CHECKLIST SERVICES

Après l'audit rapide, vérifie chaque service:

### 1. Archon (Base de Connaissances)

```bash
echo "🔍 ARCHON CHECK:"
echo ""

# Status conteneurs
docker ps | grep archon

# Logs
echo "Logs archon-ui:"
docker logs archon-ui --tail 10

echo ""
echo "Logs archon-server:"
docker logs archon-server --tail 10

# Test HTTP
echo ""
echo "Test HTTP:"
curl -I http://localhost:3737
curl -I https://archon.iafactoryalgeria.com
```

**Résultat attendu:**
- ✅ 3 conteneurs Running (archon-server, archon-mcp, archon-ui)
- ✅ HTTP 200 sur localhost:3737
- ✅ HTTPS 200 sur archon.iafactoryalgeria.com

**Si problème:**
```bash
cd /opt/iafactory-rag-dz/frontend/archon-ui-stable
docker-compose restart
```

---

### 2. Bolt.diy (Générateur Code IA)

```bash
echo "🔍 BOLT CHECK:"
echo ""

# Trouver Bolt
BOLT_DIR=$(find /opt -name "*bolt*" -type d 2>/dev/null | grep -v node_modules | head -1)
echo "Bolt trouvé: $BOLT_DIR"

# Status
if docker ps | grep -q bolt; then
    echo "✅ Bolt running (Docker)"
    docker ps | grep bolt
elif netstat -tlnp | grep -q ":5173"; then
    echo "✅ Bolt running (npm)"
    netstat -tlnp | grep ":5173"
else
    echo "❌ Bolt NOT running"
fi

# Test HTTP
curl -I http://localhost:5173
curl -I https://www.iafactoryalgeria.com/bolt/
```

**Résultat attendu:**
- ✅ Port 5173 en écoute
- ✅ HTTP 200 sur localhost:5173
- ✅ HTTPS 200 ou 301 sur /bolt/

**Si problème:**
```bash
cd $BOLT_DIR
docker-compose up -d
# OU
npm run dev
```

---

### 3. RAG Backend (FastAPI)

```bash
echo "🔍 RAG BACKEND CHECK:"
echo ""

# Status
if netstat -tlnp | grep -q ":8000"; then
    echo "✅ RAG Backend running"
    netstat -tlnp | grep ":8000"
else
    echo "❌ RAG Backend NOT running"
fi

# Test API
curl -I http://localhost:8000/docs
curl -I https://www.iafactoryalgeria.com/api/docs
```

**Résultat attendu:**
- ✅ Port 8000 en écoute
- ✅ HTTP 200 sur /docs (FastAPI Swagger)

**Si problème:**
```bash
cd /opt/iafactory-rag-dz/backend/rag-compat
docker-compose up -d
```

---

### 4. School OneST (MySQL)

```bash
echo "🔍 SCHOOL ONEST CHECK:"
echo ""

# Status MySQL
if docker ps | grep -q school.*mysql; then
    echo "✅ MySQL running"
    docker ps | grep school

    # Test connexion
    docker exec school-mysql mysql -uroot -e "SHOW DATABASES;"
else
    echo "❌ MySQL NOT running"
fi
```

**Résultat attendu:**
- ✅ Container school-mysql Running
- ✅ Database onest_school existe

---

### 5. Nginx & SSL

```bash
echo "🔍 NGINX & SSL CHECK:"
echo ""

# Status Nginx
systemctl status nginx --no-pager | head -10

# Test config
nginx -t

# Sites activés
ls -la /etc/nginx/sites-enabled/

# Certificats SSL
certbot certificates

# Test domaines
echo ""
echo "Test domaines:"
curl -I https://www.iafactoryalgeria.com
curl -I https://archon.iafactoryalgeria.com
curl -I https://school.iafactoryalgeria.com
```

**Résultat attendu:**
- ✅ Nginx active
- ✅ nginx -t success
- ✅ Certificats SSL valides
- ✅ HTTPS 200 sur tous les domaines

**Si problème:**
```bash
# Recharger Nginx
systemctl reload nginx

# Renouveler SSL
certbot renew
```

---

## 🔧 CORRECTIONS RAPIDES

### Problème: Mémoire élevée (>80%)

```bash
# Voir processus consommateurs
ps aux --sort=-%mem | head -10

# Restart services non essentiels
docker restart archon-ui
docker restart bolt

# Nettoyer cache
sync; echo 3 > /proc/sys/vm/drop_caches
```

### Problème: Disque plein (>80%)

```bash
# Voir l'utilisation
du -sh /var/* | sort -h

# Nettoyer logs Docker
docker system prune -a -f

# Nettoyer logs système
journalctl --vacuum-time=7d

# Nettoyer logs Nginx
truncate -s 0 /var/log/nginx/*.log
```

### Problème: Conteneurs arrêtés

```bash
# Lister conteneurs arrêtés
docker ps -a -f status=exited

# Redémarrer tous
docker-compose -f /opt/iafactory-rag-dz/docker-compose.yml up -d

# Supprimer conteneurs obsolètes
docker container prune -f
```

### Problème: Nginx erreurs

```bash
# Logs erreurs
tail -f /var/log/nginx/error.log

# Test config
nginx -t

# Restaurer backup si besoin
ls -la /etc/nginx/sites-available/*.backup*
```

---

## 📊 RAPPORT COMPLET (Script Principal)

Pour un audit professionnel complet, exécute:

```bash
# Copier le script complet
cat > /tmp/audit-complete.sh << 'SCRIPT_EOF'
[Copier TOUT le contenu de audit-infrastructure-complete.sh ici]
SCRIPT_EOF

# Rendre exécutable
chmod +x /tmp/audit-complete.sh

# Exécuter
/tmp/audit-complete.sh

# Voir le rapport
cat /tmp/iafactory-audit-*.txt
```

Le rapport généré contiendra:
1. ✅ Informations système complètes
2. ✅ État de tous les conteneurs Docker
3. ✅ Vérification détaillée de chaque service
4. ✅ Configuration Nginx
5. ✅ Certificats SSL
6. ✅ DNS et réseau
7. ✅ Bases de données
8. ✅ Applications et agents IA
9. ✅ Logs système
10. ✅ Sécurité
11. ✅ Performance
12. ✅ Recommandations automatiques

---

## 🎯 ACTIONS PRIORITAIRES

Après l'audit, execute ces commandes pour garantir que tout fonctionne:

```bash
# 1. Redémarrer tous les services
echo "🔄 Restart de tous les services..."
systemctl restart nginx
docker-compose -f /opt/iafactory-rag-dz/docker-compose.yml restart
docker-compose -f /opt/iafactory-rag-dz/frontend/archon-ui-stable/docker-compose.yml restart

# 2. Vérifier status
echo "✅ Vérification status..."
systemctl status nginx
docker ps

# 3. Test endpoints
echo "🌐 Test des endpoints..."
curl -I http://localhost:3737  # Archon
curl -I http://localhost:5173  # Bolt
curl -I http://localhost:8000  # RAG

# 4. Résumé final
echo ""
echo "╔════════════════════════════════════════╗"
echo "║    RÉSUMÉ POST-REDÉMARRAGE             ║"
echo "╚════════════════════════════════════════╝"
docker ps --format "{{.Names}}: {{.Status}}"
```

---

## 📞 SI PROBLÈME PERSISTE

1. **Prendre screenshot de l'audit**
2. **Copier le rapport complet:**
   ```bash
   cat /tmp/iafactory-audit-*.txt
   ```
3. **Envoyer à Claude ou moi**

---

## ✅ CHECKLIST FINALE

- [ ] VPS accessible (Console Hetzner)
- [ ] Audit rapide exécuté
- [ ] Archon: 3 conteneurs Running + HTTPS OK
- [ ] Bolt: Port 5173 + HTTPS OK
- [ ] RAG Backend: Port 8000 + API OK
- [ ] Nginx: Active + Config valide
- [ ] SSL: Certificats valides (>30 jours)
- [ ] Mémoire < 80%
- [ ] Disque < 80%
- [ ] Aucun conteneur en erreur

---

**Temps estimé:** 10-15 minutes
**Niveau:** Professionnel - Audit complet production-ready

**Scripts créés:**
- `audit-infrastructure-complete.sh` - Audit exhaustif
- `fix-bolt-complete.sh` - Correction Bolt automatique
- `AUDIT_VPS_INSTRUCTIONS.md` - Ce guide
