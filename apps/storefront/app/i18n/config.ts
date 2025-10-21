import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import vi from './locales/vi.json';

// Use a single namespace 'translation' to map the entire JSON content
export const defaultNS = 'translation';
export const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
} as const;

export const supportedLanguages = ['en', 'vi'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

// Initialize i18n; guard browser-only language detection to be SSR-safe
const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
  i18n.use(LanguageDetector);
}

// Initialize i18n synchronously first
i18n.init({
  debug: process.env.NODE_ENV === 'development',
  fallbackLng: 'en',
  defaultNS,
  ns: [defaultNS],
  resources,
  supportedLngs: supportedLanguages,
  lng: 'en', // Set default language explicitly
  interpolation: {
    escapeValue: false,
  },
  // Only provide detection config on the client
  detection: isBrowser
    ? {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
      }
    : undefined,
});

// Then use initReactI18next
i18n.use(initReactI18next);

export default i18n;
