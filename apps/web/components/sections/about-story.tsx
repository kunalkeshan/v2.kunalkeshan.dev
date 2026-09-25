"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon, FileTextIcon, MailIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Container } from "@workspace/ui/components/container"
import { cn } from "@workspace/ui/lib/utils"

import { HighlightText } from "@/components/highlight-text"
import { useRevealGroup } from "@/hooks/use-reveal"
import { Reveal } from "@/components/reveal"

interface AboutStoryProps {
  headingLead: string
  headingHighlight: string
  headingTrail?: string | null
  story: string[]
  imageUrl: string
  imageAlt: string
}

/**
 * The bio on /about — present-tense work first, past-tense backstory after.
 *
 * Ported from kunalkeshan.dev v1's `AboutStory`, with the columns mirrored
 * relative to the home page's About section so the two don't read as the same
 * layout twice. v1's drop-cap on the first paragraph is deliberately dropped: it
 * hardcoded both a color (breaking dark mode) and the literal first letter,
 * which cannot survive CMS-authored copy.
 *
 * `id="story"` preserves v1's `/about#story` deep link, which may be linked
 * externally.
 */
const AboutStory = ({
  headingLead,
  headingHighlight,
  headingTrail,
  story,
  imageUrl,
  imageAlt,
}: AboutStoryProps) => {
  const { ref, state, Provider } = useRevealGroup<HTMLElement>("in-view")

  return (
    <Provider state={state}>
      <section id="story" ref={ref} className="py-10 md:py-16">
        <Container>
          {/*
            `items-start`, not `items-center` — a sticky child inside a centered
            grid cell silently does nothing, because the cell is sized to its
            content rather than the row.
          */}
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
            {/* fade-only: this Reveal IS the sticky element (`lg:sticky`
             * lives directly on it, not on a nested child), so animating
             * `transform` here would break `position: sticky` — see
             * `Reveal`'s `fade` prop doc comment. */}
            <Reveal
              delay={0.2}
              fade
              className="flex w-full justify-center lg:sticky lg:top-28"
            >
              {/*
                Image-wrapper hover pattern: rests at shadow-xl and grows on hover.
                Not `cardLift` — that's the content-card pattern and owns its own
                translate. See docs/ui/design-system.md.
              */}
              <div
                className={cn(
                  "aspect-square w-full max-w-xs overflow-hidden rounded-full",
                  "border-3 border-border shadow-xl",
                  "transition-shadow duration-press ease-snap",
                  "hover:shadow-2xl"
                )}
              >
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  width={1280}
                  height={1280}
                  sizes="(min-width: 1024px) 20rem, 18rem"
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.32} className="flex w-full flex-col">
              <h2 className="font-heading text-2xl font-black sm:text-3xl">
                {headingLead}{" "}
                <HighlightText variant="secondary">
                  {headingHighlight}
                </HighlightText>
                {headingTrail ? ` ${headingTrail}` : null}
              </h2>

              <div className="mt-4 flex flex-col gap-4">
                {story.map((paragraph, index) => (
                  <p
                    // Static ordered prose with no identity of its own and no
                    // runtime reordering — the index is the stable key here.
                    key={index}
                    className="text-base leading-relaxed text-body-foreground md:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  render={<Link href="/work" />}
                  nativeButton={false}
                >
                  <FileTextIcon data-icon="inline-start" />
                  See my experience
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  render={<Link href="/contact" />}
                  nativeButton={false}
                >
                  <MailIcon data-icon="inline-start" />
                  Get in touch
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </Provider>
  )
}

export default AboutStory
