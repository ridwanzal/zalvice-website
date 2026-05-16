/**
 * CMS adapter — Astro reads here, not from the DB directly. See skills.md §2.
 *
 * Modes:
 *  - `fixture` (default): reads from cms.fixtures.ts, no network. Lets a
 *    fresh clone render the homepage with no API or DB running.
 *  - `live`: fetches from the Fastify API at build time.
 *
 * Every response is parsed with Zod so schema drift fails the build loudly.
 */

import { z } from 'zod';
import { env } from './env.js';
import { fixtureStats, fixtureServices, fixtureClients } from './cms.fixtures.js';

const StatSchema = z.object({
  id: z.number(),
  key: z.string(),
  value: z.number(),
  label: z.string(),
  suffix: z.string(),
  sortOrder: z.number(),
});
export type CmsStat = z.infer<typeof StatSchema>;

const ServiceSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  pillar: z.enum(['design', 'dev', 'infra', 'support']),
  description: z.string(),
  capabilities: z.array(z.string()),
  icon: z.string(),
  sortOrder: z.number(),
});
export type CmsService = z.infer<typeof ServiceSchema>;

const ClientSchema = z.object({
  id: z.number(),
  name: z.string(),
  // Accepts absolute (CDN/R2) URLs or root-relative paths (e.g. /clients/1.png).
  logoUrl: z.string().min(1).nullable(),
  logoAlt: z.string().nullable(),
  website: z.string().nullable(),
  industry: z.string().nullable(),
  featured: z.boolean(),
});
export type CmsClient = z.infer<typeof ClientSchema>;

async function fetchCms<T>(path: string, schema: z.ZodType<T>, key: string): Promise<T> {
  const url = `${env.API_URL}/cms${path}`;
  const res = await fetch(url, { headers: { 'x-build-token': env.BUILD_TOKEN } });
  if (!res.ok) {
    throw new Error(`CMS fetch failed: ${res.status} ${url}`);
  }
  const json = (await res.json()) as Record<string, unknown>;
  return schema.parse(json[key]);
}

export async function getStats(): Promise<CmsStat[]> {
  if (env.CMS_MODE === 'fixture') return fixtureStats;
  return fetchCms('/stats', z.array(StatSchema), 'stats');
}

export async function getServices(): Promise<CmsService[]> {
  if (env.CMS_MODE === 'fixture') return fixtureServices;
  return fetchCms('/services', z.array(ServiceSchema), 'services');
}

export async function getClients(opts?: { featuredOnly?: boolean }): Promise<CmsClient[]> {
  if (env.CMS_MODE === 'fixture') {
    return opts?.featuredOnly ? fixtureClients.filter((c) => c.featured) : fixtureClients;
  }
  const qs = opts?.featuredOnly ? '?featured=true' : '';
  return fetchCms(`/clients${qs}`, z.array(ClientSchema), 'clients');
}

/** Lookup a single stat by key with a typed default — used by copy that depends on a specific number. */
export function findStat(stats: CmsStat[], key: string): CmsStat | undefined {
  return stats.find((s) => s.key === key);
}
