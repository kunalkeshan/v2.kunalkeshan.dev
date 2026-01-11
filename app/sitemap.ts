import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import { LEGAL_DOCUMENTS_QUERY } from "@/sanity/queries/legal";
import type { LEGAL_DOCUMENTS_QUERYResult } from "@/types/cms";
import { createCollectionTag } from "@/sanity/lib/cache-tags";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all dynamic content
  const [legalDocs] = await Promise.all([
    sanityFetch<LEGAL_DOCUMENTS_QUERYResult>({
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
