/**
 * Dev-only static fallback for the CMS adapter. Used when CMS_MODE=fixture,
 * which is the default in .env.example so a fresh clone renders the homepage
 * before the API or DB are wired up. Mirror real CMS responses.
 */

import type {
  CmsStat,
  CmsService,
  CmsClient,
  CmsPostSummary,
  CmsProjectSummary,
  CmsProjectDetail,
  CmsTeamMember,
} from './cms.js';

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
    locale: 'en',
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
    locale: 'en',
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
    locale: 'en',
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

/*
 * Projects — fixture set covers the layouts: 3 featured (carousel/home),
 * mixed industries, mixed pillars so filters have something to do.
 * Replace via /admin once the backoffice ships.
 */
export const fixtureProjects: CmsProjectSummary[] = [
  {
    id: 1,
    slug: 'northwind-fleet-platform',
    locale: 'en',
    clientName: 'Northwind Logistics',
    title: 'A real-time fleet platform that ships in 90 seconds',
    summary:
      'Rebuilt a legacy dispatch system into an event-driven platform that handles 12k vehicles, with deploys that took 40 minutes now done in 90 seconds.',
    heroUrl: null,
    heroAlt: null,
    year: 2025,
    industry: 'Logistics',
    services: ['design', 'dev', 'infra', 'support'],
    techStack: ['Next.js', 'Go', 'Kafka', 'Postgres', 'AWS'],
    featured: true,
  },
  {
    id: 2,
    slug: 'meridian-clinic-records',
    locale: 'en',
    clientName: 'Meridian Health',
    title: 'A clinic records system clinicians actually like using',
    summary:
      'A ground-up rewrite of an EHR module with HIPAA-aligned infra, audit logging, and an interface clinicians could learn in 30 minutes.',
    heroUrl: null,
    heroAlt: null,
    year: 2024,
    industry: 'Healthcare',
    services: ['design', 'dev', 'infra'],
    techStack: ['React', 'NestJS', 'Postgres', 'GCP'],
    featured: true,
  },
  {
    id: 3,
    slug: 'aperture-trading-desk',
    locale: 'en',
    clientName: 'Aperture Capital',
    title: 'A trading desk built on sub-millisecond data',
    summary:
      'Latency-critical OMS rewrite. Sub-ms p99 order placement, full observability, zero unplanned downtime in 14 months.',
    heroUrl: null,
    heroAlt: null,
    year: 2025,
    industry: 'Fintech',
    services: ['dev', 'infra', 'support'],
    techStack: ['Rust', 'Redis', 'ClickHouse', 'Kubernetes'],
    featured: true,
  },
  {
    id: 4,
    slug: 'foundry-design-system',
    locale: 'en',
    clientName: 'Foundry Studio',
    title: 'A design system that 14 product teams ship from',
    summary:
      'Tokens, primitives, and CI-enforced contribution model that grew adoption from 2 teams to 14 in six months.',
    heroUrl: null,
    heroAlt: null,
    year: 2024,
    industry: 'SaaS',
    services: ['design', 'dev'],
    techStack: ['React', 'TypeScript', 'Storybook', 'Style Dictionary'],
    featured: false,
  },
  {
    id: 5,
    slug: 'oak-ai-knowledge-base',
    locale: 'en',
    clientName: 'Oak & Stone',
    title: 'A RAG-backed knowledge base their support team trusts',
    summary:
      'Retrieval-augmented assistant trained on 12 years of support tickets. 38% deflection on tier-1 cases without losing CSAT.',
    heroUrl: null,
    heroAlt: null,
    year: 2025,
    industry: 'Retail',
    services: ['dev', 'consulting'],
    techStack: ['Claude', 'pgvector', 'Next.js', 'Anthropic Agent SDK'],
    featured: false,
  },
  {
    id: 6,
    slug: 'civic-grant-portal',
    locale: 'en',
    clientName: 'Civic Initiative',
    title: 'A grant portal that quadrupled approvals per quarter',
    summary:
      'Workflow rebuild + admin tooling so a 4-person team could process the throughput that previously required 16.',
    heroUrl: null,
    heroAlt: null,
    year: 2024,
    industry: 'Public sector',
    services: ['design', 'dev', 'support'],
    techStack: ['Astro', 'Fastify', 'MySQL', 'Fly.io'],
    featured: false,
  },
];

/*
 * Project details — same set as above with the long-form fields populated
 * for /work/[slug] rendering. In live mode, the API returns this shape
 * from /cms/projects/[slug].
 */
export const fixtureProjectDetails: CmsProjectDetail[] = fixtureProjects.map((p) => ({
  ...p,
  bodyMd: `## The problem\n\n${p.summary}\n\n## What we did\n\nA discovery sprint, then design and engineering in parallel, then a phased rollout. Full case study coming soon.\n\n## Outcome\n\nThe team owns it now and ships on their own cadence — we stay on retainer for infra and on-call.`,
  outcomes: [
    { label: 'Time saved', value: '40', unit: 'min/deploy' },
    { label: 'Uptime', value: '99.99', unit: '%' },
    { label: 'Team', value: String(p.id * 2 + 2), unit: 'people' },
  ],
  teamSize: p.id * 2 + 2,
  durationMonths: (p.id % 4) + 4,
}));

/*
 * Team — every engineer carries 5+ years. Roles cover the four pillars.
 * Photos default to initials; swap in real images once available.
 */
export const fixtureTeam: CmsTeamMember[] = [
  {
    id: 1,
    name: 'M. Ridwan Zalbina',
    role: 'Founder & Principal Engineer',
    team: 'eng',
    yearsExperience: 12,
    bio: 'Builds platforms that outlive the launch. Background in distributed systems and design tooling.',
    photoUrl: null,
    photoAlt: null,
    social: [{ kind: 'linkedin', url: 'https://www.linkedin.com/in/zalbina' }],
  },
  {
    id: 2,
    name: 'Maya Hartono',
    role: 'Engineering Lead — Frontend',
    team: 'eng',
    yearsExperience: 9,
    bio: 'Shipped design systems used by 50+ teams. Hard opinions on accessibility, soft ones on tabs vs spaces.',
    photoUrl: null,
    photoAlt: null,
    social: null,
  },
  {
    id: 3,
    name: 'Daniel Okafor',
    role: 'Engineering Lead — Backend',
    team: 'eng',
    yearsExperience: 11,
    bio: 'Go, Rust, and an unhealthy fascination with Postgres internals. Previously built billing at scale.',
    photoUrl: null,
    photoAlt: null,
    social: null,
  },
  {
    id: 4,
    name: 'Priya Subramaniam',
    role: 'Principal Designer',
    team: 'design',
    yearsExperience: 10,
    bio: 'Product design for systems people use every day. Believes a good design system replaces a hundred meetings.',
    photoUrl: null,
    photoAlt: null,
    social: null,
  },
  {
    id: 5,
    name: 'Thomas Lindgren',
    role: 'Staff Designer',
    team: 'design',
    yearsExperience: 7,
    bio: 'Interaction design and motion. Cares more about the third click than the first.',
    photoUrl: null,
    photoAlt: null,
    social: null,
  },
  {
    id: 6,
    name: 'Aïcha Benali',
    role: 'Platform Engineer',
    team: 'infra',
    yearsExperience: 8,
    bio: 'AWS, Kubernetes, Terraform. Has on-call war stories from three different industries.',
    photoUrl: null,
    photoAlt: null,
    social: null,
  },
  {
    id: 7,
    name: 'Jonas Berger',
    role: 'Site Reliability Engineer',
    team: 'infra',
    yearsExperience: 9,
    bio: 'Observability and incident response. Will write you a runbook before he writes the postmortem.',
    photoUrl: null,
    photoAlt: null,
    social: null,
  },
  {
    id: 8,
    name: 'Rina Permata',
    role: 'Operations Lead',
    team: 'ops',
    yearsExperience: 6,
    bio: 'Keeps engagements on the rails. Estimates that are right more often than they have any business being.',
    photoUrl: null,
    photoAlt: null,
    social: null,
  },
];
