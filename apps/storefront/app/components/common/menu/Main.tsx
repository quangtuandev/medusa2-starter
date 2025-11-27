
import clsx from "clsx";
import { animate, spring } from "animejs";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@app/hooks/useI18n";
import { MenuToggle } from "../MenuToggle/MenuToggle";

function FancyText({ id, text, className }: { id: string, text: string, className?: string }) {
    return (
        <p id={id} className={clsx('font-centuryBook font-bold uppercase lg:hidden block pointer-events-none', className)}>
            <span className="italic lg:text-[150px] text-[50px]">{text.slice(0, 1)}</span>
            <span className="font-title lg:text-[95px] text-[40px]">{text.slice(1)}</span>
        </p>
    );
}


export const MainMenu = ({ handleMenuToggle }: { handleMenuToggle: () => void }) => {
    const { t } = useI18n();
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
    const categoryItems = [
        {
            id: 'blog',
            label: t('menu.blog'),
            image: '/assets/images/menu/blog.webp',
            url: '/blogs',
            className: 'max-w-[100vw] xl:max-w-[400px] left-0 lg:aspect-square ',
            imagePosition: { x: '5%' },
            position: {
                x: '100%',
                y: 0
            }
        },
        {
            id: 'product',
            label: t('menu.product'),
            image: '/assets/images/menu/product.webp',
            url: '/pick-a-card',
            className: 'max-w-[100vw] xl:max-w-[580px] left-[366px] lg:aspect-square ',
            imagePosition: { x: '4%' },
            position: {
                x: '80%',
                y: 0
            }
        },
        {
            id: 'story',
            label: t('menu.story'),
            image: '/assets/images/menu/story.webp',
            url: '/stories',
            className: 'max-w-[100vw] xl:max-w-[370px] left-[864px] lg:aspect-square ',
            imagePosition: { x: '4%' },
            position: {
                x: '-70%',
                y: 0
            }
        },
        {
            id: 'contact',
            label: t('menu.contact'),
            image: '/assets/images/menu/contact.webp',
            url: '/contact',
            className: 'max-w-[100vw] xl:max-w-[620px] right-0',
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
        setHoveredItemId(item.id);
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
        setHoveredItemId(null);
    }

    return (
        <div className="absolute inset-0 z-[9999] bg-white bg-[url('/assets/images/menu/bg-mobile.webp')] lg:bg-[url('/assets/images/menu/chair-bg.webp')] bg-no-repeat bg-bottom bg-[length:max(100vw,2180px)_auto] lg:overflow-hidden">
            <div className="h-full w-full overflow-x-scroll lg:overflow-x-hidden">
                <div className="lg:hidden block flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <span className="font-title font-bold text-4xl uppercase text-black">This </span>
                    <span className="flex gap-2">
                        <span className="font-title font-bold text-4xl uppercase text-black leading-none ml-1">Is </span>
                        <span className="font-centuryBook italic font-normal text-4xl text-white leading-none mt-1">Our</span>
                    </span>
                </div>
                <div className="fixed inset-0 bg-[#00000099] z-[9999] opacity-0 menu-background pointer-events-none" />
                <div className="lg:w-[1840px] z-[9999] justify-center lg:absolute flex flex-col lg:flex-row lg:top-0 lg:h-[630px] lg:left-1/2 lg:-translate-x-1/2 items-center overflow-x-scroll lg:overflow-x-hidden">
                    {categoryItems.map((item) => (
                        <Link to={item.url} className={clsx('w-[100vw]', item.className)} key={item.id}
                            onClick={handleMenuToggle}
                            id={item.id}
                            onMouseEnter={() => {
                                handleMouseEnter(item);
                            }}
                            onMouseLeave={() => {
                                handleMouseLeave(item);
                            }}
                        >
                            <div className="flex flex-col-reverse lg:flex-col items-center justify-center z-[9999]">
                                <img id={`menu-image-${item.id}`} src={item.image} alt={item.label} className={clsx("w-full object-contain menu-image z-[-2] hidden lg:block", isHovering && hoveredItemId !== item.id && '[filter:brightness(0.5)]')} />
                                <FancyText id={`fancy-text-${item.id}`} className="text-center lg:absolute text-black lg:text-[#FFE977] lg:text-white lg:leading-[0] z-[9]" text={item.label} />
                            </div>
                        </Link>
                    ))}
                </div>
                <MenuToggle isOpen={true} onClick={handleMenuToggle} className={clsx("shadow-[0px_4px_10px_0px_#00000040] absolute top-8 right-4 lg:right-11", !isHovering && 'z-[9999]')} />
            </div>
            <p className="absolute bottom-[14vh] w-full text-center z-[9999] pointer-events-none hidden lg:block">
                <span className={clsx("font-title font-bold text-[40px] xl:text-[95px] uppercase z-[2] relative", isHovering && 'text-white')}>{t('home.thisIs')}</span>
                <span className="font-centuryBook font-italic text-[100px] xl:text-[200px] italic text-[#FFE977] -ml-[50px] xl:-ml-[100px] z-[1]">{t('home.our')}</span>
            </p>
        </div>
    );

};