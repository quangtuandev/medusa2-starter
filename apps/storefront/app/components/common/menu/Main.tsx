
import clsx from "clsx";
import { animate, spring } from "animejs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@app/hooks/useI18n";
import { useRootLoaderData } from "@app/hooks/useRootLoaderData";
import { MenuToggle } from "../MenuToggle/MenuToggle";
import { px } from "motion/react";

function FancyText({ id, text, className }: { id: string, text: string, className?: string }) {
    return (
        <p id={id} className={clsx('font-centuryBook font-bold uppercase lg:hidden block pointer-events-none absolute bottom-0', className)}>
            <span className="italic lg:text-[100px] text-[50px]">{text.slice(0, 1)}</span>
            <span className="font-title lg:text-[65px] text-[40px]">{text.slice(1)}</span>
        </p>
    );
}


export const MainMenu = ({ handleMenuToggle }: { handleMenuToggle: () => void }) => {
    const { t, currentLanguage } = useI18n();
    const rootData = useRootLoaderData();
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

    const menuThisIs = currentLanguage === 'vi'
        ? (rootData?.siteDetails?.settings?.menu_this_is_vi || t('home.thisIs'))
        : (rootData?.siteDetails?.settings?.menu_this_is_en || t('home.thisIs'));

    const menuOur = currentLanguage === 'vi'
        ? (rootData?.siteDetails?.settings?.menu_our_vi || t('home.our'))
        : (rootData?.siteDetails?.settings?.menu_our_en || t('home.our'));
    const categoryItems = [
        {
            id: 'blog',
            label: t('menu.blog'),
            image: '/assets/images/menu/frame2.webp',
            imageInFrame: '/assets/images/menu/blog.webp',
            url: '/blogs',
            className: 'left-[160px] top-[35vh]',
            imageClass: ' w-[244px]',
            positionTitleClass: 'right-0 -top-[85px]',
            position: {
                x: '110%',
                y: '-122px'
            },
            positionImage: {
                x: '20%',
                y: '-20%'
            }
        },
        {
            id: 'product',
            label: t('menu.product'),
            image: '/assets/images/menu/frame3.webp',
            imageInFrame: '/assets/images/menu/product.webp',
            // url: '/pick-a-card',
            url: '/products',
            className: 'left-[460px] top-[9vh]',
            imageClass: 'before:content-"" before:absolute before:inset-2 before:rotate-[-15deg] w-[290px]  [rotate:-15deg]',
            positionTitleClass: 'left-1/2 top-[calc(100%+30px)]',
            position: {
                x: '200px',
                y: '122px'
            },
            positionImage: {
                x: '10%',
                y: '10%'
            }
        },
        {
            id: 'story',
            label: t('menu.story'),
            image: '/assets/images/menu/frame2.webp',
            imageInFrame: '/assets/images/menu/story.webp',
            url: '/stories',
            className: 'left-[860px] top-[21vh]',
            imageClass: 'w-[240px]',
            positionTitleClass: 'left-1/2 top-[calc(100%+30px)] translate-x-[-50%]',
            position: {
                x: '0',
                y: '120px'
            },
            positionImage: {
                x: '0',
                y: '10%'
            }
        },
        {
            id: 'contact',
            label: t('menu.contact'),
            image: '/assets/images/menu/frame1.webp',
            imageInFrame: '/assets/images/menu/contact.webp',
            url: '/contact',
            className: 'left-[1130px] top-[40vh]',
            imageClass: 'w-[400px]',
            positionTitleClass: 'left-1/2 top-[calc(100%+30px)] translate-x-[-50%]',
            position: {
                x: '-10%',
                y: '-300px'
            },
            positionImage: {
                x: '-10%',
                y: '-10%'
            }
        },
        {
            id: 'store',
            label: t('menu.store'),
            image: '/assets/images/menu/frame2.webp',
            imageInFrame: '/assets/images/menu/store.webp',
            url: '/store',
            className: 'right-[160px] top-[17vh]',
            imageClass: 'w-[170px]',
            positionTitleClass: '-left-full bottom-0',
            position: {
                x: '-90%',
                y: 0
            },
            positionImage: {
                x: '-20%',
                y: '0'
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
            scale: 1.2,
            ...(item.positionImage?.y ? { y: item.positionImage.y } : { y: 0 }),
            ...(item.positionImage?.x ? { x: item.positionImage.x } : { x: 0 }),
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
        <div className="absolute inset-0 z-[9999] bg-white bg-[url('/assets/images/menu/bg-mobile.webp')] lg:bg-[url('/assets/images/menu/chair-bg.webp'),url('/assets/images/menu/bg.webp')] bg-no-repeat bg-bottom bg-[length:max(100vw,1800px)_auto] lg:overflow-hidden">
            <div className="h-full w-full overflow-x-scroll lg:overflow-x-hidden">
                <div className="lg:hidden block flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <span className="font-title font-bold text-4xl uppercase text-black">This </span>
                    <span className="flex gap-2">
                        <span className="font-title font-bold text-4xl uppercase text-black leading-none ml-1">Is </span>
                        <span className="font-centuryBook italic font-normal text-4xl text-white leading-none mt-1">Our</span>
                    </span>
                </div>
                <div className="fixed inset-0 bg-[#00000099] z-[9999] opacity-0 menu-background pointer-events-none" />
                <div className="lg:w-[1840px] z-[9999] h-full justify-center lg:absolute flex flex-col lg:flex-row lg:top-0 items-center overflow-x-scroll lg:overflow-hidden lg:[zoom:0.8] xl:[zoom:1] lg:left-1/2 lg:top-1/2 lg:translate-x-[-50%] lg:translate-y-[-50%]">
                    {categoryItems.map((item) => (
                        <div>
                            <Link to={item.url} className={clsx('absolute', item.className, isHovering && hoveredItemId !== item.id && '[filter:brightness(0.5)]')} key={item.id}
                                onClick={handleMenuToggle}
                                id={item.id}
                                onMouseEnter={() => {
                                    handleMouseEnter(item);
                                }}
                                onMouseLeave={() => {
                                    handleMouseLeave(item);
                                }}
                            >

                                <div className={clsx('pointer-events-none font-title font-bold text-2xl uppercase text-black txt-title-menu z-[-1]', item.positionTitleClass, isHovering && hoveredItemId === item.id && 'hidden')}>
                                    <span className="relative z-[2]">{item.label}</span>
                                </div>
                                <div className="flex flex-col-reverse lg:flex-col items-center justify-center z-[9999]">
                                    <div id={`menu-image-${item.id}`} className={clsx("object-contain menu-image z-[-2] hidden lg:block relative", item.imageClass)}>
                                        <img className="" src={item.image} alt={item.label} />
                                        <img src={item.imageInFrame} alt={item.label} className="shadow-frame absolute inset-[5px] z-[-1] object-fill w-[calc(100%-10px)] h-[calc(100%-10px)]" />
                                    </div>
                                    <FancyText id={`fancy-text-${item.id}`} className="text-center lg:absolute text-black lg:text-[#FFE977] lg:text-white lg:leading-[0] z-[9]" text={item.label} />
                                </div>
                            </Link>
                        </div>

                    ))}
                </div>
                <MenuToggle isOpen={true} onClick={handleMenuToggle} className={clsx("shadow-[0px_4px_10px_0px_#00000040] absolute top-8 right-4 lg:right-11", !isHovering && 'z-[9999]')} />
            </div>
            <p className="absolute bottom-[11vh] w-full text-center z-[9999] pointer-events-none hidden lg:block">
                <span className={clsx("font-title font-bold text-[40px] xl:text-[90px] uppercase z-[2] relative", isHovering && 'text-white')}>{menuThisIs}</span>
                <span className="font-centuryBook font-italic text-[100px] xl:text-[180px] italic text-[#FFE977] -ml-[50px] xl:-ml-[100px] z-[1]">{menuOur}</span>
            </p>
        </div>
    );

};