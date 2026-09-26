import { sanityFetch } from "@workspace/sanity/live"
import { createCollectionTag, createDocumentTag } from "@workspace/sanity/cache-tags"
import { urlFor } from "@workspace/sanity/image"
import { PROJECT_BY_SLUG_QUERY, SITE_CONFIG_QUERY } from "@workspace/sanity/query"

import { PROJECT_KIND_LABELS, PROJECT_STATUS_LABELS } from "@/lib/projects"
import { OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE, renderProjectOgImage } from "@/lib/og/project-og-image"

export const alt = "Project cover image"
export const size = OG_IMAGE_SIZE
export const contentType = OG_IMAGE_CONTENT_TYPE

/**
 * next/og file-convention route: Next serves this automatically as the
 * `og:image` for /projects/<slug>, no manual <meta> tag wiring in
 * generateMetadata required (see page.tsx, which deliberately omits
 * `openGraph.images`/`twitter.images` so this route is always used).
 *
 * Unlike blog/journal's equivalent route, this one is always reached — the
 * `project` schema has no manual `ogImage` override field, so there's no
 * "only when unset" branch to account for.
 *
 * `coverImage`/`icon` are forced to a raster JPEG here regardless of the
 * source asset's format: a project's cover can be an SVG (a logo/illustration
 * asset), and most social crawlers (WhatsApp included) silently drop an
 * `og:image` that resolves to `image/svg+xml`.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Generated images never carry stega markers — always published.
  const [{ data: project }, { data: siteConfig }] = await Promise.all([
    sanityFetch({
      query: PROJECT_BY_SLUG_QUERY,
      params: { slug },
      tags: [createCollectionTag("project"), createDocumentTag("project", slug)],
      perspective: "published",
      stega: false,
    }),
    sanityFetch({
      query: SITE_CONFIG_QUERY,
      tags: [createCollectionTag("siteConfig")],
      perspective: "published",
      stega: false,
    }),
  ])

  const title = project?.title ?? "Project"
  const tagline = project?.tagline ?? project?.summary ?? ""
  const siteName = siteConfig?.heroName ?? "Kunal Keshan"
  const siteLogoUrl = siteConfig?.logo?.asset
    ? urlFor(siteConfig.logo)
        .width(112)
        .height(112)
        .fit("crop")
        .format("jpg")
        .quality(85)
        .url()
    : undefined
  const kindLabel = project?.kind ? (PROJECT_KIND_LABELS[project.kind] ?? null) : null
  const statusLabel = project?.status
    ? (PROJECT_STATUS_LABELS[project.status] ?? null)
    : null

  // Cover image (screenshot/artwork) first, icon (logo mark) as a smaller
  // fallback — same precedence as which one reads as "the" image for a
  // project elsewhere in the app. Cropped to fill for a cover image; a
  // square icon is instead scaled to fit (never cropped) so the mark is
  // never cut off, matching how the icon renders elsewhere in the app.
  const thumbnailFit = project?.coverImage?.asset ? "cover" : "contain"
  const thumbnailUrl = project?.coverImage?.asset
    ? urlFor(project.coverImage)
        .width(1000)
        .height(1260)
        .fit("crop")
        .format("jpg")
        .quality(85)
        .url()
    : project?.icon?.asset
      ? urlFor(project.icon)
          .width(700)
          .fit("max")
          .format("jpg")
          .bg("faf9f6")
          .quality(85)
          .url()
      : undefined

  return renderProjectOgImage({
    title,
    tagline,
    siteName,
    kindLabel,
    statusLabel,
    thumbnailUrl,
    thumbnailFit,
    siteLogoUrl,
  })
}
