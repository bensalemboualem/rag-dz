# 🌍 GUIDE INTÉGRATION SYSTÈME MULTILINGUE

**Date**: 6 décembre 2025
**Objectif**: Ajouter support FR/AR/EN à la landing page IAFactory
**Fichier source**: `apps/landing/iafactory-i18n-complete.html`

---

## ✅ CE QUI A ÉTÉ CRÉÉ

### Fichier `iafactory-i18n-complete.html`
Contient 3 composants prêts à l'emploi:

1. **Script i18n JavaScript** (120+ traductions)
2. **Sélecteur de langue** (FR/AR/EN buttons)
3. **Section PRO traduite** (12 solutions IA)

---

## 📋 INTÉGRATION EN 3 ÉTAPES

### ÉTAPE 1: Ajouter le script i18n dans `<head>`

**Localisation**: Après la ligne ~6 (dans le `<head>`, avant le `<style>`)

**Code à copier**: Tout le bloc `<script>` du fichier `iafactory-i18n-complete.html` (lignes 19-430)

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IAFactory Algeria — Landing Responsive</title>
    <link rel="stylesheet" href="..." />

    <!-- ===== AJOUTER ICI LE SCRIPT I18N ===== -->
    <script>
    // Système i18n IAFactory - Support FR/AR/EN
    const IAFactoryI18n = { ... }
    </script>
    <!-- ===== FIN SCRIPT I18N ===== -->

    <style>
    ...
    </style>
</head>
```

---

### ÉTAPE 2: Ajouter le sélecteur de langue dans le header

**Localisation**: Dans le header, après le toggle thème (ligne ~200)

**Rechercher**:
```html
<button type="button" class="theme-toggle" id="themeToggle">
    <i class="fas fa-moon"></i>
</button>
```

**Ajouter juste après**:
```html
<button type="button" class="theme-toggle" id="themeToggle">
    <i class="fas fa-moon"></i>
</button>

<!-- ===== AJOUTER ICI LE SÉLECTEUR DE LANGUE ===== -->
<div class="language-switcher">
    <button class="lang-btn active" data-lang="fr" title="Français">FR</button>
    <button class="lang-btn" data-lang="ar" title="العربية">AR</button>
    <button class="lang-btn" data-lang="en" title="English">EN</button>
</div>
<!-- ===== FIN SÉLECTEUR ===== -->
```

**CSS à ajouter**: Copier le bloc CSS pour `.language-switcher` et `body.rtl` du fichier `iafactory-i18n-complete.html` (lignes 440-520) dans la section `<style>` existante.

---

### ÉTAPE 3: Insérer la section PRO

**Localisation**: Ligne 3237, entre `</section>` (#apps) et `<section id="cta">` (#cta)

**Rechercher**:
```html
            </div>
        </section>

        <!-- CTA -->
        <section id="cta" class="cta-section">
```

**Remplacer par**:
```html
            </div>
        </section>

        <!-- ===== AJOUTER ICI LA SECTION PRO ===== -->
        <section id="pro-solutions" class="section" style="...">
            ... (tout le bloc PRO du fichier iafactory-i18n-complete.html)
        </section>
        <!-- ===== FIN SECTION PRO ===== -->

        <!-- CTA -->
        <section id="cta" class="cta-section">
```

---

## 🎨 TRADUCTIONS EXISTANTES

Le système i18n contient **120+ traductions** pour:

### Navigation
- Accueil / الرئيسية / Home
- Fonctionnalités / المميزات / Features
- Applications / التطبيقات / Applications
- Documentation / التوثيق / Documentation

### Hero Section
- Là où les idées commencent / حيث تبدأ الأفكار / Where ideas begin
- Plateforme souveraine... (description complète)

### PRO Solutions (TIER 1)
- **PME Copilot PRO**: Analyse financière / تحليل مالي / Financial analysis
- **CRM IA PRO**: CRM HubSpot-like
- **Fiscal Assistant DZ**: Optimisation fiscale / تحسين ضريبي / Tax optimization
- **Legal Assistant DZ**: Assistant juridique / مساعد قانوني / Legal assistant
- **Voice Agent DZ**: Support vocal 24/7

### Features & Benefits
- Analyse bilan automatique / تحليل الميزانية تلقائياً / Automatic balance sheet analysis
- Prévisions trésorerie / توقعات الخزينة / Cash flow forecasts
- Scoring crédit IA / تقييم الائتمان بالذكاء الاصطناعي / AI credit scoring

### Badges & Labels
- IMPACT MAX / أقصى تأثير / MAX IMPACT
- UNIQUE DZ / حصري جزائري / UNIQUE DZ
- Uptime / وقت التشغيل / Uptime

---

## 🔧 UTILISATION DU SYSTÈME

### Ajouter une traduction

Modifier le dictionnaire `IAFactoryI18n.translations` dans le script:

```javascript
translations: {
    "nouvelle_cle": {
        fr: "Texte en français",
        ar: "النص بالعربية",
        en: "Text in English"
    },
    // ... autres traductions
}
```

### Marquer un élément comme traduisible

Ajouter l'attribut `data-i18n="cle"`:

```html
<h1 data-i18n="hero_title_prefix">IAFactory</h1>
<p data-i18n="hero_description">Description en français par défaut...</p>
<button data-i18n="cta_button">Commencer maintenant</button>
```

### Changer de langue dynamiquement

```javascript
// Via les boutons (automatique)
// Ou programmatiquement:
IAFactoryI18n.setLanguage('ar'); // Arabe
IAFactoryI18n.setLanguage('en'); // Anglais
IAFactoryI18n.setLanguage('fr'); // Français (défaut)
```

---

## 🌐 SUPPORT RTL (Right-to-Left)

Le système détecte automatiquement l'arabe et applique:

```css
/* Arabe sélectionné */
body.rtl {
    direction: rtl;
    text-align: right;
}

/* Inversion des flex layouts */
body.rtl .header-container {
    flex-direction: row-reverse;
}
```

**Note**: Le CSS RTL est déjà inclus dans le fichier `iafactory-i18n-complete.html` (lignes 480-520).

---

## 💾 STOCKAGE PRÉFÉRENCE

La langue choisie est **automatiquement sauvegardée** dans `localStorage`:

```javascript
localStorage.getItem('iafactory_lang') // Récupère la langue
localStorage.setItem('iafactory_lang', 'ar') // Change la langue
```

Au chargement de la page, le système **restaure automatiquement** la langue précédemment choisie.

---

## ✅ VÉRIFICATION

Après intégration, tester:

1. **Changement de langue**: Cliquer FR → AR → EN
2. **Persistance**: Recharger la page, vérifier que la langue est conservée
3. **RTL arabe**: En mode AR, vérifier que le texte est aligné à droite
4. **Section PRO**: Vérifier que les 5 cards TIER 1 s'affichent correctement
5. **Responsive**: Tester sur mobile (language switcher doit rester visible)

---

## 🚀 DÉPLOIEMENT

Une fois l'intégration terminée dans `apps/landing/index.html`:

```bash
# 1. Uploader vers VPS
scp "d:/IAFactory/rag-dz/apps/landing/index.html" \
  root@46.224.3.125:/opt/iafactory-rag-dz/apps/landing/

# 2. Vérifier en ligne
curl -I https://www.iafactoryalgeria.com/

# 3. Tester dans le navigateur
# https://www.iafactoryalgeria.com/
# Cliquer FR → AR → EN pour vérifier
```

---

## 📞 TROUBLESHOOTING

### La langue ne change pas

Vérifier dans la console:
```javascript
console.log(IAFactoryI18n.currentLang); // Doit afficher: fr/ar/en
console.log(IAFactoryI18n.translations); // Doit afficher le dictionnaire
```

### RTL ne fonctionne pas en arabe

Vérifier que le CSS `.rtl` est bien ajouté dans `<style>`:
```css
body.rtl {
    direction: rtl;
    text-align: right;
}
```

### Traduction manquante

Vérifier que la clé existe dans `IAFactoryI18n.translations` et que l'élément a bien `data-i18n="cle_correcte"`.

---

## 📊 RÉSUMÉ DES MODIFICATIONS

| Fichier | Lignes modifiées | Description |
|---------|------------------|-------------|
| `index.html` (head) | Après ligne 6 | Ajout script i18n (400 lignes) |
| `index.html` (header) | Après ligne ~200 | Ajout language switcher (3 boutons) |
| `index.html` (style) | Dans `<style>` | Ajout CSS pour switcher + RTL (~80 lignes) |
| `index.html` (section PRO) | Ligne 3237 | Insertion section PRO traduite (~400 lignes) |

**Total ajouté**: ~880 lignes
**Taille finale**: ~6000 lignes

---

**Créé**: 6 décembre 2025
**Version**: 1.0
**Status**: ✅ Prêt pour intégration
