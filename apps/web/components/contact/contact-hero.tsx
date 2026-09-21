"use client"

import { motion } from "motion/react"

import { Container } from "@workspace/ui/components/container"
import type {
  SERVICES_QUERY_RESULT,
  SITE_CONFIG_QUERY_RESULT,
} from "@workspace/sanity/types"

import { HighlightText } from "@/components/highlight-text"
import { ContactForm } from "@/components/contact/contact-form"
import { SocialsRow } from "@/components/contact/socials-row"
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
           * on the project detail page's sticky sidebar. The form (right
           * column) is the one likely to grow taller — validation errors,
           * the "Other" field, Turnstile — so the shorter left column is the
           * one that sticks while the form scrolls past it. */}
          <div className="flex w-full flex-col items-center gap-6 text-center lg:h-fit lg:items-start lg:self-start lg:text-left">
            <div className="w-full lg:sticky lg:top-28">
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

              <div className="mt-6">
                <SocialsRow socialMedia={siteConfig?.socialMedia ?? null} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ContactForm services={services} />
          </div>
        </div>
      </Container>
    </motion.section>
  )
}
