import { Entity, PrimaryKey, Property, DateTimeType } from '@mikro-orm/core';

@Entity()
export class BlogTag {
  @PrimaryKey()
  id: string;

  @Property({ unique: true })
  slug: string;

  @Property()
  name: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ default: true })
  is_active: boolean = true;

  @Property({ type: DateTimeType, onCreate: () => new Date() })
  created_at: Date = new Date();

  @Property({ type: DateTimeType, onUpdate: () => new Date() })
  updated_at: Date = new Date();

  constructor(name: string, slug: string) {
    this.id = Date.now().toString();
    this.name = name;
    this.slug = slug;
  }
}