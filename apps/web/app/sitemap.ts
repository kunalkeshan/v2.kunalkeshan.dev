import type { MetadataRoute } from "next";

import { sanityFetch } from "@workspace/sanity/fetch";
import { createCollectionTag } from "@workspace/sanity/cache-tags";
import {
  LEGAL_DOCUMENTS_QUERY,
  PROJECT_SLUGS_QUERY,
} from "@workspace/sanity/query";
import type {
  LEGAL_DOCUMENTS_QUERY_RESULT,
  PROJECT_SLUGS_QUERY_RESULT,
} from "@workspace/sanity/types";

import { SITE_CONFIG } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all dynamic content
  const [legalDocs, projects] = await Promise.all([
    sanityFetch<LEGAL_DOCUMENTS_QUERY_RESULT>({
      query: LEGAL_DOCUMENTS_QUERY,
      tags: [createCollectionTag("legal")],
    }),
    sanityFetch<PROJECT_SLUGS_QUERY_RESULT>({
      query: PROJECT_SLUGS_QUERY,
      tags: [createCollectionTag("project")],
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

  // Every project document gets a real page (unlike v1, whose sitemap listed
  // all 16 projects while only 4 had pages — the other 12 redirected away).
  const projectEntries: MetadataRoute.Sitemap = (projects ?? [])
    .filter((project) => project.slug?.current)
    .map((project) => ({
      url: `${SITE_CONFIG.URL}/projects/${project.slug?.current}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
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
      url: `${SITE_CONFIG.URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.URL}/experience`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_CONFIG.URL}/skills`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${SITE_CONFIG.URL}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${SITE_CONFIG.URL}/legals`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    // Dynamic pages
    ...projectEntries,
    ...legalEntries,
  ];
}
