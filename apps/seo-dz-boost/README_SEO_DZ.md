# 📈 SEO-DZ-Boost - Guide de Référencement

Module SEO pour iaFactory Algeria - Optimisation du référencement Google en Algérie.

## 📋 Table des Matières

1. [Structure du Module](#structure-du-module)
2. [Pages SEO Ciblées](#pages-seo-ciblées)
3. [Composant SEOHead](#composant-seohead)
4. [Analytics & Tracking](#analytics--tracking)
5. [Sitemap & Robots](#sitemap--robots)
6. [Google Search Console](#google-search-console)
7. [Ajouter une Nouvelle Page SEO](#ajouter-une-nouvelle-page-seo)
8. [Mots-Clés Cibles](#mots-clés-cibles)
9. [Checklist SEO](#checklist-seo)

---

## 🗂️ Structure du Module

```
apps/seo-dz-boost/
├── public/
│   ├── sitemap.xml          # Plan du site pour Google
│   └── robots.txt           # Instructions crawlers
├── pages/
│   ├── ia-algerie.html      # Page "IA Algérie / RAG-DZ"
│   ├── assistant-fiscal-algerie.html
│   ├── assistant-juridique-algerie.html
│   ├── creation-entreprise-algerie-ia.html
│   └── api-ia-algerie.html
├── src/
│   └── components/
│       ├── SEOHead.tsx      # Composant meta tags
│       └── AnalyticsTracker.tsx
└── README_SEO_DZ.md         # Cette documentation
```

---

## 🎯 Pages SEO Ciblées

| URL | Mot-Clé Principal | Description |
|-----|-------------------|-------------|
| `/ia-algerie` | IA Algérie, RAG Algérie | Présentation de RAG-DZ et de l'IA spécialisée |
| `/assistant-fiscal-algerie` | Assistant fiscal Algérie | IFU, IRG, TVA, CASNOS, simulations |
| `/assistant-juridique-algerie` | Assistant juridique Algérie | CNRC, CNAS, contrats, droit des affaires |
| `/creation-entreprise-algerie-ia` | Création entreprise Algérie | Guide étape par étape avec IA |
| `/api-ia-algerie` | API IA Algérie | Documentation API pour développeurs |

### Maillage Interne

Chaque page doit contenir des liens vers :
- `/pme` (Pack PME DZ)
- `/startup` (StartupDZ Onboarding)
- `/hub/` (Accès à l'assistant)
- `/docs` (Documentation API)
- Les autres pages SEO du module

---

## 🏷️ Composant SEOHead

### Usage Basique

```tsx
import { SEOHead, SEOSchemas } from '../components/SEOHead';

function MyPage() {
  return (
    <>
      <SEOHead
        title="Pack PME DZ – Assistant IA pour PME en Algérie"
        description="Simplifiez la gestion de votre PME avec l'IA. Fiscalité, juridique, documents automatisés."
        keywords={["IA Algérie", "assistant fiscal", "PME DZ", "CASNOS"]}
        canonical="https://www.iafactoryalgeria.com/pme"
        schemaJson={SEOSchemas.packPMEDZ}
      />
      {/* Contenu de la page */}
    </>
  );
}
```

### Props Disponibles

| Prop | Type | Description |
|------|------|-------------|
| `title` | string | Titre de la page (< 60 caractères) |
| `description` | string | Meta description (140-160 caractères) |
| `keywords` | string[] | Mots-clés pertinents |
| `canonical` | string | URL canonique |
| `ogImage` | string | Image Open Graph (1200x630px) |
| `ogType` | "website" \| "article" \| "product" | Type de contenu |
| `schemaJson` | object | Données structurées JSON-LD |
| `noIndex` | boolean | Exclure de l'indexation |

### Schémas Prédéfinis

```tsx
import { SEOSchemas } from '../components/SEOHead';

// Organisation principale
SEOSchemas.organization

// Produit Pack PME DZ
SEOSchemas.packPMEDZ

// Service Assistant Fiscal
SEOSchemas.assistantFiscal

// Service Assistant Juridique
SEOSchemas.assistantJuridique

// API IA
SEOSchemas.apiIAAlgerie

// Créer une FAQ
SEOSchemas.createFAQSchema([
  { question: "...", answer: "..." }
])

// Créer un fil d'Ariane
SEOSchemas.createBreadcrumbSchema([
  { name: "Accueil", url: "https://..." },
  { name: "Fiscal", url: "https://..." }
])
```

---

## 📊 Analytics & Tracking

### Configuration

Variables d'environnement dans `.env` :

```env
# Provider: ga4 | plausible | matomo | none
VITE_ANALYTICS_PROVIDER=plausible

# ID du site
VITE_ANALYTICS_ID=iafactoryalgeria.com

# Pour Plausible
VITE_ANALYTICS_DOMAIN=iafactoryalgeria.com

# Pour Matomo (self-hosted)
VITE_MATOMO_URL=https://analytics.monserveur.com
```

### Usage

```tsx
import { AnalyticsTracker, trackEvent, trackConversion } from '../components/AnalyticsTracker';

function App() {
  return (
    <>
      <AnalyticsTracker />
      {/* ... */}
    </>
  );
}

// Tracker un événement
trackEvent("CTA", "click", "hero_button");

// Tracker une conversion
trackConversion("signup", 100);
```

### Recommandations

| Provider | Avantages | Inconvénients |
|----------|-----------|---------------|
| **Plausible** | Privacy-friendly, léger, conforme RGPD | Payant |
| **GA4** | Gratuit, puissant, intégration Google | Lourd, RGPD complexe |
| **Matomo** | Self-hosted, contrôle total | Maintenance serveur |

---

## 🗺️ Sitemap & Robots

### Sitemap (`public/sitemap.xml`)

Le sitemap inclut toutes les URLs importantes avec :
- `<loc>` : URL complète
- `<lastmod>` : Date de dernière modification
- `<changefreq>` : Fréquence de mise à jour
- `<priority>` : Priorité (0.0 à 1.0)

**Mettre à jour le sitemap :**

1. Modifier `public/sitemap.xml`
2. Mettre à jour `<lastmod>` avec la date actuelle
3. Re-déployer

**Pour automatiser (Next.js) :**

```typescript
// pages/api/sitemap.ts
export default function handler(req, res) {
  const urls = [
    { loc: '/', priority: 1.0 },
    { loc: '/pme', priority: 0.9 },
    // ...
  ];
  
  const sitemap = generateSitemap(urls);
  res.setHeader('Content-Type', 'application/xml');
  res.send(sitemap);
}
```

### Robots.txt

```
User-agent: *
Allow: /

Sitemap: https://www.iafactoryalgeria.com/sitemap.xml
```

---

## 🔍 Google Search Console

### Étape 1 : Vérifier le domaine

1. Aller sur [Search Console](https://search.google.com/search-console)
2. Ajouter la propriété `https://www.iafactoryalgeria.com`
3. Vérifier via :
   - Enregistrement DNS TXT (recommandé)
   - Fichier HTML sur le serveur
   - Meta tag dans le `<head>`

### Étape 2 : Soumettre le sitemap

1. Dans Search Console > Sitemaps
2. Ajouter : `https://www.iafactoryalgeria.com/sitemap.xml`
3. Vérifier le statut "Réussi"

### Étape 3 : Vérifier l'indexation

1. Aller dans "Pages"
2. Vérifier que les pages sont indexées
3. Corriger les erreurs signalées

### Étape 4 : Suivre les performances

- Clics, impressions, CTR, position moyenne
- Requêtes de recherche populaires
- Pages les plus visitées

---

## ➕ Ajouter une Nouvelle Page SEO

### 1. Créer la page HTML

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Mon Titre SEO – iaFactory Algeria</title>
    <meta name="description" content="Ma description 140-160 caractères.">
    <meta name="keywords" content="mot-clé 1, mot-clé 2, Algérie">
    <link rel="canonical" href="https://www.iafactoryalgeria.com/ma-page">
    
    <!-- Open Graph -->
    <meta property="og:title" content="..." />
    <meta property="og:description" content="..." />
    <meta property="og:url" content="https://..." />
    <meta property="og:image" content="https://..." />
    
    <!-- Schema.org -->
    <script type="application/ld+json">
    { "@context": "https://schema.org", ... }
    </script>
</head>
<body>
    <!-- H1 unique avec mot-clé principal -->
    <h1>Mon Titre Principal avec Mot-Clé</h1>
    
    <!-- Sections avec H2/H3 -->
    <section>
        <h2>Sous-titre avec mot-clé secondaire</h2>
        <p>Contenu optimisé mentionnant "Algérie" naturellement...</p>
    </section>
    
    <!-- CTA -->
    <a href="/hub/">Essayer gratuitement</a>
    
    <!-- Liens internes -->
    <a href="/pme">Pack PME DZ</a>
    <a href="/assistant-fiscal-algerie">Assistant Fiscal</a>
</body>
</html>
```

### 2. Mettre à jour le sitemap

Ajouter dans `public/sitemap.xml` :

```xml
<url>
    <loc>https://www.iafactoryalgeria.com/ma-nouvelle-page</loc>
    <lastmod>2025-11-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
</url>
```

### 3. Ajouter des liens internes

Depuis les autres pages, ajouter des liens vers la nouvelle page :
- Dans le footer
- Dans le corps du texte (contextuellement)
- Dans la navigation si pertinent

### 4. Soumettre à Google

1. Aller sur Search Console
2. Inspecter l'URL
3. Demander l'indexation

---

## 🎯 Mots-Clés Cibles

### Mots-Clés Principaux

| Mot-Clé | Volume (estimé) | Difficulté | Page Cible |
|---------|-----------------|------------|------------|
| IA Algérie | Élevé | Moyen | /ia-algerie |
| assistant fiscal Algérie | Moyen | Faible | /assistant-fiscal-algerie |
| assistant juridique Algérie | Moyen | Faible | /assistant-juridique-algerie |
| création entreprise Algérie | Élevé | Élevé | /creation-entreprise-algerie-ia |
| RAG Algérie | Faible | Très faible | /ia-algerie |
| API IA Algérie | Faible | Très faible | /api-ia-algerie |

### Mots-Clés Secondaires

- IFU Algérie
- IRG Algérie
- CASNOS freelance
- CNAS employeur
- CNRC création société
- TVA Algérie
- contrat travail CDD Algérie
- import export Algérie

### Longue Traîne

- "comment créer une EURL en Algérie"
- "quel est le taux IFU 2025"
- "obligations CASNOS freelance"
- "documents pour registre commerce Algérie"
- "assistant IA fiscalité algérienne"

---

## ✅ Checklist SEO

### Technique

- [ ] HTTPS activé
- [ ] Sitemap.xml soumis à Search Console
- [ ] Robots.txt configuré
- [ ] Temps de chargement < 3s
- [ ] Mobile-friendly (responsive)
- [ ] Core Web Vitals optimisés

### On-Page

- [ ] Title unique et < 60 caractères
- [ ] Meta description 140-160 caractères
- [ ] H1 unique avec mot-clé principal
- [ ] Structure H2/H3 logique
- [ ] Mot-clé dans les 100 premiers mots
- [ ] Images avec attribut alt
- [ ] Liens internes (3-5 par page)
- [ ] URL propre et descriptive

### Contenu

- [ ] Contenu original et utile
- [ ] Minimum 800 mots par page
- [ ] Mentions naturelles de "Algérie"
- [ ] FAQ avec questions réelles
- [ ] CTA clairs

### Données Structurées

- [ ] Schema Organization sur homepage
- [ ] Schema Service/Product selon la page
- [ ] Schema FAQ si applicable
- [ ] Schema BreadcrumbList
- [ ] Test avec Google Rich Results Test

### Tracking

- [ ] Analytics configuré (Plausible/GA4)
- [ ] Search Console vérifié
- [ ] Events tracking sur CTAs

---

## 🚀 Déploiement

### Docker

```dockerfile
FROM nginx:alpine
COPY public/ /usr/share/nginx/html/
COPY pages/ /usr/share/nginx/html/
EXPOSE 80
```

### Nginx Config

```nginx
location /sitemap.xml {
    alias /usr/share/nginx/html/sitemap.xml;
}

location /robots.txt {
    alias /usr/share/nginx/html/robots.txt;
}

location /ia-algerie {
    alias /usr/share/nginx/html/ia-algerie.html;
}
# ... autres pages
```

---

## 📞 Support

Pour toute question sur le SEO :
- Email : seo@iafactoryalgeria.com
- Documentation : /docs
- Slack : #seo-dz-boost

---

*Dernière mise à jour : 29 novembre 2025*
