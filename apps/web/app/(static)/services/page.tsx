import type { Metadata } from "next"

import { Container } from "@workspace/ui/components/container"
import { sanityFetch } from "@workspace/sanity/live"
import { createCollectionTag } from "@workspace/sanity/cache-tags"
import { SERVICES_QUERY } from "@workspace/sanity/query"

import { HighlightText } from "@/components/highlight-text"
import { ServicesGrid } from "@/components/sections/services"
import {
  cleanSanityData,
  getDynamicSanityFetchOptions,
} from "@/lib/sanity-fetch-options"

export const metadata: Metadata = {
  title: "Services",
  description: "What I can help you build, from software to deployment.",
}

export default async function ServicesPage() {
  const services = cleanSanityData(
    (
      await sanityFetch({
        query: SERVICES_QUERY,
        tags: [createCollectionTag("service")],
        ...(await getDynamicSanityFetchOptions()),
      })
    ).data
  )

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <Container>
        <h1 className="font-heading text-4xl leading-tight font-black sm:text-5xl">
          Modern problems, require{" "}
          <HighlightText variant="primary">modern services</HighlightText>
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-body-foreground md:text-lg">
          What I can help you build, whether you need something from
          scratch or a project that needs to go further.
        </p>
      </Container>

      <Container className="mt-10">
        <ServicesGrid services={services} />
      </Container>
    </main>
  )
}
