# Zalvice.com — Product Requirements Document

**Project:** Zalvice.com marketing & lead-generation website
**Version:** 1.1
**Status:** Draft for review
**Last updated:** May 2026

| Field | Value |
|---|---|
| **Primary goal** | Convert visitors into qualified leads via contact / discovery-call requests |
| **Stack** | Astro · Fastify · MySQL · Tailwind CSS |
| **Design system** | Blue / black / white · Helvetica-alternative typeface · mobile-first |
| **Target launch** | 8 weeks from kickoff (MVP) |
| **Companion docs** | [`CLAUDE.md`](./CLAUDE.md) (operating rules) · [`skills.md`](./skills.md) (implementation playbooks) |

---

## 1. Executive Summary

Zalvice is a digital agency that delivers end-to-end product engineering — design, development, infrastructure, and ongoing support — to companies that need a reliable partner to build the systems their business depends on. The current public surface does not reflect the maturity of the work or the breadth of the team. This document defines the requirements for a new marketing website that positions Zalvice as a credible engineering partner, generates qualified inbound leads, and provides a publishing platform for ongoing case studies and technical content.

### Positioning, unpacked

The masthead — _"From blueprint to production — we engineer the systems companies rely on"_ — is doing three jobs at once, and each one should be reinforced visually and structurally throughout the site:

- **"Blueprint to production"** — Zalvice is not a single-skill shop. We own the lifecycle: discovery → design → build → ship → operate. The website should make this lifecycle legible at a glance.
- **"Engineer"** — the word signals discipline, repeatability, and engineering rigor, not just creative output. Visual language should lean technical (blueprints, system diagrams, monospaced accents) rather than purely decorative.
- **"Systems companies rely on"** — emphasis on reliability and longevity. This is where ongoing support, SLAs, and 100+ client proof points carry the most weight.

Supporting line: _"Design, development, infrastructure, and ongoing support — one integrated team that has helped 100+ companies transform how they operate."_ The four nouns (design / development / infrastructure / support) map directly to the four service pillars used throughout the site information architecture.

### What this document is, and is not

- **Is:** the source of truth for *what* gets built and *why*. Page-by-page specs, data model, success metrics.
- **Is not:** an implementation guide. *How* to build each piece — folder layout, library choices, code patterns — lives in [`CLAUDE.md`](./CLAUDE.md) (rules) and [`skills.md`](./skills.md) (playbooks).
- **Conflicts:** if this PRD and a code convention disagree, the PRD wins on **what to ship**; CLAUDE.md wins on **how to write it**. Flag the conflict so we update both.

---

## 2. Goals & Success Metrics

### Business goals

- Generate qualified leads from companies evaluating a development or modernization partner.
- Build credibility through visible proof — client logos, case studies, project showcase, and recent writing.
- Provide a content surface that the team can update weekly without engineering involvement.
- Support general-market discovery — the site should make sense to a visitor who has no prior context about Zalvice.

### Measurable success criteria (first 6 months post-launch)

| Metric | Target | How measured |
|---|---|---|
| Qualified contact-form submissions / month | ≥ 20 | `leads.status = 'qualified'` count, monthly |
| Avg. time on case-study pages | ≥ 2 min | Plausible / Umami "time on page" |
| Bounce rate on homepage (mobile) | < 45% | Plausible / Umami, mobile segment |
| Lighthouse performance (mobile) | ≥ 90 | Lighthouse CI on `/`, `/services`, `/work/[slug]`, `/blog/[slug]` |
| Lighthouse accessibility | ≥ 95 | Lighthouse CI on every PR |
| Blog posts published / month | ≥ 2 | `posts.published_at` count |
| Showcase entries added / month | ≥ 1 | `projects.published_at` count |
| Form-start → form-submit conversion | ≥ 35% | `form_start` → `form_submit` Plausible funnel |
| Search index freshness (blog) | ≤ 5 min after publish | Webhook rebuild latency |

**Reporting cadence:** monthly review against this table; if a metric is red for two months in a row, raise as an explicit roadmap item.

### Non-goals (out of scope for v1)

- Client portal, project dashboards, or any authenticated client area.
- E-commerce, paid checkout, or subscription billing on the site.
- Multi-language / full i18n — English-only at launch, with structure that allows i18n later (see §13.6 for the planned shape).
- In-house chat or support widget — a third-party (e.g. Crisp / Intercom) can be embedded if needed.
- Public comments on blog posts.
- User accounts of any kind for visitors.

---

## 3. Target Audiences

The site must speak credibly to three distinct visitor types arriving from search, referrals, and content.

| Audience | What they're trying to answer | What they look for first | Where they tend to convert |
|---|---|---|---|
| Founder / CTO at a growing company | Can this team actually ship the system I need, on time? | Case studies, stack credibility, team depth, response time | Project detail → Contact |
| Enterprise PM / Procurement | Are they a real company we can contract with? | About page, client logos, location, contact, formal services list | About → Services FAQ → Contact |
| Engineering lead evaluating a partner | Do they know what they're doing technically? | Blog technical depth, project details, infrastructure section | Blog post → Project detail → Contact |

### Persona implications for the design

- **Founder / CTO** is mobile-heavy and time-poor → the homepage must communicate the offer in the first viewport.
- **Procurement** wants formal artifacts → Services page must include explicit engagement models, IP terms, and an exportable PDF capabilities deck (post-v1).
- **Engineering lead** judges from technical signal → blog code samples must look right (Shiki + correct theme), project pages must list real tech stacks, no marketing fluff.

---

## 4. Information Architecture

### Top-level navigation

- **Home** — `/`
- **Services** — `/services` (sections: Design · Development · Infrastructure · Support)
- **Work** — `/work` (showcase index)
  - Project detail — `/work/[slug]`
- **Blog** — `/blog` (article index)
  - Article detail — `/blog/[slug]`
  - Category — `/blog/category/[slug]`
  - Author — `/blog/author/[slug]` (post-v1)
- **About** — `/about` (team, story, clients, locations)
- **Contact** — `/contact` (form + calendar booking link)

Utility pages (no nav): `/privacy`, `/terms`, `/404`, `/500`, `/sitemap.xml`, `/sitemap-index.xml`, `/rss.xml`, `/robots.txt`.

### Header behavior

- **Mobile (<768px):** logo left, hamburger right. Sheet menu slides down (full-width), traps focus, closes on `Esc` or route change.
- **Desktop (≥768px):** logo left, inline nav center/right, primary CTA "Start a project" rightmost.
- **Sticky:** header is sticky with a translucent backdrop on scroll. Hide on scroll-down past 200px, reveal on scroll-up (only when JS is hydrated; default is plain sticky).

### Footer architecture

- **Column 1:** brand + one-line positioning + social links (LinkedIn, GitHub, X)
- **Column 2:** Services links (Design / Development / Infrastructure / Support anchors)
- **Column 3:** Company links (About, Work, Blog, Contact, Privacy, Terms)
- **Column 4:** Get in touch (email, primary location, "Start a project" CTA, RSS link)
- **Bottom strip:** © Zalvice, build hash (small, monospaced — useful for support and ops)

### URL conventions

- Lowercase, kebab-case, no trailing slash.
- Tags/categories use their `slug`, never the display name.
- Pagination: `?page=2` query param, not `/page/2/` path segment (simpler with SSG + filters).
- Filters use stable query keys: `?service=design&industry=fintech&tech=postgres`.

### Empty / error states (must all exist)

- `/work` with all filters → empty: "No projects match these filters" + reset button.
- `/blog` with search yielding 0 results: empty + suggestion of recent posts.
- 404: friendly copy, top navigation preserved, search box for blog, link home.
- 500: minimal page (no DB calls), apology, link to status page if/when we have one.

---

## 5. Page-by-Page Requirements

### 5.1 Homepage

Single scroll narrative. Each section should stand alone as a tappable, mobile-first block, but the order is intentional: lead with the promise, prove it, explain it, prove it again, ask for the meeting.

**H1 — Masthead**
- Headline: "From blueprint to production — we engineer the systems companies rely on."
- Subhead: full supporting sentence from the brief (Design, development, infrastructure…).
- Primary CTA: "Start a project" → `/contact`. Secondary CTA: "See our work" → `/work`.
- Visual treatment: animated technical motif (subtle blueprint grid, system diagram, or terminal-style accent) — not stock photography. Motion respects `prefers-reduced-motion`.
- Logo strip directly underneath: 6–10 client logos, monochrome, with a one-line lead-in: "Trusted by 100+ companies." Count is read from `stats.companies_served`, not hardcoded.

**H2 — Services overview**
- Four-card grid (stacks to 1 column on mobile): Design · Development · Infrastructure · Support.
- Each card: icon, name, one-line description, 3 capability tags, link to the corresponding services section (`/services#design` etc.).

**H3 — Featured work carousel**
- 3–5 featured projects pulled from the showcase, ordered by `featured_order`.
- Carousel behavior: swipe on mobile, arrow + dot nav on desktop, autoplay disabled by default for accessibility.
- Each slide: hero image, client name, one-line outcome (e.g. "Cut deploy time from 40 min to 90 sec"), tech tags, link to detail page.
- **Empty state:** if no featured projects exist, hide the section entirely (don't render an empty carousel).

**H4 — How we work**
- Four-step process: Discover → Design → Build → Operate. Visualized as a horizontal blueprint-style timeline on desktop; vertical stepper on mobile.
- Each step: name, one-sentence description, typical duration (e.g. "1–2 weeks").

**H5 — Numbers / proof**
- Stat row: 100+ companies served · years in operation · projects shipped · countries reached. Numbers must be source-of-truth from the CMS (`stats` table), not hardcoded, so they stay accurate.
- Layout: 4 columns desktop, 2×2 mobile.

**H6 — Testimonials**
- 3 testimonials with name, role, company, photo, and the project they reference (link to case study).
- **Empty state:** show 0 testimonials rather than placeholders. If fewer than 3, render 1 or 2 centered.

**H7 — Latest writing**
- 3 most recent blog posts: cover image, title, category, read time, date.
- **Empty state:** hide the section if no published posts.

**H8 — Final CTA**
- Full-width block: "Have a system to build?" + project-start CTA + calendar booking link.

**Tracking events fired from this page:** `cta_click` (masthead × 2, final), `view_section` (H3/H4/H5), `read_complete_homepage` (user scrolled to footer).

### 5.2 Services page

One long-form page (not four sub-pages) so a visitor can grasp the full offering in one read. Anchor links at top jump to each pillar.

- Per pillar (Design / Development / Infrastructure / Support): overview paragraph, capabilities list (6–10 items), typical engagement model (fixed-scope / retainer / staff aug), and 1–2 linked case studies.
- Cross-pillar callout: "One integrated team" — emphasizing that Zalvice delivers the four pillars together, not as separate quotes.
- FAQ block at the bottom (6–8 questions) — addresses sales objections (pricing model, team size, location, IP ownership, NDAs, ongoing support terms, response time).
- Sticky pillar nav on desktop (left rail) that scroll-spies the current section.

**Tracking events:** `service_pillar_view` (each), `faq_open`, `cta_click` (each pillar's "Talk to us about [pillar]").

### 5.3 Work index — `/work`

- Grid of project cards (3 cols desktop, 2 tablet, 1 mobile).
- Filters: by service pillar, by industry, by tech tag. Filters update the URL query string for shareable filtered views.
- Each card: cover image, client, project title, 2–3 tags, year.
- Pagination: 12 per page, server-rendered.
- **Empty state:** see §4.
- **Sort:** default newest-first. Optional "Featured first" toggle.

### 5.4 Project detail — `/work/[slug]`

This page must do the heavy lifting of converting an evaluator into a lead. Treat it like a case study, not a portfolio entry.

- **Hero:** client logo, project title, one-line outcome, date, services delivered.
- **Context block:** client background, the problem, why they came to us.
- **Approach block:** what we did, broken down by service pillar.
- **Image carousel:** 4–10 screenshots / diagrams / photos with captions.
- **Outcome block:** measurable results (metrics, before/after), client quote.
- **Tech stack list:** badges for languages, frameworks, infra.
- **Team & timeline:** team size, roles, duration.
- **Related projects:** 3 projects sharing a tag or service pillar.
- **Next project + CTA at the bottom:** "Have something similar in mind?" → `/contact`.
- **Structured data:** `CreativeWork` JSON-LD with `creator: Organization(Zalvice)`.

**Tracking events:** `scroll_75` (with `slug`), `cta_click` (footer CTA), `case_study_image_open` (carousel image click).

### 5.5 Blog index — `/blog`

- Featured post at the top (full-width card). Marked via `posts.featured = true`; if multiple, newest wins.
- Grid of recent posts below (3 cols desktop), with category filter and search.
- Categories at minimum: Engineering, Design, Infrastructure, Case Notes, Company.
- Pagination: 12 per page.
- RSS feed at `/rss.xml`, JSON feed optional.
- **Search:** Pagefind (client-side, see [`skills.md` §8](./skills.md#8-search--pagefind)). Empty state shows recent posts.

### 5.6 Article detail — `/blog/[slug]`

- **Article header:** title, author (with avatar + role), publish date, est. read time, category, cover image.
- **Body:** rich content from CMS — must support headings, code blocks with syntax highlighting, images with captions, callouts (info/warning/danger), and embeds (YouTube, CodeSandbox, Figma, Loom).
- **Table of contents** (auto-generated from H2/H3) — sticky on desktop, collapsed on mobile.
- **End-of-article:** author bio, related posts (3 — by category + tag overlap), share buttons (X, LinkedIn, copy link), comments off for v1.
- **Reading progress bar** at top (hydrated island, hidden if reduced-motion).
- **Print stylesheet:** clean print layout — strip nav, footer, share buttons.

**Tracking events:** `read_complete` (≥30s on page AND scrolled past article end), `code_copy` (per language).

### 5.7 About page

- Story block: who we are, founding context, mission.
- Team grid: photos, names, roles, optional one-liner. Filter by team (Design / Engineering / Infra / Ops).
- Clients grid: full logo wall (all 100+, monochrome). Lazy-loaded.
- Locations & contact info (cards with address + map link).
- Optional: timeline of company milestones.

### 5.8 Contact page

- **Form fields (all required unless noted):**
  - `name` (text, 2–100 chars)
  - `email` (work email, validated)
  - `company` (text, ≤200 chars; optional)
  - `phone` (text, ≤40 chars; optional)
  - `projectType` (select: Design / Development / Infrastructure / Support / Other)
  - `budgetRange` (select: Under $25k / $25k–$75k / $75k–$200k / $200k+ / Not sure)
  - `timeline` (select: ASAP / 1–3 months / 3–6 months / Exploring; optional)
  - `message` (textarea, 20–5000 chars)
  - `howHeard` (text, ≤200 chars; optional)
  - **Hidden:** `website` honeypot, UTM params, Turnstile token
- **Inline validation:** validate on blur; surface errors below each field with `aria-describedby`. Submit button stays enabled — submitting an invalid form focuses the first error.
- **Submission flow:** POST → Fastify endpoint → persist to MySQL `leads` table → email notification to sales inbox → Slack `#sales` webhook → confirmation email to submitter → render thank-you state in-page (no redirect).
- **Thank-you state:** confirms submission, restates next steps ("we reply within one business day"), offers calendar booking link, and a "back to home" link.
- **Error state:** if the API is down, render a fallback message with the email address and a `mailto:` link so the user is never stranded.
- **Alongside the form:** direct email, calendar booking link (Cal.com), office locations.

**Tracking events:** `form_start`, `form_field_error`, `form_submit` (with `projectType`, `budgetRange`), `form_submit_fail`.

### 5.9 Utility pages

- **/404 and /500:** see §4.
- **/privacy:** owned by legal; the dev sets up the page shell and rich-text rendering. Last updated date displayed.
- **/terms:** same as above.
- **/sitemap.xml & /sitemap-index.xml:** auto-generated.
- **/robots.txt:** see [`skills.md` §9](./skills.md#9-seo).
- **/rss.xml:** generated from `posts.status = 'published'`.

---

## 6. Content Model

All editable content lives in MySQL behind a lightweight admin. Astro reads via the Fastify API at build time (and at request time for SSR pages that need freshness). The team must be able to publish a blog post or showcase entry without a deploy.

### Entities (MySQL tables)

| Entity | Key fields |
|---|---|
| `posts` | id, slug (unique), title, excerpt, body_md, cover_image_id, category_id, author_id, status (draft/scheduled/published/archived), published_at, scheduled_for, created_at, updated_at, seo_title, seo_description, og_image_id, featured (bool), tags (json array of slugs), reading_minutes (int, computed) |
| `projects` | id, slug (unique), client_name, title, summary, body_md, hero_image_id, year, industry, featured (bool), featured_order (int), services (json array of pillar slugs), tech_stack (json array of strings), outcomes (json array of `{label, value, unit}`), team_size, duration_months, status (draft/published/archived), published_at, seo_title, seo_description, og_image_id |
| `project_images` | id, project_id, image_id, caption, sort_order |
| `services` | id, slug (unique), name, pillar (design/dev/infra/support), description, capabilities (json), icon (lucide name), engagement_model (text), sort_order |
| `clients` | id, name, logo_image_id, website, industry, featured (bool), sort_order, consent_to_display (bool, default false) |
| `testimonials` | id, quote, author_name, author_role, author_company, author_photo_id, project_id (nullable), featured, published (bool) |
| `team_members` | id, name, role, team (design/eng/infra/ops), bio, photo_id, social_links (json), sort_order, active (bool) |
| `authors` | id, name, slug (unique), role, bio, photo_id, social_links (json) |
| `categories` | id, slug (unique), name, description |
| `media` | id, filename, url, alt_text (not null), width, height, mime_type, bytes, uploaded_by, uploaded_at, focal_x (0–1), focal_y (0–1) |
| `leads` | id, name, email, company, phone, project_type, budget_range, timeline, message, how_heard, source, ip, user_agent, utm (json), referer, created_at, status (new/qualified/contacted/won/lost), notes (text), assigned_to (admin_user_id) |
| `admin_users` | id, email (unique), password_hash, role (admin/editor), name, created_at, last_login, totp_secret (nullable), disabled (bool) |
| `user_sessions` | id, user_id, expires_at, created_at, ip, user_agent |
| `login_attempts` | id, email, ip, success (bool), created_at |
| `stats` | id, key (unique, e.g. `companies_served`), value (number), label, suffix (e.g. `+`), sort_order |
| `audit_log` | id, actor_user_id, action, entity, entity_id, before (json), after (json), created_at |

### Relationships (must enforce at DB level)

- `posts.author_id` → `authors.id` (RESTRICT)
- `posts.category_id` → `categories.id` (RESTRICT)
- `posts.cover_image_id` / `posts.og_image_id` → `media.id` (SET NULL)
- `projects.hero_image_id` / `projects.og_image_id` → `media.id` (SET NULL)
- `project_images.project_id` → `projects.id` (CASCADE)
- `project_images.image_id` → `media.id` (CASCADE)
- `testimonials.project_id` → `projects.id` (SET NULL)
- `clients.logo_image_id` → `media.id` (SET NULL)
- `team_members.photo_id` / `authors.photo_id` → `media.id` (SET NULL)
- `user_sessions.user_id` → `admin_users.id` (CASCADE)
- `leads.assigned_to` → `admin_users.id` (SET NULL)

### Indexes (must exist before launch)

- `posts(status, published_at DESC)` — index for "latest published" queries.
- `posts(slug)` unique — single-post lookup.
- `posts(category_id, status, published_at DESC)` — category index.
- `projects(status, featured, featured_order)` — featured carousel.
- `projects(slug)` unique.
- `leads(created_at DESC)`, `leads(status, created_at DESC)`.
- `user_sessions(expires_at)` — for sweep job.
- `login_attempts(email, created_at DESC)`, `login_attempts(ip, created_at DESC)`.

### Field-level validation rules (server-enforced)

- `slug`: lowercase, kebab-case, `^[a-z0-9]+(-[a-z0-9]+)*$`, length 2–80.
- `media.alt_text`: required (`NOT NULL`); the admin will not save without it.
- `posts.body_md`: max 100,000 chars.
- `projects.outcomes`: array of `{label, value, unit?}`, max 6 entries.
- `leads.message`: 20–5000 chars (matches the form schema in [`skills.md` §5](./skills.md#5-contact-form-lifecycle)).
- `clients.consent_to_display`: must be `true` for a client logo to appear in any public surface. The query layer filters on this — the admin shows a warning if false.

### Admin requirements

- Auth-protected admin UI at `/admin` (separate Astro section, SSR, session cookies).
- CRUD for all content entities above.
- Markdown editor with live preview for `body_md` fields (CodeMirror + remark preview).
- Media library with drag-drop upload, alt-text required before save, focal-point picker for hero crops.
- Draft / scheduled / published workflow:
  - **Draft:** invisible publicly, editable.
  - **Scheduled:** `scheduled_for` in future; a worker promotes to `published` and triggers rebuild.
  - **Published:** visible.
  - **Archived:** hidden, kept for audit.
- Soft-delete (status=archived) — never hard-delete published content via the UI.
- Two roles for v1: **Admin** (full access) and **Editor** (content only, no user management, no `clients.consent_to_display` toggle).
- **Audit log:** every create/update/delete on content entities writes to `audit_log` with `before`/`after` JSON.
- **CSV export:** leads, blog post analytics rollup, project view counts.

> **Note:** if a fully custom admin is too much for v1, a viable alternative is using a headless CMS layer (Decap CMS or Directus pointed at the same MySQL) — call this out in the technical spike before implementation. See §13.1.

---

## 7. Design System

### Color tokens

| Token | Hex | Use |
|---|---|---|
| Brand / Blue | `#1E5FFF` | Primary CTAs, links, accents |
| Navy | `#0A2540` | Headlines, dark surfaces, footer |
| Ink / Black | `#0A0A0A` | Body text |
| Paper / White | `#FFFFFF` | Default background |
| Mist | `#F5F7FB` | Section alternation, cards |
| Line | `#E1E6EF` | Borders, dividers |
| Muted | `#6B7280` | Captions, helper text |
| Danger | `#DC2626` | Form errors, destructive actions (admin only) |
| Success | `#059669` | Success toasts, "Saved" indicators (admin only) |

Public-facing pages use only the first 7 tokens — danger/success only appear in admin and form-error states. No additional accent colors. Where a second accent is genuinely needed (e.g. category tags), tint or shade the brand blue.

**Contrast pairs that have been verified (≥ WCAG AA):**
- Ink on Paper: 19.5:1 (AAA)
- Paper on Navy: 14.8:1 (AAA)
- Brand on Paper: 5.2:1 (AA)
- Muted on Paper: 5.0:1 (AA)
- Muted on Mist: 4.7:1 (AA)
- Brand on Mist: must be tested per use — borderline.

### Typography

Helvetica-alternative: use **Inter** as the primary typeface (open-source, full weight range, near-identical metrics to Helvetica Neue, excellent screen rendering). Fallback stack: `Inter → Helvetica → Arial → sans-serif`.

- **Display / H1:** Inter 700, fluid `clamp(40px, 6vw, 72px)`, tight tracking (`-0.02em`).
- **H2:** Inter 700, `clamp(28px, 4vw, 44px)`.
- **H3:** Inter 600, `clamp(20px, 2.5vw, 28px)`.
- **H4:** Inter 600, `clamp(18px, 2vw, 22px)`.
- **Body:** Inter 400, 16px (17–18px on desktop), line-height 1.6.
- **Body large (intros):** Inter 400, 18–20px.
- **Caption / meta:** Inter 500, 13–14px, often Muted color.
- **Monospace accents** (code, tech tags): JetBrains Mono or IBM Plex Mono.

### Icon system

Use **Lucide** (open-source, MIT, ~1,400 icons, consistent stroke). Why Lucide over Font Awesome / Heroicons: tree-shakable per-icon imports keep the bundle small (critical for mobile), the stroke style fits the engineering-blueprint aesthetic better than filled icons, and there is an official Astro-friendly package (`lucide-astro`).

Default sizes: `h-4 w-4` (inline), `h-5 w-5` (UI controls), `h-6 w-6` (section accents). Stroke width 2 (Lucide default).

### Layout & grid

- **Mobile-first:** design at 375px first, then scale up. Breakpoints: `sm 640, md 768, lg 1024, xl 1280, 2xl 1536`.
- **Container max-width:** 1280px. Outer padding: 16px mobile / 24px tablet / 32px desktop.
- **Spacing scale:** Tailwind default (4px base). Section vertical rhythm: 64–96px mobile, 96–160px desktop.
- **Corner radius:** 8px (`rounded-lg`, cards), 12px (`rounded-xl`, large surfaces), 999px (`rounded-full`, pills / tags).

### Components

- Button (primary, secondary, ghost, danger), Link, Tag/Badge, Card, Stat, Section header, Logo strip, Testimonial card, Project card, Post card, Carousel, Stepper, Accordion (FAQ), Form input set (text/select/textarea/checkbox/radio), Toast, Footer, Header, MobileNav.
- All interactive components: visible focus ring (2px brand blue, 2px offset), keyboard accessible, ARIA labels where icons are used without text.
- Each component has documented props and at minimum one Astro example in source.

### Motion

- Subtle, functional only — fade-in on scroll for sections (≤200ms), carousel slide transitions (≤300ms), hover lifts on cards (2–4px translate, 150ms).
- No bouncy easings on marketing surfaces — `ease-out` only.
- Respect `prefers-reduced-motion` — disable all non-essential motion when the user has set this (global CSS rule, see [`skills.md` §12](./skills.md#12-accessibility)).
- No carousel autoplay anywhere.

---

## 8. Technical Architecture

### Stack confirmation

| Layer | Tool | Why |
|---|---|---|
| Frontend | Astro 4+ | Islands architecture, SSR + static hybrid, ships near-zero JS by default |
| Styling | Tailwind CSS | Design-token-friendly, fast iteration, integrates cleanly with Astro |
| API | Fastify | Fast Node.js framework, schema validation, plugin ecosystem |
| Database | MySQL 8 | Mature, well-known, fits relational content model |
| ORM / query | Drizzle ORM | Type-safe, SQL-first, lightweight |
| Auth (admin) | Lucia + argon2id | Session-cookie auth, no third-party dependency for v1 |
| Media storage | S3-compatible (Cloudflare R2) | Cheap egress, simple integration, CDN-fronted |
| Email | Resend | Transactional email for lead notifications + confirmations |
| Search (blog) | Pagefind | Static, client-side, zero infra, works perfectly with Astro |
| Analytics | Plausible (managed) or Umami (self-hosted) | Privacy-friendly, no cookie banner required |
| Captcha | Cloudflare Turnstile | Free, privacy-friendly, low-friction |
| Error tracking | Sentry | Free tier covers v1 volume |
| Uptime | Better Stack | Status page + alerts |

### Rendering strategy

Astro in hybrid mode:
- **Static (SSG) at build time:** marketing pages (Home, Services, About, Contact shell, Privacy, Terms), blog index + posts, work index + projects. Rebuilt on content publish via webhook.
- **Server-rendered (SSR):** `/admin/*`, `/api/*` via Fastify. Contact form POST handled by Fastify, not Astro.
- **Client-side islands:** carousel, filter UI, contact form, blog search, mobile nav.

### Deployment topology

- Astro site: deployed to a Node-capable host (Fly.io, Railway, or a VPS via Coolify/Dokku).
- Fastify API: same host or separate small service; reverse-proxied via Caddy/Nginx.
- MySQL: managed (PlanetScale, AWS RDS) or self-hosted with daily backups + point-in-time recovery.
- CDN: Cloudflare in front of everything — caching, DDoS, TLS, image resizing.
- CI/CD: GitHub Actions — lint, typecheck, build, run e2e smoke tests, deploy on merge to `main`.

### Repository structure

Monorepo (pnpm workspaces):

```
/apps
  /web         # Astro site
  /api         # Fastify API
/packages
  /db          # Drizzle schema + migrations
  /ui          # Shared components (if needed)
  /config      # eslint, tsconfig, tailwind preset
```

Detailed layout, file-naming, and folder rules: [`CLAUDE.md` "Repo layout" + "File naming"](./CLAUDE.md#repo-layout).

### Environments

- **Local:** docker-compose with MySQL + adminer.
- **Staging:** full deploy, seeded data, basic-auth protected.
- **Production:** behind CDN, monitored.

### Environment variables (taxonomy)

Required and documented in `.env.example`. Anything new requires a same-PR update to `.env.example` (see [`CLAUDE.md`](./CLAUDE.md) hard rule §8).

| Var | Scope | Purpose |
|---|---|---|
| `NODE_ENV` | both | `development` / `staging` / `production` |
| `PUBLIC_SITE_URL` | web | Canonical origin, used for absolute URLs, sitemap, OG tags |
| `API_URL` | web (build) | Build-time API base for `/cms/*` reads |
| `DATABASE_URL` | api | MySQL connection string |
| `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET` / `R2_PUBLIC_BASE` | api | Media storage |
| `RESEND_API_KEY` | api | Transactional email |
| `SLACK_WEBHOOK_SALES` | api | Lead notifications |
| `SESSION_SECRET` | api | Lucia session encryption |
| `CSRF_SECRET` | api | CSRF token signing |
| `TURNSTILE_SITE_KEY` | web | Public captcha key |
| `TURNSTILE_SECRET_KEY` | api | Captcha verification |
| `DEPLOY_WEBHOOK_URL` | api | Triggers rebuild on publish |
| `SENTRY_DSN` | both | Error tracking |
| `PLAUSIBLE_DOMAIN` / `PLAUSIBLE_SCRIPT_URL` | web | Analytics |
| `CLAMAV_HOST` (optional) | api | Upload virus scan; if unset, scan is skipped (dev only) |

`PUBLIC_*` prefix is the only variable type that Astro will expose to the browser.

---

## 9. SEO, Performance & Accessibility

### SEO

- Per-page editable meta: title, description, OG image, canonical.
- Default OG image: 1200×630 with the masthead promise rendered over a brand-blue gradient; per-post / per-project override supported.
- Structured data (JSON-LD): Organization on every page, Article on blog posts, BreadcrumbList on detail pages, FAQ on services page, CreativeWork on project pages.
- `sitemap.xml` auto-generated on build (Astro plugin). `robots.txt` allowing all except `/admin` and `/api`.
- Semantic HTML — one H1 per page, proper landmarks, descriptive link text.
- Image alt-text required at upload time in the admin.
- Canonical URLs always absolute, always without trailing slash, always lowercase.

### Performance budgets

- LCP ≤ 2.5s (mobile, 4G simulated). INP ≤ 200ms. CLS ≤ 0.1.
- JS shipped on Home/Services/About ≤ 50KB gzipped (excluding analytics).
- Images: served as AVIF with WebP fallback, responsive `srcset`, lazy-loaded below the fold, fixed aspect ratios to prevent CLS.
- Fonts: self-hosted Inter, subset (latin + latin-ext), `font-display: swap`, preloaded for the headline weight only.
- HTML cache: `s-maxage=300, stale-while-revalidate=86400` on marketing pages.

### Accessibility (WCAG 2.2 AA)

- **Color contrast:** all text ≥ 4.5:1, large text ≥ 3:1. The blue/black/white palette has been chosen so headline-on-white and white-on-navy both clear AAA.
- **Keyboard:** every interactive element reachable and operable; visible focus ring; skip-to-content link.
- **Screen readers:** ARIA on icon-only buttons, landmarks on every section, alt-text on every meaningful image.
- **Motion:** respect `prefers-reduced-motion`.
- **Forms:** errors announced via `aria-live="polite"` and linked with `aria-describedby`; field labels never visually hidden (use `sr-only` only as a last resort).
- **Audits:** Lighthouse on every PR (gate ≥ 95), axe-core in Playwright e2e, manual keyboard pass before each launch / major feature.

---

## 10. Security, Privacy & Compliance

- All traffic over HTTPS, HSTS enabled (1 year, `includeSubDomains; preload`), secure cookies (`httpOnly`, `SameSite=Lax`, `Secure` in prod).
- **Admin auth:** password hashing with argon2id (memoryCost 19456, timeCost 2), session rotation on privilege change, brute-force lockout (5 attempts / email / 15 min), optional TOTP 2FA.
- **API:** input validation via Fastify schemas (Zod), rate limiting per IP, CSRF tokens on admin POSTs, JSON bodies only (no form-urlencoded), max body size 1MB except media upload route (10MB).
- **MySQL:** least-privilege DB users (separate read / write / migration), parameterized queries only via the ORM, daily encrypted backups, 30-day retention, point-in-time recovery on managed providers.
- **Media:** server-side validation of file type and size, antivirus scan (ClamAV) on upload, generated filenames (never trust client filename), EXIF stripped on image processing.
- **Privacy:** cookie-less analytics; if any third-party (e.g. Calendly) sets cookies, expose a clear notice. Privacy policy and terms drafted before launch. PII (email, phone, IP) is the only PII we store and only on `leads` + `audit_log` — both excluded from logs and from any analytics export.
- **Logging:** structured JSON logs (pino), no PII in logs (auto-redact `email`, `password`, `phone`, `ip`), errors piped to Sentry.
- **Headers:** CSP (no `unsafe-inline` except for the JSON-LD `<script>` blocks which use hashes), X-Content-Type-Options, Referrer-Policy `strict-origin-when-cross-origin`, Permissions-Policy `camera=(), microphone=(), geolocation=()` all set via reverse proxy.
- **Secrets:** never in source, never in logs, rotated annually or on personnel change.
- **Data deletion request handling:** any GDPR/CCPA request → admin runs scripted soft-delete on `leads`; full audit trail kept in `audit_log`.

---

## 11. Analytics & Lead Handling

- **Event tracking** (privacy-friendly, no cookies): page views, scroll depth on case studies, CTA clicks (Start a project, Book a call, See our work), form starts, form submits, blog reads ≥ 30s. Full event catalog: [`skills.md` §10](./skills.md#10-analytics).
- **Lead notification:** every form submission triggers (1) DB insert, (2) Slack webhook to `#sales`, (3) email to sales inbox, (4) confirmation email to submitter. Failures in steps 2–4 must not fail the user request — they're queued for retry.
- **Lead status pipeline** in admin: New → Qualified → Contacted → Won/Lost — minimal CRM, exportable as CSV.
- **Lead assignment:** v1 = all leads go to one inbox; v1.1 = round-robin among `admin_users` with role=admin and `assigned_to`-capable.
- **UTM capture:** persisted on the lead record (`utm.source`, `utm.medium`, `utm.campaign`, `utm.term`, `utm.content`). Captured from URL on landing, stored in `sessionStorage`, attached to form POST.
- **Referer:** captured server-side, stored on `leads.referer`.

---

## 12. Roadmap & Milestones

| Week | Milestone | Deliverables |
|---|---|---|
| 0 | Kickoff | PRD signed off, content audit, tech spike on admin (custom vs Directus) |
| 1–2 | Design system + key pages | Tokens, components in Figma; Home + Project Detail hi-fi |
| 2–3 | Remaining pages design | Services, Work index, Blog, About, Contact, Admin shell |
| 2–4 | Foundation build | Monorepo, Astro + Tailwind setup, Fastify + Drizzle, MySQL schema + migrations, auth |
| 4–6 | Public pages build | All marketing pages implemented + CMS-wired |
| 5–7 | Admin build | Full CRUD, media library, draft/publish, scheduled publishing |
| 6–7 | Content load | Seed real client logos, 6 case studies, 4 blog posts, team bios |
| 7 | QA + audit | Lighthouse, accessibility audit, security review, content proofread |
| 8 | Launch | DNS cutover, monitoring on, sitemap submitted, retro scheduled |

### Launch checklist (week 8)

- [ ] Lighthouse perf ≥ 90 (mobile) on all routes in §5.
- [ ] Lighthouse a11y ≥ 95 on all routes.
- [ ] axe-core e2e suite green.
- [ ] All `meta` tags reviewed; default OG image renders correctly on Twitter and LinkedIn link previewers.
- [ ] `/sitemap-index.xml` submitted to Google Search Console.
- [ ] DNS TTL lowered ahead of cutover; HSTS preload submission filed.
- [ ] Daily DB backup verified by restoring to staging.
- [ ] Status page live; uptime checks on `/`, `/api/health`.
- [ ] Sentry receiving events from staging; production DSN configured.
- [ ] Plausible / Umami goal funnels set up for `cta_click` → `form_submit`.
- [ ] All 100+ client logos either have `consent_to_display=true` or are removed from the wall.
- [ ] Contact form end-to-end test in production (sends real email + Slack message).

### Post-launch (v1.1 candidates)

- Indonesian-language site (i18n; see §13.6 for the planned shape).
- Newsletter signup + ConvertKit/Buttondown integration.
- Public changelog or "What we shipped this month" page.
- Service-specific landing pages for paid campaigns.
- Embedded calculator: rough project sizing tool to feed leads.
- Lead round-robin + Cal.com routing per project type.
- 2FA enforcement for all admins.

---

## 13. Open Questions and Proposed Defaults

Decisions still needed from the Zalvice team before build kicks off. Each item has a **proposed default** the team can override.

1. **Custom admin vs. headless CMS** — *Proposed default:* **build custom**. The content model is small (~14 tables), the admin is internal-only, and the editor/markdown stack we'd need is well-supported. Reconsider Directus if v1 admin work exceeds 2 weeks.
2. **Hosting choice** — *Proposed default:* **Fly.io** for web + api (1 region to start), **PlanetScale** for MySQL, **Cloudflare R2** for media, **Cloudflare** in front of everything. Predictable cost (~$50/mo at launch), zero-egress R2, manage-by-config Fly.
3. **Domain & email** — *Proposed default:* `sales@zalvice.com` becomes the lead inbox; `hello@zalvice.com` is the catch-all. Both DKIM/SPF/DMARC-aligned via Resend.
4. **Logo wall** — *Proposed default:* **only display clients with `consent_to_display=true`**. The admin shows pending-consent count; we ship with whoever has consented and add the rest as approvals come in.
5. **Initial content** — *Proposed default:* internal team writes 4 case studies (weeks 6–7) using a structured template; external writer engaged for 2 launch blog posts.
6. **Booking tool** — *Proposed default:* **Cal.com** (open-source, self-hostable later, clean embed). Single round-robin link for v1.
7. **Calendar routing** — *Proposed default:* single inbox + single Cal.com link for v1. Round-robin and per-pillar routing in v1.1.

### 13.6 i18n-ready scaffolding (deferred but planned)

We are English-only at launch but should not paint ourselves into a corner. The structural decisions to make now:

- All visitor-visible copy must come from either the CMS or a typed `t()` helper — no inline English strings buried in templates.
- Routing uses `[locale]` as the first segment when i18n ships (`/en/about`, `/id/about`). Until then, requests resolve as if locale is `en` and the `[locale]` segment is omitted; the router redirects `/<page>` → `/en/<page>` only when the feature flag flips on.
- All `posts` and `projects` carry a `locale` column (default `en`) and a `translation_group_id` so the UI can offer "Read this in [other language]" once we have translations.

---

## Appendix A — Quick Reference

### URL summary

| Route | Purpose | Rendering |
|---|---|---|
| `/` | Home | SSG |
| `/services` | Services overview | SSG |
| `/work`, `/work/[slug]` | Showcase | SSG |
| `/blog`, `/blog/[slug]`, `/blog/category/[slug]` | Blog | SSG |
| `/about` | About | SSG |
| `/contact` | Contact (form shell) | SSG (form posts to API) |
| `/admin/*` | Admin (auth-protected) | SSR |
| `/api/*` | Fastify API | SSR |
| `/sitemap.xml`, `/sitemap-index.xml`, `/rss.xml`, `/robots.txt` | Utility | Build-time |
| `/404`, `/500` | Error | Static |

### Stack at a glance

Astro · Tailwind · Fastify · MySQL · Drizzle · Lucide · Inter · Pagefind · Plausible · Cloudflare · Turnstile · Resend · Sentry · Lucia

### Document map

- **What to build:** this PRD.
- **How to build it (rules):** [`CLAUDE.md`](./CLAUDE.md).
- **How to build it (patterns):** [`skills.md`](./skills.md).
