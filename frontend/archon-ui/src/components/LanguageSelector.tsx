import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇩🇿' },
];

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    // Apply RTL for Arabic
    document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = langCode;
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <Select.Root value={i18n.language} onValueChange={handleLanguageChange}>
      <Select.Trigger
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition-colors"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span>{currentLanguage.flag}</span>
        <span>{currentLanguage.name}</span>
        <Select.Icon>
          <ChevronDown className="w-4 h-4" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="overflow-hidden bg-gray-900 border border-white/10 rounded-lg shadow-xl"
          position="popper"
          sideOffset={5}
        >
          <Select.Viewport className="p-1">
            {languages.map((lang) => (
              <Select.Item
                key={lang.code}
                value={lang.code}
                className="relative flex items-center gap-3 px-3 py-2 text-sm rounded cursor-pointer hover:bg-white/10 focus:bg-white/10 outline-none transition-colors"
              >
                <span className="text-xl">{lang.flag}</span>
                <Select.ItemText>{lang.name}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
