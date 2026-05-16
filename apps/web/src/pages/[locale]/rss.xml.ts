/*
 * Per-locale RSS feed. Emits /en/rss.xml and /id/rss.xml as static
 * files at build time. Filters to published posts in the active
 * locale, ordered by publish date desc. Empty feed when no posts —
 * still valid RSS so readers don't drop the subscription.
 */

import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getAllPublishedPosts } from '../../lib/cms';
import {
  LOCALES,
  getDict,
  isLocale,
  pathFor,
  type Locale,
} from '../../lib/i18n';

export async function getStaticPaths() {
  return LOCALES.map((locale) => ({ params: { locale } }));
}

export const GET: APIRoute = async ({ params, site }) => {
  const localeParam = params.locale;
  if (!isLocale(localeParam)) {
    return new Response('Not found', { status: 404 });
  }
  const locale: Locale = localeParam;
  const t = getDict(locale);

  // Astro.site must be set (configured via PUBLIC_SITE_URL). If it isn't,
  // RSS can't produce absolute URLs and feeds break in real readers.
  if (!site) {
    throw new Error('Astro `site` is not configured — set PUBLIC_SITE_URL.');
  }

  const posts = await getAllPublishedPosts(locale);

  return rss({
    title: `${t.meta.siteName} — ${t.nav.blog}`,
    description: t.blog.description,
    site,
    trailingSlash: false,
    items: posts.map((p) => ({
      title: p.title,
      description: p.excerpt,
      link: pathFor(locale, `/blog/${p.slug}`),
      pubDate: new Date(p.publishedAt),
      author: p.authorName,
      categories: [p.category],
    })),
    customData: `<language>${locale === 'id' ? 'id-ID' : 'en-US'}</language>`,
  });
};
