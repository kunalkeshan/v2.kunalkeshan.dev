import { SITE_CONFIG } from "@/config/site";
import { SITEMAP_IDS } from "@/lib/sitemap-ids";

/**
 * Sitemap index — a real `<sitemapindex>` file per the Sitemaps protocol
 * (https://www.sitemaps.org/protocol.html#index), pointing at every chunk
 * `app/sitemap.ts` generates via `generateSitemaps()`.
 *
 * Deliberately NOT at `/sitemap.xml`: that exact path is reserved by Next's
 * `generateSitemaps()` metadata convention itself (it only serves real
 * content at `/sitemap/<id>.xml`, but still claims the bare `/sitemap.xml`
 * route internally) — a manual Route Handler there fails the build with
 * "Conflicting route and metadata at /sitemap.xml". This lives at
 * `/sitemap-index.xml` instead, and robots.ts's `sitemap` field points here
 * so search engines and Search Console still only need one URL.
 *
 * `lastmod` is omitted per chunk: a real "most recently changed URL in this
 * chunk" value would require fetching every collection here too, defeating
 * the whole point of the per-collection split in sitemap.ts. Omitting it is
 * valid per the protocol (optional field) and search engines fall back to
 * their own crawl of each chunk.
 */
export const revalidate = 3600;

export async function GET() {
  const sitemapEntries = SITEMAP_IDS.map(
    (id) => `  <sitemap>\n    <loc>${SITE_CONFIG.URL}/sitemap/${id}.xml</loc>\n  </sitemap>`
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
