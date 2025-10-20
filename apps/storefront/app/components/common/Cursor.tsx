import { useEffect, useRef, useCallback, useState } from 'react';

const cursorImg = '/assets/images/cursor.svg';

const Cursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const shadowRef = useRef<HTMLDivElement>(null);
    const rippleRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            const isMobileDevice =
                window.innerWidth <= 768 || // Tablet and below
                'ontouchstart' in window || // Touch device
                navigator.maxTouchPoints > 0 || // Touch device
                /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            setIsMobile(isMobileDevice);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Track mouse position and animation
    const mousePosition = useRef({ x: 0, y: 0 });
    const cursorPosition = useRef({ x: 0, y: 0 });
    const shadowPosition = useRef({ x: 0, y: 0 });
    const isHovering = useRef(false);
    const animationFrameId = useRef<number>();
    const hoverAnimationId = useRef<number>();

    // Smooth lerp function
    const lerp = (start: number, end: number, factor: number) => {
        return start + (end - start) * factor;
    };

    // Smooth mouse tracking with requestAnimationFrame
    const animateCursor = useCallback(() => {
        if (cursorRef.current && shadowRef.current) {
            // Main cursor follows mouse closely (fast lerp)
            cursorPosition.current.x = lerp(cursorPosition.current.x, mousePosition.current.x, 0.9);
            cursorPosition.current.y = lerp(cursorPosition.current.y, mousePosition.current.y, 0.9);

            // Shadow follows more slowly (slower lerp for trail effect)
            shadowPosition.current.x = lerp(shadowPosition.current.x, mousePosition.current.x, 0.25);
            shadowPosition.current.y = lerp(shadowPosition.current.y, mousePosition.current.y, 0.25);

            const offsetX = isHovering.current ? 20 : 16;
            const offsetY = isHovering.current ? 20 : 16;
            const scale = isHovering.current ? 1.2 : 1;

            // Update cursor position
            cursorRef.current.style.transform = `translate3d(${cursorPosition.current.x - offsetX}px, ${cursorPosition.current.y - offsetY}px, 0) scale(${scale})`;

            // Update shadow position with different scale
            const shadowScale = isHovering.current ? 1.5 : 1;
            shadowRef.current.style.transform = `translate3d(${shadowPosition.current.x - offsetX}px, ${shadowPosition.current.y - offsetY}px, 0) scale(${shadowScale})`;
        }

        animationFrameId.current = requestAnimationFrame(animateCursor);
    }, []);

    // Smooth hover transitions
    const animateHover = useCallback(() => {
        if (cursorRef.current && shadowRef.current) {
            if (isHovering.current) {
                cursorRef.current.style.filter = 'brightness(1.2) contrast(1.1)';
                shadowRef.current.style.opacity = '0.6';
                shadowRef.current.style.filter = 'blur(12px)';
            } else {
                cursorRef.current.style.filter = 'none';
                shadowRef.current.style.opacity = '0.8';
                shadowRef.current.style.filter = 'blur(8px)';
            }
        }
    }, []);

    // Track mouse position (only on non-mobile)
    useEffect(() => {
        if (isMobile) return;

        const moveCursor = (e: MouseEvent) => {
            mousePosition.current.x = e.clientX;
            mousePosition.current.y = e.clientY;
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const computedStyle = window.getComputedStyle(target);
            const cursor = computedStyle.cursor;

            const shouldBeHovering = cursor === 'pointer' ||
                                   target.tagName === 'A' ||
                                   target.tagName === 'BUTTON' ||
                                   typeof target.onclick === 'function' ||
                                   target.getAttribute('role') === 'button' ||
                                   target.closest('a') !== null ||
                                   target.closest('button') !== null;

            if (shouldBeHovering !== isHovering.current) {
                isHovering.current = shouldBeHovering;
                animateHover();
            }
        };

        const handleClick = (e: MouseEvent) => {
            if (rippleRef.current) {
                rippleRef.current.style.left = `${e.clientX}px`;
                rippleRef.current.style.top = `${e.clientY}px`;
                rippleRef.current.classList.remove('show');
                // Wait for the removal to be processed
                void rippleRef.current.offsetWidth;
                rippleRef.current.classList.add('show');
            }

            // Shadow burst effect
            if (shadowRef.current) {
                const currentTransform = shadowRef.current.style.transform;
                const scale = isHovering.current ? 1.5 : 1;
                const offsetX = isHovering.current ? 20 : 16;
                const offsetY = isHovering.current ? 20 : 16;

                shadowRef.current.style.transform = `translate3d(${mousePosition.current.x - offsetX}px, ${mousePosition.current.y - offsetY}px, 0) scale(${scale * 2})`;
                shadowRef.current.style.opacity = '0.6';

                // Reset after animation
                setTimeout(() => {
                    if (shadowRef.current) {
                        shadowRef.current.style.transform = currentTransform;
                        shadowRef.current.style.opacity = isHovering.current ? '0.6' : '0.8';
                    }
                }, 200);
            }
        };

        document.addEventListener('mousemove', moveCursor);
        document.addEventListener('mousemove', handleMouseOver);
        document.addEventListener('mousedown', handleClick);

        // Start animation loop
        animationFrameId.current = requestAnimationFrame(animateCursor);

        // Hide native cursor
        document.body.style.cursor = 'none';

        return () => {
            document.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mousemove', handleMouseOver);
            document.removeEventListener('mousedown', handleClick);

            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }

            if (hoverAnimationId.current) {
                cancelAnimationFrame(hoverAnimationId.current);
            }

            document.body.style.cursor = '';
        }
    }, [animateCursor, animateHover, isMobile]);

    // Don't render custom cursor on mobile devices
  if (isMobile) {
    return null;
  }

  return (
        <>
            {/* Shadow */}
            <div
                ref={shadowRef}
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    pointerEvents: 'none',
                    width: 32,
                    height: 32,
                    transform: 'translate3d(-100px, -100px, 0) scale(1)',
                    willChange: 'transform, opacity, filter',
                    zIndex: 9999,
                    opacity: 0.8,
                    filter: 'blur(8px)',
                    transition: 'opacity 0.3s cubic-bezier(.25,.46,.45,.94), filter 0.2s ease-out',
                }}
            >
                <img
                    src={cursorImg}
                    width={32}
                    height={32}
                    style={{
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        mixBlendMode: 'multiply',
                    }}
                    draggable={false}
                    alt="cursor shadow"
                />
            </div>
            {/* Cursor image */}
            <div
                ref={cursorRef}
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    pointerEvents: 'none',
                    width: 32,
                    height: 32,
                    transform: 'translate3d(-100px, -100px, 0) scale(1)',
                    willChange: 'transform, filter',
                    zIndex: 10000,
                    transition: 'filter 0.2s ease-out',
                }}
            >
                <img
                    src={cursorImg}
                    width={32}
                    height={32}
                    style={{
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        mixBlendMode: 'normal',
                    }}
                    draggable={false}
                    alt="cursor"
                />
            </div>
            {/* Ripple effect for click */}
            <div
                ref={rippleRef}
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    pointerEvents: 'none',
                    width: 0,
                    height: 0,
                    zIndex: 9998,
                }}
                className="cursor-ripple"
            ></div>
            <style>{`
        .cursor-ripple {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          width: 0;
          height: 0;
          transform: translate(-50%, -50%);
        }
        .cursor-ripple.show {
          animation: cursor-ripple-burst 0.6s cubic-bezier(.25,.46,.45,.94);
        }
        @keyframes cursor-ripple-burst {
          0% {
            width: 0px;
            height: 0px;
            border: 2px solid rgba(0,0,0,0.3);
            opacity: 1;
          }
          50% {
            width: 60px;
            height: 60px;
            border: 1px solid rgba(0,0,0,0.2);
            opacity: 0.5;
          }
          100% {
            width: 120px;
            height: 120px;
            border: 0.5px solid rgba(0,0,0,0);
            opacity: 0;
          }
        }
      `}</style>
        </>
    );
};

export default Cursor;
