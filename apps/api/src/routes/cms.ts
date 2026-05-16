import type { FastifyInstance } from 'fastify';
import { getAllStats, getDisplayableClients, getAllServices } from '@zalvice/db/queries';
import { env } from '../lib/env.js';

/**
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
}
