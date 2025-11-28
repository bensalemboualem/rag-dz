# 🎬 Guide IAFactory Creative Studio - Génération Vidéo & Médias

**API Backend déjà configurée** - Studio Creatif avec IA

---

## 🎯 Fonctionnalités Disponibles

L'**IAFactory Creative Studio** (endpoint `/api/studio`) propose 3 types de créations :

1. **🎥 Génération Vidéo** - Wan 2.2 (PiAPI) ou MiniMax (Replicate)
2. **🖼️ Génération Image** - Flux Schnell (Replicate)
3. **📊 Génération Présentation** - Reveal.js via LLM

---

## 🔑 Configuration API Keys

### Clés Configurées (`.env.local`)

```env
# Vidéo - Wan 2.2 avec Audio (Meilleure qualité)
PIAPI_KEY=YOUR_PIAPI_KEY_HERE

# Vidéo/Image - Replicate (Fallback sans audio)
REPLICATE_API_TOKEN=r8_YOUR_REPLICATE_TOKEN_HERE

# Image - Hugging Face Flux (Gratuit)
HF_API_TOKEN=hf_YOUR_HUGGINGFACE_TOKEN_HERE
```

### Providers Disponibles

| Provider | Service | Coût | Status |
|----------|---------|------|--------|
| **PiAPI** | Wan 2.2 14B (avec audio) | Gratuit (free tier) | ✅ Configuré |
| **Replicate** | MiniMax Video-01 (sans audio) | Gratuit (free tier) | ✅ Configuré |
| **Replicate** | Flux Schnell (images) | Gratuit (free tier) | ✅ Configuré |
| **Hugging Face** | Wan 2.1 / Flux | Gratuit | ✅ Configuré |

---

## 🎬 1. GÉNÉRATION VIDÉO

### Workflow Intelligent (3 étapes)

```
User Prompt → Agent Scénariste (Qwen/Groq) → Wan 2.2/MiniMax → Vidéo 4K
```

1. **Agent Scénariste** : Optimise votre prompt pour la qualité cinématographique
2. **Debit Wallet** : Débit sécurisé (si clé fournie)
3. **Génération GPU** : Wan 2.2 (PiAPI) ou MiniMax (Replicate)

### Endpoint : POST /api/studio/generate-video

**Format Requête** :
```json
{
  "user_prompt": "Un coucher de soleil sur l'océan avec des vagues douces",
  "user_id": "user123",
  "key_code": "optional_wallet_key",
  "duration": 5,
  "aspect_ratio": "16:9",
  "style": "photorealistic"
}
```

**Paramètres** :
- `user_prompt` (string) : Description de la vidéo souhaitée
- `user_id` (string) : ID utilisateur
- `key_code` (optional) : Clé wallet pour débit
- `duration` (int) : Durée en secondes (5-10s)
- `aspect_ratio` (string) : `16:9`, `9:16`, `1:1`
- `style` (string) : `photorealistic`, `cinematic`, `anime`, `3d-render`

**Réponse** :
```json
{
  "status": "processing",
  "prediction_id": "abc123xyz",
  "provider": "piapi",
  "prompt": "Cinematic photorealistic ocean sunset with gentle waves, smooth camera pan, golden hour lighting, 4K quality...",
  "engine": "Wan 2.2 14B (PiAPI)",
  "message": "Vidéo Wan 2.2 lancée! Génération en cours (~2-3 min)..."
}
```

### Test avec cURL

**Fichier `test-video.json`** :
```json
{
  "user_prompt": "Un chat astronaute flottant dans l'espace",
  "user_id": "test_user",
  "duration": 5,
  "aspect_ratio": "16:9",
  "style": "photorealistic"
}
```

**Commande** :
```bash
curl -X POST http://localhost:8180/api/studio/generate-video \
  -H "Content-Type: application/json" \
  -d @test-video.json
```

---

## 📊 2. VÉRIFIER LE STATUT D'UNE VIDÉO

### Endpoint : GET /api/studio/video-status/{prediction_id}

**Paramètres Query** :
- `provider` : `piapi` ou `replicate`

**Exemple** :
```bash
curl "http://localhost:8180/api/studio/video-status/abc123xyz?provider=piapi"
```

**Réponse - En cours** :
```json
{
  "prediction_id": "abc123xyz",
  "status": "processing",
  "provider": "piapi",
  "engine": "Wan 2.2 14B (PiAPI)",
  "message": "Génération en cours..."
}
```

**Réponse - Terminé** :
```json
{
  "prediction_id": "abc123xyz",
  "status": "succeeded",
  "provider": "piapi",
  "engine": "Wan 2.2 14B (PiAPI)",
  "video_url": "https://cdn.piapi.ai/video/abc123xyz.mp4",
  "message": "Vidéo générée avec succès!"
}
```

---

## 🖼️ 3. GÉNÉRATION IMAGE

### Endpoint : POST /api/studio/generate-image

**Format Requête** :
```json
{
  "user_prompt": "Un paysage futuriste avec des gratte-ciels volants",
  "user_id": "user123",
  "aspect_ratio": "16:9",
  "style": "cinematic"
}
```

**Paramètres** :
- `user_prompt` : Description de l'image
- `user_id` : ID utilisateur
- `key_code` (optional) : Clé wallet
- `aspect_ratio` : `1:1`, `16:9`, `9:16`, `4:3`
- `style` : `photorealistic`, `artistic`, `anime`, `3d`

**Réponse** :
```json
{
  "status": "processing",
  "prediction_id": "img456def",
  "poll_url": "https://api.replicate.com/v1/predictions/img456def",
  "prompt": "cinematic, Un paysage futuriste avec des gratte-ciels volants, high quality, detailed",
  "estimated_cost": 0.0
}
```

**Test** :
```bash
# Fichier test-image.json
{
  "user_prompt": "Portrait d'une femme en style Van Gogh",
  "user_id": "test_user",
  "aspect_ratio": "1:1",
  "style": "artistic"
}

# Commande
curl -X POST http://localhost:8180/api/studio/generate-image \
  -H "Content-Type: application/json" \
  -d @test-image.json
```

---

## 📊 4. GÉNÉRATION PRÉSENTATION (Reveal.js)

### Endpoint : POST /api/studio/generate-presentation

**Format Requête** :
```json
{
  "user_prompt": "Intelligence Artificielle dans l'éducation",
  "user_id": "user123",
  "num_slides": 5,
  "theme": "dark"
}
```

**Paramètres** :
- `user_prompt` : Sujet de la présentation
- `user_id` : ID utilisateur
- `key_code` (optional) : Clé wallet
- `num_slides` : Nombre de slides (défaut: 5)
- `theme` : `dark`, `light`, `solarized`

**Réponse** :
```json
{
  "status": "success",
  "num_slides": 5,
  "theme": "dark",
  "markdown_content": "## Intelligence Artificielle dans l'éducation\n\n---\n\n## Slide 2...",
  "slides": [
    {
      "index": 0,
      "content": "## Intelligence Artificielle dans l'éducation\n\n- Introduction\n- Contexte\n- Objectifs"
    },
    ...
  ],
  "cost_usd": 0.001,
  "message": "Présentation générée avec succès"
}
```

**Test** :
```bash
# Fichier test-presentation.json
{
  "user_prompt": "Les agents BMAD et leur utilisation",
  "user_id": "test_user",
  "num_slides": 7,
  "theme": "dark"
}

# Commande
curl -X POST http://localhost:8180/api/studio/generate-presentation \
  -H "Content-Type: application/json" \
  -d @test-presentation.json
```

---

## 💰 5. GRILLE TARIFAIRE

### Endpoint : GET /api/studio/pricing

```bash
curl http://localhost:8180/api/studio/pricing
```

**Réponse** :
```json
{
  "video": {
    "cost_usd": 0.0,
    "description": "Vidéo 3-5s Wan 2.1",
    "provider": "Hugging Face (Wan 2.1 - GRATUIT)",
    "available": true
  },
  "image": {
    "cost_usd": 0.0,
    "description": "Image haute qualité",
    "provider": "Hugging Face (Flux - GRATUIT)",
    "available": true
  },
  "presentation": {
    "cost_usd": 0.001,
    "description": "Présentation Reveal.js",
    "provider": "LLM (Qwen/Groq)",
    "available": true
  },
  "currency": "USD",
  "hf_configured": true
}
```

---

## 🎨 Styles Disponibles

### Vidéo & Image

| Style | Description | Exemple Prompt |
|-------|-------------|----------------|
| `photorealistic` | Photo réaliste 4K | "Realistic ocean sunset, professional photography" |
| `cinematic` | Style film, cinématographique | "Cinematic city street, dramatic lighting, wide shot" |
| `anime` | Style anime/manga japonais | "Anime character in Tokyo, vibrant colors, Studio Ghibli style" |
| `3d-render` | Rendu 3D Pixar-like | "3D render of a robot, Pixar style, soft lighting" |
| `artistic` | Peinture artistique | "Oil painting of mountains, impressionist style" |

---

## 🔄 Workflow Complet d'Utilisation

### Exemple : Créer une vidéo et vérifier le statut

**Étape 1 : Lancer la génération**
```bash
curl -X POST http://localhost:8180/api/studio/generate-video \
  -H "Content-Type: application/json" \
  -d '{
    "user_prompt": "Un drone survolant une forêt tropicale",
    "user_id": "demo_user",
    "duration": 5,
    "aspect_ratio": "16:9",
    "style": "cinematic"
  }'
```

**Réponse** :
```json
{
  "status": "processing",
  "prediction_id": "xyz789abc",
  "provider": "piapi",
  "message": "Vidéo Wan 2.2 lancée! Génération en cours (~2-3 min)..."
}
```

**Étape 2 : Vérifier le statut (attendre 2-3 minutes)**
```bash
curl "http://localhost:8180/api/studio/video-status/xyz789abc?provider=piapi"
```

**Étape 3 : Récupérer la vidéo**
Une fois `"status": "succeeded"`, télécharger depuis `video_url` :
```bash
# Exemple d'URL retournée
https://cdn.piapi.ai/video/xyz789abc.mp4
```

---

## 🎯 Agent Scénariste (Intelligence Intégrée)

### Comment ça marche ?

L'**Agent Scénariste** transforme votre prompt simple en prompt cinématographique professionnel :

**Votre prompt** :
```
"Un chat"
```

**Prompt optimisé par l'agent** :
```
Cinematic photorealistic close-up of a fluffy cat, golden hour soft lighting,
shallow depth of field, smooth camera movement, professional cinematography,
warm color grading, 4K quality, award-winning nature documentary style
```

### LLM Utilisés (Cascade)

1. **Ollama (Qwen 7B)** - Local, gratuit, rapide
2. **Groq (Llama 3.3 70B)** - Fallback cloud, gratuit
3. **Prompt direct** - Si LLMs indisponibles

---

## 🚀 Intégration dans une Interface

### Exemple React Component (pseudo-code)

```jsx
import { useState } from 'react';

function VideoGenerator() {
  const [status, setStatus] = useState('idle');
  const [predictionId, setPredictionId] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const generateVideo = async (prompt) => {
    setStatus('generating');

    // Étape 1 : Lancer génération
    const response = await fetch('http://localhost:8180/api/studio/generate-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_prompt: prompt,
        user_id: 'current_user',
        duration: 5,
        aspect_ratio: '16:9',
        style: 'cinematic'
      })
    });

    const data = await response.json();
    setPredictionId(data.prediction_id);

    // Étape 2 : Polling du statut
    const pollInterval = setInterval(async () => {
      const statusResponse = await fetch(
        `http://localhost:8180/api/studio/video-status/${data.prediction_id}?provider=piapi`
      );
      const statusData = await statusResponse.json();

      if (statusData.status === 'succeeded') {
        setVideoUrl(statusData.video_url);
        setStatus('completed');
        clearInterval(pollInterval);
      } else if (statusData.status === 'failed') {
        setStatus('error');
        clearInterval(pollInterval);
      }
    }, 10000); // Check toutes les 10 secondes
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Décrivez votre vidéo..."
        onKeyPress={(e) => e.key === 'Enter' && generateVideo(e.target.value)}
      />

      {status === 'generating' && <p>⏳ Génération en cours... (~2-3 min)</p>}
      {status === 'completed' && (
        <video src={videoUrl} controls autoPlay />
      )}
    </div>
  );
}
```

---

## 📱 Publication Automatique (À Implémenter)

### Endpoints Suggérés (TODO)

```python
# À ajouter dans studio_video.py

@router.post("/publish-to-youtube")
async def publish_to_youtube(video_url: str, title: str, description: str):
    """Publie automatiquement une vidéo sur YouTube"""
    # Utiliser Google YouTube Data API v3
    pass

@router.post("/publish-to-tiktok")
async def publish_to_tiktok(video_url: str, caption: str):
    """Publie automatiquement sur TikTok"""
    # Utiliser TikTok API
    pass

@router.post("/publish-to-instagram")
async def publish_to_instagram(video_url: str, caption: str):
    """Publie automatiquement sur Instagram Reels"""
    # Utiliser Instagram Graph API
    pass
```

### Workflow Futur

```
Génération → Optimisation → Publication Auto → Analytics
```

---

## 🔐 Sécurité & Debit Wallet

### Key Reselling (Système de Clés)

Si vous fournissez un `key_code`, le système :
1. Vérifie le solde disponible
2. Débite le coût (actuellement $0.00 en free tier)
3. Enregistre l'usage dans `usage_events`

**Exemple avec clé** :
```json
{
  "user_prompt": "Vidéo de demo",
  "user_id": "customer123",
  "key_code": "KEY-ABC-123-XYZ",
  "duration": 5,
  "aspect_ratio": "16:9",
  "style": "cinematic"
}
```

**Si solde insuffisant** :
```json
{
  "status": 402,
  "detail": "Solde insuffisant: Votre clé n'a plus de crédit"
}
```

---

## 🎬 Exemples de Prompts Optimaux

### Vidéos

```json
// Paysage
{
  "user_prompt": "Vol en drone au-dessus d'un lac de montagne au lever du soleil",
  "style": "cinematic"
}

// Action
{
  "user_prompt": "Course-poursuite de voitures dans les rues de Tokyo la nuit",
  "style": "cinematic"
}

// Fantaisie
{
  "user_prompt": "Dragon majestueux volant dans un ciel orageux avec éclairs",
  "style": "3d-render"
}

// Portrait
{
  "user_prompt": "Gros plan d'un visage humain avec des émotions changeantes",
  "style": "photorealistic"
}
```

### Images

```json
// Art
{
  "user_prompt": "Jardin japonais avec cerisiers en fleurs et temple",
  "style": "artistic"
}

// Produit
{
  "user_prompt": "Montre de luxe sur fond noir avec éclairage dramatique",
  "style": "photorealistic"
}

// Conceptuel
{
  "user_prompt": "Intelligence artificielle représentée par un cerveau numérique",
  "style": "3d-render"
}
```

---

## 🛠️ Dépannage

### Problème : "REPLICATE_API_TOKEN non configuré"

**Solution** : Vérifier `.env.local` :
```env
REPLICATE_API_TOKEN=r8_YOUR_REPLICATE_TOKEN_HERE
```

Redémarrer le backend :
```bash
docker restart iaf-dz-backend
```

### Problème : "Timeout - génération trop longue"

**Cause** : Wan 2.2 peut prendre 2-5 minutes

**Solution** : Utiliser l'endpoint `/video-status/{prediction_id}` en polling

### Problème : Vidéo de mauvaise qualité

**Solution** : Améliorer le prompt avec :
- Termes techniques : "cinematic", "4K", "professional"
- Mouvement caméra : "smooth pan", "slow zoom", "tracking shot"
- Éclairage : "golden hour", "dramatic lighting", "soft shadows"
- Style : "award-winning", "documentary style", "film grain"

---

## 📊 Métriques & Monitoring

### Temps de Génération Moyens

| Type | Provider | Temps | Qualité |
|------|----------|-------|---------|
| Vidéo 5s | Wan 2.2 (PiAPI) | 2-3 min | ⭐⭐⭐⭐⭐ (avec audio) |
| Vidéo 5s | MiniMax (Replicate) | 2-4 min | ⭐⭐⭐⭐ (sans audio) |
| Image | Flux Schnell | 10-30s | ⭐⭐⭐⭐⭐ |
| Présentation | LLM | 5-15s | ⭐⭐⭐⭐ |

---

## ✅ Checklist de Test

- [ ] ✅ Test génération vidéo (POST /generate-video)
- [ ] ✅ Test statut vidéo (GET /video-status/{id})
- [ ] ✅ Test génération image (POST /generate-image)
- [ ] ✅ Test génération présentation (POST /generate-presentation)
- [ ] ✅ Test grille tarifaire (GET /pricing)
- [ ] ⚠️ Test publication YouTube (à implémenter)
- [ ] ⚠️ Test publication TikTok (à implémenter)
- [ ] ⚠️ Test publication Instagram (à implémenter)

---

## 🎯 Résumé

**IAFactory Creative Studio** est **déjà opérationnel** avec :

- ✅ Backend API configuré (`/api/studio/*`)
- ✅ 3 API keys configurées (PiAPI, Replicate, HF)
- ✅ Agent Scénariste intelligent (Qwen/Groq)
- ✅ 3 types de création (Vidéo, Image, Présentation)
- ✅ Système de Debit Wallet intégré
- ✅ Free tier pour tester (coûts $0.00)

**Prochaines étapes** :
1. Créer interface web React/Vue pour Studio
2. Implémenter publication auto (YouTube, TikTok, Instagram)
3. Ajouter analytics et tracking
4. Créer galerie de créations

**Tout est prêt côté Backend ! 🎉**

---

**Documentation générée** : 2025-11-24
**API Version** : 1.0.0
**Status** : ✅ Opérationnel
