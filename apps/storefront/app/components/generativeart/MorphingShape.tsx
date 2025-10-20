import React, { HTMLAttributes, useEffect, useRef } from "react";
import { animate } from "animejs";
import clsx from "clsx";

interface MorphingShapeProps extends HTMLAttributes<HTMLElement> {
    className?: string;
    classNameWrapper?: string;
    blur?: number;
    zoom?: number;
    colorStart?: string;
    colorEnd?: string;
    offsetStart?: number;
    offsetEnd?: number;
    id: string;
}

const MorphingShape: React.FC<MorphingShapeProps> = ({ className, classNameWrapper, blur = 32, zoom = 0.5, colorStart = "#A2D4FD", colorEnd = "#B8C2FF", id, offsetStart = 7, offsetEnd = 58 }) => {

    const pathRef = useRef<SVGPathElement | null>(null);
    const path1 = "M58.5,385.506 C-10.7672,421.089 -13.4757,448.009 31,505.506 C-9.44661,694.329 31.2229,735.132 229,679.506 C331.989,707.394 386.507,701.242 477,645.006 C578.662,639.94 605.47,614.734 564,503.506 C579.723,442.148 576.855,407.988 546,347.506 C585.113,183.95 442.107,186.078 389.331,192.148 C377.098,193.556 364.755,191.654 353.695,186.24 C286.05,153.125 38.2558,53.6694 58.5,385.506 Z";
    const path2 = "M379.198464,131.107255 C148.198464,-30.3932451 -85.1425355,279.200255 127.698464,470.607255 C82.7914645,624.472255 157.598464,647.545255 235.198464,681.107255 C277.368464,750.902255 303.928464,755.968255 356.698464,701.607255 C455.718464,711.021255 498.758464,698.192255 546.698464,633.607255 C611.778464,539.980255 617.128464,487.484255 564.698464,394.107255 C597.188464,358.131255 555.698464,217.509255 508.198464,209.107255 C508.198464,148.107255 480.998464,101.867255 379.198464,131.107255 Z";
    const path4 = "M52.8611638,314.630767 C6.78180521,339.429162 3.02208627,361.688847 28.5395318,413.580471 C-17.9046512,540.875766 -26.863119,604.932206 152.681195,635.467685 C220.964177,811.28032 331.830282,873.470708 546.387612,775.896305 C667.782958,632.652116 676.59955,553.313444 569.189142,413.580471 C614.640192,317.460329 597.331297,274.37223 528.146388,207.185381 C476.726405,39.8389436 421.131208,-21.6399067 206.391466,8.28610192 C48.6859503,94.5551313 24.0400299,164.689982 52.8611638,314.630767 Z";
    const path3 = "M257.221157,237.564617 C257.221157,237.564617 210.611157,291.123617 208.721157,334.064617 C-30.6888426,436.722617 -25.8988426,543.175617 143.721157,699.064617 C212.161157,794.871617 264.211157,794.866617 359.221157,736.064617 C474.791157,729.846617 525.401157,707.001617 578.221157,615.064617 C622.811157,545.661617 629.161157,502.453617 600.221157,416.064617 C643.121157,329.311617 626.131157,247.346617 527.221157,188.564617 C457.441157,-85.9703827 198.451157,99.4347173 257.221157,237.564617 Z";

    useEffect(() => {
        if (pathRef.current) {
            animate(pathRef.current, {
                d: [
                    // { to: path4 },
                    // { to: path1 },
                    // { to: path2 },
                    { to: path1 },
                    { to: path2 },
                    { to: path4 },
                    { to: path3 },

                ],
                duration: 10000,
                ease: "inOutQuad",
                loop: true,
                alternate: true
            });
        }
    }, []);

    return (
        <div className={clsx(className)}>
            <div className={clsx("flex h-screen", classNameWrapper)}>
                <svg style={{ filter: `blur(${blur}px)`, zoom }}
                    width='643' height='836' viewBox="0 0 643 836">
                    <linearGradient id={`PSgrad_${id}`} x1="70.711%" x2="0%" y1="70.711%" y2="0%">
                        <stop offset={`${offsetStart}%`} stopColor={colorStart} stopOpacity="1" />
                        <stop offset={`${offsetEnd}%`} stopColor={colorEnd} stopOpacity="1" />
                    </linearGradient>
                    <path
                        fill={`url(#PSgrad_${id})`}
                        ref={pathRef}
                        d={path1}
                    />
                </svg>
            </div>
        </div>
    );
};

export default MorphingShape;
