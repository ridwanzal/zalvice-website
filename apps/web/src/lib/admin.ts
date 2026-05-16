/*
 * Helpers shared by the SSR /admin pages. The admin surface is a thin
 * HTML layer over the API: every page is server-rendered, validates the
 * session via the API on each request, and renders forms that POST
 * directly to the API (which redirects back on success).
 *
 * Why this shape:
 *  - No client state, no React island, no JSON. One <form action="/api/...">
 *    per write. Works without JS, easy to reason about.
 *  - Auth lives in one place (the API). The web side never touches the
 *    session table — it just forwards the cookie when it needs to know
 *    who the caller is.
 */

import type { AstroGlobal } from 'astro';
import { env } from './env';

export type AdminUser = {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'editor';
};

function apiUrl(path: string): string {
  return `${env.API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function forwardedHeaders(astro: AstroGlobal): HeadersInit {
  // Forward the original cookie so the API can see the session.
  const cookie = astro.request.headers.get('cookie');
  return cookie ? { cookie } : {};
}

/**
 * Returns the authenticated admin user, or null. Use early in every SSR
 * admin page — pair with `redirectToLogin(astro)` when null.
 */
export async function getCurrentAdmin(astro: AstroGlobal): Promise<AdminUser | null> {
  try {
    const res = await fetch(apiUrl('/api/auth/me'), {
      headers: forwardedHeaders(astro),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { user: AdminUser };
    return body.user;
  } catch {
    return null;
  }
}

/**
 * Combined "is this caller authed? if not redirect" helper. Use as:
 *
 *   const { user, redirect } = await requireAdmin(Astro);
 *   if (!user) return redirect;
 *
 * Folding the auth check + redirect into a single call keeps astro-check
 * happy — see CLAUDE.md "Conventions discovered in build" on top-level
 * `return` shadowing imports.
 */
export async function requireAdmin(
  astro: AstroGlobal,
): Promise<{ user: AdminUser; redirect: null } | { user: null; redirect: Response }> {
  const user = await getCurrentAdmin(astro);
  if (user) return { user, redirect: null };
  const here = astro.url.pathname + astro.url.search;
  const dest = `/admin/login?redirect=${encodeURIComponent(here)}`;
  return { user: null, redirect: astro.redirect(dest, 302) };
}

/**
 * Typed read helper. Forwards the cookie + throws on non-2xx so callers
 * get a clear error in the SSR log instead of rendering empty pages.
 */
export async function apiGet<T>(astro: AstroGlobal, path: string): Promise<T> {
  const res = await fetch(apiUrl(path), { headers: forwardedHeaders(astro) });
  if (!res.ok) {
    throw new Error(`admin API ${path} returned ${res.status}`);
  }
  return (await res.json()) as T;
}
