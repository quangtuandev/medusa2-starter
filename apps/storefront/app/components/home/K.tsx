import { useEffect, useState } from "react";
import { animate, spring } from 'animejs';
import clsx from "clsx";
import MorphingShape from "@app/components/generativeart/MorphingShape";

export const K = ({ isMobile }: { isMobile: boolean }) => {
    const particles = [
        {
            id: 'free',
            className: 'w-[160px]',
            position: { x: '-504px', y: 0 },
            positionMobile: { x: '-204px', y: 0 },
            src: "assets/images/art/k/free.webp",
        },
        {
            id: 'heart-1',
            className: 'w-[230px]',
            position: { x: '-576px', y: '-100%', rotate: '-20deg' },
            positionMobile: { x: '-576px', y: '-100%', rotate: '-20deg' },
            src: "assets/images/art/k/heart.webp",
        },
        {
            id: 'heart-2',
            className: 'w-[107px]',
            position: { x: '360px', y: '51px', rotate: '100deg' },
            positionMobile: { x: '360px', y: '51px', rotate: '100deg' },
            src: "assets/images/art/k/heart.webp",
        },
        {
            id: 'heart-3',
            className: 'w-[158px]',
            position: { x: '432px', y: '-102px', rotate: '145deg' },
            positionMobile: { x: '432px', y: '-102px', rotate: '145deg' },
            src: "assets/images/art/k/heart.webp",
        },
        {
            id: 'kind',
            className: 'w-[320px] xl:w-[520px]',
            position: { x: '-100%', y: '-612px' },
            positionMobile: { x: '-50%', y: '-540px' },
            src: "assets/images/art/k/kind.webp",
        },
        {
            id: 'rabbit-head',
            className: 'w-[642px] bottom-0 h-sm:w-[542px]',
            position: { x: '-321px' },
            positionMobile: { x: '-50%' },
            src: "assets/images/art/k/rabbit-head.webp",
        },
        {
            id: 'not-tested',
            className: 'w-[240px]',
            position: { x: '259px', y: '-358px' },
            positionMobile: { x: '259px', y: '-358px' },
            src: "assets/images/art/k/not-tested.webp",
        },
        {
            id: 'morphingshape',
            options: {
                zoom: 0.55,
                blur: 20,
                offsetStart: -100,
                offsetEnd: 180,
                colorStart: "#F5DDDD",
                colorEnd: "#EC98BA",
            },
            position: { x: '0', y: '-410px', rotate: '-50deg' },
            positionMobile: { x: '0', y: '-410px', rotate: '-50deg' },
        },
        {
            id: 'morphingshape-2',
            options: {
                zoom: 0.25,
                blur: 20,
                offsetStart: 58,
                offsetEnd: 80,
                colorStart: "#F5DDDD",
                colorEnd: "#EC98BA",
            },
            position: { x: '-504px', y: '102px', rotate: '-50deg' },
            positionMobile: { x: '-504px', y: '102px', rotate: '-50deg' },
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
    }, [isMobile]);
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