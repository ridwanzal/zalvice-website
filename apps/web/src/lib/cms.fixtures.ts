/**
 * Dev-only static fallback for the CMS adapter. Used when CMS_MODE=fixture,
 * which is the default in .env.example so a fresh clone renders the homepage
 * before the API or DB are wired up. Mirror real CMS responses.
 */

import type { CmsStat, CmsService, CmsClient, CmsPostSummary } from './cms.js';

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
  {
    id: 5,
    slug: 'consulting',
    name: 'Consulting',
    pillar: 'consulting',
    description: 'Senior advisory on architecture, hiring, and engineering strategy.',
    capabilities: ['Architecture review', 'Team scaling', 'Tech due diligence'],
    icon: 'compass',
    sortOrder: 5,
  },
];

export const fixturePosts: CmsPostSummary[] = [
  {
    id: 1,
    slug: 'shipping-zero-downtime-mysql-migrations',
    title: 'Shipping zero-downtime MySQL migrations at any scale',
    excerpt:
      'Renames, FK changes, and column drops all become safe once you split them across deploys. The pattern we use on every client engagement.',
    coverUrl: null,
    coverAlt: null,
    category: 'Infrastructure',
    authorName: 'M. Ridwan Zalbina',
    publishedAt: '2026-05-12T09:00:00.000Z',
    readingMinutes: 6,
  },
  {
    id: 2,
    slug: 'astro-islands-in-production',
    title: 'Astro islands in production — what we got right and wrong',
    excerpt:
      'After a year of building marketing sites on Astro, here is the short list of patterns we keep and the ones we threw out.',
    coverUrl: null,
    coverAlt: null,
    category: 'Engineering',
    authorName: 'Zalvice Engineering',
    publishedAt: '2026-05-04T09:00:00.000Z',
    readingMinutes: 8,
  },
  {
    id: 3,
    slug: 'pricing-discovery-engagements',
    title: 'How we price a discovery engagement',
    excerpt:
      'A short, opinionated take on scoping the first three weeks of any project — and the trap of skipping it.',
    coverUrl: null,
    coverAlt: null,
    category: 'Company',
    authorName: 'Zalvice',
    publishedAt: '2026-04-22T09:00:00.000Z',
    readingMinutes: 4,
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
