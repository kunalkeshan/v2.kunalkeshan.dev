"use client"

import { useState } from "react"
import Image from "next/image"
import Lightbox from "yet-another-react-lightbox"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import "yet-another-react-lightbox/styles.css"

import { urlFor } from "@workspace/sanity/image"

interface PortableTextImageValue {
  asset?: {
    metadata?: { dimensions?: { width?: number; height?: number } }
  } | null
  alt?: string
}

/**
 * Case-study body images get the same click-to-zoom treatment as the
 * Gallery/Screenshots section (`ProjectGallery`) — a technical diagram
 * embedded mid-narrative benefits from zoom just as much as a screenshot
 * does, and leaving one static while the other zooms read as inconsistent.
 *
 * Its own standalone lightbox rather than joining the Gallery's: mixing
 * case-study diagrams into that carousel would make its prev/next
 * navigation jump between unrelated images.
 */
export function PortableTextImage({ value }: { value: PortableTextImageValue }) {
  const [open, setOpen] = useState(false)

  if (!value?.asset) return null

  // Width only, `fit=max`: same crop-avoidance as the static render below
  // this replaces — see `portable-text-components.tsx` for why.
  const displayUrl = urlFor(value)
    .format("webp")
    .quality(80)
    .width(1200)
    .fit("max")
    .url()
  const fullSizeUrl = urlFor(value)
    .format("webp")
    .quality(90)
    .width(2400)
    .fit("max")
    .url()
  const dimensions = value.asset?.metadata?.dimensions
  const alt = value.alt ?? ""

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={alt ? `Open image: ${alt}` : "Open image"}
        className="my-8 block w-full cursor-zoom-in rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      >
        <Image
          src={displayUrl}
          alt={alt}
          width={dimensions?.width ?? 1200}
          height={dimensions?.height ?? 800}
          className="w-full h-auto rounded-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
        />
      </button>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src: fullSizeUrl, alt }]}
        plugins={[Zoom]}
        carousel={{ finite: true }}
        controller={{ closeOnBackdropClick: true }}
      />
    </>
  )
}
