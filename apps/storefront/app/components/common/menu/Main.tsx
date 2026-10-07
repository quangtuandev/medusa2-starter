
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
        <p id={id} className={clsx('font-centuryBook font-bold uppercase desk:hidden block pointer-events-none absolute bottom-0', className)}>
            <span className="italic desk:text-[100px] text-[50px]">{text.slice(0, 1)}</span>
            <span className="font-title desk:text-[65px] text-[40px]">{text.slice(1)}</span>
        </p>
    );
}

/**
 * Menu artboard. The frames are laid out on a fixed 1840px wide canvas, and the
 * outermost ones span from x=160 (BLOG) to x=1680 (STORES) — see the `className`
 * of DEFAULT_CATEGORY_ITEMS below.
 */
const MENU_ARTBOARD_WIDTH = 1840;
const MENU_CONTENT_WIDTH = 1520;
/** Gap kept between the outer frames and the screen edges. */
const MENU_EDGE_GAP = 24;
/**
 * Vertical ceiling: the composition is centred on the viewport, so its topmost
 * point (the rotated PRODUCT frame, at ~5.8% of the viewport height) reaches the
 * top edge around scale 1.13. Stopping at 1.12 keeps every frame fully visible —
 * on wider screens the composition simply stops growing and the gaps widen.
 */
const MENU_MAX_SCALE = 1.12;
/** The overlay is only mounted above this width, so its desktop layout starts here. */
const MENU_DESKTOP_MIN_WIDTH = 769;


const DEFAULT_CATEGORY_ITEMS = [
    {
        id: 'blog',
        defaultLabelKey: 'menu.blog',
        image: '/assets/images/menu/frame2.webp',
        imageInFrame: '/assets/images/menu/blog.webp',
        url: '/blogs',
        className: 'left-[160px] top-[35vh]',
        imageClass: 'w-[26vh]',
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
        defaultLabelKey: 'menu.product',
        image: '/assets/images/menu/frame3.webp',
        imageInFrame: '/assets/images/menu/product.webp',
        url: '/products',
        className: 'left-[460px] top-[9vh]',
        imageClass: 'before:content-"" before:absolute before:inset-2 before:rotate-[-15deg] w-[30vh] [rotate:-15deg]',
        positionTitleClass: 'left-1/2 top-[calc(100%+30px)]',
        position: {
            x: '200px',
            y: '75px'
        },
        positionImage: {
            x: '10%',
            y: '10%'
        }
    },
    {
        id: 'story',
        defaultLabelKey: 'menu.story',
        image: '/assets/images/menu/frame2.webp',
        imageInFrame: '/assets/images/menu/story.webp',
        url: '/stories',
        className: 'left-[860px] top-[21vh]',
        imageClass: 'w-[25vh]',
        positionTitleClass: 'left-1/2 top-[calc(100%+30px)] translate-x-[-50%]',
        position: {
            x: '0',
            y: '80px'
        },
        positionImage: {
            x: '0',
            y: '10%'
        }
    },
    {
        id: 'contact',
        defaultLabelKey: 'menu.contact',
        image: '/assets/images/menu/frame1.webp',
        imageInFrame: '/assets/images/menu/contact.webp',
        url: '/contact',
        className: 'left-[1130px] top-[40vh]',
        imageClass: 'w-[38vh]',
        positionTitleClass: 'left-1/2 top-[calc(100%+30px)] translate-x-[-50%]',
        position: {
            x: '-10%',
            y: '-220px'
        },
        positionImage: {
            x: '-10%',
            y: '-10%'
        }
    },
    {
        id: 'store',
        defaultLabelKey: 'menu.store',
        image: '/assets/images/menu/frame2.webp',
        imageInFrame: '/assets/images/menu/store.webp',
        url: '/store',
        className: 'right-[160px] top-[17vh]',
        imageClass: 'w-[18vh]',
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

export const MainMenu = ({ handleMenuToggle }: { handleMenuToggle: () => void }) => {
    const { t, currentLanguage } = useI18n();
    const rootData = useRootLoaderData();
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
    const [viewportWidth, setViewportWidth] = useState<number>(() =>
        typeof document === 'undefined' ? 0 : document.documentElement.clientWidth || window.innerWidth
    );

    useEffect(() => {
        const updateViewportWidth = () => setViewportWidth(document.documentElement.clientWidth || window.innerWidth);
        updateViewportWidth();
        window.addEventListener('resize', updateViewportWidth);
        return () => window.removeEventListener('resize', updateViewportWidth);
    }, []);

    // The menu is drawn on a fixed-width artboard, so the whole composition is
    // scaled to the viewport: the outer frames (BLOG / STORES) keep a small gap to
    // the screen edges, and the scale never grows past the point where the topmost
    // frame would be cut (wider screens just get bigger gaps).
    const isDesktopMenu = !viewportWidth || viewportWidth >= MENU_DESKTOP_MIN_WIDTH;
    const menuZoom = viewportWidth
        ? Math.min(MENU_MAX_SCALE, (viewportWidth - MENU_EDGE_GAP * 2) / MENU_CONTENT_WIDTH)
        : 1;

    const menuThisIs = currentLanguage === 'vi'
        ? (rootData?.siteDetails?.settings?.menu_this_is_vi || t('home.thisIs'))
        : (rootData?.siteDetails?.settings?.menu_this_is_en || t('home.thisIs'));

    const menuOur = currentLanguage === 'vi'
        ? (rootData?.siteDetails?.settings?.menu_our_vi || t('home.our'))
        : (rootData?.siteDetails?.settings?.menu_our_en || t('home.our'));

    const configuredItems = rootData?.siteDetails?.settings?.menu_category_items;
    const hasConfig = Array.isArray(configuredItems) && configuredItems.length > 0;

    const categoryItems = DEFAULT_CATEGORY_ITEMS.map((defaultItem) => {
        const defaultLabel = t(defaultItem.defaultLabelKey);
        if (!hasConfig) {
            return {
                ...defaultItem,
                label: defaultLabel,
            };
        }

        const config = configuredItems.find((ci) => ci.id === defaultItem.id);
        if (!config) {
            return {
                ...defaultItem,
                label: defaultLabel,
            };
        }

        if (config.enabled === false) {
            return null;
        }

        const label = currentLanguage === 'vi'
            ? (config.label_vi?.trim() || config.label_en?.trim() || defaultLabel)
            : (config.label_en?.trim() || defaultLabel);

        return {
            ...defaultItem,
            label,
            url: config.url?.trim() || defaultItem.url,
            image: config.image?.trim() || defaultItem.image,
            imageInFrame: config.imageInFrame?.trim() || defaultItem.imageInFrame,
        };
    }).filter(Boolean) as (typeof DEFAULT_CATEGORY_ITEMS[0] & { label: string })[];

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
            scale: 1.15,
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
        <div className="absolute inset-0 z-[9999] bg-white bg-[url('/assets/images/menu/bg-mobile.webp')] desk:bg-[url('/assets/images/menu/chair-bg.webp'),url('/assets/images/menu/bg.webp')] bg-no-repeat bg-bottom bg-[length:max(100vw,1800px)_auto] desk:overflow-hidden">
            <div className="fixed inset-0 bg-[#00000099] z-[9999] opacity-0 menu-background pointer-events-none" />
            <div className="h-full w-full overflow-x-scroll desk:overflow-x-hidden">
                <div className="desk:hidden block flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <span className="font-title font-bold text-4xl uppercase text-black">{menuThisIs} </span>
                    <span className="flex gap-2">
                        <span className="font-centuryBook italic font-normal text-4xl text-white leading-none mt-1">{menuOur}</span>
                    </span>
                </div>
                <div
                    className="z-[9999] h-full justify-center desk:absolute flex flex-col desk:flex-row items-center overflow-x-scroll desk:overflow-hidden desk:left-1/2 desk:top-1/2"
                    style={isDesktopMenu
                        ? { width: MENU_ARTBOARD_WIDTH, transform: `translate(-50%, -50%) scale(${menuZoom})` }
                        : undefined}
                >
                    {categoryItems.map((item) => (
                        <div key={item.id}>
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
                                <div className="flex flex-col-reverse desk:flex-col items-center justify-center z-[9999]">
                                    <div id={`menu-image-${item.id}`} className={clsx("object-contain menu-image z-[-2] hidden desk:block relative", item.imageClass)}>
                                        <img className="" src={item.image} alt={item.label} />
                                        <img src={item.imageInFrame} alt={item.label} className="shadow-frame absolute inset-[5px] z-[-1] object-fill w-[calc(100%-10px)] h-[calc(100%-10px)]" />
                                    </div>
                                    <FancyText id={`fancy-text-${item.id}`} className="text-center desk:absolute text-black desk:text-[#FFE977] desk:text-white desk:leading-[0] z-[9]" text={item.label} />
                                </div>
                            </Link>
                        </div>

                    ))}
                </div>
                <MenuToggle isOpen={true} onClick={handleMenuToggle} className={clsx("shadow-[0px_4px_10px_0px_#00000040] absolute top-8 right-4 desk:right-11", !isHovering && 'z-[9999]')} />
            </div>
            <p
                className={clsx(
                    "absolute bottom-[14vh] w-full text-center z-[9999] pointer-events-none hidden desk:block transition-all duration-300 ease-in-out",
                    "opacity-100 translate-y-0"
                )}
                // Same scale as the frames above, anchored to the bottom centre so the
                // title keeps sitting on the bench while staying in proportion with them.
                style={isDesktopMenu ? { transform: `scale(${menuZoom})`, transformOrigin: 'bottom center' } : undefined}
            >
                <span className="font-title font-bold text-[90px] uppercase z-[2] relative">{menuThisIs}</span>
                <span className="font-centuryBook font-italic text-[180px] italic text-[#FFE977] -ml-[100px] z-[1]">{menuOur}</span>
            </p>
        </div>
    );

};