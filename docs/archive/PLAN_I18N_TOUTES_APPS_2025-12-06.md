# 🌍 PLAN I18N - TOUTES LES 58 APPLICATIONS

**Date**: 6 décembre 2025 - 23:50
**Objectif**: Appliquer FR/AR/EN dans TOUTES les applications IAFactory
**Apps concernées**: 58 applications + agents

---

## 📊 ÉTAT ACTUEL

### ✅ FAIT
- [x] Landing page principale (`apps/landing/`) - 96 data-i18n
- [x] Section PRO (12 solutions) - traduite
- [x] Fichier JS centralisé (`shared/iafactory-i18n.js`)

### ❌ À FAIRE
- [ ] 57 autres applications
- [ ] Streamlit apps (ia-agents/)
- [ ] React apps (frontend/)

---

## 🎯 STRATÉGIE GLOBALE

### Phase 1: Applications Prioritaires (7 apps - 48h)

**TIER 1 - Impact Maximum** (apps avec utilisateurs actifs):
1. **PME Copilot** (`apps/pme-copilot/`, `apps/pme-copilot-ui/`)
2. **CRM IA** (`apps/crm-ia/`, `apps/crm-ia-ui/`)
3. **StartupDZ** (`apps/startup-dz/`, `apps/startupdz-onboarding-ui/`)
4. **BMAD** (`apps/bmad/`)
5. **Council** (`apps/council/`)
6. **Ithy** (`apps/ithy/`)
7. **Voice Assistant** (`apps/voice-assistant/`)

**Action**: Ajouter manuellement le système i18n à ces 7 apps

### Phase 2: Applications Streamlit (15 apps - 72h)

**Méthode**: Script Python automatique qui:
1. Parcourt tous les fichiers `.py` Streamlit
2. Ajoute `import streamlit_i18n` en haut
3. Remplace les textes hardcodés par `t("cle")`
4. Génère les fichiers de traduction

**Apps Streamlit**:
- `ia-agents/chat-pdf/`
- `ia-agents/local-rag/`
- `ia-agents/finance-agent/`
- `ia-agents/voice-support/`
- Toutes les apps Streamlit dans `apps/` (agri-dz, clinique-dz, etc.)

### Phase 3: Applications HTML Statiques (20 apps - 7 jours)

**Méthode**: Template HTML avec i18n préconfiguré
- Copier `shared/iafactory-i18n.js` dans chaque app
- Ajouter language switcher dans header
- Ajouter data-i18n sur les éléments principaux

**Apps HTML**:
- `apps/api-portal/`
- `apps/developer/`
- `apps/dev-portal/`
- `apps/dashboard/`
- Etc.

### Phase 4: Applications React/Vite (15 apps - 14 jours)

**Méthode**: react-i18next ou système custom
- Créer context provider i18n
- Utiliser hook `useTranslation()`
- Fichiers de traduction JSON

**Apps React**:
- `frontend/archon-ui/`
- `frontend/rag-ui/`
- Apps UI existantes

---

## 🛠️ OUTILS AUTOMATISÉS

### 1. Script d'Intégration Streamlit

```python
#!/usr/bin/env python3
"""
Intègre automatiquement i18n dans les apps Streamlit
"""
import os
import re
from pathlib import Path

def add_i18n_to_streamlit(app_dir):
    """Ajoute i18n à une app Streamlit"""
    for py_file in Path(app_dir).rglob("*.py"):
        content = py_file.read_text(encoding='utf-8')

        # Ajouter import si absent
        if 'streamlit_i18n' not in content:
            content = 'from shared.streamlit_i18n import t, get_lang_direction\n' + content

        # Remplacer st.title("Texte") par st.title(t("key"))
        # TODO: Implémenter remplacement intelligent

        py_file.write_text(content, encoding='utf-8')
        print(f"✅ {py_file}")

# Usage
for app in ['chat-pdf', 'local-rag', 'finance-agent']:
    add_i18n_to_streamlit(f'ia-agents/{app}/')
```

### 2. Template HTML avec i18n

Fichier `shared/template-app-i18n.html`:
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-i18n="app_title">Nom Application</title>

    <!-- i18n System -->
    <script src="/shared/iafactory-i18n.js"></script>

    <style>
        /* Include CSS RTL support */
        body.rtl { direction: rtl; text-align: right; }
    </style>
</head>
<body>
    <header>
        <h1 data-i18n="app_name">Nom de l'App</h1>

        <!-- Language Switcher -->
        <div class="language-switcher">
            <button class="lang-btn active" data-lang="fr">FR</button>
            <button class="lang-btn" data-lang="ar">AR</button>
            <button class="lang-btn" data-lang="en">EN</button>
        </div>
    </header>

    <main>
        <p data-i18n="welcome_message">Bienvenue dans l'application</p>
        <!-- App content -->
    </main>

    <script>
        // Traductions spécifiques à cette app
        IAFactoryI18n.addTranslations({
            "app_title": { fr: "Mon App", ar: "تطبيقي", en: "My App" },
            "app_name": { fr: "Mon Application", ar: "تطبيقي", en: "My Application" },
            "welcome_message": { fr: "Bienvenue", ar: "مرحبا", en: "Welcome" }
        });
    </script>
</body>
</html>
```

### 3. Script Migration Masse

```bash
#!/bin/bash
# migrate-all-apps.sh

APPS=(
    "pme-copilot" "crm-ia" "startup-dz"
    "bmad" "council" "ithy"
)

for app in "${APPS[@]}"; do
    echo "=== Processing $app ==="

    # Copier fichier i18n
    cp shared/iafactory-i18n.js "apps/$app/"

    # Ajouter language switcher (à implémenter)
    python scripts/add-lang-switcher.py "apps/$app/index.html"

    # Upload vers VPS
    scp -r "apps/$app/" root@46.224.3.125:/opt/iafactory-rag-dz/apps/

    echo "✅ $app migré"
done
```

---

## 📋 CHECKLIST PAR APP

Pour chaque application, vérifier:

- [ ] Fichier `iafactory-i18n.js` inclus
- [ ] Language switcher visible dans header
- [ ] Attributs `data-i18n` sur éléments clés
- [ ] Traductions FR/AR/EN complètes
- [ ] Support RTL testé (arabe)
- [ ] Préférence langue sauvegardée
- [ ] Testé sur mobile

---

## ⏱️ TIMELINE ESTIMÉE

| Phase | Apps | Durée | Deadline |
|-------|------|-------|----------|
| Phase 1: Apps Prioritaires | 7 | 48h | 8 déc 2025 |
| Phase 2: Streamlit | 15 | 72h | 11 déc 2025 |
| Phase 3: HTML Statiques | 20 | 7j | 18 déc 2025 |
| Phase 4: React/Vite | 15 | 14j | 1 jan 2026 |
| **TOTAL** | **57** | **26 jours** | **1 jan 2026** |

---

## 🚀 DÉMARRAGE IMMÉDIAT

### Action 1: Upload fichier i18n centralisé

```bash
scp shared/iafactory-i18n.js root@46.224.3.125:/opt/iafactory-rag-dz/shared/
```

### Action 2: Tester sur PME Copilot (première app pilote)

```bash
# 1. Copier template
cp shared/template-app-i18n.html apps/pme-copilot/index.html

# 2. Ajouter traductions spécifiques PME
# (éditer manuellement pour ajouter clés métier)

# 3. Upload
scp apps/pme-copilot/index.html root@46.224.3.125:/opt/iafactory-rag-dz/apps/pme-copilot/

# 4. Tester
curl -I https://www.iafactoryalgeria.com/pme-copilot/
```

### Action 3: Valider avec utilisateur

Une fois PME Copilot fonctionnel en 3 langues:
- Montrer à l'utilisateur
- Valider approche
- Reproduire sur les 56 autres apps

---

## 💡 OPTIMISATIONS POSSIBLES

### Option A: Traduction Automatique IA

Utiliser OpenAI/Anthropic pour générer les traductions automatiquement:

```python
def translate_with_ai(text, target_lang):
    """Traduit un texte avec GPT-4"""
    prompt = f"Translate to {target_lang}: {text}"
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content
```

### Option B: Fichiers JSON Centralisés

Au lieu de dupliquer les traductions dans chaque app:

```
shared/i18n/
  ├── common.json     # Traductions communes
  ├── pme.json        # Traductions PME Copilot
  ├── crm.json        # Traductions CRM
  └── ...
```

Charger dynamiquement:
```javascript
fetch('/shared/i18n/pme.json')
    .then(r => r.json())
    .then(translations => IAFactoryI18n.addTranslations(translations));
```

### Option C: Interface Admin de Traductions

Créer une app dédiée pour gérer toutes les traductions:
- URL: `https://www.iafactoryalgeria.com/i18n-admin/`
- Liste toutes les clés
- Permet d'éditer FR/AR/EN
- Export JSON
- Auto-deploy sur save

---

## 📞 SUPPORT TECHNIQUE

### Ressources
- **Fichier central**: `shared/iafactory-i18n.js`
- **Template**: `shared/template-app-i18n.html`
- **Python helper**: `shared/streamlit_i18n.py`

### Problèmes fréquents

**Q: Traduction ne s'affiche pas**
R: Vérifier que `data-i18n="key"` est présent ET que la clé existe dans `translations{}`

**Q: RTL ne fonctionne pas**
R: Vérifier que CSS `.rtl { direction: rtl; }` est présent

**Q: Langue ne se sauvegarde pas**
R: Vérifier localStorage n'est pas bloqué (cookies tiers)

---

## ✅ VALIDATION FINALE

Quand toutes les 58 apps seront migrées:

- [ ] Tester chaque app en FR/AR/EN
- [ ] Vérifier RTL sur mobile
- [ ] Documenter dans README de chaque app
- [ ] Créer vidéo tutoriel changement langue
- [ ] Annoncer sur landing page: "58 apps multilingues"

---

**Créé**: 6 décembre 2025 - 23:55
**Auteur**: Claude Code
**Status**: 🟡 EN COURS - Phase 1 à démarrer
**Objectif**: 100% des apps en 3 langues avant 1er janvier 2026
