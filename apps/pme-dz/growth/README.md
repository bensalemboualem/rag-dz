# Growth Grid 📊

**Business Plan & Pitch Generator avec Intelligence Artificielle**

Plateforme professionnelle pour générer des business plans complets et des pitch decks optimisés pour le marché algérien.

---

## 🌟 Fonctionnalités

### ✅ Génération Automatique
- **Business plans complets** - 15-30 pages professionnelles
- **Pitch decks** - Présentations PowerPoint prêtes
- **IA avancée** - Claude (Anthropic) ou GPT-4 (OpenAI)
- **Adapté à l'Algérie** - Réglementation, fiscalité, marché DZ

### ✅ Interface Wizard
- **6 étapes guidées** - Parcours intuitif step-by-step
- **Templates sectoriels** - Tech, E-commerce, Food, Retail, Service, Education
- **Formulaires intelligents** - Validation et hints contextuels
- **Sauvegarde automatique** - Draft sauvegardé localement

### ✅ Personnalisation
- **3 langues** - Français, Arabe, Anglais
- **3 niveaux de détail** - Concis (5-10p), Standard (15-20p), Détaillé (25-30p)
- **Sections modulaires** - Choisir quelles sections inclure
- **Templates par secteur** - Contenu spécialisé par industrie

### ✅ Export Multi-formats
- **PDF** - Business plan imprimable
- **Word (DOCX)** - Éditable
- **PowerPoint (PPTX)** - Pitch deck slides
- **Email** - Envoi direct

---

## 🚀 Installation

### Prérequis
```bash
Python 3.9+
FastAPI
Anthropic API ou OpenAI API
```

### Backend
```bash
cd d:/IAFactory/rag-dz/backend/rag-compat

# Installer dépendances
pip install anthropic openai jinja2

# Ajouter au main.py
from app.routers import growth_grid
app.include_router(growth_grid.router)
```

### Configuration
```bash
# .env
ANTHROPIC_API_KEY=sk-ant-xxx...
OPENAI_API_KEY=sk-xxx...
```

---

## 📖 Utilisation

### 1. Accès Frontend
```
https://www.iafactoryalgeria.com/apps/growth-grid/frontend/
```

### 2. Workflow
1. **Sélectionner type de projet** - Tech, E-commerce, Food, etc.
2. **Remplir informations entreprise** - Nom, description, mission/vision
3. **Définir le marché** - Cible, concurrence, avantages
4. **Données financières** - Capital, revenus, charges
5. **Générer avec IA** - Choisir langue et niveau de détail
6. **Exporter** - PDF, Word, PowerPoint

### 3. API Usage
```python
import requests

# Générer business plan
response = requests.post(
    "https://www.iafactoryalgeria.com/api/growth-grid/generate",
    json={
        "projectType": "tech",
        "companyName": "TechStart DZ",
        "shortDescription": "Plateforme SaaS pour PME algériennes",
        "targetMarket": "PME algériennes de 5-50 employés",
        "initialCapital": 5000000,
        "language": "fr",
        "detailLevel": "standard"
    }
)

business_plan = response.json()
print(business_plan["content"])  # HTML content
```

---

## 🏗️ Architecture

### Frontend
```
/frontend/
  index.html          - Interface complète (wizard)

Structure:
- Header avec actions (Sauvegarder, Accueil)
- Sidebar avec 6 étapes
- Contenu principal dynamique
- Loading overlay pour génération
- Preview et export
```

### Backend
```
/backend/
  growth_grid_service.py    - Service génération IA

/backend/rag-compat/app/routers/
  growth_grid.py            - API FastAPI routes

Endpoints:
POST /api/growth-grid/generate     - Générer business plan
GET  /api/growth-grid/templates    - Liste templates
GET  /api/growth-grid/health       - Status service
POST /api/growth-grid/export/pdf   - Export PDF (TODO)
POST /api/growth-grid/export/docx  - Export DOCX (TODO)
POST /api/growth-grid/export/pptx  - Export PPTX (TODO)
```

### Templates
```
/templates/
  tech.html           - Template tech & IT
  ecommerce.html      - Template e-commerce
  food.html           - Template restauration
  retail.html         - Template commerce
  service.html        - Template services
  education.html      - Template éducation
```

---

## 🎨 Templates Sectoriels

### 1. Technologie & IT 💻
- SaaS, Applications, Web, IA
- Focus: Innovation, scalabilité, MVP
- Métriques: Users, MRR, churn rate

### 2. E-commerce 🛒
- Boutique en ligne, Marketplace
- Focus: Catalogue, logistique, paiements
- Métriques: GMV, panier moyen, taux conversion

### 3. Restauration 🍽️
- Restaurant, Café, Fast-food
- Focus: Menu, emplacement, team
- Métriques: Couverts/jour, ticket moyen

### 4. Commerce 🏪
- Boutique physique, Distribution
- Focus: Stock, emplacement, fournisseurs
- Métriques: Ventes/m², rotation stock

### 5. Services 🤝
- Consulting, Agence, B2B
- Focus: Expertise, clients, pricing
- Métriques: Taux utilisation, facturation

### 6. Éducation 🎓
- Formation, École, E-learning
- Focus: Programmes, certifications, pédagogie
- Métriques: Stagiaires, taux réussite

---

## 🤖 IA & Génération

### Providers supportés
1. **Claude (Anthropic)** - Recommandé
   - Modèle: claude-3-5-sonnet-20241022
   - Tokens: 4000-16000 selon niveau de détail
   - Température: 0.7

2. **GPT-4 (OpenAI)** - Alternative
   - Modèle: gpt-4-turbo-preview
   - Tokens: 4000-16000 selon niveau de détail
   - Température: 0.7

3. **Fallback Templates** - Sans IA
   - Templates statiques pré-remplis
   - Substitution de variables
   - Moins personnalisé mais rapide

### Prompt Engineering
Le système utilise des prompts optimisés pour:
- Contexte algérien (réglementation, fiscalité, culture)
- Données réalistes pour le marché DZ
- Conseils sectoriels spécifiques
- Format HTML structuré

---

## 📊 Sections du Business Plan

1. **Executive Summary** - Résumé exécutif (1-2 pages)
2. **Présentation de l'entreprise** - Histoire, mission, vision, valeurs
3. **Produits et services** - Offre détaillée, proposition de valeur unique
4. **Analyse du marché** - Taille, tendances, segmentation, opportunités
5. **Analyse concurrentielle** - Concurrents directs/indirects, positionnement
6. **Stratégie marketing** - Mix 4P, canaux d'acquisition, pricing
7. **Plan opérationnel** - Processus, ressources, fournisseurs, supply chain
8. **Équipe et organisation** - Structure, profils clés, recrutement, culture
9. **Plan financier** - Prévisions 3 ans, compte de résultat, bilan, trésorerie, ratios
10. **Risques et mitigation** - Risques identifiés, stratégies de mitigation, plan B

---

## 💰 Modèle Financier

### Prévisions incluses
- **Compte de résultat prévisionnel** - 3 ans
- **Plan de trésorerie** - 12-36 mois
- **Bilan prévisionnel** - 3 ans
- **Seuil de rentabilité** - Break-even analysis
- **Ratios financiers** - ROI, marge, liquidité

### Métriques selon secteur
- **Tech**: MRR, ARR, CAC, LTV, Churn
- **E-commerce**: GMV, AOV, Conversion rate
- **Food**: Couverts/jour, Ticket moyen
- **Retail**: Ventes/m², Rotation stock
- **Service**: Taux utilisation, Facturation/consultant

---

## 🌍 Adaptation Marché Algérien

### Réglementation DZ
- Formes juridiques (EURL, SARL, SPA, SAS)
- Fiscalité algérienne (IBS, TAP, TVA)
- ANSEJ, ANGEM, CNAC (dispositifs d'aide)
- Registre de commerce

### Données locales
- Taille du marché algérien
- Pouvoir d'achat (DZD)
- Tendances sectorielles
- Barrières à l'entrée

### Culture business
- Négociation et relations
- Timing et patience
- Réseau et recommandations
- Adaptation produits/services

---

## 🎯 Roadmap

### ✅ Phase 1 (Actuel)
- Interface wizard complète
- Génération IA avec Claude/GPT
- Templates 6 secteurs
- API REST FastAPI

### 🚧 Phase 2 (Q1 2025)
- Export PDF avec WeasyPrint
- Export DOCX avec python-docx
- Export PPTX avec python-pptx
- Envoi email automatique

### 🚧 Phase 3 (Q2 2025)
- Éditeur WYSIWYG intégré
- Graphiques et charts automatiques
- Analyse financière avancée
- Comparaison avec benchmarks sectoriels

### 🚧 Phase 4 (Q3 2025)
- Collaboration multi-users
- Versioning et historique
- Templates personnalisables
- Intégration comptabilité

---

## 📞 Support

- **Email**: support@iafactoryalgeria.com
- **Docs**: https://www.iafactoryalgeria.com/docs/growth-grid
- **API**: https://www.iafactoryalgeria.com/api/docs#/growth-grid

---

## 📄 License

Propriétaire - IAFactory Algeria © 2025

---

**Growth Grid** - Transformez vos idées en business plans professionnels avec l'IA 🚀
