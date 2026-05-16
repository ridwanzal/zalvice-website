import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
  getAllStats,
  getDisplayableClients,
  getAllServices,
  getLatestPublishedPosts,
  getPublishedProjects,
  getPublishedProjectBySlug,
  getActiveTeamMembers,
} from '@zalvice/db/queries';
import { env } from '../lib/env.js';

const LocaleQuery = z.object({ locale: z.enum(['en', 'id']).default('en') });

/*
 * CMS read endpoints consumed by Astro at build time. Auth via a shared
 * BUILD_TOKEN header — these are not exposed to browsers.
 */
export async function cmsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', async (req) => {
    const token = req.headers['x-build-token'];
    if (token !== env.BUILD_TOKEN) {
      throw fastify.httpErrors.unauthorized('invalid build token');
    }
  });

  fastify.get('/stats', async () => ({ stats: await getAllStats() }));
  fastify.get('/services', async () => ({ services: await getAllServices() }));
  fastify.get('/clients', async (req) => {
    const featuredOnly = (req.query as { featured?: string }).featured === 'true';
    return { clients: await getDisplayableClients({ featuredOnly }) };
  });
  fastify.get('/team', async () => ({ team: await getActiveTeamMembers() }));

  fastify.get('/posts/latest', async (req) => {
    const { locale } = LocaleQuery.parse(req.query);
    const limit = Math.min(Number((req.query as { limit?: string }).limit ?? 3), 24);
    return { posts: await getLatestPublishedPosts(locale, limit) };
  });

  fastify.get('/projects', async (req) => {
    const { locale } = LocaleQuery.parse(req.query);
    const featuredOnly = (req.query as { featured?: string }).featured === 'true';
    return { projects: await getPublishedProjects(locale, { featuredOnly }) };
  });

  fastify.get<{ Params: { slug: string } }>('/projects/:slug', async (req) => {
    const { locale } = LocaleQuery.parse(req.query);
    const project = await getPublishedProjectBySlug(locale, req.params.slug);
    if (!project) throw fastify.httpErrors.notFound('project not found');
    return { project };
  });
}
