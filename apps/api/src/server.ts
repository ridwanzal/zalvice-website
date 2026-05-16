import Fastify from 'fastify';
import sensible from '@fastify/sensible';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { env } from './lib/env.js';
import { healthRoutes } from './routes/health.js';
import { cmsRoutes } from './routes/cms.js';

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

  await fastify.register(healthRoutes, { prefix: '/api' });
  await fastify.register(cmsRoutes, { prefix: '/api/cms' });

  return fastify;
}

const app = await build();
app.listen({ port: env.PORT, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
