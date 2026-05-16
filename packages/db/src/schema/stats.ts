import { mysqlTable, int, varchar, bigint } from 'drizzle-orm/mysql-core';
import { z } from 'zod';

export const stats = mysqlTable('stats', {
  id: int('id').primaryKey().autoincrement(),
  key: varchar('key', { length: 64 }).notNull().unique(),
  value: bigint('value', { mode: 'number' }).notNull(),
  label: varchar('label', { length: 200 }).notNull(),
  suffix: varchar('suffix', { length: 8 }).notNull().default(''),
  sortOrder: int('sort_order').notNull().default(0),
});

export const StatSchema = z.object({
  id: z.number(),
  key: z.string(),
  value: z.number(),
  label: z.string(),
  suffix: z.string().default(''),
  sortOrder: z.number().default(0),
});
export type Stat = z.infer<typeof StatSchema>;
