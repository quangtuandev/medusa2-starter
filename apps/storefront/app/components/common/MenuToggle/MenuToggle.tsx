import clsx from 'clsx';
import { FC } from 'react';

export interface MenuToggleProps {
  isOpen: boolean;
  onClick?: () => void;
  className?: string;
  /** `brand` = white pill with the dark brown icon (homepage v2 header). */
  variant?: 'default' | 'brand';
  /** Set on the button that opens the overlay so assistive tech knows the state. */
  'aria-expanded'?: boolean;
  /** Id of the menu panel this button controls. */
  'aria-controls'?: string;
}

export const MenuToggle: FC<MenuToggleProps> = ({
  isOpen,
  onClick,
  className = '',
  variant = 'default',
  'aria-expanded': ariaExpanded,
  'aria-controls': ariaControls,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'inline-flex items-center justify-center w-[55px] h-[55px] rounded-full transition-all text-[#000000]',
        'duration-300 ease-in-out',
        variant === 'brand'
          ? 'bg-white text-[#3B2314] hover:bg-[#F4F0EC]'
          : {
              'lg:bg-[#FDCEF8] bg-[#FFE977]': isOpen,
              'bg-[#FFFF00]': !isOpen,
            },
        className,
      )}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
    >
      {isOpen ? (
        <img src="/assets/images/icons/close.svg" alt="" />
      ) : (
        <img src="/assets/images/icons/menu.svg" alt="" />
      )}
    </button>
  );
};
