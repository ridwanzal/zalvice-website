import Fastify from 'fastify';
import sensible from '@fastify/sensible';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { env } from './lib/env.js';
import sessionPlugin from './plugins/session.js';
import { healthRoutes } from './routes/health.js';
import { cmsRoutes } from './routes/cms.js';
import { authRoutes } from './routes/auth.js';
import { adminPostsRoutes } from './routes/admin-posts.js';
import { adminProjectsRoutes } from './routes/admin-projects.js';
import { adminTestimonialsRoutes } from './routes/admin-testimonials.js';

async function build() {
  const fastify = Fastify({
    logger: {
      level: env.NODE_ENV === 'production' ? 'info' : 'debug',
      redact: {
        paths: ['req.headers.authorization', 'req.headers.cookie', '*.password', '*.email', '*.phone'],
        censor: '[redacted]',
      },
    },
    trustProxy: 1,
  });

  await fastify.register(sensible);
  await fastify.register(helmet, { contentSecurityPolicy: false });
  await fastify.register(cors, { origin: true, credentials: true });
  await fastify.register(rateLimit, { global: false, max: 300, timeWindow: '1 minute' });

  // Cookie + session must come before any route that reads req.auth.
  await fastify.register(cookie, { secret: env.SESSION_SECRET });
  await fastify.register(formbody);
  await fastify.register(sessionPlugin);

  // Public reads.
  await fastify.register(healthRoutes, { prefix: '/api' });
  await fastify.register(cmsRoutes, { prefix: '/api/cms' });

  // Admin auth + writes. All guarded inside each route file.
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(adminPostsRoutes, { prefix: '/api/admin/posts' });
  await fastify.register(adminProjectsRoutes, { prefix: '/api/admin/projects' });
  await fastify.register(adminTestimonialsRoutes, { prefix: '/api/admin/testimonials' });

  return fastify;
}

const app = await build();
app.listen({ port: env.PORT, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
