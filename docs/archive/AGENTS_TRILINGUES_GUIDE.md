# AGENTS IA TRILINGUES - IAFactory Algeria
## Guide d'intégration Streamlit i18n

---

## 🎯 OBJECTIF

Rendre TOUS les **18 agents IA Streamlit** trilingues :
- 🇫🇷 **Français** (professionnel)
- 🇬🇧 **English** (professionnel)
- 🇩🇿 **العربية** (professionnel + RTL)

---

## 📋 LISTE DES AGENTS À INTÉGRER

### Phase 1 - Premium HTTPS (5 agents)
1. **AI Consultant** (9101) - `ai-agents/ai_consultant_agent/`
2. **Customer Support** (9102) - `ai-agents/ai_customer_support_agent/`
3. **Data Analysis** (9103) - `ai-agents/data-analyst-agent/`
4. **RAG as Service** (9110) - `ai-agents/rag-apps/rag_as_service/`
5. **Investment AI** (9114) - `agents/investment_agent.py`

### Phase 2 - Business (5 agents)
6. **XAI Finance** (9104) - `ai-agents/xai_finance/`
7. **Meeting Prep** (9105) - `ai-agents/meeting-prep-agent/`
8. **News Journalist** (9106) - `ai-agents/news-journalist-agent/`
9. **Web Scraping** (9107) - `ai-agents/web-scraping-agent/`
10. **Product Launch** (9108) - `ai-agents/product-launch-agent/`

### Phase 3 - RAG Apps (5 agents)
11. **Local RAG** (9109) - `ai-agents/rag-apps/local_rag_agent/`
12. **Agentic RAG** (9111) - `ai-agents/rag-apps/agentic_rag_with_reasoning/`
13. **Hybrid Search** (9112) - `ai-agents/rag-apps/hybrid_search_agent/`
14. **Autonomous RAG** (9113) - `ai-agents/rag-apps/autonomous_rag/`
15. **RAG as Service** (9110) - déjà fait

### Phase 4 - Finance & Startups (3 agents)
16. **Financial Coach** (9115) - `ai-agents/finance-startups/ai_financial_coach_agent/`
17. **Startup Trends** (9116) - `ai-agents/finance-startups/ai_startup_trend_analysis_agent/`
18. **System Architect** (9117) - `ai-agents/software-dev/ai_system_architect_agent/`
19. **Deep Research** (9118) - `ai-agents/ai-research-agents/deep_research_agent/`

---

## 🚀 INTÉGRATION RAPIDE (3 ÉTAPES)

### Étape 1: Copier le module i18n

```bash
# Dans chaque dossier d'agent, créer shared/
mkdir -p /app/shared
cp /opt/iafactory-rag-dz/shared/streamlit_i18n.py /app/shared/
```

### Étape 2: Modifier le fichier principal de l'agent

**AVANT** (exemple - AI Consultant):
```python
import streamlit as st
from ai_consultant_agent import root_agent

st.set_page_config(page_title="AI Consultant", page_icon="🤖")
st.title("🤖 AI Business Consultant")

# Reste du code...
```

**APRÈS** (avec i18n):
```python
import streamlit as st
import sys
sys.path.append('/app/shared')

from streamlit_i18n import get_i18n, render_header, inject_custom_css
from ai_consultant_agent import root_agent

# Configuration
st.set_page_config(
    page_title="IAFactory Algeria - AI Consultant",
    page_icon="🇩🇿",
    layout="wide"
)

# Obtenir i18n
i18n = get_i18n()

# Header trilingue avec sélecteur de langue
render_header("consultant")

# Votre code existant avec traductions
user_input = st.text_input(i18n.t("common.input_placeholder"))

if st.button(i18n.t("common.send")):
    # Votre logique...
    pass

# Sidebar trilingue
with st.sidebar:
    i18n.language_selector()
```

### Étape 3: Rebuild le conteneur

```bash
# Sur le VPS
cd /opt/iafactory-rag-dz
docker-compose -f docker-compose-ai-agents.yml build ai-consultant
docker restart iaf-ai-consultant-prod
```

---

## 📝 EXEMPLES COMPLETS

### Exemple 1: Agent simple (Customer Support)

```python
import streamlit as st
import sys
sys.path.append('/app/shared')

from streamlit_i18n import get_i18n, render_header

st.set_page_config(page_title="Customer Support", page_icon="🇩🇿", layout="wide")

i18n = get_i18n()
render_header("support")

# Chat interface trilingue
if "messages" not in st.session_state:
    st.session_state.messages = []

# Afficher historique
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# Input utilisateur
if prompt := st.chat_input(i18n.t("common.input_placeholder")):
    st.session_state.messages.append({"role": "user", "content": prompt})

    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        with st.spinner(i18n.t("common.thinking")):
            # Votre logique AI ici
            response = your_ai_function(prompt)
            st.markdown(response)
            st.session_state.messages.append({"role": "assistant", "content": response})

# Sidebar
with st.sidebar:
    if st.button(i18n.t("common.new_chat")):
        st.session_state.messages = []
        st.rerun()

    i18n.language_selector()
```

### Exemple 2: Agent avec upload (Data Analysis)

```python
import streamlit as st
import sys
sys.path.append('/app/shared')

from streamlit_i18n import get_i18n, render_header

st.set_page_config(page_title="Data Analysis", page_icon="🇩🇿", layout="wide")

i18n = get_i18n()
render_header("data_analysis")

# File uploader trilingue
uploaded_file = st.file_uploader(
    i18n.t("data_analysis.upload_data"),
    type=['csv', 'xlsx', 'json']
)

if uploaded_file:
    st.success(f"✅ {i18n.t('common.success')}")

    # Analyse
    if st.button(i18n.t("common.analyze")):
        with st.spinner(i18n.t("common.processing")):
            # Votre logique d'analyse
            results = analyze_data(uploaded_file)
            st.write(results)

# Sidebar
with st.sidebar:
    st.markdown(f"### {i18n.t('sidebar.settings')}")
    i18n.language_selector()
```

### Exemple 3: Agent RAG (Local RAG)

```python
import streamlit as st
import sys
sys.path.append('/app/shared')

from streamlit_i18n import get_i18n, render_header

st.set_page_config(page_title="Local RAG", page_icon="🇩🇿", layout="wide")

i18n = get_i18n()
render_header("rag")

# Upload document
col1, col2 = st.columns([3, 1])

with col1:
    doc_file = st.file_uploader(
        i18n.t("rag.upload_doc"),
        type=['pdf', 'txt', 'docx']
    )

with col2:
    if st.button(i18n.t("common.process")):
        # Process document
        pass

# Search interface
st.markdown(f"### {i18n.t('rag.search')}")

query = st.text_input(i18n.t("common.input_placeholder"))

if st.button(i18n.t("common.search")):
    with st.spinner(i18n.t("common.thinking")):
        # RAG search
        results = rag_search(query)
        st.write(results)

# Sidebar
with st.sidebar:
    i18n.language_selector()
```

---

## 🔧 DOCKERFILE MODIFICATION

Pour chaque agent, modifier le `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Copier requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code de l'agent
COPY . .

# Créer dossier shared
RUN mkdir -p /app/shared

# Copier le module i18n (sera fait lors du build)
COPY --from=shared /app/shared/streamlit_i18n.py /app/shared/

EXPOSE 8501

CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
```

Ou plus simple, monter le volume shared:

```yaml
# Dans docker-compose
volumes:
  - ./shared:/app/shared:ro
```

---

## 🎨 PERSONNALISATION PAR AGENT

### Ajouter des traductions spécifiques

Modifier `shared/streamlit_i18n.py`, section `TRANSLATIONS`:

```python
TRANSLATIONS = {
    # ... traductions existantes ...

    "mon_agent": {
        "title": {
            "fr": "Mon Agent Spécial",
            "en": "My Special Agent",
            "ar": "وكيلي الخاص"
        },
        "custom_button": {
            "fr": "Action Spéciale",
            "en": "Special Action",
            "ar": "إجراء خاص"
        }
    }
}
```

Utiliser dans l'agent:

```python
st.title(i18n.t("mon_agent.title"))
if st.button(i18n.t("mon_agent.custom_button")):
    # Action...
    pass
```

---

## 🚀 DÉPLOIEMENT AUTOMATIQUE

### Script de déploiement masse

```python
#!/usr/bin/env python3
"""
Intégrer i18n dans tous les agents automatiquement
"""

import os
import shutil
from pathlib import Path

AGENTS = [
    "ai-agents/ai_consultant_agent",
    "ai-agents/ai_customer_support_agent",
    "ai-agents/data-analyst-agent",
    # ... liste complète
]

def integrate_agent(agent_path):
    """Intégrer i18n dans un agent"""
    agent_dir = Path(agent_path)

    # 1. Créer dossier shared
    shared_dir = agent_dir / "shared"
    shared_dir.mkdir(exist_ok=True)

    # 2. Copier streamlit_i18n.py
    shutil.copy(
        "shared/streamlit_i18n.py",
        shared_dir / "streamlit_i18n.py"
    )

    # 3. Trouver le fichier principal
    main_files = list(agent_dir.glob("*.py"))
    if main_files:
        main_file = main_files[0]

        # Lire le contenu
        with open(main_file) as f:
            content = f.read()

        # Ajouter imports si pas présents
        if "streamlit_i18n" not in content:
            imports = """
import sys
sys.path.append('/app/shared')
from streamlit_i18n import get_i18n, render_header
"""
            content = imports + content

            with open(main_file, 'w') as f:
                f.write(content)

    print(f"✅ {agent_path} intégré")

# Intégrer tous les agents
for agent in AGENTS:
    integrate_agent(agent)

print("\n🎉 Tous les agents sont maintenant trilingues!")
```

---

## 📊 RÉSUMÉ

### Ce qui a été créé

1. ✅ **Module Python i18n** ([shared/streamlit_i18n.py](../shared/streamlit_i18n.py))
   - Traductions FR/AR/EN
   - Classe StreamlitI18n
   - Fonctions helpers (render_header, inject_custom_css)
   - Support RTL automatique

2. ✅ **CSS harmonisé** pour Streamlit
   - Palette IAFactory (vert algérien #00a651)
   - Dark mode par défaut
   - Composants stylisés

3. ✅ **Sélecteur de langue** intégré
   - Sidebar + Header options
   - Changement instantané avec st.rerun()

### Intégration requise

- **18 agents** à intégrer manuellement
- Temps estimé: **30-60 min** par agent
- Ou utiliser script automatique (15 min total)

### Prochaines étapes

1. Copier `streamlit_i18n.py` dans les agents
2. Modifier les fichiers principaux
3. Rebuild les conteneurs
4. Tester en FR/AR/EN

---

## 🎯 EXEMPLE COMPLET PRODUCTION

### Agent "AI Consultant" trilingue final

**Structure:**
```
ai_consultant_agent/
├── shared/
│   └── streamlit_i18n.py
├── consultant_ui.py (main)
├── ai_consultant_agent.py (logic)
├── requirements.txt
└── Dockerfile
```

**consultant_ui.py:**
```python
import streamlit as st
import sys
sys.path.append('/app/shared')

from streamlit_i18n import get_i18n, render_header, inject_custom_css
from ai_consultant_agent import root_agent

# Config
st.set_page_config(
    page_title="IAFactory - AI Consultant",
    page_icon="🇩🇿",
    layout="wide"
)

# i18n
i18n = get_i18n()
inject_custom_css()
render_header("consultant")

# State
if "messages" not in st.session_state:
    st.session_state.messages = []

# Chat history
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# Input
if prompt := st.chat_input(i18n.t("common.input_placeholder")):
    st.session_state.messages.append({"role": "user", "content": prompt})

    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        with st.spinner(i18n.t("common.thinking")):
            try:
                result = root_agent.run(prompt)

                if hasattr(result, "output"):
                    answer = result.output
                else:
                    answer = str(result)

                st.markdown(answer)
                st.session_state.messages.append({
                    "role": "assistant",
                    "content": answer
                })
            except Exception as e:
                st.error(f"{i18n.t('common.error')}: {str(e)}")

# Sidebar
with st.sidebar:
    if st.button(i18n.t("common.new_chat")):
        st.session_state.messages = []
        st.rerun()

    st.markdown("---")
    i18n.language_selector()

    st.markdown("---")
    st.markdown(f"**{i18n.t('common.about')}**")
    st.markdown(i18n.t("consultant.description"))
```

---

**🇩🇿 IAFactory Algeria - Intelligence Artificielle Made in Algeria**
**Français | English | العربية**
