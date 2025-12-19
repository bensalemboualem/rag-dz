# 🔄 REBUILD BACKEND EN COURS

**Heure**: 20:30
**Status**: Rebuild image + démarrage container

---

## PROBLÈME RÉSOLU

**Erreur:** Container crashait au démarrage
```
FileNotFoundError: BMAD CLI not found at /bmad/tools/cli/bmad-cli.js
```

**Cause:** Le fix BMAD n'était pas inclus dans l'image Docker

**Solution:**
1. ✅ Suppression container crashé
2. ✅ Fix appliqué au source: `logger.warning` au lieu de `raise FileNotFoundError`
3. 🔄 Rebuild image en cours (cache layers, rapide ~1-2 min)
4. ⏳ Démarrage container automatique après build

---

## FIX APPLIQUÉ

**Fichier:** `/opt/iafactory-rag-dz/backend/rag-compat/app/services/bmad_orchestrator.py`

**Ligne 28-29:**
```python
# AVANT (crashait):
if not self.bmad_cli.exists():
    raise FileNotFoundError(f"BMAD CLI not found at {self.bmad_cli}")

# APRÈS (warning seulement):
if not self.bmad_cli.exists():
    logger.warning(f"BMAD CLI not found at {self.bmad_cli}")
```

**Vérification:**
```bash
ssh root@46.224.3.125 "cat /opt/iafactory-rag-dz/backend/rag-compat/app/services/bmad_orchestrator.py | sed -n '28,30p'"
```

---

## BUILD EN COURS

**Task ID:** 059afd

**Commande:**
```bash
cd /opt/iafactory-rag-dz
docker build -t iafactory_iafactory-backend:latest \
  -f backend/rag-compat/Dockerfile \
  backend/rag-compat

# Puis auto-start:
docker run -d --name iaf-dz-backend \
  --network iafactory-rag-dz_iafactory-net \
  -p 8180:8180 \
  --env-file .env \
  --restart unless-stopped \
  iafactory_iafactory-backend:latest
```

**Durée estimée:** 1-2 minutes (utilise cache pour layers 1-6, recopie seulement app/)

---

## CE QUI VA SE PASSER

1. **Build termine** → Nouvelle image créée avec fix BMAD
2. **Container démarre** → Backend lance avec warning BMAD (mais pas crash!)
3. **Uvicorn up** → API disponible sur port 8180
4. **Test providers** → Vérifier que les 6 providers actifs fonctionnent

---

## TESTS APRÈS DÉMARRAGE

### Test 1: Health
```bash
curl http://localhost:8180/api/coordination/health
# → {"status": "ok"}
```

### Test 2: LLM Providers Liste
```bash
curl http://localhost:8180/api/coordination/llm/providers | python3 -m json.tool
# Devrait lister 15 providers (6 actifs, 9 inactifs sans API keys)
```

### Test 3: Génération avec Groq (ultra-rapide)
```bash
curl -X POST http://localhost:8180/api/coordination/llm/generate \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Test"}],
    "use_case": "conversation",
    "budget_tier": "standard"
  }' | python3 -m json.tool
```

**Attendu:**
```json
{
  "success": true,
  "content": "...",
  "provider": "groq",
  "model": "llama-3.1-70b-versatile",
  "latency_ms": 100-300
}
```

### Test 4: Code avec DeepSeek
```bash
curl -X POST http://localhost:8180/api/coordination/llm/generate \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Écris une fonction Python tri rapide"}],
    "use_case": "code_generation",
    "budget_tier": "economy"
  }'
```

**Attendu:** provider = "deepseek"

---

## PROVIDERS ACTIFS (6/15)

✅ **Claude** (ANTHROPIC_API_KEY)
✅ **OpenAI** (OPENAI_API_KEY)
✅ **Groq** (GROQ_API_KEY) - **ULTRA-RAPIDE 100-300ms**
✅ **DeepSeek** (DEEPSEEK_API_KEY) - **CODE SPECIALIST**
✅ **Mistral** (MISTRAL_API_KEY)
✅ **Gemini** (GOOGLE_API_KEY)

---

## PROVIDERS INACTIFS (9/15)

❌ Qwen (pas d'API key)
❌ Kimi (pas d'API key)
❌ GLM (pas d'API key)
❌ Grok (pas d'API key)
❌ Perplexity (pas d'API key)
❌ OpenRouter (pas d'API key)
❌ HuggingFace (pas d'API key)
❌ GitHub (pas d'API key)
❌ Copilot (pas d'API key)

**NOTE:** User a dit "GROQ API TU PEUX UTILISER POUR QWEN ET KIMI ET GML"
→ À tester si Groq peut substituer ces 3 providers!

---

## PROCHAINE ÉTAPE

**Attendre:** Task 059afd termine (~1 min)

**Puis:**
1. Vérifier container UP
2. Vérifier logs propres (warning BMAD OK, pas d'erreur)
3. Tester endpoint /llm/providers
4. Tester génération avec Groq
5. Tester génération avec DeepSeek
6. **INVESTIGUER Groq substitution** pour Qwen/Kimi/GLM

---

**Créé:** 6 décembre 2025 - 20:32
**Status:** 🔄 Build en cours | ⏳ ETA 1-2 min
