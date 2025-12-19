# 🤖 AGENTS IA - PLAN MASTER (3 AGENTS)

**Date**: 2025-12-15
**Projet**: IAFactory - Agents IA Algérie
**Status Global**: Agent #1 complet ✅, Plans #2 & #3 créés ✅

---

## 📊 VUE D'ENSEMBLE

| Agent | Nom | Public | Status | Temps Dev | Premium |
|-------|-----|--------|--------|-----------|---------|
| **#1** | Coach Motivation (Amine) | Tout public | ✅ 100% COMPLET | - | 2000 DA/mois |
| **#2** | Dev Helper (DevBot) | Développeurs | 📋 Planifié | 4-5h | 3000 DA/mois |
| **#3** | Tuteur Maths (Prof. Karim) | Élèves | 📋 Planifié | 5-6h | 2500 DA/mois |

**Temps total estimé**: 10-12 heures pour les 3 agents (en réutilisant la base)

---

## 🎯 AGENT #1: COACH MOTIVATION (AMINE) ✅

### Concept
Assistant bien-être et développement personnel pour aider avec stress, motivation, productivité, objectifs.

### Status: COMPLET ✅
- ✅ 23 fichiers créés
- ✅ System prompt complet (1500+ lignes)
- ✅ 8 composants React interactifs
- ✅ Chat streaming avec Claude 3.5 Sonnet
- ✅ Gamification (mood, streaks, achievements)
- ✅ Usage limits 10 msgs/jour + lead capture
- ✅ Responsive + dark mode

### Fonctionnalités principales
- 💬 Chat avec streaming AI
- 😊 Mood Tracker quotidien
- 🔥 Streak Counter (jours consécutifs)
- 🧘 Breathing Exercise (4-7-8 technique)
- 🏆 Achievement Badges (5 badges)
- 📊 Usage Limit Banner
- 📧 Lead Capture Modal (Premium)

### Technologies
- Next.js 14 + TypeScript + Tailwind
- Vercel AI SDK
- Claude 3.5 Sonnet (Anthropic)
- localStorage pour persistence

### Fichiers
Location: `D:\IAFactory\rag-dz\apps\agents-ia\`
Documentation: `AGENT_MOTIVATION_STATUS.md`
Guide démarrage: `START.md`

### Prochaine étape
```bash
cd D:\IAFactory\rag-dz\apps\agents-ia
npm install
copy .env.local.example .env.local
# Ajouter ANTHROPIC_API_KEY
npm run dev
# http://localhost:3001
```

---

## 💻 AGENT #2: DEV HELPER (DEVBOT) 📋

### Concept
Assistant développeur pour debugging, explications de code, optimisations, documentation.

### Status: PLANIFIÉ
Documentation complète: `AGENT_DEV_HELPER_PLAN.md`

### Fonctionnalités principales
- 🐛 **Debugging Assistant**: Analyser erreurs, suggérer solutions
- 📖 **Code Explainer**: Expliquer code ligne par ligne
- ⚡ **Code Optimizer**: Détecter anti-patterns, suggérer refactoring
- 📝 **Documentation Generator**: JSDoc, README, commentaires
- 💡 **Quick Snippets**: Bibliothèque snippets courants

### Interface unique
- **Sidebar gauche**: Code Snippets Library (React, Node, Python, Utils)
- **Centre**: Chat avec syntax highlighting
- **Sidebar droite**: Quick Actions (Fix Bug, Explain, Optimize) + Dev Stats

### Technologies additionnelles
- `react-syntax-highlighter` pour code highlighting
- Support multi-langages (JS, Python, HTML, CSS, SQL)
- Templates de code prêts à copier

### Persona: DevBot
- Senior dev sympathique, pragmatique, pédagogue
- Ton technique mais accessible
- Blagues de dev occasionnelles
- Focus stack moderne (React, Next.js, Python, Node.js)
- Contexte algérien (connexion, outils gratuits)

### Différenciateurs vs Agent #1
- Code blocks avec syntax highlighting (essentiel)
- Bibliothèque snippets organisée
- Quick actions pré-remplissant le chat
- Stats basés sur bugs fixed vs mood
- Prix premium plus élevé (3000 DA)

### Temps estimé: 4-5 heures

---

## 📐 AGENT #3: TUTEUR MATHS (PROF. KARIM) 📋

### Concept
Tuteur de mathématiques pour élèves algériens (collège, lycée, université 1A).
Préparation examens BEM et BAC.

### Status: PLANIFIÉ
Documentation complète: `AGENT_TUTEUR_MATHS_PLAN.md`

### Fonctionnalités principales
- 📖 **Explications de Concepts**: Définitions, analogies, visualisations
- ✍️ **Résolution d'Exercices**: Étape par étape avec explications
- 🎯 **Préparation Examens**: BEM, BAC - méthodologie et exercices types
- 🔢 **Calculatrice Interactive**: Résolution équations, simplification fractions
- 📐 **Formules & Théorèmes**: Bibliothèque complète avec exemples

### Interface unique
- **Sidebar gauche**: Formula Library (Géométrie, Algèbre, Analyse)
- **Centre**: Chat avec formulas LaTeX rendering
- **Sidebar droite**: Level Selector (Collège/Lycée/Université) + Calculator

### Technologies additionnelles
- `katex` ou `mathjax` pour rendu LaTeX
- `mathjs` pour calculs mathématiques
- Support inline math: $x^2$ et display math: $$\int_0^1 x^2 dx$$

### Programme couvert
**Collège (CEM)**:
- 1AM-2AM: Nombres, fractions, géométrie plane
- 3AM-4AM: Relatifs, équations, Pythagore, **préparation BEM**

**Lycée (Secondaire)**:
- 1AS: Calcul, équations, vecteurs, fonctions affines
- 2AS: Fonctions, dérivation, suites, probabilités
- 3AS: Analyse complète, intégrales, complexes, **préparation BAC**

**Université (1A)**: Analyse, algèbre linéaire, équations différentielles

### Persona: Prof. Karim
- Professeur passionné, patient, pédagogue
- 35 ans, style jeune prof cool mais compétent
- Ton encourageant, clair, structuré
- Utilise exemples concrets algériens (DA, villes, distances)
- Philosophie: "Chaque erreur est une opportunité d'apprendre"

### Méthode pédagogique (6 étapes)
1. Comprendre la question
2. Rappeler le concept
3. Décomposer en étapes
4. Résoudre ensemble
5. Vérifier le résultat
6. Généraliser (méthode à retenir)

### Différenciateurs vs Agents #1 & #2
- Rendu LaTeX pour formules mathématiques (critique)
- Bibliothèque 50+ formules organisées
- Sélecteur de niveau adapte le vocabulaire
- Exercices générés aléatoirement
- Focus examens algériens (BEM, BAC)
- Pack Familial disponible (5000 DA/mois)

### Temps estimé: 5-6 heures

---

## 🏗️ ARCHITECTURE COMMUNE (DRY)

### Components réutilisables entre agents

| Component | Agent #1 | Agent #2 | Agent #3 | Adaptations |
|-----------|----------|----------|----------|-------------|
| ChatInterface | ✅ | ✅ | ✅ | Style + code/math rendering |
| MessageBubble | ✅ | ✅ | ✅ | Avatar + colors |
| TypingIndicator | ✅ | ✅ | ✅ | Aucune |
| UsageLimitBanner | ✅ | ✅ | ✅ | Texte seulement |
| LeadCaptureModal | ✅ | ✅ | ✅ | Prix + benefits |
| useUsageLimit hook | ✅ | ✅ | ✅ | Aucune |

### System Prompt Template
```typescript
// Base structure commune
export const SYSTEM_PROMPT = `Tu es [NOM], [RÔLE].

## IDENTITÉ
- Nom:
- Rôle:
- Expertise:
- Ton:

## MISSION
Aider [PUBLIC] à:
1. ...

## APPROCHE (X étapes)
...

## DOMAINES D'EXPERTISE
...

## EXEMPLES DE CONVERSATIONS
...

## LIMITES & REDIRECTIONS
...

## RÈGLES IMPORTANTES
...

## TON & STYLE
...
`;
```

### Styles Tailwind réutilisables
- Layouts 3 colonnes (adaptable)
- Cards (`.card`)
- Buttons (`.btn-primary`, `.btn-secondary`)
- Inputs (`.input-field`)
- Animations (fade-in, slide-up, pulse-slow)

---

## 📈 ROADMAP DE DÉVELOPPEMENT

### Phase 1: COMPLETÉE ✅
- ✅ Agent #1 (Amine) - 100% fonctionnel
- ✅ Base architecture réutilisable
- ✅ Design system établi
- ✅ Patterns de code définis

### Phase 2: PLANIFICATION ✅
- ✅ Plan détaillé Agent #2 (DevBot)
- ✅ Plan détaillé Agent #3 (Prof. Karim)
- ✅ Architecture commune documentée

### Phase 3: DÉVELOPPEMENT (À venir)
**Ordre suggéré**:

1. **Agent #2: DevBot** (4-5h)
   - Plus simple techniquement
   - Réutilise presque tout d'Agent #1
   - Ajoute juste syntax highlighting
   - Public (développeurs) plus facile à monétiser

2. **Agent #3: Prof. Karim** (5-6h)
   - Plus complexe (LaTeX rendering)
   - Public plus large (élèves)
   - Potentiel viral important (BEM/BAC)

**Total Phase 3**: 10-12 heures

### Phase 4: TESTS & POLISH (À venir)
- Tests E2E des 3 agents
- Responsive mobile
- Performance optimization
- SEO pour chaque agent
- Analytics intégrées

### Phase 5: DÉPLOIEMENT (À venir)
- VPS setup
- NGINX configuration
- SSL certificates
- Monitoring
- Backup strategy

### Phase 6: MARKETING (À venir)
- Landing pages agents
- Social media (Facebook, Instagram)
- Ads ciblées
- Partenariats écoles/universités

---

## 💰 BUSINESS MODEL COMPLET

### Free Tiers (Acquisition)
- 10 questions/jour par agent
- Fonctionnalités de base
- Lead capture après limite
- Email pour contact premium

### Premium Individual
- **Amine Premium**: 2000 DA/mois - Motivation illimitée
- **DevBot Premium**: 3000 DA/mois - Coding illimité
- **Prof. Karim Premium**: 2500 DA/mois - Maths illimitées

### Bundles (Plus attractifs)
- **Pack Étudiant** (Amine + Prof. Karim): 4000 DA/mois (500 DA économie)
- **Pack Dev** (Amine + DevBot): 4500 DA/mois (500 DA économie)
- **Pack Complet** (3 agents): 6500 DA/mois (1000 DA économie)

### Pack Familial (Prof. Karim)
- 5000 DA/mois pour 3 comptes élèves
- Tableau de bord parent
- Rapports de progrès

### Projections (conservatrices)
**Objectif 100 clients premium en 6 mois**:

| Segment | Clients | Prix moyen | Revenue mensuel |
|---------|---------|------------|-----------------|
| Amine seul | 30 | 2000 DA | 60 000 DA |
| DevBot seul | 20 | 3000 DA | 60 000 DA |
| Prof. Karim seul | 30 | 2500 DA | 75 000 DA |
| Bundles | 20 | 5000 DA | 100 000 DA |
| **TOTAL** | **100** | - | **295 000 DA/mois** |

**À 12 mois**: 300 clients premium = ~900 000 DA/mois

---

## 🎨 BRANDING PAR AGENT

| Aspect | Amine 💪 | DevBot 💻 | Prof. Karim 📐 |
|--------|----------|-----------|----------------|
| **Color Primary** | Green #00A651 | Blue #0066CC | Purple #7C3AED |
| **Emoji Signature** | 💪 ❤️ 🌟 | 🐛 ⚡ 💻 | 🎓 📐 ✍️ |
| **Tone** | Chaleureux | Technique | Pédagogue |
| **Audience** | Tout public | Développeurs | Élèves |
| **Key Benefit** | Bien-être | Productivité | Réussite |
| **Tagline** | "Ton coach bien-être 24/7" | "Code mieux, plus vite" | "Réussis en maths" |

---

## 🚀 PROCHAINES ACTIONS IMMÉDIATES

### Actions prioritaires (dans l'ordre)

1. **Tester Agent #1 localement** ⏳
   ```bash
   cd apps/agents-ia
   npm install
   npm run dev
   ```
   - Vérifier chat streaming
   - Tester tous les widgets
   - Vérifier lead capture
   - Tests mobile

2. **Créer Agent #2 (DevBot)** 📝
   - Copier structure Agent #1
   - Adapter system prompt
   - Ajouter syntax highlighting
   - Créer snippets library
   - Tests

3. **Créer Agent #3 (Prof. Karim)** 📝
   - Copier structure Agent #1
   - Adapter system prompt
   - Intégrer LaTeX (KaTeX)
   - Créer formula library
   - Tests

4. **Documentation finale** 📚
   - README principal
   - Guides utilisateurs
   - Documentation API
   - Instructions déploiement

5. **Déploiement VPS** 🚀
   - Setup serveur
   - NGINX config
   - SSL certificates
   - Tests production

---

## 📁 STRUCTURE PROJET FINALE

```
apps/agents-ia/
├── app/
│   ├── agents/
│   │   ├── motivation/          # Agent #1 ✅
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── prompts/
│   │   │   └── page.tsx
│   │   ├── dev-helper/          # Agent #2 📋
│   │   │   ├── components/
│   │   │   ├── data/            # Snippets
│   │   │   ├── prompts/
│   │   │   └── page.tsx
│   │   └── tuteur-maths/        # Agent #3 📋
│   │       ├── components/
│   │       ├── data/            # Formulas
│   │       ├── prompts/
│   │       └── page.tsx
│   ├── api/
│   │   └── chat/
│   │       ├── motivation/
│   │       ├── dev-helper/
│   │       └── tuteur-maths/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── shared/                      # Components partagés
│   ├── ChatInterface.tsx
│   ├── MessageBubble.tsx
│   ├── UsageLimitBanner.tsx
│   └── LeadCaptureModal.tsx
├── package.json
├── tailwind.config.ts
└── START.md

Documentation:
├── AGENT_MOTIVATION_STATUS.md       ✅
├── AGENT_DEV_HELPER_PLAN.md        ✅
├── AGENT_TUTEUR_MATHS_PLAN.md      ✅
└── AGENTS_IA_MASTER_PLAN.md        ✅ (ce fichier)
```

---

## ✅ CHECKLIST GLOBALE

### Agent #1: Amine
- [x] Structure créée
- [x] System prompt complet
- [x] Tous components créés
- [x] Chat streaming fonctionne
- [x] Gamification complète
- [x] Usage limits + lead capture
- [ ] Tests E2E
- [ ] Déploiement

### Agent #2: DevBot
- [x] Plan complet documenté
- [ ] Structure créée
- [ ] System prompt écrit
- [ ] Syntax highlighting intégré
- [ ] Snippets library créée
- [ ] Tests E2E
- [ ] Déploiement

### Agent #3: Prof. Karim
- [x] Plan complet documenté
- [ ] Structure créée
- [ ] System prompt écrit
- [ ] LaTeX rendering intégré
- [ ] Formula library créée
- [ ] Tests E2E
- [ ] Déploiement

---

## 🎯 OBJECTIFS

### Court terme (1 mois)
- ✅ Agent #1 complet
- ⏳ Agent #2 & #3 développés
- ⏳ 3 agents en production
- ⏳ 10 premiers clients premium

### Moyen terme (3 mois)
- 50 clients premium
- Ajout de fonctionnalités premium
- Marketing actif
- Partenariats écoles

### Long terme (6-12 mois)
- 100-300 clients premium
- 4-6 agents additionnels
- Team support client
- Expansion régionale (Maghreb)

---

## 💡 IDÉES D'AGENTS FUTURS

Après les 3 premiers, considérer:
1. **Agent Finance** - Budget, économies, investissements (Algérie)
2. **Agent Langues** - Arabe, Français, Anglais (conversation)
3. **Agent Business** - Entrepreneuriat, startup, business plan
4. **Agent Legal** - Droit algérien, contrats, administratif
5. **Agent Médical** - Premiers secours, symptômes (pas diagnostic)
6. **Agent Recettes** - Cuisine algérienne, nutrition

---

## 📞 SUPPORT & CONTACT

- **Email**: contact@iafactory.ai
- **Phone**: +213 XXX XXX XXX
- **Website**: https://iafactory.ai
- **GitHub**: (privé pour l'instant)

---

**🇩🇿 Made in Algeria with ❤️**

**Status actuel**: Phase 2 complétée ✅ - Prêt pour Phase 3 (développement Agents #2 & #3)
