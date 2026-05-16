import {
  mysqlTable,
  int,
  varchar,
  text,
  boolean,
  datetime,
  json,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';
import { z } from 'zod';
import { media } from './media.js';

export const projects = mysqlTable('projects', {
  id: int('id').primaryKey().autoincrement(),
  slug: varchar('slug', { length: 80 }).notNull().unique(),
  clientName: varchar('client_name', { length: 200 }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  summary: varchar('summary', { length: 500 }).notNull(),
  bodyMd: text('body_md').notNull(),
  heroImageId: int('hero_image_id').references(() => media.id, { onDelete: 'set null' }),
  year: int('year').notNull(),
  industry: varchar('industry', { length: 100 }).notNull(),
  services: json('services').$type<string[]>().notNull(),
  techStack: json('tech_stack').$type<string[]>().notNull(),
  outcomes: json('outcomes')
    .$type<{ label: string; value: string; unit?: string }[]>()
    .notNull(),
  teamSize: int('team_size').notNull(),
  durationMonths: int('duration_months').notNull(),
  featured: boolean('featured').notNull().default(false),
  featuredOrder: int('featured_order').notNull().default(0),
  status: mysqlEnum('status', ['draft', 'published', 'archived']).notNull().default('draft'),
  publishedAt: datetime('published_at'),
});

export const ProjectSummarySchema = z.object({
  id: z.number(),
  slug: z.string(),
  clientName: z.string(),
  title: z.string(),
  summary: z.string(),
  heroUrl: z.string().min(1).nullable(),
  heroAlt: z.string().nullable(),
  year: z.number(),
  industry: z.string(),
  services: z.array(z.string()),
  techStack: z.array(z.string()),
  featured: z.boolean(),
});
export type ProjectSummary = z.infer<typeof ProjectSummarySchema>;

export const ProjectDetailSchema = ProjectSummarySchema.extend({
  bodyMd: z.string(),
  outcomes: z.array(
    z.object({ label: z.string(), value: z.string(), unit: z.string().optional() }),
  ),
  teamSize: z.number(),
  durationMonths: z.number(),
});
export type ProjectDetail = z.infer<typeof ProjectDetailSchema>;
