import { sanityFetch } from "@workspace/sanity/live"
import { createCollectionTag } from "@workspace/sanity/cache-tags"
import { SITE_CONFIG_QUERY } from "@workspace/sanity/query"
import { urlFor } from "@workspace/sanity/image"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

/**
 * Next.js file-convention icon route: serves the browser tab favicon,
 * sourced from the `favicon` field on the `siteConfig` singleton instead of
 * a static file, so Kunal can change it from the Studio without a redeploy.
 *
 * Statically optimized/cached by Next since no request-time APIs are used
 * here (no `draftMode()`), same as the other build-time-only Sanity fetches
 * in this app (generateMetadata, sitemap.ts, opengraph-image routes) — so
 * this literally passes `{ perspective: "published", stega: false }` rather
 * than the dynamic, draft-mode-aware fetch options used in request-scoped
 * layouts/pages.
 */
export default async function Icon() {
  const { data: siteConfig } = await sanityFetch({
    query: SITE_CONFIG_QUERY,
    tags: [createCollectionTag("siteConfig")],
    perspective: "published",
    stega: false,
  })

  if (!siteConfig?.favicon?.asset) {
    return new Response(null, { status: 404 })
  }

  const imageUrl = urlFor(siteConfig.favicon)
    .width(size.width)
    .height(size.height)
    .fit("crop")
    .format("png")
    .url()

  const response = await fetch(imageUrl)
  const buffer = await response.arrayBuffer()

  return new Response(buffer, {
    headers: { "Content-Type": contentType },
  })
}
