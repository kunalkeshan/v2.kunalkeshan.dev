"use client"

import Image from "next/image"
import { ArrowRightIcon, MailIcon } from "lucide-react"

import { Container } from "@workspace/ui/components/container"
import { cardLift, cardLiftActive, cn } from "@workspace/ui/lib/utils"
import { urlFor } from "@workspace/sanity/image"
import type { SERVICES_QUERY_RESULT } from "@workspace/sanity/types"

import { HighlightText } from "@/components/highlight-text"
import { useReveal, useRevealGroup } from "@/hooks/use-reveal"
import { Reveal } from "@/components/reveal"
import { CARD_STAGGER_STEP_S } from "@/lib/reveal-stagger"

type Service = NonNullable<SERVICES_QUERY_RESULT>[number]

interface ServicesGridProps {
  services: SERVICES_QUERY_RESULT
  /**
   * Defaults to `"in-view"` (its original, self-contained behavior — see the
   * doc comment below). The standalone `/services` page passes `"mount"` so
   * the cards join the page hero's mount-entrance sequence instead of
   * waiting for a scroll that, on that page, may never need to happen.
   */
  mode?: "mount" | "in-view"
  /**
   * Added to every card's stagger delay. The standalone `/services` page
   * uses this to continue the page hero's own `delay={0}`/`delay={0.12}`
   * sequence (passing `0.24`) rather than restarting the stagger from 0,
   * which would read as a second, disconnected reveal firing at the same
   * moment as the heading's.
   */
  delayOffset?: number
}

/**
 * `group` is what lets the illustration respond to the card's hover; see
 * `group-hover:scale-110` on the `<Image>` below. The lift itself lives in
 * `cardLift` (@workspace/ui/lib/utils).
 */
const cardShellBase =
  "group flex min-h-105 flex-col overflow-hidden rounded-lg border-3 border-border bg-card"

const cardShell = cn(cardShellBase, cardLift)

function ServiceCard({ service }: { service: Service }) {
  // No `.height()`: Sanity ignores w/h/rect for SVGs and serves the original
  // file, so requesting a square crop produced a URL whose delivered image was
  // never square — which is what Next's aspect-ratio warning was reporting.
  const illustrationUrl = service.illustration?.asset
    ? urlFor(service.illustration).width(280).url()
    : undefined

  // Declare the asset's real ratio rather than assuming 1:1. Already in the
  // query payload via `asset->`, so this needs no GROQ/typegen change.
  const dimensions = service.illustration?.asset?.metadata?.dimensions

  return (
    <div className={cardShell}>
      <div className="flex min-h-45 items-center justify-center bg-muted p-8">
        {illustrationUrl && (
          <Image
            src={illustrationUrl}
            alt={service.illustration?.alt ?? ""}
            width={dimensions?.width ?? 140}
            height={dimensions?.height ?? 140}
            sizes="140px"
            className={cn(
              "h-auto w-full max-w-35 object-contain",
              // Paired with `group` on `cardShell` — v1 scaled the cover art on
              // card hover, which is what makes the lift feel like one gesture
              // rather than the frame moving on its own. Same explicit resting
              // value + GPU promotion as the shell, for the same reason: the
              // scale has to interpolate symmetrically in both directions.
              "scale-100 transform-gpu will-change-transform",
              "transition-transform duration-press ease-snap group-hover:scale-110",
              "motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            )}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-heading text-xl font-black">{service.name}</h3>
        <p className="text-sm leading-relaxed text-body-foreground">
          {service.description}
        </p>
      </div>
    </div>
  )
}

function ContactCard() {
  return (
    <div className={cn(cardShellBase, cardLiftActive, "bg-secondary")}>
      <div className="flex min-h-45 items-center justify-center bg-secondary p-8">
        {/* Intrinsic size of public/mailbox.svg (576.5 x 493.5), not the
            rendered size — `max-w-35` still caps how large it paints. */}
        <Image
          src="/mailbox.svg"
          alt="Illustration of an open mailbox with letters"
          width={577}
          height={494}
          sizes="140px"
          className="h-auto w-full max-w-35 object-contain"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-heading text-xl font-black text-secondary-foreground">
          Get in touch
        </h3>
        <p className="text-sm leading-relaxed text-secondary-foreground/90">
          Looking for something not listed here? Reach out — there&apos;s a good
          chance I can help.
        </p>
        <a
          href="/contact"
          className={cn(
            "mt-auto flex items-center justify-center gap-2 rounded-lg border-2 border-border bg-primary px-4 py-3",
            "font-heading text-sm font-bold text-primary-foreground",
            "shadow-sm transition-[translate,transform,box-shadow] duration-press ease-snap",
            "hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          )}
        >
          <MailIcon className="size-4" />
          Get in touch
          <ArrowRightIcon data-icon="inline-end" className="size-4" />
        </a>
      </div>
    </div>
  )
}

/**
 * The card grid on its own, with no heading/section/motion wrapper — used
 * both inside `Services` below (home strip) and directly on the standalone
 * `/services` page, which supplies its own `<h1>` and intro copy instead of
 * this component's heading.
 *
 * Owns its own `useRevealGroup` rather than inheriting one from a parent
 * section — it needs a trigger regardless of ancestor, since the standalone
 * `/services` page renders this with no reveal-triggering ancestor at all
 * pre-`PageHero` (`Reveal` falls back to `"hidden"`, not "always visible",
 * when rendered outside any `Provider` — see `apps/web/components/reveal.tsx`).
 * Defaults to `"in-view"` for the home page's `Services` strip below, where
 * the heading and the grid are two independently scroll-triggered reveals
 * rather than one shared trigger — negligible in practice since they sit
 * right next to each other and typically cross the viewport threshold within
 * the same scroll frame. The standalone `/services` page passes `mode="mount"`
 * with a `delayOffset` continuing its `PageHero`'s own delay sequence, since
 * that page's grid is reliably within the initial viewport rather than
 * something to wait on a scroll for.
 */
export function ServicesGrid({
  services,
  mode = "in-view",
  delayOffset = 0,
}: ServicesGridProps) {
  const { ref, state, Provider } = useRevealGroup<HTMLDivElement>(mode)

  if (!services || services.length === 0) return null

  return (
    <Provider state={state}>
      <div
        ref={ref}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {services.map((service, index) => (
          <Reveal
            key={service._id}
            delay={delayOffset + index * CARD_STAGGER_STEP_S}
          >
            <ServiceCard service={service} />
          </Reveal>
        ))}
        <Reveal delay={delayOffset + services.length * CARD_STAGGER_STEP_S}>
          <ContactCard />
        </Reveal>
      </div>
    </Provider>
  )
}

interface ServicesProps {
  services: SERVICES_QUERY_RESULT
}

const Services = ({ services }: ServicesProps) => {
  const { ref, state } = useReveal<HTMLElement>("in-view")

  if (!services || services.length === 0) return null

  return (
    <section
      ref={ref}
      data-reveal={state}
      className="reveal-delay-200 py-10 md:py-16"
      id="services"
    >
      <Container>
        <h2 className="mb-6 font-heading text-2xl font-black sm:text-3xl">
          Modern problems, require{" "}
          <HighlightText variant="primary">modern services</HighlightText>
        </h2>

        <ServicesGrid services={services} />
      </Container>
    </section>
  )
}

export default Services
