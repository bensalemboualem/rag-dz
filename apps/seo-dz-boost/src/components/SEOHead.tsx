import React from "react";

export interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  twitterCard?: "summary" | "summary_large_image";
  schemaJson?: object | object[];
  noIndex?: boolean;
  locale?: string;
}

/**
 * SEOHead - Composant React pour injection SEO dans le <head>
 * 
 * Usage:
 * <SEOHead 
 *   title="Pack PME DZ – Assistant IA fiscal & juridique pour PME en Algérie"
 *   description="Simplifiez la gestion de votre PME avec l'IA. Fiscalité, juridique, documents automatisés."
 *   keywords={["IA Algérie", "assistant fiscal", "PME DZ"]}
 *   canonical="https://www.iafactoryalgeria.com/pme"
 * />
 * 
 * Note: En production avec Next.js, utiliser next/head ou metadata API.
 * Ce composant fonctionne avec React Helmet ou injection manuelle.
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = [],
  canonical,
  ogImage = "https://www.iafactoryalgeria.com/og-image.png",
  ogType = "website",
  twitterCard = "summary_large_image",
  schemaJson,
  noIndex = false,
  locale = "fr_DZ",
}) => {
  const baseUrl = "https://www.iafactoryalgeria.com";
  const fullCanonical = canonical || baseUrl;
  
  // Générer le JSON-LD pour Schema.org
  const schemaScript = schemaJson
    ? JSON.stringify(Array.isArray(schemaJson) ? schemaJson : schemaJson)
    : null;

  return (
    <>
      {/* Document Head - Utiliser React Helmet en production */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}
      <meta name="author" content="iaFactory Algeria" />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={fullCanonical} />
      
      {/* Langue et région */}
      <meta httpEquiv="content-language" content="fr-DZ" />
      <meta name="geo.region" content="DZ" />
      <meta name="geo.placename" content="Algeria" />
      
      {/* Open Graph (Facebook, LinkedIn) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content="iaFactory Algeria" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@iafactorydz" />
      <meta name="twitter:creator" content="@iafactorydz" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Schema.org JSON-LD */}
      {schemaScript && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaScript }}
        />
      )}
    </>
  );
};

/**
 * Schémas JSON-LD prédéfinis pour réutilisation
 */
export const SEOSchemas = {
  // Organisation principale
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "iaFactory Algeria",
    "alternateName": "iaFactory DZ",
    "url": "https://www.iafactoryalgeria.com",
    "logo": "https://www.iafactoryalgeria.com/logo.png",
    "description": "Plateforme IA & RAG pour entreprises en Algérie. Assistant fiscal, juridique et administratif.",
    "foundingDate": "2024",
    "foundingLocation": {
      "@type": "Place",
      "name": "Alger, Algérie"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Algeria"
    },
    "sameAs": [
      "https://www.linkedin.com/company/iafactoryalgeria",
      "https://twitter.com/iafactorydz",
      "https://facebook.com/iafactoryalgeria",
      "https://instagram.com/iafactoryalgeria"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+213-555-123-456",
      "contactType": "customer service",
      "email": "contact@iafactoryalgeria.com",
      "availableLanguage": ["French", "Arabic"]
    }
  },

  // Produit Pack PME DZ
  packPMEDZ: {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Pack PME DZ",
    "description": "Assistant IA complet pour PME, freelances et commerçants algériens. Modules fiscal, juridique, documents automatisés, CRM.",
    "brand": {
      "@type": "Brand",
      "name": "iaFactory Algeria"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Gratuit",
        "price": "0",
        "priceCurrency": "DZD",
        "description": "100 crédits/mois, accès basique"
      },
      {
        "@type": "Offer",
        "name": "PME Pro",
        "price": "3900",
        "priceCurrency": "DZD",
        "description": "3 000 crédits/mois, modules avancés"
      },
      {
        "@type": "Offer",
        "name": "PME Business",
        "price": "8900",
        "priceCurrency": "DZD",
        "description": "10 000 crédits/mois, API illimitée, support prioritaire"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  },

  // Service Assistant Fiscal
  assistantFiscal: {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Assistant Fiscal IA Algérie",
    "description": "Assistant IA spécialisé en fiscalité algérienne : IFU, IRG, TAP, TVA, CASNOS, CNAS. Réponses instantanées basées sur les textes officiels.",
    "provider": {
      "@type": "Organization",
      "name": "iaFactory Algeria"
    },
    "serviceType": "Conseil fiscal automatisé",
    "areaServed": {
      "@type": "Country",
      "name": "Algeria"
    }
  },

  // Service Assistant Juridique
  assistantJuridique: {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Assistant Juridique IA Algérie",
    "description": "Assistant IA pour le droit des affaires en Algérie : procédures CNRC, CNAS, CASNOS, modèles de contrats, obligations légales.",
    "provider": {
      "@type": "Organization",
      "name": "iaFactory Algeria"
    },
    "serviceType": "Conseil juridique automatisé",
    "areaServed": {
      "@type": "Country",
      "name": "Algeria"
    }
  },

  // Software/API
  apiIAAlgerie: {
    "@context": "https://schema.org",
    "@type": "WebAPI",
    "name": "API IA Algérie",
    "description": "API RESTful pour intégrer l'IA spécialisée Algérie dans vos applications. RAG, fiscalité, juridique, documents.",
    "provider": {
      "@type": "Organization",
      "name": "iaFactory Algeria"
    },
    "documentation": "https://www.iafactoryalgeria.com/docs",
    "termsOfService": "https://www.iafactoryalgeria.com/cgu"
  },

  // FAQ Schema
  createFAQSchema: (faqs: { question: string; answer: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }),

  // Breadcrumb Schema
  createBreadcrumbSchema: (items: { name: string; url: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }),

  // Article Schema (pour blog)
  createArticleSchema: (article: {
    title: string;
    description: string;
    url: string;
    image: string;
    datePublished: string;
    dateModified: string;
    author: string;
  }) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "url": article.url,
    "image": article.image,
    "datePublished": article.datePublished,
    "dateModified": article.dateModified,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "iaFactory Algeria",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.iafactoryalgeria.com/logo.png"
      }
    }
  })
};

export default SEOHead;
