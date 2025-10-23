import clsx from "clsx";
import { useRef } from "react";
import { animate, spring } from 'animejs';
export const IcyCollection = ({ className, isActive }: { className?: string, isActive: boolean }) => {
    const collectionItemRef = useRef<HTMLDivElement>(null);
    const hoverActiveRef = useRef<HTMLDivElement>(null);
    const handleMouseEnter = () => {
        if (!isActive) return;
        animate('.icymain-image', {
            opacity: [1, 0],
            width: '0%',
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
            duration: 300,
            alternate: true,
        });
        animate('.icy-second-image', {
            opacity: [0, 1],
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
            duration: 300,
            alternate: true,
        });
        animate('.hover-active-icy-1', {
            x: '-50%',
            y: '50%',
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
        animate('.hover-active-icy-2', {
            x: '40%',
            y: '-20%',
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
        animate('.icymain-image', {
            opacity: [0, 1],
            width: '100%',
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
            duration: 300,
            alternate: true,
        });
        animate('.icy-second-image', {
            opacity: [1, 0],
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
            duration: 300,
            alternate: true,
        });
        animate('.hover-active-icy-1', {
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
        animate('.hover-active-icy-2', {
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
            <img src="/assets/images/home/icy-collection.gif" className="scale-110 object-cover icymain-image" alt="Icy Collection" />
            <img src="/assets/images/home/icy-collection.webp" className="scale-110 object-cover icy-second-image opacity-0" alt="Icy Collection Text" />
            <div ref={hoverActiveRef}>
                <div className="absolute top-0 left-0 w-full opacity-0 hover-active-icy-1">
                    <img src="/assets/images/home/icy1.webp" className="w-full h-full object-cover" alt="Icy Collection Text" />
                </div>
                <div className="absolute top-0 left-0 w-full opacity-0 hover-active-icy-2">
                    <img src="/assets/images/home/icy2.webp" className="w-full h-full object-cover" alt="Icy Collection Text" />
                </div>
            </div>
        </div>
    );
};

