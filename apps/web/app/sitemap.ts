import type { MetadataRoute } from "next";

import { sanityFetch } from "@workspace/sanity/fetch";
import { createCollectionTag } from "@workspace/sanity/cache-tags";
import {
  JOURNAL_ENTRY_SLUGS_QUERY,
  LEGAL_DOCUMENTS_QUERY,
  POST_SLUGS_QUERY,
  PROJECT_SLUGS_QUERY,
  TAGS_QUERY,
} from "@workspace/sanity/query";
import type {
  JOURNAL_ENTRY_SLUGS_QUERY_RESULT,
  LEGAL_DOCUMENTS_QUERY_RESULT,
  POST_SLUGS_QUERY_RESULT,
  PROJECT_SLUGS_QUERY_RESULT,
  TAGS_QUERY_RESULT,
} from "@workspace/sanity/types";

import { SITE_CONFIG } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all dynamic content
  const [legalDocs, projects, posts, journalEntries, tags] = await Promise.all([
    sanityFetch<LEGAL_DOCUMENTS_QUERY_RESULT>({
      query: LEGAL_DOCUMENTS_QUERY,
      tags: [createCollectionTag("legal")],
    }),
    sanityFetch<PROJECT_SLUGS_QUERY_RESULT>({
      query: PROJECT_SLUGS_QUERY,
      tags: [createCollectionTag("project")],
    }),
    sanityFetch<POST_SLUGS_QUERY_RESULT>({
      query: POST_SLUGS_QUERY,
      tags: [createCollectionTag("post")],
    }),
    sanityFetch<JOURNAL_ENTRY_SLUGS_QUERY_RESULT>({
      query: JOURNAL_ENTRY_SLUGS_QUERY,
      tags: [createCollectionTag("journalEntry")],
    }),
    sanityFetch<TAGS_QUERY_RESULT>({
      query: TAGS_QUERY,
      tags: [createCollectionTag("tag")],
    }),
  ]);

  // Generate legal document entries
  const legalEntries: MetadataRoute.Sitemap = legalDocs
    .filter((doc) => doc.slug?.current)
    .map((doc) => ({
      url: `${SITE_CONFIG.URL}/legal/${doc.slug?.current}`,
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

  const postEntries: MetadataRoute.Sitemap = (posts ?? [])
    .filter((post) => post.slug?.current)
    .map((post) => ({
      url: `${SITE_CONFIG.URL}/blog/${post.slug?.current}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    }));

  const journalEntryEntries: MetadataRoute.Sitemap = (journalEntries ?? [])
    .filter((entry) => entry.slug?.current)
    .map((entry) => ({
      url: `${SITE_CONFIG.URL}/journal/${entry.slug?.current}`,
      lastModified: entry.publishedAt ? new Date(entry.publishedAt) : new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }));

  const tagEntries: MetadataRoute.Sitemap = (tags ?? [])
    .filter((tag) => tag.slug?.current)
    .map((tag) => ({
      url: `${SITE_CONFIG.URL}/tags/${tag.slug?.current}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.4,
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
      url: `${SITE_CONFIG.URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_CONFIG.URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.URL}/journal`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${SITE_CONFIG.URL}/work`,
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
      url: `${SITE_CONFIG.URL}/legal`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    // Dynamic pages
    ...projectEntries,
    ...postEntries,
    ...journalEntryEntries,
    ...tagEntries,
    ...legalEntries,
  ];
}
