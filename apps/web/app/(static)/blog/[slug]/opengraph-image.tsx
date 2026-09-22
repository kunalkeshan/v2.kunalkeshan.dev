import { sanityFetch } from "@workspace/sanity/fetch"
import { createCollectionTag, createDocumentTag } from "@workspace/sanity/cache-tags"
import { POST_BY_SLUG_QUERY, SITE_CONFIG_QUERY } from "@workspace/sanity/query"
import type {
  POST_BY_SLUG_QUERY_RESULT,
  SITE_CONFIG_QUERY_RESULT,
} from "@workspace/sanity/types"

import { readingTime } from "@/lib/reading-time"
import { OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE, renderWritingOgImage } from "@/lib/og/writing-og-image"

export const alt = "Blog post cover image"
export const size = OG_IMAGE_SIZE
export const contentType = OG_IMAGE_CONTENT_TYPE

/**
 * next/og file-convention route: Next serves this automatically as the
 * `og:image` for /blog/<slug> whenever a request needs one, no manual
 * <meta> tag wiring in generateMetadata required.
 *
 * Only renders the generated template when the post has no manual `ogImage`
 * override — that fallback is handled in generateMetadata (page.tsx), which
 * points `openGraph.images` straight at the Sanity asset URL instead of this
 * route when one is set. This route is therefore only ever reached for
 * posts *without* an override, so it never needs to check for one itself.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [post, siteConfig] = await Promise.all([
    sanityFetch<POST_BY_SLUG_QUERY_RESULT>({
      query: POST_BY_SLUG_QUERY,
      params: { slug },
      tags: [createCollectionTag("post"), createDocumentTag("post", slug)],
    }),
    sanityFetch<SITE_CONFIG_QUERY_RESULT>({
      query: SITE_CONFIG_QUERY,
      tags: [createCollectionTag("siteConfig")],
    }),
  ])

  const title = post?.title ?? "Blog"
  const siteName = siteConfig?.heroName ?? "Kunal Keshan"
  const tagNames = (post?.tags ?? [])
    .map((tag) => tag.name)
    .filter((name): name is string => Boolean(name))
  const dateLabel = post?.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : ""
  const readingTimeLabel = readingTime(post?.body)

  return renderWritingOgImage({
    title,
    siteName,
    tagNames,
    dateLabel,
    readingTimeLabel,
  })
}
