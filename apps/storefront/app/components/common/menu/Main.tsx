import clsx from "clsx";
import { animate, spring } from "animejs";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@app/hooks/useI18n";

function FancyText({ id, text, className }: { id: string, text: string, className?: string }) {
    return (
        <p id={id} className={clsx('font-centuryBook font-bold uppercase xl:hidden block', className)}>
            <span className="italic xl:text-[150px] text-[95px]">{text.slice(0, 1)}</span>
            <span className="font-title xl:text-[95px] text-[60px]">{text.slice(1)}</span>
        </p>
    );
}


export const MainMenu = () => {
    const { t } = useI18n();
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const categoryItems = [
        {
            id: 'blog',
            label: t('menu.blog'),
            image: '/assets/images/menu/blog.webp',
            url: '/blogs',
            className: 'max-w-[100vw] xl:max-w-[494px] left-0',
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
            className: 'max-w-[100vw] xl:max-w-[648px] left-[366px]',
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
            className: 'max-w-[100vw] xl:max-w-[446px] left-[864px]',
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
            className: 'max-w-[100vw] xl:max-w-[670px] right-0',
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
            <div className="h-full w-full overflow-x-scroll xl:overflow-x-hidden">
                <div className="xl:w-[1840px] w-[400vw] xl:absolute flex h-[max(calc(100vh-300px),400px)] xl:left-1/2 xl:-translate-x-1/2 items-center overflow-x-scroll xl:overflow-x-hidden">
                    <div className="absolute bottom-0 left-0 w-full h-full bg-[#00000099] z-[-1] opacity-0 menu-background" />
                    {categoryItems.map((item) => (
                        <Link to={item.url} className={clsx('aspect-square w-[100vw] xl:w-auto xl:absolute', item.className)} key={item.id}
                            id={item.id}
                            onMouseEnter={() => {
                                handleMouseEnter(item);
                            }}
                            onMouseLeave={() => {
                                handleMouseLeave(item);
                            }}
                        >
                            <div className="flex flex-col-reverse xl:flex-col items-center justify-center">
                                <img id={`menu-image-${item.id}`} src={item.image} alt={item.label} className="w-full h-full object-contain menu-image z-[-2]" />
                                <FancyText id={`fancy-text-${item.id}`} className="text-center xl:absolute text-[#FFE977] xl:text-white z-[9] xl:leading-[0]" text={item.label} />
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-[url('/assets/images/menu/background.webp')] bg-repeat-x bg-bottom bg-center xl:bg-contain bg-cover">
                    <div className="absolute bottom-0 left-0 w-full h-full bg-[#00000099] z-[2] opacity-0 menu-background" />
                    <p className="absolute bottom-0 w-full text-center mb-[98px] z-[3]">
                        <span className={clsx("font-title font-bold text-[40px] xl:text-[95px] uppercase z-[2] relative", isHovering && 'text-white')}>{t('home.thisIs')}</span>
                        <span className="font-centuryBook font-italic text-[100px] xl:text-[200px] italic text-[#FFE977] -ml-[50px] xl:-ml-[100px] z-[1]">{t('home.our')}</span>
                    </p>
                    <div className="overflow-hidden h-[300px] relative">
                        <img src="/assets/images/menu/chair-bottom.webp" alt="logo" className="w-full h-full xl:object-cover object-position-center object-contain" />
                    </div>
                </div>
            </div>
        </div>
    );

};