import clsx from "clsx";
import { animate, spring } from 'animejs';
import { useNavigate } from "react-router-dom";

export const AllCollection = ({ className, isActive }: { className?: string, isActive: boolean }) => {
    const handleMouseEnter = () => {
        if (!isActive) return;
        animate('.all-main-image', {
            opacity: [1, 0],
            width: '0%',
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
        });
        animate('.all-second-image', {
            opacity: [0, 1],
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
        });
        animate('.all-active-1', {
            opacity: [0, 1],
            skewX: '-4deg',
            x: '90%',
            y: '-90%',
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),

            duration: 300,
            alternate: true,
        });
        animate('.all-active-2', {
            opacity: [0, 1],
            skewX: '-4deg',
            rotate: '-138deg',
            x: '-38%',
            y: '-300px',
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
            duration: 300,
            alternate: true,
        });
        animate('.all-active-3', {
            opacity: [0, 1],
            x: '70%',
            y: '0%',
            skewX: '-4deg',
            rotate: '16deg',
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
        animate('.all-main-image', {
            opacity: [0, 1],
            width: '100%',
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
        });
        animate('.all-second-image', {
            opacity: [1, 0],
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
        });
        animate('.all-active-1', {
            opacity: [1, 0],
            x: '0%',
            y: '0%',
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
        });
        animate('.all-active-2', {
            opacity: [1, 0],
            x: '0%',
            y: '0%',
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
        });
        animate('.all-active-3', {
            opacity: [1, 0],
            x: '0%',
            y: '0%',
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
        });
    };
    const navigate = useNavigate();
    const handleClick = () => {
        if (!isActive) return;
        navigate('/collections');
    };
    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            className={clsx("flex all-collection  overflow-hidden rounded-[30px] shadow-[1px_4px_10px_0px_rgba(83,39,39,0.39)] shadow-[3px_18px_18px_0px_rgba(83,39,39,0.34)] shadow-[6px_40px_24px_0px_rgba(83,39,39,0.20)] shadow-[12px_70px_28px_0px_rgba(83,39,39,0.06)] shadow-[18px_110px_31px_0px_rgba(83,39,39,0.01)] border-8 border-white ", className)} to="/collections">
            <img src="/assets/images/home/all-collection.gif" className="scale-110 object-cover all-main-image" alt="All Collection" />
            <img src="/assets/images/home/all-collection.webp" className="scale-110 object-cover all-second-image opacity-0" alt="All Collection Text" />
            <div>
                <div className="absolute top-0 left-0 w-full opacity-0 all-active-1">
                    <img src="/assets/images/home/all.webp" className="w-1/2 object-cover" alt="All Collection Text" />
                </div>
                <div className="absolute top-0 left-0 w-full opacity-0 all-active-2">
                    <img src="/assets/images/home/all2.webp" className="w-1/2 object-cover" alt="All Collection Text" />
                </div>
                <div className="absolute top-0 left-0 w-full opacity-0 all-active-3">
                    <img src="/assets/images/home/all3.webp" className="w-1/2 object-cover" alt="All Collection Text" />
                </div>
            </div>
        </div>
    );
};

