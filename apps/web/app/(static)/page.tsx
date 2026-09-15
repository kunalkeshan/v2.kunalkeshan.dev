import { sanityFetch } from "@workspace/sanity/fetch"
import { urlFor } from "@workspace/sanity/image"
import { createCollectionTag } from "@workspace/sanity/cache-tags"
import {
  SITE_CONFIG_QUERY,
  FEATURED_SKILLS_QUERY,
  SERVICES_QUERY,
} from "@workspace/sanity/query"
import type {
  SITE_CONFIG_QUERY_RESULT,
  FEATURED_SKILLS_QUERY_RESULT,
  SERVICES_QUERY_RESULT,
} from "@workspace/sanity/types"

import Hero from "@/components/sections/hero"
import Skills from "@/components/sections/skills"
import Services from "@/components/sections/services"

export default async function Home() {
  const [siteConfig, skills, services] = await Promise.all([
    sanityFetch<SITE_CONFIG_QUERY_RESULT>({
      query: SITE_CONFIG_QUERY,
      tags: [createCollectionTag("siteConfig")],
    }),
    sanityFetch<FEATURED_SKILLS_QUERY_RESULT>({
      query: FEATURED_SKILLS_QUERY,
      tags: [createCollectionTag("skill")],
    }),
    sanityFetch<SERVICES_QUERY_RESULT>({
      query: SERVICES_QUERY,
      tags: [createCollectionTag("service")],
    }),
  ])

  const heroImageUrl = siteConfig?.heroImage?.asset
    ? urlFor(siteConfig.heroImage).width(1433).height(1956).url()
    : "/logo.jpg"

  return (
    <main>
      <Hero
        name={siteConfig?.heroName ?? "Kunal Keshan"}
        roles={
          siteConfig?.heroRoles && siteConfig.heroRoles.length > 0
            ? siteConfig.heroRoles
            : ["Building, steadily"]
        }
        imageUrl={heroImageUrl}
        imageAlt={
          siteConfig?.heroImage?.alt ??
          "Illustration of Kunal Keshan working at a desk with dual monitors"
        }
      />
      <Skills skills={skills} />
      <Services services={services} />
    </main>
  )
}
