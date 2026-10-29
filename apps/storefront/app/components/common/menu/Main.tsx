import { useI18n } from '@app/hooks/useI18n';
import { useRootLoaderData } from '@app/hooks/useRootLoaderData';
import { animate, spring } from 'animejs';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { MenuToggle } from '../MenuToggle/MenuToggle';

function FancyText({ id, text, className }: { id: string; text: string; className?: string }) {
    return (
        <p
            id={id}
            className={clsx(
                'font-centuryBook font-bold uppercase desk:hidden block pointer-events-none absolute bottom-0',
                className,
            )}
        >
            <span className="italic desk:text-[100px] text-[50px]">{text.slice(0, 1)}</span>
            <span className="font-title desk:text-[65px] text-[40px]">{text.slice(1)}</span>
        </p>
    );
}

/**
 * The menu is drawn on a fixed design canvas and scaled uniformly to fit the
 * viewport on **both axes**, so the composition can never be clipped or pushed
 * off screen. Frames sit at absolute canvas coordinates (1840 × 1040).
 */
const CANVAS_WIDTH = 1840;
/** Horizontal span of the frames (x = 160 … 1680) — used for the width fit. */
const CONTENT_WIDTH = 1520;
/**
 * Canvas height: the design artboard is 1840 × 900 (the frames sit in its upper
 * two thirds, the "this is / our" title belongs to the overlay bottom, exactly
 * like the current site).
 */
const CANVAS_HEIGHT = 900;
/** Gap kept between the outer frames and the screen edges. */
const EDGE_GAP = 24;
/** Vertical breathing room above and below the canvas. */
const VERTICAL_PAD = 12;
/** Never scale past this: on huge screens the composition simply stops growing. */
const MAX_SCALE = 1.12;
/** Below this width the menu switches to the simple stacked layout. */
const DESKTOP_MIN_WIDTH = 769;

type MenuItem = {
    id: string;
    defaultLabelKey: string;
    image: string;
    imageInFrame: string;
    url: string;
    /** Canvas coordinates (px on the 1840 × 1040 design canvas). */
    left?: number;
    right?: number;
    top: number;
    imageWidth: number;
    imageClass: string;
    positionTitleClass: string;
    position: { x?: string; y?: string | number };
    positionImage: { x?: string; y?: string | number };
};

const DEFAULT_CATEGORY_ITEMS: MenuItem[] = [
    {
        id: 'blog',
        defaultLabelKey: 'menu.blog',
        image: '/assets/images/menu/frame2.webp',
        imageInFrame: '/assets/images/menu/blog.webp',
        url: '/blogs',
        left: 160,
        top: 315,
        imageWidth: 234,
        imageClass: '',
        positionTitleClass: 'right-0 -top-[85px]',
        position: { x: '110%', y: '-122px' },
        positionImage: { x: '20%', y: '-20%' },
    },
    {
        id: 'product',
        defaultLabelKey: 'menu.product',
        image: '/assets/images/menu/frame3.webp',
        imageInFrame: '/assets/images/menu/product.webp',
        url: '/products',
        left: 460,
        top: 81,
        imageWidth: 270,
        imageClass: 'before:content-"" before:absolute before:inset-2 before:rotate-[-15deg] [rotate:-15deg]',
        positionTitleClass: 'left-1/2 top-[calc(100%+30px)]',
        position: { x: '200px', y: '75px' },
        positionImage: { x: '10%', y: '10%' },
    },
    {
        id: 'story',
        defaultLabelKey: 'menu.story',
        image: '/assets/images/menu/frame2.webp',
        imageInFrame: '/assets/images/menu/story.webp',
        url: '/stories',
        left: 860,
        top: 189,
        imageWidth: 225,
        imageClass: '',
        positionTitleClass: 'left-1/2 top-[calc(100%+30px)] translate-x-[-50%]',
        position: { x: '0', y: '80px' },
        positionImage: { x: '0', y: '-10%' },
    },
    {
        id: 'contact',
        defaultLabelKey: 'menu.contact',
        image: '/assets/images/menu/frame1.webp',
        imageInFrame: '/assets/images/menu/contact.webp',
        url: '/contact',
        left: 1130,
        top: 360,
        imageWidth: 342,
        imageClass: '',
        positionTitleClass: 'left-1/2 top-[calc(100%+30px)] translate-x-[-50%]',
        position: { x: '-10%', y: '-220px' },
        positionImage: { x: '-10%', y: '10%' },
    },
    {
        id: 'store',
        defaultLabelKey: 'menu.store',
        image: '/assets/images/menu/frame2.webp',
        imageInFrame: '/assets/images/menu/store.webp',
        url: '/store',
        right: 160,
        top: 153,
        imageWidth: 162,
        imageClass: '',
        positionTitleClass: '-left-full bottom-0',
        position: { x: '-90%', y: 0 },
        positionImage: { x: '-20%', y: '0' },
    },
];

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const MainMenu = ({ handleMenuToggle }: { handleMenuToggle: () => void }) => {
    const { t, currentLanguage } = useI18n();
    const rootData = useRootLoaderData();
    const [isHovering, setIsHovering] = useState(false);
    const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [viewport, setViewport] = useState({ width: 0, height: 0 });

    const dialogRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef(handleMenuToggle);
    closeRef.current = handleMenuToggle;

    useEffect(() => {
        setMounted(true);
    }, []);

    // The canvas is scaled to the *viewport*, so it needs the live size.
    useEffect(() => {
        const update = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
        update();
        window.addEventListener('resize', update);
        window.addEventListener('orientationchange', update);
        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('orientationchange', update);
        };
    }, []);

    // Lock the page behind the overlay (compensating for the scrollbar width so the
    // layout does not jump when it disappears).
    useEffect(() => {
        const { body, documentElement } = document;
        const scrollbar = window.innerWidth - documentElement.clientWidth;
        const previous = {
            bodyOverflow: body.style.overflow,
            bodyPaddingRight: body.style.paddingRight,
            htmlOverflow: documentElement.style.overflow,
        };

        body.style.overflow = 'hidden';
        documentElement.style.overflow = 'hidden';
        if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

        return () => {
            body.style.overflow = previous.bodyOverflow;
            body.style.paddingRight = previous.bodyPaddingRight;
            documentElement.style.overflow = previous.htmlOverflow;
        };
    }, []);

    // Dialog behaviour: focus in, trap Tab, close on Escape, restore focus on close.
    useEffect(() => {
        const node = dialogRef.current;
        const previouslyFocused = document.activeElement as HTMLElement | null;

        const focusables = () =>
            Array.from(node?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
                (element) => element.offsetParent !== null,
            );

        focusables()[0]?.focus();

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                closeRef.current();
                return;
            }

            if (event.key !== 'Tab') return;

            const items = focusables();
            if (!items.length) return;

            const first = items[0];
            const last = items[items.length - 1];
            const active = document.activeElement as HTMLElement | null;

            if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            } else if (event.shiftKey && active === first) {
                event.preventDefault();
                last.focus();
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            previouslyFocused?.focus?.();
        };
        // `mounted` flips right before the portal renders, so the dialog ref only
        // exists from that render on.
    }, [mounted]);

    const isDesktopMenu = !viewport.width || viewport.width >= DESKTOP_MIN_WIDTH;
    const scale = viewport.width
        ? Math.min(
            MAX_SCALE,
            (viewport.width - EDGE_GAP * 2) / CONTENT_WIDTH,
            (viewport.height - VERTICAL_PAD * 2) / CANVAS_HEIGHT,
        )
        : 1;

    const menuThisIs =
        currentLanguage === 'vi'
            ? rootData?.siteDetails?.settings?.menu_this_is_vi || t('home.thisIs')
            : rootData?.siteDetails?.settings?.menu_this_is_en || t('home.thisIs');

    const menuOur =
        currentLanguage === 'vi'
            ? rootData?.siteDetails?.settings?.menu_our_vi || t('home.our')
            : rootData?.siteDetails?.settings?.menu_our_en || t('home.our');

    const configuredItems = rootData?.siteDetails?.settings?.menu_category_items;
    const hasConfig = Array.isArray(configuredItems) && configuredItems.length > 0;

    const categoryItems = DEFAULT_CATEGORY_ITEMS.map((defaultItem) => {
        const defaultLabel = t(defaultItem.defaultLabelKey);
        if (!hasConfig) {
            return { ...defaultItem, label: defaultLabel };
        }

        const config = configuredItems.find((ci: any) => ci.id === defaultItem.id);
        if (!config) {
            return { ...defaultItem, label: defaultLabel };
        }

        if (config.enabled === false) return null;

        const label =
            currentLanguage === 'vi'
                ? config.label_vi?.trim() || config.label_en?.trim() || defaultLabel
                : config.label_en?.trim() || defaultLabel;

        return {
            ...defaultItem,
            label,
            url: config.url?.trim() || defaultItem.url,
            image: config.image?.trim() || defaultItem.image,
            imageInFrame: config.imageInFrame?.trim() || defaultItem.imageInFrame,
        };
    }).filter(Boolean) as (MenuItem & { label: string })[];

    const handleMouseEnter = useCallback((item: any) => {
        const el = document.getElementById(`fancy-text-${item.id}`);
        if (!el) return;
        el.style.display = 'block';
        const image = document.getElementById(`menu-image-${item.id}`);
        if (image) image.style.zIndex = '2';
        setIsHovering(true);
        setHoveredItemId(item.id);

        document.querySelectorAll('.menu-background').forEach((backdrop) => {
            (backdrop as HTMLElement).style.opacity = '1';
        });

        animate(`#fancy-text-${item.id}`, {
            opacity: [0, 1],
            ...(item.position?.y ? { y: item.position.y } : {}),
            ...(item.position?.x ? { x: item.position.x } : {}),
            ease: spring({ bounce: 0.65, duration: 400 }),
        });
        animate(`#menu-image-${item.id}`, {
            scale: 1.15,
            ...(item.positionImage?.y ? { y: item.positionImage.y } : { y: 0 }),
            ...(item.positionImage?.x ? { x: item.positionImage.x } : { x: 0 }),
            ease: spring({ bounce: 0.65, duration: 400 }),
        });
    }, []);

    const handleMouseLeave = useCallback((item: any) => {
        animate(`#fancy-text-${item.id}`, {
            opacity: [1, 0],
            x: 0,
            y: 0,
            ease: spring({ bounce: 0.65, duration: 400 }),
        });
        animate(`#menu-image-${item.id}`, {
            x: 0,
            y: 0,
            scale: 1,
            ease: spring({ bounce: 0.65, duration: 400 }),
        });

        document.querySelectorAll('.menu-background').forEach((backdrop) => {
            (backdrop as HTMLElement).style.opacity = '0';
        });

        const image = document.getElementById(`menu-image-${item.id}`);
        if (image) image.style.zIndex = '-2';

        setIsHovering(false);
        setHoveredItemId(null);
    }, []);

    if (!mounted) return null;

    const overlay = (
        <div
            ref={dialogRef}
            id="main-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t('menu.title', { defaultValue: 'Main menu' })}
            data-menu-overlay
            className="fixed inset-0 z-[9999] h-[100dvh] w-screen overflow-hidden bg-white bg-[url('/assets/images/menu/bg-mobile.webp')] desk:bg-[url('/assets/images/menu/chair-bg.webp'),url('/assets/images/menu/bg.webp')] bg-no-repeat bg-bottom bg-[length:max(100vw,1800px)_auto]"
        >
            {/* Hover backdrop */}
            <div className="menu-background pointer-events-none absolute inset-0 z-[1] bg-[#00000099] opacity-0 transition-opacity duration-300" />

            {isDesktopMenu ? (
                <div className="absolute inset-0 z-[2] flex items-center justify-center">
                    <div
                        className="relative shrink-0"
                        style={{
                            width: CANVAS_WIDTH,
                            height: CANVAS_HEIGHT,
                            transform: `scale(${scale})`,
                            transformOrigin: 'center',
                        }}
                    >
                        {categoryItems.map((item) => (
                            <Link
                                key={item.id}
                                id={item.id}
                                to={item.url}
                                onClick={handleMenuToggle}
                                onMouseEnter={() => handleMouseEnter(item)}
                                onMouseLeave={() => handleMouseLeave(item)}
                                className={clsx('absolute', isHovering && hoveredItemId !== item.id && '[filter:brightness(0.5)]')}
                                style={item.right != null ? { right: item.right, top: item.top } : { left: item.left, top: item.top }}
                            >
                                <div
                                    className={clsx(
                                        'pointer-events-none font-title font-bold text-2xl uppercase text-black txt-title-menu z-[-1]',
                                        item.positionTitleClass,
                                        isHovering && hoveredItemId === item.id && 'hidden',
                                    )}
                                >
                                    <span className="relative z-[2]">{item.label}</span>
                                </div>

                                <div className="flex flex-col-reverse desk:flex-col items-center justify-center z-[9999]">
                                    <div
                                        id={`menu-image-${item.id}`}
                                        style={{ width: item.imageWidth }}
                                        className={clsx('object-contain menu-image z-[-2] hidden desk:block relative', item.imageClass)}
                                    >
                                        <img className="" src={item.image} alt={item.label} />
                                        <img
                                            src={item.imageInFrame}
                                            alt={item.label}
                                            className="shadow-frame absolute inset-[5px] z-[-1] object-fill w-[calc(100%-10px)] h-[calc(100%-10px)]"
                                        />
                                    </div>
                                    <FancyText
                                        id={`fancy-text-${item.id}`}
                                        className="text-center desk:absolute text-black desk:text-[#FFE977] desk:text-white desk:leading-[0] z-[9]"
                                        text={item.label}
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="relative z-[2] flex h-full flex-col gap-6 overflow-y-auto px-6 pb-24 pt-24">
                    <div>
                        <span className="font-title text-4xl font-bold uppercase text-black">{menuThisIs} </span>
                        <span className="font-centuryBook text-4xl italic text-[#FFE977]">{menuOur}</span>
                    </div>
                    {categoryItems.map((item) => (
                        <Link
                            key={item.id}
                            id={item.id}
                            to={item.url}
                            onClick={handleMenuToggle}
                            className="font-title text-3xl font-bold uppercase text-black"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}

            {/* "this is / our" — sits on the bench, anchored to the viewport bottom */}
            <p
                className="pointer-events-none absolute bottom-[14vh] z-[3] w-full text-center"
                style={{ transform: `scale(${scale})`, transformOrigin: 'bottom center' }}
            >
                <span className="relative z-[2] font-title text-[90px] font-bold uppercase text-black">{menuThisIs}</span>
                <span className="-ml-[100px] font-centuryBook text-[180px] italic text-[#FFE977]">{menuOur}</span>
            </p>

            <MenuToggle
                isOpen
                onClick={handleMenuToggle}
                aria-controls="main-menu"
                className="absolute right-4 top-8 z-[10000] shadow-[0px_4px_10px_0px_#00000040] desk:right-11"
            />
        </div>
    );

    return createPortal(overlay, document.body);
};
