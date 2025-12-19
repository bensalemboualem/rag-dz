# 🤖 CONFIGURATION LLM PROVIDERS - Bolt.DIY

**Fichier source**: `bolt-diy/app/lib/modules/llm/registry.ts`

---

## 📋 **LISTE DES 19 LLM PROVIDERS SUPPORTÉS**

### **1. OpenAI** 🟢
- **Provider**: `OpenAIProvider`
- **Fichier**: `bolt-diy/app/lib/modules/llm/providers/openai.ts`
- **Clé API**: `OPENAI_API_KEY`
- **Modèles**: GPT-4o, GPT-4-turbo, GPT-3.5-turbo, etc.
- **Statut**: ✅ Provider par défaut (clé valide)

### **2. DeepSeek** 💰
- **Provider**: `DeepseekProvider`
- **Fichier**: `bolt-diy/app/lib/modules/llm/providers/deepseek.ts`
- **Clé API**: `DEEPSEEK_API_KEY`
- **Modèles**: deepseek-chat, deepseek-coder
- **Statut**: 💰 Économique pour BMAD

### **3. Anthropic (Claude)** 🧠
- **Provider**: `AnthropicProvider`
- **Fichier**: `bolt-diy/app/lib/modules/llm/providers/anthropic.ts`
- **Clé API**: `ANTHROPIC_API_KEY`
- **Modèles**: Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku

### **4. Google (Gemini)** 🌐
- **Provider**: `GoogleProvider`
- **Fichier**: `bolt-diy/app/lib/modules/llm/providers/google.ts`
- **Clé API**: `GOOGLE_GENERATIVE_AI_API_KEY`
- **Modèles**: Gemini 2.5 Flash, Gemini Pro, Gemini 1.5 Pro
- **Statut**: ✅ Configuré avec clé valide

### **5. Groq** ⚡
- **Provider**: `GroqProvider`
- **Fichier**: `bolt-diy/app/lib/modules/llm/providers/groq.ts`
- **Clé API**: `GROQ_API_KEY`
- **Modèles**: Llama 3.1 70B, Llama 3.1 8B, Mixtral 8x7B
- **Statut**: ⚡ Ultra-rapide et gratuit

### **6. Mistral** 🇫🇷
- **Provider**: `MistralProvider`
- **Fichier**: `bolt-diy/app/lib/modules/llm/providers/mistral.ts`
- **Clé API**: `MISTRAL_API_KEY`
- **Modèles**: Mistral Large, Mistral Medium, Mistral Small

### **7. Perplexity** 🔍
- **Provider**: `PerplexityProvider`
- **Fichier**: `bolt-diy/app/lib/modules/llm/providers/perplexity.ts`
- **Clé API**: `PERPLEXITY_API_KEY`
- **Modèles**: pplx-70b-online, pplx-7b-chat

### **8. Cohere** 📝
- **Provider**: `CohereProvider`
- **Fichier**: `bolt-diy/app/lib/modules/llm/providers/cohere.ts`
- **Clé API**: `COHERE_API_KEY`
- **Modèles**: command, command-light, command-r, command-r-plus

### **9. xAI (Grok)** 🚀
- **Provider**: `XAIProvider`
- **Fichier**: `bolt-diy/app/lib/modules/llm/providers/xai.ts`
- **Clé API**: `XAI_API_KEY`
- **Modèles**: grok-beta, grok-2

### **10. Together AI** 🤝
- **Provider**: `TogetherProvider`
- **Fichier**: `bolt-diy/app/lib/modules/llm/providers/together.ts`
- **Clé API**: `TOGETHER_API_KEY`
- **Modèles**: Multiple open-source models

### **11. OpenRouter** 🌉
- **Provider**: `OpenRouterProvider`
- **Fichier**: `bolt-diy/app/lib/modules/llm/providers/open-router.ts`
- **Clé API**: `OPENROUTER_API_KEY`
- **Modèles**: Accès à 100+ modèles

### **12. HuggingFace** 🤗
- **Provider**: `HuggingFaceProvider`
- **Fichier**: `bolt-diy/app/lib/modules/llm/providers/huggingface.ts`
- **Clé API**: `HUGGINGFACE_API_KEY`
- **Modèles**: Tous les modèles HuggingFace

### **13. Ollama** 🦙 (Local)
- **Provider**: `OllamaProvider`
- **Fichier**: `bolt-diy/app/lib/modules/llm/providers/ollama.ts`
- **URL**: `OLLAMA_BASE_URL` (default: http://localhost:11434)
- **Modèles**: Llama, Mistral, CodeLlama (local)

### **14. LM Studio** 🖥️ (Local)
- **Provider**: `LMStudioProvider`
- **Fichier**: `bolt-diy/app/lib/modules/llm/providers/lmstudio.ts`
- **URL**: `LMSTUDIO_BASE_URL`
- **Modèles**: Modèles locaux via LM Studio

### **15. Amazon Bedrock** ☁️
- **Provider**: `AmazonBedrockProvider`
- **Fichier**: `bolt-diy/app/lib/modules/llm/providers/amazon-bedrock.ts`
- **Clés**: AWS credentials
- **Modèles**: Claude, Llama, Titan sur AWS

### **16. GitHub Models** 🐙
- **Provider**: `GithubProvider`
- **Fichier**: `bolt-diy/app/lib/modules/llm/providers/github.ts`
- **Clé API**: `GITHUB_TOKEN`
- **Modèles**: Models via GitHub

### **17. Hyperbolic** 📈
- **Provider**: `HyperbolicProvider`
- **Fichier**: `bolt-diy/app/lib/modules/llm/providers/hyperbolic.ts`
- **Clé API**: `HYPERBOLIC_API_KEY`
- **Modèles**: Hyperbolic models

### **18. Moonshot** 🌙
- **Provider**: `MoonshotProvider`
- **Fichier**: `bolt-diy/app/lib/modules/llm/providers/moonshot.ts`
- **Clé API**: `MOONSHOT_API_KEY`
- **Modèles**: Moonshot models

### **19. OpenAI-Like** 🔧 (Custom)
- **Provider**: `OpenAILikeProvider`
- **Fichier**: `bolt-diy/app/lib/modules/llm/providers/openai-like.ts`
- **Custom**: Pour APIs compatibles OpenAI
- **Config**: Base URL + API Key custom

---

## 🔧 **CONFIGURATION POUR CHATBOT**

### **Format JSON pour sélecteur de provider**

```json
{
  "providers": [
    {
      "id": "openai",
      "name": "OpenAI",
      "icon": "🤖",
      "models": ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"],
      "apiKeyEnv": "OPENAI_API_KEY",
      "pricing": "Payant",
      "speed": "Rapide"
    },
    {
      "id": "google",
      "name": "Google Gemini",
      "icon": "🌐",
      "models": ["gemini-2.5-flash", "gemini-pro"],
      "apiKeyEnv": "GOOGLE_GENERATIVE_AI_API_KEY",
      "pricing": "Gratuit/Payant",
      "speed": "Très rapide"
    },
    {
      "id": "anthropic",
      "name": "Anthropic Claude",
      "icon": "🧠",
      "models": ["claude-3-5-sonnet", "claude-3-opus", "claude-3-haiku"],
      "apiKeyEnv": "ANTHROPIC_API_KEY",
      "pricing": "Payant",
      "speed": "Rapide"
    },
    {
      "id": "groq",
      "name": "Groq",
      "icon": "⚡",
      "models": ["llama-3.1-70b", "llama-3.1-8b", "mixtral-8x7b"],
      "apiKeyEnv": "GROQ_API_KEY",
      "pricing": "Gratuit",
      "speed": "Ultra-rapide"
    },
    {
      "id": "deepseek",
      "name": "DeepSeek",
      "icon": "💰",
      "models": ["deepseek-chat", "deepseek-coder"],
      "apiKeyEnv": "DEEPSEEK_API_KEY",
      "pricing": "Économique",
      "speed": "Rapide"
    },
    {
      "id": "mistral",
      "name": "Mistral AI",
      "icon": "🇫🇷",
      "models": ["mistral-large", "mistral-medium", "mistral-small"],
      "apiKeyEnv": "MISTRAL_API_KEY",
      "pricing": "Payant",
      "speed": "Rapide"
    },
    {
      "id": "perplexity",
      "name": "Perplexity",
      "icon": "🔍",
      "models": ["pplx-70b-online", "pplx-7b-chat"],
      "apiKeyEnv": "PERPLEXITY_API_KEY",
      "pricing": "Payant",
      "speed": "Rapide + Search"
    },
    {
      "id": "ollama",
      "name": "Ollama (Local)",
      "icon": "🦙",
      "models": ["llama3", "mistral", "codellama"],
      "apiKeyEnv": null,
      "pricing": "Gratuit",
      "speed": "Variable (local)"
    }
  ]
}
```

---

## 🎨 **INTERFACE UTILISATEUR - Sélecteur de Provider**

### **Exemple HTML pour dropdown provider**

```html
<div class="llm-provider-selector">
  <label>Choisissez votre modèle IA</label>
  <select id="provider-select" onchange="selectProvider()">
    <option value="google">🌐 Google Gemini (Rapide & Gratuit)</option>
    <option value="groq">⚡ Groq (Ultra-rapide)</option>
    <option value="openai">🤖 OpenAI GPT-4</option>
    <option value="anthropic">🧠 Claude (Anthropic)</option>
    <option value="deepseek">💰 DeepSeek (Économique)</option>
    <option value="mistral">🇫🇷 Mistral AI</option>
    <option value="perplexity">🔍 Perplexity (avec recherche)</option>
    <option value="ollama">🦙 Ollama (Local)</option>
  </select>

  <select id="model-select">
    <!-- Modèles dynamiques selon provider -->
  </select>
</div>
```

---

## ⚙️ **CONFIGURATION .ENV**

```bash
# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# Google Gemini
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyAK9IU-U2VCyLJFSGxu-MaPDcMBSmh73ys

# Anthropic
ANTHROPIC_API_KEY=sk-ant-your-key

# Groq
GROQ_API_KEY=gsk-your-groq-key

# DeepSeek
DEEPSEEK_API_KEY=sk-your-deepseek-key

# Mistral
MISTRAL_API_KEY=your-mistral-key

# Perplexity
PERPLEXITY_API_KEY=your-perplexity-key

# Cohere
COHERE_API_KEY=your-cohere-key

# Together AI
TOGETHER_API_KEY=your-together-key

# OpenRouter
OPENROUTER_API_KEY=sk-or-your-key

# HuggingFace
HUGGINGFACE_API_KEY=hf_your-key

# xAI
XAI_API_KEY=xai-your-key

# Hyperbolic
HYPERBOLIC_API_KEY=your-hyperbolic-key

# Moonshot
MOONSHOT_API_KEY=your-moonshot-key

# Ollama (local)
OLLAMA_BASE_URL=http://localhost:11434

# LM Studio (local)
LMSTUDIO_BASE_URL=http://localhost:1234
```

---

## 🔄 **INTÉGRATION DANS VOTRE CHATBOT**

### **1. Copier les fichiers providers**
```bash
cp -r bolt-diy/app/lib/modules/llm/providers/* votre-chatbot/providers/
```

### **2. Utiliser le registry**
```typescript
import {
  GoogleProvider,
  GroqProvider,
  OpenAIProvider,
  AnthropicProvider
} from './providers';

const providers = {
  google: new GoogleProvider(),
  groq: new GroqProvider(),
  openai: new OpenAIProvider(),
  anthropic: new AnthropicProvider()
};
```

### **3. Sélection par utilisateur**
```javascript
function selectProvider(providerName, modelName) {
  const provider = providers[providerName];
  const model = provider.getModelInstance({
    model: modelName,
    apiKeys: {
      [providerName]: process.env[`${providerName.toUpperCase()}_API_KEY`]
    }
  });
  return model;
}
```

---

## 🎯 **RECOMMANDATIONS POUR IAFACTORY**

### **Providers prioritaires pour chatbot**
1. ✅ **Google Gemini** (déjà configuré) - Gratuit + rapide
2. ⚡ **Groq** - Ultra-rapide pour démo
3. 🤖 **OpenAI GPT-4** - Qualité premium
4. 💰 **DeepSeek** - Économique

### **Configuration minimale pour démo**
```env
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyAK9IU-U2VCyLJFSGxu-MaPDcMBSmh73ys
GROQ_API_KEY=<obtenir clé gratuite sur groq.com>
```

---

## 📁 **FICHIERS À DONNER AU DÉVELOPPEUR**

1. **Registry**: `bolt-diy/app/lib/modules/llm/registry.ts`
2. **Base Provider**: `bolt-diy/app/lib/modules/llm/base-provider.ts`
3. **Types**: `bolt-diy/app/lib/modules/llm/types.ts`
4. **Providers individuels**: `bolt-diy/app/lib/modules/llm/providers/*.ts`

---

**Total : 19 providers LLM supportés**
**Configuration actuelle : Google Gemini ✅**
