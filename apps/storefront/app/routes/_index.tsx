import { getMergedPageMeta } from "@libs/util/page";
import clsx from "clsx";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useI18n } from "@app/hooks/useI18n";
import { LanguageSwitcher } from "@app/components/common/LanguageSwitcher/LanguageSwitcher";
import { MenuToggle } from "@app/components/common/MenuToggle/MenuToggle";
import { useState, useCallback, memo, useMemo, useRef, useEffect } from "react";
import "@app/styles/home.css";
import { ShopLink } from "@app/components/home/ShopLink";
import { Logo } from "@app/components/home/Logo";
import { Description } from "@app/components/home/Description";
import { Main } from "@app/components/home/Main";
import { K } from "@app/components/home/K";
import { I } from "@app/components/home/I";
import { R } from "@app/components/home/R";
import { A } from "@app/components/home/A";

export const loader = async (_args: LoaderFunctionArgs) => {
  return {};
};

export const meta: MetaFunction<typeof loader> = getMergedPageMeta;
const MemoizedLogo = memo(Logo);

// Custom hook để xử lý click outside
function useClickOutside<T extends HTMLElement = HTMLDivElement>(
  callback: () => void,
  excludeRefs?: React.RefObject<HTMLElement>[]
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      console.log('handleClickOutside', ref.current);
      // Kiểm tra xem click có nằm trong element chính không
      if (ref.current && !ref.current.contains(target)) {
        // Kiểm tra xem click có nằm trong các element được loại trừ không
        const isExcluded = excludeRefs?.some(excludeRef =>
          excludeRef.current && excludeRef.current.contains(target)
        );

        if (!isExcluded) {
          callback();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback, excludeRefs]);

  return ref;
}
export default function IndexRoute() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverActiveClass, setHoverActiveClass] = useState('');
  const [activeComponent, setActiveComponent] = useState<'main' | 'K' | 'I' | 'R' | 'A'>('main');

  const menuRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  function debounce<T extends (...args: any[]) => void>(func: T, wait: number, immediate?: boolean) {
    let timeout: NodeJS.Timeout | null;
    return function (this: any, ...args: Parameters<T>) {
      const context = this;
      if (timeout) clearTimeout(timeout);
      if (immediate && !timeout) func.apply(context, args);
      timeout = setTimeout(() => {
        timeout = null;
        if (!immediate) func.apply(context, args);
      }, wait);
    };
  }
  const handleLetterClick = useCallback((letter: 'K' | 'I' | 'R' | 'A') => {
    setActiveComponent(letter);
    setHoverActiveClass(`${letter.toLowerCase()}-hover`);
  }, []);

  const handleMouseEnterLetter = useCallback((letter: 'K' | 'I' | 'R' | 'A') => {
    const debouncedFunction = debounce(() => {
      if (letter !== activeComponent) {
        setActiveComponent(letter);
        setHoverActiveClass(`${letter.toLowerCase()}-hover`);
      }
    }, 500);
    debouncedFunction();
  }, [activeComponent]);

  const handleMouseLeaveLogo = useCallback(() => {
    const debouncedFunction = debounce(() => {
      setActiveComponent('main');
      setHoverActiveClass('');
    }, 500);
    debouncedFunction();
  }, []);

  const handleMenuToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleClickOutside = useCallback(() => {
    console.log('handleClickOutside', isOpen, activeComponent);
    if (isOpen) {
      setIsOpen(false);
    }
    if (activeComponent !== 'main') {
      setActiveComponent('main');
      setHoverActiveClass('');
    }
  }, [isOpen, activeComponent]);

  const containerRef = useClickOutside(handleClickOutside, [menuRef, logoRef]);
  const [descriptionClassName, setDescriptionClassName] = useState('z-10 mt-16');
  const [descriptionText, setDescriptionText] = useState('');
  const { t } = useI18n();
  useEffect(() => {
    switch (activeComponent) {
      case 'K':
        setDescriptionClassName('max-w-3xl');
        setDescriptionText(t('home.k.description'));
        break;
      case 'I':
        setDescriptionClassName('max-w-3xl');
        setDescriptionText(t('home.i.description'));
        break;
      case 'R':
        setDescriptionClassName('max-w-[590px]');
        setDescriptionText(t('home.r.description'));
        break;
      case 'A':
        setDescriptionClassName('max-w-3xl');
        setDescriptionText(t('home.a.description'));
        break;
      default:
        setDescriptionClassName('z-10 mt-16');
        setDescriptionText(t('home.default.description'));
        break;
    }
  }, [activeComponent]);
  return (
    <div
      ref={containerRef}
      className="relative h-screen w-screen px-11 py-8 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="flex gap-11 justify-between absolute top-0 left-0 w-full px-11 pt-8">
        <p className="font-title font-bold text-8xl uppercase">
          This <br />
          is
        </p>
        {activeComponent === 'main' &&
          <div ref={menuRef} className="flex flex-col gap-6">
            <MenuToggle isOpen={isOpen} onClick={handleMenuToggle} className="shadow-[0px_4px_10px_0px_#00000040]"
            />
            <LanguageSwitcher />
          </div>
        }
      </div>

      <div ref={logoRef} className="flex relative flex-col items-center gap-3">
        {activeComponent !== 'main' && <div className="z-10 h-[80px]" />}
        {activeComponent === 'main' && <ShopLink className="z-10" />}

        <Logo
          className={clsx("z-[999] mix-blend-exclusion", hoverActiveClass)}
          onLetterClick={handleLetterClick}
          onMouseEnterLetter={handleMouseEnterLetter}
          onMouseLeaveLogo={handleMouseLeaveLogo}
        />
        <Description className={clsx("z-10 mt-8", descriptionClassName)} description={descriptionText} />
      </div>
      {activeComponent === 'main' && <Main />}
      {activeComponent === 'K' && <K />}
      {activeComponent === 'I' && <I />}
      {activeComponent === 'R' && <R />}
      {activeComponent === 'A' && <A />}

      <div className="flex gap-11 justify-between absolute bottom-0 left-0 w-full px-11">
        <p className="font-title font-medium text-[65px] uppercase">Est.</p>
        <p className="font-title font-medium text-[65px] uppercase">2025</p>
      </div>
    </div>
  );
}
