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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Public sitemap: always published, never stega — no draft-mode concept here.
  const [
    { data: legalDocs },
    { data: projects },
    { data: posts },
    { data: journalEntries },
    { data: tags },
  ] = await Promise.all([
    sanityFetch({
      query: LEGAL_DOCUMENTS_QUERY,
      tags: [createCollectionTag("legal")],
      perspective: "published",
      stega: false,
    }),
    sanityFetch({
      query: PROJECT_SLUGS_QUERY,
      tags: [createCollectionTag("project")],
      perspective: "published",
      stega: false,
    }),
    sanityFetch({
      query: POST_SLUGS_QUERY,
      tags: [createCollectionTag("post")],
      perspective: "published",
      stega: false,
    }),
    sanityFetch({
      query: JOURNAL_ENTRY_SLUGS_QUERY,
      tags: [createCollectionTag("journalEntry")],
      perspective: "published",
      stega: false,
    }),
    sanityFetch({
      query: TAGS_QUERY,
      tags: [createCollectionTag("tag")],
      perspective: "published",
      stega: false,
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
    {
      url: `${SITE_CONFIG.URL}/style-guide`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    // Dynamic pages
    ...projectEntries,
    ...postEntries,
    ...journalEntryEntries,
    ...tagEntries,
    ...legalEntries,
  ];
}
