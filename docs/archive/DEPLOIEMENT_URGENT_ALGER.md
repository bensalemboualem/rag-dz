# 🚨 DÉPLOIEMENT URGENT - PRÉSENTATION ALGER DEMAIN

## ⏰ DEADLINE: Ce soir avant minuit

---

## ✅ MODIFICATIONS EFFECTUÉES

### 1. Frontend UI - Labels 3 RAG ✅
- `frontend/rag-ui/src/components/ia/BigRAGPage.tsx` → Titre et badges modifiés
- `frontend/rag-ui/src/components/ia/types.ts` → Labels pays changés:
  - DZ → "Business DZ" 💼
  - CH → "RAG École" 🎓
  - GLOBAL → "RAG Islam" ☪️

### 2. Landing Page ✅
- `landing-complete.html` → URLs corrigées (plus d'IP hardcodée)
- Tous les liens pointent vers chemins relatifs (/hub, /docs, /api, etc.)

### 3. Backend (aucun changement nécessaire)
- Code garde `rag_dz`, `rag_ch`, `rag_global` en interne
- Seuls les labels UI ont changé

---

## 📋 CHECKLIST DÉPLOIEMENT VPS (90 min)

### ⚙️ ÉTAPE 1: Configuration .env (15 min)

**SSH vers VPS:**
```bash
ssh root@46.224.3.125
cd /opt/iafactory  # ou votre chemin projet
```

**Éditer `.env.local`:**
```bash
nano .env.local
```

**Ajouter clés LLM (CHOISIR 1):**

**Option A - Groq (GRATUIT, recommandé démo):**
```bash
LLM_PROVIDER=groq
LLM_MODEL=llama-3.3-70b-versatile
GROQ_API_KEY=gsk_VOTRE_CLE_ICI  # Obtenir: https://console.groq.com
```

**Option B - Anthropic (meilleure qualité):**
```bash
LLM_PROVIDER=anthropic
LLM_MODEL=claude-3-5-sonnet-20241022
ANTHROPIC_API_KEY=sk-ant-VOTRE_CLE_ICI
```

**Option C - Google Gemini (déjà configuré):**
```bash
LLM_PROVIDER=google
LLM_MODEL=gemini-2.0-flash-exp
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyAK9IU-U2VCyLJFSGxu-MaPDcMBSmh73ys
```

**Sécurité (OBLIGATOIRE):**
```bash
# Générer secrets forts
API_SECRET_KEY=$(openssl rand -hex 32)
JWT_SECRET_KEY=$(openssl rand -hex 32)
POSTGRES_PASSWORD=VotreMotDePasseSecurise2024!

# Domaine
ALLOWED_ORIGINS=https://www.iafactoryalgeria.com,http://localhost:8180
VITE_API_URL=https://www.iafactoryalgeria.com/api
```

**Sauvegarder:** `Ctrl+O`, `Enter`, `Ctrl+X`

---

### 🐳 ÉTAPE 2: Upload code modifié (10 min)

**Depuis Windows (PowerShell):**
```powershell
# Compresser fichiers modifiés
tar -czf deploy-update.tar.gz `
  landing-complete.html `
  frontend/rag-ui/src/components/ia/BigRAGPage.tsx `
  frontend/rag-ui/src/components/ia/types.ts

# Upload vers VPS
scp deploy-update.tar.gz root@46.224.3.125:/opt/iafactory/

# SSH et décompresser
ssh root@46.224.3.125
cd /opt/iafactory
tar -xzf deploy-update.tar.gz
rm deploy-update.tar.gz
```

---

### 🚀 ÉTAPE 3: Démarrage Docker (10 min)

```bash
cd /opt/iafactory

# Arrêter services existants
docker-compose down

# Rebuild avec nouvelles modifications
docker-compose up -d --build

# Vérifier démarrage (attendre 2 min)
docker ps
```

**Résultat attendu (8 containers):**
```
iaf-dz-backend     Up    8180->8180
iaf-dz-postgres    Up    6330->5432
iaf-dz-redis       Up    6331->6379
iaf-dz-qdrant      Up    6332->6333
iaf-dz-hub         Up    8182->3737
iaf-dz-docs        Up    8183->5173
iaf-dz-seo         Up    8218->80
iaf-dz-n8n         Up    8185->5678
```

---

### 🏥 ÉTAPE 4: Health Check (5 min)

```bash
# Test backend
curl http://localhost:8180/health
# Attendu: {"status":"healthy"}

# Test API docs
curl http://localhost:8180/docs | head -20
# Attendu: HTML Swagger UI

# Test complet
./health_check.sh localhost 8180
```

---

### 📊 ÉTAPE 5: Seed RAG-DZ (20 min)

**Vérifier données existantes:**
```bash
curl http://localhost:6332/collections
```

**Si rag_dz vide, ingérer:**
```bash
docker exec -it iaf-dz-backend bash

# Inside container
python -m app.scripts.ingest_bigrag_cli \
  --country DZ \
  --file /app/data/rag_dz_seed.json

# Vérifier
curl http://localhost:8180/api/rag/multi/status
```

**Sortir du container:** `exit`

---

### 🌐 ÉTAPE 6: Nginx Configuration (10 min)

**Vérifier config Nginx:**
```bash
cat /etc/nginx/sites-available/iafactory
```

**Si besoin, créer/mettre à jour:**
```bash
nano /etc/nginx/sites-available/iafactory
```

**Configuration minimale:**
```nginx
server {
    server_name www.iafactoryalgeria.com;

    # Landing SEO
    location / {
        proxy_pass http://127.0.0.1:8218;
        proxy_set_header Host $host;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8180/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 300s;
    }

    # Hub
    location /hub/ {
        proxy_pass http://127.0.0.1:8182/;
    }

    # Docs
    location /docs/ {
        proxy_pass http://127.0.0.1:8183/;
    }

    # Studio
    location /studio/ {
        proxy_pass http://127.0.0.1:8184/;
    }

    # Qdrant
    location /qdrant/ {
        proxy_pass http://127.0.0.1:6332/;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/www.iafactoryalgeria.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.iafactoryalgeria.com/privkey.pem;
}

server {
    listen 80;
    server_name www.iafactoryalgeria.com;
    return 301 https://$server_name$request_uri;
}
```

**Activer et recharger:**
```bash
ln -sf /etc/nginx/sites-available/iafactory /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

### 🔒 ÉTAPE 7: SSL/HTTPS (5 min)

**Si certificat n'existe pas:**
```bash
certbot --nginx -d www.iafactoryalgeria.com --email votre@email.com --agree-tos
```

**Vérifier renouvellement auto:**
```bash
certbot renew --dry-run
```

---

### 🧪 ÉTAPE 8: Tests Finaux (10 min)

**Depuis navigateur:**

1. ✅ https://www.iafactoryalgeria.com → Landing page
2. ✅ https://www.iafactoryalgeria.com/api/docs → Swagger UI
3. ✅ https://www.iafactoryalgeria.com/hub → Archon UI
4. ✅ https://www.iafactoryalgeria.com/docs → RAG UI (voir badges 3 RAG)

**Test RAG DZ (curl):**
```bash
curl -X POST https://www.iafactoryalgeria.com/api/rag/multi/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Quel est le taux de TVA en Algérie?",
    "country": "DZ",
    "top_k": 5
  }'
```

---

### 🎤 ÉTAPE 9: Préparation Démo (20 min)

**Questions à tester ce soir:**

**RAG Business DZ (rag_dz):**
```
1. "Comment créer une SARL en Algérie?"
2. "Quel est le taux d'IBS pour les PME?"
3. "Obligations CNAS pour nouveaux employés?"
4. "Procédure obtention NIF DGI?"
5. "Différence entre IRG et IBS?"
```

**RAG École (rag_ch - OneSchool):**
```
1. "Comment gérer les absences étudiants?"
2. "Système de notation en Algérie?"
3. "Gestion planning cours?"
```

**RAG Islam (rag_global):**
```
1. "Quels sont les piliers de l'Islam?"
2. "Horaires prière Alger?"
3. "Règles zakat al-fitr?"
```

**Tester depuis UI:**
- https://www.iafactoryalgeria.com/docs
- Sélectionner chaque RAG dans le dropdown
- Poser questions ci-dessus
- Vérifier réponses pertinentes en <3s

---

## 🎯 SLIDES PRÉSENTATION ALGER

### 1. Slide d'ouverture
- **Titre:** "iaFactory Algeria - Plateforme IA Souveraine 🇩🇿"
- **Sous-titre:** "3 RAG Spécialisés pour transformer votre business"

### 2. Architecture 3 RAG
```
💼 RAG Business DZ
   → Fiscal, Juridique, Administratif
   → Base: Lois algériennes, DGI, CNAS
   → Cible: PME, Startups, Entrepreneurs

🎓 RAG École (OneSchool)
   → Gestion éducative IA
   → Base: Programmes, pédagogie
   → Cible: Écoles privées DZ

☪️ RAG Islam
   → Contenu religieux industriel
   → Base: Coran, Hadith, Fiqh
   → Cible: Grand public arabophone
```

### 3. Stack Technique
- **Backend:** FastAPI + Python 3.11
- **Vector DB:** Qdrant + PostgreSQL PGVector
- **LLM:** Multi-provider (Groq, Claude, Gemini)
- **Embedding:** Multilingue AR/FR/EN
- **Infra:** VPS Hetzner + Docker + Nginx

### 4. Démo Live
- Montrer interface RAG UI
- Poser 2-3 questions Business DZ
- Montrer sources/citations
- Montrer vitesse (<2s)
- Switcher entre les 3 RAG

### 5. Roadmap
- **Q1 2025:** Lancement Business DZ (FAIT ✅)
- **Q2 2025:** Intégration OneSchool SaaS
- **Q3 2025:** RAG Islam Production
- **Q4 2025:** Mobile apps iOS/Android

---

## ⚠️ PLAN B (si problème)

### Si VPS down:
1. Démo sur localhost + ngrok
2. Slides + vidéo pré-enregistrée
3. Focus architecture papier

### Si RAG vide:
1. Mode fallback GLOBAL
2. Démo avec réponses préparées
3. Montrer code/architecture

### Si LLM API timeout:
1. Switch provider (Groq → Claude → Gemini)
2. Augmenter timeout à 60s
3. Mode search only (pas de génération)

---

## 📞 CONTACTS URGENCE

**VPS Hetzner:**
- IP: `46.224.3.125`
- Port SSH: `22`
- Région: Nuremberg, DE

**Logs en cas d'erreur:**
```bash
# Logs backend
docker logs -f iaf-dz-backend

# Logs nginx
tail -f /var/log/nginx/error.log

# Logs tous services
docker-compose logs -f
```

**Redémarrage urgence:**
```bash
docker-compose restart
# Ou full reset:
docker-compose down && docker-compose up -d
```

---

## ✅ CHECKLIST FINALE AVANT DÉMO

- [ ] Containers Docker tous UP (8 containers)
- [ ] Backend `/health` retourne OK
- [ ] Qdrant a >100 docs dans rag_dz
- [ ] Landing page accessible HTTPS
- [ ] Au moins 1 clé LLM configurée
- [ ] Test RAG DZ fonctionne
- [ ] Test RAG École fonctionne
- [ ] Test RAG Islam fonctionne
- [ ] Nginx pas d'erreurs logs
- [ ] SSL certificat valide
- [ ] 5 questions testées et validées
- [ ] Slides PowerPoint prêts
- [ ] Laptop chargé + backup batterie
- [ ] Vidéo démo backup si WiFi fail

---

## 🚀 PRÊT POUR ALGER!

**Temps total estimé: 90 minutes**

**🎯 À commencer MAINTENANT!**

**Bonne chance pour la présentation! 🇩🇿💪**
