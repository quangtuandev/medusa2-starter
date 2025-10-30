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
export const listPosts = async function (): Promise<{ posts: BlogPost[] }> {
  return cachified({
    key: 'list-posts',
    cache: sdkCache,
    staleWhileRevalidate: MILLIS.ONE_HOUR,
    ttl: MILLIS.TEN_SECONDS,
    async getFreshValue() {
      return _listPosts();
    },
  });
};

export const _listPosts = async function (): Promise<{ posts: BlogPost[] }> {
  return sdk.client.fetch(`/store/blog/posts`, {
    query: {
      limit: 10,
      offset: 0,
    },
  });
};

export const getPostBySlug = async function (slug: string): Promise<BlogPost | null> {
  return sdk.client.fetch(`/store/blog/posts/${slug}`, {
    query: {
      limit: 1,
      offset: 0,
    },
  });
};
