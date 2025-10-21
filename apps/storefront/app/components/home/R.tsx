import { useEffect } from "react";
import { animate, spring } from 'animejs';
import clsx from "clsx";

export const R = () => {

    const mirrors = [
        {
            className: 'left-[144px]',
            src: "assets/images/art/r/mirror.svg",
        },
        {
            className: 'left-[403px]',
            src: "assets/images/art/r/mirror2.svg",
        },
        {
            className: 'left-[432px]',
            src: "assets/images/art/r/mirror3.svg",
        },
        {
            className: 'left-[1008px]',
            src: "assets/images/art/r/mirror4.svg",
        },
        {
            className: 'left-[965px]',
            src: "assets/images/art/r/mirror5.svg",
        },
        {
            className: 'left-[144px] bottom-[102px] blur-[10px]',
            src: "assets/images/art/r/mirror6.svg",
        },
        {
            className: 'left-[1037px] ',
            src: "assets/images/art/r/mirror7.svg",
        },
    ]

    const particles = [
        {
            id: 'rectangle',
            className: 'w-[376px]',
            position: { x: '-576px', y: '-154px' },
            src: "assets/images/art/r/rectangle.webp",
        },
        {
            id: 'radiant',
            className: 'w-[696px]',
            position: { x: '-216px', y: '-714px' },
            src: "assets/images/art/r/radiant.webp",
        },
        {
            id: 'earth',
            className: 'w-[395px]',
            position: { x: '360px', y: '-358px' },
            src: "assets/images/art/r/earth.webp",
        },
        {
            id: 'sun',
            className: 'w-[636px] bottom-0',
            position: { x: '-318px' },
            src: "assets/images/art/r/sun.webp",
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
                    <img
                        src={i.src}
                        id={`particle-${i.id}`}
                        alt={`icon ${i.id}`}
                        className={clsx(`particle opacity-0 absolute z-10`, i.className)}
                    />
                </div>
            ))}
            {mirrors.map((mirror, index) => (
                <div className={clsx(`absolute z-10`, mirror.className)} key={`mirror-${index}`}>
                    <img src={mirror.src} />
                </div>
            ))}
        </>
    )
}