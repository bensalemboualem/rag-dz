# 💳 Module 8: iaFactoryDZ Billing & Credits

## Système de Crédits et Abonnements pour iaFactory Algeria

### 📋 Description
Module de monétisation complet pour la plateforme RAG-DZ avec système de crédits consommés par appel API et plans d'abonnement.

### 🌐 URLs Production
- **API Billing**: https://www.iafactoryalgeria.com/api/billing/
- **API Admin**: https://www.iafactoryalgeria.com/api/admin/billing/
- **API Credits**: https://www.iafactoryalgeria.com/api/credits/
- **Panel Utilisateur**: https://www.iafactoryalgeria.com/billing/
- **Panel Admin**: https://www.iafactoryalgeria.com/billing/admin.html

### 📦 Plans Disponibles

| Plan | Crédits/mois | Limite/jour | Prix (DZD) | Features |
|------|-------------|-------------|------------|----------|
| Free | 100 | 20 | 0 | RAG basic |
| Starter | 500 | 100 | 2,000 | + Légal |
| Pro | 2,000 | 500 | 5,000 | + Fiscal, Voice, API |
| Business | 10,000 | 2,000 | 15,000 | + Custom models |
| Enterprise | 100,000 | ∞ | 50,000 | + SLA 99.9%, 24/7 |

### ⚡ Coûts en Crédits par Service

| Service | Crédits | Description |
|---------|---------|-------------|
| RAG | 1 | Requête de recherche standard |
| Légal | 3 | Consultation assistant légal |
| Fiscal | 3 | Requête assistant fiscal |
| Voice | 2 | Transcription/TTS |
| Park | 2 | Recherche véhicules DZ |
| API | 1 | Appel API générique |

### 🔌 API Endpoints

#### User Endpoints
```
GET  /api/billing/me           - Info utilisateur + crédits
GET  /api/billing/usage        - Historique d'utilisation
GET  /api/billing/plans        - Liste des plans
GET  /api/billing/credit-costs - Coûts par service
```

#### Admin Endpoints
```
GET  /api/admin/billing/users  - Liste tous les utilisateurs
POST /api/admin/billing/grant  - Accorder des crédits bonus
GET  /api/admin/billing/stats  - Statistiques globales
```

#### Credits Integration (pour autres services)
```
POST /api/credits/check        - Vérifier crédits disponibles
POST /api/credits/consume      - Consommer des crédits
POST /api/credits/reset-monthly- Reset mensuel (cron)
```

### 🔧 Intégration avec Services RAG-DZ

Les services doivent appeler le billing avant chaque opération:

```python
# 1. Vérifier les crédits
check_resp = requests.post(
    "http://iaf-billing-prod:8207/api/credits/check",
    json={"user_id": user_id, "module": "rag"}
)

if check_resp.json()["can_proceed"]:
    # 2. Exécuter l'opération
    result = perform_rag_query(query)
    
    # 3. Consommer les crédits
    requests.post(
        "http://iaf-billing-prod:8207/api/credits/consume",
        json={
            "user_id": user_id,
            "module": "rag",
            "action": "query",
            "request_id": request_id
        }
    )
```

### 🐳 Déploiement Docker

```bash
# Backend
docker run -d \
  --name iaf-billing-prod \
  --network iaf-prod-network \
  -p 8207:8207 \
  --restart unless-stopped \
  iaf-billing:latest

# Frontend
docker run -d \
  --name iaf-billing-ui-prod \
  --network iaf-prod-network \
  -p 8208:80 \
  -v /opt/iafactory/apps/billing-panel:/usr/share/nginx/html:ro \
  --restart unless-stopped \
  nginx:alpine
```

### 📊 Features Frontend

#### Panel Utilisateur (`/billing/`)
- Vue d'ensemble des crédits restants
- Barre de progression avec alertes
- Statistiques par service
- Historique d'utilisation
- Graphique de consommation 30 jours
- Comparaison des plans

#### Panel Admin (`/billing/admin.html`)
- Stats globales (users, revenue, consumption)
- Graphiques revenue + consommation
- Répartition des plans (donut chart)
- Table des utilisateurs avec filtres
- Actions: Grant crédits, Block/Unblock
- Export CSV

### 📁 Structure des Fichiers

```
billing-credits/
├── backend/
│   ├── main.py              # FastAPI endpoints
│   ├── models.py            # Pydantic models
│   ├── credits_service.py   # Business logic
│   ├── requirements.txt
│   └── Dockerfile
└── README.md

apps/billing-panel/
├── index.html               # User billing panel
└── admin.html               # Admin panel
```

### 🔒 Sécurité

- Auth via header `X-User-ID` (à intégrer avec Hub auth)
- Admin endpoints protégés par `X-Admin-Key`
- Blocage automatique des comptes épuisés
- Audit trail complet des transactions

### 📈 Roadmap

- [ ] Intégration paiement CIB/EDAHABIA
- [ ] Webhooks pour events billing
- [ ] Facturation automatique PDF
- [ ] Dashboard analytics avancés
- [ ] API rate limiting par plan

---

**Ports**: Backend 8207, Frontend 8208
**Network**: iaf-prod-network
**Containers**: iaf-billing-prod, iaf-billing-ui-prod
