import { and, asc, eq } from 'drizzle-orm';
import { db } from '../index.js';
import { clients, type Client } from '../schema/clients.js';
import { media } from '../schema/media.js';

/**
 * Display-safe client list. Filters on `consent_to_display = true` —
 * this is the only public read path. The admin has a separate query that
 * shows everyone.
 */
export async function getDisplayableClients(opts?: { featuredOnly?: boolean }): Promise<Client[]> {
  const rows = await db
    .select({
      id: clients.id,
      name: clients.name,
      website: clients.website,
      industry: clients.industry,
      featured: clients.featured,
      sortOrder: clients.sortOrder,
      logoUrl: media.url,
      logoAlt: media.altText,
    })
    .from(clients)
    .leftJoin(media, eq(clients.logoImageId, media.id))
    .where(
      opts?.featuredOnly
        ? and(eq(clients.consentToDisplay, true), eq(clients.featured, true))
        : eq(clients.consentToDisplay, true),
    )
    .orderBy(asc(clients.sortOrder));

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    logoUrl: r.logoUrl ?? null,
    logoAlt: r.logoAlt ?? null,
    website: r.website ?? null,
    industry: r.industry ?? null,
    featured: r.featured,
  }));
}
