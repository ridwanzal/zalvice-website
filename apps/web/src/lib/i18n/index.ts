/*
 * i18n surface. Two locales, two dictionaries with an identical shape
 * (id.ts is `typeof en.dict`, so missing keys break the build).
 *
 * Routing: every public page lives under apps/web/src/pages/[locale]/.
 * `/` redirects to `/en`. Adding a locale is: create dict, append to
 * LOCALES, regenerate translations. No router config changes.
 */

import { dict as en } from './en';
import { dict as id } from './id';

export const LOCALES = ['en', 'id'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

const dicts = { en, id } as const;
export type Dict = typeof en;

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (LOCALES as readonly string[]).includes(value);
}

export function getDict(locale: Locale): Dict {
  return dicts[locale];
}

/**
 * Locale-aware path builder. `pathFor('id', '/work')` → `/id/work`,
 * `pathFor('en', '/')` → `/en`. Use this for every internal link so
 * the locale segment never gets lost.
 */
export function pathFor(locale: Locale, path: string): string {
  const cleaned = path.startsWith('/') ? path.slice(1) : path;
  return cleaned === '' ? `/${locale}` : `/${locale}/${cleaned}`;
}

/**
 * Swap the locale segment on the current URL. Used by the language
 * switcher so the user stays on whatever page they're reading.
 */
export function switchLocaleHref(currentPathname: string, target: Locale): string {
  const parts = currentPathname.split('/').filter(Boolean);
  if (isLocale(parts[0])) parts[0] = target;
  else parts.unshift(target);
  return '/' + parts.join('/');
}

/**
 * Pull the locale out of an Astro URL. Falls back to DEFAULT_LOCALE
 * when the segment is missing.
 */
export function getLocaleFromUrl(url: URL): Locale {
  const first = url.pathname.split('/').filter(Boolean)[0];
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

/**
 * String interpolation: `t(dict.x.y, { value: 10 })` → 'Trusted by 10'.
 * Only string values are accepted; pass numbers as `String(n)`. Missing
 * placeholders fall through unchanged, which is the intended behavior
 * (visible bug beats silent empty string).
 */
export function format(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (full, key) => {
    const v = vars[key];
    return v === undefined ? full : String(v);
  });
}

/** Native language labels for the switcher. */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  id: 'ID',
};
export const LOCALE_NATIVE_NAMES: Record<Locale, string> = {
  en: 'English',
  id: 'Bahasa Indonesia',
};
