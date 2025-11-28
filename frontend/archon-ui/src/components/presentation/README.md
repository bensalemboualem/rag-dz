# 🎨 Système de Présentation Style ithy.ai

> Composants de rendu enrichi pour réponses RAG - IA Factory

## 📋 Vue d'ensemble

Ce système transforme les réponses RAG brutes en articles interactifs riches, inspirés de **ithy.ai**, spécialement conçu pour le contexte **binational Algérie 🇩🇿 / Suisse 🇨🇭**.

## ✨ Fonctionnalités

- ✅ **Rendu HTML riche** - Sections structurées avec icônes
- ✅ **Tableaux comparatifs** - DZ vs CH avec drapeaux
- ✅ **Graphiques dynamiques** - Radar, Bar, Pie, Comparison (Recharts)
- ✅ **FAQ expandables** - Smooth animations
- ✅ **Citations sources** - Format académique avec pertinence
- ✅ **Alertes juridiques** - Warning, Info, Success, Error
- ✅ **Support multilingue** - FR/AR/DE/Amazigh
- ✅ **Design responsive** - Mobile-first

## 📦 Composants

### 1. `IthyStyleRenderer`
Composant principal qui orchestre tous les autres.

```tsx
import { IthyStyleRenderer } from '@/components/presentation';

<IthyStyleRenderer
  title="Titre de l'article"
  sections={sections}
  sources={sources}
  faqs={faqs}
  charts={charts}
  metadata={metadata}
/>
```

### 2. `ChartRenderer`
Rendu de graphiques avec Recharts.

```tsx
<ChartRenderer
  chart={{
    type: 'comparison',
    title: 'Comparaison DZ/CH',
    data: [
      { criterion: 'Délai', algerie: 21, suisse: 10 }
    ]
  }}
/>
```

**Types supportés:**
- `radar` - Graphique radar multicritères
- `bar` - Graphique en barres
- `pie` - Camembert
- `comparison` - Comparaison horizontale DZ/CH

### 3. `ComparisonTable`
Tableau comparatif avec drapeaux.

```tsx
<ComparisonTable
  title="Comparaison des procédures"
  rows={[
    {
      criterion: 'Délai moyen',
      algerie: '2-4 semaines',
      suisse: '1-2 semaines',
      notes: 'Variable selon canton'
    }
  ]}
  showFlags={true}
/>
```

### 4. `ExpandableFAQ`
FAQ avec expand/collapse animé.

```tsx
<ExpandableFAQ
  items={[
    {
      question: 'Question ?',
      answer: 'Réponse détaillée',
      category: 'Catégorie',
      relatedSources: ['Source 1', 'Source 2']
    }
  ]}
/>
```

### 5. `SourceCitation`
Citations avec pertinence et liens.

```tsx
<SourceCitation
  sources={[
    {
      id: '1',
      title: 'Code du commerce',
      type: 'law',
      country: 'DZ',
      reference: 'Loi n°90-10',
      date: '1990-04-14',
      url: 'https://...',
      relevance: 0.95
    }
  ]}
/>
```

**Types de sources:**
- `law` - Loi (icône balance)
- `decree` - Décret (icône document)
- `circular` - Circulaire
- `jurisprudence` - Jurisprudence
- `official` - Document officiel (icône bâtiment)
- `academic` - Académique

### 6. `LegalAlert`
Alertes juridiques colorées.

```tsx
<LegalAlert
  type="warning"
  title="Attention"
  content="Information importante"
  legalBasis="Code du commerce"
/>
```

**Types:**
- `warning` - Avertissement (orange)
- `info` - Information (bleu)
- `success` - Succès (vert)
- `error` - Erreur (rouge)

## 🔄 Transformer

Le `responseTransformer` convertit les réponses RAG brutes en format ithy.

```tsx
import { transformToIthyFormat } from '@/lib/rag/responseTransformer';

const rawResponse = {
  query: "Comment créer une entreprise ?",
  answers: [
    {
      agentId: "juridique-dz",
      agentName: "Agent Juridique Algérie",
      content: "En Algérie...",
      sources: ["cnrc"],
      language: "fr"
    }
  ],
  sources: [...],
  confidence: 0.89
};

const ithyData = transformToIthyFormat(rawResponse);
```

### Fonctions du transformer

#### `transformToIthyFormat(rawResponse)`
Fonction principale de transformation.

#### `createDemoResponse()`
Crée une réponse de démonstration complète.

## 🎯 Utilisation Complète

### Exemple 1: Intégration dans un chat RAG

```tsx
import { IthyStyleRenderer } from '@/components/presentation';
import { transformToIthyFormat } from '@/lib/rag/responseTransformer';

function RAGChatResponse({ rawResponse }) {
  const ithyData = transformToIthyFormat(rawResponse);

  return (
    <div className="chat-response">
      <IthyStyleRenderer {...ithyData} />
    </div>
  );
}
```

### Exemple 2: Page de démonstration

```tsx
import { IthyStyleRenderer } from '@/components/presentation';
import { createDemoResponse } from '@/lib/rag/responseTransformer';

function IthyDemo() {
  const demoData = createDemoResponse();
  return <IthyStyleRenderer {...demoData} />;
}
```

## 🎨 Personnalisation

### Couleurs

Les couleurs sont adaptées au contexte binational:

```css
/* Algérie */
--color-dz-green: #006233;
--color-dz-red: #D21034;

/* Suisse */
--color-ch-red: #FF0000;
```

### Thème Dark

Le système utilise Tailwind CSS avec classes dark:

- Backgrounds: `bg-gray-800`, `bg-gray-900`
- Borders: `border-gray-700`
- Text: `text-gray-100`, `text-gray-300`

## 📊 Types TypeScript

Tous les types sont exportés depuis `types.ts`:

```tsx
import type {
  IthyResponseProps,
  Section,
  Source,
  FAQ,
  ChartData,
  ResponseMetadata,
  ComparisonRow,
  LegalAlertProps
} from '@/components/presentation/types';
```

## 🌍 Support Multilingue

Le système détecte automatiquement la langue:

```tsx
{
  metadata: {
    language: 'fr' | 'ar' | 'de' | 'amazigh'
  }
}
```

### RTL pour l'arabe

Ajouter l'attribut `dir="rtl"` au parent:

```tsx
<div dir={metadata.language === 'ar' ? 'rtl' : 'ltr'}>
  <IthyStyleRenderer {...data} />
</div>
```

## 🚀 Démo Live

Accéder à la page de démonstration:

```
http://localhost:8182/ithy-demo
```

## 📦 Dépendances

```json
{
  "recharts": "^2.x",
  "lucide-react": "^0.x"
}
```

## 🏗️ Architecture

```
components/presentation/
├── types.ts                    # Types TypeScript
├── IthyStyleRenderer.tsx       # Composant principal
├── ChartRenderer.tsx           # Graphiques
├── ComparisonTable.tsx         # Tableaux comparatifs
├── ExpandableFAQ.tsx          # FAQ
├── SourceCitation.tsx         # Citations
├── LegalAlert.tsx             # Alertes
└── index.ts                   # Exports

lib/rag/
└── responseTransformer.ts     # Logique de transformation
```

## ⚡ Performance

### Optimisations

- Composants React.memo pour éviter re-renders
- Lazy loading des charts
- Pagination des sources (si > 20)
- Debounce sur FAQ expand/collapse

### Bundle Size

- Recharts: ~400KB (gzipped: ~120KB)
- Composants: ~50KB (gzipped: ~15KB)

## 🐛 Troubleshooting

### Erreur: "recharts not found"

```bash
cd frontend/archon-ui
npm install recharts
```

### Charts ne s'affichent pas

Vérifier que `ResponsiveContainer` a une hauteur:

```tsx
<div style={{ height: 300 }}>
  <ChartRenderer chart={chart} />
</div>
```

### Types TypeScript manquants

```bash
npm install --save-dev @types/react @types/recharts
```

## 📚 Ressources

- [Recharts Documentation](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contribution

Pour ajouter un nouveau type de section:

1. Ajouter le type dans `types.ts`
2. Créer le composant correspondant
3. Ajouter le case dans `SectionRenderer`
4. Mettre à jour `responseTransformer.ts`

## 📄 License

Propriété IA Factory - Usage interne

---

**Créé par:** IA Factory Team
**Date:** 2025-01-18
**Version:** 1.0.0
**Région:** Algérie 🇩🇿 / Suisse 🇨🇭
