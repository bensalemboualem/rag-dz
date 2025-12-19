# ⚡ COMMANDES RAPIDES - DÉPLOIEMENT VPS

## 🔌 Connexion VPS
```bash
ssh root@46.224.3.125
cd /opt/iafactory
```

---

## 🐳 Docker - Commandes Essentielles

### Démarrage complet
```bash
docker-compose up -d --build
```

### Voir containers
```bash
docker ps
```

### Logs en temps réel
```bash
# Tous services
docker-compose logs -f

# Backend seul
docker logs -f iaf-dz-backend

# Dernières 100 lignes
docker logs --tail 100 iaf-dz-backend
```

### Redémarrage
```bash
# Un service
docker-compose restart iaf-dz-backend

# Tous
docker-compose restart

# Reset complet
docker-compose down && docker-compose up -d
```

### Entrer dans container
```bash
docker exec -it iaf-dz-backend bash
```

---

## 🏥 Health Checks

### Backend API
```bash
curl http://localhost:8180/health
curl http://localhost:8180/docs
```

### RAG Status
```bash
curl http://localhost:8180/api/rag/multi/status
```

### Qdrant
```bash
curl http://localhost:6332/collections
```

### PostgreSQL
```bash
docker exec -it iaf-dz-postgres psql -U postgres -d iafactory_dz -c "SELECT count(*) FROM documents;"
```

---

## 🧪 Test RAG

### Test RAG Business DZ
```bash
curl -X POST http://localhost:8180/api/rag/multi/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Quel est le taux de TVA en Algérie?",
    "country": "DZ",
    "top_k": 5
  }'
```

### Test RAG École
```bash
curl -X POST http://localhost:8180/api/rag/multi/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Comment gérer les absences étudiants?",
    "country": "CH",
    "top_k": 5
  }'
```

### Test RAG Islam
```bash
curl -X POST http://localhost:8180/api/rag/multi/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Quels sont les piliers de l Islam?",
    "country": "GLOBAL",
    "top_k": 5
  }'
```

---

## 🌐 Nginx

### Vérifier config
```bash
nginx -t
```

### Recharger
```bash
systemctl reload nginx
```

### Logs
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## 🔒 SSL Certbot

### Obtenir certificat
```bash
certbot --nginx -d www.iafactoryalgeria.com
```

### Test renouvellement
```bash
certbot renew --dry-run
```

### Forcer renouvellement
```bash
certbot renew --force-renewal
```

---

## 📊 Monitoring

### Utilisation disque
```bash
df -h
```

### RAM/CPU
```bash
htop
# ou
docker stats
```

### Espace Docker
```bash
docker system df
```

### Nettoyage Docker
```bash
docker system prune -a
```

---

## 💾 Backup

### Backup PostgreSQL
```bash
docker exec iaf-dz-postgres pg_dump -U postgres iafactory_dz > backup_$(date +%Y%m%d).sql
```

### Backup Qdrant
```bash
docker exec iaf-dz-qdrant tar czf /tmp/qdrant_backup.tar.gz /qdrant/storage
docker cp iaf-dz-qdrant:/tmp/qdrant_backup.tar.gz ./qdrant_backup_$(date +%Y%m%d).tar.gz
```

---

## 🔧 Troubleshooting

### Container ne démarre pas
```bash
docker logs iaf-dz-backend
docker-compose down
docker-compose up -d iaf-dz-backend
```

### Port déjà utilisé
```bash
netstat -tulpn | grep 8180
kill -9 <PID>
```

### Erreur mémoire
```bash
# Voir usage
docker stats

# Redémarrer service
docker-compose restart iaf-dz-backend
```

### Reset complet
```bash
docker-compose down -v  # ⚠️ EFFACE DONNÉES
docker-compose up -d --build
```

---

## 📱 URLs Importantes

### Production
- Landing: https://www.iafactoryalgeria.com
- API Docs: https://www.iafactoryalgeria.com/api/docs
- Hub: https://www.iafactoryalgeria.com/hub
- RAG UI: https://www.iafactoryalgeria.com/docs
- Studio: https://www.iafactoryalgeria.com/studio

### Local (sur VPS)
- Backend: http://localhost:8180
- Hub: http://localhost:8182
- Docs: http://localhost:8183
- Qdrant: http://localhost:6332
- n8n: http://localhost:8185

---

## 🎯 Commandes Démo

### Questions préparées
```bash
# Test rapide 3 RAG
./test_3_rag.sh  # Si script existe

# Ou manuellement:
# Business DZ
curl -X POST http://localhost:8180/api/rag/multi/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Créer SARL Algérie?", "country": "DZ"}'

# École
curl -X POST http://localhost:8180/api/rag/multi/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Gérer absences étudiants?", "country": "CH"}'

# Islam
curl -X POST http://localhost:8180/api/rag/multi/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Piliers de l Islam?", "country": "GLOBAL"}'
```

---

## 🆘 SOS - Si tout plante

```bash
# 1. Arrêter tout
docker-compose down

# 2. Voir logs
journalctl -xe

# 3. Nettoyer
docker system prune -f

# 4. Redémarrer
docker-compose up -d --build

# 5. Vérifier
docker ps
curl http://localhost:8180/health

# 6. Si rien ne marche: reboot VPS
reboot
```

---

## 📞 Info Système

```bash
# Version Docker
docker --version

# Version Compose
docker-compose --version

# OS
cat /etc/os-release

# IP publique
curl ifconfig.me

# Ports ouverts
netstat -tulpn | grep LISTEN
```
