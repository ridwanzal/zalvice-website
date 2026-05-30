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
  CmsPostDetail,
  CmsProjectSummary,
  CmsProjectDetail,
  CmsTeamMember,
  CmsTestimonial,
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
    featured: true,
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
    featured: false,
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
    featured: false,
  },
];

/*
 * Long-form bodies for the three fixture posts. Real prose so the
 * unified/remark/shiki pipeline has something to render — code blocks,
 * H2/H3 headings (for the renderer's slug + anchor pass), bullet lists,
 * inline code, an emphasis span. When the live admin lands these are
 * replaced by DB rows.
 */
export const fixturePostDetails: CmsPostDetail[] = [
  {
    ...fixturePosts[0]!,
    seoTitle: null,
    seoDescription: null,
    bodyMd: `## The pattern in one sentence

Never change a column's shape and the code that reads it in the same deploy.

That sentence covers every migration we ship — renames, type changes, NOT NULL additions, FK changes. The trick is splitting one logical change into a sequence of additive deploys, where every intermediate state is safe to run in production with mixed-version readers.

## Renames

Renaming a column is the most common version of this. Naive approach:

\`\`\`sql
ALTER TABLE projects RENAME COLUMN summary TO description;
\`\`\`

Run that on a live system and the previous-version app code still reading \`summary\` immediately throws. We do this instead:

\`\`\`sql
-- deploy 1
ALTER TABLE projects ADD COLUMN description TEXT;
UPDATE projects SET description = summary;
\`\`\`

Then the app starts writing to **both** columns. Then a deploy switches reads to \`description\`. Then a final deploy drops \`summary\`. Four deploys, zero downtime.

## NOT NULL on an existing column

Same shape — never \`ALTER COLUMN ... SET NOT NULL\` in the same migration that introduces a default for legacy rows. Backfill in a separate, batched script, *then* add the constraint.

### Backfill script shape

\`\`\`ts
let lastSeen = 0;
const batchSize = 1000;
while (true) {
  const rows = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(isNull(projects.description), gt(projects.id, lastSeen)))
    .orderBy(asc(projects.id))
    .limit(batchSize);
  if (rows.length === 0) break;
  await db.update(projects)
    .set({ description: 'untitled' })
    .where(inArray(projects.id, rows.map((r) => r.id)));
  lastSeen = rows[rows.length - 1]!.id;
  console.log(\`backfilled to id \${lastSeen}\`);
}
\`\`\`

Idempotent, restartable, observable.

## Why this matters

If you only ever ship migrations on a maintenance-window basis, you can skip all this. We ship continuously, on PlanetScale, with mixed-version readers in flight at every deploy. The pattern above is the only one that's never bitten us.`,
  },
  {
    ...fixturePosts[1]!,
    seoTitle: null,
    seoDescription: null,
    bodyMd: `Astro's pitch — ship near-zero JS by default, hydrate only what needs it — works exactly as advertised. After a year shipping marketing sites and a backoffice on Astro 4, here's the short list.

## What we kept

### Default-static, opt-in SSR

Every page is static unless we set \`export const prerender = false\`. The admin tree is the only thing in SSR mode. This single rule has done more for our build pipeline than any optimisation we layered on top.

### \`client:visible\` over \`client:load\`

\`client:load\` hydrates immediately on page load. \`client:visible\` defers until the island scrolls into view. We default to \`client:visible\` and only escalate when a feature must be interactive on first paint (the contact form is the only example so far).

### Fixture-first CMS adapter

\`CMS_MODE=fixture\` reads from a typed local file. \`CMS_MODE=live\` fetches from the API. Same Zod schema parses both, so drift fails the build. A fresh clone renders the whole site with no DB.

## What we threw out

### Heavy carousels

Embla, Swiper, Splide — all add JS to do what CSS scroll-snap already does. The homepage Services carousel is 5 cards in a horizontal scroll-snap container. Zero JS, native momentum, accessibility for free.

### Per-component CSS-in-JS

We tried it for two weeks. It's not what Astro is built for. We're on Tailwind now and every component scopes its rare custom CSS in a \`<style>\` block inside the .astro file. The output is one CSS bundle, ~15KB gzip.

### \`<Image>\` for everything

Astro's \`<Image>\` is great for content images (responsive srcset, format conversion). For decorative SVG art and CSS-only animations, plain inline SVG is smaller and ships zero processing cost. We use \`<Image>\` only when the source dimensions matter.

## One thing we're still arguing about

View Transitions. They're elegant when they work but the cross-page state for the mobile nav and locale switcher gets messy. Probably re-evaluate at Astro 5.`,
  },
  {
    ...fixturePosts[2]!,
    seoTitle: null,
    seoDescription: null,
    bodyMd: `Every project we take on starts with a fixed-fee discovery sprint. Here is how we price it and why.

## The shape

- 1–3 weeks, depending on system complexity.
- One designer, one engineer, partial-time lead.
- Fixed fee — no scope-creep escalations.
- Output: a written scope, an architecture sketch, a deployment plan, and an estimate for the build.

## Why fixed fee

Hourly billing on discovery creates the wrong incentive on both sides. You worry about the meter; we worry about scope. A fixed fee aligns interests on the deliverable: a plan good enough that the build estimate sits within ±15%.

## The trap of skipping discovery

We have, twice, agreed to skip it. Both projects went over budget by 60%+. The reason is always the same: the assumptions that didn't survive contact with the system.

If you're tempted to skip — pick the smallest meaningful build instead of the full project. Two weeks of discovery is cheaper than two months of rework.`,
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
 * Team — real members across eng / design / ops. Bios + yearsExperience
 * are placeholders until the team supplies real values. Photos default to
 * initials; drop files in /public/team/ and point photoUrl at them once
 * available.
 */
export const fixtureTeam: CmsTeamMember[] = [
  {
    id: 1,
    name: 'M. Ridwan Zalbina',
    role: 'Software Engineer · Front-End · UI & Brand · Co-Founder',
    team: 'eng',
    yearsExperience: 5,
    bio: 'Front-end engineering and brand design. Co-founder.',
    photoUrl: null,
    photoAlt: null,
    social: [
      { kind: 'linkedin', url: 'https://www.linkedin.com/in/mridwanzalbina/' },
      { kind: 'github', url: 'https://github.com/ridwanzal' },
      { kind: 'instagram', url: 'https://instagram.com/ridwanzal' },
    ],
  },
  {
    id: 2,
    name: 'M. Reyhan Zalbina',
    role: 'Software Developer · Database · BI Analyst · Co-Founder',
    team: 'eng',
    yearsExperience: 5,
    bio: 'Backend, databases, and BI. Co-founder.',
    photoUrl: null,
    photoAlt: null,
    social: [
      { kind: 'linkedin', url: 'https://www.linkedin.com/in/mreyhanzalbina/' },
      { kind: 'github', url: 'https://github.com/reyhanzal' },
      { kind: 'instagram', url: 'https://instagram.com/mreyhanzalbina' },
    ],
  },
  {
    id: 3,
    name: 'Suwardhana',
    role: 'Full-Stack Developer · Business Analyst · QA Engineer',
    team: 'eng',
    yearsExperience: 5,
    bio: 'Full-stack delivery with a QA discipline. Owns quality from first ticket to release.',
    photoUrl: null,
    photoAlt: null,
    social: [
      { kind: 'github', url: 'https://github.com/suwardhana' },
      { kind: 'instagram', url: 'https://www.instagram.com/suwardhana/' },
    ],
  },
  {
    id: 4,
    name: 'Arry Erpapalemlah',
    role: 'Backend Developer · Business Analyst',
    team: 'eng',
    yearsExperience: 5,
    bio: 'Backend systems and analysis. Translates messy requirements into clean APIs.',
    photoUrl: null,
    photoAlt: null,
    social: [{ kind: 'instagram', url: 'https://www.instagram.com/arreh69/' }],
  },
  {
    id: 5,
    name: 'Andry Erpapalemlah',
    role: 'Backend Developer · Business Analyst',
    team: 'eng',
    yearsExperience: 5,
    bio: 'Backend systems and analysis. Pairs deep modeling with shipping discipline.',
    photoUrl: null,
    photoAlt: null,
    // TODO: legacy site listed Maudi's IG handle here — drop in real handle when known.
    social: null,
  },
  {
    id: 6,
    name: 'M. Rifqan Zalbina',
    role: 'Full-Stack Developer · Data Science · Web3',
    team: 'eng',
    yearsExperience: 5,
    bio: 'Full-stack with a foot in data science and Web3.',
    photoUrl: null,
    photoAlt: null,
    social: [
      { kind: 'github', url: 'https://github.com/rifqanzalbina' },
      { kind: 'instagram', url: 'https://www.instagram.com/rifqanzal/' },
    ],
  },
  {
    id: 7,
    name: 'Aribowo Nugroho',
    role: 'Full-Stack Developer · PHP Developer',
    team: 'eng',
    yearsExperience: 5,
    bio: 'Full-stack with deep PHP roots. Maintains the unglamorous bits that keep clients running.',
    photoUrl: null,
    photoAlt: null,
    social: [{ kind: 'instagram', url: 'https://www.instagram.com/ayahshieva' }],
  },
  {
    id: 8,
    name: 'Maudi Indriani',
    role: 'Business Analyst · Project Management · UI/UX Designer',
    team: 'design',
    yearsExperience: 5,
    bio: 'Business analysis, project management, and UI/UX design.',
    photoUrl: null,
    photoAlt: null,
    social: [{ kind: 'instagram', url: 'https://www.instagram.com/maudyindrr/' }],
  },
  {
    id: 9,
    name: 'M. Sulkhan Nurfatih, S.Kom, M.Phil',
    role: 'Senior Account Manager · Business Development',
    team: 'ops',
    yearsExperience: 5,
    bio: 'Senior account management and business development.',
    photoUrl: null,
    photoAlt: null,
    social: [{ kind: 'instagram', url: 'https://www.instagram.com/sulkhan23/' }],
  },
];

/*
 * Testimonials — six quotes covering different industries and pillars.
 * Each project reference points at a real project slug in fixtureProjects
 * so the "Read the case" link resolves in fixture mode. Featured = true
 * for the four that surface on the homepage carousel.
 */
export const fixtureTestimonials: CmsTestimonial[] = [
  {
    id: 1,
    locale: 'en',
    quote:
      "Zalvice rebuilt our dispatch platform on a tight deadline and stayed on for operations. Deploys went from a quarterly event to something we do on a Tuesday afternoon without thinking about it.",
    authorName: 'Sarah Chen',
    authorRole: 'VP Engineering',
    authorCompany: 'Northwind Logistics',
    authorPhotoUrl: null,
    authorPhotoAlt: null,
    project: { slug: 'northwind-fleet-platform', title: 'A real-time fleet platform that ships in 90 seconds' },
    featured: true,
  },
  {
    id: 2,
    locale: 'en',
    quote:
      "The discovery sprint alone saved us months of architectural rework. Their team interviewed our clinicians, audited the existing system, and came back with a plan we could actually defend to the board.",
    authorName: 'Dr. Marcus Webb',
    authorRole: 'Chief Medical Officer',
    authorCompany: 'Meridian Health',
    authorPhotoUrl: null,
    authorPhotoAlt: null,
    project: { slug: 'meridian-clinic-records', title: 'A clinic records system clinicians actually like using' },
    featured: true,
  },
  {
    id: 3,
    locale: 'en',
    quote:
      "Sub-millisecond p99 wasn't a number we'd dared put on a slide before. Zalvice's infra team rebuilt our OMS without a single planned outage in 14 months. We trust them with the parts of the stack we cannot afford to get wrong.",
    authorName: 'Hugo Bertrand',
    authorRole: 'Head of Trading Technology',
    authorCompany: 'Aperture Capital',
    authorPhotoUrl: null,
    authorPhotoAlt: null,
    project: { slug: 'aperture-trading-desk', title: 'A trading desk built on sub-millisecond data' },
    featured: true,
  },
  {
    id: 4,
    locale: 'en',
    quote:
      "They built our RAG assistant the way you would build a payments system — observability, evals, fallback logic from day one. Tier-1 deflection at 38% without losing any CSAT points.",
    authorName: 'Priya Shankar',
    authorRole: 'VP Customer Experience',
    authorCompany: 'Oak & Stone',
    authorPhotoUrl: null,
    authorPhotoAlt: null,
    project: { slug: 'oak-ai-knowledge-base', title: 'A RAG-backed knowledge base their support team trusts' },
    featured: true,
  },
  {
    id: 5,
    locale: 'en',
    quote:
      "We had two product teams shipping from a half-built design system; in six months Zalvice helped us grow that to fourteen with CI-enforced contribution rules. The system became a thing the org could rally around.",
    authorName: 'Tomas Ng',
    authorRole: 'Head of Design',
    authorCompany: 'Foundry Studio',
    authorPhotoUrl: null,
    authorPhotoAlt: null,
    project: { slug: 'foundry-design-system', title: 'A design system that 14 product teams ship from' },
    featured: false,
  },
  {
    id: 6,
    locale: 'en',
    quote:
      "Four people now process what used to require sixteen. The workflow rebuild was the obvious win but the admin tooling — the parts you don't see — is what made it stick.",
    authorName: 'Anna Maric',
    authorRole: 'Program Director',
    authorCompany: 'Civic Initiative',
    authorPhotoUrl: null,
    authorPhotoAlt: null,
    project: { slug: 'civic-grant-portal', title: 'A grant portal that quadrupled approvals per quarter' },
    featured: false,
  },
];
