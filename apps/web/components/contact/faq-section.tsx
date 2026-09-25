"use client"

import { Container } from "@workspace/ui/components/container"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"
import type { FAQS_QUERY_RESULT } from "@workspace/sanity/types"

import { useReveal } from "@/hooks/use-reveal"

interface FaqSectionProps {
  faqs: FAQS_QUERY_RESULT
}

export function FaqSection({ faqs }: FaqSectionProps) {
  const { ref, state } = useReveal<HTMLElement>("in-view")

  if (!faqs?.faqItems || faqs.faqItems.length === 0) return null

  return (
    <section
      id="faqs"
      ref={ref}
      data-reveal={state}
      className="reveal-delay-200 py-10 md:py-16"
    >
      <Container className="max-w-3xl">
        <h2 className="mb-6 text-center font-heading text-2xl font-black sm:text-3xl">
          {faqs.title ?? "Frequently Asked Questions"}
        </h2>

        {/* `multiple`: v1's FaqCard let every question stay open
         * independently — no exclusive-open behavior — and this preserves
         * that rather than defaulting to Base UI's single-open accordion. */}
        <Accordion multiple>
          {faqs.faqItems.map((item, index) => (
            <AccordionItem key={index} value={index}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
                <p>{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  )
}
