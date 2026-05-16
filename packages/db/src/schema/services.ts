import { mysqlTable, int, varchar, text, json, mysqlEnum } from 'drizzle-orm/mysql-core';
import { z } from 'zod';

export const services = mysqlTable('services', {
  id: int('id').primaryKey().autoincrement(),
  slug: varchar('slug', { length: 80 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  pillar: mysqlEnum('pillar', ['design', 'dev', 'infra', 'support', 'consulting']).notNull(),
  description: text('description').notNull(),
  capabilities: json('capabilities').$type<string[]>().notNull(),
  icon: varchar('icon', { length: 64 }).notNull(),
  engagementModel: text('engagement_model'),
  sortOrder: int('sort_order').notNull().default(0),
});

export const PillarSchema = z.enum(['design', 'dev', 'infra', 'support', 'consulting']);
export type Pillar = z.infer<typeof PillarSchema>;

export const ServiceSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  pillar: PillarSchema,
  description: z.string(),
  capabilities: z.array(z.string()),
  icon: z.string(),
  sortOrder: z.number(),
});
export type Service = z.infer<typeof ServiceSchema>;
