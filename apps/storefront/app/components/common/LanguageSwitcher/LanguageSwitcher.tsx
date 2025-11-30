import { useI18n } from '@app/hooks/useI18n';
import clsx from 'clsx';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useRegion } from '@app/hooks/useRegion';
import { useRegions } from '@app/hooks/useRegions';
import { StoreRegion } from '@medusajs/types';
import { convertToFormData } from '@libs/util/forms';
import { useFetcher } from 'react-router';

const languages = [
  { value: 'vi', label: 'V' },
  { value: 'en', label: 'E' },
] as const;

export const LanguageSwitcher = () => {
  const { regions } = useRegions();
  const { region } = useRegion();

  const { currentLanguage, changeLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((lang) => lang.value === currentLanguage) || languages[0];

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };
  const fetcher = useFetcher();

  const onRegionChange = (regionId: string) => {
    fetcher.submit(
      convertToFormData({
        regionId,
      }),
      { method: 'post', action: '/api/region' },
    );
  };
  const handleSelect = (value: { label: string, value: string }) => {
    const lang = value.label === 'V' ? 'vi' : 'en';
    changeLanguage(lang);
    onRegionChange(value.value);
    setIsOpen(false);
  };
  const regionOptions = useMemo(() => {
    return regions?.map((region: StoreRegion) => {
      const label = region.countries?.[0]?.iso_2 === 'vn' ? 'V' : 'E';
      return {
        label: label,
        value: region.id,
      }
    })
  }, [regions]);
  // Đóng dropdown khi click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={handleToggle}
        className={clsx(
          'inline-flex items-center justify-center w-[55px] h-[55px] rounded-full font-black transition-all font-title text-4xl',
          'duration-300 ease-in-out',
          {
            'bg-[#FFFF00] text-[#000000]': currentLanguage === 'en',
            'bg-[#000000] text-[#EC98BA]': currentLanguage === 'vi',
          },
        )}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        {currentLang.label}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden text-base min-w-[125px]">
            {regionOptions?.map((lang) => (
              <button
                key={lang.value}
                onClick={() => handleSelect(lang)}
                className={clsx(
                  'w-full px-4 py-2 text-center font-title text-normal transition-all duration-200',
                  'hover:bg-gray-100',
                  {
                    'bg-[#FFFF00] text-[#000000]': lang.label === 'E',
                    'bg-[#000000] text-[#EC98BA]': lang.label === 'V',
                    'bg-gray-200': lang.label === currentLanguage,
                  },
                )}
              >
                {lang.label === 'V' ? 'Tiếng Việt' : 'English'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
