import { Container } from "@app/components/common/container";
import { getPageBySlug } from "@libs/util/server/pages.server";
import { getCookie } from "@libs/util/server/cookies.server";
import clsx from "clsx";
import { LoaderFunctionArgs, useLoaderData, MetaFunction } from "react-router";
import { useEffect, useState } from "react";
import { getMergedPageMeta } from "@libs/util/page";

interface PageData {
    id: string;
    title: string;
    slug: string;
    content: string;
    language: string;
    meta_title: string | null;
    meta_description: string | null;
    created_at: string;
    updated_at: string;
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const slug = params.slug as string;
    const language = await getCookie(request.headers, "lng") || "en";
    const page = await getPageBySlug(slug, language);

    if (!page) {
        throw new Response("Page not found", { status: 404 });
    }

    return {
        page,
    };
};

export type PagesRouteLoader = typeof loader;

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    if (!data?.page) return [];

    const page = data.page;
    return [
        { title: page.meta_title || page.title },
        { name: "description", content: page.meta_description || "" },
    ];
};

export default function PagesRoute() {
    const { page } = useLoaderData<PagesRouteLoader>();
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section>
            <Container className="flex flex-col gap-8 py-12">
                {page && (
                    <>
                        <div className="flex flex-col gap-4 text-center">
                            <h1 className="text-3xl xl:text-5xl font-bold tracking-tight">
                                {page.title}
                            </h1>
                        </div>
                        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
                            <div
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{ __html: page.content }}
                            />
                        </div>
                    </>
                )}
            </Container>
            <button
                id="back-to-top"
                onClick={scrollToTop}
                className={clsx(
                    "fixed bottom-8 right-8 z-50 transition-all duration-300 hover:scale-110 cursor-pointer",
                    showBackToTop ? "opacity-100 visible" : "opacity-0 invisible"
                )}
                aria-label="Back to top"
            >
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="28" cy="28" r="28" transform="matrix(1.19249e-08 -1 -1 -1.19249e-08 56 56)" fill="black" />
                    <path d="M26.5858 17.97C27.3668 17.189 28.6332 17.189 29.4142 17.97L42.1421 30.6979C42.9232 31.479 42.9232 32.7453 42.1421 33.5264C41.3611 34.3074 40.0948 34.3074 39.3137 33.5264L28 22.2127L16.6863 33.5264C15.9052 34.3074 14.6389 34.3074 13.8579 33.5264C13.0768 32.7453 13.0768 31.479 13.8579 30.6979L26.5858 17.97ZM28 21.5381L26 21.5381L26 19.3842L28 19.3842L30 19.3842L30 21.5381L28 21.5381Z" fill="white" />
                </svg>
            </button>
        </section>
    );
}
