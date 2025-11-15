import React, { FC, useState, useCallback, memo } from 'react'

interface LogoProps {
    className?: string;
    fill?: string;
    onLetterClick?: (letter: 'K' | 'I' | 'R' | 'A') => void;
    activeLetter?: 'K' | 'I' | 'R' | 'A' | null;
    onMouseEnterLetter?: (letter: 'K' | 'I' | 'R' | 'A') => void;
    onMouseLeaveLogo?: () => void;
}

export const Logo: FC<LogoProps> = memo(({
    className,
    fill = "#FFFFFF",
    onLetterClick,
    onMouseEnterLetter,
    onMouseLeaveLogo
}) => {
    const [hoveredLetter, setHoveredLetter] = useState<'K' | 'I' | 'R' | 'A' | null>(null);

    const handleMouseEnter = useCallback((letter: 'K' | 'I' | 'R' | 'A') => {
        setHoveredLetter(letter);
        onMouseEnterLetter?.(letter);
    }, [onMouseEnterLetter]);

    const handleMouseLeave = useCallback(() => {
        setHoveredLetter(null);
    }, []);

    const handleLetterClick = useCallback((letter: 'K' | 'I' | 'R' | 'A') => {
        onLetterClick?.(letter);
    }, [onLetterClick]);

    const handleLogoMouseLeave = useCallback(() => {
        onMouseLeaveLogo?.();
    }, [onMouseLeaveLogo]);

    // Memoized handlers for each letter
    const handleKClick = useCallback(() => handleLetterClick('K'), [handleLetterClick]);
    const handleIClick = useCallback(() => handleLetterClick('I'), [handleLetterClick]);
    const handleRClick = useCallback(() => handleLetterClick('R'), [handleLetterClick]);
    const handleAClick = useCallback(() => handleLetterClick('A'), [handleLetterClick]);

    const handleKMouseEnter = useCallback(() => handleMouseEnter('K'), [handleMouseEnter]);
    const handleIMouseEnter = useCallback(() => handleMouseEnter('I'), [handleMouseEnter]);
    const handleRMouseEnter = useCallback(() => handleMouseEnter('R'), [handleMouseEnter]);
    const handleAMouseEnter = useCallback(() => handleMouseEnter('A'), [handleMouseEnter]);
    return (
        <div className={className}>
            <div
                className="title flex items-center lg:gap-6 mix-blend-exclusion gap-1"
                onMouseLeave={handleLogoMouseLeave}
            >
                <span
                    className=" character-k transition-all duration-300 z-10"
                    onClick={handleKClick}
                    onMouseEnter={handleKMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <svg
                        pointerEvents="none"
                        width="109"
                        height="108"
                        viewBox="0 0 109 108"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="character-k h-[80px] lg:h-auto"
                    >
                        <path
                            pointerEvents="none"

                            d="M106.819 0H71.8792L31.1762 43.5259V0H0V108H31.1762V80.8966L41.8452 69.4914L72.3205 108H109L62.4823 47.8707L106.819 0Z"
                            fill={fill}
                            className="character-k"
                        />
                    </svg>
                </span>
                <span
                    className={` character-i transition-all duration-300`}
                    onClick={handleIClick}
                    onMouseEnter={handleIMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <svg
                        pointerEvents="none"
                        width="31"
                        height="108"
                        viewBox="0 0 31 108"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="character-i h-[80px] lg:h-auto"
                    >
                        <path
                            pointerEvents="none"
                            d="M31 0H0V108H31V0Z"
                            fill={fill}
                            className="character-i"
                        />
                    </svg>
                </span>
                <span
                    className={` character-r transition-all duration-300`}
                    onClick={handleRClick}
                    onMouseEnter={handleRMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <svg
                        pointerEvents="none"
                        width="101"
                        height="109"
                        viewBox="0 0 101 109"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="character-r h-[80px] lg:h-auto"
                    >
                        <path
                            pointerEvents="none"
                            d="M77.4655 74.7026C83.8057 71.5704 88.8153 67.2637 92.3898 61.8345C96.3296 55.8573 98.3387 48.6794 98.3387 40.4835C98.3387 32.1832 96.3296 24.9009 92.3898 18.8192C88.45 12.7375 82.7882 8.03927 75.5869 4.82878C68.4118 1.6183 59.7494 0 49.8608 0H0V109H31.6228V80.3405H47.4082L66.9507 109H100.739H100.843H101L100.843 108.765L77.4655 74.7026ZM61.8889 51.6027C58.8884 54.2651 54.218 55.6224 48.0083 55.6224H31.6228V25.1619H48.0083C54.1919 25.1619 58.8623 26.5192 61.8889 29.1815C64.8894 31.8439 66.4027 35.6286 66.4027 40.4574C66.4027 45.2079 64.8633 48.9665 61.8889 51.6027Z"
                            fill={fill}
                            className="character-r"
                        />
                    </svg>
                </span>
                <span
                    className={` character-a transition-all duration-300`}
                    onClick={handleAClick}
                    onMouseEnter={handleAMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <svg
                        pointerEvents="none"
                        width="107"
                        height="108"
                        viewBox="0 0 107 108"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="character-a h-[80px] lg:h-auto"
                    >
                        <path
                            pointerEvents="none"
                            d="M107 108L68.0698 22.6034L78.0929 0H47.6359L0.361661 107.224L0.103332 107.793L1.49831 104.612L0 108H0.103332H0.258329H1.49831H32.0587L37.9227 93.3879L49.7801 63.8276L52.6475 57.3621L74.3472 108H107Z"
                            fill={fill}
                            className="character-a"
                        />
                    </svg>
                </span>
            </div>
        </div>
    )
})   