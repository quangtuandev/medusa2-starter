import { useEffect, useRef } from "react";
import { animate, spring } from 'animejs';
import MorphingShape from "@app/components/generativeart/MorphingShape";
import { useI18n } from "@app/hooks/useI18n";
import clsx from "clsx";
import { LogoProps } from "@libs/types";

export const I = () => {

    const particles = [
        {
            id: 'tower',
            className: 'w-[142px]',
            position: { x: '-547px', y: '-205px', rotate: '-22deg' },
            src: "assets/images/art/i/tower.webp",
        },
        {
            id: 'imagineative',
            className: 'w-[895px]',
            position: { x: '-547px', y: '-663px' },
            src: "assets/images/art/i/imagineative.webp",
        },
        {
            id: 'statue',
            className: 'w-[507px]',
            position: { x: '216px', y: '-563px', rotate: '22deg' },
            src: "assets/images/art/i/statue.webp",
        },
        {
            id: 'camera',
            className: 'w-[686px] bottom-0',
            position: { x: '-343px' },
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
        }
    ]

    useEffect(() => {
        particles.forEach(particle => {
            animate(`#particle-${particle.id}`, {
                x: particle.position.x,
                y: particle.position.y,
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