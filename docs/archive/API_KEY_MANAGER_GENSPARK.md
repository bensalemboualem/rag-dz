# 🔑 SYSTÈME D'ÉDITION DE CLÉ API - Pour Genspark

**Source** : Bolt.DIY `APIKeyManager.tsx`
**Objectif** : Ajouter un **crayon d'édition** à côté du sélecteur LLM pour entrer la clé API directement

---

## 🎯 **FONCTIONNEMENT DU SYSTÈME**

### **Interface utilisateur**

```
[Sélecteur Provider ▼]  [Google Gemini API Key: ✓ Set via UI]  [✏️ Edit]  [🔑 Get API Key]
```

**Quand on clique sur le crayon (✏️)** :

```
[Sélecteur Provider ▼]  [••••••••••••••••••••]  [✓ Save]  [✗ Cancel]
```

---

## 📋 **CODE COMPLET POUR GENSPARK**

### **1. Component React (APIKeyManager)**

```typescript
import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';

interface APIKeyManagerProps {
  provider: {
    name: string;
    getApiKeyLink?: string;
    labelForGetApiKey?: string;
  };
  apiKey: string;
  setApiKey: (key: string) => void;
}

// Récupérer les clés API depuis les cookies
export function getApiKeysFromCookies(): Record<string, string> {
  const storedApiKeys = Cookies.get('apiKeys');

  if (storedApiKeys) {
    try {
      return JSON.parse(storedApiKeys);
    } catch (error) {
      console.error('Failed to parse API keys:', error);
      return {};
    }
  }

  return {};
}

export const APIKeyManager: React.FC<APIKeyManagerProps> = ({
  provider,
  apiKey,
  setApiKey
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [isEnvKeySet, setIsEnvKeySet] = useState(false);

  // Charger la clé sauvegardée quand le provider change
  useEffect(() => {
    const savedKeys = getApiKeysFromCookies();
    const savedKey = savedKeys[provider.name] || '';

    setTempKey(savedKey);
    setApiKey(savedKey);
    setIsEditing(false);
  }, [provider.name]);

  // Vérifier si une clé API existe dans l'environnement
  const checkEnvApiKey = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/check-env-key?provider=${encodeURIComponent(provider.name)}`
      );
      const data = await response.json();
      setIsEnvKeySet(data.isSet || false);
    } catch (error) {
      console.error('Failed to check environment API key:', error);
      setIsEnvKeySet(false);
    }
  }, [provider.name]);

  useEffect(() => {
    checkEnvApiKey();
  }, [checkEnvApiKey]);

  // Sauvegarder la clé API
  const handleSave = () => {
    // Mettre à jour l'état parent
    setApiKey(tempKey);

    // Sauvegarder dans les cookies
    const currentKeys = getApiKeysFromCookies();
    const newKeys = { ...currentKeys, [provider.name]: tempKey };
    Cookies.set('apiKeys', JSON.stringify(newKeys), { expires: 365 });

    setIsEditing(false);
  };

  // Annuler l'édition
  const handleCancel = () => {
    setTempKey(apiKey); // Réinitialiser avec la valeur actuelle
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between py-3 px-1">
      {/* Section gauche: Statut de la clé */}
      <div className="flex items-center gap-2 flex-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {provider.name} API Key:
        </span>

        {!isEditing && (
          <div className="flex items-center gap-2">
            {apiKey ? (
              <>
                <span className="text-green-500 text-lg">✓</span>
                <span className="text-xs text-green-500">Set via UI</span>
              </>
            ) : isEnvKeySet ? (
              <>
                <span className="text-green-500 text-lg">✓</span>
                <span className="text-xs text-green-500">Set via environment</span>
              </>
            ) : (
              <>
                <span className="text-red-500 text-lg">✗</span>
                <span className="text-xs text-red-500">Not Set</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Section droite: Boutons d'action */}
      <div className="flex items-center gap-2">
        {isEditing ? (
          // Mode édition: Input + Save + Cancel
          <>
            <input
              type="password"
              value={tempKey}
              placeholder="Enter API Key"
              onChange={(e) => setTempKey(e.target.value)}
              className="w-[300px] px-3 py-1.5 text-sm rounded border border-gray-300
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleSave}
              title="Save API Key"
              className="px-3 py-1.5 rounded bg-green-500/10 hover:bg-green-500/20
                        text-green-500 transition-colors"
            >
              ✓ Save
            </button>
            <button
              onClick={handleCancel}
              title="Cancel"
              className="px-3 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20
                        text-red-500 transition-colors"
            >
              ✗ Cancel
            </button>
          </>
        ) : (
          // Mode affichage: Edit + Get API Key
          <>
            <button
              onClick={() => setIsEditing(true)}
              title="Edit API Key"
              className="px-3 py-1.5 rounded bg-blue-500/10 hover:bg-blue-500/20
                        text-blue-500 transition-colors flex items-center gap-2"
            >
              ✏️ Edit
            </button>

            {provider.getApiKeyLink && !apiKey && (
              <button
                onClick={() => window.open(provider.getApiKeyLink)}
                title="Get API Key"
                className="px-3 py-1.5 rounded bg-purple-500/10 hover:bg-purple-500/20
                          text-purple-500 transition-colors flex items-center gap-2"
              >
                <span className="text-xs">
                  {provider.labelForGetApiKey || 'Get API Key'}
                </span>
                🔑
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
```

---

## 🔧 **INTÉGRATION DANS LE CHATBOT**

### **Structure HTML complète**

```html
<div class="chatbot-settings">
  <!-- 1. SÉLECTEUR DE PROVIDER -->
  <div class="setting-group">
    <label>Fournisseur IA</label>
    <select id="provider-select" onchange="updateApiKeyManager()">
      <option value="google">🌐 Google Gemini</option>
      <option value="openai">🤖 OpenAI GPT-4</option>
      <option value="anthropic">🧠 Claude</option>
      <option value="groq">⚡ Groq</option>
    </select>
  </div>

  <!-- 2. API KEY MANAGER (avec crayon d'édition) -->
  <div id="api-key-manager">
    <!-- Injecté dynamiquement par le composant APIKeyManager -->
  </div>

  <!-- 3. SÉLECTEUR DE MODÈLE -->
  <div class="setting-group">
    <label>Modèle</label>
    <select id="model-select">
      <!-- Rempli dynamiquement -->
    </select>
  </div>
</div>
```

---

## 💾 **STOCKAGE DES CLÉS API**

### **1. Utiliser les Cookies (recommandé)**

```javascript
// Installation: npm install js-cookie

import Cookies from 'js-cookie';

// Sauvegarder
function saveApiKey(providerName, apiKey) {
  const currentKeys = JSON.parse(Cookies.get('apiKeys') || '{}');
  currentKeys[providerName] = apiKey;
  Cookies.set('apiKeys', JSON.stringify(currentKeys), { expires: 365 });
}

// Charger
function loadApiKey(providerName) {
  const apiKeys = JSON.parse(Cookies.get('apiKeys') || '{}');
  return apiKeys[providerName] || '';
}
```

### **2. Utiliser localStorage (alternative)**

```javascript
// Sauvegarder
function saveApiKey(providerName, apiKey) {
  const currentKeys = JSON.parse(localStorage.getItem('apiKeys') || '{}');
  currentKeys[providerName] = apiKey;
  localStorage.setItem('apiKeys', JSON.stringify(currentKeys));
}

// Charger
function loadApiKey(providerName) {
  const apiKeys = JSON.parse(localStorage.getItem('apiKeys') || '{}');
  return apiKeys[providerName] || '';
}
```

---

## 🔐 **VÉRIFIER CLÉ DANS ENVIRONNEMENT**

### **API Backend : `/api/check-env-key`**

```javascript
// Exemple Node.js/Express
app.get('/api/check-env-key', (req, res) => {
  const { provider } = req.query;

  const envKeyMapping = {
    'Google': 'GOOGLE_GENERATIVE_AI_API_KEY',
    'OpenAI': 'OPENAI_API_KEY',
    'Anthropic': 'ANTHROPIC_API_KEY',
    'Groq': 'GROQ_API_KEY',
    'Deepseek': 'DEEPSEEK_API_KEY',
    'Mistral': 'MISTRAL_API_KEY',
  };

  const envKey = envKeyMapping[provider];
  const isSet = envKey && process.env[envKey] ? true : false;

  res.json({ isSet });
});
```

---

## 🎨 **CSS POUR LE STYLE**

```css
/* api-key-manager.css */

.api-key-manager {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin: 12px 0;
}

.api-key-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.api-key-status.set {
  color: #10b981;
}

.api-key-status.not-set {
  color: #ef4444;
}

.api-key-input {
  width: 300px;
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-family: monospace;
}

.api-key-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn-edit,
.btn-save,
.btn-cancel,
.btn-get-key {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-edit {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.btn-edit:hover {
  background: rgba(59, 130, 246, 0.2);
}

.btn-save {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.btn-save:hover {
  background: rgba(16, 185, 129, 0.2);
}

.btn-cancel {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.btn-cancel:hover {
  background: rgba(239, 68, 68, 0.2);
}

.btn-get-key {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.btn-get-key:hover {
  background: rgba(168, 85, 247, 0.2);
}
```

---

## 📦 **VERSION JAVASCRIPT VANILLA (Sans React)**

```html
<div id="api-key-manager" class="api-key-manager">
  <div class="api-key-status" id="key-status">
    <span id="provider-name">Google</span> API Key:
    <span id="status-indicator"></span>
  </div>

  <div class="api-key-actions" id="key-actions">
    <!-- Boutons injectés dynamiquement -->
  </div>
</div>

<script>
class APIKeyManager {
  constructor(providerId, providerName, getApiKeyLink) {
    this.providerId = providerId;
    this.providerName = providerName;
    this.getApiKeyLink = getApiKeyLink;
    this.isEditing = false;
    this.apiKey = this.loadApiKey();

    this.render();
  }

  loadApiKey() {
    const keys = JSON.parse(localStorage.getItem('apiKeys') || '{}');
    return keys[this.providerId] || '';
  }

  saveApiKey(key) {
    const keys = JSON.parse(localStorage.getItem('apiKeys') || '{}');
    keys[this.providerId] = key;
    localStorage.setItem('apiKeys', JSON.stringify(keys));
    this.apiKey = key;
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.render();
  }

  handleSave() {
    const input = document.getElementById('api-key-input');
    this.saveApiKey(input.value);
    this.isEditing = false;
    this.render();
  }

  handleCancel() {
    this.isEditing = false;
    this.render();
  }

  render() {
    const statusEl = document.getElementById('status-indicator');
    const actionsEl = document.getElementById('key-actions');

    // Update status
    if (this.apiKey) {
      statusEl.innerHTML = '<span style="color: #10b981;">✓ Set via UI</span>';
    } else {
      statusEl.innerHTML = '<span style="color: #ef4444;">✗ Not Set</span>';
    }

    // Update actions
    if (this.isEditing) {
      actionsEl.innerHTML = `
        <input
          type="password"
          id="api-key-input"
          class="api-key-input"
          placeholder="Enter API Key"
          value="${this.apiKey}"
        />
        <button class="btn-save" onclick="apiKeyManager.handleSave()">
          ✓ Save
        </button>
        <button class="btn-cancel" onclick="apiKeyManager.handleCancel()">
          ✗ Cancel
        </button>
      `;
      document.getElementById('api-key-input').focus();
    } else {
      actionsEl.innerHTML = `
        <button class="btn-edit" onclick="apiKeyManager.toggleEdit()">
          ✏️ Edit
        </button>
        ${!this.apiKey ? `
          <button class="btn-get-key" onclick="window.open('${this.getApiKeyLink}')">
            🔑 Get API Key
          </button>
        ` : ''}
      `;
    }
  }
}

// Initialisation
let apiKeyManager = new APIKeyManager(
  'google',
  'Google Gemini',
  'https://makersuite.google.com/app/apikey'
);

// Fonction à appeler quand le provider change
function updateApiKeyManager(providerId, providerName, getApiKeyLink) {
  apiKeyManager = new APIKeyManager(providerId, providerName, getApiKeyLink);
}
</script>
```

---

## 🎯 **EXEMPLE D'INTÉGRATION COMPLÈTE**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Chatbot avec API Key Manager</title>
  <link rel="stylesheet" href="api-key-manager.css">
</head>
<body>
  <div class="chatbot-settings">
    <h3>⚙️ Configuration Chatbot</h3>

    <!-- Sélecteur Provider -->
    <div class="setting-group">
      <label>Fournisseur IA</label>
      <select id="provider-select" onchange="handleProviderChange()">
        <option value="google">🌐 Google Gemini</option>
        <option value="openai">🤖 OpenAI GPT-4</option>
        <option value="anthropic">🧠 Claude</option>
        <option value="groq">⚡ Groq</option>
      </select>
    </div>

    <!-- API Key Manager -->
    <div id="api-key-manager" class="api-key-manager">
      <div class="api-key-status">
        <span id="provider-name">Google</span> API Key:
        <span id="status-indicator"></span>
      </div>
      <div id="key-actions"></div>
    </div>

    <!-- Sélecteur Modèle -->
    <div class="setting-group">
      <label>Modèle</label>
      <select id="model-select"></select>
    </div>
  </div>

  <script src="api-key-manager.js"></script>
  <script>
    const PROVIDERS = {
      google: {
        name: 'Google Gemini',
        link: 'https://makersuite.google.com/app/apikey',
        models: ['gemini-2.5-flash', 'gemini-pro']
      },
      openai: {
        name: 'OpenAI',
        link: 'https://platform.openai.com/api-keys',
        models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo']
      },
      anthropic: {
        name: 'Anthropic',
        link: 'https://console.anthropic.com/settings/keys',
        models: ['claude-3-5-sonnet', 'claude-3-opus']
      },
      groq: {
        name: 'Groq',
        link: 'https://console.groq.com/keys',
        models: ['llama-3.1-70b', 'llama-3.1-8b']
      }
    };

    let apiKeyManager = new APIKeyManager(
      'google',
      PROVIDERS.google.name,
      PROVIDERS.google.link
    );

    function handleProviderChange() {
      const select = document.getElementById('provider-select');
      const providerId = select.value;
      const provider = PROVIDERS[providerId];

      // Update API Key Manager
      apiKeyManager = new APIKeyManager(
        providerId,
        provider.name,
        provider.link
      );

      // Update models
      const modelSelect = document.getElementById('model-select');
      modelSelect.innerHTML = provider.models
        .map(m => `<option value="${m}">${m}</option>`)
        .join('');
    }

    // Initialize
    handleProviderChange();
  </script>
</body>
</html>
```

---

## ✅ **CHECKLIST POUR GENSPARK**

- [ ] Copier le composant `APIKeyManager`
- [ ] Ajouter le CSS
- [ ] Intégrer dans le chatbot
- [ ] Tester le crayon d'édition
- [ ] Vérifier sauvegarde dans cookies/localStorage
- [ ] Tester le bouton "Get API Key"
- [ ] Vérifier changement de provider

---

## 📋 **DÉPENDANCES NÉCESSAIRES**

```bash
npm install js-cookie
```

Ou en CDN :
```html
<script src="https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js"></script>
```

---

**TOUT EST PRÊT POUR GENSPARK !** 🚀

Ce document contient :
✅ Code React complet
✅ Version JavaScript vanilla
✅ Styles CSS
✅ Exemple d'intégration
✅ Système de stockage (cookies/localStorage)
✅ Vérification clé environnement

**Donnez ce fichier à votre développeur Genspark !**
