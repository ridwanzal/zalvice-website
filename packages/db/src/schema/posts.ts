import { mysqlTable, int, varchar, text, datetime, boolean, mysqlEnum } from 'drizzle-orm/mysql-core';
import { z } from 'zod';
import { media } from './media.js';

export const posts = mysqlTable('posts', {
  id: int('id').primaryKey().autoincrement(),
  slug: varchar('slug', { length: 80 }).notNull().unique(),
  title: varchar('title', { length: 200 }).notNull(),
  excerpt: varchar('excerpt', { length: 500 }).notNull(),
  bodyMd: text('body_md').notNull(),
  coverImageId: int('cover_image_id').references(() => media.id, { onDelete: 'set null' }),
  categorySlug: varchar('category_slug', { length: 80 }).notNull(),
  authorName: varchar('author_name', { length: 100 }).notNull(),
  status: mysqlEnum('status', ['draft', 'scheduled', 'published', 'archived']).notNull().default('draft'),
  publishedAt: datetime('published_at'),
  readingMinutes: int('reading_minutes').notNull().default(3),
  featured: boolean('featured').notNull().default(false),
});

export const PostSummarySchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  coverUrl: z.string().min(1).nullable(),
  coverAlt: z.string().nullable(),
  category: z.string(),
  authorName: z.string(),
  publishedAt: z.string(),
  readingMinutes: z.number(),
});
export type PostSummary = z.infer<typeof PostSummarySchema>;
