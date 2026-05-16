import { and, asc, desc, eq } from 'drizzle-orm';
import { db } from '../index.js';
import { projects } from '../schema/projects.js';

export type PublicProjectSummary = {
  id: number;
  slug: string;
  locale: 'en' | 'id';
  clientName: string;
  title: string;
  summary: string;
  heroUrl: string | null;
  heroAlt: string | null;
  year: number;
  industry: string;
  services: string[];
  techStack: string[];
  featured: boolean;
};

function toSummary(row: typeof projects.$inferSelect): PublicProjectSummary {
  return {
    id: row.id,
    slug: row.slug,
    locale: row.locale,
    clientName: row.clientName,
    title: row.title,
    summary: row.summary,
    heroUrl: row.heroImageUrl ?? null,
    heroAlt: row.heroImageAlt ?? null,
    year: row.year,
    industry: row.industry,
    services: row.services,
    techStack: row.techStack,
    featured: row.featured,
  };
}

export async function getPublishedProjects(
  locale: 'en' | 'id',
  opts?: { featuredOnly?: boolean },
): Promise<PublicProjectSummary[]> {
  const conds = [eq(projects.status, 'published'), eq(projects.locale, locale)];
  if (opts?.featuredOnly) conds.push(eq(projects.featured, true));
  const rows = await db
    .select()
    .from(projects)
    .where(and(...conds))
    .orderBy(asc(projects.featuredOrder), desc(projects.year));
  return rows.map(toSummary);
}

export async function getPublishedProjectBySlug(
  locale: 'en' | 'id',
  slug: string,
) {
  const rows = await db
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.status, 'published'),
        eq(projects.locale, locale),
        eq(projects.slug, slug),
      ),
    )
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  return {
    ...toSummary(row),
    bodyMd: row.bodyMd,
    outcomes: row.outcomes,
    teamSize: row.teamSize,
    durationMonths: row.durationMonths,
  };
}
