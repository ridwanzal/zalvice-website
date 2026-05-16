/*
 * Login / logout / me. The web side at /admin/login posts a form to
 * /api/auth/login; on success we set the session cookie and redirect
 * back to /admin. The whole admin surface uses cookies + form posts —
 * no JSON, no JWT, no client SDK.
 */

import type { FastifyInstance } from 'fastify';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@zalvice/db';
import { adminUsers } from '@zalvice/db';
import {
  SESSION_COOKIE,
  SESSION_TTL_MS,
  createSession,
  invalidateSession,
  isLockedOut,
  recordLoginAttempt,
  signSessionCookie,
  verifyPasswordConstantTime,
} from '../lib/auth.js';
import { env } from '../lib/env.js';

const LoginSchema = z.object({
  email: z.string().email().max(255).transform((s) => s.trim().toLowerCase()),
  password: z.string().min(1).max(200),
  redirect: z.string().regex(/^\/admin(\/.*)?$/).optional(),
});

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/login',
    {
      config: { rateLimit: { max: 10, timeWindow: '1 hour' } },
    },
    async (req, reply) => {
      const parsed = LoginSchema.safeParse(req.body);
      if (!parsed.success) {
        throw fastify.httpErrors.badRequest('invalid login payload');
      }
      const { email, password, redirect } = parsed.data;
      const ip = req.ip;

      if (await isLockedOut({ email, ip })) {
        await recordLoginAttempt({ email, ip, success: false });
        throw fastify.httpErrors.tooManyRequests('too many attempts, try again later');
      }

      const rows = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.email, email))
        .limit(1);
      const user = rows[0];
      const passwordOk = await verifyPasswordConstantTime(
        user?.passwordHash ?? null,
        password,
      );

      if (!user || user.disabled || !passwordOk) {
        await recordLoginAttempt({ email, ip, success: false });
        throw fastify.httpErrors.unauthorized('invalid email or password');
      }

      const session = await createSession(user.id, {
        ip,
        userAgent: req.headers['user-agent']?.slice(0, 500),
      });
      await recordLoginAttempt({ email, ip, success: true });

      reply.setCookie(SESSION_COOKIE, signSessionCookie(session.id), {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: env.NODE_ENV === 'production',
        maxAge: Math.floor(SESSION_TTL_MS / 1000),
      });

      // Update last_login fire-and-forget.
      void db
        .update(adminUsers)
        .set({ lastLogin: new Date() })
        .where(eq(adminUsers.id, user.id))
        .catch(() => undefined);

      return reply.redirect(redirect ?? '/admin', 303);
    },
  );

  fastify.post(
    '/logout',
    { preHandler: [fastify.requireAdmin] },
    async (req, reply) => {
      const ctx = req.auth!;
      await invalidateSession(ctx.session.id);
      reply.clearCookie(SESSION_COOKIE, { path: '/' });
      return reply.redirect('/admin/login', 303);
    },
  );

  fastify.get(
    '/me',
    { preHandler: [fastify.requireAdmin] },
    async (req) => {
      const { user } = req.auth!;
      return { user };
    },
  );
}
