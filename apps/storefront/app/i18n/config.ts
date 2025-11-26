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

// Use plugins before initialization
i18n.use(initReactI18next);

if (isBrowser) {
  i18n.use(LanguageDetector);
}

// Initialize i18n
const initOptions: Parameters<typeof i18n.init>[0] = {
  debug: process.env.NODE_ENV === 'development',
  fallbackLng: 'en',
  defaultNS,
  ns: [defaultNS],
  resources,
  supportedLngs: supportedLanguages,
  interpolation: {
    escapeValue: false,
  },
};

// Only set lng for SSR (server-side), let LanguageDetector handle browser
if (!isBrowser) {
  initOptions.lng = 'en';
}

// Only provide detection config on the client
if (isBrowser) {
  initOptions.detection = {
    order: ['localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage', 'cookie'],
    lookupLocalStorage: 'i18nextLng',
    lookupCookie: 'lng',
  };
}

i18n.init(initOptions);

export default i18n;
