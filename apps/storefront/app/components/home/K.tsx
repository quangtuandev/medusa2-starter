import { useEffect, useRef } from "react";
import { animate, spring } from 'animejs';
import clsx from "clsx";
import { Logo } from "@app/components/home/Logo";
import { Description } from "@app/components/home/Description";
import MorphingShape from "@app/components/generativeart/MorphingShape";
import { useI18n } from "@app/hooks/useI18n";
import { LogoProps } from "@libs/types";



export const K = ({ onLetterClick, onMouseEnterLetter, onMouseLeaveLogo }: LogoProps) => {
    const { t } = useI18n();

    const particles = [
        {
            id: 'free',
            className: 'w-[160px]',
            position: { x: '-504px', y: 0 },
            src: "assets/images/art/k/free.webp",
        },
        {
            id: 'heart-1',
            className: 'w-[230px]',
            position: { x: '-576px', y: '-100%', rotate: '-20deg' },
            src: "assets/images/art/k/heart.webp",
        },
        {
            id: 'heart-2',
            className: 'w-[107px]',
            position: { x: '360px', y: '51px', rotate: '100deg' },
            src: "assets/images/art/k/heart.webp",
        },
        {
            id: 'heart-3',
            className: 'w-[158px]',
            position: { x: '432px', y: '-102px', rotate: '145deg' },
            src: "assets/images/art/k/heart.webp",
        },
        {
            id: 'kind',
            className: 'w-[520px]',
            position: { x: '-100%', y: '-50vh' },
            src: "assets/images/art/k/kind.webp",
        },
        {
            id: 'rabbit-head',
            className: 'w-[642px] bottom-0',
            position: { x: '-321px' },
            src: "assets/images/art/k/rabbit-head.webp",
        },
        {
            id: 'not-tested',
            className: 'w-[240px]',
            position: { x: '259px', y: '-358px' },
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
            <div className="flex relative flex-col items-center gap-4 ">
                <div className="z-10 h-[80px]" />
                <Logo className="z-10 k-hover" fill="#321D14" activeLetter="K" onLetterClick={onLetterClick} onMouseEnterLetter={onMouseEnterLetter} onMouseLeaveLogo={onMouseLeaveLogo} />
                <Description className="z-10 mt-16 max-w-3xl" description={t('home.k.description')} />
            </div>
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
                            className={clsx(`particle opacity-0 absolute z-10`, i.className)}
                        />
                    )}
                </div>
            ))}
        </>
    )
}