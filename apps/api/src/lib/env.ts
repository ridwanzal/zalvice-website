import { config as loadDotenv } from 'dotenv';
import { resolve } from 'node:path';
import { z } from 'zod';

/*
 * Load env files at boot, before reading process.env. Order matters —
 * later files override earlier ones, so .env.local wins. Looks both at
 * the api package root and the repo root; the repo root is where the
 * shared .env (per .env.example) lives.
 *
 * Skipped under NODE_ENV=production: production runtimes inject env via
 * the platform (Fly, Railway), not from a file.
 */
if (process.env.NODE_ENV !== 'production') {
  const candidates = [
    resolve(process.cwd(), '.env'),
    resolve(process.cwd(), '.env.local'),
    resolve(process.cwd(), '../../.env'),
    resolve(process.cwd(), '../../.env.local'),
  ];
  for (const path of candidates) {
    loadDotenv({ path, override: false });
  }
}

const Env = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  // Required at runtime. Provide a development default so a fresh clone
  // can boot; production envs MUST override (the value is gitignored).
  SESSION_SECRET: z
    .string()
    .min(32)
    .default('dev-session-secret-change-me-in-production-please-32'),
  CSRF_SECRET: z
    .string()
    .min(32)
    .default('dev-csrf-secret-change-me-in-production-please-do-it')
    .optional(),
  RESEND_API_KEY: z.string().optional(),
  SLACK_WEBHOOK_SALES: z.string().url().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  BUILD_TOKEN: z.string().default('dev-build-token-change-me'),
  SENTRY_DSN: z.string().optional(),
});

const parsed = Env.safeParse(process.env);
if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('Invalid env:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}
export const env = parsed.data;
