import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useI18n } from "@app/hooks/useI18n";

export interface PopupData {
  id: string;
  title_en: string;
  title_vi: string;
  description_en?: string;
  description_vi?: string;
  image?: string;
  cta_text_en?: string;
  cta_text_vi?: string;
  cta_link?: string;
  secondary_cta_text_en?: string;
  secondary_cta_text_vi?: string;
  secondary_cta_link?: string;
  is_active: boolean;
  delay_seconds: number;
  display_frequency: "once_per_session" | "once_per_day" | "always";
  target_page: string;
}

export const PopupDialog = () => {
  const { currentLanguage } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  const [activePopup, setActivePopup] = useState<PopupData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout | null = null;

    const fetchPopups = async () => {
      try {
        let res: Response;
        try {
          res = await fetch("/api/popups");
        } catch {
          const baseUrl =
            (typeof window !== "undefined" && (window as any).ENV?.PUBLIC_MEDUSA_API_URL) ||
            "http://localhost:7901";
          const publishableKey =
            (typeof window !== "undefined" && (window as any).ENV?.MEDUSA_PUBLISHABLE_KEY) || "";

          res = await fetch(`${baseUrl}/store/popups`, {
            headers: {
              "x-publishable-api-key": publishableKey,
            },
          });
        }

        if (!res.ok) return;

        const data = await res.json();
        const popups: PopupData[] = data.popups || [];

        if (!popups.length || !isMounted) {
          return;
        }

        // Find the first popup matching the current page
        const currentPath = location.pathname;
        const matched = popups.find((p) => {
          if (!p.is_active && p.is_active !== undefined) return false;
          const target = (p.target_page || "all").trim();
          if (target === "all" || target === "" || target === currentPath) return true;
          if (target.endsWith("*") && currentPath.startsWith(target.slice(0, -1)))
            return true;
          return false;
        });

        if (!matched) {
          return;
        }

        // Check display frequency
        const sessionKey = `popup_shown_session_${matched.id}`;
        const dayKey = `popup_shown_day_${matched.id}`;

        if (matched.display_frequency === "once_per_session") {
          if (sessionStorage.getItem(sessionKey)) return;
        } else if (matched.display_frequency === "once_per_day") {
          const lastShown = localStorage.getItem(dayKey);
          if (lastShown) {
            const timeDiff = Date.now() - parseInt(lastShown, 10);
            if (timeDiff < 24 * 60 * 60 * 1000) return; // Shown within last 24 hours
          }
        }

        // Delay trigger
        const delay = (matched.delay_seconds || 0) * 1000;
        timer = setTimeout(() => {
          if (isMounted) {
            setActivePopup(matched);
            setIsVisible(true);

            // Record display
            if (matched.display_frequency === "once_per_session") {
              sessionStorage.setItem(sessionKey, "true");
            } else if (matched.display_frequency === "once_per_day") {
              localStorage.setItem(dayKey, Date.now().toString());
            }
          }
        }, delay);
      } catch (err) {
        console.error("Failed to fetch popups:", err);
      }
    };

    fetchPopups();

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [location.pathname]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleCtaClick = (link?: string) => {
    handleClose();
    if (!link) return;

    if (link.startsWith("http://") || link.startsWith("https://")) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      navigate(link);
    }
  };

  if (!activePopup) return null;

  const title = currentLanguage === "vi" ? activePopup.title_vi : activePopup.title_en;
  const description =
    currentLanguage === "vi"
      ? activePopup.description_vi || activePopup.description_en
      : activePopup.description_en || activePopup.description_vi;
  const ctaText =
    currentLanguage === "vi"
      ? activePopup.cta_text_vi || activePopup.cta_text_en
      : activePopup.cta_text_en || activePopup.cta_text_vi;
  const secondaryCtaText =
    currentLanguage === "vi"
      ? activePopup.secondary_cta_text_vi || activePopup.secondary_cta_text_en
      : activePopup.secondary_cta_text_en || activePopup.secondary_cta_text_vi;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl z-10"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-gray-700 transition-colors"
              aria-label="Close popup"
            >
              <X size={18} />
            </button>

            {/* Banner Image */}
            {activePopup.image && (
              <div className="relative w-full h-48 sm:h-56 overflow-hidden">
                <img
                  src={activePopup.image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Text & CTAs */}
            <div className="p-6 sm:p-8 text-center space-y-4">
              <h2 className="font-title font-extrabold text-2xl sm:text-3xl text-gray-900 leading-tight">
                {title}
              </h2>

              {description && (
                <p className="font-montserrat text-sm sm:text-base text-gray-600 leading-relaxed max-w-md mx-auto whitespace-pre-line">
                  {description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 pt-4">
                {ctaText && (
                  <button
                    onClick={() => handleCtaClick(activePopup.cta_link)}
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#FFE977] hover:bg-yellow-400 text-black font-title font-bold text-base uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {ctaText}
                  </button>
                )}

                {secondaryCtaText && (
                  <button
                    onClick={() =>
                      activePopup.secondary_cta_link
                        ? handleCtaClick(activePopup.secondary_cta_link)
                        : handleClose()
                    }
                    className="w-full py-2 text-gray-500 hover:text-gray-900 font-medium text-xs sm:text-sm transition-colors"
                  >
                    {secondaryCtaText}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
