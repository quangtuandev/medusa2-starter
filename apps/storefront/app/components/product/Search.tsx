'use client';

import { StoreProduct } from '@medusajs/types';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useNavigate } from 'react-router';
import { ProductPriceRange } from './ProductPriceRange';
import { useRegion } from '@app/hooks/useRegion';
import clsx from 'clsx';
import { Container } from '../common/container';
import { IconButton } from '../common/buttons/IconButton';
import { motion } from 'motion/react';

interface SearchProduct extends Omit<StoreProduct, 'thumbnail'> {
    thumbnail?: string | null;
    title: string;
    id: string;
}
interface ProductSearchProps {
    onProductSelect?: (product: SearchProduct) => void;
    placeholder?: string;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
    open,
    setOpen,
    placeholder = 'Search products...',
}) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    // Debounce: call API 300ms after user stops typing
    const [debouncedQuery] = useDebounce(searchQuery, 300);
    const [results, setResults] = useState<SearchProduct[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    /**
     * Call API search when debouncedQuery changes
     * GET /store/products?q=<keyword>
     */
    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([]);
            setIsOpen(false);
            setError(null);
            return;
        }

        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                setError(null);


                const response = await fetch(`/api/products/search?q=${debouncedQuery}`);
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                console.log(data);

                setResults(data);
                setIsOpen(data.length > 0);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error searching products';
                console.error('Search error:', errorMessage);
                setError(errorMessage);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [debouncedQuery]);

    /**
     * Focus input when component mounts and open is true
     */
    useEffect(() => {
        if (open && inputRef.current) {
            // Small delay to ensure animation completes before focus
            setTimeout(() => {
                inputRef.current?.focus();
            }, 150);
        }
    }, [open]);

    /**
     * Close dropdown when clicking outside
     */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setSearchQuery('');
                setResults([]);
                setIsOpen(false);
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /**
     * Handle product click
     */
    const handleProductClick = (product: SearchProduct) => {
        navigate(`/products/${product.handle}`);

        setOpen(false);
        // Reset search
        setSearchQuery('');
        setResults([]);
        setIsOpen(false);
    };

    /**
     * Get product thumbnail
     * First: thumbnail > images[0]
     */
    const getThumbnailUrl = (product: SearchProduct): string | null => {
        if (product.thumbnail) return product.thumbnail;
        if (product.images && product.images.length > 0) {
            return product.images[0].url || null;
        }
        return null;
    };
    const { region } = useRegion();

    const currencyCode = region.currency_code;

    return (
        <>
            <motion.div
                className={clsx("z-1", open ? "fixed inset-0 bg-gray-300 bg-opacity-50 backdrop-blur-sm transition-opacity" : "hidden")}
                initial={{ opacity: 0 }}
                animate={{ opacity: open ? 0.5 : 0 }}
                transition={{ duration: 0.3 }}
            />
            <Container className="relative">
                <div className='xl:px-[96px] max-w-[1268px] relative mx-auto'>
                    <motion.div
                        ref={searchContainerRef}
                        className={clsx("absolute w-[400px] z-10 right-0 top-4", open ? "opacity-100" : "!opacity-0 !z-[-1000]")}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut", delay: 0.3 }}
                    >
                        {/* Search Input Container */}
                        <div className="relative flex items-center">
                            {/* Input */}
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder={placeholder}
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsOpen(e.target.value.trim().length > 0);
                                }}
                                onFocus={() => {
                                    if (searchQuery.trim().length > 0 && results.length > 0) {
                                        setIsOpen(true);
                                    }
                                }}
                                className="w-full pl-10 pl-4 py-2.5 rounded-full shadow-sm focus:outline-none transition-all duration-200"
                            />

                            {/* Loading Indicator */}
                            {isLoading && (
                                <div className="absolute right-3 flex items-center gap-1">
                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                                </div>
                            )}
                            {!isLoading && (
                                <div className="absolute right-3 flex items-center gap-1">
                                    <IconButton icon={XMarkIcon} onClick={() => {
                                        if (!searchQuery.trim()) {
                                            setOpen(false);
                                        }
                                        setSearchQuery('');
                                        setResults([]);
                                        setIsOpen(false);
                                    }} />
                                </div>
                            )}
                        </div>

                        {/* Dropdown Results */}
                        {isOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                                {error ? (
                                    /* Error Message */
                                    <div className="p-4 text-center text-red-600 text-sm">
                                        Error: {error}
                                    </div>
                                ) : results.length === 0 && !isLoading ? (
                                    /* No Results */
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        No products found
                                    </div>
                                ) : (
                                    /* Product List */
                                    <ul className="divide-y divide-gray-100">
                                        {results.map((product) => {
                                            const thumbnail = getThumbnailUrl(product);
                                            return (
                                                <li
                                                    key={product.id}
                                                    onClick={() => handleProductClick(product)}
                                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex gap-3"
                                                >
                                                    {/* Thumbnail */}
                                                    {thumbnail && (
                                                        <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                                                            <img
                                                                src={thumbnail}
                                                                alt={product.title}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                                }}
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Product Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                                                            {product.title}
                                                        </h3>
                                                        <ProductPriceRange product={product as StoreProduct} currencyCode={currencyCode} />
                                                    </div>

                                                    {/* Chevron Icon */}
                                                    <div className="flex-shrink-0 flex items-center text-gray-400">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>
            </Container>
        </>
    );
};

export default ProductSearch;
