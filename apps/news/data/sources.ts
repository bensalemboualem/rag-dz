// Sources de presse algérienne pour agrégation RSS

export interface NewsSource {
  id: string;
  name: string;
  nameAr?: string;
  url: string;
  rssUrl: string;
  category: 'general' | 'sport' | 'economy' | 'culture' | 'tech';
  language: 'fr' | 'ar' | 'both';
  logo?: string;
  priority: number; // 1-5 (5 = highest)
}

export const NEWS_SOURCES: NewsSource[] = [
  // === PRESSE ÉCRITE GÉNÉRALISTE ===
  {
    id: 'el-watan',
    name: 'El Watan',
    url: 'https://www.elwatan.com',
    rssUrl: 'https://www.elwatan.com/rss',
    category: 'general',
    language: 'fr',
    priority: 5,
  },
  {
    id: 'tsa',
    name: 'TSA - Tout Sur l\'Algérie',
    url: 'https://www.tsa-algerie.com',
    rssUrl: 'https://www.tsa-algerie.com/feed/',
    category: 'general',
    language: 'fr',
    priority: 5,
  },
  {
    id: 'liberte',
    name: 'Liberté Algérie',
    url: 'https://www.liberte-algerie.com',
    rssUrl: 'https://www.liberte-algerie.com/feed',
    category: 'general',
    language: 'fr',
    priority: 4,
  },
  {
    id: 'quotidien-oran',
    name: 'Le Quotidien d\'Oran',
    url: 'https://www.lequotidien-oran.com',
    rssUrl: 'https://www.lequotidien-oran.com/feed/',
    category: 'general',
    language: 'fr',
    priority: 4,
  },
  {
    id: 'el-khabar',
    name: 'El Khabar',
    nameAr: 'الخبر',
    url: 'https://www.elkhabar.com',
    rssUrl: 'https://www.elkhabar.com/rss',
    category: 'general',
    language: 'ar',
    priority: 5,
  },
  {
    id: 'echorouk',
    name: 'Echorouk',
    nameAr: 'الشروق',
    url: 'https://www.echoroukonline.com',
    rssUrl: 'https://www.echoroukonline.com/feed/',
    category: 'general',
    language: 'ar',
    priority: 5,
  },

  // === AGENCES DE PRESSE ===
  {
    id: 'aps',
    name: 'APS - Algérie Presse Service',
    url: 'https://www.aps.dz',
    rssUrl: 'https://www.aps.dz/rss',
    category: 'general',
    language: 'both',
    priority: 5,
  },

  // === SPORT ===
  {
    id: 'competition-dz',
    name: 'CompétitionDZ',
    url: 'https://www.competition.dz',
    rssUrl: 'https://www.competition.dz/feed/',
    category: 'sport',
    language: 'fr',
    priority: 5,
  },
  {
    id: 'dzfoot',
    name: 'DZFoot',
    url: 'https://www.dzfoot.com',
    rssUrl: 'https://www.dzfoot.com/feed/',
    category: 'sport',
    language: 'fr',
    priority: 5,
  },
  {
    id: 'le-buteur',
    name: 'Le Buteur',
    url: 'https://www.lebuteur.com',
    rssUrl: 'https://www.lebuteur.com/feed/',
    category: 'sport',
    language: 'fr',
    priority: 4,
  },
  {
    id: 'el-heddaf',
    name: 'El Heddaf',
    nameAr: 'الهداف',
    url: 'https://www.elheddaf.com',
    rssUrl: 'https://www.elheddaf.com/rss',
    category: 'sport',
    language: 'ar',
    priority: 5,
  },

  // === ÉCONOMIE ===
  {
    id: 'algerie-eco',
    name: 'Algérie Eco',
    url: 'https://www.algerie-eco.com',
    rssUrl: 'https://www.algerie-eco.com/feed/',
    category: 'economy',
    language: 'fr',
    priority: 4,
  },
  {
    id: 'aps-economie',
    name: 'APS Économie',
    url: 'https://www.aps.dz/economie',
    rssUrl: 'https://www.aps.dz/economie/rss',
    category: 'economy',
    language: 'fr',
    priority: 4,
  },
  {
    id: 'maghreb-emergent',
    name: 'Maghreb Émergent',
    url: 'https://www.maghrebemergent.com',
    rssUrl: 'https://www.maghrebemergent.com/feed/',
    category: 'economy',
    language: 'fr',
    priority: 3,
  },

  // === CULTURE & TECH ===
  {
    id: 'dzair-daily',
    name: 'Dzair Daily',
    url: 'https://www.dzairdaily.com',
    rssUrl: 'https://www.dzairdaily.com/feed/',
    category: 'culture',
    language: 'fr',
    priority: 3,
  },
  {
    id: 'algerie-focus',
    name: 'Algérie Focus',
    url: 'https://www.algerie-focus.com',
    rssUrl: 'https://www.algerie-focus.com/feed/',
    category: 'tech',
    language: 'fr',
    priority: 3,
  },

  // === TÉLÉVISION / RADIO (si RSS disponible) ===
  {
    id: 'echorouk-tv',
    name: 'Echorouk TV',
    nameAr: 'الشروق تيفي',
    url: 'https://www.echorouktv.com',
    rssUrl: 'https://www.echorouktv.com/feed/',
    category: 'general',
    language: 'ar',
    priority: 4,
  },
  {
    id: 'el-bilad-tv',
    name: 'El Bilad TV',
    nameAr: 'البلاد تيفي',
    url: 'https://www.elbilad.net',
    rssUrl: 'https://www.elbilad.net/feed/',
    category: 'general',
    language: 'ar',
    priority: 4,
  },

  // === PURE PLAYERS ===
  {
    id: 'algerie360',
    name: 'Algérie 360',
    url: 'https://www.algerie360.com',
    rssUrl: 'https://www.algerie360.com/feed/',
    category: 'general',
    language: 'fr',
    priority: 3,
  },
  {
    id: 'radio-algerie',
    name: 'Radio Algérie',
    url: 'https://www.radioalgerie.dz',
    rssUrl: 'https://www.radioalgerie.dz/news/fr/rss',
    category: 'general',
    language: 'both',
    priority: 4,
  },
];

// Helper functions
export function getSourcesByCategory(category: NewsSource['category']): NewsSource[] {
  return NEWS_SOURCES.filter(source => source.category === category)
    .sort((a, b) => b.priority - a.priority);
}

export function getSourcesByLanguage(language: NewsSource['language']): NewsSource[] {
  return NEWS_SOURCES.filter(
    source => source.language === language || source.language === 'both'
  ).sort((a, b) => b.priority - a.priority);
}

export function getTopSources(limit: number = 10): NewsSource[] {
  return NEWS_SOURCES
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit);
}

export function getSourceById(id: string): NewsSource | undefined {
  return NEWS_SOURCES.find(source => source.id === id);
}

export const CATEGORIES = [
  { id: 'all', name: 'Tout', nameAr: 'الكل', icon: '📰' },
  { id: 'general', name: 'Actualités', nameAr: 'أخبار', icon: '🗞️' },
  { id: 'sport', name: 'Sport', nameAr: 'رياضة', icon: '⚽' },
  { id: 'economy', name: 'Économie', nameAr: 'اقتصاد', icon: '💼' },
  { id: 'culture', name: 'Culture', nameAr: 'ثقافة', icon: '🎭' },
  { id: 'tech', name: 'Tech', nameAr: 'تكنولوجيا', icon: '💻' },
] as const;
