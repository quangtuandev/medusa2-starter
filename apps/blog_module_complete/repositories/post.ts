import { Post } from '../models/post';
import { MikroORM } from '@mikro-orm/core';

export class PostRepository {
  private readonly entityManager: MikroORM['em'];

  constructor(container: any) {
    this.entityManager = container.em;
  }

  async create(data: {
    title: string;
    content: string;
    slug?: string;
    thumbnail?: string;
    published?: boolean;
  }): Promise<Post> {
    const post = new Post(
      data.title,
      data.content,
      data.slug
    );

    if (data.thumbnail !== undefined) {
      post.thumbnail = data.thumbnail;
    }

    if (data.published !== undefined) {
      post.published = data.published;
    }

    await this.entityManager.persistAndFlush(post);
    return post;
  }

  async find(filters: {
    published?: boolean;
    slug?: string;
    id?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<Post[]> {
    const where: any = {};

    if (filters.published !== undefined) {
      where.published = filters.published;
    }

    if (filters.slug) {
      where.slug = filters.slug;
    }

    if (filters.id) {
      where.id = filters.id;
    }

    return this.entityManager.find(Post, where, {
      limit: filters.limit || 20,
      offset: filters.offset || 0,
      orderBy: { created_at: 'desc' }
    });
  }

  async findById(id: string): Promise<Post | null> {
    return this.entityManager.findOne(Post, { id });
  }

  async findBySlug(slug: string): Promise<Post | null> {
    return this.entityManager.findOne(Post, { slug });
  }

  async update(id: string, data: {
    title?: string;
    content?: string;
    slug?: string;
    thumbnail?: string;
    published?: boolean;
  }): Promise<Post | null> {
    const post = await this.findById(id);
    if (!post) return null;

    if (data.title) post.title = data.title;
    if (data.content) post.content = data.content;
    if (data.slug) post.slug = data.slug;
    if (data.thumbnail !== undefined) post.thumbnail = data.thumbnail;
    if (data.published !== undefined) post.published = data.published;

    await this.entityManager.persistAndFlush(post);
    return post;
  }

  async delete(id: string): Promise<boolean> {
    const post = await this.findById(id);
    if (!post) return false;

    await this.entityManager.removeAndFlush(post);
    return true;
  }

  async count(filters: { published?: boolean } = {}): Promise<number> {
    const where: any = {};
    if (filters.published !== undefined) {
      where.published = filters.published;
    }

    return this.entityManager.count(Post, where);
  }
}