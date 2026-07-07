import type { MetadataRoute } from "next";

import { sanityFetch } from "@workspace/sanity/fetch";
import { createCollectionTag } from "@workspace/sanity/cache-tags";
import { LEGAL_DOCUMENTS_QUERY } from "@workspace/sanity/query";
import type { LEGAL_DOCUMENTS_QUERY_RESULT } from "@workspace/sanity/types";

import { SITE_CONFIG } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all dynamic content
  const [legalDocs] = await Promise.all([
    sanityFetch<LEGAL_DOCUMENTS_QUERY_RESULT>({
      query: LEGAL_DOCUMENTS_QUERY,
      tags: [createCollectionTag("legal")],
    }),
  ]);

  // Generate legal document entries
  const legalEntries: MetadataRoute.Sitemap = legalDocs
    .filter((doc) => doc.slug?.current)
    .map((doc) => ({
      url: `${SITE_CONFIG.URL}/legals/${doc.slug?.current}`,
      lastModified: doc._updatedAt ? new Date(doc._updatedAt) : new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    }));

  return [
    // Static pages
    {
      url: SITE_CONFIG.URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${SITE_CONFIG.URL}/legals`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    // Dynamic pages
    ...legalEntries,
  ];
}
