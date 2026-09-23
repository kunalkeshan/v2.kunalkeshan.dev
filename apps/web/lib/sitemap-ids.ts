/**
 * The chunk ids `app/sitemap.ts` splits into via `generateSitemaps()`, and
 * that `app/robots.ts` lists individually in its `sitemap` field — see
 * sitemap.ts's file-level doc comment for why there's no single combined
 * `/sitemap.xml`. Shared here so the two files can't drift out of sync.
 */
export const SITEMAP_IDS = [
  "static",
  "projects",
  "posts",
  "journal",
  "tags",
  "legal",
] as const;

export type SitemapId = (typeof SITEMAP_IDS)[number];
