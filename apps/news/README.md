# 📰 News DZ - Agrégateur Presse Algérienne

Application web pour agréger et afficher les actualités de 20+ sources de presse algérienne en temps réel.

## 🌟 Fonctionnalités

- ✅ **20+ sources** de presse algérienne (El Watan, TSA, DZFoot, CompétitionDZ, etc.)
- ✅ **Agrégation RSS** en temps réel
- ✅ **Catégories**: Actualités, Sport, Économie, Culture, Tech
- ✅ **Recherche** dans tous les articles
- ✅ **Filtrage** par catégorie et langue (FR/AR)
- ✅ **Design responsive** avec dark mode
- ✅ **Auto-refresh** des articles

## 📚 Sources Incluses

### Généraliste
- El Watan
- TSA (Tout Sur l'Algérie)
- Liberté Algérie
- Le Quotidien d'Oran
- El Khabar (الخبر)
- Echorouk (الشروق)
- APS (Algérie Presse Service)

### Sport
- CompétitionDZ
- DZFoot
- Le Buteur
- El Heddaf (الهداف)

### Économie
- Algérie Eco
- APS Économie
- Maghreb Émergent

### Culture & Tech
- Dzair Daily
- Algérie Focus

### TV/Radio
- Echorouk TV
- El Bilad TV
- Radio Algérie
- Algérie 360

## 🚀 Démarrage Rapide

### Installation

```bash
cd D:\IAFactory\rag-dz\apps\news-dz

# Installer dépendances
npm install

# Lancer en développement
npm run dev
```

L'app sera accessible sur **http://localhost:3003**

### Build Production

```bash
npm run build
npm start
```

## 📁 Structure

```
news-dz/
├── app/
│   ├── page.tsx                    # Homepage (grid articles)
│   ├── layout.tsx                  # Layout global
│   ├── globals.css                 # Styles globaux
│   ├── components/
│   │   ├── ArticleCard.tsx         # Card article
│   │   ├── CategoryFilter.tsx      # Filtres catégories
│   │   └── SearchBar.tsx           # Barre de recherche
│   └── api/
│       └── rss/route.ts            # API pour RSS parsing
├── lib/
│   └── rss.ts                      # Utilitaires RSS
├── data/
│   └── sources.ts                  # 20+ sources avec URLs RSS
├── package.json
├── tailwind.config.ts
└── README.md
```

## 🎨 Design

- **Couleurs**: Vert/Rouge Algérie + Bleu news
- **Dark mode**: Natif
- **Responsive**: Mobile-first
- **Components**: Cards, badges, filters
- **Animations**: Fade-in, skeleton loaders

## 🔧 Technologies

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **rss-parser** (parsing RSS)
- **date-fns** (manipulation dates)
- **lucide-react** (icônes)

## 📡 API

### GET /api/rss

Récupère les articles agrégés depuis les sources RSS.

**Paramètres**:
- `category` (optionnel): `all`, `general`, `sport`, `economy`, `culture`, `tech`
- `language` (optionnel): `fr`, `ar`, `both`
- `limit` (optionnel): Nombre max d'articles (défaut: 50)

**Exemple**:
```bash
GET /api/rss?category=sport&limit=20
```

**Réponse**:
```json
{
  "success": true,
  "count": 20,
  "articles": [
    {
      "id": "...",
      "title": "...",
      "link": "...",
      "pubDate": "...",
      "contentSnippet": "...",
      "source": {
        "id": "dzfoot",
        "name": "DZFoot"
      }
    }
  ]
}
```

## 🎯 Fonctionnalités Clés

### Agrégation RSS

Le système utilise `rss-parser` pour:
- Fetcher les flux RSS de toutes les sources
- Parser le contenu (titre, lien, date, images)
- Trier par date (plus récent en premier)
- Gérer les erreurs (timeout, sources down)

### Filtrage

- **Par catégorie**: Actualités, Sport, Économie, Culture, Tech
- **Par recherche**: Titre, contenu, source
- **Par langue**: Français, Arabe, ou les deux

### Performance

- **Cache côté serveur** (Next.js)
- **Lazy loading** des images
- **Skeleton loaders** pendant chargement
- **Pagination** (100 articles max par page)

## 🚀 Améliorations Futures

### Phase 2
- [ ] PWA (installable, offline)
- [ ] Notifications push (nouveaux articles)
- [ ] Bookmarks (sauvegarder articles)
- [ ] Partage social
- [ ] Mode lecture

### Phase 3
- [ ] Tendances (top sujets)
- [ ] Analytics (articles les plus lus)
- [ ] Alertes personnalisées
- [ ] API publique
- [ ] Mobile apps (React Native)

## 📊 Sources de Données

Toutes les sources sont configurées dans `data/sources.ts`:

```typescript
export interface NewsSource {
  id: string;
  name: string;
  url: string;
  rssUrl: string;
  category: 'general' | 'sport' | 'economy' | 'culture' | 'tech';
  language: 'fr' | 'ar' | 'both';
  priority: number; // 1-5 (5 = highest)
}
```

Pour ajouter une nouvelle source:
1. Ajouter dans `NEWS_SOURCES` array
2. Vérifier que le RSS fonctionne
3. Tester localement

## 🐛 Troubleshooting

### Certaines sources ne chargent pas

Vérifier:
- URL RSS valide (`rssUrl`)
- Timeout (défaut: 5s, peut être insuffisant)
- CORS (certains sites bloquent les requêtes)

### Pas d'images

Les images proviennent de:
1. Champ `enclosure` du RSS
2. Extraction depuis le contenu HTML

Si aucune image, la card s'adapte automatiquement.

### Erreurs de parsing

Vérifier la console pour les erreurs spécifiques:
```bash
Error fetching RSS from [Source]: ...
```

## 📄 Licence

© 2025 IA Factory - Made with ❤️ in Algeria 🇩🇿

---

**Toute l'actualité algérienne, en temps réel! 📰🇩🇿**
