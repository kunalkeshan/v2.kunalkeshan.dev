"use client"

import { Container } from "@workspace/ui/components/container"
import type {
  SERVICES_QUERY_RESULT,
  SITE_CONFIG_QUERY_RESULT,
} from "@workspace/sanity/types"

import { HighlightText } from "@/components/highlight-text"
import { ContactForm } from "@/components/contact/contact-form"
import { SocialsList } from "@/components/contact/socials-list"
import { CopyEmailButton } from "@/components/contact/copy-email-button"
import { useRevealGroup } from "@/hooks/use-reveal"
import { Reveal } from "@/components/reveal"

interface ContactHeroProps {
  siteConfig: SITE_CONFIG_QUERY_RESULT
  services: SERVICES_QUERY_RESULT
}

/**
 * Above-the-fold block: heading/socials/copy-email on the left, the form on
 * the right. Mount-entrance reveal (`useRevealGroup("mount")`), not
 * scroll-into-view — this content is visible immediately on load, same
 * reasoning as `apps/web/components/sections/hero.tsx`, which this mirrors:
 * heading+intro, then the copy-email button, then the socials list, each a
 * step later; the form column reveals in parallel with the heading (`delay=0`)
 * rather than after the left column finishes, since they sit side by side.
 *
 * The form column's `<Reveal fade>` is fade-only, not the usual slide+fade:
 * it wraps the sticky form below, and animating `transform` leaves a
 * non-`none` value on it mid-transition, which creates a new containing
 * block and silently breaks `position: sticky` on the form. See `Reveal`'s
 * `fade` prop doc comment for the full explanation.
 */
export function ContactHero({ siteConfig, services }: ContactHeroProps) {
  const primaryEmail = siteConfig?.emails?.[0]?.email
  const { ref, state, Provider } = useRevealGroup<HTMLElement>("mount")

  return (
    <Provider state={state}>
      <section ref={ref}>
        <Container>
          <div className="mx-auto grid w-full grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
            {/* No `lg:h-fit` on the sticky column here — that's the inverse of
             * the project detail page's trap. There, the sticky aside is a
             * flex sibling that would otherwise STRETCH to match a taller
             * sibling, so `h-fit` stops it stretching and gives its own sticky
             * child room to travel *within* that stretched height.
             *
             * Here the roles are flipped: this column is the SHORTER one, and
             * it needs to stretch to the row's full height (this is a CSS
             * grid, whose cells stretch to the row height by default) so its
             * sticky child has somewhere to travel *inside the cell itself*.
             * Adding `lg:h-fit` collapses this cell down to exactly the sticky
             * child's own height, leaving zero travel room — the child
             * detaches from `top` almost immediately and just scrolls with
             * the page, which is the bug this comment used to cause. Sticky
             * needs a positioned ancestor taller than itself; never make that
             * ancestor `h-fit` to its sticky child specifically.
             *
             * The sticky side lives on whichever column is SHORTER, so it has
             * room to travel while the taller column scrolls past it — not on
             * a fixed left/right assumption. This was the form (right column)
             * until the detailed `SocialsList` row list replaced the old
             * icon-only `SocialsRow`: the left column (heading + email +
             * socials) is now reliably the taller one, so the form is the
             * side that sticks instead. If the left column's content ever
             * shrinks back below the form's height, flip this back. */}
            <div className="flex w-full flex-col items-center gap-6 text-center lg:items-start lg:text-left">
              <Reveal delay={0}>
                <div>
                  <h1 className="font-heading text-4xl leading-tight font-black sm:text-5xl">
                    <HighlightText variant="secondary">Contact</HighlightText>{" "}
                    me
                  </h1>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-body-foreground md:text-lg">
                    Feel free to connect with me through email, my socials, or
                    simply drop me a message — I&apos;ll get back to you soon.
                  </p>
                </div>
              </Reveal>

              {primaryEmail ? (
                <Reveal delay={0.12} className="mt-6">
                  <CopyEmailButton email={primaryEmail} />
                </Reveal>
              ) : null}

              <Reveal delay={0.24} className="mt-8 w-full">
                <SocialsList socialMedia={siteConfig?.socialMedia ?? null} />
              </Reveal>
            </div>

            <Reveal
              delay={0}
              fade
              className="flex items-center justify-center"
            >
              <div className="w-full lg:sticky lg:top-28">
                <ContactForm services={services} />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </Provider>
  )
}
