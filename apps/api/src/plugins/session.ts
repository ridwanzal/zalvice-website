/*
 * Session plugin. Reads the signed cookie, validates the session against
 * the DB, decorates `req.user` for downstream routes. Exposes a
 * `requireAdmin` preHandler that 401s anonymous requests.
 *
 * Plugin order matters (CLAUDE.md): register cookies before this.
 */

import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  SESSION_COOKIE,
  unwrapSessionCookie,
  validateSession,
  type SessionContext,
} from '../lib/auth.js';

declare module 'fastify' {
  interface FastifyRequest {
    auth: SessionContext | null;
  }
  interface FastifyInstance {
    requireAdmin: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

async function sessionPlugin(fastify: FastifyInstance) {
  fastify.decorateRequest('auth', null);

  fastify.addHook('onRequest', async (req) => {
    const raw = req.cookies[SESSION_COOKIE];
    const id = unwrapSessionCookie(raw);
    if (!id) {
      req.auth = null;
      return;
    }
    req.auth = await validateSession(id);
  });

  fastify.decorate('requireAdmin', async (req: FastifyRequest, reply: FastifyReply) => {
    if (!req.auth) {
      throw fastify.httpErrors.unauthorized('authentication required');
    }
    // Both 'admin' and 'editor' roles can hit content endpoints; tighten
    // per-route as we add user-management surfaces.
    void reply;
  });
}

export default fp(sessionPlugin, { name: 'session', dependencies: ['@fastify/cookie'] });
