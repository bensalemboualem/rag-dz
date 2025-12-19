import React, { useEffect } from "react";

export type AnalyticsProvider = "ga4" | "plausible" | "matomo" | "none";

export interface AnalyticsConfig {
  provider: AnalyticsProvider;
  siteId: string;
  domain?: string; // Pour Plausible
  matomoUrl?: string; // Pour Matomo
}

interface AnalyticsTrackerProps {
  config?: AnalyticsConfig;
}

/**
 * AnalyticsTracker - Composant pour intégrer différents fournisseurs d'analytics
 * 
 * Configuration via variables d'environnement :
 * - VITE_ANALYTICS_PROVIDER: "ga4" | "plausible" | "matomo" | "none"
 * - VITE_ANALYTICS_ID: ID du site/propriété
 * - VITE_ANALYTICS_DOMAIN: Domaine pour Plausible
 * - VITE_MATOMO_URL: URL du serveur Matomo
 * 
 * Usage:
 * <AnalyticsTracker />
 * 
 * Ou avec config explicite:
 * <AnalyticsTracker config={{ provider: "plausible", siteId: "iafactoryalgeria.com" }} />
 */
export const AnalyticsTracker: React.FC<AnalyticsTrackerProps> = ({ config }) => {
  // Récupérer la config depuis les env vars si non fournie
  const analyticsConfig: AnalyticsConfig = config || {
    provider: (import.meta.env.VITE_ANALYTICS_PROVIDER as AnalyticsProvider) || "none",
    siteId: import.meta.env.VITE_ANALYTICS_ID || "",
    domain: import.meta.env.VITE_ANALYTICS_DOMAIN || "",
    matomoUrl: import.meta.env.VITE_MATOMO_URL || "",
  };

  useEffect(() => {
    if (analyticsConfig.provider === "none" || !analyticsConfig.siteId) {
      console.log("[Analytics] Tracking désactivé");
      return;
    }

    switch (analyticsConfig.provider) {
      case "ga4":
        loadGA4(analyticsConfig.siteId);
        break;
      case "plausible":
        loadPlausible(analyticsConfig.domain || window.location.hostname);
        break;
      case "matomo":
        loadMatomo(analyticsConfig.matomoUrl || "", analyticsConfig.siteId);
        break;
    }
  }, [analyticsConfig]);

  return null; // Ce composant n'affiche rien
};

/**
 * Google Analytics 4
 */
function loadGA4(measurementId: string) {
  // Éviter le double chargement
  if (document.getElementById("ga4-script")) return;

  // Charger le script gtag.js
  const script = document.createElement("script");
  script.id = "ga4-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialiser gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  gtag("js", new Date());
  gtag("config", measurementId, {
    anonymize_ip: true, // RGPD
    cookie_flags: "SameSite=None;Secure",
  });

  // Exposer gtag globalement
  window.gtag = gtag;

  console.log(`[Analytics] GA4 chargé: ${measurementId}`);
}

/**
 * Plausible Analytics (privacy-friendly)
 */
function loadPlausible(domain: string) {
  // Éviter le double chargement
  if (document.getElementById("plausible-script")) return;

  const script = document.createElement("script");
  script.id = "plausible-script";
  script.defer = true;
  script.dataset.domain = domain;
  script.src = "https://plausible.io/js/script.js";
  document.head.appendChild(script);

  console.log(`[Analytics] Plausible chargé: ${domain}`);
}

/**
 * Matomo (self-hosted analytics)
 */
function loadMatomo(matomoUrl: string, siteId: string) {
  // Éviter le double chargement
  if (document.getElementById("matomo-script")) return;

  // Variable globale Matomo
  window._paq = window._paq || [];
  window._paq.push(["trackPageView"]);
  window._paq.push(["enableLinkTracking"]);

  const script = document.createElement("script");
  script.id = "matomo-script";
  script.async = true;
  script.src = `${matomoUrl}/matomo.js`;
  document.head.appendChild(script);

  window._paq.push(["setTrackerUrl", `${matomoUrl}/matomo.php`]);
  window._paq.push(["setSiteId", siteId]);

  console.log(`[Analytics] Matomo chargé: ${matomoUrl} (site ${siteId})`);
}

/**
 * Helpers pour tracking d'événements
 */
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  const provider = import.meta.env.VITE_ANALYTICS_PROVIDER;

  switch (provider) {
    case "ga4":
      if (window.gtag) {
        window.gtag("event", action, {
          event_category: category,
          event_label: label,
          value: value,
        });
      }
      break;
    case "plausible":
      if (window.plausible) {
        window.plausible(action, {
          props: { category, label, value },
        });
      }
      break;
    case "matomo":
      if (window._paq) {
        window._paq.push(["trackEvent", category, action, label, value]);
      }
      break;
  }
};

/**
 * Tracking de page vue (pour SPA)
 */
export const trackPageView = (path?: string) => {
  const provider = import.meta.env.VITE_ANALYTICS_PROVIDER;
  const pagePath = path || window.location.pathname;

  switch (provider) {
    case "ga4":
      if (window.gtag) {
        window.gtag("event", "page_view", {
          page_path: pagePath,
        });
      }
      break;
    case "plausible":
      // Plausible track automatiquement les changements de page
      break;
    case "matomo":
      if (window._paq) {
        window._paq.push(["setCustomUrl", pagePath]);
        window._paq.push(["trackPageView"]);
      }
      break;
  }
};

/**
 * Tracking de conversion / objectif
 */
export const trackConversion = (goalName: string, value?: number) => {
  const provider = import.meta.env.VITE_ANALYTICS_PROVIDER;

  switch (provider) {
    case "ga4":
      if (window.gtag) {
        window.gtag("event", "conversion", {
          send_to: goalName,
          value: value,
        });
      }
      break;
    case "plausible":
      if (window.plausible) {
        window.plausible(goalName, { props: { value } });
      }
      break;
    case "matomo":
      if (window._paq) {
        window._paq.push(["trackGoal", goalName, value]);
      }
      break;
  }
};

// Types pour window
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    plausible: (event: string, options?: { props?: Record<string, unknown> }) => void;
    _paq: unknown[][];
  }
}

export default AnalyticsTracker;
