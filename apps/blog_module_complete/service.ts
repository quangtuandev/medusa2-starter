import { PostRepository } from './repositories/post';
import { Post } from './models/post';

export default class BlogModuleService {
  protected readonly postRepository: PostRepository;

  constructor(container: any) {
    this.postRepository = new PostRepository(container);
  }

  async createPost(data: {
    title: string;
    content: string;
    slug?: string;
    thumbnail?: string;
    published?: boolean;
  }): Promise<Post> {
    return this.postRepository.create(data);
  }

  async getPosts(filters: {
    published?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<{
    posts: Post[];
    count: number;
    limit: number;
    offset: number;
  }> {
    const { published = false, limit = 20, offset = 0 } = filters;

    const posts = await this.postRepository.find({
      published,
      limit,
      offset
    });

    const count = await this.postRepository.count({ published });

    return {
      posts,
      count,
      limit,
      offset
    };
  }

  async getPostById(id: string): Promise<Post | null> {
    return this.postRepository.findById(id);
  }

  async getPostBySlug(slug: string): Promise<Post | null> {
    return this.postRepository.findBySlug(slug);
  }

  async updatePost(id: string, data: {
    title?: string;
    content?: string;
    slug?: string;
    thumbnail?: string;
    published?: boolean;
  }): Promise<Post | null> {
    return this.postRepository.update(id, data);
  }

  async deletePost(id: string): Promise<boolean> {
    return this.postRepository.delete(id);
  }

  async getPublishedPosts(filters: {
    limit?: number;
    offset?: number;
  } = {}): Promise<{
    posts: Post[];
    count: number;
    limit: number;
    offset: number;
  }> {
    return this.getPosts({ published: true, ...filters });
  }
}