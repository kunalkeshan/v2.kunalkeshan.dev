import type { MetadataRoute } from "next";

import { sanityFetch } from "@workspace/sanity/live";
import { createCollectionTag } from "@workspace/sanity/cache-tags";
import { SITE_CONFIG_QUERY } from "@workspace/sanity/query";

/**
 * Web app manifest, sourced from the `siteConfig` singleton the same way
 * icon.tsx/apple-icon.tsx are — no separate manifest-only Sanity fields, so
 * editing the site title/description in Studio keeps this current for free.
 * `icons` points at the existing dynamic icon routes rather than a static
 * file, matching the rest of the favicon setup (see icon.tsx's doc comment
 * for why those fetches are literal `{ perspective: "published", stega:
 * false }` rather than draft-mode-aware).
 */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { data: siteConfig } = await sanityFetch({
    query: SITE_CONFIG_QUERY,
    tags: [createCollectionTag("siteConfig")],
    perspective: "published",
    stega: false,
  });

  const name = siteConfig?.title || "Kunal Keshan — Software Engineer";
  const shortName = siteConfig?.heroName || "Kunal Keshan";

  return {
    name,
    short_name: shortName,
    description: siteConfig?.description ?? undefined,
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f6",
    theme_color: "#ffa500",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
