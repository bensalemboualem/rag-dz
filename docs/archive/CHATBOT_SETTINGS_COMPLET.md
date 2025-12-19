# 🤖 CONFIGURATION COMPLÈTE CHATBOT - Pour Genspark

**Date**: 30 Novembre 2025
**Source**: Bolt.DIY (IAFactory)
**Objectif**: Intégration chatbot multi-LLM avec sélection provider et API Key par utilisateur

---

## 📋 **STRUCTURE COMPLÈTE DES SETTINGS**

### **1. SÉLECTEUR DE PROVIDER LLM**

L'utilisateur peut choisir parmi **19 providers** :

```typescript
// Providers Cloud (15)
const CLOUD_PROVIDERS = [
  'OpenAI',
  'Anthropic',
  'Google',
  'Groq',
  'Deepseek',
  'Mistral',
  'Perplexity',
  'Cohere',
  'XAI',
  'Together',
  'OpenRouter',
  'HuggingFace',
  'Hyperbolic',
  'Moonshot',
  'Github',
  'AmazonBedrock'
];

// Providers Locaux (3)
const LOCAL_PROVIDERS = [
  'Ollama',
  'LMStudio',
  'OpenAILike'
];
```

---

## 🔑 **GESTION DES CLÉS API**

### **Interface utilisateur pour entrer la clé API**

```html
<!-- EXEMPLE HTML POUR INPUT API KEY -->
<div class="api-key-section">
  <label for="api-key-input">
    <span class="label-icon">🔑</span>
    Clé API {{providerName}}
  </label>

  <div class="input-group">
    <input
      type="password"
      id="api-key-input"
      placeholder="Entrez votre clé API {{providerName}}"
      class="api-key-input"
      value=""
    />
    <button class="toggle-visibility" onclick="toggleKeyVisibility()">
      👁️
    </button>
  </div>

  <small class="help-text">
    Pas de clé API ?
    <a href="{{getApiKeyLink}}" target="_blank">
      Obtenir une clé {{providerName}}
    </a>
  </small>
</div>
```

### **Liens pour obtenir les clés API**

```javascript
const API_KEY_LINKS = {
  "OpenAI": "https://platform.openai.com/api-keys",
  "Anthropic": "https://console.anthropic.com/settings/keys",
  "Google": "https://makersuite.google.com/app/apikey",
  "Groq": "https://console.groq.com/keys",
  "Deepseek": "https://platform.deepseek.com/api_keys",
  "Mistral": "https://console.mistral.ai/api-keys/",
  "Perplexity": "https://www.perplexity.ai/settings/api",
  "Cohere": "https://dashboard.cohere.com/api-keys",
  "XAI": "https://x.ai/api",
  "Together": "https://api.together.xyz/settings/api-keys",
  "OpenRouter": "https://openrouter.ai/keys",
  "HuggingFace": "https://huggingface.co/settings/tokens",
  "Github": "https://github.com/settings/tokens",
  "AmazonBedrock": "https://console.aws.amazon.com/bedrock",
  "Hyperbolic": "https://hyperbolic.xyz/settings/api-keys",
  "Moonshot": "https://platform.moonshot.cn/console/api-keys"
};
```

---

## 🎨 **INTERFACE UTILISATEUR COMPLÈTE**

### **HTML Complet avec Provider + Modèle + API Key**

```html
<div class="chatbot-settings">
  <!-- 1. SÉLECTEUR DE PROVIDER -->
  <div class="setting-group">
    <label>
      <span class="icon">🤖</span>
      Choisissez votre fournisseur IA
    </label>
    <select id="provider-select" onchange="updateModels()">
      <optgroup label="☁️ Providers Cloud">
        <option value="google">🌐 Google Gemini (Gratuit)</option>
        <option value="groq">⚡ Groq (Ultra-rapide & Gratuit)</option>
        <option value="openai">🤖 OpenAI GPT-4</option>
        <option value="anthropic">🧠 Claude (Anthropic)</option>
        <option value="deepseek">💰 DeepSeek (Économique)</option>
        <option value="mistral">🇫🇷 Mistral AI</option>
        <option value="perplexity">🔍 Perplexity (avec recherche web)</option>
        <option value="cohere">📝 Cohere</option>
        <option value="xai">🚀 xAI (Grok)</option>
        <option value="together">🤝 Together AI</option>
        <option value="openrouter">🌉 OpenRouter</option>
        <option value="huggingface">🤗 HuggingFace</option>
      </optgroup>
      <optgroup label="🖥️ Providers Locaux">
        <option value="ollama">🦙 Ollama (Local)</option>
        <option value="lmstudio">💻 LM Studio (Local)</option>
      </optgroup>
    </select>
  </div>

  <!-- 2. SÉLECTEUR DE MODÈLE -->
  <div class="setting-group">
    <label>
      <span class="icon">🧠</span>
      Modèle IA
    </label>
    <select id="model-select">
      <!-- Dynamique selon provider sélectionné -->
    </select>
  </div>

  <!-- 3. CHAMP CLÉ API -->
  <div class="setting-group" id="api-key-section">
    <label for="api-key-input">
      <span class="icon">🔑</span>
      Clé API <span id="provider-name"></span>
    </label>

    <div class="input-wrapper">
      <input
        type="password"
        id="api-key-input"
        placeholder="sk-..."
        autocomplete="off"
      />
      <button type="button" onclick="togglePasswordVisibility()">
        <span id="eye-icon">👁️</span>
      </button>
    </div>

    <div class="help-links">
      <a href="#" id="get-api-key-link" target="_blank">
        📋 Obtenir une clé API
      </a>
      <span class="status" id="api-key-status"></span>
    </div>
  </div>

  <!-- 4. PARAMÈTRES AVANCÉS (OPTIONNEL) -->
  <details class="advanced-settings">
    <summary>⚙️ Paramètres avancés</summary>

    <div class="setting-group">
      <label>Température (0-2)</label>
      <input type="range" min="0" max="2" step="0.1" value="0.7" id="temperature">
      <span id="temp-value">0.7</span>
    </div>

    <div class="setting-group">
      <label>Tokens maximum</label>
      <input type="number" min="100" max="32000" value="2048" id="max-tokens">
    </div>
  </details>

  <!-- 5. BOUTON SAUVEGARDER -->
  <button class="save-btn" onclick="saveSettings()">
    💾 Sauvegarder la configuration
  </button>
</div>
```

---

## 📊 **DONNÉES DES MODÈLES PAR PROVIDER**

```javascript
const PROVIDER_MODELS = {
  "google": [
    {
      "name": "gemini-2.5-flash",
      "label": "Gemini 2.5 Flash (Rapide)",
      "maxTokens": 32000,
      "pricing": "Gratuit"
    },
    {
      "name": "gemini-pro",
      "label": "Gemini Pro",
      "maxTokens": 30720,
      "pricing": "Gratuit"
    },
    {
      "name": "gemini-1.5-pro",
      "label": "Gemini 1.5 Pro",
      "maxTokens": 128000,
      "pricing": "Payant"
    }
  ],
  "openai": [
    {
      "name": "gpt-4o",
      "label": "GPT-4o (Recommandé)",
      "maxTokens": 128000,
      "pricing": "Payant"
    },
    {
      "name": "gpt-4-turbo",
      "label": "GPT-4 Turbo",
      "maxTokens": 128000,
      "pricing": "Payant"
    },
    {
      "name": "gpt-3.5-turbo",
      "label": "GPT-3.5 Turbo (Économique)",
      "maxTokens": 16385,
      "pricing": "Économique"
    }
  ],
  "anthropic": [
    {
      "name": "claude-3-5-sonnet-20241022",
      "label": "Claude 3.5 Sonnet (Meilleur)",
      "maxTokens": 200000,
      "pricing": "Payant"
    },
    {
      "name": "claude-3-opus-20240229",
      "label": "Claude 3 Opus",
      "maxTokens": 200000,
      "pricing": "Premium"
    },
    {
      "name": "claude-3-haiku-20240307",
      "label": "Claude 3 Haiku (Rapide)",
      "maxTokens": 200000,
      "pricing": "Économique"
    }
  ],
  "groq": [
    {
      "name": "llama-3.1-70b-versatile",
      "label": "Llama 3.1 70B (Recommandé)",
      "maxTokens": 32000,
      "pricing": "Gratuit"
    },
    {
      "name": "llama-3.1-8b-instant",
      "label": "Llama 3.1 8B (Ultra-rapide)",
      "maxTokens": 8000,
      "pricing": "Gratuit"
    },
    {
      "name": "mixtral-8x7b-32768",
      "label": "Mixtral 8x7B",
      "maxTokens": 32768,
      "pricing": "Gratuit"
    }
  ],
  "deepseek": [
    {
      "name": "deepseek-chat",
      "label": "DeepSeek Chat",
      "maxTokens": 32000,
      "pricing": "Très économique"
    },
    {
      "name": "deepseek-coder",
      "label": "DeepSeek Coder",
      "maxTokens": 16000,
      "pricing": "Très économique"
    }
  ],
  "mistral": [
    {
      "name": "mistral-large-latest",
      "label": "Mistral Large (Meilleur)",
      "maxTokens": 32000,
      "pricing": "Payant"
    },
    {
      "name": "mistral-medium-latest",
      "label": "Mistral Medium",
      "maxTokens": 32000,
      "pricing": "Moyen"
    },
    {
      "name": "mistral-small-latest",
      "label": "Mistral Small (Rapide)",
      "maxTokens": 32000,
      "pricing": "Économique"
    }
  ],
  "perplexity": [
    {
      "name": "pplx-70b-online",
      "label": "Perplexity 70B Online (Recherche web)",
      "maxTokens": 4096,
      "pricing": "Payant"
    },
    {
      "name": "pplx-7b-chat",
      "label": "Perplexity 7B Chat",
      "maxTokens": 8192,
      "pricing": "Économique"
    }
  ],
  "ollama": [
    {
      "name": "llama3",
      "label": "Llama 3 (Local)",
      "maxTokens": 8000,
      "pricing": "Gratuit (local)"
    },
    {
      "name": "mistral",
      "label": "Mistral (Local)",
      "maxTokens": 8000,
      "pricing": "Gratuit (local)"
    },
    {
      "name": "codellama",
      "label": "Code Llama (Local)",
      "maxTokens": 16000,
      "pricing": "Gratuit (local)"
    }
  ]
};
```

---

## 💾 **STOCKAGE DES SETTINGS**

### **Structure localStorage**

```javascript
// Sauvegarder les settings utilisateur
const userSettings = {
  "provider": "google",
  "model": "gemini-2.5-flash",
  "apiKey": "AIzaSy...",  // Crypté côté client !
  "temperature": 0.7,
  "maxTokens": 2048,
  "timestamp": "2025-11-30T10:30:00Z"
};

// Sauvegarder
localStorage.setItem('iafactory_chatbot_settings', JSON.stringify(userSettings));

// Charger
const savedSettings = JSON.parse(localStorage.getItem('iafactory_chatbot_settings'));
```

### **⚠️ SÉCURITÉ : Crypter la clé API**

```javascript
// Simple encryption (XOR avec clé secrète)
function encryptApiKey(apiKey) {
  const secret = "IAFACTORY_SECRET_KEY_2025";
  let encrypted = '';
  for (let i = 0; i < apiKey.length; i++) {
    encrypted += String.fromCharCode(
      apiKey.charCodeAt(i) ^ secret.charCodeAt(i % secret.length)
    );
  }
  return btoa(encrypted); // Base64
}

function decryptApiKey(encryptedKey) {
  const secret = "IAFACTORY_SECRET_KEY_2025";
  const decoded = atob(encryptedKey);
  let decrypted = '';
  for (let i = 0; i < decoded.length; i++) {
    decrypted += String.fromCharCode(
      decoded.charCodeAt(i) ^ secret.charCodeAt(i % secret.length)
    );
  }
  return decrypted;
}
```

---

## 🔄 **LOGIQUE JAVASCRIPT COMPLÈTE**

```javascript
// chatbot-settings.js

let currentProvider = 'google';
let currentModel = 'gemini-2.5-flash';

// 1. Charger les settings au démarrage
function loadSettings() {
  const saved = localStorage.getItem('iafactory_chatbot_settings');
  if (saved) {
    const settings = JSON.parse(saved);
    currentProvider = settings.provider || 'google';
    currentModel = settings.model || 'gemini-2.5-flash';

    document.getElementById('provider-select').value = currentProvider;
    updateModels();
    document.getElementById('model-select').value = currentModel;

    // Charger API key (décryptée)
    if (settings.apiKey) {
      document.getElementById('api-key-input').value =
        decryptApiKey(settings.apiKey);
    }
  }
}

// 2. Mettre à jour les modèles quand provider change
function updateModels() {
  const provider = document.getElementById('provider-select').value;
  const modelSelect = document.getElementById('model-select');
  const models = PROVIDER_MODELS[provider] || [];

  // Vider les options
  modelSelect.innerHTML = '';

  // Ajouter les nouveaux modèles
  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model.name;
    option.textContent = `${model.label} - ${model.pricing}`;
    modelSelect.appendChild(option);
  });

  // Mettre à jour le lien API key
  updateApiKeyLink(provider);
}

// 3. Mettre à jour le lien "Obtenir une clé API"
function updateApiKeyLink(provider) {
  const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
  document.getElementById('provider-name').textContent = providerName;

  const link = document.getElementById('get-api-key-link');
  link.href = API_KEY_LINKS[providerName] || '#';

  // Masquer le champ API key pour providers locaux
  const apiKeySection = document.getElementById('api-key-section');
  if (['ollama', 'lmstudio'].includes(provider)) {
    apiKeySection.style.display = 'none';
  } else {
    apiKeySection.style.display = 'block';
  }
}

// 4. Toggle visibilité mot de passe
function togglePasswordVisibility() {
  const input = document.getElementById('api-key-input');
  const icon = document.getElementById('eye-icon');

  if (input.type === 'password') {
    input.type = 'text';
    icon.textContent = '🙈';
  } else {
    input.type = 'password';
    icon.textContent = '👁️';
  }
}

// 5. Valider la clé API
function validateApiKey(provider, apiKey) {
  const patterns = {
    'openai': /^sk-[a-zA-Z0-9]{48}$/,
    'anthropic': /^sk-ant-[a-zA-Z0-9-]{95}$/,
    'google': /^AIza[a-zA-Z0-9_-]{35}$/,
    'groq': /^gsk_[a-zA-Z0-9]{52}$/,
    'deepseek': /^sk-[a-zA-Z0-9]{48}$/
  };

  const pattern = patterns[provider];
  return pattern ? pattern.test(apiKey) : true; // Par défaut OK
}

// 6. Sauvegarder les settings
function saveSettings() {
  const provider = document.getElementById('provider-select').value;
  const model = document.getElementById('model-select').value;
  const apiKey = document.getElementById('api-key-input').value;

  // Validation
  if (!apiKey && !['ollama', 'lmstudio'].includes(provider)) {
    alert('⚠️ Veuillez entrer votre clé API');
    return;
  }

  if (!validateApiKey(provider, apiKey)) {
    alert('⚠️ Format de clé API invalide');
    return;
  }

  // Sauvegarder (avec cryptage)
  const settings = {
    provider: provider,
    model: model,
    apiKey: encryptApiKey(apiKey),
    temperature: parseFloat(document.getElementById('temperature').value),
    maxTokens: parseInt(document.getElementById('max-tokens').value),
    timestamp: new Date().toISOString()
  };

  localStorage.setItem('iafactory_chatbot_settings', JSON.stringify(settings));

  // Notification
  showNotification('✅ Configuration sauvegardée !', 'success');

  // Recharger le chatbot avec nouveaux settings
  initChatbot(settings);
}

// 7. Initialiser le chatbot avec les settings
async function initChatbot(settings) {
  const { provider, model, apiKey } = settings;

  // Ici, intégrer avec votre backend RAG
  const response = await fetch('http://localhost:8180/api/rag/multi/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-LLM-Provider': provider,
      'X-LLM-Model': model,
      'Authorization': `Bearer ${decryptApiKey(apiKey)}`
    },
    body: JSON.stringify({
      query: "Test chatbot",
      country: "DZ"
    })
  });

  console.log('Chatbot initialisé:', await response.json());
}

// 8. Charger au démarrage
document.addEventListener('DOMContentLoaded', loadSettings);
```

---

## 🎨 **CSS POUR L'INTERFACE**

```css
/* chatbot-settings.css */

.chatbot-settings {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.setting-group {
  margin-bottom: 20px;
}

.setting-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.setting-group label .icon {
  font-size: 20px;
}

select, input[type="password"], input[type="text"] {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

select:focus, input:focus {
  outline: none;
  border-color: #a855f7;
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper button {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 4px 8px;
}

.help-links {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.help-links a {
  color: #a855f7;
  text-decoration: none;
  font-size: 13px;
}

.help-links a:hover {
  text-decoration: underline;
}

.status {
  font-size: 12px;
  color: #10b981;
}

.advanced-settings {
  margin-top: 24px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.advanced-settings summary {
  cursor: pointer;
  font-weight: 500;
  user-select: none;
}

.save-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #a855f7, #8b5cf6);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
}

.save-btn:active {
  transform: translateY(0);
}
```

---

## 📤 **INTÉGRATION AVEC BACKEND RAG**

```javascript
// Exemple d'envoi au backend avec provider/model/apiKey
async function sendToRAG(userMessage) {
  const settings = JSON.parse(localStorage.getItem('iafactory_chatbot_settings'));

  const response = await fetch('http://localhost:8180/api/rag/multi/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-LLM-Provider': settings.provider,
      'X-LLM-Model': settings.model,
      'X-API-Key': decryptApiKey(settings.apiKey)
    },
    body: JSON.stringify({
      query: userMessage,
      country: "DZ",
      top_k: 5,
      temperature: settings.temperature,
      max_tokens: settings.maxTokens
    })
  });

  return await response.json();
}
```

---

## 📁 **FICHIERS À DONNER À GENSPARK**

### **Liste des fichiers nécessaires :**

1. ✅ **CHATBOT_SETTINGS_COMPLET.md** (ce fichier)
2. ✅ **LLM_PROVIDERS_CONFIG.md** (déjà créé)
3. ✅ **LISTE_COMPLETE_APPS.md** (liste des 41 apps)
4. 📄 **chatbot-settings.html** (interface HTML complète)
5. 📄 **chatbot-settings.js** (logique JavaScript)
6. 📄 **chatbot-settings.css** (styles)

---

## 🎯 **RECOMMANDATIONS**

### **Providers recommandés pour démo :**

1. ✅ **Google Gemini** (Gratuit, rapide, déjà configuré)
2. ⚡ **Groq** (Gratuit, ultra-rapide)
3. 🤖 **OpenAI** (Qualité premium si budget)
4. 💰 **DeepSeek** (Très économique)

### **Configuration par défaut suggérée :**

```javascript
const DEFAULT_SETTINGS = {
  provider: 'google',
  model: 'gemini-2.5-flash',
  temperature: 0.7,
  maxTokens: 2048
};
```

---

## ✅ **CHECKLIST INTÉGRATION**

- [ ] Interface HTML avec sélecteur provider
- [ ] Liste déroulante des modèles (dynamique)
- [ ] Champ input pour clé API (avec toggle visibilité)
- [ ] Liens "Obtenir une clé API" pour chaque provider
- [ ] Validation format clé API
- [ ] Cryptage clé API avant stockage
- [ ] Sauvegarde dans localStorage
- [ ] Intégration avec backend RAG (/api/rag/multi/query)
- [ ] Gestion erreurs (clé invalide, provider indisponible)
- [ ] Notification succès/erreur

---

**TOUT EST PRÊT POUR GENSPARK !** 🚀

Ce fichier contient **TOUTE** la logique nécessaire pour créer un chatbot avec :
- ✅ Sélection de 19 providers LLM
- ✅ Sélection du modèle
- ✅ Input clé API utilisateur
- ✅ Validation et cryptage
- ✅ Sauvegarde localStorage
- ✅ Intégration backend RAG

**Donnez ce fichier + les 3 autres MD à votre développeur Genspark !**
