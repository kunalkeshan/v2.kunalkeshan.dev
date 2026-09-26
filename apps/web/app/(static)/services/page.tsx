import type { Metadata } from "next"

import { Container } from "@workspace/ui/components/container"
import { sanityFetch } from "@workspace/sanity/live"
import { createCollectionTag } from "@workspace/sanity/cache-tags"
import { SERVICES_QUERY } from "@workspace/sanity/query"

import { HighlightText } from "@/components/highlight-text"
import { PageHero } from "@/components/page-hero"
import { ServicesGrid } from "@/components/sections/services"
import { JsonLd } from "@/components/shared/json-ld"
import { buildBreadcrumbListJsonLd, buildServiceJsonLd } from "@/lib/structured-data"
import {
  cleanSanityData,
  getDynamicSanityFetchOptions,
} from "@/lib/sanity-fetch-options"

export const metadata: Metadata = {
  title: "Services",
  description: "What I can help you build, from software to deployment.",
  alternates: { canonical: "/services" },
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
      {buildServiceJsonLd(services, "/services").map(({ id, jsonLd }) => (
        <JsonLd key={id} data={jsonLd} />
      ))}
      <JsonLd
        data={buildBreadcrumbListJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <Container>
        <PageHero
          heading={
            <>
              Modern problems, require{" "}
              <HighlightText variant="primary">modern services</HighlightText>
            </>
          }
          headingClassName="font-heading text-4xl leading-tight font-black sm:text-5xl"
          subtext="What I can help you build, whether you need something from scratch or a project that needs to go further."
          subtextClassName="mt-3 max-w-2xl text-base leading-relaxed text-body-foreground md:text-lg"
        />
      </Container>

      <Container className="mt-10">
        <ServicesGrid services={services} mode="mount" delayOffset={0.24} />
      </Container>
    </main>
  )
}
