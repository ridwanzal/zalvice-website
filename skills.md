# skills.md

Implementation playbooks for the non-trivial features in Zalvice.com. This is the "I know what to build, how do I actually build it without making a mess?" file.

Each section is a **skill** — a self-contained pattern you can apply when implementing the feature. Cross-reference [`PRD.md`](./PRD.md) for the spec and [`CLAUDE.md`](./CLAUDE.md) for repo conventions.

---

## Table of contents

1. [Astro hybrid rendering — choosing static vs SSR per page](#1-astro-hybrid-rendering)
2. [Content pipeline — Astro reads from MySQL via Fastify](#2-content-pipeline)
3. [Carousel / showcase island](#3-carousel--showcase-island)
4. [Image handling — uploads, transforms, delivery](#4-image-handling)
5. [Contact form — full lifecycle](#5-contact-form-lifecycle)
6. [Admin auth — sessions, CSRF, brute-force defense](#6-admin-auth)
7. [Blog post rendering — Markdown + code blocks + TOC](#7-blog-post-rendering)
8. [Search — Pagefind setup for the blog](#8-search--pagefind)
9. [SEO — meta tags, sitemap, JSON-LD](#9-seo)
10. [Analytics — privacy-friendly events](#10-analytics)
11. [Performance — keeping mobile fast](#11-performance)
12. [Accessibility — patterns that pass audits](#12-accessibility)
13. [Deployment — first deploy and ongoing](#13-deployment)
14. [Database migration safety](#14-database-migration-safety)
15. [Testing strategy — unit / integration / e2e / visual](#15-testing-strategy)
16. [Env config loading — typed, validated, fail-fast](#16-env-config-loading)
17. [Error handling & observability — Sentry, pino, request IDs](#17-error-handling--observability)
18. [Rate limiting & abuse prevention](#18-rate-limiting--abuse-prevention)
19. [Transactional email — Resend + templates](#19-transactional-email)
20. [Webhook-driven rebuilds — publish → deploy](#20-webhook-driven-rebuilds)
21. [i18n-ready scaffolding (deferred but planned)](#21-i18n-ready-scaffolding)
22. [Feature flags — light-touch toggles](#22-feature-flags)
23. [Fixture-first CMS pipeline](#23-fixture-first-cms-pipeline)
24. [Logo marquee — CSS-only, two-row, edge-fade](#24-logo-marquee)
25. [Scroll-snap carousel — when not to use a JS carousel](#25-scroll-snap-carousel)
26. [Mobile offcanvas nav — full-viewport, frosted, no framework](#26-mobile-offcanvas-nav)
27. [Generating Drizzle migrations — the .js-extension workaround](#27-generating-drizzle-migrations)

---

## 1. Astro hybrid rendering

**Goal:** static where possible, SSR where required, never both for the same route.

**Rule of thumb:**
- Marketing page that changes when content is published → **static**, rebuild on webhook.
- Page that depends on per-request state (auth, form result) → **SSR**.
- Interactive widget on a static page → **island** with `client:visible`.

**Config:**

```ts
// astro.config.mjs
export default defineConfig({
  output: 'hybrid',            // static by default, opt-in to SSR
  adapter: node({ mode: 'standalone' }),
  integrations: [tailwind(), sitemap()],
});
```

**Per-page opt-in to SSR:**

```astro
---
export const prerender = false;  // this page is SSR
---
```

**Rebuild on content change:** see §20.

**Traps to avoid:**
- Don't fetch from the DB in the Astro frontmatter on every request for marketing pages — that defeats SSG. Fetch at build via a build-time data loader.
- Don't put `Astro.cookies.get(...)` in a static page. Astro will silently downgrade the page to SSR.
- Don't `getStaticPaths()` against a slow API without caching — the entire build blocks on it.

---

## 2. Content pipeline

**Architecture:**

```
MySQL ← Drizzle ← Fastify API ← (build time) Astro ← static HTML → CDN
                       ↑
                       └── (runtime) /admin SSR pages
```

**Build-time data fetching** — Astro reads from the API during build via a typed CMS adapter:

```ts
// apps/web/src/lib/cms.ts
import { z } from 'zod';
import { env } from './env';

const ProjectSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  // ...
});
export type Project = z.infer<typeof ProjectSchema>;

export async function getPublishedProjects(): Promise<Project[]> {
  const res = await fetch(`${env.API_URL}/cms/projects?status=published`, {
    headers: { 'x-build-token': env.BUILD_TOKEN },
  });
  if (!res.ok) throw new Error(`CMS fetch failed: ${res.status}`);
  return z.array(ProjectSchema).parse(await res.json());
}
```

```astro
---
// apps/web/src/pages/work/index.astro
import { getPublishedProjects } from '../../lib/cms';
const projects = await getPublishedProjects();
---
{projects.map(p => <ProjectCard project={p} />)}
```

**Why not query Drizzle directly from Astro?** Three reasons:
1. Astro pages and the API would both need DB credentials → wider blast radius.
2. The API enforces business rules (e.g. filtering drafts, applying `clients.consent_to_display`) in one place.
3. Cleaner separation when we eventually expose the API to other surfaces.

**Dev fallback:** during very-early local dev, the API may not be running. The CMS adapter exports a `fixture` mode (toggled by `CMS_MODE=fixture`) that reads from `/apps/web/src/lib/cms.fixtures.ts`. CI and prod always use `CMS_MODE=live`.

**Always validate at the boundary.** Use Zod (`Schema.parse`) on every response so the build fails loudly on schema drift, not silently a week later in production.

---

## 3. Carousel / showcase island

> **Decision order:** before reaching for any JS carousel, evaluate whether [§25 scroll-snap](#25-scroll-snap-carousel) covers the requirement. The default homepage Services carousel and the Work index card row are both scroll-snap, no JS. Reach for Embla only when you genuinely need arrow controls + dot pagination + autoplay logic.

**Library choice (when JS is justified):** `embla-carousel-react` — small (~8KB gzip), accessible, framework-friendly, no opinionated styling.

**Why not Swiper?** Bigger bundle, more features than we need, harder to style with Tailwind.

**Pattern — keep the slide content server-rendered, only the carousel chrome is the island:**

```tsx
// apps/web/src/islands/FeaturedCarousel.tsx
import useEmblaCarousel from 'embla-carousel-react';

export default function FeaturedCarousel({ children }: { children: React.ReactNode }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: false, align: 'start' });
  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-4">{children}</div>
      {/* prev/next/dots controls */}
    </div>
  );
}
```

```astro
---
// usage
import FeaturedCarousel from '../islands/FeaturedCarousel.tsx';
const projects = await getFeaturedProjects();
---
<FeaturedCarousel client:visible>
  {projects.map(p => <ProjectSlide project={p} />)}
</FeaturedCarousel>
```

**Accessibility requirements:**
- Keyboard: `ArrowLeft` / `ArrowRight` navigate.
- `aria-roledescription="carousel"` on the container.
- Slides have `aria-label="Slide X of N"`.
- Pause-on-hover (we're not autoplaying by default anyway — see PRD §5.1).
- Respect `prefers-reduced-motion` — disable slide animation when set.

**Don't:**
- Autoplay (accessibility hostile).
- Use carousel for *primary* content the user must see — fold into the page instead.

---

## 4. Image handling

**Upload (admin):**

1. Admin form posts `multipart/form-data` to `/api/admin/media`.
2. Fastify validates MIME (`image/jpeg`, `image/png`, `image/webp`, `image/avif`, `image/svg+xml`), max 10MB, dimensions.
3. Generate filename: `${nanoid()}.${ext}` — never trust the client filename.
4. Strip EXIF (Sharp `.rotate().withMetadata({orientation: undefined})`).
5. ClamAV scan (skip in dev with env flag `CLAMAV_HOST` unset).
6. Upload to S3-compatible storage (Cloudflare R2 recommended) with `Content-Type` matching MIME and a `Cache-Control: public, max-age=31536000, immutable` header.
7. Insert `media` row with URL, width, height, alt, focal point, uploader.

**Delivery:**

Use Astro's built-in `<Image>` component — handles `srcset`, AVIF/WebP fallback, lazy loading, CLS prevention.

```astro
---
import { Image } from 'astro:assets';
---
<Image
  src={project.heroImage.url}
  alt={project.heroImage.alt}
  width={1280}
  height={720}
  loading="lazy"
  formats={['avif', 'webp', 'jpg']}
/>
```

**For remote images** (from R2), configure `astro.config.mjs`:

```ts
image: {
  service: { entrypoint: 'astro/assets/services/sharp' },
  remotePatterns: [{ protocol: 'https', hostname: 'media.zalvice.com' }],
}
```

**Cloudflare in front:** offload transforms to Cloudflare Image Resizing for production — Astro's local transforms are dev-only.

**Above-the-fold images:** add `loading="eager"` and `fetchpriority="high"` on the LCP image (usually the masthead). Everything else stays `loading="lazy"`.

---

## 5. Contact form lifecycle

**End-to-end flow:**

```
Browser → POST /api/leads → validate → rate-limit → CSRF → captcha
       → INSERT into leads
       → notify Slack #sales (webhook)        ┐
       → notify sales inbox (Resend)           │  fire-and-forget
       → confirmation email to submitter       │  (queued, retried)
       → return 201 to browser → render thank-you state
```

**Schema (single source of truth, used both client + server):**

```ts
// packages/db/src/schema/leads-schema.ts
import { z } from 'zod';

export const LeadSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(200).optional(),
  phone: z.string().max(40).optional(),
  projectType: z.enum(['design', 'development', 'infrastructure', 'support', 'other']),
  budgetRange: z.enum(['under_25k', '25k_75k', '75k_200k', '200k_plus', 'not_sure']),
  timeline: z.enum(['asap', '1_3_months', '3_6_months', 'exploring']).optional(),
  message: z.string().min(20).max(5000),
  howHeard: z.string().max(200).optional(),
  source: z.string().max(200).optional(),
  // honeypot — must be empty
  website: z.string().max(0).optional(),
  // UTM (collected, not user-visible)
  utm: z.record(z.string()).optional(),
  // Turnstile token (validated server-side)
  turnstileToken: z.string().min(1),
});
export type LeadInput = z.infer<typeof LeadSchema>;
```

**Defenses in order:**

1. **Honeypot:** hidden `website` field. If populated, return 201 silently (don't tip off bots) but don't process. Log the hit at `info` level with the IP — useful for monitoring botnet activity.
2. **Rate limit:** `@fastify/rate-limit` — 5 submissions / IP / hour. See §18.
3. **Captcha:** Cloudflare Turnstile. Verify token server-side against `https://challenges.cloudflare.com/turnstile/v0/siteverify`.
4. **CSRF:** double-submit cookie pattern via `@fastify/csrf-protection`.
5. **Validation:** Zod schema. Reject with 422 + field-level errors.

**Side effects are non-blocking.** Slack + emails are queued via a simple in-process queue (`p-queue`). If Slack is down, the user still gets a 201 and their lead is in the DB.

**Browser-side rendering:**

```tsx
// apps/web/src/islands/ContactForm.tsx
type FormState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error', message: string, fieldErrors?: Record<string, string> };

const [state, setState] = useState<FormState>({ status: 'idle' });
// aria-live region for status, focus management on success
```

On success: render thank-you state in-place (no redirect — preserves UTM source for the next analytics event). Focus the thank-you heading so screen-reader users hear the confirmation.

**After-the-fact: lead pipeline in admin** — status moves through New → Qualified → Contacted → Won/Lost. CSV export available.

---

## 6. Admin auth

**Stack as shipped (Pass A):** hand-rolled, ~150 LOC. argon2id for passwords, opaque session id (random 32 bytes → base64url) stored in `user_sessions`, HMAC-signed httpOnly cookie. No Lucia, no Auth.js. See `apps/api/src/lib/auth.ts`.

**Why hand-rolled?**
- Lucia v3 changed shape from the original recipe and the API surface is bigger than what a 2-role internal admin needs.
- Hand-rolled removes a dep and gives us full control of every code path the lockout / session-rotation logic touches.
- ~150 LOC is small enough to review in a sitting.

**Primitives:**

```ts
createSession(userId, { ip, userAgent })  // → { id, expiresAt }
validateSession(id)                        // → { user, session } | null
invalidateSession(id)                      // → void
recordLoginAttempt({ email, ip, success })
isLockedOut({ email, ip })                 // boolean
signSessionCookie(id)                      // → "${id}.${hmac}"
unwrapSessionCookie(raw)                   // → id | null (constant-time HMAC verify)
hashPassword / verifyPassword              // argon2id
verifyPasswordConstantTime(hash | null, plain)  // runs argon2 even on null
```

**Plugin pattern:**

```ts
// apps/api/src/plugins/session.ts
fastify.addHook('onRequest', async (req) => {
  const raw = req.cookies[SESSION_COOKIE];
  const id = unwrapSessionCookie(raw);
  req.auth = id ? await validateSession(id) : null;
});

fastify.decorate('requireAdmin', async (req) => {
  if (!req.auth) throw fastify.httpErrors.unauthorized();
});
```

Plugin order matters — `@fastify/cookie` → `@fastify/formbody` → session → routes.

**Password hashing:** `@node-rs/argon2` with defaults (memoryCost 19456, timeCost 2). Don't tune lower.

**Brute force defense:**
- Rate-limit by IP (10/hour) AND by email (5/hour). Track in `login_attempts` table.
- `verifyPasswordConstantTime` runs the argon2 verify even on unknown emails (precomputed dummy hash) — prevents user enumeration via response timing.
- Never reveal whether the email exists ("invalid email or password" only).

**HTML vs JSON dispatch on the login route:**
- `Accept: text/html` → 303 redirect to `/admin/login?error=1&redirect=…` on failure.
- Otherwise → standard `httpErrors.unauthorized()`.
- The admin pages POST forms (not fetch), so they get the redirect path; API consumers see JSON.

**Session rotation:** rotate session ID on logout (invalidate row). On login, we issue a fresh id every time — no resumption of expired sessions.

**2FA:** schema has `totp_secret` ready; implementation lives in Pass B.

**CSRF:** double-submit cookie pattern with `@fastify/csrf-protection` is in PRD §10 but **not yet wired** — Pass A relies on `SameSite=Lax` + HTML form posts staying same-origin. Wire CSRF tokens before exposing any admin route to a CORS origin.

**Logout = session delete + clear cookie.** Don't rely on the cookie expiring.

**Admin web side:**
- `/admin/*` pages are SSR (`export const prerender = false`).
- `lib/admin.ts` exports `requireAdmin(Astro)` returning `{ user, redirect: null }` or `{ user: null, redirect: Response }`. Pattern at the top of each page:

```astro
const auth = await requireAdmin(Astro);
if (!auth.user) return auth.redirect;
const user = auth.user;
```

This shape exists specifically because top-level `return` in Astro frontmatter confuses `astro check`'s code-flow pass — importing `redirectToLogin` and using it via `return redirectToLogin(...)` gets flagged as "declared but never read." Folding both into one return restores the visible use.

---

## 7. Blog post rendering

**Storage:** Markdown in MySQL `posts.body_md` (TEXT or MEDIUMTEXT).

**Render pipeline:**

```
body_md
  → unified/remark (parse markdown)
  → remark-gfm (tables, strikethrough, task lists)
  → remark-rehype
  → rehype-slug (anchor IDs on headings — needed for TOC)
  → rehype-autolink-headings (¶ icon on hover)
  → rehype-shiki (syntax highlighting, theme: "github-light")
  → rehype-stringify → HTML
```

**Implementation:**

```ts
// apps/web/src/lib/markdown.ts
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeShiki from '@shikijs/rehype';
import rehypeStringify from 'rehype-stringify';

export async function renderMarkdown(md: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeShiki, { theme: 'github-light' })
    .use(rehypeStringify)
    .process(md);
  return String(file);
}
```

**Why Shiki over Prism / highlight.js?**
- Same tokenizer as VS Code → highlighting matches what writers see when drafting.
- Pre-renders at build → zero client JS for syntax highlighting.
- Supports any TextMate grammar.

**Table of contents:**

Walk the AST after parsing and extract H2/H3 with their slug IDs. Pass to a sticky sidebar component.

```ts
export function extractToc(md: string): TocEntry[] {
  // use the same unified pipeline, visit heading nodes
}
```

**Embeds (YouTube, Figma, CodeSandbox, Loom):** custom remark plugin that converts a URL on its own line into an `<iframe>` with `loading="lazy"`, fixed aspect-ratio wrapper, and `title` attribute for a11y.

**Sanitization:** since `body_md` is authored by trusted admins (not user input), full HTML passthrough is *not* enabled (`allowDangerousHtml: false`). If we ever open writes to less-trusted users, add `rehype-sanitize` between rehype and shiki.

**Reading time:** computed at publish time (`reading_minutes = ceil(wordCount / 230)`) and stored on the row — not recomputed on render.

---

## 8. Search — Pagefind

**Why Pagefind:**
- Indexes the built static HTML, runs entirely in the browser, zero backend.
- ~30KB initial JS, lazy-loads index chunks as needed.
- Works perfectly with Astro's SSG output.

**Setup:**

```json
// package.json (apps/web)
"scripts": {
  "build": "astro build && pagefind --site dist"
}
```

```astro
---
// apps/web/src/pages/blog/index.astro
---
<input type="search" id="blog-search" placeholder="Search posts..." />
<div id="search-results"></div>

<script>
  import { PagefindUI } from '@pagefind/default-ui';
  new PagefindUI({ element: '#blog-search', showImages: false });
</script>
```

**Scope to blog only:**

```astro
<div data-pagefind-body>
  <!-- post content -->
</div>
```

Pages without `data-pagefind-body` are excluded from the index.

**Filters via metadata:**

```astro
<div data-pagefind-body data-pagefind-filter="category:Engineering">
```

---

## 9. SEO

**Per-page meta — `<SEO>` component:**

```astro
---
// apps/web/src/components/SEO.astro
interface Props {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
  jsonLd?: Record<string, unknown>;
  noindex?: boolean;
}
const { title, description, ogImage, canonical, jsonLd, noindex } = Astro.props;
const canonicalUrl = canonical ?? new URL(Astro.url.pathname, Astro.site).toString();
---
<title>{title} — Zalvice</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalUrl} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImage ?? '/og-default.png'} />
<meta property="og:url" content={canonicalUrl} />
<meta name="twitter:card" content="summary_large_image" />
{noindex && <meta name="robots" content="noindex,nofollow" />}
{jsonLd && <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />}
```

**Sitemap:** `@astrojs/sitemap` integration. Add to `astro.config.mjs`. It picks up all routes automatically — exclude `/admin` and `/api` via the integration's `filter` option.

**JSON-LD by page type:**

- **Every page:** `Organization` (in root layout).
- **Blog post:** `Article` with author, datePublished, image.
- **Project detail:** `CreativeWork` with `creator: Organization(Zalvice)`.
- **Services FAQ:** `FAQPage` for the FAQ block.
- **Detail pages:** `BreadcrumbList`.

**robots.txt:**

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Sitemap: https://zalvice.com/sitemap-index.xml
```

**Default OG image generation:** at build time, run a small Sharp script that composes the post/project title over the brand-blue gradient template. Output to `/dist/og/<slug>.png`. The SEO component points at this if `og_image_id` is null.

---

## 10. Analytics

**Choice:** Plausible (managed) or Umami (self-hosted). Both are cookie-less and GDPR-friendly — no banner required.

**Install:** one script tag in the root layout. Done.

```astro
<script defer data-domain="zalvice.com" src="https://plausible.io/js/script.outbound-links.js"></script>
```

**Custom events** — track meaningful interactions, not every click:

| Event | When | Properties |
|---|---|---|
| `cta_click` | Any primary CTA button | `{ location: 'homepage_hero', label: 'Start a project' }` |
| `form_start` | First interaction with contact form | `{}` |
| `form_field_error` | Field validation fails on blur | `{ field }` |
| `form_submit` | Successful submission | `{ projectType, budgetRange }` |
| `form_submit_fail` | Server rejection | `{ reason }` |
| `scroll_75` | User scrolls past 75% of case study | `{ slug }` |
| `read_complete` | User stays on blog post ≥ 30s and reaches end | `{ slug }` |
| `code_copy` | Copy button on a code block clicked | `{ language }` |

**Event helper:**

```ts
// apps/web/src/lib/analytics.ts
type EventProps = Record<string, string | number>;
type PlausibleFn = (event: string, opts?: { props?: EventProps }) => void;

export function track(event: string, props?: EventProps) {
  if (typeof window === 'undefined') return;
  const plausible = (window as unknown as { plausible?: PlausibleFn }).plausible;
  plausible?.(event, { props });
}
```

**Don't track:** mousemove, every scroll position, time-on-page deltas (Plausible derives it). Less is more.

---

## 11. Performance

**Budgets** (enforced in CI via Lighthouse CI):

| Page | JS gzip | LCP | CLS | INP |
|---|---|---|---|---|
| Home | 50KB | 2.5s | 0.1 | 200ms |
| Services / About | 30KB | 2.0s | 0.1 | 200ms |
| Blog / Work index | 40KB | 2.5s | 0.1 | 200ms |
| Detail pages | 60KB | 2.5s | 0.1 | 200ms |

**Wins that compound:**

1. **Astro default = zero JS.** Only ship JS for islands. Audit islands quarterly.
2. **Image discipline.** Every image has `width` and `height` (or aspect-ratio class). Astro `<Image>` for transforms.
3. **Font loading.** Self-host Inter, subset (latin + latin-ext), preload only `Inter-Bold.woff2` for the masthead. `font-display: swap`.
4. **No web fonts on initial render for body.** Use system stack fallback that closely matches Inter's metrics to minimize FOUT shift.
5. **CDN cache headers.** Marketing HTML: `s-maxage=300, stale-while-revalidate=86400`. Assets: `max-age=31536000, immutable`.
6. **Tailwind purge.** Already on by default in JIT mode — verify the production CSS bundle is under 15KB gzip.
7. **Preconnect to media.zalvice.com** in the head — saves the DNS+TLS handshake before the first image.

**Things that quietly kill mobile performance** (avoid):

- Large hero videos (use a static poster + lazy-load video).
- Custom cursors / mousemove handlers on the homepage.
- Third-party embeds above the fold.
- `client:load` on anything that isn't strictly above the fold and interactive immediately.
- Loading multiple icon sets — stick to Lucide.

---

## 12. Accessibility

**Patterns that pass audits:**

**Skip-to-content link** in the root layout:

```astro
<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 ...">
  Skip to content
</a>
<main id="main">{slot}</main>
```

**Focus rings** — never `outline: none` without replacement:

```css
/* globals.css */
*:focus-visible {
  outline: 2px solid theme('colors.brand');
  outline-offset: 2px;
  border-radius: 2px;
}
```

**Icon-only buttons:**

```astro
<button aria-label="Close dialog">
  <X class="h-5 w-5" />
</button>
```

**Form errors:**

```astro
<input id="email" aria-describedby="email-error" aria-invalid={hasError} />
<p id="email-error" role="alert" class="text-danger">{error}</p>
```

**Reduced motion:**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Mobile sheet menu:** trap focus while open, return focus to the trigger on close, close on `Esc`.

**Testing:** Run `axe-core` in Playwright e2e tests on every page. Manual keyboard pass before launch.

---

## 13. Deployment

**Recommended topology (v1):**

- **Web + API** on Fly.io or Railway (single Node process per app, autoscale 1–3 instances).
- **MySQL** on PlanetScale or AWS RDS — managed, with automated backups.
- **Media** on Cloudflare R2 — zero egress fees, S3-compatible.
- **CDN + DNS** on Cloudflare — proxies everything, handles TLS + image resizing + DDoS.

**CI/CD via GitHub Actions:**

```yaml
# .github/workflows/deploy.yml (simplified)
on: { push: { branches: [main] } }
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint && pnpm typecheck && pnpm test
      - run: pnpm build
      - run: pnpm test:e2e
      - run: pnpm lhci autorun           # performance budget
  deploy:
    needs: ci
    runs-on: ubuntu-latest
    steps:
      - run: flyctl deploy --remote-only
```

**Environments:**

- **Local:** `docker-compose up` for MySQL, `pnpm dev` for apps. `.env.local`.
- **Staging:** auto-deployed from `staging` branch, basic-auth protected, mirrors prod infra at smaller scale.
- **Production:** auto-deployed from `main`. Manual approval gate on the deploy step.

**Secrets management:** GitHub Actions secrets for CI, Fly.io/Railway secrets for runtime. Never commit `.env*` except `.env.example`.

**Rollback:** Fly.io and Railway both keep previous deploys — one-command rollback. For DB migrations, see §14.

**Day-1 monitoring:**

- Uptime: Better Stack or UptimeRobot pinging `/`, `/api/health`.
- Errors: Sentry (free tier is plenty for v1).
- Logs: Fly.io / Railway built-in log explorer is enough for v1; pipe to Logtail or Axiom later if volume grows.

---

## 14. Database migration safety

**Goal:** never break production during a deploy. Migrations and code can roll out together because every step is backwards-compatible.

**Rules:**

1. **Additive-first.** Add columns nullable or with a default; never `NOT NULL` without default in the same migration that introduces them.
2. **Two-phase renames.** Add new column → backfill → switch reads → switch writes → drop old. Each phase is its own PR, separated by at least one deploy.
3. **No destructive change in the same deploy as a read-path change.** Drop column comes a deploy *after* the code stops reading it.
4. **Online schema changes for big tables.** PlanetScale handles this automatically; on RDS use `pt-online-schema-change` or `gh-ost`.
5. **Every migration has a tested down path** — or is explicitly marked irreversible in the PR description.

**Workflow:**

```bash
pnpm --filter @zalvice/db generate          # creates packages/db/src/migrations/NNNN_*.sql
# review SQL by hand — drizzle-kit is not always right
pnpm --filter @zalvice/db migrate:dry        # prints what would run
pnpm db:migrate                              # apply locally
pnpm test                                    # tests must pass after migration
```

**Don't:**
- Hand-edit a migration file after it's been merged. Add a new migration that fixes it.
- `DROP TABLE` in a migration. Rename to `<table>_archived_YYYYMMDD` and let ops drop later.
- Add a `UNIQUE` constraint without first checking for duplicates with a separate query in the PR.

**Backfills:** write as idempotent scripts in `/packages/db/src/scripts/backfill-<purpose>.ts`. Always batch (1000 rows at a time, `WHERE id > :lastSeen`). Always log progress. Always safe to re-run.

---

## 15. Testing strategy

**Pyramid:** many unit tests, some integration, a few e2e and visual. Inverted pyramids cause slow CI and brittle suites.

### Unit (Vitest)

- Pure functions, validators, transforms.
- No I/O, no MSW, no DB. If a test needs those, it's not a unit test — move it.
- Live next to the code: `markdown.ts` ↔ `markdown.test.ts`.

```ts
import { describe, it, expect } from 'vitest';
import { LeadSchema } from './leads-schema';

describe('LeadSchema', () => {
  it('rejects message shorter than 20 chars', () => {
    const r = LeadSchema.safeParse({ /* ... */ message: 'too short' });
    expect(r.success).toBe(false);
  });
});
```

### Integration (Vitest, real DB)

- API route handlers against a real MySQL via `docker-compose`.
- **Don't mock the DB.** A mocked test that passed but failed in prod once is what got us this rule.
- Each test runs in a transaction that rolls back at teardown — no test sees data from another.

```ts
beforeEach(async () => { await db.execute(sql`START TRANSACTION`); });
afterEach(async () => { await db.execute(sql`ROLLBACK`); });
```

### E2E (Playwright)

- Happy paths only. The full grid:
  - Marketing: home loads, nav works, contact form submits a fake lead, blog post renders code blocks.
  - Admin: login, create draft post, publish, see it on the front-end.
- Run against a built dev server with seeded DB.
- Tests are flaky-tolerant up to 1 retry; >1 = the test is wrong.

### Visual regression

- Playwright `expect(page).toHaveScreenshot()` on homepage, project detail, blog post at 3 viewports (375, 768, 1280).
- Threshold 0.1%. Diffs reviewed in PR via artifact upload.

### Accessibility

```ts
import AxeBuilder from '@axe-core/playwright';
test('home is accessible', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(v => ['serious','critical'].includes(v.impact!))).toEqual([]);
});
```

### What we don't test

- Tailwind class strings (linter does it).
- Astro internals.
- Third-party libraries.

---

## 16. Env config loading

**Goal:** every env var is typed, validated at boot, and fails fast with a clear message if anything is missing.

**Pattern:**

```ts
// apps/api/src/lib/env.ts
import { z } from 'zod';

const Env = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32),
  CSRF_SECRET: z.string().min(32),
  RESEND_API_KEY: z.string().startsWith('re_'),
  SLACK_WEBHOOK_SALES: z.string().url(),
  TURNSTILE_SECRET_KEY: z.string().min(1),
  R2_ACCOUNT_ID: z.string(),
  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_BUCKET: z.string(),
  R2_PUBLIC_BASE: z.string().url(),
  DEPLOY_WEBHOOK_URL: z.string().url().optional(),
  SENTRY_DSN: z.string().optional(),
  CLAMAV_HOST: z.string().optional(),
});

const parsed = Env.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid env:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}
export const env = parsed.data;
```

**Astro side (`apps/web/src/lib/env.ts`):** mirrors the variables it actually reads (`PUBLIC_SITE_URL`, `API_URL`, `BUILD_TOKEN`, `PUBLIC_TURNSTILE_SITE_KEY`, `PUBLIC_PLAUSIBLE_DOMAIN`). Uses `import.meta.env` not `process.env`.

**Rule:** never read `process.env.X` outside `lib/env.ts`. The whole point is that nobody else has to think about whether a var exists.

---

## 17. Error handling & observability

**Server (Fastify):**

```ts
// apps/api/src/plugins/sentry.ts
import * as Sentry from '@sentry/node';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  if (!env.SENTRY_DSN) return;
  Sentry.init({ dsn: env.SENTRY_DSN, tracesSampleRate: 0.1, environment: env.NODE_ENV });
  fastify.addHook('onError', async (req, _reply, err) => {
    Sentry.withScope((scope) => {
      scope.setTag('reqId', req.id);
      scope.setExtra('url', req.url);
      Sentry.captureException(err);
    });
  });
});
```

**Request IDs:** Fastify generates `req.id` by default. Echo it back in a response header `x-request-id` so support can trace.

**Logging (pino):**

```ts
const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', '*.password', '*.email', '*.phone', '*.ip'],
    censor: '[redacted]',
  },
});
```

**Error shapes:** use `@fastify/sensible` so `fastify.httpErrors.badRequest('msg')` produces `{statusCode, error, message}` consistently.

**Client (browser):**

- Sentry browser SDK loaded only on production builds, `tracesSampleRate: 0.01`.
- Wrap event handlers in islands with `try/catch`; report via `Sentry.captureException` and show a friendly toast.
- Don't ship Sentry on marketing pages with no islands — there's nothing to catch.

**Health endpoint:** `/api/health` returns `{status: 'ok', db: 'ok', uptime}` after pinging the DB. Used by Better Stack and Fly.io's `[[checks]]`.

---

## 18. Rate limiting & abuse prevention

**Library:** `@fastify/rate-limit`. In-memory by default (single instance), Redis-backed when we scale beyond one.

**Per-route limits:**

| Route | Limit |
|---|---|
| `POST /api/leads` | 5 / hour / IP |
| `POST /api/auth/login` | 10 / hour / IP, 5 / hour / email |
| `POST /api/auth/forgot-password` | 3 / hour / IP, 3 / hour / email |
| `POST /api/admin/media` (upload) | 30 / hour / authenticated user |
| Everything else (default) | 300 / minute / IP |

**Setup:**

```ts
await fastify.register(rateLimit, { global: false, max: 300, timeWindow: '1 minute' });

fastify.post('/api/leads', {
  config: { rateLimit: { max: 5, timeWindow: '1 hour' } },
  schema: { body: LeadSchema },
}, handler);
```

**IP detection:** Fastify reads `X-Forwarded-For` only when `trustProxy: true` is set. Set it to the number of trusted hops (`1` for Cloudflare → Fly → app). Trusting too many = spoofable.

**Honeypot + Turnstile + rate limit** stack: a determined attacker still has to solve a captcha for every request, which makes the rate limit the *real* upper bound on damage. Don't drop any layer.

**Lockouts:** account lockout after 5 failed logins (15 min cooldown) — see §6.

**Blocking:** for clear abuse (one IP hitting `/api/leads` 1000 times after captcha failures), drop the IP at Cloudflare via a Worker rule, not in the app.

---

## 19. Transactional email

**Provider:** Resend (clean SDK, good deliverability, simple pricing). Postmark is a fine alternative if Resend has an outage history we don't like in 6 months.

**Templates:** `react-email` for type-safe templates. Compile at build time to HTML + plain-text fallback.

```tsx
// apps/api/src/emails/LeadConfirmation.tsx
import { Html, Head, Body, Container, Heading, Text, Link } from '@react-email/components';

export function LeadConfirmation({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Heading>Thanks, {name}.</Heading>
          <Text>We received your message and will reply within one business day.</Text>
          <Link href="https://zalvice.com">zalvice.com</Link>
        </Container>
      </Body>
    </Html>
  );
}
```

**Sending:**

```ts
import { Resend } from 'resend';
const resend = new Resend(env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Zalvice <hello@zalvice.com>',
  to: lead.email,
  subject: 'We got your message',
  react: <LeadConfirmation name={lead.name} />,
});
```

**Rules:**
- Every send is wrapped in a retry (3 attempts, exponential backoff).
- Failures are logged + sent to Sentry but never bubble to the user — the lead is in the DB; email is best-effort.
- All templates have a text/plain alternative (`react-email` produces it automatically).
- Subject lines ≤ 60 chars (Gmail mobile truncation).
- Sender domain must have SPF, DKIM, and DMARC aligned before the first send.

**Don't:**
- Send marketing/newsletter from this code path. That's a separate provider (ConvertKit/Buttondown in v1.1).
- Render Markdown in emails without sanitization — Gmail does odd things.

---

## 20. Webhook-driven rebuilds

**Goal:** publishing a post or project triggers a deploy within ~30s, no engineer required.

**Pattern:**

```
admin "Publish" → POST /api/admin/publish/:type/:id
  → DB UPDATE status='published', published_at=now()
  → fetch(DEPLOY_WEBHOOK_URL, { method: 'POST' })   ← fire-and-forget
  → return { ok: true }
```

**Fly.io receiving end:** GitHub Actions webhook or a Fly.io deploy hook. Triggers `pnpm build` → deploys the new static bundle.

**Scheduled publishing (`scheduled_for` in future):** a worker (`/apps/api/src/jobs/scheduled-publish.ts`) runs every 60s:

```ts
const due = await db.query.posts.findMany({
  where: and(eq(posts.status, 'scheduled'), lte(posts.scheduledFor, new Date())),
});
for (const p of due) {
  await db.update(posts).set({ status: 'published', publishedAt: new Date() }).where(eq(posts.id, p.id));
}
if (due.length) await fetch(env.DEPLOY_WEBHOOK_URL, { method: 'POST' });
```

**De-bouncing:** if 10 posts publish in a minute, we don't want 10 deploys. Coalesce: store a "rebuild requested at" timestamp in Redis or a single-row table; the worker only triggers if it's been ≥30s since last request.

**Webhook auth:** sign the request body with `DEPLOY_WEBHOOK_SECRET` (HMAC-SHA256), verify on the receiver. Plain webhook URLs leak in logs.

**Idempotency:** the rebuild itself is idempotent — running it twice in a row is harmless. The DB state is the source of truth; the build just renders it.

---

## 21. i18n-ready scaffolding

**Status:** English-only at launch. Don't ship i18n machinery for v1 — but don't paint into a corner either.

**Decisions to make now:**

1. **No inline visitor-facing strings in templates.** Either pulled from CMS or wrapped in `t('marketing.home.headline')`. The `t()` function in v1 just returns the key's English value; in v1.1 it grows a real backend.
2. **Routing reserves `[locale]`.** All URLs will eventually be `/en/about`, `/id/about`. For v1, no locale segment is emitted; the `t()` helper hard-codes `en`.
3. **DB carries `locale` + `translation_group_id` on content tables.** Defaults to `'en'`. UI ignores it for v1.
4. **Dates and numbers:** use `Intl.DateTimeFormat` / `Intl.NumberFormat` with a `locale` parameter passed down from the layout. Default `en-US`. Don't `String(new Date())`.

**Do NOT:**
- Build out `next-i18next`-style routing yet.
- Translate any copy speculatively.
- Add `lang="en"` switching components.

---

## 22. Feature flags

**Goal:** ship code dark, enable per environment, no third-party dependency.

**Pattern:** a single typed module, read at boot:

```ts
// apps/api/src/lib/flags.ts
import { z } from 'zod';
const Flags = z.object({
  ROUND_ROBIN_LEADS: z.coerce.boolean().default(false),
  I18N_ROUTING: z.coerce.boolean().default(false),
  NEW_PROJECT_DETAIL_LAYOUT: z.coerce.boolean().default(false),
});
export const flags = Flags.parse(process.env);
```

**Usage:**

```ts
if (flags.ROUND_ROBIN_LEADS) {
  await assignLeadRoundRobin(lead);
} else {
  await assignLeadToDefaultInbox(lead);
}
```

**Rules:**
- Every flag has an issue link and an owner.
- Flags live ≤ 60 days. After: rip the flag and the dead branch.
- No nested flags (`if (A && B)` — collapse into one named flag).
- Flags never gate security checks. "If `FLAG_OFF` skip CSRF" is forbidden.

**For the web side** (build-time): a tiny generator script writes `apps/web/src/lib/flags.generated.ts` from env at build, so flags compile-tree-shake in islands.

When we outgrow this (>10 active flags or need % rollouts), move to GrowthBook (open-source, self-hostable). Not before.

---

## 23. Fixture-first CMS pipeline

**Goal:** every CMS getter works without an API or a database. A fresh `git clone && pnpm install && pnpm dev` renders the whole site.

**Choice / why:** the marketing site renders almost entirely at build time. If reads required a live API the developer loop would be `up MySQL → run migrations → seed → start API → start web`. Fixture mode collapses that to `pnpm dev`. Trade-off: every CMS getter has two code paths and two corresponding fixtures.

**Pattern:**

```ts
// apps/web/src/lib/cms.ts
const ServiceSchema = z.object({ /* ... */ });
export type CmsService = z.infer<typeof ServiceSchema>;

export async function getServices(): Promise<CmsService[]> {
  if (env.CMS_MODE === 'fixture') return fixtureServices;
  return fetchCms('/services', z.array(ServiceSchema), 'services');
}
```

```ts
// apps/web/src/lib/cms.fixtures.ts
export const fixtureServices: CmsService[] = [ /* shape matches API response */ ];
```

`env.CMS_MODE` is `'fixture' | 'live'`, sourced from `import.meta.env.CMS_MODE` with a default of `'fixture'`. `.env.example` ships with `CMS_MODE=fixture`.

**Rules:**

1. **Same Zod schema** parses fixture and live data. Drift between fixture shape and DB shape is exactly the kind of bug this pattern is designed to catch — keep them in sync by typing both as `CmsX` and importing from the same place.
2. **Live mode validates at the boundary.** `fetchCms` always runs `schema.parse(response[key])` so a renamed column blows up at build time, not in production.
3. **Fixtures are realistic.** Same length distribution (24 clients, 6 projects, 8 team members), same null/empty patterns. A fixture with only 2 entries hides layout bugs that show up at 24.
4. **Don't `fetch()` directly from `.astro` files.** Always go through a getter in `cms.ts`. This is what makes fixture mode possible — there's exactly one place that knows about the mode flag.
5. **Live mode lives behind a build-token header.** `fetchCms` sends `x-build-token: env.BUILD_TOKEN`; the Fastify CMS routes verify it (`apps/api/src/routes/cms.ts`). Browsers never call `/api/cms/*` directly.

**When to leave fixture mode:**

- The team is editing content and wants to see edits without redeploying → spin up the API + MySQL, set `CMS_MODE=live`.
- Production builds always run `CMS_MODE=live` against the deployed API.

**Adding a new entity:**

1. Schema file in `packages/db/src/schema/`, exported from `index.ts`.
2. Zod schema + `Cms<Entity>` type in `apps/web/src/lib/cms.ts`.
3. Fixture in `apps/web/src/lib/cms.fixtures.ts` with realistic length.
4. Getter in `cms.ts` with the `if (env.CMS_MODE === 'fixture')` branch.
5. Fastify route under `apps/api/src/routes/cms.ts` for live mode.
6. Query helper in `packages/db/src/queries/` if it isn't a single-table read.

**Traps:**

- Forgetting to update fixtures when the DB schema changes. The Zod parse will fail loudly in live mode but silently succeed in fixture mode (because the fixture is already wrong-but-matching-itself). Add a unit test that imports both `fixtureX` and `XSchema` and round-trips.
- Tightening a validator (`.url()` from `.min(1)`) without checking that fixtures still pass. We hit this when adding root-relative logo paths.

---

## 24. Logo marquee

**Goal:** scroll a strip of client logos continuously, in two opposite-direction rows, with edge fade and no JS.

**Choice / why:** the typical implementation reaches for `react-fast-marquee` or similar (~5KB gzip per instance). We deliberately use pure CSS — the homepage budget is tight (50KB JS) and a logo strip is the kind of "decorative motion" that should never block the main thread.

**Pattern (two rows, opposite directions, seamless loop):**

```astro
<div class="marquee-mask overflow-hidden">
  <div class="marquee" data-direction="left">
    <ul class="marquee-track">{/* row A logos */}</ul>
    <ul class="marquee-track" aria-hidden="true">{/* duplicate of row A */}</ul>
  </div>
  <div class="marquee" data-direction="right">
    <ul class="marquee-track">{/* row B logos */}</ul>
    <ul class="marquee-track" aria-hidden="true">{/* duplicate of row B */}</ul>
  </div>
</div>

<style>
  .marquee-mask {
    mask-image: linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%);
  }
  .marquee { display: flex; width: max-content; animation: marquee-left 50s linear infinite; }
  .marquee[data-direction='right'] { animation-name: marquee-right; }
  .marquee:hover { animation-play-state: paused; }
  .marquee-track { display: flex; gap: 4.5rem; padding-right: 4.5rem; }
  @keyframes marquee-left  { from { transform: translateX(0); }   to { transform: translateX(-50%); } }
  @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
  @media (prefers-reduced-motion: reduce) { .marquee { animation: none; } }
</style>
```

**Why the duplicate row:** each row is `width: max-content`, so the two tracks together are 2× the row width. Translating by `-50%` advances exactly one track and the duplicate snaps into the original's position — loop is seamless and the user can't see a "reset." Mark the duplicate `aria-hidden="true"` so screen readers don't hear each client twice.

**Visual parity for varying logo sizes:**

The single most common bug: logos look hugely unequal because intrinsic dimensions vary. Fix is a **fixed-size cell** with `object-contain` inside:

```astro
<li style="width: 176px; height: 56px"
    class="flex items-center justify-center">
  <img src={c.logoUrl} class="max-h-full max-w-full object-contain opacity-60 grayscale" />
</li>
```

**Tuning:**

- 50s loop feels calm. 30s is "look at this!" and reads as advertising.
- `opacity: 0.6` baseline, `1` on hover — keeps the strip visually quiet against the rest of the page.
- `4.5rem` gap looks generous but not stretched at 1280px. Shrink on `<sm` if you have very few logos.

**Don't:**

- Autoplay with a fast loop — accessibility hostile.
- Forget the `aria-hidden` on the duplicate row.
- Skip the reduced-motion override.

Reference: `apps/web/src/components/LogoStrip.astro`.

---

## 25. Scroll-snap carousel

**Goal:** a swipe-able row of cards on mobile that becomes a regular grid on desktop. Zero JS.

**Choice / why:** Embla, Swiper, Splide all add JS to do something the browser already does well via CSS scroll-snap + overflow. We use this for the homepage Services carousel (5 cards) and the Work index hover row. We only escalate to a JS carousel when arrow buttons, dot pagination, or autoplay logic are genuinely required (PRD §5.1 H3 featured-work carousel is the one place we'll likely use Embla).

**Pattern:**

```astro
<div class="scroller" role="region" aria-label="Services">
  <ul class="track">
    {items.map((it) => <li class="item">{/* card */}</li>)}
  </ul>
</div>

<style>
  .scroller {
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;          /* Firefox */
    -ms-overflow-style: none;
  }
  .scroller::-webkit-scrollbar { display: none; }

  .track {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 80%;         /* mobile: leave a peek of the next card */
    gap: 1rem;
    padding: 0.5rem 1rem;
  }
  .item { scroll-snap-align: start; min-width: 0; }

  @media (min-width: 640px) { .track { grid-auto-columns: 55%; } }

  /* Desktop: equal columns, no scroll needed — looks like a grid. */
  @media (min-width: 1024px) {
    .track {
      grid-auto-columns: minmax(0, 1fr);
      overflow: visible;
    }
  }
</style>
```

**The peek pattern:** `grid-auto-columns: 80%` on mobile leaves ~20% of the next card visible. That's the visual affordance that tells users they can swipe. Without it the row looks like one full-width image.

**Hide the scrollbar visually but keep it functional.** Don't `overflow: hidden` — that disables the interaction entirely on desktop, and screen readers / keyboard users still expect arrow-key scrolling to work.

**Affordance for users who don't realize they can swipe:** add a small hint below the row on mobile only:

```astro
<p class="mt-4 text-center text-xs text-muted md:hidden">Swipe to see more →</p>
```

**Accessibility:** the `role="region"` + `aria-label` lets a screen-reader user know they've landed on a navigable area. Each card is a normal link/button — no special focus management needed.

**Don't:**

- Use this when the cards must be visible without interaction (e.g. a heading-level navigation row).
- Use it for fewer than 3 cards — the swipe makes the layout feel jittery.
- Use it for cards that wrap to multiple rows on desktop — it forces single-row layout. If you need wrapping, use a regular grid.

Reference: `apps/web/src/components/ServicesOverview.astro`.

---

## 26. Mobile offcanvas nav

**Goal:** full-viewport navigation panel for `<md` screens. Modern frosted-backdrop styling, native dialog semantics, no framework.

**Choice / why:** Headless UI / Radix `Dialog` are great, but ship React + Floating UI for what is fundamentally a `<div>` that slides in. Our implementation is one Astro component (`MobileNav.astro`) with a ~100-line inline `<script>` that handles open/close, focus trap, body-scroll lock, swipe-to-close, and `Esc`. Total cost: ~3KB JS, gated by `md:hidden` so desktop visitors ship zero.

**Anatomy:**

```
<div data-mobile-nav>                       ← host; gets data-open when open
  <button data-mobile-nav-trigger>          ← hamburger
  <div data-mobile-nav-backdrop>            ← frosted overlay
  <aside data-mobile-nav-panel
         role="dialog" aria-modal="true">   ← the sliding panel
    <button data-mobile-nav-close>          ← X
    <nav>{links}</nav>
    {secondary CTA / contact / social}
  </aside>
</div>
```

**The CSS that does the work:**

```css
.mobile-nav-panel {
  position: fixed; inset: 0;
  width: 100vw; height: 100dvh;        /* dvh handles iOS toolbar; fallback to vh */
  transform: translateX(-100%);
  transition: transform 280ms cubic-bezier(0.32, 0.72, 0, 1);
}
[data-mobile-nav][data-open] .mobile-nav-panel { transform: translateX(0); }

.mobile-nav-backdrop {
  position: fixed; inset: 0;
  background-color: rgba(10, 37, 64, 0.45);
  backdrop-filter: blur(10px);          /* the "modern" frosted look */
  opacity: 0;
  transition: opacity 220ms ease-out;
}
[data-mobile-nav][data-open] .mobile-nav-backdrop { opacity: 1; }

/* Lock body scroll while open. Apply to <html>, not <body>, to win against iOS quirks. */
html[data-mobile-nav-open] { overflow: hidden; }
```

**The script (key behaviors):**

```ts
// Bind once. Keep typed refs so closures don't fight `T | null`.
const refs = { host, trigger, closer, backdrop, panel, links, lastFocus: null };

function open() {
  refs.lastFocus = document.activeElement as HTMLElement;
  refs.host.setAttribute('data-open', '');
  document.documentElement.setAttribute('data-mobile-nav-open', '');
  refs.trigger.setAttribute('aria-expanded', 'true');
  requestAnimationFrame(() => refs.closer.focus());      // skip to close so next Tab → first link
}

function close() {
  refs.host.removeAttribute('data-open');
  document.documentElement.removeAttribute('data-mobile-nav-open');
  refs.trigger.setAttribute('aria-expanded', 'false');
  (refs.lastFocus ?? refs.trigger).focus();              // return focus
}

// Focus trap on Tab between [closer, ...links].
// Swipe-left to close: track touchstart X/Y, on touchend if Δx < -60 && |Δy| < 40 → close().
// Esc → close.
```

**Must-haves:**

- `aria-expanded` + `aria-controls` on the trigger.
- `role="dialog"` + `aria-modal="true"` + `aria-label` on the panel.
- Focus moves *into* the panel on open and back to the trigger on close.
- Body scroll locked (`html[data-…-open] { overflow: hidden }`) so the page underneath doesn't jiggle.
- All transitions disabled under `prefers-reduced-motion`.
- Close on backdrop tap AND on link tap (otherwise the user clicks a link and is left staring at the panel).

**Inline script in an Astro `.astro` file gotcha:** the project tsconfig is strict (`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`). Closures don't pick up `if (!x) return` narrowing on the outer `const x = querySelector(...)`. Bind once into a typed `Refs` object and reference `refs.x` inside callbacks. See the CLAUDE.md "Conventions discovered in build" entry on this.

**Don't:**

- Use `<dialog>` element — modal `<dialog>` insists on top-layer + native styling that's a fight to override.
- Animate `width` or `left` — they trigger layout. Use `transform: translateX()`.
- Trap focus to only the panel's links — include the close button, otherwise Shift+Tab from the first link traps on the link itself.
- Forget `inert` or focus-trap; one of them must keep focus contained.

Reference: `apps/web/src/components/MobileNav.astro` (wired into `Header.astro`).

---

## 27. Generating Drizzle migrations

**Goal:** add a column or table, generate the migration SQL, commit both. Should be a 30-second operation; in this repo it isn't, because drizzle-kit's CJS loader can't resolve our `.js` extension imports.

**Checklist:**

```bash
# 1. Edit the schema file under packages/db/src/schema/*.ts.
#    Keep `.js` extensions in imports — they're required at runtime.

# 2. Temporarily strip the .js suffixes so drizzle-kit's loader
#    can find the modules. This is the workaround documented in
#    CLAUDE.md "Conventions discovered in build."
cd packages/db/src/schema
for f in *.ts; do
  sed -i "s|from './\([a-z-]*\)\.js'|from './\1'|g" "$f"
done

# 3. Generate.
cd ../../..
DATABASE_URL=mysql://placeholder:placeholder@localhost:3306/zalvice \
  pnpm --filter @zalvice/db run generate

# 4. Inspect the generated migration. Look for unsafe drops, missing
#    indexes, NOT NULL on existing tables without a default.
cat packages/db/src/migrations/000N_*.sql

# 5. Restore .js extensions for the runtime.
cd packages/db/src/schema
for f in *.ts; do
  sed -i "s|from './\([a-zA-Z_-]*\)';|from './\1.js';|g" "$f"
done

# 6. Commit schema + migration in one commit.
```

**Why not just point drizzle-kit at the compiled JS:** we'd need a separate build step in the db package and a watcher during development. Not worth it for the once-per-feature cost of these `sed` runs. Revisit if/when we ship more than a couple of migrations per week.

**Things that go wrong:**
- Forgetting step 5 — `apps/api` typecheck breaks because NodeNext can't resolve extensionless imports. The `tsc --noEmit` error is explicit (`error TS2835: Relative import paths need explicit file extensions in ECMAScript imports`).
- Pointing `DATABASE_URL` at production. The reset script refuses prod-looking URLs but generate doesn't connect — still, scope your env vars.

## Adding new skills to this file

When a tricky pattern shows up in a PR and isn't documented here, add it. Each new section follows the same shape:

```
## N. Skill name

**Goal:** one sentence.

**Choice / why:** what we picked and why we didn't pick the alternatives.

**Pattern:** the actual code or steps.

**Traps:** the things that bit us.
```

Keep entries terse. If a section grows beyond ~200 lines, it probably wants its own doc under `/docs/`.
