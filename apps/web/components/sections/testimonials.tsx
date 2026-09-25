"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Quote } from "lucide-react"

import { Container } from "@workspace/ui/components/container"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@workspace/ui/components/carousel"
import { CarouselDots } from "@workspace/ui/components/carousel-dots"
import { cn } from "@workspace/ui/lib/utils"
import { logoUrlFor, urlFor } from "@workspace/sanity/image"
import type { FEATURED_TESTIMONIALS_QUERY_RESULT } from "@workspace/sanity/types"

import { HighlightText } from "@/components/highlight-text"
import { useRevealGroup } from "@/hooks/use-reveal"
import { Reveal } from "@/components/reveal"
import { trackLinkClick } from "@/lib/analytics"

type Testimonial = FEATURED_TESTIMONIALS_QUERY_RESULT[number]

/**
 * How many slides on either side of the active one get their image fetched
 * ahead of time. One is enough: you can only reach a neighbour by one arrow
 * press, drag, or dot jump, and by the time the transition finishes the image
 * has been decoded.
 *
 * The point of the cap is what it excludes. Eagerly loading all nine headshots
 * and eight logos would be ~17 requests before the section is even scrolled to,
 * for a section that shows one quote at a time.
 */
const PRELOAD_RADIUS = 1

/**
 * The card reserves height for the longest quote rather than sizing to its
 * content.
 *
 * The migrated quotes span 334–975 characters, a 2.9x spread. A self-sizing
 * card would change height on every slide change and shove the rest of the page
 * up or down mid-read — a large part of what read as "glitchy" in v1. Reserving
 * the space costs some whitespace under the shortest quotes and buys a section
 * whose geometry never moves. Clamping the text instead was rejected: it would
 * hide most of the longest testimonial behind a toggle.
 *
 * These are floors, not fixed heights — a longer quote added later still grows
 * the card rather than overflowing it.
 */
const cardMinHeight = "min-h-[34rem] sm:min-h-[30rem] lg:min-h-[24rem]"

/**
 * The box a company logo is fitted into, in CSS pixels at the `md` breakpoint.
 *
 * Deliberately wider than tall: these logos run from a 1:1 roundel to a ~3:1
 * wordmark, and a square box would scale a wide mark down by its height until
 * it read as a stamp. Requested from the CDN at 2x for retina.
 *
 * Keep in sync with the `max-h-*`/`max-w-*` classes on the image below.
 */
const LOGO_BOX = { width: 288, height: 96 } as const

function TestimonialCard({
  testimonial,
  eager,
}: {
  testimonial: Testimonial
  eager: boolean
}) {
  const author = testimonial.author
  const organization = author?.organization
  // A referenced Organization wins; `organizationName` covers people whose
  // company has no document of its own (a personal brand, a one-off client).
  const companyName = organization?.name ?? author?.organizationName ?? null

  const photoUrl = author?.photo?.asset
    ? urlFor(author.photo).width(480).height(480).fit("crop").url()
    : undefined

  // 2x the CSS box so the logo stays sharp on retina; `fit=max` means the CDN
  // scales it down to fit rather than padding it out to those dimensions.
  const logoUrl = organization?.logo?.asset
    ? logoUrlFor(organization.logo, { width: LOGO_BOX.width * 2 })
    : undefined

  /*
   * The logo's real shape, straight off the asset — already in the query
   * payload via `asset->`, so it costs no extra GROQ.
   *
   * This is what makes the logo slot shape-agnostic. Handing Next the true
   * intrinsic size lets it reserve the right aspect box and request a variant
   * at that aspect; the CSS then only caps how large it may get. Any logo
   * uploaded later — square, wide wordmark, tall lockup — is handled without
   * touching this file.
   */
  const logoDimensions = organization?.logo?.asset?.metadata?.dimensions

  const nameNode = author?.website ? (
    <Link
      href={author.website}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackLinkClick({
          platform: "testimonial_author",
          url: author.website ?? "",
          placement: "testimonials",
        })
      }
      className="rounded-sm underline-offset-2 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
    >
      {author.name}
    </Link>
  ) : (
    author?.name
  )

  return (
    <figure
      className={cn(
        "relative flex rounded-lg border-3 border-border bg-card",
        // Right padding reserves the column the portrait overlays, so the copy
        // never runs underneath it (v1 did the same with `lg:pr-72`).
        "flex-col p-6 pt-10 lg:block lg:py-11 lg:pr-72 lg:pl-11",
        // The card is narrower than its slide, and the portrait spends that
        // difference overhanging the right edge. Without the margin the circle
        // would have to stay inside the card (losing the break-out look) or
        // spill into the neighbouring slide.
        "lg:mr-24 xl:mr-28",
        // No `cardLift`: the card is the slide, not a link, so a hover lift
        // would advertise an affordance that isn't there.
        cardMinHeight
      )}
    >
      {/* Decorative — the blockquote already conveys this is a quote. Straddles
          the card's top-left corner, as on the reference. */}
      <span
        aria-hidden="true"
        className="absolute -top-7 left-6 z-10 flex size-14 items-center justify-center rounded-full bg-foreground text-background md:-top-8 md:left-10 md:size-16"
      >
        <Quote className="size-6 fill-current md:size-7" />
      </span>

      <div className="flex flex-1 flex-col justify-center lg:min-w-0">
        <blockquote className="text-base leading-relaxed whitespace-pre-line text-body-foreground md:text-lg">
          {testimonial.quote}
        </blockquote>

        <figcaption className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 lg:pr-11">
          {logoUrl && (
            /*
             * Height-capped, width-free — deliberately not `fill` inside a
             * fixed-aspect wrapper, and deliberately no `max-w-*` either.
             *
             * `fill` forces every logo into one box's aspect ratio. Next then
             * re-encodes the image to that aspect, so a 1.41:1 logo dropped in
             * a 3:1 slot came back physically cropped (259x85 from a 12628x8929
             * source) — `object-contain` was faithfully rendering an
             * already-mangled file, which is why artwork went missing.
             *
             * A fixed height plus free-running width lets a logo of any shape
             * render at its true proportions: a wide wordmark simply runs
             * wider, a square mark stays square, neither is ever cropped or
             * squeezed into a box. Nothing here assumes an aspect ratio, so
             * future uploads of any shape just work.
             *
             * Caveat no code can fix: a file with a margin baked into its
             * canvas still reads optically smaller, because that padding is
             * pixels. Fix those at the asset — see `logoUrlFor`.
             */
            <Image
              src={logoUrl}
              alt={organization?.logo?.alt ?? ""}
              width={logoDimensions?.width ?? LOGO_BOX.width}
              height={logoDimensions?.height ?? LOGO_BOX.height}
              loading={eager ? "eager" : "lazy"}
              // No `sizes`: with it, Next generates a responsive srcset and
              // re-encodes each candidate toward the layout box's aspect, which
              // is what was physically cropping these (a 1:1 source arriving as
              // 3:1). Without it, the declared width/height are honoured and
              // the image keeps its own proportions.
              className="h-10 w-auto shrink-0 object-contain object-left md:h-12"
            />
          )}

          <div className="min-w-0">
            <p className="font-heading font-black">{nameNode}</p>
            {(author?.position || companyName) && (
              <p className="text-sm text-body-foreground">
                {[author?.position, companyName].filter(Boolean).join(" at ")}
              </p>
            )}
          </div>
        </figcaption>
      </div>

      {/*
       * The portrait breaks out of the card — the reference design's signature
       * move, and v1's too (`lg:-right-20`). Done the reference's way, with
       * negative margins on a flex child rather than absolute positioning, so
       * the circle overhangs the top, bottom and right edges at once and the
       * card still reserves a real column for it.
       *
       * The section clips the overflow, so the overhang never widens the page.
       * Below lg there is no room to bleed and it returns to normal flow.
       */}
      {photoUrl && (
        <div
          className={cn(
            "mt-8 size-40 shrink-0 self-center overflow-hidden rounded-full border-3 border-border bg-muted sm:size-48",
            // Absolutely positioned at lg, not a flex child with negative
            // margins: the circle must sit ON the card, overlapping its right
            // edge while the card's own outline stays an unbroken rectangle
            // behind it. Negative margins on an in-flow child instead pull the
            // card's borders inward to meet the circle, which visibly breaks
            // the card open at the top and bottom.
            "lg:absolute lg:top-1/2 lg:right-0 lg:mt-0 lg:size-72 lg:-translate-y-1/2 lg:translate-x-1/4 xl:size-80"
          )}
        >
          <Image
            src={photoUrl}
            alt={author?.photo?.alt ?? author?.name ?? ""}
            width={640}
            height={640}
            sizes="(min-width: 1280px) 20rem, (min-width: 1024px) 18rem, (min-width: 640px) 12rem, 10rem"
            loading={eager ? "eager" : "lazy"}
            className="size-full object-cover"
          />
        </div>
      )}
    </figure>
  )
}

interface TestimonialsCarouselProps {
  testimonials: FEATURED_TESTIMONIALS_QUERY_RESULT
}

/**
 * The slide list, split out so it can read `selectedIndex` from the carousel's
 * own context rather than the section duplicating that state with a second
 * `select` subscription.
 */
function TestimonialSlides({ testimonials }: TestimonialsCarouselProps) {
  const { selectedIndex } = useCarousel()
  const total = testimonials.length

  return (
    /*
     * The portrait overhangs its card to the right, so the viewport can't use a
     * plain `overflow-hidden` — that would shave the circle off at the slide
     * boundary. `overflow-visible` is wrong too: it leaks the neighbouring
     * slides into view. So clip horizontally only, and let the card's reserved
     * right margin give the overhang somewhere to land.
     */
    <CarouselContent viewportClassName="overflow-x-clip overflow-y-visible">
      {testimonials.map((testimonial, index) => {
        // Distance measured around the loop, so slide 0's "previous" neighbour
        // is the last slide and gets preloaded too.
        const rawDistance = Math.abs(index - selectedIndex)
        const distance = Math.min(rawDistance, total - rawDistance)

        return (
          // Keyed by _id, never by author name: two of these testimonials share
          // an author, and v1 keyed its lookup by name — which made one of that
          // author's quotes unreachable.
          <CarouselItem key={testimonial._id}>
            <TestimonialCard
              testimonial={testimonial}
              eager={distance <= PRELOAD_RADIUS}
            />
          </CarouselItem>
        )
      })}
    </CarouselContent>
  )
}

/**
 * The carousel with no heading/section/motion wrapper, so a future
 * /testimonials page can mount it under its own <h1> — the same split
 * `ValuesGrid` and `ServicesGrid` use.
 */
export function TestimonialsCarousel({
  testimonials,
}: TestimonialsCarouselProps) {
  if (!testimonials || testimonials.length === 0) return null

  return (
    <Carousel
      opts={{
        loop: testimonials.length > 1,
        // One slide per view, so every rest position is a whole slide. `start`
        // plus the card's asymmetric right margin let Embla settle between two
        // snap points, showing a sliver of the neighbour.
        align: "center",
      }}
      aria-label="Testimonials"
      className="w-full"
    >
      {/*
       * The portrait overhangs its card to the right, so the viewport can't use
       * a plain `overflow-hidden` — that would shave the circle off at the
       * slide boundary.
       *
       * `overflow-visible` alone is wrong too: it leaks the neighbouring slides
       * into view. So clip horizontally and not vertically, and let the padded
       * gutter below give the overhang somewhere to land.
       */}
      <TestimonialSlides testimonials={testimonials} />

      {testimonials.length > 1 && (
        <div className="mt-8 flex items-center justify-between gap-4">
          <CarouselDots label="Go to testimonial" />
          <div className="flex gap-3">
            <CarouselPrevious
              className="static translate-y-0"
              aria-label="Previous testimonial"
            />
            <CarouselNext
              className="static translate-y-0"
              aria-label="Next testimonial"
            />
          </div>
        </div>
      )}
    </Carousel>
  )
}

interface TestimonialsProps {
  testimonials: FEATURED_TESTIMONIALS_QUERY_RESULT
  headingLead: string
  headingHighlight: string
  intro: string
}

/**
 * Deliberately no autoplay. These quotes run to ~975 characters; advancing the
 * card out from under someone mid-sentence is hostile, and moving content that
 * can't be paused is an accessibility problem. Navigation is arrows, dots,
 * drag, and arrow keys.
 *
 * The heading's sweep is `secondary` (blue): the home page's other highlighted
 * headings use `primary`, and the design system asks new sections to alternate
 * rather than defaulting everything to orange.
 */
const Testimonials = ({
  testimonials,
  headingLead,
  headingHighlight,
  intro,
}: TestimonialsProps) => {
  const { ref, state, Provider } = useRevealGroup<HTMLElement>("in-view")

  if (!testimonials || testimonials.length === 0) return null

  return (
    <Provider state={state}>
      <section
        id="testimonials"
        ref={ref}
        // `overflow-hidden` matches the reference's `.testimonial-section`: the
        // portrait deliberately overhangs its card, and this keeps that overhang
        // from widening the page into a horizontal scrollbar.
        className="overflow-hidden py-10 md:py-16"
      >
        <Container>
          <Reveal delay={0.2}>
            <h2 className="font-heading text-2xl font-black text-balance sm:text-3xl">
              {headingLead}{" "}
              <HighlightText variant="secondary">
                {headingHighlight}
              </HighlightText>
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-body-foreground md:text-lg">
              {intro}
            </p>
          </Reveal>

          <Reveal delay={0.32} className="mt-8">
            <TestimonialsCarousel testimonials={testimonials} />
          </Reveal>
        </Container>
      </section>
    </Provider>
  )
}

export default Testimonials
