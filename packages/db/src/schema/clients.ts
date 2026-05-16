import { mysqlTable, int, varchar, boolean } from 'drizzle-orm/mysql-core';
import { z } from 'zod';
import { media } from './media';

export const clients = mysqlTable('clients', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 200 }).notNull(),
  logoImageId: int('logo_image_id').references(() => media.id, { onDelete: 'set null' }),
  website: varchar('website', { length: 500 }),
  industry: varchar('industry', { length: 100 }),
  featured: boolean('featured').notNull().default(false),
  sortOrder: int('sort_order').notNull().default(0),
  // Hard rule: only display clients with consent. Filtered in the query layer.
  consentToDisplay: boolean('consent_to_display').notNull().default(false),
});

export const ClientSchema = z.object({
  id: z.number(),
  name: z.string(),
  // Accepts absolute (CDN/R2) URLs or root-relative paths (e.g. /clients/1.png).
  logoUrl: z.string().min(1).nullable(),
  logoAlt: z.string().nullable(),
  website: z.string().nullable(),
  industry: z.string().nullable(),
  featured: z.boolean(),
});
export type Client = z.infer<typeof ClientSchema>;
