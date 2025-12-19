# 🚀 Guide Complet : Maîtriser Claude Code

## Introduction

Claude Code est un outil de ligne de commande pour le développement assisté par IA. Ce guide te permettra d'exploiter sa puissance maximale pour IA Factory et tous tes projets.

---

## 1. Configuration Optimale

### 1.1 Le fichier CLAUDE.md - Ta clé secrète

Le fichier `CLAUDE.md` est **automatiquement lu** par Claude Code au démarrage. C'est ton arme principale pour guider Claude.

**Où le placer :**
- Racine du projet (recommandé) : `projet/CLAUDE.md`
- Dossier parent (monorepos) : `racine/CLAUDE.md`
- Personnel global : `~/.claude/CLAUDE.md`

**Exemple optimisé pour un projet Next.js/React :**

```markdown
# Commandes Bash
- npm run dev: Démarre le serveur de développement
- npm run build: Build de production
- npm run lint: Vérification du code
- npm run test: Lance les tests

# Style de Code
- TypeScript strict obligatoire
- ES Modules (import/export), jamais CommonJS (require)
- Composants fonctionnels React avec hooks
- Tailwind CSS pour le styling
- Nommage: camelCase pour variables, PascalCase pour composants

# Architecture
- /src/components: Composants réutilisables
- /src/app: Pages Next.js App Router
- /src/lib: Utilitaires et helpers
- /src/hooks: Custom hooks React

# Workflow
- IMPORTANT: Toujours vérifier les types avant de commit
- Tester les modifications avant de soumettre
- Préférer les tests unitaires aux tests d'intégration

# Conventions Projet
- Utiliser shadcn/ui pour les composants UI
- Internationalisation: français par défaut, arabe optionnel
- API: utiliser les Server Actions Next.js
```

### 1.2 Commandes personnalisées (Slash Commands)

Crée des commandes réutilisables dans `.claude/commands/`:

**Exemple `.claude/commands/fix-issue.md`:**
```markdown
Analyse et corrige l'issue GitHub: $ARGUMENTS

Étapes:
1. Utilise `gh issue view` pour voir les détails
2. Comprends le problème décrit
3. Cherche les fichiers pertinents
4. Implémente la correction
5. Écris et lance les tests
6. Vérifie le linting et les types
7. Crée un commit descriptif
8. Push et crée une PR
```

**Utilisation:** `/project:fix-issue 123`

---

## 2. Patterns de Prompting Optimaux

### 2.1 Structure d'un prompt efficace

```
[CONTEXTE] + [CONTRAINTES] + [OBJECTIF] + [FORMAT DE SORTIE]
```

**❌ Mauvais prompt:**
```
ajoute des tests
```

**✅ Bon prompt:**
```
Écris des tests unitaires pour src/lib/auth.ts couvrant:
- Cas de succès de connexion
- Cas d'échec (mauvais mot de passe, utilisateur inexistant)
- Cas de session expirée

Utilise Vitest et Testing Library.
N'utilise PAS de mocks pour la base de données - utilise une DB de test.
```

### 2.2 Les 4 Modes de Prompting

| Mode | Usage | Déclencheur |
|------|-------|-------------|
| **Exploration** | Comprendre une codebase | "Explique comment fonctionne X sans modifier de code" |
| **Planification** | Architecturer une solution | "think hard" / "ultrathink" |
| **Implémentation** | Coder | "Implémente X en suivant le plan" |
| **Vérification** | Review et tests | "Vérifie que X est correct" |

### 2.3 Déclencher le Mode Réflexion Approfondie

Claude Code a des niveaux de réflexion progressifs:

| Phrase | Niveau de réflexion |
|--------|---------------------|
| `think` | Réflexion basique |
| `think hard` | Réflexion approfondie |
| `think harder` | Réflexion très approfondie |
| `ultrathink` | Réflexion maximale |

**Exemple:**
```
J'ai besoin que tu "ultrathink" à une architecture pour un système de multi-agents 
pour IA Factory. Considère:
- Scalabilité pour 1000 utilisateurs concurrents
- Intégration avec les 25 applications existantes
- Support Algérie et Suisse (latence, conformité)
Ne code pas encore, propose-moi un plan détaillé.
```

---

## 3. Workflows de Développement

### 3.1 Workflow TDD (Test-Driven Development)

```
1. "Écris des tests pour [fonctionnalité] basés sur ces cas d'usage: [...]. 
    C'est du TDD, NE crée PAS d'implémentation."

2. "Lance les tests et confirme qu'ils échouent."

3. "Commit les tests."

4. "Implémente le code pour faire passer les tests. 
    NE modifie PAS les tests. Continue jusqu'à ce que tous passent."

5. "Commit l'implémentation."
```

### 3.2 Workflow Explore → Plan → Code → Commit

```
ÉTAPE 1 - EXPLORATION:
"Lis les fichiers liés à l'authentification (auth.ts, middleware.ts, etc.).
 NE code PAS encore. Juste lis et comprends."

ÉTAPE 2 - PLANIFICATION:
"Think hard: propose un plan pour ajouter l'authentification OAuth avec Google.
 Détaille chaque étape et fichier à modifier."

ÉTAPE 3 - IMPLÉMENTATION:
"Implémente l'étape 1 du plan. Vérifie que ça fonctionne avant de continuer."

ÉTAPE 4 - COMMIT:
"Commit avec un message clair et crée une PR."
```

### 3.3 Workflow Visuel (UI/UX)

```
1. Donne à Claude une capture d'écran ou mock (glisser-déposer dans le terminal)

2. "Implémente ce design en React/Tailwind. 
    Prends des screenshots du résultat et itère jusqu'à correspondance exacte."

3. "Commit quand c'est visuellement identique au mock."
```

---

## 4. Commandes et Raccourcis Essentiels

### 4.1 Raccourcis Clavier

| Raccourci | Action |
|-----------|--------|
| `Escape` | Interrompre Claude (garde le contexte) |
| `Escape` x2 | Revenir dans l'historique, éditer un prompt |
| `Shift+Tab` | Toggle mode auto-accept |
| `#` | Ajouter une instruction au CLAUDE.md |
| `/clear` | Vider le contexte (IMPORTANT entre les tâches!) |
| `Tab` | Auto-compléter les chemins de fichiers |

### 4.2 Commandes Slash Natives

| Commande | Usage |
|----------|-------|
| `/init` | Générer un CLAUDE.md automatiquement |
| `/permissions` | Gérer les permissions des outils |
| `/clear` | Reset du contexte |
| `/help` | Aide |

### 4.3 Flags CLI Importants

```bash
# Mode headless (CI/CD, scripts)
claude -p "ton prompt" --json

# Debug MCP
claude --mcp-debug

# Permissions spécifiques
claude --allowedTools Edit Bash(git:*)

# Mode YOLO (attention: dangereux!)
claude --dangerously-skip-permissions
```

---

## 5. Intégration MCP (Model Context Protocol)

### 5.1 Configuration dans `.mcp.json`

```json
{
  "servers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-puppeteer"]
    },
    "github": {
      "command": "npx", 
      "args": ["-y", "@anthropic/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### 5.2 Serveurs MCP Utiles

| Serveur | Usage |
|---------|-------|
| Puppeteer | Screenshots, tests E2E |
| GitHub | Issues, PRs, reviews |
| Sentry | Monitoring d'erreurs |
| PostgreSQL | Requêtes DB directes |

---

## 6. Optimisations Avancées

### 6.1 Multi-Claude Workflow

**Technique 1: Code + Review séparés**
```
Terminal 1: Claude écrit le code
Terminal 2: Claude review le code du Terminal 1
Terminal 3: Claude applique les corrections
```

**Technique 2: Git Worktrees**
```bash
# Créer des worktrees pour travail parallèle
git worktree add ../ia-factory-auth feature-auth
git worktree add ../ia-factory-ui feature-ui

# Lancer Claude dans chaque worktree
cd ../ia-factory-auth && claude
cd ../ia-factory-ui && claude
```

### 6.2 Utiliser des Scratchpads pour les tâches complexes

```
"Crée un fichier MIGRATION_CHECKLIST.md avec toutes les étapes pour migrer 
de React 18 à React 19. Coche chaque item après l'avoir complété.
Continue jusqu'à ce que tout soit coché."
```

### 6.3 Pipeline automatisé (Headless Mode)

```bash
#!/bin/bash
# Script de migration automatique

FILES=$(find src -name "*.tsx" -type f)

for file in $FILES; do
  claude -p "Migre $file de JavaScript à TypeScript strict. 
             Retourne OK si succès, FAIL si échec." \
         --allowedTools Edit \
         --json
done
```

---

## 7. Prompts Prêts à l'Emploi pour IA Factory

### 7.1 Création de nouvel agent

```
Crée un nouvel agent pour IA Factory nommé "IA [Nom]" avec:

Contexte:
- Spécialisation: [domaine]
- Public cible: [utilisateurs]
- Langue: Français (support Arabe optionnel)

Architecture:
- Framework: Next.js 14 App Router
- UI: shadcn/ui + Tailwind
- État: Zustand ou React Query

Fonctionnalités requises:
1. Interface conversationnelle
2. Historique des conversations
3. Export des résultats
4. Mode sombre/clair

Commence par créer la structure des dossiers et les composants de base.
```

### 7.2 Debug d'erreur de production

```
J'ai cette erreur en production:
[colle l'erreur]

Stack trace:
[colle la stack]

Context:
- Version: [version]
- Environnement: [env]
- Dernière modification: [commit]

Think hard: analyse cette erreur, identifie la cause racine, 
et propose une correction avec tests de non-régression.
```

### 7.3 Refactoring de composant

```
Refactorise src/components/[Composant].tsx:

Objectifs:
1. Séparer la logique de la présentation
2. Extraire les hooks custom
3. Améliorer la lisibilité
4. Ajouter TypeScript strict
5. Documenter avec JSDoc

Contraintes:
- NE casse PAS l'API existante (mêmes props)
- Conserve tous les tests existants qui passent
- Performance: évite les re-renders inutiles
```

---

## 8. Résolution de Problèmes Courants

### 8.1 Claude s'arrête ou ralentit

**Solution:** Utilise `/clear` régulièrement entre les tâches pour libérer le contexte.

### 8.2 Claude fait des modifications non demandées

**Solution:** Ajoute dans ton prompt:
```
IMPORTANT: Modifie UNIQUEMENT les fichiers que je mentionne explicitement.
Ne touche à AUCUN autre fichier sans ma permission.
```

### 8.3 Claude over-engineer

**Solution:** Ajoute dans CLAUDE.md:
```markdown
# IMPORTANT
- Évite le sur-engineering
- Solutions minimales et directes
- Pas d'abstractions inutiles
- Pas de fichiers supplémentaires non demandés
```

### 8.4 Problèmes d'authentification / limites

**Solutions:**
- Utilise `claude logout` puis `claude login`
- Vérifie ton abonnement sur claude.ai
- Utilise `/clear` pour économiser les tokens

---

## 9. Checklist de Démarrage

- [ ] Installer Claude Code: `npm install -g @anthropic-ai/claude-code`
- [ ] Créer `CLAUDE.md` à la racine de ton projet
- [ ] Créer `.claude/commands/` avec tes commandes custom
- [ ] Configurer `.mcp.json` si besoin de serveurs MCP
- [ ] Ajouter `CLAUDE.md` au .gitignore si infos sensibles (ou `.local.md`)
- [ ] Tester avec `/init` sur un nouveau projet

---

## 10. Ressources

- **Documentation officielle:** https://docs.anthropic.com/claude-code
- **Best practices Anthropic:** https://anthropic.com/engineering/claude-code-best-practices
- **MCP Servers:** https://github.com/modelcontextprotocol/servers
- **Prompt Engineering:** https://docs.claude.com/en/docs/build-with-claude/prompt-engineering

---

*Guide créé pour Boualem - IA Factory | Décembre 2025*
