import { FC, useState, useCallback, memo } from 'react'

interface LiveChatConfig {
    facebook?: string
    zalo?: string
}

interface LiveChatIconProps {
    config?: LiveChatConfig
    className?: string
}

const DEFAULT_CONFIG: LiveChatConfig = {
    facebook: 'https://www.facebook.com/your-page',
    zalo: 'https://zalo.me/your-phone-number'
}

export const LiveChatIcon: FC<LiveChatIconProps> = memo(({
    config = DEFAULT_CONFIG,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const mergedConfig = { ...DEFAULT_CONFIG, ...config }

    const handleToggle = useCallback(() => {
        setIsOpen(prev => !prev)
    }, [])

    const handleSocialClick = useCallback((url: string | undefined) => {
        if (url) {
            window.open(url, '_blank', 'noreferrer')
        }
    }, [])

    const handleClickOutside = useCallback(() => {
        setIsOpen(false)
    }, [])

    return (
        <div className={`fixed bottom-6 left-6 z-50 ${className}`}>
            {/* Social Icons Menu */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 flex flex-col gap-3 mb-2 z-50">
                    {/* Facebook Icon */}
                    {mergedConfig.facebook && (
                        <button
                            onClick={() => handleSocialClick(mergedConfig.facebook)}
                            className="transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
                            aria-label="Chat on Facebook"
                            title="Chat on Facebook"
                        >
                            <img src="/assets/images/facebook.png" alt="Facebook" className="w-16 h-16" />

                        </button>
                    )}

                    {/* Zalo Icon */}
                    {mergedConfig.zalo && (
                        <button
                            onClick={() => handleSocialClick(mergedConfig.zalo)}
                            className="transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
                            aria-label="Chat on Zalo"
                            title="Chat on Zalo"
                        >
                            <img src="/assets/images/zalo.png" alt="Zalo" className="w-16 h-16" />
                        </button>
                    )}
                </div>
            )}

            {/* Main Chat Icon Button */}
            <button
                onClick={handleToggle}
                className="bg-primary hover:bg-primary/80 text-white rounded-tl-full rounded-br-full rounded-tr-full p-2 shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center relative"
                aria-label="Open chat"
                title="Open chat"
            >
                <span>
                    <img src="/assets/images/livechat.gif" alt="Chat" className="w-12 h-12" />
                </span>
            </button>

            {/* Close overlay when clicking outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50"
                    onClick={handleClickOutside}
                />
            )}
        </div>
    )
})

LiveChatIcon.displayName = 'LiveChatIcon'
