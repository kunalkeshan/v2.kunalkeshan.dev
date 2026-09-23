import type { Metadata } from "next"

import { sanityFetch } from "@workspace/sanity/live"
import { createCollectionTag } from "@workspace/sanity/cache-tags"
import { FAQS_QUERY, SERVICES_QUERY, SITE_CONFIG_QUERY } from "@workspace/sanity/query"

import { ContactHero } from "@/components/contact/contact-hero"
import { FaqSection } from "@/components/contact/faq-section"
import { JsonLd } from "@/components/shared/json-ld"
import {
  buildBreadcrumbListJsonLd,
  buildFAQPageJsonLd,
  buildWebPageJsonLd,
} from "@/lib/structured-data"
import {
  cleanSanityData,
  getDynamicSanityFetchOptions,
} from "@/lib/sanity-fetch-options"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch about a project, a role, or just to say hello.",
  alternates: { canonical: "/contact" },
}

export default async function ContactPage() {
  const dynamicOptions = await getDynamicSanityFetchOptions()

  const [siteConfigResult, servicesResult, faqsResult] = await Promise.all([
    sanityFetch({
      query: SITE_CONFIG_QUERY,
      tags: [createCollectionTag("siteConfig")],
      ...dynamicOptions,
    }),
    sanityFetch({
      query: SERVICES_QUERY,
      tags: [createCollectionTag("service")],
      ...dynamicOptions,
    }),
    sanityFetch({
      query: FAQS_QUERY,
      tags: [createCollectionTag("faqs")],
      ...dynamicOptions,
    }),
  ])

  const siteConfig = cleanSanityData(siteConfigResult.data)
  const services = cleanSanityData(servicesResult.data)
  const faqs = cleanSanityData(faqsResult.data)

  const faqJsonLd = buildFAQPageJsonLd(faqs)

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <JsonLd
        data={buildWebPageJsonLd({
          name: "Contact",
          description: "Get in touch about a project, a role, or just to say hello.",
          path: "/contact",
        })}
      />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <JsonLd
        data={buildBreadcrumbListJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <ContactHero siteConfig={siteConfig} services={services} />

      <FaqSection faqs={faqs} />
    </main>
  )
}
