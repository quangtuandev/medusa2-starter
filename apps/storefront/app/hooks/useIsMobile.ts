import { useEffect, useState } from 'react';

/**
 * Hook to detect if the current device is mobile.
 * Checks viewport width, touch support, and user agent.
 * Listens to resize events to update dynamically.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice =
        window.innerWidth <= 768 || // Tablet and below
        'ontouchstart' in window || // Touch device
        navigator.maxTouchPoints > 0 || // Touch device
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}
