import { mysqlTable, int, varchar, bigint, datetime, decimal } from 'drizzle-orm/mysql-core';
import { z } from 'zod';

export const media = mysqlTable('media', {
  id: int('id').primaryKey().autoincrement(),
  filename: varchar('filename', { length: 255 }).notNull(),
  url: varchar('url', { length: 1024 }).notNull(),
  altText: varchar('alt_text', { length: 500 }).notNull(),
  width: int('width').notNull(),
  height: int('height').notNull(),
  mimeType: varchar('mime_type', { length: 64 }).notNull(),
  bytes: bigint('bytes', { mode: 'number' }).notNull(),
  focalX: decimal('focal_x', { precision: 4, scale: 3 }).notNull().default('0.5'),
  focalY: decimal('focal_y', { precision: 4, scale: 3 }).notNull().default('0.5'),
  uploadedBy: int('uploaded_by'),
  uploadedAt: datetime('uploaded_at').notNull(),
});

export const MediaSchema = z.object({
  id: z.number(),
  filename: z.string(),
  url: z.string().url(),
  altText: z.string(),
  width: z.number(),
  height: z.number(),
  mimeType: z.string(),
  bytes: z.number(),
});
export type Media = z.infer<typeof MediaSchema>;
