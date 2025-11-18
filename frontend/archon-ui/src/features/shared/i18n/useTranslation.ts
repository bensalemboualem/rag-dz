/**
 * Hook pour utiliser les traductions
 */
import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { translations, Language } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Charger depuis localStorage ou navigateur
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'ar' || saved === 'fr' || saved === 'en')) {
      return saved;
    }

    // Détecter la langue du navigateur
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'ar') return 'ar';
    if (browserLang === 'fr') return 'fr';
    return 'en';
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    // Sauvegarder dans localStorage
    localStorage.setItem('language', language);

    // Mettre à jour l'attribut dir du document
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    // Naviguer dans l'objet de traductions avec la clé (ex: "nav.knowledgeBase")
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        // Fallback vers l'anglais si la clé n'existe pas
        let fallback: any = translations.en;
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object') {
            fallback = fallback[fk];
          } else {
            return key; // Retourner la clé si aucune traduction trouvée
          }
        }
        value = fallback;
        break;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Remplacer les paramètres {variable}
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() ?? match;
      });
    }

    return value;
  };

  const contextValue = { language, setLanguage, t, dir };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }
  return context;
}
