import type { MetadataRoute } from "next";

import { SITE_CONFIG } from "@/config/site";

/**
 * `sitemap.ts` is split per collection via `generateSitemaps()` (see
 * docs/seo.md) — Next does NOT synthesize a combined `/sitemap.xml` index
 * for that pattern, it only serves each chunk at `/sitemap/<id>.xml`, and
 * the bare `/sitemap.xml` path is itself reserved by that convention (a
 * manual route there fails the build — see sitemap-index.xml/route.ts's doc
 * comment). `/sitemap-index.xml` hand-builds a proper `<sitemapindex>`
 * pointing at every chunk, so this still only ever needs to reference one
 * URL for search engines/Search Console to discover everything.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${SITE_CONFIG.URL}/sitemap-index.xml`,
  };
}
