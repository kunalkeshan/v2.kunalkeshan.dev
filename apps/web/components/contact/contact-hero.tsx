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
import { useReveal } from "@/hooks/use-reveal"

interface ContactHeroProps {
  siteConfig: SITE_CONFIG_QUERY_RESULT
  services: SERVICES_QUERY_RESULT
}

/**
 * Above-the-fold block: heading/socials/copy-email on the left, the form on
 * the right. Mount-entrance reveal (`useReveal("mount")`), not scroll-into-
 * view — this content is visible immediately on load, same reasoning as
 * `apps/web/components/sections/hero.tsx`.
 *
 * Fade-only (`data-reveal-fade`), not the usual `[data-reveal]` translateY:
 * this section wraps the sticky form column below, and animating `transform`
 * leaves a non-`none` transform on this element, which creates a new
 * containing block and silently breaks `position: sticky` on the form. See
 * the `[data-reveal-fade]` rules in `packages/ui/src/styles/globals.css` for
 * the full explanation.
 */
export function ContactHero({ siteConfig, services }: ContactHeroProps) {
  const primaryEmail = siteConfig?.emails?.[0]?.email
  const { ref, state } = useReveal<HTMLElement>("mount")

  return (
    <section ref={ref} data-reveal={state} data-reveal-fade>
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
            <div>
              <h1 className="font-heading text-4xl leading-tight font-black sm:text-5xl">
                <HighlightText variant="secondary">Contact</HighlightText> me
              </h1>
              <p className="mt-3 max-w-md text-base leading-relaxed text-body-foreground md:text-lg">
                Feel free to connect with me through email, my socials, or
                simply drop me a message — I&apos;ll get back to you soon.
              </p>
            </div>

            {primaryEmail ? (
              <div className="mt-6">
                <CopyEmailButton email={primaryEmail} />
              </div>
            ) : null}

            <div className="mt-8 w-full">
              <SocialsList socialMedia={siteConfig?.socialMedia ?? null} />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full lg:sticky lg:top-28">
              <ContactForm services={services} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
