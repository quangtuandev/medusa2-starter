import { CartDrawer } from "@app/components/cart/CartDrawer";
import clsx from "clsx";
import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";
import { useMatches } from "react-router";
import { Footer } from "./footer/Footer";
import { Header } from "./header/Header";
import Cursor from "../common/Cursor";
import { LiveChatIcon } from "../contact/livechat";
import { useCart } from "@app/hooks/useCart";
import { MainMenu } from "../common/menu/Main";
import { MenuToggle } from "../common/MenuToggle/MenuToggle";
import { HeaderSideNav } from "./header/HeaderSideNav";
export interface PageProps {
  className?: string;
  children: ReactNode;
}

export const Page: FC<PageProps> = ({ className, children }) => {
  const hiddenHeaderPaths = ["/", "/pick-a-card", "/stories"];
  const hiddenFooterPaths = ["/", "/pick-a-card", "/stories", "/products"];
  const injectMenuPaths = ["/pick-a-card", "/stories"];
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const isHiddenHeader = hiddenHeaderPaths.includes(currentMatch?.pathname || "");
  const isHiddenFooter = hiddenFooterPaths.includes(currentMatch?.pathname || "");
  const { toggleCartDrawer } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const isInjectMenu = injectMenuPaths.includes(currentMatch?.pathname || "");

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || // Tablet and below
        "ontouchstart" in window || // Touch device
        navigator.maxTouchPoints > 0 || // Touch device
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      className={clsx(
        "page-layout flex min-h-screen flex-col bg-white",
        className
      )}
    >
      <Cursor />
      <CartDrawer />
      {!isHiddenHeader && <Header />}
      {isInjectMenu && (
        <>
          <MenuToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} className="fixed top-4 lg:top-8 right-4 lg:right-11 z-[9999] shadow-[0px_4px_10px_0px_#00000040]" />
          {isOpen && !isMobile && <MainMenu handleMenuToggle={() => setIsOpen(false)} />}
          {isMobile && <HeaderSideNav open={isOpen} setOpen={setIsOpen} />}
        </>
      )}
      <main className={clsx("flex-auto", isOpen && "hidden")}>
        <div className="w-full">{children}</div>
      </main>
      {!isHiddenFooter && <Footer />}
      {!isHiddenHeader && (
        <>
          <LiveChatIcon
            config={{
              facebook: 'https://m.me/@kiraparfum',
              zalo: 'https://zalo.me/your-phone-number'
            }}
          />
          <div className="fixed bottom-6 right-6 z-50">
            <button onClick={() => toggleCartDrawer(true)} className="transition-all duration-300 transform hover:scale-110 flex items-center justify-center">
              <span>
                <img src="/assets/images/cart.svg" alt="Chat" className="xl:w-32 xl:h-32 w-20 h-20" />
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
