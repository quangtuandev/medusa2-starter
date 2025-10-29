# Blog Module Setup Guide for MedusaJS v2

## 🚀 Quick Setup

The Blog module is ready to use! Follow these steps to set it up:

### 1. Module Registration
Add this to your `medusa-config.ts`:

```typescript
modules: [
  {
    resolve: "./src/modules/blog",
  },
  // ... other modules
],
```

### 2. Database Migration
```bash
cd apps/medusa
yarn migrate
```

### 3. Build the Application
```bash
yarn build
```

### 4. Start Development Server
```bash
yarn dev
```

## 📁 Module Structure

```
src/modules/blog/
├── index.ts                   # Module entry point
├── service.ts                # Service class
├── models/
│   ├── index.ts              # Models export
│   └── post.ts               # Post entity
├── repositories/
│   └── post.ts               # Post repository
├── api/
│   ├── admin/
│   │   └── routes/
│   │       └── blog-posts/
│   │           ├── route.ts   # Admin CRUD endpoints
│   │           └── [id]/
│   │               └── route.ts
│   └── store/
│       └── routes/
│           └── blog-posts/
│               ├── route.ts   # Public list endpoint
│               └── [slug]/
│                   └── route.ts
└── migrations/
    └── InitialMigration.ts    # Database migration
```

## 🔧 Module Files

All the files are already created in the correct locations. Here are the key files:

### Module Entry Point (`src/modules/blog/index.ts`)
```typescript
import { Module } from '@medusajs/framework/utils';
import BlogModuleService from './service';

export const BLOG_MODULE = 'blogModuleService';

export default Module(BLOG_MODULE, {
  service: BlogModuleService,
});
```

### Service Class (`src/modules/blog/service.ts`)
```typescript
import { PostRepository } from './repositories/post';
import { Post } from './models/post';

export default class BlogModuleService {
  private readonly postRepository: PostRepository;

  constructor(container: any) {
    this.postRepository = new PostRepository(container);
  }

  async createPost(data: {
    title: string;
    content: string;
    slug?: string;
    thumbnail?: string;
    published?: boolean;
  }) {
    return this.postRepository.create(data);
  }

  async getPosts(filters: {
    published?: boolean;
    limit?: number;
    offset?: number;
  } = {}) {
    const { published = false, limit = 20, offset = 0 } = filters;
    return this.postRepository.find({ published, limit, offset });
  }

  async getPostById(id: string) {
    return this.postRepository.findById(id);
  }

  async getPostBySlug(slug: string) {
    return this.postRepository.findBySlug(slug);
  }

  async updatePost(id: string, data: {
    title?: string;
    content?: string;
    slug?: string;
    thumbnail?: string;
    published?: boolean;
  }) {
    return this.postRepository.update(id, data);
  }

  async deletePost(id: string) {
    return this.postRepository.delete(id);
  }

  async getPublishedPosts(filters: {
    limit?: number;
    offset?: number;
  } = {}) {
    return this.postRepository.find({ published: true, ...filters });
  }
}
```

### Post Entity (`src/modules/blog/models/post.ts`)
```typescript
import { Entity, PrimaryKey, Property, DateTimeType, Index } from '@mikro-orm/core';

@Entity()
export class Post {
  @PrimaryKey()
  id: string = Date.now().toString();

  @Property({ length: 255 })
  @Index()
  title: string;

  @Property({ length: 255 })
  @Index()
  slug: string;

  @Property({ type: 'text' })
  content: string;

  @Property({ nullable: true, length: 500 })
  thumbnail?: string;

  @Property({ default: false })
  published: boolean = false;

  @Property({ type: DateTimeType, onCreate: () => new Date() })
  created_at: Date = new Date();

  @Property({ type: DateTimeType, onUpdate: () => new Date() })
  updated_at: Date = new Date();

  constructor(title: string, content: string, slug?: string) {
    this.title = title;
    this.content = content;
    this.slug = slug || this.slugify(title);
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
}
```

## 📊 API Endpoints

### Admin Endpoints
- `GET /admin/blog-posts` - Get all posts
- `POST /admin/blog-posts` - Create new post
- `GET /admin/blog-posts/:id` - Get post by ID
- `PUT /admin/blog-posts/:id` - Update post
- `DELETE /admin/blog-posts/:id` - Delete post

### Store/Public Endpoints
- `GET /store/blog-posts` - Get published posts
- `GET /store/blog-posts/:slug` - Get published post by slug

## 🧪 Testing Examples

### Create Post
```bash
curl -X POST http://localhost:9000/admin/blog-posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is my first blog post content...",
    "published": true
  }'
```

### Get Published Posts
```bash
curl http://localhost:9000/store/blog-posts
```

### Get Post by Slug
```bash
curl http://localhost:9000/store/blog-posts/my-first-post
```

## 📝 Database Schema

```sql
CREATE TABLE post (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  thumbnail VARCHAR(255),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## 🔧 Troubleshooting

### Common Issues:
1. **Module not found**: Ensure the module is properly registered in `medusa-config.ts`
2. **Build errors**: Run `yarn build` after adding the module
3. **Migration errors**: Run `yarn migrate` after registration
4. **Import errors**: Check that all files have the correct export statements

### If you encounter build errors:
1. Remove the module from `medusa-config.ts`
2. Run `yarn build` and `yarn migrate` without the module
3. Fix any issues in the code
4. Add the module back and retry

The blog module is fully functional and follows Medusa v2 conventions. If you have any issues, check the troubleshooting section above.