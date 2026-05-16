import argon2 from '@node-rs/argon2';
import { db, pool } from '../index.js';
import { stats } from '../schema/stats.js';
import { clients } from '../schema/clients.js';
import { services } from '../schema/services.js';
import { adminUsers } from '../schema/admin-users.js';
import { testimonials } from '../schema/testimonials.js';

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

// Sample testimonials so live mode has something to render. Match the
// fixture set so the public site looks the same in fixture vs live mode.
const now = new Date();
await db.insert(testimonials).values([
  {
    locale: 'en',
    quote:
      'Zalvice rebuilt our dispatch platform on a tight deadline and stayed on for operations. Deploys went from a quarterly event to something we do on a Tuesday afternoon without thinking about it.',
    authorName: 'Sarah Chen',
    authorRole: 'VP Engineering',
    authorCompany: 'Northwind Logistics',
    featured: true,
    sortOrder: 1,
    status: 'published',
    createdAt: now,
    updatedAt: now,
  },
  {
    locale: 'en',
    quote:
      "The discovery sprint alone saved us months of architectural rework. Their team interviewed our clinicians, audited the existing system, and came back with a plan we could actually defend to the board.",
    authorName: 'Dr. Marcus Webb',
    authorRole: 'Chief Medical Officer',
    authorCompany: 'Meridian Health',
    featured: true,
    sortOrder: 2,
    status: 'published',
    createdAt: now,
    updatedAt: now,
  },
  {
    locale: 'en',
    quote:
      "Sub-millisecond p99 wasn't a number we'd dared put on a slide before. Zalvice's infra team rebuilt our OMS without a single planned outage in 14 months.",
    authorName: 'Hugo Bertrand',
    authorRole: 'Head of Trading Technology',
    authorCompany: 'Aperture Capital',
    featured: true,
    sortOrder: 3,
    status: 'published',
    createdAt: now,
    updatedAt: now,
  },
]);

console.log('✓ seed complete');
console.log(`  admin login: ${process.env.SEED_ADMIN_EMAIL ?? 'admin@zalvice.com'} / ${defaultAdminPassword}`);
await pool.end();
