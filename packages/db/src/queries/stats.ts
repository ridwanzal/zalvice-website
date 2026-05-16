import { asc } from 'drizzle-orm';
import { db } from '../index.js';
import { stats, type Stat } from '../schema/stats.js';

export async function getAllStats(): Promise<Stat[]> {
  return db.select().from(stats).orderBy(asc(stats.sortOrder));
}
