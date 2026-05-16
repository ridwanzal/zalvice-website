import type { APIRoute } from 'astro';
import { env } from '../../lib/env';

export const prerender = false;

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
]);

const proxy: APIRoute = async ({ request, params }) => {
  const path = Array.isArray(params.path) ? params.path.join('/') : (params.path ?? '');
  const url = new URL(request.url);
  const target = `${env.API_URL}/api/${path}${url.search}`;

  const headers = new Headers();
  for (const [key, value] of request.headers) {
    if (!HOP_BY_HOP.has(key.toLowerCase())) headers.set(key, value);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: 'manual',
  };
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.arrayBuffer();
  }

  const res = await fetch(target, init);

  const outHeaders = new Headers();
  for (const [key, value] of res.headers) {
    if (!HOP_BY_HOP.has(key.toLowerCase())) outHeaders.append(key, value);
  }

  return new Response(res.body, { status: res.status, headers: outHeaders });
};

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
