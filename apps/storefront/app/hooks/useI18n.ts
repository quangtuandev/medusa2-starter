import { useTranslation } from 'react-i18next';
import type { SupportedLanguage } from '@app/i18n/config';
import { setLanguage } from '@libs/util/server/cookies.server';

export const useI18n = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: SupportedLanguage) => {
    i18n.changeLanguage(language);
    const expires = new Date();
    expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
    const headers = new Headers();
    setLanguage(headers, language);
  };

  const currentLanguage = i18n.language as SupportedLanguage;

  return {
    t,
    changeLanguage,
    currentLanguage,
    isReady: i18n.isInitialized,
    i18n, // Expose i18n instance for debugging
  };
};
