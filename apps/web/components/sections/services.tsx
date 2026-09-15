"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { ArrowRightIcon, MailIcon } from "lucide-react"

import { Container } from "@workspace/ui/components/container"
import { cn } from "@workspace/ui/lib/utils"
import { urlFor } from "@workspace/sanity/image"
import type { SERVICES_QUERY_RESULT } from "@workspace/sanity/types"

import { HighlightText } from "@/components/highlight-text"
import {
  sectionReveal,
  sectionRevealTransition,
  sectionRevealViewport,
} from "@/lib/motion"

type Service = NonNullable<SERVICES_QUERY_RESULT>[number]

interface ServicesGridProps {
  services: SERVICES_QUERY_RESULT
}

const cardShell = cn(
  "flex min-h-[420px] flex-col overflow-hidden rounded-(--radius-lg) border-3 border-border bg-card",
  "shadow-[var(--shadow-xl)] transition-shadow duration-(--duration-press) ease-(--ease-snap)",
  "hover:shadow-[var(--shadow-2xl)]"
)

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
      <div className="flex min-h-[180px] items-center justify-center bg-muted p-8">
        {illustrationUrl && (
          <Image
            src={illustrationUrl}
            alt={service.illustration?.alt ?? ""}
            width={dimensions?.width ?? 140}
            height={dimensions?.height ?? 140}
            sizes="140px"
            className="h-auto w-full max-w-[140px] object-contain"
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
    <div className={cn(cardShell, "bg-secondary")}>
      <div className="flex min-h-[180px] items-center justify-center bg-secondary p-8">
        {/* Intrinsic size of public/mailbox.svg (576.5 x 493.5), not the
            rendered size — `max-w-[140px]` still caps how large it paints. */}
        <Image
          src="/mailbox.svg"
          alt="Illustration of an open mailbox with letters"
          width={577}
          height={494}
          sizes="140px"
          className="h-auto w-full max-w-[140px] object-contain"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-heading text-xl font-black text-secondary-foreground">
          Get in touch
        </h3>
        <p className="text-sm leading-relaxed text-secondary-foreground/90">
          Looking for something not listed here? Reach out — there&apos;s a
          good chance I can help.
        </p>
        <a
          href="/contact"
          className={cn(
            "mt-auto flex items-center justify-center gap-2 rounded-(--radius-lg) border-2 border-border bg-primary px-4 py-3",
            "font-heading text-sm font-bold text-primary-foreground",
            "shadow-[var(--shadow-sm)] transition-[transform,box-shadow] duration-(--duration-press) ease-(--ease-snap)",
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
 */
export function ServicesGrid({ services }: ServicesGridProps) {
  if (!services || services.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service._id} service={service} />
      ))}
      <ContactCard />
    </div>
  )
}

interface ServicesProps {
  services: SERVICES_QUERY_RESULT
}

const Services = ({ services }: ServicesProps) => {
  if (!services || services.length === 0) return null

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      variants={sectionReveal}
      transition={sectionRevealTransition}
      viewport={sectionRevealViewport}
      className="py-10 md:py-16"
    >
      <Container>
        <h2 className="mb-6 font-heading text-2xl font-black sm:text-3xl">
          Modern problems, require{" "}
          <HighlightText variant="primary">modern services</HighlightText>
        </h2>

        <ServicesGrid services={services} />
      </Container>
    </motion.section>
  )
}

export default Services
