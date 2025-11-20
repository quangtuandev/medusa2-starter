import { useEffect, useRef } from "react";
import { animate, spring } from 'animejs';
import MorphingShape from "@app/components/generativeart/MorphingShape";
import clsx from "clsx";

export const I = ({ isMobile }: { isMobile: boolean }) => {

    const particles = [
        {
            id: 'tower',
            className: 'w-0 xl:w-[142px]',
            position: { x: '-547px', y: '-205px', rotate: '-22deg' },
            positionMobile: { x: '-50%', y: '-205px', rotate: '-22deg' },
            src: "assets/images/art/i/tower.webp",
        },
        {
            id: 'imagineative',
            className: 'w-[395px] xl:w-[895px]',
            position: { x: '-547px', y: '-663px' },
            positionMobile: { x: '-50%', y: '-463px' },
            src: "assets/images/art/i/imagineative.webp",
        },
        {
            id: 'statue',
            className: 'w-[507px]',
            position: { x: '216px', y: '-563px', rotate: '22deg' },
            positionMobile: { x: '216px', y: '-563px', rotate: '22deg' },
            src: "assets/images/art/i/statue.webp",
        },
        {
            id: 'camera',
            className: 'w-[686px] bottom-0 h-sm:w-[556px]',
            position: { x: '-343px' },
            positionMobile: { x: '-50%' },
            src: "assets/images/art/i/camera.webp",
        },
        {
            id: 'morphingshape',
            options: {
                zoom: 0.4,
                blur: 40,
                offsetStart: 58,
                offsetEnd: 100,
                colorStart: "#FCF099",
                colorEnd: "#E5DC95",
            },
            position: { x: '144px', y: '-410px', rotate: '-50deg' },
            positionMobile: { x: '144px', y: '-410px', rotate: '-50deg' },
        },
        {
            id: 'morphingshape-2',
            options: {
                zoom: 0.25,
                blur: 20,
                offsetStart: 58,
                offsetEnd: 100,
                colorStart: "#FCF099",
                colorEnd: "#E5DC95",
            },
            position: { x: '-648px', y: '102px', rotate: '-50deg' },
            positionMobile: { x: '-648px', y: '102px', rotate: '-50deg' },
        }
    ]

    useEffect(() => {
        particles.forEach(particle => {
            const position = isMobile ? particle.positionMobile : particle.position;
            animate(`#particle-${particle.id}`, {
                x: position.x,
                y: position.y,
                opacity: [0, 1],
                ease: spring({
                    bounce: 0.65,
                    duration: 400
                }),
                rotate: particle.position.rotate || 0,
                duration: 300,
                alternate: true,
            });
        });
    }, []);
    return (
        <>
            {particles.map((i, index) => (
                <div key={i.id}>
                    {i.id.includes('morphingshape') ? (
                        <div id={`particle-${i.id}`}>
                            <MorphingShape blur={i.options?.blur} zoom={i.options?.zoom} id={`${i.id}`}
                                colorStart={i.options?.colorStart} colorEnd={i.options?.colorEnd} offsetStart={i.options?.offsetStart} offsetEnd={i.options?.offsetEnd}
                                classNameWrapper="absolute" />
                        </div>
                    ) : (
                        <img
                            src={i.src}
                            id={`particle-${i.id}`}
                            alt={`icon ${i.id}`}
                            className={clsx(`particle opacity-0 absolute z-0`, i.className)}
                        />
                    )}
                </div>
            ))}
        </>
    )
}