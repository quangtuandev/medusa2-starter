import clsx from "clsx";
import { animate, spring } from "animejs";
import debounce from "lodash/debounce"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function FancyText({ id, text, className }: { id: string, text: string, className?: string }) {
    return (
        <p style={{ display: 'none' }} id={id} className={clsx('font-centuryBook font-bold uppercase', className)}>
            <span className="italic text-[150px]">{text.slice(0, 1)}</span>
            <span className="font-title text-[95px]">{text.slice(1)}</span>
        </p>
    );
}


export const MainMenu = () => {
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const categoryItems = [
        {
            id: 'blog',
            label: 'Blog',
            image: '/assets/images/menu/blog.webp',
            url: '/blog',
            className: 'max-w-[494px] left-0',
            imagePosition: { x: '5%' },
            position: {
                x: '100%',
                y: 0
            }
        },
        {
            id: 'product',
            label: 'Product',
            image: '/assets/images/menu/product.webp',
            url: '/products',
            className: 'max-w-[648px] left-[366px]',
            imagePosition: { x: '4%' },
            position: {
                x: '80%',
                y: 0
            }
        },
        {
            id: 'story',
            label: 'Story',
            image: '/assets/images/menu/story.webp',
            url: '/stories',
            className: 'max-w-[446px] left-[864px]',
            imagePosition: { x: '4%' },
            position: {
                x: '-70%',
                y: 0
            }
        },
        {
            id: 'contact',
            label: 'Contact',
            image: '/assets/images/menu/contact.webp',
            url: '/contact',
            className: 'w-[670px] right-0',
            imagePosition: { x: '-7%' },
            position: {
                x: '-90%',
                y: 0
            }
        },
    ];

    const handleMouseEnter = (item: any) => {
        const el = document.getElementById(`fancy-text-${item.id}`);
        if (!el) return;
        el.style.display = 'block';
        const image = document.getElementById(`menu-image-${item.id}`);
        if (image) {
            image.style.zIndex = '2';
        }
        setIsHovering(true);
        const backdrop = document.querySelectorAll('.menu-background');
        backdrop.forEach(backdrop => {
            (backdrop as HTMLElement).style.opacity = '1';
        });
        animate(`#fancy-text-${item.id}`, {
            opacity: [0, 1],
            ...(item.position?.y ? { y: item.position.y } : {}),
            ...(item.position?.x ? { x: item.position.x } : {}),
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
        });
        animate(`#menu-image-${item.id}`, {
            x: item.imagePosition?.x,
            scale: 1.1,
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
        });
    }

    const handleMouseLeave = (item: any) => {
        animate(`#fancy-text-${item.id}`, {
            opacity: [1, 0],
            x: 0,
            y: 0,
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
        });
        animate(`#menu-image-${item.id}`, {
            x: 0,
            y: 0,
            scale: 1,
            ease: spring({
                bounce: 0.65,
                duration: 400
            }),
        });
        const backdrop = document.querySelectorAll('.menu-background');
        backdrop.forEach(backdrop => {
            (backdrop as HTMLElement).style.opacity = '0';
        });
        const image = document.getElementById(`menu-image-${item.id}`);
        if (image) {
            image.style.zIndex = '-2';
        }
        setIsHovering(false);
    }

    return (
        <div className="absolute inset-0 z-[9999] bg-white ">
            <div className="h-full w-full">
                <div className="absolute flex w-[1840px] h-[max(calc(100vh-300px),400px)] left-1/2 -translate-x-1/2 items-center">
                    <div className="absolute bottom-0 left-0 w-full h-full bg-[#00000099] z-[-1] opacity-0 menu-background" />
                    {categoryItems.map((item) => (
                        <Link to={item.url} className={clsx('aspect-square absolute', item.className)} key={item.id}
                            id={item.id}
                            onMouseEnter={() => {
                                handleMouseEnter(item);
                            }}
                            onMouseLeave={() => {
                                handleMouseLeave(item);
                            }}
                        >
                            <div className="flex flex-col items-center justify-center">
                                <img id={`menu-image-${item.id}`} src={item.image} alt={item.label} className="w-full h-full object-contain menu-image z-[-2]" />
                                <FancyText id={`fancy-text-${item.id}`} className="text-center absolute text-white z-[9]" text={item.label} />
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-[url('/assets/images/menu/background.webp')] bg-contain bg-repeat-x bg-bottom bg-center">
                    <div className="absolute bottom-0 left-0 w-full h-full bg-[#00000099] z-[2] opacity-0 menu-background" />
                    <p className="absolute bottom-0 w-full text-center mb-[98px] z-[3]">
                        <span className={clsx("font-title font-bold text-[95px] uppercase z-[2] relative", isHovering && 'text-white')}>This is</span>
                        <span className="font-centuryBook font-italic text-[200px] italic text-[#FFE977] -ml-[100px] z-[1]">Our</span>
                    </p>
                    <div className="overflow-hidden h-[300px] relative">
                        <img src="/assets/images/menu/chair-bottom.webp" alt="logo" className="w-full h-full object-cover object-position-center" />
                    </div>
                </div>
            </div>
        </div>
    );

};