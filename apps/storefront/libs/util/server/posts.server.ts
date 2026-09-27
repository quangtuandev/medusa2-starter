import cachified from '@epic-web/cachified';
import { sdk, sdkCache } from '@libs/util/server/client.server';
import { MILLIS } from '@libs/util/server/cache-builder.server';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  slug: string;
  sub_title: string;
  content: string;
  thumbnail: string;
  created_at: string;
  updated_at: string;
}
export const listPosts = async function (language?: string): Promise<{ posts: BlogPost[] }> {
  const lang = language || 'en';
  return cachified({
    key: `list-posts-${lang}`,
    cache: sdkCache,
    staleWhileRevalidate: MILLIS.ONE_HOUR,
    ttl: MILLIS.TEN_SECONDS,
    async getFreshValue() {
      return _listPosts(lang);
    },
  });
};

export const _listPosts = async function (language: string = 'en'): Promise<{ posts: BlogPost[] }> {
  const lang = language || 'en';
  const response = await sdk.client.fetch<BlogPost[] | { posts: BlogPost[] }>(`/store/blog/posts/${lang}`, {
    query: {
      limit: 10,
      offset: 0,
    },
  });

  if (Array.isArray(response)) {
    return { posts: response };
  }
  if (response && Array.isArray((response as any).posts)) {
    return response as { posts: BlogPost[] };
  }
  return { posts: [] };
};

export const getPostBySlug = async function (slug: string): Promise<BlogPost | null> {
  const response = await sdk.client.fetch<any>(`/store/post/${slug}`, {
    query: {
      limit: 1,
      offset: 0,
    },
  });

  if (!response) return null;
  const rawPost = response.post || response;
  if (Array.isArray(rawPost)) {
    return rawPost[0] || null;
  }
  return rawPost as BlogPost;
};
