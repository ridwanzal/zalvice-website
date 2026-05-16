/*
 * English dictionary. This file's *shape* is canonical — id.ts is typed
 * against `typeof dict` so a missing key in id.ts fails the build, not
 * production. Group keys by component / page for findability.
 *
 * Conventions:
 *  - Keys are dot-separated paths flattened into a nested object.
 *  - Interpolation uses {placeholder} syntax; the t() helper substitutes.
 *  - Never inline a string in a component; if it shows on screen, it
 *    lives here.
 */

export const dict = {
  meta: {
    siteName: 'Zalvice',
    defaultDescription:
      'From blueprint to production — design, development, infrastructure, support, and consulting. One integrated team that has helped 100+ companies transform how they operate.',
    siteSwitchLabel: 'Switch site language',
  },

  nav: {
    primaryLabel: 'Primary',
    services: 'Services',
    work: 'Work',
    blog: 'Blog',
    about: 'About',
    contact: 'Contact',
    startProject: 'Start a project',
    start: 'Start',
    home: 'Zalvice home',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    siteNav: 'Site navigation',
    tagline: 'Your end-to-end engineering partner',
    readyToStart: 'Ready to start?',
  },

  footer: {
    services: 'Services',
    company: 'Company',
    getInTouch: 'Get in touch',
    location: 'Jakarta · Remote-first',
    privacy: 'Privacy',
    terms: 'Terms',
    sitemap: 'Sitemap',
    rss: 'RSS',
    description:
      'From blueprint to production — we engineer the systems companies rely on. Design, development, infrastructure, support, and consulting under one roof.',
    copyright: '© {year} Zalvice. All rights reserved.',
  },

  masthead: {
    eyebrustedBy: 'Trusted by {value}{suffix} companies',
    eyebrustedByFallback: 'Trusted by companies worldwide',
    subhead:
      'Design, development, infrastructure, and ongoing support — one integrated team that has helped transform how companies operate.',
    seeWork: 'See our work',
    // Five rotating headline variants. Each splits headline + emphasis so we
    // can apply the gradient to the emphasised clause only.
    variants: [
      {
        emphasis: 'From blueprint to production',
        rest: ' — we engineer the systems companies rely on.',
      },
      {
        emphasis: 'Design, build, operate.',
        rest: ' One integrated team that owns the work end to end.',
      },
      {
        emphasis: 'Senior engineering, on day one.',
        rest: ' No bait-and-switch staffing, no offshore handoff.',
      },
      {
        emphasis: 'Boring tools, used well.',
        rest: ' Systems built to outlive the launch.',
      },
      {
        emphasis: 'AI-native delivery.',
        rest: ' From RAG and agents to evals — production, not demoware.',
      },
    ],
  },

  process: {
    eyebrow: 'How we work',
    headlineEmph: 'Discover. Design. Build. Operate.',
    intro:
      'A single integrated team carries the work from kickoff to live operations — no handoffs, no rework between vendors.',
    stepLabel: 'Step',
    steps: [
      {
        label: 'Discover',
        body: 'We map the system end-to-end before writing a line of code — users, constraints, infra, success metrics.',
        duration: '1–2 weeks',
      },
      {
        label: 'Design',
        body: 'Information architecture, interaction patterns, and a working design system that engineering can ship from.',
        duration: '2–4 weeks',
      },
      {
        label: 'Build',
        body: 'Tight feedback loops with the people who will own the system. CI from day one, no big-bang releases.',
        duration: '6–16 weeks',
      },
      {
        label: 'Operate',
        body: 'Once it ships, we stay on the wire — monitoring, on-call, capacity, incident response.',
        duration: 'Ongoing',
      },
    ],
  },

  services: {
    eyebrow: 'What we do',
    headlineEmph: 'Five pillars, one integrated team.',
    intro:
      'We deliver design, development, infrastructure, support, and consulting together — not as five separate quotes. One team, one shared standard, end to end.',
    learnMore: 'Learn more',
    swipeHint: 'Swipe to see more →',
  },

  stats: {
    eyebrow: 'By the numbers',
    headline: 'Proof, in production.',
    note: 'Stats are pulled live from the back office — never out of date, never approximate.',
  },

  articles: {
    eyebrow: 'Latest writing',
    headlineEmph: 'Notes from the build floor.',
    intro:
      "Engineering, infrastructure, and operating notes from work we've shipped — managed in the back office, published in minutes.",
    managedIn: 'Managed in /admin',
    allArticles: 'All articles',
    readTimeUnit: 'min',
  },

  techStack: {
    eyebrow: 'Technology',
    headlineEmph: 'End-to-end, with AI baked in.',
    intro:
      'We use the same toolchain across every engagement so the work is portable and the operating model is predictable. AI is a first-class layer, not a bolt-on.',
    deliveryTitle: 'Our delivery stack',
    deliveryNote: 'What we build on',
    aiTitle: 'AI capabilities we build for you',
    aiNote: 'Production-grade, not demoware',
    approach:
      'Approach: we run pilots on Claude or GPT-4 class models first, instrument with evals from day one, and keep the option to swap providers open. No vendor lock-in beyond what the product demands.',
  },

  finalCta: {
    eyebrow: 'Have a system to build?',
    headline: 'Talk to the team that will actually do the work.',
    intro:
      "No SDR funnel, no four-week procurement dance. You'll be on a call with an engineer or designer who could end up on your project.",
    bookCall: 'Book a 30-min call',
    reassurance: [
      'Reply within 1 business day',
      'NDA available on request',
      'Engineering-led discovery, not sales',
    ],
  },

  lifecycle: {
    chip: 'live · 99.99% uptime',
    section: 'Lifecycle',
    headline: 'From blueprint to production, in one team',
    footnote: 'One team, end to end',
    cta: 'How we deliver →',
  },

  logoStrip: {
    label: 'Trusted by these companies',
  },

  testimonials: {
    eyebrow: 'What clients say',
    headlineEmph: 'Reviews from the teams we built systems with.',
    intro:
      "Direct quotes from the people who own the systems we shipped. Every review links to the case study it's about.",
    readCase: 'Read the case',
    aboutEyebrow: 'Reviews',
    aboutHeadlineEmph: 'In their words.',
  },

  clientsWall: {
    eyebrow: 'Clients',
    headlineEmph: 'Companies we work with.',
    intro:
      'A selection of the {count}+ teams who have trusted us to ship the systems they run on.',
  },

  about: {
    title: 'About — Zalvice',
    description:
      'A senior, remote-first engineering team building the systems companies rely on. Eight pillars of work — design, engineering, infrastructure, operations — under one roof.',
    eyebrow: 'About Zalvice',
    headlineEmph: 'A small senior team',
    headlineRest: ' that builds the systems your business runs on.',
    intro:
      "We're an integrated design, engineering, and operations team. No outsourced delivery, no offshore handoff, no junior bait-and-switch. Everyone on the engineering bench has shipped production for at least five years.",
    founded: 'Founded',
    clients: 'Clients',
    teamLabel: 'Team',
    avgTenure: 'Avg. tenure',
    storyEyebrow: 'Our story',
    storyHeadlineEmph: 'From an engineering practice, not a sales pipeline.',
    storyParagraphs: [
      'Zalvice started because too many companies were getting "delivery teams" that couldn\'t actually deliver — long pitches, junior staff, projects that left them worse off than when they started.',
      'We built a different shape: a small senior team that owns the work end to end. Design, engineering, infrastructure, and operations sit in the same room (mostly virtual, sometimes physical) and ship together.',
      'Today we partner with companies on the systems they cannot afford to get wrong — billing, clinical records, logistics, AI-backed knowledge bases. We stay on after launch because the system is now part of how the business runs.',
    ],
    valuesEyebrow: 'How we work',
    valuesHeadlineEmph: 'Four principles, not a values poster.',
    values: [
      {
        label: 'Reliability over novelty',
        body: 'We pick boring tools that age well. Your business depends on the system long after the launch.',
      },
      {
        label: 'Engineering rigor',
        body: 'Specs, tests, observability, runbooks. The unglamorous work that prevents incidents at 3am.',
      },
      {
        label: 'Senior bench',
        body: 'Every engineer brings 5+ years from the industries we work in. No bait-and-switch staffing.',
      },
      {
        label: 'Remote-first, time-zone-aware',
        body: 'Async by default. Synchronous when it matters. We follow the work, not the calendar.',
      },
    ],
    teamEyebrow: 'The team',
    teamHeadlineEmph: 'Senior bench, every seat.',
    teamIntro:
      'Every engineer on the bench has 5+ years of production experience in the industries we work in. No junior bait-and-switch, no offshore handoff.',
    filterLabel: 'Filter by team',
    teamLabels: {
      eng: 'Engineering',
      design: 'Design',
      infra: 'Infrastructure',
      ops: 'Operations',
    },
    yearsSuffix: '+ yrs',
    ctaHeadline: 'Want to work with this team?',
    ctaBody:
      "Discovery calls are with an engineer or designer — not a salesperson. We'll tell you quickly if we're the right fit.",
  },

  contact: {
    title: 'Contact — Zalvice',
    description:
      'Start a project or book a 30-minute discovery call. Replies within one business day, from an engineer or designer — never a salesperson.',
    eyebrow: 'Contact',
    headlineEmph: 'Tell us about your system.',
    intro:
      "Drop the form below or grab a 30-minute slot. Either way you'll be on a call with someone who could end up on your project — not an SDR.",
    chips: ['Reply within 1 business day', 'NDA on request', 'No SDR funnel'],
    formTitle: 'Start a project',
    formIntro: "All fields marked with * are required. We'll never share your details — see our",
    privacyPolicy: 'privacy policy',
    labels: {
      name: 'Your name',
      email: 'Work email',
      company: 'Company',
      projectType: 'What do you need?',
      budget: 'Budget range',
      timeline: 'Timeline',
      message: "Tell us what you're trying to build",
    },
    placeholders: {
      name: 'Jane Doe',
      email: 'jane@company.com',
      company: 'Acme Inc.',
      message:
        "What's the system you need built or operated? Any constraints, deadlines, or context we should know up front?",
      chooseOne: 'Choose one…',
    },
    messageHint: 'Minimum 20 characters.',
    turnstileNotice: 'Protected by Cloudflare Turnstile. By submitting, you accept our',
    terms: 'terms',
    send: 'Send',
    projectTypes: {
      design: 'Design',
      development: 'Development',
      infrastructure: 'Infrastructure',
      support: 'Support',
      consulting: 'Consulting',
      other: 'Other / not sure',
    },
    budgets: {
      under_25k: 'Under $25k',
      '25k_75k': '$25k – $75k',
      '75k_200k': '$75k – $200k',
      '200k_plus': '$200k+',
      not_sure: 'Not sure yet',
    },
    timelines: {
      asap: 'ASAP',
      '1_3_months': 'In 1–3 months',
      '3_6_months': 'In 3–6 months',
      exploring: 'Just exploring',
    },
    bookTitle: 'Book a 30-min call',
    bookBody: "Pick a slot directly on the team's calendar. No follow-up form.",
    openCalendar: 'Open calendar',
    emailTitle: 'Prefer email?',
    emailGeneral: '— general',
    emailSales: '— new projects',
    officesEyebrow: 'Offices',
    officesHeadlineEmph: 'Two offices, one async-first team.',
    hq: 'HQ',
    offices: [
      {
        city: 'Jakarta',
        country: 'Indonesia',
        address: 'Jl. Sudirman Kav. 45\nKuningan, Jakarta Selatan 12940',
        timezone: 'GMT+7 · WIB',
        primary: true,
      },
      {
        city: 'Singapore',
        country: 'Singapore',
        address: '6 Battery Road, Level 30\nSingapore 049909',
        timezone: 'GMT+8 · SGT',
        primary: false,
      },
      {
        city: 'Remote',
        country: 'Global',
        address: 'Async-first across 6 time zones',
        timezone: 'Anywhere',
        primary: false,
      },
    ],
  },

  workIndex: {
    title: 'Work — Zalvice',
    description:
      'Selected projects across logistics, healthcare, fintech, SaaS, retail, and the public sector. Each is a system the client now runs on.',
    eyebrow: 'Selected work',
    headlineEmph: 'Systems shipped, systems still running.',
    intro:
      'A sample of the work we\'ve done across industries. Filter by service pillar or industry to find something close to what you have in mind.',
    serviceFilterLegend: 'Service',
    industryFilterLegend: 'Industry',
    all: 'All',
    projects: 'projects',
    emptyMessage: 'No projects match these filters.',
    resetFilters: 'Reset filters',
  },

  workDetail: {
    backToWork: 'Back to work',
    client: 'Client',
    year: 'Year',
    team: 'Team',
    teamSuffix: 'mo',
    services: 'Services',
    outcomes: 'Outcomes',
    techStack: 'Tech stack',
    moreWork: 'More work',
    allProjects: 'All projects',
    readCase: 'Read the case',
    viewCase: 'View case',
    similarHeadline: 'Have something similar in mind?',
    similarBody:
      'The same team that shipped this one is available for new engagements.',
  },

  servicesPage: {
    title: 'Services — Zalvice',
    description:
      'Design, development, infrastructure, support, and consulting — delivered together by one integrated team. No multi-vendor handoffs, no junior bait-and-switch.',
    eyebrow: 'Services',
    headlineEmph: 'Five pillars,',
    headlineRest: ' one integrated team that owns the work end to end.',
    intro:
      'Most agencies sell one of these. We sell all of them together — because that is how systems actually get built, shipped, and operated without falling between vendors.',
    pillarsNavLabel: 'Service pillars',
    pillarPrefix: 'Pillar',
    whatYouGet: 'What you get',
    engagementModel: 'Engagement model',
    selectedCases: 'Selected case studies',
    talkAbout: 'Talk to us about',
    readCase: 'Read the case',
    integratedEyebrow: 'Why this matters',
    integratedHeadline:
      'Bought separately, these are five vendors. Bought together, they are one team.',
    integratedBody:
      'Multi-vendor stacks fail in the gaps — design hands off to engineering hands off to infra hands off to support, and the bugs live in those handoffs. We deliver the pillars together so there are no handoffs.',
    integratedBenefits: [
      'One commercial relationship',
      'One on-call rotation, one Slack channel',
      'Shared roadmap across design, build, and operate',
      'No finger-pointing when something breaks',
    ],
    faqEyebrow: 'FAQ',
    faqHeadlineEmph: 'The questions sales teams usually dodge.',
    faqIntro: "Straight answers — same ones you'd get on a discovery call.",
    ctaHeadline: 'Want a specific pillar — or all five?',
    ctaBody:
      'Tell us what you are building. We will tell you within one business day whether we are the right fit, and which pillars to start with.',

    // Per-pillar overlay (long copy + what you get + engagement). Keyed by
    // the service slug from the CMS.
    overlay: {
      design: {
        longDescription:
          'Product and brand design grounded in how the system actually behaves. We design alongside the engineers building it, not in a sealed studio that hands off Figma files.',
        whatYouGet: [
          'Product design end-to-end — IA, flows, screens, prototypes',
          'A design system your team can extend without us',
          'Brand identity that holds up across product, web, and motion',
          'Research and usability testing with real users',
          'Accessibility baked in (WCAG 2.2 AA, not retrofit)',
          'Design tokens, components, documentation',
        ],
        engagement: 'Fixed-scope discovery + design sprints, or embedded designer on retainer.',
      },
      development: {
        longDescription:
          'Web, mobile, and backend engineering built to operate for years. Boring tools that age well; CI from day one; specs and tests as a default, not an afterthought.',
        whatYouGet: [
          'Web applications (Astro, Next.js, React)',
          'Mobile apps (React Native, native Swift/Kotlin when needed)',
          'APIs and services (Node, Go, Python)',
          'Data pipelines, ETL, analytics surfaces',
          'AI features (RAG, agents, evals — see /work for examples)',
          'Code review, technical leadership, and pairing for your team',
        ],
        engagement: 'Fixed-scope MVP build, retainer team, or staff augmentation.',
      },
      infrastructure: {
        longDescription:
          'Cloud, CI/CD, and platform engineering you can rely on. We are the team that already has on-call war stories from three industries — not the team that learns them on your bill.',
        whatYouGet: [
          'Cloud architecture on AWS / GCP / Cloudflare',
          'CI/CD pipelines, environments, deploy automation',
          'Infrastructure as code (Terraform, Pulumi)',
          'Observability — metrics, traces, logs, alerts that page the right person',
          'Security baseline — secrets, IAM, audit trails, incident playbooks',
          'Cost reviews; right-sizing without sacrificing reliability',
        ],
        engagement: 'Platform setup project, then optional ongoing operations retainer.',
      },
      support: {
        longDescription:
          'Once it ships, we stay on the wire. Monitoring, on-call, capacity planning, incident response, and the unglamorous work that keeps a system trustworthy long after launch.',
        whatYouGet: [
          'Managed operations across web, mobile, and infra',
          '24/7 on-call coverage with documented response SLAs',
          'Quarterly resilience reviews — what would have paged us, what did',
          'Runbooks and postmortems written before, not after',
          'Capacity and cost forecasting',
          "Knowledge transfer to your team when you're ready to take it back",
        ],
        engagement: 'Monthly retainer scaled to system complexity and traffic.',
      },
      consulting: {
        longDescription:
          'Senior advisory when you need an outside read on architecture, hiring, or technical strategy. No deliverables theatre — just experienced people telling you what we would do and why.',
        whatYouGet: [
          'Architecture review — second opinion on the system you are building',
          'Tech due diligence — pre-acquisition or pre-investment',
          'Hiring strategy — what to hire next, what to outsource',
          'Engineering team scaling — process, rituals, on-call',
          'Vendor and platform selection (build vs buy, framework decisions)',
          'Workshops — RAG, evals, distributed systems, design systems',
        ],
        engagement: 'Day rate, weekly retainer, or scoped reviews with written deliverables.',
      },
    },

    faqs: [
      {
        q: 'How do you price an engagement?',
        a: 'Discovery is fixed-fee so you can compare apples to apples. Build engagements are usually fixed-scope per phase with a transparent rate card; retainers price by team composition and on-call expectations.',
      },
      {
        q: 'Where is the team based?',
        a: 'Jakarta HQ + Singapore office, remote-first across six time zones. We pick the working hours around the engagement, not the other way around.',
      },
      {
        q: 'Do you sign NDAs?',
        a: 'Yes — we have a standard mutual NDA we can sign within a day, or we can review yours.',
      },
      {
        q: 'Who owns the IP?',
        a: 'You do. Once invoices are settled, all work product (code, designs, infra, documentation) transfers to you. We retain rights only to reusable tooling and templates we brought in.',
      },
      {
        q: 'How small is too small?',
        a: 'We tend to start at around the $25k mark — anything smaller usually fits a freelancer better than a team. Big-picture: if you would not bring it to your in-house engineering team for a 6-week sprint, it is probably too small.',
      },
      {
        q: 'How do you handle ongoing support after a build?',
        a: 'Most build engagements roll directly into a Support retainer — the team that shipped it stays on call with documented response SLAs. You can also opt out and take it back any time.',
      },
      {
        q: 'Do you do fractional CTO work?',
        a: 'Yes — see the Consulting pillar. Day rate or weekly retainer with written architecture / hiring / vendor recommendations.',
      },
      {
        q: 'What does a typical first month look like?',
        a: 'Week 1: discovery — interviews, system audit, success metrics. Week 2: design + technical spike in parallel. Week 3: end-of-discovery review with a scoped plan + estimate. Week 4: kickoff if we both agree to proceed.',
      },
    ],
  },

  notFound: {
    title: '404 — Not found',
    headline: 'Page not found',
    body: "The page you're looking for doesn't exist.",
  },
};
