import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema/index.js';

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error('DATABASE_URL is required to construct the DB client');
}

const pool = mysql.createPool({ uri: url, connectionLimit: 10 });
export const db = drizzle(pool, { schema, mode: 'default' });
export { pool };
export * from './schema/index.js';
