import clsx from "clsx";
import { motion } from "motion/react";
import { Container } from "../common/container";
import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { IconButton } from "../common/buttons/IconButton";
import { XMarkIcon } from "@heroicons/react/24/outline";


export const CollectionMenuList = ({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) => {
    const collections = [
        {
            id: '1',
            title: 'Thirsty collection',
            handle: 'thirsty',
        },
        {
            id: '2',
            title: 'Icy collection',
            handle: 'icy',
        },
        {
            id: '3',
            title: 'All of US',
            handle: '',
        },
    ]
    const collectionMenuListRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (collectionMenuListRef.current && !collectionMenuListRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <motion.div
                className={clsx("z-1", open ? "fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" : "hidden")}
                initial={{ opacity: 0 }}
                animate={{ opacity: open ? 0.5 : 0 }}
                transition={{ duration: 0.3 }}
            />
            <Container className="relative">
                <div className='xl:px-[96px] max-w-[1268px] relative mx-auto'>
                    <motion.div
                        ref={collectionMenuListRef}
                        className={clsx("absolute w-full xl:w-[400px] z-10 left-0 bg-white top-4 rounded-lg py-2 border border-primary", open ? "opacity-100" : "!opacity-0 !z-[-1000]")}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut", delay: 0.3 }}
                    >
                        <IconButton icon={XMarkIcon} className="absolute top-2 right-2 hover:!bg-transparent hover:text-gray-700 focus:text-gray-700 z-10 !text-primary" onClick={() => setOpen(false)} />
                        <div className="relative flex-col hidden xl:flex">
                            {collections.map((collection) => (
                                <div key={collection.id} className="flex items-center p-2 rounded-md last:font-bold">
                                    <Link to={`/collections/${collection.handle}`} onClick={() => setOpen(false)}>
                                        {collection.title}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </Container>
        </>
    );
};