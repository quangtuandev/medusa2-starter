import { CartDrawer } from '@app/components/cart/CartDrawer';
import { useCart } from '@app/hooks/useCart';
import { useIsMobile } from '@app/hooks/useIsMobile';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { useMatches } from 'react-router';
import { CountryRegionModal } from '../common/CountryRegionModal';
import Cursor from '../common/Cursor';
import { MenuToggle } from '../common/MenuToggle/MenuToggle';
import { PopupDialog } from '../common/PopupDialog';
import { MainMenu } from '../common/menu/Main';
import { LiveChatIcon } from '../contact/livechat';
import { Footer } from './footer/Footer';
import { Header } from './header/Header';
import { HeaderSideNav } from './header/HeaderSideNav';

export interface PageProps {
  className?: string;
  children: ReactNode;
}

export const Page: FC<PageProps> = ({ className, children }) => {
  // `/store` keeps the header: without it the page has no way to reach the rest
  // of the site (especially on mobile, where the header holds the nav drawer).
  const hiddenHeaderPaths = ['/'];
  const hiddenFooterPaths = ['/', '/stories', '/products'];
  const injectMenuPaths = ['/stories'];
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const isHiddenHeader = hiddenHeaderPaths.includes(currentMatch?.pathname || '');
  const isHiddenFooter = hiddenFooterPaths.includes(currentMatch?.pathname || '');
  const { toggleCartDrawer } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const isInjectMenu = injectMenuPaths.includes(currentMatch?.pathname || '');
  // The stories page is a single-screen layout: it must never scroll the page,
  // so it is pinned to the viewport height and its content fills <main>.
  const isSingleScreenPage = isInjectMenu;

  const isMobile = useIsMobile();

  return (
    <div
      className={clsx(
        'page-layout flex flex-col bg-white',
        isSingleScreenPage ? 'h-[100dvh] overflow-hidden' : 'min-h-screen',
        className,
      )}
    >
      <Cursor />
      <CartDrawer />
      <PopupDialog />
      <CountryRegionModal autoShowOnFirstVisit={true} />
      {!isHiddenHeader && <Header />}
      {isInjectMenu && (
        <>
          {/* On mobile the header already carries the menu button, so the floating
              one is desktop-only — otherwise it sits on top of the header icons. */}
          <MenuToggle
            isOpen={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="fixed top-4 lg:top-8 right-4 lg:right-11 z-[9999] shadow-[0px_4px_10px_0px_#00000040] hidden lg:inline-flex"
            aria-expanded={isOpen}
            aria-controls="main-menu"
          />
          {isOpen && !isMobile && <MainMenu handleMenuToggle={() => setIsOpen(false)} />}
          {isMobile && <HeaderSideNav open={isOpen} setOpen={setIsOpen} />}
        </>
      )}
      <main className={clsx(isSingleScreenPage ? 'relative min-h-0 flex-auto' : 'flex-auto', isOpen && 'hidden')}>
        <div className="w-full">{children}</div>
      </main>
      {!isHiddenFooter && <Footer />}
      {!isHiddenHeader && (
        <>
          {/* `zalo` is not part of LiveChatConfig (the component only renders
              Facebook/Instagram), so passing it used to break the type check. */}
          <LiveChatIcon config={{ facebook: 'https://m.me/@kiraparfum' }} />
          <div className="fixed bottom-6 right-6 z-50">
            <button
              type="button"
              onClick={() => toggleCartDrawer(true)}
              aria-label="Open cart"
              className="transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
            >
              <span>
                <img src="/assets/images/cart.svg" alt="" className="xl:w-32 xl:h-32 w-20 h-20" />
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
