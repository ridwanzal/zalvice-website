import mysql from 'mysql2/promise';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is required');
if (url.includes('planetscale.com') || url.includes('rds.amazonaws')) {
  throw new Error('Refusing to reset: DATABASE_URL looks like production');
}
if (process.env.NODE_ENV === 'production') {
  throw new Error('Refusing to reset: NODE_ENV=production');
}

const connection = await mysql.createConnection(url);
const dbName = new URL(url).pathname.slice(1);
await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\``);
await connection.query(`CREATE DATABASE \`${dbName}\``);
console.log(`✓ dropped + recreated database "${dbName}"`);
await connection.end();
console.log('  now run: pnpm db:migrate && pnpm db:seed');
