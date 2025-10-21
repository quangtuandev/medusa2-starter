import { useEffect, useRef } from "react";
import { animate, spring } from 'animejs';
import clsx from "clsx";

export const A = () => {
    const particles = [

        {
            id: 'headphone',
            className: 'w-[544px]',
            position: { x: '158px', y: '-717px' },
            src: "assets/images/art/a/headphone.webp",
        },
        {
            id: 'art',
            className: 'w-[776px]',
            position: { x: '-432px', y: '-635px' },
            src: "assets/images/art/a/art.webp",
        },
        {
            id: 'bg-2',
            className: 'w-[670px] bottom-0',
            position: { x: '-130px' },
            src: "assets/images/art/a/bg-2.webp",
        },
        {
            id: 'bg-1',
            className: 'w-[540px] bottom-0',
            position: { x: '-400px' },
            src: "assets/images/art/a/bg-1.webp",
        },
        {
            id: 'first',
            className: 'w-[260px] bottom-0',
            position: { x: '-340px' },
            src: "assets/images/art/a/first.webp",
        },
        {
            id: 'mid',
            className: 'w-[240px] bottom-0',
            position: { x: '-120px' },
            src: "assets/images/art/a/mid.webp",
        },
        {
            id: 'last',
            className: 'w-[338px] bottom-0',
            position: { x: '100px' },
            src: "assets/images/art/a/last.webp",
        },
        {
            id: 'cheat',
            className: 'w-[376px]',
            position: { x: '-576px', y: '-154px' },
            src: "assets/images/art/a/cheat.webp",
        },
        {
            id: 'noise',
            className: 'w-[376px]',
            position: { x: '-576px', y: '-154px' },
            src: "assets/images/art/a/noise.webp",
        },

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
                    <img
                        src={i.src}
                        id={`particle-${i.id}`}
                        alt={`icon ${i.id}`}
                        className={clsx(`particle opacity-0 absolute z-10`, i.className)}
                    />
                </div>
            ))}
        </>
    )
}