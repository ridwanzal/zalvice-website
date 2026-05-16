import { z } from 'zod';

const Env = z.object({
  PUBLIC_SITE_URL: z.string().url().default('http://localhost:4321'),
  API_URL: z.string().url().default('http://localhost:3000'),
  BUILD_TOKEN: z.string().default('dev-build-token-change-me'),
  CMS_MODE: z.enum(['fixture', 'live']).default('fixture'),
  PUBLIC_TURNSTILE_SITE_KEY: z.string().default(''),
  PUBLIC_PLAUSIBLE_DOMAIN: z.string().default(''),
  PUBLIC_PLAUSIBLE_SCRIPT_URL: z.string().default(''),
});

const source = {
  PUBLIC_SITE_URL: import.meta.env.PUBLIC_SITE_URL,
  API_URL: import.meta.env.API_URL,
  BUILD_TOKEN: import.meta.env.BUILD_TOKEN,
  CMS_MODE: import.meta.env.CMS_MODE,
  PUBLIC_TURNSTILE_SITE_KEY: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY,
  PUBLIC_PLAUSIBLE_DOMAIN: import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN,
  PUBLIC_PLAUSIBLE_SCRIPT_URL: import.meta.env.PUBLIC_PLAUSIBLE_SCRIPT_URL,
};

const parsed = Env.safeParse(source);
if (!parsed.success) {
  throw new Error(`Invalid web env: ${JSON.stringify(parsed.error.flatten().fieldErrors)}`);
}
export const env = parsed.data;
