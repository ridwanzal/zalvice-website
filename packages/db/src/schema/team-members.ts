import { mysqlTable, int, varchar, text, mysqlEnum, boolean, json } from 'drizzle-orm/mysql-core';
import { z } from 'zod';
import { media } from './media.js';

export const teamMembers = mysqlTable('team_members', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  role: varchar('role', { length: 120 }).notNull(),
  team: mysqlEnum('team', ['design', 'eng', 'infra', 'ops']).notNull(),
  yearsExperience: int('years_experience').notNull(),
  bio: text('bio').notNull(),
  photoId: int('photo_id').references(() => media.id, { onDelete: 'set null' }),
  socialLinks: json('social_links').$type<{ kind: 'linkedin' | 'github' | 'x'; url: string }[]>(),
  sortOrder: int('sort_order').notNull().default(0),
  active: boolean('active').notNull().default(true),
});

export const TeamMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  role: z.string(),
  team: z.enum(['design', 'eng', 'infra', 'ops']),
  yearsExperience: z.number(),
  bio: z.string(),
  photoUrl: z.string().min(1).nullable(),
  photoAlt: z.string().nullable(),
  social: z
    .array(z.object({ kind: z.enum(['linkedin', 'github', 'x']), url: z.string() }))
    .nullable(),
});
export type TeamMember = z.infer<typeof TeamMemberSchema>;
