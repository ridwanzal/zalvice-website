import type { Config } from 'drizzle-kit';

export default {
  // Glob the files directly so drizzle-kit doesn't have to traverse the
  // index.ts re-exports (which fail under CJS resolution with the .js
  // extensions we need for the ESM build).
  schema: './src/schema/*.ts',
  out: './src/migrations',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'mysql://zalvice:zalvice@localhost:3306/zalvice',
  },
  strict: true,
  verbose: true,
} satisfies Config;
