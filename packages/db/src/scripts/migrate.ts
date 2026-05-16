import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is required');

const connection = await mysql.createConnection(url);
const db = drizzle(connection);

await migrate(db, { migrationsFolder: './src/migrations' });
await connection.end();
console.log('✓ migrations applied');
