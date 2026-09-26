"use client"

import { useRevealGroup } from "@/hooks/use-reveal"
import { Reveal } from "@/components/reveal"

interface PageHeroProps {
  heading: React.ReactNode
  headingClassName: string
  subtext?: React.ReactNode
  subtextClassName?: string
  className?: string
}

/**
 * Mount-entrance reveal for a static page's `<h1>` + intro paragraph —
 * heading at `delay={0}`, subtext at `delay={0.12}`, same timing
 * `components/sections/hero.tsx` and `components/contact/contact-hero.tsx`
 * use for their own heading/subtext pair. Those two compose several more
 * `<Reveal>` pieces (buttons, image, form) inline because their layouts are
 * bespoke; every other static page's hero is just this text pair, so this
 * is the shared version rather than copy-pasting the same
 * `useRevealGroup("mount")` + two `<Reveal>` wiring across a dozen pages.
 *
 * `headingClassName`/`subtextClassName` are required/optional pass-throughs
 * rather than baked-in defaults — the pages this replaces disagree in small,
 * deliberate ways (`text-balance` on some, `mt-3` vs `mt-4`, `max-w-2xl` vs
 * none), and forcing one shared class string would silently change those.
 *
 * Renders no `<section>`/`<main>` of its own — callers keep owning their
 * `<Container>` and whatever comes after (a grid, a filtered list, a
 * `<SectionNav>`), same as before this component existed.
 */
export function PageHero({
  heading,
  headingClassName,
  subtext,
  subtextClassName,
  className,
}: PageHeroProps) {
  const { ref, state, Provider } = useRevealGroup<HTMLDivElement>("mount")

  return (
    <Provider state={state}>
      <div ref={ref} className={className}>
        <Reveal delay={0}>
          <h1 className={headingClassName}>{heading}</h1>
        </Reveal>
        {subtext ? (
          <Reveal delay={0.12}>
            <p className={subtextClassName}>{subtext}</p>
          </Reveal>
        ) : null}
      </div>
    </Provider>
  )
}
