import type { Config } from 'drizzle-kit';

export default {
  schema: './src/schema/index.ts',
  out: './src/migrations',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'mysql://zalvice:zalvice@localhost:3306/zalvice',
  },
  strict: true,
  verbose: true,
} satisfies Config;
