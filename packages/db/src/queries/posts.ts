import { and, desc, eq } from 'drizzle-orm';
import { db } from '../index.js';
import { posts } from '../schema/posts.js';

export type PublicPostSummary = {
  id: number;
  slug: string;
  locale: 'en' | 'id';
  title: string;
  excerpt: string;
  coverUrl: string | null;
  coverAlt: string | null;
  category: string;
  authorName: string;
  publishedAt: string;
  readingMinutes: number;
  featured: boolean;
};

export type PublicPostDetail = PublicPostSummary & {
  bodyMd: string;
  seoTitle: string | null;
  seoDescription: string | null;
};

function toSummary(row: typeof posts.$inferSelect): PublicPostSummary {
  return {
    id: row.id,
    slug: row.slug,
    locale: row.locale,
    title: row.title,
    excerpt: row.excerpt,
    coverUrl: row.coverImageUrl ?? null,
    coverAlt: row.coverImageAlt ?? null,
    category: row.categorySlug,
    authorName: row.authorName,
    publishedAt: (row.publishedAt ?? row.createdAt).toISOString(),
    readingMinutes: row.readingMinutes,
    featured: row.featured,
  };
}

function toDetail(row: typeof posts.$inferSelect): PublicPostDetail {
  return {
    ...toSummary(row),
    bodyMd: row.bodyMd,
    seoTitle: row.seoTitle ?? null,
    seoDescription: row.seoDescription ?? null,
  };
}

export async function getLatestPublishedPosts(
  locale: 'en' | 'id',
  limit = 3,
): Promise<PublicPostSummary[]> {
  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.status, 'published'), eq(posts.locale, locale)))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  return rows.map(toSummary);
}

export async function getAllPublishedPosts(
  locale: 'en' | 'id',
): Promise<PublicPostSummary[]> {
  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.status, 'published'), eq(posts.locale, locale)))
    .orderBy(desc(posts.publishedAt));
  return rows.map(toSummary);
}

export async function getPublishedPostBySlug(
  locale: 'en' | 'id',
  slug: string,
): Promise<PublicPostDetail | null> {
  const rows = await db
    .select()
    .from(posts)
    .where(
      and(
        eq(posts.status, 'published'),
        eq(posts.locale, locale),
        eq(posts.slug, slug),
      ),
    )
    .limit(1);
  const row = rows[0];
  return row ? toDetail(row) : null;
}
