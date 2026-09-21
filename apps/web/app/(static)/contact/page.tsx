import type { Metadata } from "next"

import { sanityFetch } from "@workspace/sanity/fetch"
import { createCollectionTag } from "@workspace/sanity/cache-tags"
import { FAQS_QUERY, SERVICES_QUERY, SITE_CONFIG_QUERY } from "@workspace/sanity/query"
import type {
  FAQS_QUERY_RESULT,
  SERVICES_QUERY_RESULT,
  SITE_CONFIG_QUERY_RESULT,
} from "@workspace/sanity/types"

import { ContactHero } from "@/components/contact/contact-hero"
import { FaqSection } from "@/components/contact/faq-section"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch about a project, a role, or just to say hello.",
}

export default async function ContactPage() {
  const [siteConfig, services, faqs] = await Promise.all([
    sanityFetch<SITE_CONFIG_QUERY_RESULT>({
      query: SITE_CONFIG_QUERY,
      tags: [createCollectionTag("siteConfig")],
    }),
    sanityFetch<SERVICES_QUERY_RESULT>({
      query: SERVICES_QUERY,
      tags: [createCollectionTag("service")],
    }),
    sanityFetch<FAQS_QUERY_RESULT>({
      query: FAQS_QUERY,
      tags: [createCollectionTag("faqs")],
    }),
  ])

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <ContactHero siteConfig={siteConfig} services={services} />

      <FaqSection faqs={faqs} />
    </main>
  )
}
