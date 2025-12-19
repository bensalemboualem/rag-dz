# Dzir IA Video 🎬🇩🇿

**Plateforme de génération vidéo par IA - 100% Made in Algeria**

Créez des vidéos professionnelles en quelques minutes avec l'intelligence artificielle. Templates algériens, voix en arabe/français/darija, et tarifs adaptés au marché algérien.

---

## 🌟 Fonctionnalités

### ✅ MVP Actuel (v1.0)

- ✅ **Interface utilisateur moderne** - Design professionnel avec branding algérien
- ✅ **10 templates algériens** - Restaurant, Immobilier, E-commerce, etc.
- ✅ **Éditeur de script** - Interface intuitive pour décrire votre vidéo
- ✅ **Paramètres personnalisables**:
  - Langues: Arabe, Français, Darija
  - Formats: 16:9 (YouTube), 9:16 (TikTok), 1:1 (Instagram)
  - Durées: 15s, 30s, 60s
  - Musique de fond: 4 types
- ✅ **API Backend** - REST API complète avec FastAPI
- ✅ **Système de tarification** - 4 plans adaptés au marché DZ

### 🚧 En Développement

- 🚧 **Génération vidéo IA** - Intégration Stable Diffusion Video
- 🚧 **Voix-off TTS** - Coqui TTS pour arabe/français/darija
- 🚧 **Montage automatique** - MoviePy pour composition vidéo
- 🚧 **Stockage vidéos** - S3/MinIO pour hébergement
- 🚧 **Système de paiement** - BaridiMob, CCP, Flexy

---

## 🚀 Installation & Déploiement

### Prérequis

```bash
Python 3.9+
Node.js 16+ (si build frontend nécessaire)
Docker & Docker Compose (pour production)
```

### Installation Locale

```bash
# 1. Cloner le projet
cd d:/IAFactory/rag-dz

# 2. Installer dépendances backend
cd backend/rag-compat
pip install -r requirements.txt

# 3. Configurer .env
cp .env.example .env
# Éditer .env avec vos clés API

# 4. Lancer le backend
python -m app.main

# 5. Accéder à l'app
# Frontend: http://localhost:8180/apps/dzirvideo-ai/
# API: http://localhost:8180/api/dzirvideo/
# Docs: http://localhost:8180/docs
```

### Déploiement VPS

```bash
# Le projet est intégré dans l'écosystème IAFactory RAG-DZ
# Il se déploie automatiquement avec:
cd d:/IAFactory/rag-dz
./quick-deploy.sh

# Accès après déploiement:
# https://www.iafactoryalgeria.com/apps/dzirvideo-ai/
# https://www.iafactoryalgeria.com/api/dzirvideo/
```

---

## 📚 Utilisation

### Via Interface Web

1. Ouvrir https://www.iafactoryalgeria.com/apps/dzirvideo-ai/
2. Choisir un template (Restaurant, Immobilier, etc.)
3. Écrire le titre et le script de votre vidéo
4. Configurer les paramètres (langue, format, durée)
5. Cliquer sur "Générer la Vidéo"
6. Télécharger votre vidéo (2-3 minutes)

### Via API

```python
import requests

# Générer une vidéo
response = requests.post(
    "https://www.iafactoryalgeria.com/api/dzirvideo/generate",
    json={
        "title": "Promo Restaurant Alger",
        "script": "Découvrez notre restaurant traditionnel algérien...",
        "template": "restaurant",
        "language": "ar",
        "format": "16:9",
        "duration": 30,
        "music": "traditional"
    }
)

job = response.json()
job_id = job["job_id"]

# Vérifier le statut
status = requests.get(f"https://www.iafactoryalgeria.com/api/dzirvideo/status/{job_id}")
print(status.json())
```

### Exemples de Scripts

**Restaurant**:
```
Découvrez le meilleur couscous d'Alger chez Restaurant El Djazair.
Ambiance authentique, cuisine traditionnelle, service impeccable.
Ouvert tous les jours de 12h à 23h.
Réservations: 023 XX XX XX
```

**Immobilier**:
```
Villa moderne à vendre à Hydra, Alger.
5 chambres, 3 salles de bain, jardin 200m².
Vue sur la mer, quartier calme et sécurisé.
Prix: 45 milliards. Contact: 0555 XX XX XX
```

**E-commerce**:
```
Nouvelle collection été 2024 !
Mode algérienne moderne, tissus de qualité.
Livraison gratuite dans toute l'Algérie.
Visitez notre boutique en ligne: www.example.dz
```

---

## 💰 Tarifs

| Plan | Prix | Vidéos/mois | Résolution | Filigrane |
|------|------|-------------|------------|-----------|
| **Gratuit** | 0 DA | 5 | 720p | ✅ Oui |
| **Créateur** | 2,500 DA | 50 | 1080p | ❌ Non |
| **Business** | 5,000 DA | 200 | 4K | ❌ Non |
| **Entreprise** | Sur mesure | Illimité | 8K | ❌ Non |

**Méthodes de paiement**: BaridiMob, CCP, Flexy, Stripe (international)

---

## 🎨 Templates Disponibles

### 1. Restaurant 🍽️
Parfait pour restaurants, cafés, pâtisseries
- Scènes: Extérieur, Intérieur, Plats, Clients

### 2. Immobilier 🏢
Pour agences immobilières et promoteurs
- Scènes: Extérieur, Salon, Cuisine, Chambre

### 3. E-commerce 🛒
Pour boutiques en ligne et produits
- Scènes: Produit, Caractéristiques, Avantages, CTA

### 4. Éducation 📚
Pour centres de formation et cours en ligne
- Scènes: Intro, Contenu, Démo, Appel à l'action

### 5. Santé ⚕️
Pour cliniques, pharmacies, cabinets médicaux
- Scènes: Établissement, Équipe, Services, Contact

### 6. Tourisme 🏖️
Pour agences de voyage et hôtels
- Scènes: Destination, Activités, Hébergement, Réservation

### 7. Automobile 🚗
Pour concessionnaires et garages
- Scènes: Extérieur, Intérieur, Caractéristiques, Contact

### 8. Beauté 💄
Pour salons de coiffure et cosmétiques
- Scènes: Salon, Services, Avant/Après, Réservation

### 9. BTP 🏗️
Pour entreprises de construction
- Scènes: Vue d'ensemble, Progression, Équipe, Résultats

### 10. Tech 💻
Pour startups et services IT
- Scènes: Problème, Solution, Fonctionnalités, Démo

---

## 🛠️ Architecture Technique

```
┌─────────────────────────────────────────┐
│         Frontend (HTML/JS/CSS)          │
│  apps/dzirvideo-ai/index.html           │
└─────────────────────────────────────────┘
                    ↓ API REST
┌─────────────────────────────────────────┐
│      Backend API (FastAPI)              │
│  backend/routers/dzirvideo.py           │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Service Layer (Python)               │
│  backend/services/dzirvideo_service.py  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         AI Engines (TODO)               │
│  • Stable Diffusion Video (text→video)  │
│  • Coqui TTS (text→speech AR/FR/DZ)    │
│  • MoviePy (montage vidéo)              │
│  • FFmpeg (conversion/compression)      │
└─────────────────────────────────────────┘
```

---

## 📁 Structure du Projet

```
rag-dz/
├── apps/
│   └── dzirvideo-ai/
│       ├── index.html          # Frontend interface
│       └── README.md           # Ce fichier
│
└── backend/
    └── rag-compat/
        └── app/
            ├── routers/
            │   └── dzirvideo.py        # API endpoints
            │
            └── services/
                └── dzirvideo_service.py # Génération vidéo
```

---

## 🔧 Configuration

### Variables d'Environnement

```bash
# .env
# Dzir IA Video Configuration

# AI Providers (pour génération vidéo)
STABILITY_API_KEY=sk-xxx       # Stable Diffusion Video
OPENAI_API_KEY=sk-xxx           # GPT-4 (script enhancement)

# TTS (Text-to-Speech)
COQUI_API_KEY=xxx               # Coqui TTS pour voix AR/FR

# Storage (vidéos générées)
S3_BUCKET=dzirvideo
S3_ACCESS_KEY=xxx
S3_SECRET_KEY=xxx
S3_ENDPOINT=https://s3.amazonaws.com

# Payment (Algérie)
BARIDIMOB_API_KEY=xxx
CCP_API_KEY=xxx
FLEXY_API_KEY=xxx
```

---

## 🚦 Roadmap

### Phase 1: MVP (Complété ✅)
- [x] Interface utilisateur
- [x] API backend
- [x] 10 templates algériens
- [x] Système de tarification

### Phase 2: Génération IA (En cours 🚧)
- [ ] Intégration Stable Diffusion Video
- [ ] TTS arabe/français/darija (Coqui)
- [ ] Montage automatique (MoviePy)
- [ ] Stockage S3/MinIO

### Phase 3: Monétisation (Planifié 📅)
- [ ] Paiement BaridiMob
- [ ] Paiement CCP
- [ ] Paiement Flexy
- [ ] Dashboard utilisateur
- [ ] Gestion abonnements

### Phase 4: Scale (Futur 🔮)
- [ ] Queue Celery/RabbitMQ
- [ ] CDN pour vidéos
- [ ] API publique
- [ ] Templates personnalisés
- [ ] Analyse vidéo (vues, engagement)

---

## 📞 Support

- **Email**: contact@iafactoryalgeria.com
- **Site**: https://www.iafactoryalgeria.com
- **GitHub**: (privé pour le moment)

---

## 📄 Licence

© 2025 IAFactory Algeria. Tous droits réservés.

---

## 🙏 Technologies Utilisées

- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Backend**: Python 3.9+, FastAPI
- **AI**: Stable Diffusion Video, Coqui TTS, MoviePy
- **Database**: PostgreSQL + PGVector (via backend IAFactory)
- **Deployment**: Docker, Nginx, Ubuntu VPS
- **Payment**: BaridiMob, CCP, Flexy (APIs algériennes)

---

**Made with 🇩🇿 in Algeria**
