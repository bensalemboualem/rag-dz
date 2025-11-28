# 🎉 LLM Council - Accès et Test

## ✅ TOUT EST PRÊT !

### 📊 Configuration Finale

**3 Providers Actifs:**
- ✅ Claude Sonnet 4 (Chairman) - $15 de crédit disponible
- ✅ Gemini Pro (Member) - API gratuite
- ✅ Llama 3 8B via Ollama (Member) - Local, gratuit

**Services Opérationnels:**
- ✅ Backend: http://localhost:8180
- ✅ Council API: http://localhost:8180/api/council/*

---

## 🚀 ACCÈS INTERFACE WEB

### Lancer le serveur Council Custom:

```bash
node serve-council-custom.js
```

### Puis ouvrir dans votre navigateur:

```
http://localhost:8189
```

**Vous verrez:**
1. Status des 3 providers (tous en vert ✅)
2. Formulaire pour poser une question
3. Option "Activer la revue croisée"
4. Bouton "Consulter le Council"

---

## 📝 TESTS RECOMMANDÉS

### Test 1: Question Simple (15-30 secondes)

**Question à copier-coller:**
```
Explique le concept de cloud computing en 2 phrases simples
```

**Options:**
- ❌ Ne PAS activer la revue croisée (plus rapide)
- ✅ Utiliser les 3 providers par défaut

**Résultat attendu:**
- 3 opinions individuelles (Claude, Gemini, Ollama)
- 1 synthèse finale par Claude
- Temps: ~15-30 secondes

---

### Test 2: Question Technique (20-40 secondes)

**Question:**
```
Quelles sont les meilleures pratiques pour sécuriser une API REST ?
```

**Résultat attendu:**
- Chaque modèle donnera des recommandations différentes
- Claude synthétisera en une réponse structurée
- Vous verrez les onglets pour chaque opinion

---

### Test 3: Pour Démo Algérie Télécom (30-45 secondes)

**Question:**
```
Comment Algérie Télécom peut-elle utiliser l'IA pour améliorer
l'expérience client tout en respectant la souveraineté des données ?
```

**Options:**
- ✅ ACTIVER la revue croisée (démo premium)

**Résultat attendu:**
- 3 opinions
- Évaluations croisées
- Synthèse finale robuste
- Temps: ~30-60 secondes

---

## 🧪 TESTS API (Alternative)

### Via Swagger UI:
```
http://localhost:8180/docs#/Council
```

### Via curl (Windows PowerShell):
```powershell
# Health check
curl http://localhost:8180/api/council/health

# Liste providers
curl http://localhost:8180/api/council/providers

# Test connectivité
curl -X POST http://localhost:8180/api/council/test
```

---

## 🎯 DÉMO 6 DÉCEMBRE - CHECKLIST

### Avant la démo:

**1. Vérifier les services (5 min avant)**
```bash
docker-compose ps
curl http://localhost:8180/api/council/health
node serve-council-custom.js &
```

**2. Ouvrir les URLs dans le navigateur**
- Tab 1: http://localhost:8189 (Council Custom)
- Tab 2: http://localhost:8180/docs (API Documentation backup)

**3. Préparer 3 questions** (déjà prêtes ci-dessus):
- Question simple (warm-up)
- Question technique (showcase)
- Question spécifique client (impact)

**4. Tester 1 fois en amont** (consommera ~$0.015):
```
Question test: "Dis bonjour en français"
```

---

## 💰 COÛTS

### Par requête:
- **Mode Standard** (sans review): ~$0.015 (1.5¢)
  - Claude: $0.010
  - Gemini: $0.004
  - Ollama: $0.000 (gratuit)

- **Mode Premium** (avec review): ~$0.030 (3¢)

### Avec votre crédit ($15):
- ~1000 requêtes standard
- ~500 requêtes premium

**Suffisant pour:**
- ✅ Tous les tests
- ✅ Démo complète
- ✅ Post-démo ajustements

---

## 📖 NAVIGATION DANS L'INTERFACE

### Section Header:
- Titre "LLM Council"
- Description du système

### Section Status (en haut):
- **Providers disponibles: 3/3**
- Claude Sonnet 4 ✅
- Gemini Pro ✅
- Llama 3 Local ✅

### Formulaire:
- Grande zone de texte pour la question
- Checkbox "Activer la revue croisée"
- Bouton bleu "Consulter le Council"

### Pendant le traitement:
- Loader animé
- Messages de progression:
  - ✓ Consultation des experts en cours
  - ✓ Revue croisée des réponses (si activée)
  - ✓ Synthèse finale en préparation

### Résultats:
- **Carte verte**: Réponse finale synthétisée
- **Métadonnées**: Temps, nombre d'experts, chairman
- **Onglets**: Opinions individuelles de chaque modèle

---

## 🐛 SI PROBLÈME

### Page vide ou erreur 404:
```bash
docker-compose restart iafactory-hub
# Attendre 30 secondes
# Rafraîchir le navigateur (Ctrl+F5)
```

### Timeout sur requête:
```bash
# Vérifier les logs
docker logs iaf-dz-backend --tail 50

# Si timeout, c'est normal la première fois
# Ollama charge le modèle en mémoire (~30s)
# Réessayer la même question (sera plus rapide)
```

### Provider indisponible:
```bash
# Vérifier la config
curl http://localhost:8180/api/council/providers

# Si un provider est "available: false"
# Vérifier la clé API correspondante dans .env.local
```

---

## 📞 SUPPORT

### Documentation complète:
- `docs/COUNCIL_README.md` - Architecture détaillée
- `docs/COUNCIL_QUICK_START.md` - Guide démarrage
- `COUNCIL_INTEGRATION_SUMMARY.md` - Vue d'ensemble
- `COUNCIL_STATUS.md` - Status actuel

### Tests automatisés:
```bash
python test-council.py
```

---

## 🎉 C'EST PARTI !

**Tout est configuré et opérationnel.**

**Prochaine action: Ouvrir votre navigateur sur:**
```
http://localhost:8182/council
```

**Et poser votre première question au Council !** 🚀

---

**Créé le**: 26 Novembre 2024
**Status**: ✅ PRODUCTION READY
**Deadline**: 6 Décembre (10 jours restants)
