import { and, asc, eq } from 'drizzle-orm';
import { db } from '../index.js';
import { testimonials } from '../schema/testimonials.js';
import { projects } from '../schema/projects.js';

export type PublicTestimonial = {
  id: number;
  locale: 'en' | 'id';
  quote: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  authorPhotoUrl: string | null;
  authorPhotoAlt: string | null;
  /** When set, this testimonial references a live case study the public can read. */
  project: { slug: string; title: string } | null;
  featured: boolean;
};

export async function getPublishedTestimonials(
  locale: 'en' | 'id',
  opts?: { featuredOnly?: boolean; limit?: number },
): Promise<PublicTestimonial[]> {
  const conds = [eq(testimonials.status, 'published'), eq(testimonials.locale, locale)];
  if (opts?.featuredOnly) conds.push(eq(testimonials.featured, true));

  // Left-join projects so we can surface the linked case study without a
  // second roundtrip. project_id is nullable; the row is excluded only by
  // status/locale, never by the join.
  const rows = await db
    .select({
      id: testimonials.id,
      locale: testimonials.locale,
      quote: testimonials.quote,
      authorName: testimonials.authorName,
      authorRole: testimonials.authorRole,
      authorCompany: testimonials.authorCompany,
      authorPhotoUrl: testimonials.authorPhotoUrl,
      authorPhotoAlt: testimonials.authorPhotoAlt,
      featured: testimonials.featured,
      sortOrder: testimonials.sortOrder,
      projectSlug: projects.slug,
      projectTitle: projects.title,
    })
    .from(testimonials)
    .leftJoin(projects, eq(testimonials.projectId, projects.id))
    .where(and(...conds))
    .orderBy(asc(testimonials.sortOrder));

  const limited = typeof opts?.limit === 'number' ? rows.slice(0, opts.limit) : rows;

  return limited.map((r) => ({
    id: r.id,
    locale: r.locale,
    quote: r.quote,
    authorName: r.authorName,
    authorRole: r.authorRole,
    authorCompany: r.authorCompany,
    authorPhotoUrl: r.authorPhotoUrl ?? null,
    authorPhotoAlt: r.authorPhotoAlt ?? null,
    featured: r.featured,
    project: r.projectSlug && r.projectTitle ? { slug: r.projectSlug, title: r.projectTitle } : null,
  }));
}
