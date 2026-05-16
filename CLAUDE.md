# CLAUDE.md

Operating guide for AI assistants (Claude Code, Cursor, Copilot, etc.) working in this repository.

Read this file first. It captures non-obvious conventions, hard rules, and "don't waste a turn on this" gotchas.

**Companion docs:** [`PRD.md`](./PRD.md) explains *what* to build. [`skills.md`](./skills.md) is the patterns playbook for *how*. This file is the rules layer that sits between them.

---

## Project at a glance

Zalvice.com — marketing & lead-gen website for a digital agency. Static-first, content-driven, mobile-first.

**Stack:**
- **Astro 4+** (hybrid: SSG marketing, SSR for `/admin` and `/api`)
- **Tailwind CSS** (utility-first, no custom CSS files except `globals.css`)
- **Fastify** (Node API for admin + form handling)
- **MySQL 8** + **Drizzle ORM**
- **TypeScript** everywhere — strict mode on
- **pnpm** workspaces (monorepo)

Full spec: see [`PRD.md`](./PRD.md). Implementation playbooks for each non-trivial feature: see [`skills.md`](./skills.md).

---

## Repo layout

```
/apps
  /web              # Astro site (public + admin)
    /src/pages      # File-based routes
    /src/components # Astro components (.astro)
    /src/islands    # Interactive components (React/Vue/Svelte)
    /src/layouts    # Shared layouts
    /src/lib        # Client + build-time helpers (cms adapter, analytics, seo)
    /src/styles     # globals.css. Tailwind config lives at root of /apps/web
    /src/content    # (if used) Astro content collections for static markdown
    /public         # Static assets served as-is (favicons, robots.txt source)
  /api              # Fastify server
    /src/routes     # Route handlers (one file per resource)
    /src/plugins    # Fastify plugins (auth, cors, rate-limit, csrf, sentry)
    /src/lib        # Server helpers (mailer, slack, storage, captcha)
    /src/jobs       # Background workers (scheduled publish, log sweep)
/packages
  /db               # Drizzle schema + migrations + seed scripts + queries
    /src/schema     # One file per table
    /src/queries    # Typed query helpers (shared between API + scripts)
    /src/migrations # Generated SQL — never hand-edit after commit
  /ui               # Shared component primitives (only if used by web AND api)
  /config           # Shared eslint, tsconfig, tailwind preset
/.github/workflows  # CI: lint, typecheck, test, lhci, deploy
/docker-compose.yml # Local MySQL + adminer
/.env.example       # Documents every required env var
```

**When in doubt about where a file goes:** put it in the closest leaf package and only hoist to `/packages` when a second consumer appears.

**Folder-level READMEs:** keep one in `/packages/db` (schema philosophy + migration workflow) and `/apps/api/src/plugins` (plugin order matters). Skip them elsewhere — the directory structure should be self-explanatory.

---

## Hard rules (do not break)

1. **No new dependencies without checking first.** Run `pnpm why <pkg>` and check if an existing dep already covers it. Prefer the boring choice. Justify additions in the PR description.
2. **No client JS on marketing pages unless wrapped as an Astro island.** A static page that ships 200KB of JS is a bug.
3. **No hardcoded copy or numbers on the homepage.** All stats, logos, testimonials come from MySQL via the `/api/cms/*` endpoints (or build-time fetch). The "100+ companies" line reads from the `stats` table.
4. **Mobile-first Tailwind.** Default classes target ≤375px. Use `sm:`, `md:`, `lg:` to scale up. Never the reverse.
5. **No inline color hex values.** Use Tailwind tokens defined in `tailwind.config.ts` (see Design Tokens below). If a needed color isn't a token, it shouldn't be in the design.
6. **No images without `alt`.** Decorative images use `alt=""`. The admin enforces this on upload.
7. **No raw SQL in app code.** All DB access goes through Drizzle. If a query is too complex for Drizzle, write it in `/packages/db/src/queries/*` and export a typed function.
8. **Never commit secrets.** `.env.local` is gitignored. Use `.env.example` for documenting required vars. **Adding a new env var?** Update `.env.example` in the *same commit*.
9. **All forms must have:** client validation, server validation (matching Zod schema), CSRF protection, rate limiting, and a honeypot. Skip any of these = security review failure.
10. **Respect `prefers-reduced-motion`.** Every animation must check this.
11. **No `console.log` in committed code.** Use the logger (`pino` on the server, `lib/log.ts` on the client which compiles to a no-op in production).
12. **No `any`, no `// @ts-ignore`.** Use `unknown` and narrow, or `// @ts-expect-error` with a comment explaining the upstream bug.
13. **One Astro `<h1>` per page.** Lighthouse a11y depends on this.
14. **Don't query the DB from Astro frontmatter directly** — always go through `/api/cms/*`. Reason: blast-radius and rule centralization, [`skills.md` §2](./skills.md#2-content-pipeline) explains why.
15. **Don't commit AI-generated marketing copy without human review.** Code is fine; visitor-facing words are not.

---

## Design tokens

Defined in `/apps/web/tailwind.config.ts` — use the token names, not raw hex.

```ts
colors: {
  brand:   '#1E5FFF',  // bg-brand / text-brand — primary CTAs, links
  navy:    '#0A2540',  // dark surfaces, headlines on light
  ink:     '#0A0A0A',  // body text
  paper:   '#FFFFFF',  // default background
  mist:    '#F5F7FB',  // section alt, cards
  line:    '#E1E6EF',  // borders, dividers
  muted:   '#6B7280',  // captions, helper text
  danger:  '#DC2626',  // form errors, destructive actions (admin only)
  success: '#059669',  // saved/ok indicators (admin only)
}
```

Public pages use only the first 7 tokens. `danger` and `success` are reserved for form-error and admin surfaces.

**Typography:**
- Font family: `Inter` (self-hosted, subset latin + latin-ext)
- Monospace accents: `JetBrains Mono`
- Display sizes use `clamp()` for fluid scaling — see `globals.css`

**Spacing:** Tailwind default. Section padding rhythm: `py-16 md:py-24 lg:py-32`.

**Corner radius:** `rounded-lg` (cards), `rounded-xl` (large surfaces), `rounded-full` (pills).

**Icons:** Use `lucide-astro` (or `lucide-react` in islands). Import per-icon — never the whole package.

```astro
---
import { ArrowRight } from 'lucide-astro';
---
<ArrowRight class="h-4 w-4" />
```

---

## Code conventions

### TypeScript

- `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`.
- Prefer `type` over `interface` unless you need declaration merging.
- No `any`. If you genuinely need it, use `unknown` and narrow.
- Co-locate types with the code that owns them. Only put in `/packages/db/types` if shared.
- Prefer **discriminated unions** for state (`{status: 'idle'} | {status: 'success', data: T} | ...`) over multiple booleans.
- Don't export types you only use internally. Don't `export *` from barrel files.

### Astro components

- File extension `.astro` for static / server-rendered. Use frontmatter for data fetching.
- Props typed with `interface Props` (Astro convention — this is the one exception to the "prefer type" rule).
- Pass data down; never reach for global state in components.

```astro
---
interface Props {
  title: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}
const { title, href, variant = 'primary' } = Astro.props;
---
```

### Islands (interactive components)

- Default to **React** islands (most familiar to the team). Only reach for Svelte/Vue if a specific library demands it.
- Hydration directive: prefer `client:visible` over `client:load`. Marketing pages should rarely need `client:load`.
- Keep islands small. If a component is mostly static with one button, the button is the island — not the whole component.
- No island may exceed 15KB gzip on its own. CI fails the build if it does.

### Fastify routes

- One file per resource: `/api/src/routes/leads.ts`, `/api/src/routes/posts.ts`.
- Every route declares a Zod schema for body + querystring + response.
- Errors thrown as `fastify.httpErrors.*` — don't return ad-hoc JSON error shapes.
- All routes are async and return the body; don't call `reply.send()` directly unless you need to set status + body manually.
- Plugin registration order: `sensible → sentry → cors → helmet → rateLimit → csrf → cookies → session → routes`. Wrong order = bugs that only show up under load.

```ts
fastify.post('/api/leads', {
  schema: { body: LeadSchema, response: { 201: LeadResponseSchema } },
}, async (req, reply) => { /* ... */ });
```

### Drizzle

- Schema lives in `/packages/db/src/schema/*.ts`, one file per table.
- Migrations generated with `drizzle-kit generate` — never hand-edit migration SQL after it's committed.
- Read helpers in `/packages/db/src/queries/`. Don't write queries inline in route handlers if the same query appears more than once.
- **Migration safety:** see [`skills.md` §14](./skills.md#14-database-migration-safety). Tl;dr: additive-first, two-phase for renames, never destructive in one deploy.

### Error handling

- **Boundaries are explicit.** Code only `try/catch` where it can recover or add context. Otherwise let it throw and the framework error handler logs it.
- **Server errors:** Fastify error handler converts thrown errors to JSON. `fastify.httpErrors.badRequest(msg)` for 400s; for 500s, just throw.
- **Client errors (islands):** wrap async actions in a single try/catch at the call site; surface user-facing messages via the toast/state — never `alert()`.
- **Don't swallow errors.** No empty catch blocks, no `.catch(() => {})`. If you genuinely want to ignore, add a `// reason: …` comment.

### Logging

- Server: `pino` via `req.log` (per-request child logger with `reqId`). Levels: `trace/debug/info/warn/error/fatal`. Default prod level `info`.
- Auto-redact: `email`, `password`, `phone`, `ip`, `Authorization` header, `cookie` header — configured in the pino instance.
- Client: `lib/log.ts` is a thin wrapper that no-ops in prod and prints in dev. Use it instead of `console.*`.

---

## File naming

- **Components:** `PascalCase.astro` / `PascalCase.tsx`.
- **Routes (Astro):** `kebab-case.astro` (the URL is the filename).
- **Routes (Fastify):** `kebab-case.ts`.
- **Utilities:** `kebab-case.ts`.
- **Types:** `kebab-case.types.ts` or co-located.
- **Tests:** `<filename>.test.ts` next to the file (unit), `e2e/<feature>.spec.ts` for Playwright.
- **Migrations:** generated, format `NNNN_snake_case.sql` — don't rename.
- **Env files:** `.env.local` (gitignored), `.env.example` (committed), `.env.test` (committed, no secrets).

---

## Git & PR conventions

### Branches

- `main` — protected, always deployable.
- `staging` — auto-deploys to staging.
- Feature branches: `<initials>/<short-slug>` (e.g. `mrz/contact-form-honeypot`). Lowercase, kebab-case.
- Bugfix: `fix/<short-slug>`. Hotfix: `hotfix/<short-slug>` (branches from `main`, merges back to `main` and `staging`).

### Commits

- **Conventional Commits.** Format: `<type>(<scope>): <summary>`.
- Types: `feat`, `fix`, `refactor`, `perf`, `docs`, `chore`, `test`, `build`, `ci`.
- Scope is optional but encouraged — usually the package (`web`, `api`, `db`) or feature area (`contact`, `auth`).
- Summary is imperative, ≤72 chars, no trailing period.
- Examples:
  - `feat(contact): add Turnstile token validation`
  - `fix(api): rate-limit /api/leads per IP+email`
  - `refactor(db): extract project-with-images query helper`

### Pull requests

- One reviewer minimum; security-touching changes (`/api/auth/*`, `/api/admin/*`, anything in `/packages/db/src/schema`) require two.
- PR title = top-level conventional commit message. PR body uses the template (see `.github/PULL_REQUEST_TEMPLATE.md` once it exists).
- Keep PRs ≤ 400 lines of diff when possible. Split large refactors.
- All PRs must pass: lint, typecheck, unit tests, e2e smoke, Lighthouse CI.
- Don't merge your own PR unless reviewer leaves an explicit "merge when ready" comment.

---

## Workflows

### First-time setup

```bash
pnpm install
cp .env.example .env.local        # fill in DB creds, etc.
docker compose up -d mysql        # local MySQL on :3306
pnpm db:migrate                   # run Drizzle migrations
pnpm db:seed                      # populate with sample data
pnpm dev                          # starts web + api in parallel
```

### Common commands

| Command | What it does |
|---|---|
| `pnpm dev` | Start web (`:4321`) + api (`:3000`) with HMR |
| `pnpm build` | Production build of all apps |
| `pnpm lint` | ESLint across the workspace |
| `pnpm lint:fix` | ESLint with `--fix` |
| `pnpm format` | Prettier write |
| `pnpm typecheck` | `tsc --noEmit` across all packages |
| `pnpm test` | Run Vitest |
| `pnpm test:watch` | Vitest in watch mode |
| `pnpm test:e2e` | Run Playwright |
| `pnpm lhci` | Lighthouse CI locally (matches CI gate) |
| `pnpm db:migrate` | Apply pending migrations |
| `pnpm db:generate` | Generate migration from schema diff |
| `pnpm db:seed` | Seed local DB with fixture data |
| `pnpm db:reset` | Drop, migrate, seed (local only — refuses on prod URL) |
| `pnpm db:studio` | Open Drizzle Studio |

### Before opening a PR

1. `pnpm lint && pnpm typecheck && pnpm test` all green.
2. New content surfaces have alt-text, semantic landmarks, keyboard support.
3. New routes/components have at least one test (unit OR e2e, not both required).
4. If touching the DB schema: migration committed alongside the code.
5. If adding a new env var: `.env.example` updated in the same commit.
6. If adding a new dependency: justification in PR description, `pnpm why` output showing it's not already covered.
7. If adding a new island: bundle size measured (`pnpm build` and check the per-island gzip).

### Testing patterns (don't skip)

Per the testing pyramid: **many** unit tests, **some** integration tests, **a few** e2e tests.

- **Unit (Vitest):** pure functions, schema validators, markdown transforms. Fast, no I/O.
- **Integration (Vitest):** API route handlers against a real MySQL (docker-compose). Don't mock the DB — see [`skills.md` §15](./skills.md#15-testing-strategy).
- **E2E (Playwright):** happy paths only — contact form submit, blog post navigation, admin login, project detail render. Run against a staging-like build.
- **Visual (Playwright + screenshot diff):** homepage, project detail at 3 viewports. Diff threshold 0.1%.
- **Accessibility:** axe-core in every e2e test; fails on serious/critical violations.

Coverage gate: 70% lines on `/packages/db/src/queries`, `/apps/api/src/routes`, `/apps/api/src/lib`. No coverage gate on Astro components (visual + e2e are the real signal).

---

## Performance gates (CI enforces these)

| Page | Max JS (gzip) | LCP target |
|---|---|---|
| Home | 50 KB | ≤ 2.5s |
| Services / About | 30 KB | ≤ 2.0s |
| Blog index / post | 40 KB | ≤ 2.5s |
| Work index / detail | 60 KB | ≤ 2.5s |

Lighthouse CI runs on every PR. **Performance ≥ 90** and **Accessibility ≥ 95** are required to merge. Per-island bundle size measured; a single island over 15KB gzip fails the build.

---

## Accessibility checklist (run mentally before every PR)

- [ ] Heading hierarchy is sequential (no `h2` followed by `h4`).
- [ ] Every interactive element is reachable by `Tab` and has a visible focus ring.
- [ ] Icon-only buttons have `aria-label`.
- [ ] Images have `alt` (decorative = `alt=""`).
- [ ] Color contrast ≥ 4.5:1 for body text.
- [ ] Form errors are announced (`aria-live`) and tied to fields with `aria-describedby`.
- [ ] No motion that ignores `prefers-reduced-motion`.
- [ ] Page works with JavaScript disabled (degrades gracefully — no blank screens).
- [ ] One H1 per page.

---

## Security checklist (admin & API only)

- [ ] All admin routes behind session middleware.
- [ ] All POST/PATCH/DELETE checked for CSRF token.
- [ ] All input validated by Zod schema on the server (don't trust client validation).
- [ ] Rate limit per IP on `/api/leads` and `/api/auth/*`.
- [ ] No PII in logs (mask email, never log password attempts).
- [ ] Uploads validated for MIME + size + dimensions before persisting.
- [ ] New env var consumed via the typed `env` helper, not `process.env.X` directly.
- [ ] Any new third-party script audited for cookies; if it sets one, privacy notice updated.

---

## "I'm about to do X — should I?" quick lookup

| Tempted to... | Don't, do this instead |
|---|---|
| Add a global CSS file | Use Tailwind. Add to `globals.css` only for `@layer base` resets. |
| Use a UI kit (MUI, Chakra) | We're handrolling. Tailwind + Lucide is enough. |
| Add a state library (Redux, Zustand) | Marketing site doesn't need it. Use `useState` / URL params in islands. |
| Write raw SQL | Use Drizzle. If too complex, helper in `/packages/db/src/queries`. |
| Add `client:load` | Try `client:visible` first. Most things don't need to hydrate immediately. |
| Use `<img>` directly | Use Astro's `<Image>` component for responsive + lazy + format conversion. |
| Hardcode a client name | Pull from the `clients` table. Even logos shown on the home page. |
| Add a new env var without documenting | Update `.env.example` in the same commit. |
| Use `process.env.X` in app code | Import from `lib/env.ts` (typed, validated at boot). |
| `console.log` something | Use `req.log` (server) or `lib/log.ts` (client). |
| Add `any` to make TS happy | Use `unknown` and narrow, or fix the upstream type. |
| Rename a DB column in one migration | Two-phase: add new, backfill, switch reads, drop old. See [`skills.md` §14](./skills.md#14-database-migration-safety). |
| Embed a YouTube iframe directly | Use the embed remark plugin so we get `loading="lazy"` and no CLS. |
| Add a `useEffect` that fetches on mount | First ask: can this be SSG'd? Then: can it be a `client:visible` island that fetches once? |
| `alert()` an error | Toast component or inline error state. Never `alert()`. |
| Use Tailwind arbitrary values like `text-[#1E5FFF]` | Use the named token: `text-brand`. |
| Disable a lint rule inline | Fix the code or surface the rule for repo-wide change in a PR. |
| `git push --force` to a shared branch | Don't. Force only ever to your own feature branch with `--force-with-lease`. |
| Commit a `WIP` or "fix later" comment | Open an issue. Comments rot; issues get triaged. |

---

## When you're stuck

1. Check the PRD section that owns the feature (see [`PRD.md`](./PRD.md) §5 for page specs, §6 for data model, §8 for stack rationale).
2. Check [`skills.md`](./skills.md) — there's probably a playbook for the pattern you're about to invent.
3. Look for existing patterns — most features have a precedent in the repo.
4. Ask the human. Don't invent a convention; surface the question.

---

## What this file is not

- Not a tutorial on Astro/Fastify/Tailwind — assume baseline familiarity.
- Not a replacement for the PRD — it explains *how* to build, not *what* to build.
- Not exhaustive — when a convention emerges in code review, add it here.
- Not a fight with [`skills.md`](./skills.md). This file says "do X." `skills.md` says "here's how to do X well." If they disagree, fix one of them in the same PR.
