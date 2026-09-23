import { sanityFetch } from "@workspace/sanity/live"
import { createCollectionTag } from "@workspace/sanity/cache-tags"
import { SITE_CONFIG_QUERY } from "@workspace/sanity/query"
import { urlFor } from "@workspace/sanity/image"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

/**
 * Next.js file-convention icon route: serves the Apple touch icon, sourced
 * from the same `favicon` field on `siteConfig` as `icon.tsx`, just resized
 * to Apple's 180x180 convention. See icon.tsx for why this fetch is literal
 * `{ perspective: "published", stega: false }` rather than draft-mode-aware.
 */
export default async function AppleIcon() {
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
