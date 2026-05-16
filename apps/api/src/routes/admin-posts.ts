/*
 * Admin write endpoints for posts. The web admin pages post HTML forms
 * here; we redirect back to the admin list on success. JSON GET endpoint
 * exists too (used by the edit form to hydrate).
 *
 * Auth: every route below requires a session (requireAdmin preHandler).
 */

import type { FastifyInstance } from 'fastify';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@zalvice/db';
import { posts } from '@zalvice/db';

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const PostInputSchema = z.object({
  slug: z.string().min(2).max(80).regex(SLUG, 'slug must be lowercase kebab-case'),
  locale: z.enum(['en', 'id']).default('en'),
  title: z.string().min(2).max(200),
  excerpt: z.string().min(10).max(500),
  bodyMd: z.string().min(20).max(100_000),
  coverImageUrl: z.string().min(1).max(1024).nullable().optional(),
  coverImageAlt: z.string().max(500).nullable().optional(),
  categorySlug: z.string().min(2).max(80).regex(SLUG),
  authorName: z.string().min(2).max(100),
  status: z.enum(['draft', 'scheduled', 'published', 'archived']).default('draft'),
  featured: z.coerce.boolean().default(false),
  readingMinutes: z.coerce.number().int().min(1).max(120).default(3),
  seoTitle: z.string().max(200).nullable().optional(),
  seoDescription: z.string().max(500).nullable().optional(),
});

export async function adminPostsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', fastify.requireAdmin);

  fastify.get('/', async () => {
    const rows = await db
      .select({
        id: posts.id,
        slug: posts.slug,
        locale: posts.locale,
        title: posts.title,
        status: posts.status,
        publishedAt: posts.publishedAt,
        updatedAt: posts.updatedAt,
        featured: posts.featured,
      })
      .from(posts)
      .orderBy(desc(posts.updatedAt));
    return { posts: rows };
  });

  fastify.get<{ Params: { id: string } }>('/:id', async (req) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw fastify.httpErrors.badRequest('invalid id');
    const rows = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    const row = rows[0];
    if (!row) throw fastify.httpErrors.notFound('post not found');
    return { post: row };
  });

  /**
   * Drizzle's exactOptionalPropertyTypes-strict types reject `undefined`
   * on nullable columns. Coerce undefined → null at the boundary so the
   * insert shape lines up regardless of which optional fields the form
   * omits.
   */
  function normalize(input: z.infer<typeof PostInputSchema>) {
    return {
      slug: input.slug,
      locale: input.locale,
      title: input.title,
      excerpt: input.excerpt,
      bodyMd: input.bodyMd,
      coverImageUrl: input.coverImageUrl ?? null,
      coverImageAlt: input.coverImageAlt ?? null,
      categorySlug: input.categorySlug,
      authorName: input.authorName,
      status: input.status,
      featured: input.featured,
      readingMinutes: input.readingMinutes,
      seoTitle: input.seoTitle ?? null,
      seoDescription: input.seoDescription ?? null,
    };
  }

  fastify.post('/', async (req, reply) => {
    const parsed = PostInputSchema.safeParse(req.body);
    if (!parsed.success) {
      throw fastify.httpErrors.badRequest(parsed.error.issues.map((i) => i.message).join('; '));
    }
    const now = new Date();
    const publishedAt = parsed.data.status === 'published' ? now : null;
    await db.insert(posts).values({
      ...normalize(parsed.data),
      publishedAt,
      createdAt: now,
      updatedAt: now,
    });
    return reply.redirect('/admin/posts', 303);
  });

  fastify.post<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw fastify.httpErrors.badRequest('invalid id');
    const parsed = PostInputSchema.safeParse(req.body);
    if (!parsed.success) {
      throw fastify.httpErrors.badRequest(parsed.error.issues.map((i) => i.message).join('; '));
    }
    const existing = await db
      .select({ publishedAt: posts.publishedAt })
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);
    const previouslyPublished = existing[0]?.publishedAt ?? null;
    const publishedAt =
      parsed.data.status === 'published'
        ? previouslyPublished ?? new Date()
        : previouslyPublished;

    await db
      .update(posts)
      .set({ ...normalize(parsed.data), publishedAt, updatedAt: new Date() })
      .where(eq(posts.id, id));
    return reply.redirect('/admin/posts', 303);
  });

  // Soft-delete via status=archived. Hard delete is admin-only and only
  // reachable from the DB shell for now.
  fastify.post<{ Params: { id: string } }>('/:id/archive', async (req, reply) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw fastify.httpErrors.badRequest('invalid id');
    await db
      .update(posts)
      .set({ status: 'archived', updatedAt: new Date() })
      .where(eq(posts.id, id));
    return reply.redirect('/admin/posts', 303);
  });
}
