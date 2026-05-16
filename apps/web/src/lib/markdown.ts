/*
 * Markdown pipeline for blog posts (and the work detail body). Matches the
 * recipe in skills.md §7:
 *
 *   body_md
 *     → remark-parse        (markdown AST)
 *     → remark-gfm          (tables, strikethrough, task lists)
 *     → remark-rehype       (markdown AST → HTML AST)
 *     → rehype-slug         (auto IDs on headings, needed for TOC anchors)
 *     → rehype-autolink-headings (¶ link rendered next to each heading)
 *     → rehype-shiki        (syntax highlighting at build time, no client JS)
 *     → rehype-stringify    (HTML AST → string)
 *
 * Trust model: bodyMd comes from trusted admin authors (Pass A backoffice).
 * allowDangerousHtml stays false; sanitize is unnecessary while writes are
 * admin-only. If editor access opens up, slot rehype-sanitize between
 * rehype and shiki.
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeShiki from '@shikijs/rehype';
import rehypeStringify from 'rehype-stringify';

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: false })
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    behavior: 'wrap',
    properties: { className: ['heading-anchor'] },
  })
  .use(rehypeShiki, { theme: 'github-light' })
  .use(rehypeStringify);

export async function renderMarkdown(md: string): Promise<string> {
  const file = await processor.process(md);
  return String(file);
}

/*
 * Lightweight TOC extractor. Walks the markdown line-by-line picking up
 * H2/H3 with a slug that matches what rehype-slug emits. Used by the blog
 * detail's reading rail (when we add it). Kept here so callers don't need
 * a second unified pass.
 */
export type TocEntry = { depth: 2 | 3; text: string; slug: string };

export function extractToc(md: string): TocEntry[] {
  const entries: TocEntry[] = [];
  for (const rawLine of md.split('\n')) {
    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(rawLine);
    if (!m) continue;
    const depth = m[1]!.length as 2 | 3;
    const text = m[2]!;
    entries.push({ depth, text, slug: slugify(text) });
  }
  return entries;
}

/*
 * GitHub-flavoured slugify, matching what rehype-slug does for prose
 * headings (lowercase, alphanumerics + dashes, collapse runs, trim).
 * Not exhaustive — it won't handle full Unicode — but matches our
 * English/Indonesian heading conventions.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
