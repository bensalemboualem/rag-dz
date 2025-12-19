# 🚀 Dzir IA Video - Installation Rapide

Guide d'installation en **10 minutes** pour démarrer avec Dzir IA Video.

---

## ⚡ Installation Express (10 min)

### Prérequis

```bash
✅ Python 3.9+
✅ NVIDIA GPU (GTX 1660+ recommandé, 6 GB+ VRAM)
✅ CUDA 12.1+
✅ 32 GB RAM minimum
✅ 50 GB espace disque (pour modèles IA)
```

---

## 📦 Installation en 5 Commandes

### 1. Clone & Navigate

```bash
cd d:/IAFactory/rag-dz/backend/rag-compat
```

### 2. Install Dependencies

```bash
# Core dependencies
pip install -r requirements.txt

# AI dependencies
pip install -r requirements-dzirvideo.txt

# Verify installation
python -c "import torch, diffusers, TTS, moviepy; print('✅ All dependencies installed')"
```

### 3. Download AI Models (Premier lancement - ~10 GB)

```bash
python << 'EOF'
import torch
from diffusers import StableVideoDiffusionPipeline
from TTS.api import TTS

print("📥 Downloading Stable Video Diffusion...")
svd = StableVideoDiffusionPipeline.from_pretrained(
    "stabilityai/stable-video-diffusion-img2vid-xt",
    torch_dtype=torch.float16
)
print("✅ SVD downloaded")

print("📥 Downloading Arabic TTS...")
tts_ar = TTS("tts_models/ar/css10/vits")
print("✅ Arabic TTS downloaded")

print("📥 Downloading French TTS...")
tts_fr = TTS("tts_models/fr/css10/vits")
print("✅ French TTS downloaded")

print("")
print("🎉 All models downloaded successfully!")
EOF
```

### 4. Test Installation

```bash
# Run test suite
python test_dzirvideo.py
```

**Expected output**:
```
✅ Text-to-Video: PASSED
✅ Text-to-Speech: PASSED
✅ Video Composition: PASSED
✅ Full Pipeline: PASSED

🎉 ALL TESTS PASSED 🎉
```

### 5. Start Backend

```bash
# Start FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8180 --reload
```

**Test API**:
```bash
curl http://localhost:8180/api/dzirvideo/
```

---

## 🎬 Premier Vidéo (Quick Test)

### Via API

```bash
curl -X POST http://localhost:8180/api/dzirvideo/generate \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Restaurant Alger",
    "script": "Bienvenue au restaurant El Bahia. Découvrez notre cuisine traditionnelle algérienne.",
    "template": "restaurant",
    "language": "fr",
    "format": "16:9",
    "duration": 30
  }'
```

**Response**:
```json
{
  "success": true,
  "job_id": "abc123...",
  "status": "pending"
}
```

### Check Status

```bash
curl http://localhost:8180/api/dzirvideo/status/abc123
```

### Via Frontend

```bash
# Open browser
start http://localhost:8180/apps/dzirvideo-ai/
```

1. Choisir template "Restaurant"
2. Écrire script
3. Cliquer "Générer la Vidéo"
4. Attendre 2-5 minutes
5. Télécharger vidéo ✅

---

## 🐛 Troubleshooting

### Erreur: CUDA not available

```bash
# Install PyTorch with CUDA
pip uninstall torch torchvision torchaudio
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Verify
python -c "import torch; print(f'CUDA: {torch.cuda.is_available()}')"
```

### Erreur: Out of memory (OOM)

```python
# Dans .env, activer CPU offload
DZIRVIDEO_CPU_OFFLOAD=true
DZIRVIDEO_LOW_MEMORY=true
```

### Erreur: Models not found

```bash
# Clear cache and re-download
rm -rf ~/.cache/huggingface
python download_models.py  # Re-run step 3
```

### Génération trop lente

**Solutions**:

1. **Use Zeroscope** (3x plus rapide)
```python
DZIRVIDEO_ENGINE=zeroscope  # au lieu de svd
```

2. **Reduce quality**
```python
DZIRVIDEO_FPS=8  # au lieu de 30
DZIRVIDEO_RESOLUTION=576p  # au lieu de 1080p
```

3. **Enable mixed precision**
```python
DZIRVIDEO_MIXED_PRECISION=true
```

---

## 🔧 Configuration Optimale

### `.env` Recommandé

```bash
# Dzir IA Video - Production Config
DZIRVIDEO_ENGINE=svd              # svd (qualité) ou zeroscope (vitesse)
DZIRVIDEO_DEVICE=cuda             # cuda ou cpu
DZIRVIDEO_FPS=30                  # 8, 24, 30, 60
DZIRVIDEO_RESOLUTION=1080p        # 576p, 720p, 1080p, 4k

# Performance
DZIRVIDEO_CPU_OFFLOAD=false       # true si VRAM limitée
DZIRVIDEO_LOW_MEMORY=false        # true si RAM < 32 GB
DZIRVIDEO_MIXED_PRECISION=true    # Accélération FP16
DZIRVIDEO_COMPILE=false           # PyTorch 2.0 compilation (expérimental)

# Cache
TTS_CACHE_DIR=/data/tts_cache
HF_HOME=/data/huggingface
TORCH_HOME=/data/torch

# Storage
S3_BUCKET=dzirvideo
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin

# Queue (Production)
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/1
```

---

## 📊 Benchmarks

### Hardware Tested

| GPU | VRAM | Temps (30s video) | Qualité |
|-----|------|-------------------|---------|
| GTX 1660 | 6 GB | ~10 min | Medium |
| RTX 3060 | 12 GB | ~5 min | High |
| RTX 4090 | 24 GB | ~2 min | Ultra |

### Optimisations

**Vitesse +50%**:
```bash
DZIRVIDEO_ENGINE=zeroscope
DZIRVIDEO_FPS=8
DZIRVIDEO_COMPILE=true
```

**Qualité maximale**:
```bash
DZIRVIDEO_ENGINE=svd
DZIRVIDEO_FPS=30
DZIRVIDEO_RESOLUTION=1080p
DZIRVIDEO_NUM_INFERENCE_STEPS=30
```

**Low VRAM (<8 GB)**:
```bash
DZIRVIDEO_CPU_OFFLOAD=true
DZIRVIDEO_LOW_MEMORY=true
DZIRVIDEO_FPS=8
```

---

## 🎯 Prochaines Étapes

1. **Production Deployment**
   ```bash
   docker-compose up -d
   ```

2. **Setup Queue**
   ```bash
   celery -A app.tasks worker --loglevel=info
   ```

3. **Configure Storage**
   ```bash
   # MinIO setup
   docker run -d -p 9000:9000 minio/minio server /data
   ```

4. **Add Monitoring**
   ```bash
   # Prometheus + Grafana
   docker-compose -f docker-compose.monitoring.yml up -d
   ```

---

## 📚 Documentation Complète

- **Architecture**: [DZIRVIDEO_AI_ARCHITECTURE.md](DZIRVIDEO_AI_ARCHITECTURE.md)
- **API Docs**: http://localhost:8180/docs
- **Frontend**: http://localhost:8180/apps/dzirvideo-ai/

---

## 💡 Exemples Rapides

### Python SDK

```python
from app.services.engines import get_video_engine, get_tts_engine, get_compositor

# Generate video
video_engine = get_video_engine(engine_type="svd")
video = video_engine.generate_video(
    prompt="Algerian restaurant, traditional ambiance",
    duration_seconds=3.0,
    fps=30
)

# Generate voice
tts = get_tts_engine()
audio = tts.synthesize(
    text="مرحبا بكم في مطعم الجزائر",
    language="ar"
)

# Compose
compositor = get_compositor()
final = compositor.compose_video(
    scene_videos=[video],
    voiceover_audio=audio,
    aspect_ratio="16:9"
)

print(f"✅ Video: {final}")
```

### cURL API

```bash
# Generate
JOB_ID=$(curl -s -X POST http://localhost:8180/api/dzirvideo/generate \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","script":"Hello Algeria","language":"fr"}' \
  | jq -r '.job_id')

# Poll status
while true; do
  STATUS=$(curl -s http://localhost:8180/api/dzirvideo/status/$JOB_ID | jq -r '.status')
  echo "Status: $STATUS"
  [[ "$STATUS" == "completed" ]] && break
  sleep 2
done

# Get video URL
VIDEO_URL=$(curl -s http://localhost:8180/api/dzirvideo/status/$JOB_ID | jq -r '.video_url')
echo "Video: $VIDEO_URL"
```

---

## 🆘 Support

- **Discord**: https://discord.gg/iafactory-dz
- **Email**: support@iafactoryalgeria.com
- **Issues**: https://github.com/iafactory/dzirvideo/issues

---

**Made with 🇩🇿 in Algeria**

© 2025 IAFactory Algeria
