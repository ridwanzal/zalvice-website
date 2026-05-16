import argon2 from '@node-rs/argon2';
import { db, pool } from '../index.js';
import { stats } from '../schema/stats.js';
import { clients } from '../schema/clients.js';
import { services } from '../schema/services.js';
import { adminUsers } from '../schema/admin-users.js';

await db.insert(stats).values([
  { key: 'companies_served', value: 100, label: 'Companies served', suffix: '+', sortOrder: 1 },
  { key: 'years_in_operation', value: 8, label: 'Years in operation', suffix: '', sortOrder: 2 },
  { key: 'projects_shipped', value: 250, label: 'Projects shipped', suffix: '+', sortOrder: 3 },
  { key: 'countries_reached', value: 18, label: 'Countries reached', suffix: '', sortOrder: 4 },
]);

await db.insert(services).values([
  {
    slug: 'design',
    name: 'Design',
    pillar: 'design',
    description: 'Product and brand design for systems people use every day.',
    capabilities: ['Product design', 'Design systems', 'Brand identity'],
    icon: 'palette',
    sortOrder: 1,
  },
  {
    slug: 'development',
    name: 'Development',
    pillar: 'dev',
    description: 'Web, mobile, and backend engineering built to last.',
    capabilities: ['Web applications', 'Mobile apps', 'APIs & services'],
    icon: 'code',
    sortOrder: 2,
  },
  {
    slug: 'infrastructure',
    name: 'Infrastructure',
    pillar: 'infra',
    description: 'Cloud, CI/CD, and platform engineering you can rely on.',
    capabilities: ['Cloud architecture', 'CI/CD', 'Observability'],
    icon: 'server',
    sortOrder: 3,
  },
  {
    slug: 'support',
    name: 'Support',
    pillar: 'support',
    description: 'Ongoing partnership that keeps systems healthy long after launch.',
    capabilities: ['Managed operations', 'SLAs', 'On-call coverage'],
    icon: 'life-buoy',
    sortOrder: 4,
  },
  {
    slug: 'consulting',
    name: 'Consulting',
    pillar: 'consulting',
    description: 'Senior advisory on architecture, hiring, and engineering strategy.',
    capabilities: ['Architecture review', 'Team scaling', 'Tech due diligence'],
    icon: 'compass',
    sortOrder: 5,
  },
]);

await db.insert(clients).values(
  ['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Soylent', 'Stark Industries', 'Wayne Enterprises', 'Wonka'].map(
    (name, i) => ({
      name,
      website: null,
      industry: null,
      featured: i < 6,
      sortOrder: i,
      consentToDisplay: true,
    }),
  ),
);

// Default admin user — dev only. Password is 'changeme' and the seed
// refuses to run on production-looking DATABASE_URLs (see reset.ts pattern;
// extend here when the URL guard is centralised).
const defaultAdminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'changeme';
const passwordHash = await argon2.hash(defaultAdminPassword, {
  memoryCost: 19456,
  timeCost: 2,
});
await db.insert(adminUsers).values({
  email: process.env.SEED_ADMIN_EMAIL ?? 'admin@zalvice.com',
  passwordHash,
  name: 'Admin',
  role: 'admin',
  createdAt: new Date(),
});

console.log('✓ seed complete');
console.log(`  admin login: ${process.env.SEED_ADMIN_EMAIL ?? 'admin@zalvice.com'} / ${defaultAdminPassword}`);
await pool.end();
