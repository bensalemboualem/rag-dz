# 🎯 Council Personnalisable - Guide d'Upgrade

## ✅ Ce qui a été implémenté

Vous avez maintenant un système Council **complètement personnalisable** avec :

### 🏗️ Backend
1. **`models_config.py`** - Catalogue de tous les LLMs disponibles (10+ modèles)
   - OpenAI: GPT-4 Turbo, GPT-3.5 Turbo
   - Anthropic: Claude Opus 4, Claude Sonnet 4, Claude Sonnet 3.5
   - Google: Gemini 1.5 Pro, Gemini 1.5 Flash
   - Mistral: Mistral Large
   - Ollama (local): Llama3 70B/8B, Mixtral, CodeLlama

2. **`universal_provider.py`** - Factory universel pour tous les providers
   - Support multi-providers automatique
   - Gestion des erreurs robuste
   - Détection de disponibilité

3. **`flexible_orchestrator.py`** - Orchestrateur acceptant toute combinaison
   - 3 experts + 1 chairman personnalisables
   - Review croisée optionnelle
   - Estimation coûts/temps en temps réel

4. **`council_custom.py`** - API endpoints pour la personnalisation
   - `GET /api/council/models/all` - Liste tous les modèles
   - `GET /api/council/presets` - Configurations recommandées
   - `POST /api/council/estimate` - Estimation avant exécution
   - `POST /api/council/custom-query` - Exécution personnalisée

### 🎨 Frontend
- **`council-custom.html`** - Interface complète avec dropdowns
   - Sélection indépendante des 3 experts + chairman
   - 6 presets recommandés (Balanced, Premium, Economy, Fast, Multilingual, Code)
   - Estimation dynamique coût/temps
   - Warning si config trop coûteuse
   - Affichage forces de chaque modèle

## 🚀 Comment tester

### 1. Démarrer le backend
```bash
cd backend/rag-compat
docker-compose up backend
# ou
python -m uvicorn app.main:app --reload --port 8180
```

### 2. Démarrer le serveur Council
```bash
node council-server.js
```

### 3. Accéder aux interfaces

#### Version Standard (config fixe)
```
http://localhost:3000/
```

#### Version Custom (personnalisable) ⭐ NOUVEAU
```
http://localhost:3000/custom
```

## 🎯 Utilisation

### Preset "Équilibré" (recommandé pour démarrer)
- Expert 1: Claude Sonnet 3.5
- Expert 2: Gemini 1.5 Pro
- Expert 3: Llama 3 70B (local, gratuit)
- Chairman: Claude Sonnet 3.5
- **Coût**: ~400-500 DZD/requête
- **Temps**: 15-25s

### Preset "Premium" (maximum qualité)
- Expert 1: Claude Opus 4
- Expert 2: GPT-4 Turbo
- Expert 3: Gemini 1.5 Pro
- Chairman: Claude Opus 4
- **Coût**: ~2000 DZD/requête
- **Temps**: 20-30s

### Preset "Economy" (100% gratuit local)
- Expert 1: Llama 3 70B
- Expert 2: Mixtral 8x7B
- Expert 3: Llama 3 8B
- Chairman: Llama 3 70B
- **Coût**: 0 DZD (local)
- **Temps**: 15-20s (si Ollama configuré)

## 🔑 Configuration requise

### Variables d'environnement

```bash
# Dans .env.local ou .env

# OpenAI (GPT models)
OPENAI_API_KEY=sk-...

# Anthropic (Claude models)
ANTHROPIC_API_KEY=sk-ant-...

# Google (Gemini models)
GOOGLE_API_KEY=AIza...

# Mistral
MISTRAL_API_KEY=...

# Ollama (local - optionnel mais recommandé)
OLLAMA_BASE_URL=http://localhost:11434
```

### Installer Ollama (optionnel, pour modèles locaux gratuits)

```bash
# Windows / Mac / Linux
# Télécharger depuis: https://ollama.ai

# Puis installer les modèles
ollama pull llama3:70b
ollama pull llama3:8b
ollama pull mixtral:8x7b
ollama pull codellama:34b
```

## 💡 Exemples de configurations par cas d'usage

### Pour l'Algérie Télécom (équilibré coût/qualité)
- Claude Sonnet 3.5 (rapide, précis)
- Gemini Pro (économique, multimodal)
- Llama3 70B (gratuit, local, souverain)
- **→ ~500 DZD/requête**

### Pour client suisse premium
- Claude Opus 4 (meilleure qualité)
- GPT-4 Turbo (expertise technique)
- Gemini Pro (multimodal)
- **→ ~2000 DZD / 15 CHF**

### Pour développement logiciel
- GPT-4 Turbo (code expert)
- CodeLlama 34B (spécialisé code)
- Claude Opus 4 (architecture)
- **→ Focus code, debug, architecture**

### Pour multilingue FR/AR
- Mistral Large (français natif)
- Claude Sonnet 3.5 (multilingue)
- Llama3 70B (flexible)
- **→ Optimisé français et arabe**

## 📊 API Endpoints disponibles

### Liste tous les modèles
```bash
curl http://localhost:8180/api/council/models/all
```

### Estimation de coût
```bash
curl -X POST http://localhost:8180/api/council/estimate \
  -H "Content-Type: application/json" \
  -d '{
    "expert1": "claude-sonnet-3.5",
    "expert2": "gemini-1.5-pro",
    "expert3": "llama3-70b",
    "chairman": "claude-sonnet-3.5",
    "enable_review": false
  }'
```

### Exécution custom
```bash
curl -X POST http://localhost:8180/api/council/custom-query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Expliquez la différence entre authentification et autorisation",
    "expert1": "claude-sonnet-3.5",
    "expert2": "gemini-1.5-pro",
    "expert3": "gpt-4-turbo",
    "chairman": "claude-opus-4",
    "enable_review": false
  }'
```

## 🎁 Valeur ajoutée vs version de base

| Feature | Version de base | Version Custom |
|---------|-----------------|----------------|
| Config | Fixe (claude/gemini/ollama) | **Dynamique (10+ modèles)** ✅ |
| Choix | Automatique | **Manuel par l'utilisateur** ✅ |
| Presets | Aucun | **6 configurations recommandées** ✅ |
| Estimation | Non | **Coût & temps avant exécution** ✅ |
| Providers | 3 | **5 (OpenAI, Anthropic, Google, Mistral, Ollama)** ✅ |
| Local | Ollama uniquement | **4 modèles locaux gratuits** ✅ |

## 🚨 Troubleshooting

### "Modèle indisponible" dans le dropdown
→ Vérifiez que la clé API correspondante est dans `.env.local`

### Ollama ne répond pas
```bash
# Vérifier qu'Ollama est lancé
ollama list

# Sur Windows, lancer Ollama Desktop
# Ou: ollama serve
```

### Erreur "Module council_custom not found"
```bash
# Redémarrer le backend
cd backend/rag-compat
docker-compose restart backend
```

## 📈 Prochaines étapes possibles

1. **Sauvegarde de configs** - Permettre de sauvegarder ses combinaisons favorites
2. **Mode comparaison** - Afficher les 3 opinions côte à côte
3. **Historique** - Garder l'historique des requêtes et coûts
4. **Multi-chairman** - Permettre plusieurs synthèses (consensus, vote, etc.)
5. **Templates** - Créer des templates de questions par domaine

## ✅ Résumé

Vous avez maintenant un **Council complètement personnalisable** qui vous différencie de la version Karpathy :

- ✅ 10+ modèles LLM supportés
- ✅ Sélection manuelle des experts
- ✅ Estimation coûts/temps en temps réel
- ✅ 6 presets recommandés
- ✅ Interface intuitive avec dropdowns
- ✅ Support local gratuit (Ollama)
- ✅ API complète pour intégration

**C'est votre USP ! Aucun service concurrent n'offre cette flexibilité.**
