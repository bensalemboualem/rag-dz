# IA Factory Video Studio

Application de génération vidéo IA pour le marché algérien/MENA avec support Darija.

## 🚀 Démarrage rapide

### Prérequis
- Docker & Docker Compose
- Node.js 20+ (pour le dev local)
- Python 3.11+ (pour le dev local)

### Installation

```bash
# Cloner le projet
cd apps/video-studio

# Copier le fichier d'environnement
cp .env.example .env
# Éditer .env avec vos clés API

# Lancer avec Docker
docker-compose up -d

# L'application sera disponible sur:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8000
# - API Docs: http://localhost:8000/docs
```

### Développement local

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend (dans un autre terminal)
cd backend
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate sur Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 📁 Structure

```
video-studio/
├── frontend/          # Next.js 14 + TypeScript + Tailwind
│   ├── app/           # App Router pages
│   ├── components/    # React components
│   └── lib/           # Utilities & API client
├── backend/           # FastAPI + Python
│   ├── app/
│   │   ├── api/routes/  # API endpoints
│   │   ├── core/        # Config & security
│   │   ├── schemas/     # Pydantic models
│   │   └── services/    # External API services
└── docker-compose.yml
```

## 🎯 Fonctionnalités

- **Text-to-Video**: Génération vidéo à partir de prompts texte (Kling 1.6)
- **Image-to-Video**: Animation d'images en vidéos
- **Voix Darija**: Synthèse vocale en dialecte algérien (ElevenLabs)
- **Templates**: Modèles prédéfinis pour différents cas d'usage
- **Système de crédits**: Gestion des consommations

## 🔑 APIs utilisées

- [Fal.ai](https://fal.ai) - Génération vidéo (Kling, Minimax, Luma)
- [ElevenLabs](https://elevenlabs.io) - Synthèse vocale multilingue
- [Replicate](https://replicate.com) - Modèles IA additionnels

## 📞 Contact

Projet IA Factory - Boualem
