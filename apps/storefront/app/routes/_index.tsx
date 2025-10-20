import { getMergedPageMeta } from "@libs/util/page";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { LanguageSwitcher } from "@app/components/common/LanguageSwitcher/LanguageSwitcher";
import { MenuToggle } from "@app/components/common/MenuToggle/MenuToggle";
import { useState } from "react";
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

export default function IndexRoute() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState<'main' | 'K' | 'I' | 'R' | 'A'>('main');

  const handleLetterClick = (letter: 'K' | 'I' | 'R' | 'A') => {
    setActiveComponent(letter);
  };

  const handleBack = () => {
    console.log('handleBack');
    setActiveComponent('main');
  };

  const handleMouseEnterLetter = (letter: 'K' | 'I' | 'R' | 'A') => {
    setActiveComponent(letter);
  };

  const handleMouseLeaveLogo = () => {
    setActiveComponent('main');
  };
  return (
    <div className="relative h-screen w-screen px-11 py-8 flex flex-col items-center justify-center overflow-hidden">
      <div className="flex gap-11 justify-between absolute top-0 left-0 w-full px-11 pt-8">
        <p className="font-title font-bold text-8xl uppercase">
          This <br />
          is
        </p>
        <div className="flex flex-col gap-6">
          <MenuToggle
            isOpen={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="shadow-[0px_4px_10px_0px_#00000040]"
          />
          <LanguageSwitcher />
        </div>
      </div>
      {/* 
      <div className="flex relative flex-col items-center gap-4">
        <ShopLink className="z-10" />
        <Logo
          className="z-10 mix-blend-exclusion"
          onLetterClick={handleLetterClick}
          onMouseEnterLetter={handleMouseEnterLetter}
          onMouseLeaveLogo={handleMouseLeaveLogo}
        />
        <Description className="z-10 mt-16" />
      </div> */}
      {/* Render component based on active state */}
      {activeComponent === 'main' && (
        <Main
          onLetterClick={handleLetterClick}
          onMouseEnterLetter={handleMouseEnterLetter}
          onMouseLeaveLogo={handleMouseLeaveLogo}
        />
      )}
      {activeComponent === 'K' && <K onLetterClick={handleLetterClick} onMouseEnterLetter={handleMouseEnterLetter} onMouseLeaveLogo={handleMouseLeaveLogo} />}
      {activeComponent === 'I' && <I onLetterClick={handleLetterClick} onMouseEnterLetter={handleMouseEnterLetter} onMouseLeaveLogo={handleMouseLeaveLogo} />}
      {activeComponent === 'R' && <R onLetterClick={handleLetterClick} onMouseEnterLetter={handleMouseEnterLetter} onMouseLeaveLogo={handleMouseLeaveLogo} />}
      {activeComponent === 'A' && <A onLetterClick={handleLetterClick} onMouseEnterLetter={handleMouseEnterLetter} onMouseLeaveLogo={handleMouseLeaveLogo} />}

      <div className="flex gap-11 justify-between absolute bottom-0 left-0 w-full px-11">
        <p className="font-title font-medium text-[65px] uppercase">Est.</p>
        <p className="font-title font-medium text-[65px] uppercase">2025</p>
      </div>
    </div>
  );
}
