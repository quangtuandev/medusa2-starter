import { clsx } from 'clsx';
import React, { useState, ReactNode } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

interface CollasapeProps {
    title: string;
    children: ReactNode;
    initiallyOpen?: boolean;
    className?: string;
}

const Collasape: React.FC<CollasapeProps> = ({
    title,
    children,
    initiallyOpen = false,
    className = '',
}) => {
    const [open, setOpen] = useState(initiallyOpen);

    const toggleCollasape = () => {
        setOpen((prev) => !prev);
    };

    return (
        <div className={clsx(`collasape-component`, className,
            {
                'bg-[radial-gradient(36.36%_53.14%_at_5.59%_100%,rgba(255,233,119,0.5)_0%,rgba(255,255,255,0.5)_100%)]': open,
            }
        )}>
            <button
                type="button"
                className="collasape-header text-[24px] leading-[32px] tracking-normal uppercase flex items-center justify-between w-full text-left p-2 cursor-pointer bg-none border-none outline-none font-bold text-sm transition-all duration-300"
                aria-expanded={open}
                onClick={toggleCollasape}
            >
                {title}
                {open ?
                    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_d_276_82)">
                            <circle cx="21" cy="17" r="13" transform="rotate(-90 21 17)" fill="#FFE977" />
                            <path d="M21.7071 12.2929C21.3166 11.9024 20.6834 11.9024 20.2929 12.2929L13.9289 18.6569C13.5384 19.0474 13.5384 19.6805 13.9289 20.0711C14.3195 20.4616 14.9526 20.4616 15.3431 20.0711L21 14.4142L26.6569 20.0711C27.0474 20.4616 27.6805 20.4616 28.0711 20.0711C28.4616 19.6805 28.4616 19.0474 28.0711 18.6569L21.7071 12.2929ZM21 14L22 14L22 13L21 13L20 13L20 14L21 14Z" fill="black" />
                        </g>
                        <defs>
                            <filter id="filter0_d_276_82" x="0" y="0" width="42" height="42" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="4" />
                                <feGaussianBlur stdDeviation="4" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0.57005 0 0 0 0 0.509485 0 0 0 0 0.191522 0 0 0 1 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_276_82" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_276_82" result="shape" />
                            </filter>
                        </defs>
                    </svg>
                    :
                    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_d_276_73)">
                            <circle cx="21" cy="17" r="13" transform="rotate(90 21 17)" fill="black" />
                            <path d="M20.2929 21.7071C20.6834 22.0976 21.3166 22.0976 21.7071 21.7071L28.0711 15.3431C28.4616 14.9526 28.4616 14.3195 28.0711 13.9289C27.6805 13.5384 27.0474 13.5384 26.6569 13.9289L21 19.5858L15.3431 13.9289C14.9526 13.5384 14.3195 13.5384 13.9289 13.9289C13.5384 14.3195 13.5384 14.9526 13.9289 15.3431L20.2929 21.7071ZM21 20L20 20L20 21L21 21L22 21L22 20L21 20Z" fill="white" />
                        </g>
                        <defs>
                            <filter id="filter0_d_276_73" x="0" y="0" width="42" height="42" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="4" />
                                <feGaussianBlur stdDeviation="4" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0.57005 0 0 0 0 0.509485 0 0 0 0 0.191522 0 0 0 1 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_276_73" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_276_73" result="shape" />
                            </filter>
                        </defs>
                    </svg>
                }
            </button>
            <div
                className="collasape-content"
                style={{
                    maxHeight: open ? '1000px' : '0px',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease',
                    padding: open ? '1rem' : '0 1rem',
                }}
                aria-hidden={!open}
            >
                {open && children}
            </div>
        </div>
    );
};

export default Collasape;
