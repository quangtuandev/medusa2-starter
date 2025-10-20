import { useI18n } from '@app/hooks/useI18n';
import clsx from 'clsx';

export const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage } = useI18n();

  // Hiển thị ngôn ngữ khác để chuyển đổi
  const toggleLanguage = () => {
    const nextLanguage = currentLanguage === 'vi' ? 'en' : 'vi';
    changeLanguage(nextLanguage);
  };

  // Hiển thị button với ngôn ngữ khác
  const displayText = currentLanguage === 'vi' ? 'E' : 'V';

  return (
    <button
      onClick={toggleLanguage}
      className={clsx(
        'inline-flex items-center justify-center w-[55px] h-[55px] rounded-full font-black transition-all font-title text-4xl',
        'duration-300 ease-in-out',
        {
          'bg-[#FFFF00] text-[#000000]': currentLanguage === 'en',
          'bg-[#000000] text-[#EC98BA]': currentLanguage === 'vi',
        },
      )}
      aria-label={`Switch to ${currentLanguage === 'vi' ? 'English' : 'Vietnamese'}`}
    >
      {displayText}
    </button>
  );
};
