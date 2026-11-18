import { FC, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import { useFetcher } from "react-router";
import { useRegions } from "@app/hooks/useRegions";
import { useRegion } from "@app/hooks/useRegion";
import { useI18n } from "@app/hooks/useI18n";
import { useRootLoaderData } from "@app/hooks/useRootLoaderData";
import { StoreRegion } from "@medusajs/types";
import { convertToFormData } from "@libs/util/forms";
import clsx from "clsx";

export interface CountryRegionModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  autoShowOnFirstVisit?: boolean;
}

const SELECTED_KEY = "kira_country_selected";
const DETECTED_COUNTRY_KEY = "kira_country_detected";

const readStorage = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};

export const CountryRegionModal: FC<CountryRegionModalProps> = ({
  isOpen,
  onClose,
  autoShowOnFirstVisit = false,
}) => {
  const { regions } = useRegions();
  const { region } = useRegion();
  const { currentLanguage, changeLanguage } = useI18n();
  const fetcher = useFetcher();
  const country = useRootLoaderData()?.country ?? null;
  const [internalOpen, setInternalOpen] = useState(false);

  // Show on first visit, and again whenever the detected country differs from the last confirmed one
  // (e.g. VPN toggled between VN and abroad), since the server may have switched the visitor's region.
  useEffect(() => {
    if (!autoShowOnFirstVisit) return;
    const hasChosen = readStorage(SELECTED_KEY);
    const lastCountry = readStorage(DETECTED_COUNTRY_KEY);
    // Only VN vs. non-VN matters: it decides whether the VND region is available
    const countryChanged = !!country && !!lastCountry && (lastCountry === "VN") !== (country === "VN");

    if (!hasChosen || countryChanged) {
      const timer = setTimeout(() => setInternalOpen(true), 500);
      return () => clearTimeout(timer);
    }
    if (country && !lastCountry) writeStorage(DETECTED_COUNTRY_KEY, country);
  }, [autoShowOnFirstVisit, country]);

  useEffect(() => {
    const handler = () => setInternalOpen(true);
    window.addEventListener("open-country-modal", handler);
    return () => window.removeEventListener("open-country-modal", handler);
  }, []);

  const showModal = isOpen !== undefined ? isOpen : internalOpen;

  const handleModalClose = () => {
    setInternalOpen(false);
    if (country) writeStorage(DETECTED_COUNTRY_KEY, country);
    if (onClose) onClose();
  };

  // Flatten countries from all regions
  const countryOptions = useMemo(() => {
    if (!regions || regions.length === 0) return [];
    const list: {
      regionId: string;
      countryCode: string;
      displayName: string;
      currency: string;
      label: string;
    }[] = [];

    regions.forEach((reg: StoreRegion) => {
      const currency = (reg.currency_code || "").toUpperCase();
      if (reg.countries && reg.countries.length > 0) {
        reg.countries.forEach((c) => {
          list.push({
            regionId: reg.id,
            countryCode: c.iso_2,
            displayName: c.display_name || c.iso_2.toUpperCase(),
            currency,
            label: `${c.display_name || c.iso_2.toUpperCase()} (${currency})`,
          });
        });
      } else {
        list.push({
          regionId: reg.id,
          countryCode: reg.name,
          displayName: reg.name,
          currency,
          label: `${reg.name} (${currency})`,
        });
      }
    });

    return list;
  }, [regions, region]);

  // Current selected region/country option
  const defaultOption = useMemo(() => {
    if (region && countryOptions.length > 0) {
      return (
        countryOptions.find((opt) => opt.regionId === region.id) ||
        countryOptions[0]
      );
    }
    return countryOptions[0];
  }, [region, countryOptions]);

  const [selectedRegionId, setSelectedRegionId] = useState<string>(
    defaultOption?.regionId || ""
  );
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "vi">(
    (currentLanguage as "en" | "vi") || "en"
  );

  useEffect(() => {
    if (defaultOption?.regionId && !selectedRegionId) {
      setSelectedRegionId(defaultOption.regionId);
    }
    if (currentLanguage) {
      setSelectedLanguage(currentLanguage as "en" | "vi");
    }
  }, [defaultOption, currentLanguage, selectedRegionId]);

  // Re-sync the selection with the current region each time the modal opens
  useEffect(() => {
    if (showModal && defaultOption?.regionId) setSelectedRegionId(defaultOption.regionId);
  }, [showModal, defaultOption?.regionId]);

  const handleConfirm = () => {
    if (!selectedRegionId) return;

    changeLanguage(selectedLanguage);
    fetcher.submit(
      convertToFormData({
        regionId: selectedRegionId,
        language: selectedLanguage,
      }),
      { method: "post", action: "/api/region" }
    );

    // Save that user has chosen country/region
    writeStorage(SELECTED_KEY, "true");

    handleModalClose();
  };

  const isVi = currentLanguage === "vi";

  return (
    <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleModalClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative w-full max-w-lg overflow-hidden rounded-xl bg-white p-6 sm:p-8 shadow-2xl z-10 font-sans"
          >
            {/* Close Button */}
            <button
              onClick={handleModalClose}
              className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pr-8 leading-snug">
              {isVi ? "Chọn quốc gia / khu vực" : "Choose your country / region"}
            </h2>

            {/* Descriptions */}
            <div className="mt-4 space-y-2 text-sm text-gray-700 leading-relaxed">
              <p className="font-semibold text-gray-900">
                {isVi
                  ? "Chọn điểm đến giao hàng của bạn."
                  : "Select your shipping destination."}
              </p>
              <p className="text-gray-600 text-xs sm:text-sm">
                {isVi
                  ? "Mua sắm từ quốc gia bạn chọn. Lưu ý rằng chúng tôi chỉ có thể giao hàng đến các địa chỉ thuộc quốc gia đã chọn."
                  : "Buy from the country of your choice. Remember that we can only ship your order to addresses located in the chosen country."}
              </p>
            </div>

            {/* Selectors */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {/* Country Select */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {isVi ? "Quốc gia" : "Country"}
                </label>
                <div className="relative">
                  <select
                    value={selectedRegionId}
                    onChange={(e) => setSelectedRegionId(e.target.value)}
                    style={{ backgroundImage: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
                    className="w-full appearance-none bg-none border-0 border-b border-gray-300 pb-2 pt-1 pr-6 pl-0 text-sm font-medium text-gray-900 bg-transparent focus:border-black focus:ring-0 focus:outline-none transition-colors cursor-pointer"
                  >
                    {countryOptions.map((opt) => (
                      <option key={`${opt.regionId}-${opt.countryCode}`} value={opt.regionId}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-0 top-2.5 text-gray-600"
                  />
                </div>
              </div>

              {/* Language Select */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {isVi ? "Ngôn ngữ" : "Language"}
                </label>
                <div className="relative">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as "en" | "vi")}
                    style={{ backgroundImage: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
                    className="w-full appearance-none bg-none border-0 border-b border-gray-300 pb-2 pt-1 pr-6 pl-0 text-sm font-medium text-gray-900 bg-transparent focus:border-black focus:ring-0 focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="en">English</option>
                    <option value="vi">Tiếng Việt</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-0 top-2.5 text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleConfirm}
                className="w-40 py-3 rounded-xl bg-black hover:bg-gray-800 text-white font-semibold text-sm tracking-wide transition-colors shadow-md active:scale-95 duration-150"
              >
                {isVi ? "Xác nhận" : "Confirm"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
