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