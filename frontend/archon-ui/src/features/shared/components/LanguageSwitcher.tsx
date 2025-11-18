/**
 * Sélecteur de langue AR/FR/EN
 */
import { Languages } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '../i18n/useTranslation.tsx';
import { Language } from '../i18n/translations';

const languageNames: Record<Language, string> = {
  ar: 'العربية',
  fr: 'Français',
  en: 'English',
};

const languageFlags: Record<Language, string> = {
  ar: '🇩🇿',
  fr: '🇫🇷',
  en: '🇬🇧',
};

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages: Language[] = ['ar', 'fr', 'en'];

  return (
    <div className="relative">
      {/* Bouton */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-white"
        title="Change language"
      >
        <Languages className="w-4 h-4" />
        <span className="text-sm font-medium">
          {languageFlags[language]} {languageNames[language]}
        </span>
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <>
          {/* Overlay pour fermer au clic */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-full mt-2 right-0 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50 min-w-[160px]">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors text-left
                  ${language === lang ? 'bg-blue-600 text-white' : 'text-gray-300'}
                `}
              >
                <span className="text-xl">{languageFlags[lang]}</span>
                <span className="font-medium">{languageNames[lang]}</span>
                {language === lang && (
                  <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
