# 🎨 Guide du Design System IA Factory

## Vue d'ensemble

Ce design system unifié garantit la cohérence visuelle sur **toutes les interfaces** du projet IA Factory :
- ✅ RAG UI (port 8183)
- ✅ Archon UI / Hub (port 8182)
- ✅ Studio / Bolt DIY (port 8184)
- ✅ Council (port 8189)
- ✅ Interfaces standalone (NotebookLM, etc.)

## 🎯 Palette de Couleurs

### Couleurs Nationales

#### Algérie 🇩🇿
```css
--dz-green: #006233;      /* Vert officiel */
--dz-green-light: #00824A;
--dz-green-dark: #004521;
--dz-red: #D21034;        /* Rouge officiel */
--dz-red-light: #E03850;
--dz-red-dark: #A00C28;
```

**Utilisation:**
- Headers, badges pays Algérie
- Tableaux comparatifs (colonne DZ)
- Indicateurs spécifiques Algérie

#### Suisse 🇨🇭
```css
--ch-red: #FF0000;        /* Rouge officiel */
--ch-red-light: #FF3333;
--ch-red-dark: #CC0000;
```

**Utilisation:**
- Headers, badges pays Suisse
- Tableaux comparatifs (colonne CH)
- Indicateurs spécifiques Suisse

### Couleurs Système

#### Primary (Bleu Tech)
```css
--primary-500: #3B82F6;   /* PRINCIPAL */
```
**Usages:** Boutons primaires, liens, focus states

#### Secondary (Indigo)
```css
--secondary-500: #6366F1;
```
**Usages:** Boutons secondaires, accents

#### Success (Vert)
```css
--success-500: #10B981;
```
**Usages:** Messages de succès, validations, statuts OK

#### Warning (Ambre)
```css
--warning-500: #F59E0B;
```
**Usages:** Alertes, avertissements, pending states

#### Error (Rouge)
```css
--error-500: #EF4444;
```
**Usages:** Erreurs, validations failed, états critiques

#### Info (Cyan)
```css
--info-500: #06B6D4;
```
**Usages:** Messages informatifs, tooltips

## 📁 Implémentation par Interface

### 1. RAG UI (port 8183)

**Fichier:** `frontend/rag-ui/src/index.tsx`

```tsx
import './styles/ithy-presentation.css';
import '../../../iafactory-design-system.css'; // AJOUTER CETTE LIGNE
```

**Ou dans** `frontend/rag-ui/index.html`:

```html
<head>
  <link rel="stylesheet" href="/iafactory-design-system.css">
</head>
```

### 2. Archon UI / Hub (port 8182)

**Fichier:** `frontend/archon-ui/src/index.tsx`

```tsx
import '../../../iafactory-design-system.css';
```

### 3. Studio / Bolt DIY (port 8184)

**Fichier:** `bolt-diy/app/root.tsx` ou équivalent

```tsx
import '../iafactory-design-system.css';
```

### 4. Interfaces Standalone (HTML)

Pour Council, NotebookLM, etc.:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="./iafactory-design-system.css">
  <!-- Puis tes styles spécifiques -->
</head>
```

## 🔧 Utilisation

### Méthode 1: Variables CSS

```css
.mon-bouton {
  background-color: var(--primary-500);
  color: var(--text-inverse);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-6);
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
}

.mon-bouton:hover {
  background-color: var(--primary-600);
}
```

### Méthode 2: Classes Utilitaires

```html
<button class="bg-primary text-inverse rounded-md shadow">
  Cliquez-moi
</button>

<div class="bg-secondary text-primary border rounded-lg">
  Contenu...
</div>
```

### Méthode 3: Inline avec var()

```tsx
<div style={{
  backgroundColor: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  padding: 'var(--spacing-4)',
  borderRadius: 'var(--radius-lg)'
}}>
  Contenu React
</div>
```

## 🌗 Dark Mode

### Automatique (préférence système)

Le dark mode s'active automatiquement si l'utilisateur a défini le mode sombre dans son OS.

### Manuel (avec classe)

```html
<html class="dark">
  <!-- Tout le contenu sera en dark mode -->
</html>
```

Ou en JavaScript:

```javascript
// Activer dark mode
document.documentElement.classList.add('dark');

// Désactiver dark mode
document.documentElement.classList.remove('dark');

// Toggle
document.documentElement.classList.toggle('dark');
```

## 🎨 Exemples de Composants

### Bouton Primary

```html
<button style="
  background: var(--primary-500);
  color: var(--text-inverse);
  padding: var(--spacing-3) var(--spacing-6);
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: var(--transition-base);
">
  Action Principale
</button>
```

### Card

```html
<div style="
  background: var(--bg-elevated);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-base);
">
  <h3 style="color: var(--text-primary); margin-bottom: var(--spacing-4);">
    Titre de la Card
  </h3>
  <p style="color: var(--text-secondary);">
    Contenu de la card...
  </p>
</div>
```

### Badge Algérie

```html
<span style="
  background: var(--dz-green);
  color: var(--text-inverse);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
">
  🇩🇿 Algérie
</span>
```

### Badge Suisse

```html
<span style="
  background: var(--ch-red);
  color: var(--text-inverse);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
">
  🇨🇭 Suisse
</span>
```

### Alert Success

```html
<div style="
  background: var(--success-50);
  border-left: 4px solid var(--success-500);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  color: var(--success-900);
">
  ✅ Opération réussie !
</div>
```

### Alert Warning

```html
<div style="
  background: var(--warning-50);
  border-left: 4px solid var(--warning-500);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  color: var(--warning-900);
">
  ⚠️ Attention, action requise
</div>
```

### Alert Error

```html
<div style="
  background: var(--error-50);
  border-left: 4px solid var(--error-500);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  color: var(--error-900);
">
  ❌ Erreur détectée
</div>
```

## 📊 Tableau Comparatif DZ/CH

```html
<table style="width: 100%; border-collapse: collapse;">
  <thead>
    <tr style="background: var(--bg-secondary);">
      <th style="padding: var(--spacing-3); text-align: left; color: var(--text-primary);">
        Critère
      </th>
      <th style="padding: var(--spacing-3); text-align: left; color: var(--dz-green);">
        🇩🇿 Algérie
      </th>
      <th style="padding: var(--spacing-3); text-align: left; color: var(--ch-red);">
        🇨🇭 Suisse
      </th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid var(--border-light);">
      <td style="padding: var(--spacing-3); color: var(--text-primary);">
        Délai création entreprise
      </td>
      <td style="padding: var(--spacing-3); color: var(--dz-green); font-weight: var(--font-semibold);">
        15 jours
      </td>
      <td style="padding: var(--spacing-3); color: var(--ch-red); font-weight: var(--font-semibold);">
        5 jours
      </td>
    </tr>
  </tbody>
</table>
```

## 🤖 Prompt pour Claude/IA

Quand tu demandes à Claude de créer une interface, utilise ce prompt:

```
Utilise EXCLUSIVEMENT le Design System IA Factory avec ces couleurs CSS variables :

PRINCIPALES:
- var(--primary-500) pour boutons primaires
- var(--secondary-500) pour boutons secondaires
- var(--success-500), --warning-500, --error-500, --info-500 pour états

NATIONALES:
- var(--dz-green), --dz-red pour Algérie 🇩🇿
- var(--ch-red) pour Suisse 🇨🇭

BACKGROUNDS:
- var(--bg-primary), --bg-secondary, --bg-tertiary

TEXT:
- var(--text-primary), --text-secondary, --text-tertiary

SPACING:
- var(--spacing-1) à --spacing-24

BORDERS:
- var(--border-light), --border-medium, --border-dark

RADIUS:
- var(--radius-sm) à --radius-xl

SHADOWS:
- var(--shadow-sm) à --shadow-2xl

NE JAMAIS utiliser de couleurs en dur (#XXXXXX ou rgb()). TOUJOURS utiliser les variables CSS.
```

## 🚫 À NE PAS FAIRE

### ❌ Mauvais

```css
.mon-element {
  background: #3B82F6;  /* Couleur en dur */
  color: #FFFFFF;
  padding: 16px;
  border-radius: 8px;
}
```

### ✅ Bon

```css
.mon-element {
  background: var(--primary-500);
  color: var(--text-inverse);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
}
```

## 🔄 Migration d'un Composant Existant

### Avant

```tsx
<button style={{
  background: '#3B82F6',
  color: 'white',
  padding: '12px 24px',
  borderRadius: '8px',
  border: 'none'
}}>
  Cliquez
</button>
```

### Après

```tsx
<button style={{
  background: 'var(--primary-500)',
  color: 'var(--text-inverse)',
  padding: 'var(--spacing-3) var(--spacing-6)',
  borderRadius: 'var(--radius-md)',
  border: 'none'
}}>
  Cliquez
</button>
```

## 📈 Checklist d'Implémentation

### Pour chaque nouvelle interface

- [ ] Importer `iafactory-design-system.css` en premier
- [ ] Remplacer toutes les couleurs fixes par des variables
- [ ] Utiliser `var(--spacing-*)` pour les espacements
- [ ] Utiliser `var(--radius-*)` pour les border-radius
- [ ] Utiliser `var(--shadow-*)` pour les box-shadow
- [ ] Tester en light mode ET dark mode
- [ ] Vérifier les contrastes d'accessibilité

### Pour migrer une interface existante

- [ ] Identifier toutes les couleurs en dur (search: `#`, `rgb(`, `rgba(`)
- [ ] Les remplacer une par une par les variables appropriées
- [ ] Tester visuellement que rien n'a cassé
- [ ] Activer dark mode et vérifier
- [ ] Commit avec message clair

## 🎓 Ressources

- **Fichier source:** `iafactory-design-system.css`
- **Documentation:** Ce fichier
- **Exemples:** Voir composants dans `frontend/rag-ui/src/components/presentation/`

## 🆘 Support

Si une couleur manque dans le design system, **ne l'ajoute PAS en dur** dans ton composant. À la place :

1. Propose la couleur dans le channel design
2. Ajoute-la dans `iafactory-design-system.css`
3. Commit et push le design system modifié
4. Utilise la nouvelle variable

---

**Développé pour IA Factory Algérie 🇩🇿 - Suisse 🇨🇭**
