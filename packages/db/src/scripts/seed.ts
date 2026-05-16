import { db, pool } from '../index.js';
import { stats } from '../schema/stats.js';
import { clients } from '../schema/clients.js';
import { services } from '../schema/services.js';

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

console.log('✓ seed complete');
await pool.end();
