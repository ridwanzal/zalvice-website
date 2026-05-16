/*
 * Hand-rolled session auth. Roughly 150 LOC. Patterns are documented in
 * skills.md §6 ("Admin auth"). Three primitives:
 *
 *   createSession(userId)  → returns { id, expiresAt }
 *   validateSession(id)    → returns { user, session } | null
 *   invalidateSession(id)  → deletes the row
 *
 * Plus a brute-force gate the login route consumes:
 *
 *   recordLoginAttempt({ email, ip, success })
 *   isLockedOut({ email, ip })
 *
 * The cookie holds only the opaque session id (no JWT). Cookies are
 * httpOnly + SameSite=Lax + Secure in prod, signed with SESSION_SECRET.
 */

import { randomBytes, createHmac, timingSafeEqual } from 'node:crypto';
import argon2 from '@node-rs/argon2';
import { and, eq, gt, sql } from 'drizzle-orm';
import { db } from '@zalvice/db';
import { adminUsers, userSessions, loginAttempts } from '@zalvice/db';
import { env } from './env.js';

export const SESSION_COOKIE = 'zalvice_admin';
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

const ARGON_OPTS = { memoryCost: 19456, timeCost: 2 } as const;

/*
 * Dummy hash for constant-time login on unknown emails — prevents user-
 * enumeration via response timing. Pre-hashed once at module load.
 */
let dummyHashPromise: Promise<string> | null = null;
function getDummyHash(): Promise<string> {
  if (!dummyHashPromise) {
    dummyHashPromise = argon2.hash('no-such-user', ARGON_OPTS);
  }
  return dummyHashPromise;
}

export async function hashPassword(plain: string): Promise<string> {
  return argon2.hash(plain, ARGON_OPTS);
}

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  return argon2.verify(hash, plain);
}

export async function verifyPasswordConstantTime(
  hash: string | null,
  plain: string,
): Promise<boolean> {
  // Always run a verify so unknown-email login takes ~same time as known-email
  // login. Throw-away result when hash is null.
  if (hash) return argon2.verify(hash, plain);
  await argon2.verify(await getDummyHash(), plain);
  return false;
}

function newSessionId(): string {
  return randomBytes(32).toString('base64url');
}

export async function createSession(
  userId: number,
  meta?: { ip?: string | undefined; userAgent?: string | undefined },
): Promise<{ id: string; expiresAt: Date }> {
  const id = newSessionId();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);
  await db.insert(userSessions).values({
    id,
    userId,
    expiresAt,
    createdAt: now,
    ip: meta?.ip ?? null,
    userAgent: meta?.userAgent ?? null,
  });
  return { id, expiresAt };
}

export type SessionContext = {
  session: { id: string; userId: number; expiresAt: Date };
  user: { id: number; email: string; name: string; role: 'admin' | 'editor' };
};

export async function validateSession(id: string): Promise<SessionContext | null> {
  const rows = await db
    .select({
      sessionId: userSessions.id,
      sessionUserId: userSessions.userId,
      sessionExpiresAt: userSessions.expiresAt,
      userId: adminUsers.id,
      userEmail: adminUsers.email,
      userName: adminUsers.name,
      userRole: adminUsers.role,
      userDisabled: adminUsers.disabled,
    })
    .from(userSessions)
    .innerJoin(adminUsers, eq(userSessions.userId, adminUsers.id))
    .where(and(eq(userSessions.id, id), gt(userSessions.expiresAt, new Date())))
    .limit(1);

  const row = rows[0];
  if (!row || row.userDisabled) return null;

  return {
    session: { id: row.sessionId, userId: row.sessionUserId, expiresAt: row.sessionExpiresAt },
    user: { id: row.userId, email: row.userEmail, name: row.userName, role: row.userRole },
  };
}

export async function invalidateSession(id: string): Promise<void> {
  await db.delete(userSessions).where(eq(userSessions.id, id));
}

/* ─── Cookie signing ─────────────────────────────────────────────────────── */

/**
 * The session id itself is high-entropy and stored in the DB; a separate
 * signature on the cookie isn't strictly necessary but lets the API
 * reject obviously-malformed values without a DB roundtrip. Format:
 * `${id}.${hmac(id)}` — both base64url.
 */
export function signSessionCookie(id: string): string {
  const sig = createHmac('sha256', env.SESSION_SECRET).update(id).digest('base64url');
  return `${id}.${sig}`;
}

export function unwrapSessionCookie(raw: string | undefined): string | null {
  if (!raw) return null;
  const dot = raw.lastIndexOf('.');
  if (dot < 1) return null;
  const id = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  const expected = createHmac('sha256', env.SESSION_SECRET).update(id).digest('base64url');
  if (sig.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  return id;
}

/* ─── Brute-force gate ───────────────────────────────────────────────────── */

const ATTEMPT_WINDOW_MS = 1000 * 60 * 60; // 1 hour
const MAX_PER_EMAIL = 5;
const MAX_PER_IP = 10;

export async function recordLoginAttempt(input: {
  email: string | null;
  ip: string;
  success: boolean;
}): Promise<void> {
  await db.insert(loginAttempts).values({
    email: input.email,
    ip: input.ip,
    success: input.success,
    createdAt: new Date(),
  });
}

export async function isLockedOut(input: { email: string; ip: string }): Promise<boolean> {
  const since = new Date(Date.now() - ATTEMPT_WINDOW_MS);
  // Count failed attempts (success=false) per email and per ip.
  const rows = await db
    .select({
      byEmail: sql<number>`COUNT(CASE WHEN ${loginAttempts.email} = ${input.email} AND ${loginAttempts.success} = false THEN 1 END)`,
      byIp: sql<number>`COUNT(CASE WHEN ${loginAttempts.ip} = ${input.ip} AND ${loginAttempts.success} = false THEN 1 END)`,
    })
    .from(loginAttempts)
    .where(gt(loginAttempts.createdAt, since));
  const r = rows[0];
  if (!r) return false;
  return Number(r.byEmail) >= MAX_PER_EMAIL || Number(r.byIp) >= MAX_PER_IP;
}
