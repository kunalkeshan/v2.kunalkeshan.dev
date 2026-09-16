"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { UserIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Container } from "@workspace/ui/components/container"
import { cn } from "@workspace/ui/lib/utils"

import { HighlightText } from "@/components/highlight-text"
import {
  sectionReveal,
  sectionRevealTransition,
  sectionRevealViewport,
} from "@/lib/motion"

interface AboutHighlight {
  title: string | null
  description: string | null
}

interface AboutProps {
  headingLead: string
  headingHighlight: string
  body: string
  highlights: AboutHighlight[]
  imageUrl: string
  imageAlt: string
}

/**
 * Ported from kunalkeshan.dev v1's `components/landing/About.tsx`. Carries over
 * v1's two-column layout (image below the copy on mobile, beside it at `lg`),
 * the circular portrait with the hover-grow offset shadow, and the alternating
 * bullet swatches — but drops v1's `MemeTooltip` and its student-era copy.
 *
 * v1 alternated swatch colors via `index % 2`, which made the *first* bullet
 * blue and the second orange; that order is preserved deliberately.
 */
const About = ({
  headingLead,
  headingHighlight,
  body,
  highlights,
  imageUrl,
  imageAlt,
}: AboutProps) => {
  return (
    <motion.section
      id="about"
      initial="hidden"
      whileInView="visible"
      variants={sectionReveal}
      transition={sectionRevealTransition}
      viewport={sectionRevealViewport}
      className="py-10 md:py-16"
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="order-last flex w-full items-center justify-center lg:order-0">
            <div
              className={cn(
                "aspect-square w-full max-w-md overflow-hidden rounded-full",
                "border-3 border-border shadow-xl",
                "transition-shadow duration-press ease-snap",
                "hover:shadow-2xl"
              )}
            >
              <Image
                src={imageUrl}
                alt={imageAlt}
                width={1433}
                height={1956}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="flex w-full flex-col">
            <h2 className="font-heading text-2xl font-black sm:text-3xl">
              {headingLead}{" "}
              <HighlightText variant="secondary">
                {headingHighlight}
              </HighlightText>
            </h2>

            <p className="mt-4 text-base leading-relaxed text-body-foreground md:text-lg">
              {body}
            </p>

            {highlights.length > 0 && (
              <ul className="mt-6 flex flex-col gap-5">
                {highlights.map((highlight, index) => (
                  <li key={highlight.title} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-1.5 size-5 shrink-0 rounded-sm border-2 border-border",
                        index % 2 ? "bg-primary" : "bg-secondary"
                      )}
                    />
                    <div>
                      <h3 className="font-heading text-xl font-black sm:text-2xl">
                        {highlight.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-body-foreground md:text-base">
                        {highlight.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <Button
              size="lg"
              className="mt-8 w-full md:w-fit"
              render={<a href="/about" />}
              nativeButton={false}
            >
              <UserIcon data-icon="inline-start" />
              More about me
            </Button>
          </div>
        </div>
      </Container>
    </motion.section>
  )
}

export default About
