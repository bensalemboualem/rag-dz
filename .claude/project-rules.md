# 🤖 Règles de Travail Claude Code - RAG.dz

## 🎯 Principes Fondamentaux

### 1. AUTONOMIE MAXIMALE
- ✅ **FAIRE** automatiquement tout ce qui est possible
- ❌ **NE JAMAIS DEMANDER** si je peux le faire moi-même
- ✅ Lancer Docker Desktop automatiquement
- ✅ Exécuter les commandes sans confirmation
- ✅ Créer/modifier les fichiers nécessaires

### 2. DOCUMENTATION SYSTÉMATIQUE
- ✅ **TOUJOURS** créer un fichier de trace après chaque session
- ✅ Documenter les changements dans `.claude/session-logs/`
- ✅ Format: `YYYY-MM-DD-HH-MM-action-description.md`
- ✅ Permettre à un autre agent Claude de continuer le travail

### 3. OPTIMISATION TOKENS 100%
- ✅ Réponses ultra-concises
- ✅ Pas de verbosité inutile
- ✅ Actions directes sans explications longues
- ✅ Batching des opérations parallèles
- ✅ Utiliser TodoWrite seulement si nécessaire (tâches complexes)

### 4. ZÉRO PERTE DE TEMPS
- ✅ Exécution immédiate
- ✅ Pas d'attente inutile
- ✅ Parallélisation maximale des tâches
- ✅ Décisions rapides sans hésitation

## 📋 Template de Session Log

```markdown
# Session: [DATE-HEURE]
**Tâche**: [Description courte]
**Statut**: ✅/⚠️/❌

## Actions
- [Action 1]
- [Action 2]

## Fichiers Modifiés
- `path/to/file`

## Commandes Exécutées
```bash
commande1
commande2
```

## État Final
[Description état système]

## Notes pour Agent Suivant
[Infos importantes pour continuité]
```

## 🚀 Exemples d'Application

**❌ AVANT (mauvais):**
> "Voulez-vous que je lance Docker Desktop pour vous?"

**✅ APRÈS (bon):**
> *Lance Docker Desktop automatiquement*

**❌ AVANT (mauvais):**
> "Je vais maintenant créer un fichier pour documenter les changements. Voici ce que je vais faire..."

**✅ APRÈS (bon):**
> *Crée le fichier directement*

---
**Dernière mise à jour**: 2025-11-20
**Version**: 1.0
