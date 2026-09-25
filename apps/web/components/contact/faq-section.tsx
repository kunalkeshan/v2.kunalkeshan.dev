"use client"

import { Container } from "@workspace/ui/components/container"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"
import type { FAQS_QUERY_RESULT } from "@workspace/sanity/types"

import { useRevealGroup } from "@/hooks/use-reveal"
import { Reveal } from "@/components/reveal"
import { chipStaggerDelay } from "@/lib/reveal-stagger"

interface FaqSectionProps {
  faqs: FAQS_QUERY_RESULT
}

export function FaqSection({ faqs }: FaqSectionProps) {
  const { ref, state, Provider } = useRevealGroup<HTMLElement>("in-view")

  if (!faqs?.faqItems || faqs.faqItems.length === 0) return null

  return (
    <Provider state={state}>
      <section id="faqs" ref={ref} className="py-10 md:py-16">
        <Container className="max-w-3xl">
          <Reveal delay={0.2}>
            <h2 className="mb-6 text-center font-heading text-2xl font-black sm:text-3xl">
              {faqs.title ?? "Frequently Asked Questions"}
            </h2>
          </Reveal>

          {/* `multiple`: v1's FaqCard let every question stay open
           * independently — no exclusive-open behavior — and this preserves
           * that rather than defaulting to Base UI's single-open accordion. */}
          <Accordion multiple>
            {faqs.faqItems.map((item, index) => (
              // `not-last:mb-4` moved here from `AccordionItem`'s own base
              // classes: `AccordionItem`'s `not-last:` selector matches its
              // position among ITS OWN siblings, and wrapping each one in a
              // `<Reveal>` makes every `AccordionItem` the sole (first-and-
              // last) child of its own wrapper — so `AccordionItem`'s own
              // `not-last:mb-4` never matches any of them anymore, and the
              // gap between questions silently collapsed to zero. The
              // `Reveal` wrappers are the actual accordion siblings now, so
              // the spacing has to live on them instead.
              <Reveal
                key={index}
                as="div"
                delay={0.32 + chipStaggerDelay(index)}
                className="not-last:mb-4"
              >
                <AccordionItem value={index}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>
                    <p>{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              </Reveal>
            ))}
          </Accordion>
        </Container>
      </section>
    </Provider>
  )
}
