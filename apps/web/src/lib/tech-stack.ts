/**
 * Tech stack content for the homepage TechStack section. Kept as a flat
 * typed module (not CMS-backed) since the team rarely changes vendors and
 * the editorial copy belongs next to the code that renders it. Move to
 * the CMS only if the content team starts editing this weekly.
 *
 * Each entry's `icon` matches a Lucide icon name; the component maps it
 * to a component reference at render time (per-icon tree-shaking).
 */

export type StackItem = {
  name: string;
  meaning?: string; // one-line note shown on hover / in a tooltip
};

export type StackCategory = {
  slug: string;
  label: string;
  icon: string;
  items: StackItem[];
};

/* Delivery stack — what we use to ship our clients' work. */
export const deliveryStack: StackCategory[] = [
  {
    slug: 'frontend',
    label: 'Frontend',
    icon: 'layout',
    items: [
      { name: 'React' },
      { name: 'Next.js' },
      { name: 'Astro' },
      { name: 'Vue' },
      { name: 'TypeScript' },
      { name: 'Tailwind CSS' },
    ],
  },
  {
    slug: 'backend',
    label: 'Backend',
    icon: 'server-cog',
    items: [
      { name: 'Node.js' },
      { name: 'Fastify' },
      { name: 'NestJS' },
      { name: 'Go' },
      { name: 'Python' },
      { name: 'PostgreSQL' },
      { name: 'MySQL' },
    ],
  },
  {
    slug: 'mobile',
    label: 'Mobile',
    icon: 'smartphone',
    items: [
      { name: 'React Native' },
      { name: 'Expo' },
      { name: 'Swift' },
      { name: 'Kotlin' },
    ],
  },
  {
    slug: 'infra',
    label: 'Infrastructure',
    icon: 'cloud',
    items: [
      { name: 'AWS' },
      { name: 'GCP' },
      { name: 'Cloudflare' },
      { name: 'Fly.io' },
      { name: 'Docker' },
      { name: 'Kubernetes' },
      { name: 'Terraform' },
    ],
  },
  {
    slug: 'data',
    label: 'Data',
    icon: 'database',
    items: [
      { name: 'Postgres + pgvector' },
      { name: 'ClickHouse' },
      { name: 'BigQuery' },
      { name: 'dbt' },
      { name: 'Airflow' },
    ],
  },
  {
    slug: 'observability',
    label: 'Observability',
    icon: 'activity',
    items: [
      { name: 'OpenTelemetry' },
      { name: 'Sentry' },
      { name: 'Grafana' },
      { name: 'Datadog' },
    ],
  },
];

/*
 * AI stack — what we build into client products.
 * Marked separately so the section reads as "two answers to two
 * different buyer questions" rather than one undifferentiated list.
 */
export const aiStack: StackCategory[] = [
  {
    slug: 'models',
    label: 'Foundation models',
    icon: 'sparkles',
    items: [
      { name: 'Claude (Anthropic)' },
      { name: 'GPT-4 / GPT-4o (OpenAI)' },
      { name: 'Gemini (Google)' },
      { name: 'Llama 3 (self-hosted)' },
      { name: 'Mistral' },
    ],
  },
  {
    slug: 'orchestration',
    label: 'Orchestration & agents',
    icon: 'workflow',
    items: [
      { name: 'Anthropic Agent SDK' },
      { name: 'LangGraph' },
      { name: 'Vercel AI SDK' },
      { name: 'MCP (Model Context Protocol)' },
    ],
  },
  {
    slug: 'retrieval',
    label: 'Retrieval & memory',
    icon: 'search',
    items: [
      { name: 'pgvector' },
      { name: 'Qdrant' },
      { name: 'Pinecone' },
      { name: 'Weaviate' },
      { name: 'Elasticsearch (hybrid)' },
    ],
  },
  {
    slug: 'evals',
    label: 'Evaluation & safety',
    icon: 'shield-check',
    items: [
      { name: 'Anthropic Evals' },
      { name: 'OpenAI Evals' },
      { name: 'Ragas' },
      { name: 'Promptfoo' },
      { name: 'Guardrails AI' },
    ],
  },
];
