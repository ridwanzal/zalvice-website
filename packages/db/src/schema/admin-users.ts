import { mysqlTable, int, varchar, datetime, mysqlEnum, boolean } from 'drizzle-orm/mysql-core';

export const adminUsers = mysqlTable('admin_users', {
  id: int('id').primaryKey().autoincrement(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  role: mysqlEnum('role', ['admin', 'editor']).notNull().default('editor'),
  disabled: boolean('disabled').notNull().default(false),
  totpSecret: varchar('totp_secret', { length: 64 }),
  lastLogin: datetime('last_login'),
  createdAt: datetime('created_at').notNull(),
});

/*
 * Sessions are server-side; the client only holds a signed cookie containing
 * the session id. Length 64 to comfortably hold a base64url(32 random bytes)
 * value.
 */
export const userSessions = mysqlTable('user_sessions', {
  id: varchar('id', { length: 64 }).primaryKey(),
  userId: int('user_id')
    .notNull()
    .references(() => adminUsers.id, { onDelete: 'cascade' }),
  expiresAt: datetime('expires_at').notNull(),
  createdAt: datetime('created_at').notNull(),
  ip: varchar('ip', { length: 64 }),
  userAgent: varchar('user_agent', { length: 500 }),
});

/*
 * Lockout signal. Used by the login route to enforce per-IP and per-email
 * caps without bringing in Redis. Sweep periodically (>30d old).
 */
export const loginAttempts = mysqlTable('login_attempts', {
  id: int('id').primaryKey().autoincrement(),
  email: varchar('email', { length: 255 }),
  ip: varchar('ip', { length: 64 }).notNull(),
  success: boolean('success').notNull(),
  createdAt: datetime('created_at').notNull(),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type AdminUserInsert = typeof adminUsers.$inferInsert;
export type UserSession = typeof userSessions.$inferSelect;
