import { asc } from 'drizzle-orm';
import { db } from '../index.js';
import { services, type Service } from '../schema/services.js';

export async function getAllServices(): Promise<Service[]> {
  return db.select().from(services).orderBy(asc(services.sortOrder));
}
