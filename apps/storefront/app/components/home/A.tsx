import { useEffect, useRef } from "react";
import { animate, spring } from 'animejs';
import clsx from "clsx";

export const A = ({ isMobile }: { isMobile: boolean }) => {
    const particles = [

        {
            id: 'headphone',
            className: 'w-[544px]',
            position: { x: '158px', y: '-717px' },
            positionMobile: { x: '158px', y: '-717px' },
            src: "assets/images/art/a/headphone.webp",
        },
        {
            id: 'art',
            className: 'w-[100vw] xl:w-[776px]',
            position: { x: '-432px', y: '-635px' },
            positionMobile: { x: '-50%', y: '-510px' },
            src: "assets/images/art/a/art.webp",
        },
        {
            id: 'bg-2',
            className: 'w-[670px] bottom-0 h-sm:w-[570px]',
            position: { x: '-130px' },
            positionMobile: { x: '-130px' },
            src: "assets/images/art/a/bg-2.webp",
        },
        {
            id: 'bg-1',
            className: 'w-[540px] bottom-0 h-sm:w-[440px]',
            position: { x: '-400px' },
            positionMobile: { x: '-400px' },
            src: "assets/images/art/a/bg-1.webp",
        },
        {
            id: 'first',
            className: 'w-[260px] bottom-0 h-sm:w-[160px]',
            position: { x: '-340px' },
            positionMobile: { x: '-340px' },
            src: "assets/images/art/a/first.webp",
        },
        {
            id: 'mid',
            className: 'w-[240px] bottom-0 h-sm:w-[180px]',
            position: { x: '-120px' },
            positionMobile: { x: '-120px' },
            src: "assets/images/art/a/mid.webp",
        },
        {
            id: 'last',
            className: 'w-[338px] bottom-0 h-sm:w-[238px]',
            position: { x: '100px' },
            positionMobile: { x: '100px' },
            src: "assets/images/art/a/last.webp",
        },
        {
            id: 'cheat',
            className: 'w-[316px] z-10',
            position: { x: '-710px', y: '-270px' },
            positionMobile: { x: '-710px', y: '-270px' },
            src: "assets/images/art/a/cheat.webp",
        },
        {
            id: 'noise',
            className: 'w-[376px]',
            position: { x: '-696px', y: '-300px' },
            positionMobile: { x: '-696px', y: '-300px' },
            src: "assets/images/art/a/noise.webp",
        },

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
                    <img
                        src={i.src}
                        id={`particle-${i.id}`}
                        alt={`icon ${i.id}`}
                        className={clsx(`particle opacity-0 absolute z-0`, i.className)}
                    />
                </div>
            ))}
        </>
    )
}