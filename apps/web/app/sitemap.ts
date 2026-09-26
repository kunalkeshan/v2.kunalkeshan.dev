import type { MetadataRoute } from "next";

import { sanityFetch } from "@workspace/sanity/live";
import { createCollectionTag } from "@workspace/sanity/cache-tags";
import {
  JOURNAL_ENTRY_SLUGS_QUERY,
  LEGAL_DOCUMENTS_QUERY,
  POST_SLUGS_QUERY,
  PROJECT_SLUGS_QUERY,
  TAGS_QUERY,
} from "@workspace/sanity/query";

import { SITE_CONFIG } from "@/config/site";
import { SITEMAP_IDS, type SitemapId } from "@/lib/sitemap-ids";

/**
 * Sitemap, split per collection via `generateSitemaps()` (Next's native
 * multi-sitemap mechanism — see docs/seo.md) rather than one handler
 * fetching all five Sanity collections on every request.
 *
 * Each id below becomes its own route at /sitemap/<id>.xml. Next does NOT
 * synthesize a combined /sitemap.xml index for this pattern (and that exact
 * path is itself reserved by the convention) — /sitemap-index.xml hand-builds
 * a real sitemap index instead, and robots.ts points there (see both files'
 * doc comments). This keeps two things bounded independently as content grows:
 *  - Google's 50,000-URL-per-sitemap-file limit — irrelevant at this site's
 *    scale, but per-collection chunking means each collection would need to
 *    individually reach that limit, not the site as a whole.
 *  - Request cost / cache-tag invalidation: a new post only touches the
 *    "posts" chunk (tagged `collection:post`), not projects/journal/tags/
 *    legal too. Previously every sitemap request re-fetched all five
 *    collections regardless of which one actually changed.
 *
 * "static" covers the hardcoded top-level routes that aren't a Sanity
 * collection (/, /about, /work, ...) — kept as its own id so it never blocks
 * on a Sanity fetch at all.
 */
export async function generateSitemaps() {
  return SITEMAP_IDS.map((id) => ({ id }));
}

/** The most recent of two possibly-null/undefined ISO date strings, or `now` if neither is set. */
function mostRecentDate(...dates: (string | null | undefined)[]): Date {
  const timestamps = dates
    .filter((date): date is string => Boolean(date))
    .map((date) => new Date(date).getTime());

  return timestamps.length > 0 ? new Date(Math.max(...timestamps)) : new Date();
}

async function staticEntries(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: SITE_CONFIG.URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_CONFIG.URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_CONFIG.URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.URL}/journal`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_CONFIG.URL}/work`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_CONFIG.URL}/skills`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_CONFIG.URL}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_CONFIG.URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_CONFIG.URL}/certifications`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_CONFIG.URL}/legal`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_CONFIG.URL}/style-guide`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_CONFIG.URL}/changelog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}

async function projectEntries(): Promise<MetadataRoute.Sitemap> {
  const { data: projects } = await sanityFetch({
    query: PROJECT_SLUGS_QUERY,
    tags: [createCollectionTag("project")],
    perspective: "published",
    stega: false,
  });

  return (projects ?? [])
    .filter((project) => project.slug?.current && !project.seo?.noindex)
    .map((project) => ({
      url: `${SITE_CONFIG.URL}/projects/${project.slug?.current}`,
      lastModified: mostRecentDate(project._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
}

async function postEntries(): Promise<MetadataRoute.Sitemap> {
  const { data: posts } = await sanityFetch({
    query: POST_SLUGS_QUERY,
    tags: [createCollectionTag("post")],
    perspective: "published",
    stega: false,
  });

  return (posts ?? [])
    .filter((post) => post.slug?.current && !post.seo?.noindex)
    .map((post) => ({
      url: `${SITE_CONFIG.URL}/blog/${post.slug?.current}`,
      lastModified: mostRecentDate(post.publishedAt, post._updatedAt),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    }));
}

async function journalEntries(): Promise<MetadataRoute.Sitemap> {
  const { data: entries } = await sanityFetch({
    query: JOURNAL_ENTRY_SLUGS_QUERY,
    tags: [createCollectionTag("journalEntry")],
    perspective: "published",
    stega: false,
  });

  return (entries ?? [])
    .filter((entry) => entry.slug?.current && !entry.seo?.noindex)
    .map((entry) => ({
      url: `${SITE_CONFIG.URL}/journal/${entry.slug?.current}`,
      lastModified: mostRecentDate(entry.publishedAt, entry._updatedAt),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }));
}

async function tagEntries(): Promise<MetadataRoute.Sitemap> {
  const { data: tags } = await sanityFetch({
    query: TAGS_QUERY,
    tags: [createCollectionTag("tag")],
    perspective: "published",
    stega: false,
  });

  return (tags ?? [])
    .filter((tag) => tag.slug?.current)
    .map((tag) => ({
      url: `${SITE_CONFIG.URL}/tags/${tag.slug?.current}`,
      lastModified: mostRecentDate(tag._updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.4,
    }));
}

async function legalEntries(): Promise<MetadataRoute.Sitemap> {
  const { data: legalDocs } = await sanityFetch({
    query: LEGAL_DOCUMENTS_QUERY,
    tags: [createCollectionTag("legal")],
    perspective: "published",
    stega: false,
  });

  return legalDocs
    .filter((doc) => doc.slug?.current && !doc.seo?.noindex)
    .map((doc) => ({
      url: `${SITE_CONFIG.URL}/legal/${doc.slug?.current}`,
      lastModified: mostRecentDate(doc._updatedAt),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    }));
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const sitemapId = (await id) as SitemapId;

  switch (sitemapId) {
    case "static":
      return staticEntries();
    case "projects":
      return projectEntries();
    case "posts":
      return postEntries();
    case "journal":
      return journalEntries();
    case "tags":
      return tagEntries();
    case "legal":
      return legalEntries();
    default:
      return [];
  }
}
