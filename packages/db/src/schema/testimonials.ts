import { mysqlTable, int, varchar, text, mysqlEnum, boolean, datetime } from 'drizzle-orm/mysql-core';
import { projects } from './projects.js';

/*
 * Testimonials. Single-locale per row (same pattern as posts/projects):
 * /en/about and /id/about query their own locale; admins translate by
 * creating a second row with the other locale.
 *
 * project_id is optional — set it when the quote refers to a specific
 * case study so the public renderer can link "see the project".
 *
 * featured drives the homepage strip; the full /about list shows every
 * published testimonial in the active locale regardless of featured.
 */
export const testimonials = mysqlTable('testimonials', {
  id: int('id').primaryKey().autoincrement(),
  locale: mysqlEnum('locale', ['en', 'id']).notNull().default('en'),
  quote: text('quote').notNull(),
  authorName: varchar('author_name', { length: 100 }).notNull(),
  authorRole: varchar('author_role', { length: 120 }).notNull(),
  authorCompany: varchar('author_company', { length: 120 }).notNull(),
  authorPhotoUrl: varchar('author_photo_url', { length: 1024 }),
  authorPhotoAlt: varchar('author_photo_alt', { length: 500 }),
  projectId: int('project_id').references(() => projects.id, { onDelete: 'set null' }),
  featured: boolean('featured').notNull().default(false),
  sortOrder: int('sort_order').notNull().default(0),
  status: mysqlEnum('status', ['draft', 'published', 'archived']).notNull().default('draft'),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type TestimonialInsert = typeof testimonials.$inferInsert;
