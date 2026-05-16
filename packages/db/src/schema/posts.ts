import {
  mysqlTable,
  int,
  varchar,
  text,
  datetime,
  boolean,
  mysqlEnum,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';
import { z } from 'zod';
import { media } from './media.js';

/*
 * Posts are single-locale per record. /en/blog/foo and /id/blog/foo are
 * separate rows (slug + locale is the uniqueness boundary). Linking the
 * two as "the same article in two languages" via translation_group_id is
 * a follow-up — for now editors translate independently.
 */
export const posts = mysqlTable(
  'posts',
  {
    id: int('id').primaryKey().autoincrement(),
    slug: varchar('slug', { length: 80 }).notNull(),
    locale: mysqlEnum('locale', ['en', 'id']).notNull().default('en'),
    title: varchar('title', { length: 200 }).notNull(),
    excerpt: varchar('excerpt', { length: 500 }).notNull(),
    bodyMd: text('body_md').notNull(),
    coverImageUrl: varchar('cover_image_url', { length: 1024 }),
    coverImageAlt: varchar('cover_image_alt', { length: 500 }),
    coverImageId: int('cover_image_id').references(() => media.id, { onDelete: 'set null' }),
    categorySlug: varchar('category_slug', { length: 80 }).notNull(),
    authorName: varchar('author_name', { length: 100 }).notNull(),
    status: mysqlEnum('status', ['draft', 'scheduled', 'published', 'archived'])
      .notNull()
      .default('draft'),
    publishedAt: datetime('published_at'),
    scheduledFor: datetime('scheduled_for'),
    readingMinutes: int('reading_minutes').notNull().default(3),
    featured: boolean('featured').notNull().default(false),
    seoTitle: varchar('seo_title', { length: 200 }),
    seoDescription: varchar('seo_description', { length: 500 }),
    createdAt: datetime('created_at').notNull(),
    updatedAt: datetime('updated_at').notNull(),
  },
  (table) => ({
    // Uniqueness is (slug, locale) — same slug can exist in EN and ID.
    slugLocaleIdx: uniqueIndex('posts_slug_locale_idx').on(table.slug, table.locale),
  }),
);

export const PostSummarySchema = z.object({
  id: z.number(),
  slug: z.string(),
  locale: z.enum(['en', 'id']),
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
