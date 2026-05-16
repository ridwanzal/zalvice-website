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
    sitemap({ filter: (page) => !page.includes('/admin') && !page.includes('/api') }),
  ],
  server: { port: 4321, host: true },
  image: {
    remotePatterns: [{ protocol: 'https', hostname: 'media.zalvice.com' }],
  },
  vite: {
    cacheDir: process.env.VITE_CACHE_DIR ?? undefined,
  },
});
