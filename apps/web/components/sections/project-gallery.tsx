"use client"

import { useState } from "react"
import Image from "next/image"
import { Expand } from "lucide-react"
import Lightbox from "yet-another-react-lightbox"
import Captions from "yet-another-react-lightbox/plugins/captions"
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import "yet-another-react-lightbox/styles.css"
import "yet-another-react-lightbox/plugins/captions.css"
import "yet-another-react-lightbox/plugins/thumbnails.css"
import "./project-gallery.css"

import { Badge } from "@workspace/ui/components/badge"
import { cardLift, cn } from "@workspace/ui/lib/utils"
import { urlFor } from "@workspace/sanity/image"
import type { PROJECT_BY_SLUG_QUERY_RESULT } from "@workspace/sanity/types"

import { trackUiEvent } from "@/lib/analytics"

type Gallery = NonNullable<PROJECT_BY_SLUG_QUERY_RESULT>["gallery"]

interface ProjectGalleryProps {
  gallery: Gallery
  title: string | null
  slug?: string | null
}

/**
 * Screenshot grid that opens into a full-screen lightbox.
 *
 * v1 hand-rolled this (a fixed overlay plus an Escape listener) with no zoom,
 * no swipe, and no focus management. `yet-another-react-lightbox` is MIT, has
 * zero runtime dependencies, and declares React 19 peer support, so it replaces
 * that rather than porting its limitations forward.
 */
export function ProjectGallery({ gallery, title, slug }: ProjectGalleryProps) {
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
      <p className="mt-2 text-sm text-muted-foreground">
        Click any screenshot to view it full size.
      </p>

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, position) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={() => {
                trackUiEvent({
                  name: "screenshot_open",
                  placement: "project_detail",
                  index: String(position),
                  project: slug ?? title ?? undefined,
                })
                setIndex(position)
              }}
              aria-label={`View full size: ${
                image.alt ||
                `screenshot ${position + 1} of ${images.length}${
                  title ? ` for ${title}` : ""
                }`
              }`}
              className={cn(
                "group relative block cursor-zoom-in w-full overflow-hidden rounded-lg border-3 border-border bg-muted",
                cardLift,
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
              {/* Hover/focus cue. Decorative: the button's aria-label already
                  states the action for assistive tech. */}
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-0 flex items-center justify-center bg-foreground/40",
                  "opacity-0 transition-opacity duration-press ease-snap",
                  "group-hover:opacity-100 group-focus-visible:opacity-100",
                  "motion-reduce:transition-none"
                )}
              >
                <Badge className="bg-background text-foreground">
                  <Expand data-icon="inline-start" />
                  Expand
                </Badge>
              </span>
              {/* Touch has no hover, so show a permanent corner cue there. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-2 bottom-2 hidden size-7 items-center justify-center rounded-sm border-2 border-border bg-background text-foreground shadow-sm [@media(hover:none)]:flex"
              >
                <Expand className="size-3.5" />
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
        className="gallery-lightbox"
        render={{
          controls: () => (
            <div className="gallery-lightbox-keys" aria-hidden="true">
              <kbd>Esc</kbd> close <kbd>←</kbd>
              <kbd>→</kbd> browse
            </div>
          ),
        }}
      />
    </section>
  )
}
