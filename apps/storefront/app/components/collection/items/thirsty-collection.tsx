import clsx from "clsx";
import React, { useRef } from 'react';
import { Link } from "react-router";
import { animate, spring } from 'animejs';

export const ThirstyCollection = ({ className, isActive }: { className?: string, isActive: boolean }) => {
    const collectionItemRef = useRef<HTMLDivElement>(null);
    const hoverActiveRef = useRef<HTMLDivElement>(null);
    const handleMouseEnter = () => {
        if (!isActive) return;
        animate('.main-image', {
            opacity: [1, 0],
            width: '0%',
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
            duration: 300,
            alternate: true,
        });
        animate('.second-image', {
            opacity: [0, 1],
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
            duration: 300,
            alternate: true,
        });
        animate('.hover-active-1', {
            x: '-50%',
            y: '-20%',
            skewX: '-4deg',
            rotate: '-27deg',
            opacity: [0, 1],
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
            duration: 300,
            alternate: true,
        });
        animate('.hover-active-2', {
            x: '40%',
            y: '80%',
            skewX: '-4deg',
            rotate: '43deg',
            opacity: [0, 1],
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
            duration: 300,
            alternate: true,
        });
    };

    const handleMouseLeave = () => {
        if (!isActive) return;
        animate('.main-image', {
            opacity: [0, 1],
            width: '100%',
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
            duration: 300,
            alternate: true,
        });
        animate('.second-image', {
            opacity: [1, 0],
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
            duration: 300,
            alternate: true,
        });
        animate('.hover-active-1', {
            x: '0%',
            y: '0%',
            skewX: '0deg',
            rotate: '0deg',
            opacity: [1, 0],
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
            duration: 300,
            alternate: true,
        });
        animate('.hover-active-2', {
            x: '0%',
            y: '0%',
            skewX: '0deg',
            rotate: '0deg',
            opacity: [1, 0],
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
            duration: 300,
            alternate: true,
        });
    };

    return (
        <div
            ref={collectionItemRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={clsx("collection-item  flex overflow-hidden rounded-[30px] shadow-[1px_4px_10px_0px_rgba(83,39,39,0.39)] shadow-[3px_18px_18px_0px_rgba(83,39,39,0.34)] shadow-[6px_40px_24px_0px_rgba(83,39,39,0.20)] shadow-[12px_70px_28px_0px_rgba(83,39,39,0.06)] shadow-[18px_110px_31px_0px_rgba(83,39,39,0.01)] border-8 border-white ", className)} to="/collections">
            <img src="/assets/images/home/thirsty-collection.gif" className="scale-110 object-cover main-image" alt="Thirsty Collection" />
            <img src="/assets/images/home/thirsty-collection.webp" className="scale-110 object-cover second-image opacity-0" alt="Thirsty Collection Text" />
            <div ref={hoverActiveRef}>
                <div className="absolute top-0 left-0 w-full opacity-0 hover-active-1">
                    <img src="/assets/images/home/thirsty1.webp" className="w-full h-full object-cover" alt="Thirsty Collection Text" />
                </div>
                <div className="absolute top-0 left-0 w-full opacity-0 hover-active-2">
                    <img src="/assets/images/home/thirsty2.webp" className="w-full h-full object-cover" alt="Thirsty Collection Text" />
                </div>
            </div>

        </div>
    );
};
