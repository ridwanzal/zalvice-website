/**
 * Dev-only static fallback for the CMS adapter. Used when CMS_MODE=fixture,
 * which is the default in .env.example so a fresh clone renders the homepage
 * before the API or DB are wired up. Mirror real CMS responses.
 */

import type { CmsStat, CmsService, CmsClient } from './cms.js';

export const fixtureStats: CmsStat[] = [
  { id: 1, key: 'companies_served', value: 100, label: 'Companies served', suffix: '+', sortOrder: 1 },
  { id: 2, key: 'years_in_operation', value: 8, label: 'Years in operation', suffix: '', sortOrder: 2 },
  { id: 3, key: 'projects_shipped', value: 250, label: 'Projects shipped', suffix: '+', sortOrder: 3 },
  { id: 4, key: 'countries_reached', value: 18, label: 'Countries reached', suffix: '', sortOrder: 4 },
];

export const fixtureServices: CmsService[] = [
  {
    id: 1,
    slug: 'design',
    name: 'Design',
    pillar: 'design',
    description: 'Product and brand design for systems people use every day.',
    capabilities: ['Product design', 'Design systems', 'Brand identity'],
    icon: 'palette',
    sortOrder: 1,
  },
  {
    id: 2,
    slug: 'development',
    name: 'Development',
    pillar: 'dev',
    description: 'Web, mobile, and backend engineering built to last.',
    capabilities: ['Web applications', 'Mobile apps', 'APIs & services'],
    icon: 'code',
    sortOrder: 2,
  },
  {
    id: 3,
    slug: 'infrastructure',
    name: 'Infrastructure',
    pillar: 'infra',
    description: 'Cloud, CI/CD, and platform engineering you can rely on.',
    capabilities: ['Cloud architecture', 'CI/CD', 'Observability'],
    icon: 'server',
    sortOrder: 3,
  },
  {
    id: 4,
    slug: 'support',
    name: 'Support',
    pillar: 'support',
    description: 'Ongoing partnership that keeps systems healthy long after launch.',
    capabilities: ['Managed operations', 'SLAs', 'On-call coverage'],
    icon: 'life-buoy',
    sortOrder: 4,
  },
];

// 24 client logos live in apps/web/public/clients/1.png … 24.png. Names are
// placeholders; alt text intentionally empty pending real client names.
export const fixtureClients: CmsClient[] = Array.from({ length: 24 }, (_, i) => {
  const n = i + 1;
  return {
    id: n,
    name: `Client ${n}`,
    logoUrl: `/clients/${n}.png`,
    logoAlt: '',
    website: null,
    industry: null,
    featured: n <= 6,
  };
});
