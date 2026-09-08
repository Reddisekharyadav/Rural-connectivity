import { enTranslations } from '../en';
import { teTranslations } from '../te';
import { hiTranslations } from '../hi';

export type SupportedLocale = 'en' | 'te' | 'hi';

const localeDictionaries: Record<SupportedLocale, Record<string, string>> = {
  en: enTranslations,
  te: teTranslations,
  hi: hiTranslations,
};

export function translate(key: string, locale: SupportedLocale = 'en', fallback?: string): string {
  const dictionary = localeDictionaries[locale] || localeDictionaries['en'];
  if (dictionary[key]) {
    return dictionary[key];
  }

  // Fallback to English
  if (localeDictionaries['en'][key]) {
    return localeDictionaries['en'][key];
  }

  return fallback || key;
}

export const t = translate;

