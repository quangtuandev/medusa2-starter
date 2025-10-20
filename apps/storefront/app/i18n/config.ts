import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import vi from './locales/vi.json';

export const defaultNS = 'common';
export const resources = {
  en: {
    common: en,
  },
  vi: {
    common: vi,
  },
} as const;

export const supportedLanguages = ['en', 'vi'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'en',
    defaultNS,
    ns: ['common'],
    resources,
    supportedLngs: supportedLanguages,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
