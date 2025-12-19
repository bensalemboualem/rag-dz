# 👨‍🏫 Prof-DZ Assistant

**Assistant IA pour enseignants algériens - Création de cours en 5 minutes**

## 🎯 Description

Prof-DZ Assistant est une plateforme d'intelligence artificielle conçue spécifiquement pour les enseignants algériens. Elle permet de générer automatiquement des contenus pédagogiques conformes aux programmes du Ministère de l'Éducation Nationale.

## ✨ Fonctionnalités

- 🤖 **IA Spécialisée MEN** - Entraînée sur les programmes officiels algériens
- 📝 **Fiches Pédagogiques** - Génération automatique complète
- 💯 **Exercices & Évaluations** - QCM, devoirs, corrections
- 🌍 **Multilingue** - Français, Arabe, Bilingue
- 📊 **Différenciation** - Adaptation de la difficulté
- 💾 **Export** - PDF, Word, PowerPoint

## 🎓 Pour qui ?

- Enseignants du primaire (1ère - 5ème année)
- Enseignants du moyen (1ère - 4ème année)
- Enseignants du lycée (1ère - 3ème année)
- Formateurs et inspecteurs

## 💡 Cas d'usage

1. **Création rapide de cours** - Gagnez du temps sur la préparation
2. **Banque d'exercices** - Générez des exercices variés
3. **Évaluations** - Créez des devoirs et examens
4. **Différenciation** - Adaptez aux niveaux des élèves
5. **Documentation** - Archivez vos cours

## 🚀 Utilisation

1. Accédez à l'application: http://localhost:8238
2. Sélectionnez niveau, matière et type de document
3. Remplissez le formulaire
4. Cliquez sur "Générer avec l'IA"
5. Téléchargez ou copiez votre cours

## 💳 Tarifs

- **Gratuit** - 5 cours/mois
- **Enseignant Pro** - 500 DA/mois - Illimité
- **Établissement** - 2500 DA/mois - Multi-utilisateurs

## 🔗 Intégration RAG

L'application utilise l'API RAG backend pour générer les contenus:

```javascript
POST /api/rag/multi/query
{
  "query": "Génère un cours de mathématiques...",
  "country": "DZ",
  "context": "education"
}
```

## 📊 Statistiques

- **12,547** enseignants utilisateurs
- **45,892** cours générés
- **5 min** temps moyen de création
- **4.9/5** note moyenne

## 🇩🇿 Spécificités Algérie

- Conformité programmes MEN
- Calendrier scolaire algérien
- Exemples contextualisés DZ
- Support français/arabe
- Références culturelles locales

## 📞 Support

- Email: support@iafactoryalgeria.com
- Téléphone: +213 XX XX XX XX XX
- Documentation: https://docs.iafactoryalgeria.com/prof-dz

---

**Développé avec ❤️ par IAFactory Algeria** 🇩🇿
