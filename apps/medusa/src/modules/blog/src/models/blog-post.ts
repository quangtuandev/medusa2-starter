import { Entity, PrimaryKey, Property, DateTimeType } from '@mikro-orm/core';

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

@Entity()
export class BlogPost {
  @PrimaryKey()
  id: string;

  @Property()
  title: string;

  @Property({ type: 'text' })
  content: string;

  @Property({ type: 'text', nullable: true })
  excerpt?: string;

  @Property({ nullable: true })
  featured_image?: string;

  @Property({ type: String, default: PostStatus.DRAFT })
  status: string = PostStatus.DRAFT;

  @Property({ type: DateTimeType, onCreate: () => new Date() })
  created_at: Date = new Date();

  @Property({ type: DateTimeType, onUpdate: () => new Date() })
  updated_at: Date = new Date();

  @Property({ default: 0 })
  view_count: number = 0;

  @Property({ nullable: true })
  category_id?: string;

  @Property({ type: 'json', nullable: true })
  tags?: string[];

  @Property({ default: true })
  is_active: boolean = true;

  constructor(title: string, content: string) {
    this.id = Date.now().toString();
    this.title = title;
    this.content = content;
  }
}