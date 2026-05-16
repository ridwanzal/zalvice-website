import { config as loadDotenv } from 'dotenv';
import { resolve } from 'node:path';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema/index.js';

/*
 * Load env when consumed directly via `pnpm db:*` scripts. When this
 * module is imported through @zalvice/api the API has already loaded
 * env; the `override: false` flag keeps that intact.
 */
if (process.env.NODE_ENV !== 'production') {
  for (const path of [
    resolve(process.cwd(), '.env'),
    resolve(process.cwd(), '.env.local'),
    resolve(process.cwd(), '../../.env'),
    resolve(process.cwd(), '../../.env.local'),
  ]) {
    loadDotenv({ path, override: false });
  }
}

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error('DATABASE_URL is required to construct the DB client');
}

const pool = mysql.createPool({ uri: url, connectionLimit: 10 });
export const db = drizzle(pool, { schema, mode: 'default' });
export { pool };
export * from './schema/index.js';
