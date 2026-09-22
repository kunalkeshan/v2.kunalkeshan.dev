import { sanityFetch } from "@workspace/sanity/fetch"
import { createCollectionTag, createDocumentTag } from "@workspace/sanity/cache-tags"
import { JOURNAL_ENTRY_BY_SLUG_QUERY, SITE_CONFIG_QUERY } from "@workspace/sanity/query"
import type {
  JOURNAL_ENTRY_BY_SLUG_QUERY_RESULT,
  SITE_CONFIG_QUERY_RESULT,
} from "@workspace/sanity/types"

import { readingTime } from "@/lib/reading-time"
import { OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE, renderWritingOgImage } from "@/lib/og/writing-og-image"

export const alt = "Journal entry cover image"
export const size = OG_IMAGE_SIZE
export const contentType = OG_IMAGE_CONTENT_TYPE

/**
 * Journal equivalent of blog/[slug]/opengraph-image.tsx — same generated
 * template, same fallback-only-when-unset contract, separate collection.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [entry, siteConfig] = await Promise.all([
    sanityFetch<JOURNAL_ENTRY_BY_SLUG_QUERY_RESULT>({
      query: JOURNAL_ENTRY_BY_SLUG_QUERY,
      params: { slug },
      tags: [
        createCollectionTag("journalEntry"),
        createDocumentTag("journalEntry", slug),
      ],
    }),
    sanityFetch<SITE_CONFIG_QUERY_RESULT>({
      query: SITE_CONFIG_QUERY,
      tags: [createCollectionTag("siteConfig")],
    }),
  ])

  const title = entry?.title ?? "Journal"
  const siteName = siteConfig?.heroName ?? "Kunal Keshan"
  const tagNames = (entry?.tags ?? [])
    .map((tag) => tag.name)
    .filter((name): name is string => Boolean(name))
  const dateLabel = entry?.publishedAt
    ? new Date(entry.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : ""
  const readingTimeLabel = readingTime(entry?.body)

  return renderWritingOgImage({
    title,
    siteName,
    tagNames,
    dateLabel,
    readingTimeLabel,
  })
}
