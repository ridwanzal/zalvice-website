import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'http://localhost:4321',
  output: 'hybrid',
  adapter: node({ mode: 'standalone' }),
  // / → /en redirect. Keeps the pages tree clean (no top-level index.astro
  // that wrestles with astro check's TS pass on top-level `return`).
  redirects: {
    '/': '/en',
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    sitemap({
      // Per-page <xhtml:link rel="alternate" hreflang="..."> entries.
      // EN is the default locale (/ → /en redirect lives in `redirects`
      // above), so /en URLs also carry hreflang="x-default".
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', id: 'id' },
      },
      // Exclude admin, the API proxy, and the bare /404 from the sitemap.
      // /rss.xml is a feed, not a page — also out.
      filter: (page) =>
        !page.includes('/admin') &&
        !page.includes('/api') &&
        !page.includes('/404') &&
        !page.includes('/rss.xml'),
    }),
  ],
  server: { port: 4321, host: true },
  image: {
    remotePatterns: [{ protocol: 'https', hostname: 'media.zalvice.com' }],
  },
  vite: {
    cacheDir: process.env.VITE_CACHE_DIR ?? undefined,
  },
});
