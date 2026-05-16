import type { FastifyInstance } from 'fastify';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@zalvice/db';
import { projects } from '@zalvice/db';

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/*
 * Forms post arrays as repeated keys (services[]=design&services[]=dev) or
 * as comma-separated strings; both are accepted via coerce. JSON columns
 * (services, techStack, outcomes) are also accepted as JSON strings — the
 * admin form serializes them that way to keep the input element count down.
 */
const StringArrayFromForm = z
  .union([z.string(), z.array(z.string())])
  .transform((v) => {
    if (Array.isArray(v)) return v.filter(Boolean);
    if (v.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(v) as unknown;
        if (Array.isArray(parsed)) return parsed.filter((x): x is string => typeof x === 'string');
      } catch {
        // fall through
      }
    }
    return v.split(',').map((s) => s.trim()).filter(Boolean);
  });

const OutcomesFromForm = z.union([z.string(), z.array(z.unknown())]).transform((v) => {
  const arr = typeof v === 'string' ? (JSON.parse(v) as unknown) : v;
  if (!Array.isArray(arr)) return [];
  return arr
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null;
      const e = entry as Record<string, unknown>;
      const label = typeof e.label === 'string' ? e.label : null;
      const value = typeof e.value === 'string' ? e.value : null;
      const unit = typeof e.unit === 'string' ? e.unit : undefined;
      return label && value ? { label, value, ...(unit ? { unit } : {}) } : null;
    })
    .filter((x): x is { label: string; value: string; unit?: string } => x !== null);
});

const ProjectInputSchema = z.object({
  slug: z.string().min(2).max(80).regex(SLUG),
  locale: z.enum(['en', 'id']).default('en'),
  clientName: z.string().min(2).max(200),
  title: z.string().min(2).max(200),
  summary: z.string().min(10).max(500),
  bodyMd: z.string().min(20).max(100_000),
  heroImageUrl: z.string().min(1).max(1024).nullable().optional(),
  heroImageAlt: z.string().max(500).nullable().optional(),
  year: z.coerce.number().int().min(2000).max(2100),
  industry: z.string().min(2).max(100),
  services: StringArrayFromForm,
  techStack: StringArrayFromForm,
  outcomes: OutcomesFromForm,
  teamSize: z.coerce.number().int().min(1).max(200),
  durationMonths: z.coerce.number().int().min(1).max(120),
  featured: z.coerce.boolean().default(false),
  featuredOrder: z.coerce.number().int().min(0).max(999).default(0),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  seoTitle: z.string().max(200).nullable().optional(),
  seoDescription: z.string().max(500).nullable().optional(),
});

export async function adminProjectsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', fastify.requireAdmin);

  fastify.get('/', async () => {
    const rows = await db
      .select({
        id: projects.id,
        slug: projects.slug,
        locale: projects.locale,
        clientName: projects.clientName,
        title: projects.title,
        status: projects.status,
        year: projects.year,
        featured: projects.featured,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .orderBy(desc(projects.updatedAt));
    return { projects: rows };
  });

  fastify.get<{ Params: { id: string } }>('/:id', async (req) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw fastify.httpErrors.badRequest('invalid id');
    const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    const row = rows[0];
    if (!row) throw fastify.httpErrors.notFound('project not found');
    return { project: row };
  });

  function normalize(input: z.infer<typeof ProjectInputSchema>) {
    return {
      slug: input.slug,
      locale: input.locale,
      clientName: input.clientName,
      title: input.title,
      summary: input.summary,
      bodyMd: input.bodyMd,
      heroImageUrl: input.heroImageUrl ?? null,
      heroImageAlt: input.heroImageAlt ?? null,
      year: input.year,
      industry: input.industry,
      services: input.services,
      techStack: input.techStack,
      outcomes: input.outcomes,
      teamSize: input.teamSize,
      durationMonths: input.durationMonths,
      featured: input.featured,
      featuredOrder: input.featuredOrder,
      status: input.status,
      seoTitle: input.seoTitle ?? null,
      seoDescription: input.seoDescription ?? null,
    };
  }

  fastify.post('/', async (req, reply) => {
    const parsed = ProjectInputSchema.safeParse(req.body);
    if (!parsed.success) {
      throw fastify.httpErrors.badRequest(parsed.error.issues.map((i) => i.message).join('; '));
    }
    const now = new Date();
    const publishedAt = parsed.data.status === 'published' ? now : null;
    await db.insert(projects).values({
      ...normalize(parsed.data),
      publishedAt,
      createdAt: now,
      updatedAt: now,
    });
    return reply.redirect('/admin/projects', 303);
  });

  fastify.post<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw fastify.httpErrors.badRequest('invalid id');
    const parsed = ProjectInputSchema.safeParse(req.body);
    if (!parsed.success) {
      throw fastify.httpErrors.badRequest(parsed.error.issues.map((i) => i.message).join('; '));
    }
    const existing = await db
      .select({ publishedAt: projects.publishedAt })
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);
    const previouslyPublished = existing[0]?.publishedAt ?? null;
    const publishedAt =
      parsed.data.status === 'published'
        ? previouslyPublished ?? new Date()
        : previouslyPublished;

    await db
      .update(projects)
      .set({ ...normalize(parsed.data), publishedAt, updatedAt: new Date() })
      .where(eq(projects.id, id));
    return reply.redirect('/admin/projects', 303);
  });

  fastify.post<{ Params: { id: string } }>('/:id/archive', async (req, reply) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw fastify.httpErrors.badRequest('invalid id');
    await db
      .update(projects)
      .set({ status: 'archived', updatedAt: new Date() })
      .where(eq(projects.id, id));
    return reply.redirect('/admin/projects', 303);
  });
}
