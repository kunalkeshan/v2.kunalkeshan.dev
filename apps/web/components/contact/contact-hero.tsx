"use client"

import { motion } from "motion/react"

import { Container } from "@workspace/ui/components/container"
import type {
  SERVICES_QUERY_RESULT,
  SITE_CONFIG_QUERY_RESULT,
} from "@workspace/sanity/types"

import { HighlightText } from "@/components/highlight-text"
import { ContactForm } from "@/components/contact/contact-form"
import { SocialsList } from "@/components/contact/socials-list"
import { CopyEmailButton } from "@/components/contact/copy-email-button"
import { heroReveal, heroRevealTransition } from "@/lib/motion"

interface ContactHeroProps {
  siteConfig: SITE_CONFIG_QUERY_RESULT
  services: SERVICES_QUERY_RESULT
}

/**
 * Above-the-fold block: heading/socials/copy-email on the left, the form on
 * the right. Uses `heroReveal` (mount-entrance), not `sectionReveal`
 * (scroll-into-view) — this content is visible immediately on load, same
 * reasoning as `apps/web/components/sections/hero.tsx`.
 */
export function ContactHero({ siteConfig, services }: ContactHeroProps) {
  const primaryEmail = siteConfig?.emails?.[0]?.email

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={heroReveal}
      transition={heroRevealTransition}
    >
      <Container>
        <div className="mx-auto grid w-full grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
          {/* `lg:h-fit` matters: as a grid child this would otherwise stretch
           * to the row's full height, leaving the sticky column no room to
           * travel — sticky would silently do nothing. Same trap documented
           * on the project detail page's sticky sidebar.
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

          <div className="flex items-center justify-center lg:h-fit lg:self-start">
            <div className="w-full lg:sticky lg:top-28">
              <ContactForm services={services} />
            </div>
          </div>
        </div>
      </Container>
    </motion.section>
  )
}
