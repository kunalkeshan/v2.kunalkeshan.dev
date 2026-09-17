import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

import { env } from "@workspace/env/client";

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
});

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};

/**
 * Build a logo URL for display in a fixed-size box.
 *
 * `fit=max` scales the image to fit inside `width` x `height` without padding
 * it back out to those dimensions and without upscaling past its native size,
 * which is what a `object-contain` box wants to be handed.
 *
 * ## What this deliberately does not try to do
 *
 * Logo source files are authored inconsistently — some are tight crops, others
 * park the mark in a square canvas with a wide margin baked in. That padding is
 * *pixels*, indistinguishable from the artwork, so a padded logo renders
 * optically smaller than a tightly-cropped one beside it no matter what CSS or
 * URL parameters are applied.
 *
 * There is no server-side fix available here: Sanity's image API has **no**
 * auto-trim parameter (the supported set is w/h/dpr/fit/crop/rect/bg/pad and
 * the filters — see the URL docs). The only crop it offers is `rect`, which
 * needs exact pixel coordinates per asset, i.e. the same manual work as fixing
 * the file. So the fix belongs in the asset: crop the margin out of the source
 * image, or set a tight crop on it in the Studio, and every consumer benefits.
 *
 * @see https://www.sanity.io/docs/image-urls
 */
export const logoUrlFor = (
  source: SanityImageSource,
  { width }: { width: number }
) =>
  // Width only, deliberately. Sending a height too makes `fit=max` scale to
  // whichever constraint bites first, so a square logo in a wide box comes back
  // smaller than requested. The CSS caps the height instead, and `fit=max`
  // still guarantees the image is never upscaled past its native size.
  builder.image(source).fit("max").width(width).url();
