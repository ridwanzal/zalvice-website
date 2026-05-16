import { z } from 'zod';

const Env = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32).optional(),
  CSRF_SECRET: z.string().min(32).optional(),
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
