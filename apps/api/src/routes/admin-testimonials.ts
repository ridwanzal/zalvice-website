/*
 * Admin testimonials. Mirrors admin-posts and admin-projects: form posts
 * here redirect back to /admin/testimonials on success. Soft-delete via
 * status=archived.
 */

import type { FastifyInstance } from 'fastify';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@zalvice/db';
import { testimonials } from '@zalvice/db';

/*
 * project_id is an optional FK. The form sends an empty string when the
 * user clears the select; coerce empty → null so the FK stays valid.
 */
const ProjectIdField = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((v) => {
    if (v === '' || v === null || v === undefined) return null;
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n : null;
  });

const TestimonialInputSchema = z.object({
  locale: z.enum(['en', 'id']).default('en'),
  quote: z.string().min(20).max(2000),
  authorName: z.string().min(2).max(100),
  authorRole: z.string().min(2).max(120),
  authorCompany: z.string().min(2).max(120),
  authorPhotoUrl: z.string().min(1).max(1024).nullable().optional(),
  authorPhotoAlt: z.string().max(500).nullable().optional(),
  projectId: ProjectIdField,
  featured: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

export async function adminTestimonialsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', fastify.requireAdmin);

  function normalize(input: z.infer<typeof TestimonialInputSchema>) {
    return {
      locale: input.locale,
      quote: input.quote,
      authorName: input.authorName,
      authorRole: input.authorRole,
      authorCompany: input.authorCompany,
      authorPhotoUrl: input.authorPhotoUrl ?? null,
      authorPhotoAlt: input.authorPhotoAlt ?? null,
      projectId: input.projectId,
      featured: input.featured,
      sortOrder: input.sortOrder,
      status: input.status,
    };
  }

  fastify.get('/', async () => {
    const rows = await db
      .select({
        id: testimonials.id,
        locale: testimonials.locale,
        quote: testimonials.quote,
        authorName: testimonials.authorName,
        authorRole: testimonials.authorRole,
        authorCompany: testimonials.authorCompany,
        status: testimonials.status,
        featured: testimonials.featured,
        sortOrder: testimonials.sortOrder,
        updatedAt: testimonials.updatedAt,
      })
      .from(testimonials)
      .orderBy(desc(testimonials.updatedAt));
    return { testimonials: rows };
  });

  fastify.get<{ Params: { id: string } }>('/:id', async (req) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw fastify.httpErrors.badRequest('invalid id');
    const rows = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
    const row = rows[0];
    if (!row) throw fastify.httpErrors.notFound('testimonial not found');
    return { testimonial: row };
  });

  fastify.post('/', async (req, reply) => {
    const parsed = TestimonialInputSchema.safeParse(req.body);
    if (!parsed.success) {
      throw fastify.httpErrors.badRequest(parsed.error.issues.map((i) => i.message).join('; '));
    }
    const now = new Date();
    await db.insert(testimonials).values({
      ...normalize(parsed.data),
      createdAt: now,
      updatedAt: now,
    });
    return reply.redirect('/admin/testimonials', 303);
  });

  fastify.post<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw fastify.httpErrors.badRequest('invalid id');
    const parsed = TestimonialInputSchema.safeParse(req.body);
    if (!parsed.success) {
      throw fastify.httpErrors.badRequest(parsed.error.issues.map((i) => i.message).join('; '));
    }
    await db
      .update(testimonials)
      .set({ ...normalize(parsed.data), updatedAt: new Date() })
      .where(eq(testimonials.id, id));
    return reply.redirect('/admin/testimonials', 303);
  });

  fastify.post<{ Params: { id: string } }>('/:id/archive', async (req, reply) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw fastify.httpErrors.badRequest('invalid id');
    await db
      .update(testimonials)
      .set({ status: 'archived', updatedAt: new Date() })
      .where(eq(testimonials.id, id));
    return reply.redirect('/admin/testimonials', 303);
  });
}
