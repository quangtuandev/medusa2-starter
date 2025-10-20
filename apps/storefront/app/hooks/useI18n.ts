import { useTranslation } from 'react-i18next';
import type { SupportedLanguage } from '@app/i18n/config';

export const useI18n = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: SupportedLanguage) => {
    i18n.changeLanguage(language);
  };

  const currentLanguage = i18n.language as SupportedLanguage;

  return {
    t,
    changeLanguage,
    currentLanguage,
    isReady: i18n.isInitialized,
  };
};
