import cachified from '@epic-web/cachified';
import { sdk, sdkCache } from '@libs/util/server/client.server';
import { MILLIS } from '@libs/util/server/cache-builder.server';

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

export interface PageListItem {
    id: string;
    title: string;
    slug: string;
    language: string;
}

export const getPageBySlug = async function (slug: string, lang: string = 'en'): Promise<PageData | null> {
    return cachified({
        key: `page-${slug}-${lang}`,
        cache: sdkCache,
        staleWhileRevalidate: MILLIS.ONE_HOUR,
        ttl: MILLIS.TEN_SECONDS,
        async getFreshValue() {
            try {
                const result = await sdk.client.fetch(`/store/pages/${slug}`, {
                    query: { lang },
                });
                return result as PageData;
            } catch (error) {
                return null;
            }
        },
    });
};

export const listPublishedPages = async function (lang: string = 'en'): Promise<PageListItem[]> {
    return cachified({
        key: `pages-list-${lang}`,
        cache: sdkCache,
        staleWhileRevalidate: MILLIS.ONE_HOUR,
        ttl: MILLIS.TEN_SECONDS,
        async getFreshValue() {
            try {
                const result = await sdk.client.fetch(`/store/pages`, {
                    query: { lang },
                });
                return (result as PageListItem[]) || [];
            } catch (error) {
                return [];
            }
        },
    });
};
