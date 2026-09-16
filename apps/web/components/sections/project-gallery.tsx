"use client"

import { useState } from "react"
import Image from "next/image"
import Lightbox from "yet-another-react-lightbox"
import Captions from "yet-another-react-lightbox/plugins/captions"
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import "yet-another-react-lightbox/styles.css"
import "yet-another-react-lightbox/plugins/captions.css"
import "yet-another-react-lightbox/plugins/thumbnails.css"

import { cn } from "@workspace/ui/lib/utils"
import { urlFor } from "@workspace/sanity/image"
import type { PROJECT_BY_SLUG_QUERY_RESULT } from "@workspace/sanity/types"

type Gallery = NonNullable<PROJECT_BY_SLUG_QUERY_RESULT>["gallery"]

interface ProjectGalleryProps {
  gallery: Gallery
  title: string | null
}

/**
 * Screenshot grid that opens into a full-screen lightbox.
 *
 * v1 hand-rolled this (a fixed overlay plus an Escape listener) with no zoom,
 * no swipe, and no focus management. `yet-another-react-lightbox` is MIT, has
 * zero runtime dependencies, and declares React 19 peer support, so it replaces
 * that rather than porting its limitations forward.
 */
export function ProjectGallery({ gallery, title }: ProjectGalleryProps) {
  const [index, setIndex] = useState(-1)

  if (!gallery || gallery.length === 0) return null

  const images = gallery
    .filter((image) => image.asset)
    .map((image) => ({
      // Full-size for the lightbox, thumbnail-size for the grid, so the grid
      // doesn't pull down several megabytes of screenshots on first paint.
      src: urlFor(image).width(1600).url(),
      thumbnail: urlFor(image).width(640).height(400).fit("crop").url(),
      alt: image.alt ?? "",
      description: image.caption ?? undefined,
    }))

  if (images.length === 0) return null

  return (
    <section aria-labelledby="gallery-heading" className="mt-12">
      <h2
        id="gallery-heading"
        className="font-heading text-2xl font-black sm:text-3xl"
      >
        Screenshots
      </h2>

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, position) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={() => setIndex(position)}
              aria-label={
                image.alt ||
                `Open screenshot ${position + 1} of ${images.length}${
                  title ? ` for ${title}` : ""
                }`
              }
              className={cn(
                "group block w-full overflow-hidden rounded-lg border-3 border-border bg-muted",
                "translate-y-0 transform-gpu will-change-transform",
                "transition-[transform,box-shadow] duration-press ease-snap",
                "hover:-translate-y-2 hover:shadow-xl",
                "motion-reduce:transition-[box-shadow] motion-reduce:hover:translate-y-0",
                "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
              )}
            >
              <span className="block aspect-[16/10] overflow-hidden">
                <Image
                  src={image.thumbnail}
                  alt={image.alt}
                  width={640}
                  height={400}
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                  className={cn(
                    "h-full w-full object-cover",
                    "scale-100 transform-gpu will-change-transform",
                    "transition-transform duration-press ease-snap group-hover:scale-110",
                    "motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  )}
                />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={images}
        plugins={[Captions, Thumbnails, Zoom]}
        // Single-image galleries shouldn't show dead prev/next affordances.
        carousel={{ finite: images.length <= 1 }}
        controller={{ closeOnBackdropClick: true }}
      />
    </section>
  )
}
