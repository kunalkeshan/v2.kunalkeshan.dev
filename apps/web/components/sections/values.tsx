"use client"

import Image from "next/image"

import { Container } from "@workspace/ui/components/container"
import { cardLift, cn } from "@workspace/ui/lib/utils"
import { urlFor } from "@workspace/sanity/image"
import type { VALUES_QUERY_RESULT } from "@workspace/sanity/types"

import { useReveal } from "@/hooks/use-reveal"

type Value = NonNullable<VALUES_QUERY_RESULT>[number]

interface ValuesGridProps {
  values: VALUES_QUERY_RESULT
}

/**
 * Horizontal card — art panel beside the copy, rather than the vertical stack
 * `ServiceCard` uses.
 *
 * v1 put the art in a fixed side panel, which this deliberately does not: that
 * panel was a 180x316 box holding an 84-135px illustration, so every card
 * carried 180-230px of empty tint, and the narrow remaining column squeezed the
 * copy. Here the illustration sits inline above the copy at a fixed render
 * height, so the copy gets the card's full width and the source images' wildly
 * different aspect ratios (0.86:1 through 1.44:1) stop affecting layout.
 *
 * `group` drives the illustration's hover zoom from the card's own hover.
 */
const cardShell = cn(
  "group flex w-full flex-col overflow-hidden rounded-lg border-3 border-border bg-card",
  cardLift
)

function ValueCard({ value }: { value: Value }) {
  // No `.height()`: Sanity ignores w/h/rect for SVGs and serves the original
  // file, so asking for a square crop yields a URL whose delivered image is not
  // square — which is what Next's aspect-ratio warning reports. Same trap, and
  // same fix, as ServiceCard.
  const illustrationUrl = value.illustration?.asset
    ? urlFor(value.illustration).width(280).url()
    : undefined

  // Real ratio from the asset rather than an assumed 1:1. Already in the query
  // payload via `asset->`, so this costs no extra GROQ.
  const dimensions = value.illustration?.asset?.metadata?.dimensions

  return (
    <div className={cardShell}>
      <div className="flex flex-1 flex-col items-start gap-3 p-6">
        {illustrationUrl && (
          <Image
            src={illustrationUrl}
            alt={value.illustration?.alt ?? ""}
            width={dimensions?.width ?? 140}
            height={dimensions?.height ?? 140}
            sizes="96px"
            className={cn(
              // Height is fixed and width follows, so a portrait and a
              // landscape source occupy the same vertical space. `origin-left`
              // keeps the hover zoom anchored to the card's text column rather
              // than growing away from it.
              "h-16 w-auto origin-left object-contain md:h-20",
              // Explicit resting scale + GPU promotion so the transform
              // interpolates symmetrically in both directions.
              "scale-100 transform-gpu will-change-transform",
              "transition-transform duration-press ease-snap group-hover:scale-110",
              "motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            )}
          />
        )}
        <h3 className="mt-1 font-heading text-lg font-black md:text-xl">
          {value.title}
        </h3>
        <p className="text-sm leading-relaxed text-body-foreground md:text-base">
          {value.description}
        </p>
      </div>
    </div>
  )
}

/**
 * The grid on its own, with no heading/section/motion wrapper — same split as
 * `ServicesGrid`, so a future surface can reuse it under its own `<h1>`.
 */
export function ValuesGrid({ values }: ValuesGridProps) {
  if (!values || values.length === 0) return null

  return (
    /*
     * A masonry column flow, not a grid — deliberately.
     *
     * The copy lengths are genuinely uneven and are not being edited: five
     * values sit at ~190-220 characters while Perspective and Discipline run
     * close to double that. CSS grid gives two bad options for that spread.
     * Stretching cards to a shared row height pads every short card in a row
     * with trailing dead space; letting each card end at its own copy
     * (`items-start`) leaves ragged gaps between rows, which reads as broken in
     * a 3-up layout.
     *
     * `columns` sidesteps the choice: there are no rows to align, so each card
     * ends exactly at its copy and the next one packs directly beneath it. The
     * variance becomes vertical flow rather than holes. `break-inside-avoid`
     * keeps a card from splitting across a column boundary.
     */
    <ul className="gap-6 space-y-6 sm:columns-2 sm:space-y-0 xl:columns-3 [&>li]:mb-6 [&>li]:break-inside-avoid">
      {values.map((value) => (
        <li key={value._id} className="list-none">
          <ValueCard value={value} />
        </li>
      ))}
    </ul>
  )
}

interface ValuesProps {
  values: VALUES_QUERY_RESULT
  heading: string
  intro: string
}

/**
 * Note the plain `<h2>`: no `HighlightText` here. This section follows the
 * inverted marquee band, and a third highlighter sweep that soon after the dark
 * break reads as decoration rather than emphasis. The `/about` page spends its
 * two sweeps on the `<h1>` and the story heading.
 */
const Values = ({ values, heading, intro }: ValuesProps) => {
  const { ref, state } = useReveal<HTMLElement>("in-view")

  if (!values || values.length === 0) return null

  return (
    <section
      id="values"
      ref={ref}
      data-reveal={state}
      className="reveal-delay-200 py-10 md:py-16"
    >
      <Container>
        <h2 className="font-heading text-2xl font-black sm:text-3xl">
          {heading}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-body-foreground md:text-lg">
          {intro}
        </p>

        <div className="mt-8">
          <ValuesGrid values={values} />
        </div>
      </Container>
    </section>
  )
}

export default Values
