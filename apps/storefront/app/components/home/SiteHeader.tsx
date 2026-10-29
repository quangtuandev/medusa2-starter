import { LanguageSwitcher } from '@app/components/common/LanguageSwitcher/LanguageSwitcher';
import { MenuToggle } from '@app/components/common/MenuToggle/MenuToggle';
import { MainMenu } from '@app/components/common/menu/Main';
import { HeaderSideNav } from '@app/components/layout/header/HeaderSideNav';
import { useIsMobile } from '@app/hooks/useIsMobile';
import { useState } from 'react';
import { Link } from 'react-router';

/**
 * Homepage v2 header: the KIRA wordmark over the hero on the left, the menu and
 * language controls stacked on the right. It overlays the hero (absolute) so the
 * photograph runs edge to edge behind it.
 */
export const SiteHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const controlSize = '!h-10 !w-10 md:!h-[55px] md:!w-[55px]';

  return (
    <>
      <header className="pointer-events-none absolute inset-x-0 top-0 z-40">
        <div className="flex items-start justify-between px-4 py-4 sm:px-6 md:px-8 lg:px-12 lg:py-8">
          <Link
            viewTransition
            to="/"
            prefetch="viewport"
            aria-label="KIRA — home"
            className="pointer-events-auto inline-flex items-center"
          >
            <img src="/logo.svg" alt="KIRA" className="h-6 w-auto sm:h-7 lg:h-9" />
          </Link>

          <div className="pointer-events-auto flex flex-col gap-3 lg:gap-4">
            <MenuToggle
              isOpen={isOpen}
              onClick={() => setIsOpen((open) => !open)}
              variant="brand"
              className={controlSize}
              aria-expanded={isOpen}
              aria-controls="main-menu"
            />
            <LanguageSwitcher variant="brand" className={controlSize} />
          </div>
        </div>
      </header>

      {isOpen && !isMobile && <MainMenu handleMenuToggle={() => setIsOpen(false)} />}
      {isMobile && <HeaderSideNav open={isOpen} setOpen={setIsOpen} />}
    </>
  );
};
