# 🎨 Palette de Couleurs Unifiée - IAFactory Algeria

## 🇩🇿 Couleurs Nationales Algériennes

| Couleur | Variable CSS | Valeur | Usage |
|---------|--------------|--------|-------|
| **Vert Algérie** | `--dz-green` | `#00A651` | Accents, boutons primaires |
| **Vert Foncé** | `--dz-green-dark` | `#006233` | Hover states, emphasis |
| **Rouge Algérie** | `--dz-red` | `#ED1C24` | Alertes, erreurs |
| **Blanc** | `--dz-white` | `#FFFFFF` | Cards (light mode) |

---

## 🌙 Mode Dark (par défaut)

### Backgrounds
```css
--bg-primary: #1F1F1F      /* Background principal */
--bg-secondary: #2A2A2A    /* Background secondaire */
--bg-tertiary: #353535     /* Background tertiaire */
--bg-card: #1F1F1F         /* Cards */
--bg-card-hover: #2A2A2A   /* Cards hover */
```

### Textes
```css
--text-primary: #FFFFFF    /* Texte principal */
--text-secondary: #CCCCCC  /* Texte secondaire */
--text-muted: #999999      /* Texte atténué */
--text-tertiary: #999999   /* Texte tertiaire */
```

### Bordures
```css
--border-primary: #3A3A3A
--border-secondary: #4A4A4A
```

### Ombres
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.3)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.3)
--shadow-soft: 0 18px 45px rgba(0, 0, 0, 0.35)
```

---

## ☀️ Mode Light

### Backgrounds (Structure Identique au Dark)
```css
--bg-primary: #FAFAF9      /* Équivalent de #1F1F1F */
--bg-secondary: #F5F5F4    /* Équivalent de #2A2A2A */
--bg-tertiary: #E7E5E4     /* Équivalent de #353535 */
--bg-card: #FFFFFF         /* Blanc pur pour les cards */
--bg-card-hover: #F5F5F4   /* Hover léger */
```

### Textes (Structure Identique au Dark)
```css
--text-primary: #1A1A1A    /* Équivalent de #FFFFFF */
--text-secondary: #71717A  /* Équivalent de #CCCCCC */
--text-muted: #A1A1AA      /* Équivalent de #999999 */
--text-tertiary: #A1A1AA   /* Équivalent de #999999 */
```

### Bordures
```css
--border-primary: #E5E7EB
--border-secondary: #D4D4D4
```

### Ombres
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
--shadow-soft: 0 18px 45px rgba(15, 23, 42, 0.08)
```

---

## 🎯 Accents (Identiques aux 2 modes)

```css
--accent: var(--dz-green)           /* #00A651 */
--accent-hover: var(--dz-green-dark) /* #006233 */
--accent-red: var(--dz-red)         /* #ED1C24 */
--yellow: #facc15
--red: var(--dz-red)
```

---

## 📐 Dimensions & Radius

```css
--radius-sm: 6px
--radius-md: 10px
--radius-lg: 16px
--radius-xl: 20px
--radius-pill: 999px

--header-height: 64px
--sidebar-width: 180px
--widget-width: 320px

--container-max: 1400px
```

---

## ⚡ Transitions

```css
--transition-fast: 150ms
--transition-normal: 220ms
--transition-slow: 300ms
```

---

## 🎨 Catégories d'Apps (Couleurs à 20% opacité)

| Catégorie | Couleur | Background | Usage |
|-----------|---------|------------|-------|
| **FINANCE** | `#ef4444` | `#ef444420` | 💼 Business, Fiscal, Billing |
| **EDUCATION** | `#fbbf24` | `#fbbf2420` | 🎓 RAG École |
| **RELIGION** | `#22c55e` | `#22c55e20` | 🕌 RAG Islam |
| **BUSINESS** | `#a855f7` | `#a855f720` | 🚀 PME, CRM |
| **VENTES** | `#06b6d4` | `#06b6d420` | 💰 Sales |
| **JURIDIQUE** | `#8b5cf6` | `#8b5cf620` | ⚖️ Legal |
| **MARKETING** | `#f59e0b` | `#f59e0b20` | 📈 SEO, Landing |
| **DEV** | `#3b82f6` | `#3b82f620` | 💻 BMAD, API, Dev Portal |
| **DATA** | `#10b981` | `#10b98120` | 📊 Data DZ |
| **CRÉATIF** | `#ec4899` | `#ec489920` | 🎨 Creative Studio |
| **STARTUP** | `#f97316` | `#f9731620` | 🌱 Ithy, StartupDZ |
| **GESTION** | `#14b8a6` | `#14b8a620` | 📋 Dashboard |
| **INTERFACE** | `#6366f1` | `#6366f120` | 🎯 Archon, RAG UI |
| **VOIX** | `#8b5cf6` | `#8b5cf620` | 🎤 Voice Assistant |
| **SANTÉ** | `#ef4444` | `#ef444420` | 🏥 MedDZ |

---

## 📦 Fichiers

### Fichiers Globaux
- `shared/theme.css` - Palette CSS unifiée
- `shared/theme.js` - Gestionnaire de thème
- `shared/app-template.html` - Template d'app

### Utilisation dans une App

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <link rel="stylesheet" href="../../shared/theme.css">
</head>
<body>
  <button class="btn-theme">🌙</button>
  <script src="../../shared/theme.js"></script>
</body>
</html>
```

---

## ✅ Avantages de l'Uniformisation

1. **Cohérence visuelle** - Même look & feel partout
2. **Structure identique** - Même hiérarchie de couleurs dans les 2 modes
3. **Maintenance facile** - Un seul fichier CSS à modifier
4. **Performance** - Transitions fluides entre modes
5. **Accessibilité** - Contraste optimal dans les 2 modes
6. **Identité nationale** - Couleurs algériennes 🇩🇿 partout

---

## 🔄 Comparaison Structure

| Élément | Dark Mode | Light Mode | Équivalence |
|---------|-----------|------------|-------------|
| Primary BG | `#1F1F1F` | `#FAFAF9` | ✅ Même hiérarchie |
| Secondary BG | `#2A2A2A` | `#F5F5F4` | ✅ Même hiérarchie |
| Tertiary BG | `#353535` | `#E7E5E4` | ✅ Même hiérarchie |
| Card BG | `#1F1F1F` | `#FFFFFF` | ✅ Contraste max |
| Text Primary | `#FFFFFF` | `#1A1A1A` | ✅ Contraste max |
| Text Secondary | `#CCCCCC` | `#71717A` | ✅ Même opacité |
| Text Muted | `#999999` | `#A1A1AA` | ✅ Même opacité |
| Accent | `#00A651` | `#00A651` | ✅ **IDENTIQUE** |
| Yellow | `#facc15` | `#facc15` | ✅ **IDENTIQUE** |
| Red | `#ED1C24` | `#ED1C24` | ✅ **IDENTIQUE** |

---

## 📝 Notes

- Les couleurs d'accents sont **strictement identiques** dans les 2 modes
- La structure de hiérarchie (primary/secondary/tertiary) est **préservée**
- Les cards ont un fond distinct (`#1F1F1F` en dark, `#FFFFFF` en light)
- Les ombres sont adaptées pour chaque mode
- Transitions automatiques de 0.3s pour tous les changements
- Support RTL pour l'arabe
- Support `prefers-reduced-motion` pour l'accessibilité

---

## 🚀 Déploiement

Toutes les apps du projet utilisent maintenant automatiquement cette palette via:
- `shared/theme.css` (chargé dans chaque app)
- `shared/theme.js` (toggle dark/light automatique)
- LocalStorage (sauvegarde de préférence)

**100% des apps IAFactory Algeria sont uniformisées! 🇩🇿**
