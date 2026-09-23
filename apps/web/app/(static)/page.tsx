import type { Metadata } from "next"

import { sanityFetch } from "@workspace/sanity/live"
import { urlFor } from "@workspace/sanity/image"
import { createCollectionTag } from "@workspace/sanity/cache-tags"
import {
  SITE_CONFIG_QUERY,
  FEATURED_SKILLS_QUERY,
  SERVICES_QUERY,
  FEATURED_EXPERIENCES_QUERY,
  FEATURED_PROJECTS_QUERY,
  FEATURED_TESTIMONIALS_QUERY,
} from "@workspace/sanity/query"

import Hero from "@/components/sections/hero"
import Skills from "@/components/sections/skills"
import Services from "@/components/sections/services"
import About from "@/components/sections/about"
import Experience from "@/components/sections/experience"
import Projects from "@/components/sections/projects"
import Testimonials from "@/components/sections/testimonials"
import { JsonLd } from "@/components/shared/json-ld"
import { fetchStars } from "@/lib/github"
import { buildPersonJsonLd, buildWebSiteJsonLd } from "@/lib/structured-data"
import {
  cleanSanityData,
  getDynamicSanityFetchOptions,
} from "@/lib/sanity-fetch-options"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

/**
 * Kunal has been building for the web since 2021, and working as a software
 * engineer professionally since 2025 — two distinct claims. The About copy
 * counts from `BUILDING_SINCE` only, so it never overstates years of
 * employment. Computed here in the Server Component rather than inside the
 * client section, so `new Date()` can't drift between server and client.
 */
const BUILDING_SINCE = 2021

export default async function Home() {
  const dynamicOptions = await getDynamicSanityFetchOptions()

  const [
    siteConfigResult,
    skillsResult,
    servicesResult,
    experiencesResult,
    projectsResult,
    testimonialsResult,
  ] = await Promise.all([
    sanityFetch({
      query: SITE_CONFIG_QUERY,
      tags: [createCollectionTag("siteConfig")],
      ...dynamicOptions,
    }),
    sanityFetch({
      query: FEATURED_SKILLS_QUERY,
      tags: [createCollectionTag("skill")],
      ...dynamicOptions,
    }),
    sanityFetch({
      query: SERVICES_QUERY,
      tags: [createCollectionTag("service")],
      ...dynamicOptions,
    }),
    sanityFetch({
      query: FEATURED_EXPERIENCES_QUERY,
      tags: [createCollectionTag("experience")],
      ...dynamicOptions,
    }),
    sanityFetch({
      query: FEATURED_PROJECTS_QUERY,
      tags: [createCollectionTag("project")],
      ...dynamicOptions,
    }),
    sanityFetch({
      query: FEATURED_TESTIMONIALS_QUERY,
      tags: [createCollectionTag("testimonial")],
      ...dynamicOptions,
    }),
  ])

  const siteConfig = cleanSanityData(siteConfigResult.data)
  const skills = cleanSanityData(skillsResult.data)
  const services = cleanSanityData(servicesResult.data)
  const experiences = cleanSanityData(experiencesResult.data)
  const projects = cleanSanityData(projectsResult.data)
  const testimonials = cleanSanityData(testimonialsResult.data)

  // Batched once for the section rather than per card — see lib/github.ts on
  // why the unauthenticated rate limit makes that distinction matter.
  const projectStars = await fetchStars(
    (projects ?? [])
      .map((project) => project.githubRepo)
      .filter((repo): repo is string => Boolean(repo))
  )

  const heroImageUrl = siteConfig?.heroImage?.asset
    ? urlFor(siteConfig.heroImage).width(1433).height(1956).url()
    : "/logo.jpg"

  const aboutImageUrl = siteConfig?.aboutImage?.asset
    ? urlFor(siteConfig.aboutImage).width(1433).height(1956).url()
    : "/logo.jpg"

  const yearsBuilding = new Date().getFullYear() - BUILDING_SINCE

  const aboutHighlights = (siteConfig?.aboutHighlights ?? []).map(
    (highlight) => ({
      ...highlight,
      title: highlight.title?.replace("{years}", String(yearsBuilding)) ?? null,
    })
  )

  return (
    <main>
      <JsonLd data={buildWebSiteJsonLd(siteConfig)} />
      <JsonLd data={buildPersonJsonLd(siteConfig)} />
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
      <About
        headingLead={siteConfig?.aboutHeadingLead ?? "Wait a minute,"}
        headingHighlight={siteConfig?.aboutHeadingHighlight ?? "who am I?"}
        body={
          siteConfig?.aboutBody ??
          "I'm a software engineer focused on clean design, practical decisions, and systems I can stand behind."
        }
        highlights={aboutHighlights}
        imageUrl={aboutImageUrl}
        imageAlt={
          siteConfig?.aboutImage?.alt ??
          "Illustration of Kunal Keshan working at a desk with dual monitors"
        }
      />
      <Experience experiences={experiences} yearsBuilding={yearsBuilding} />
      {/* After Experience: that section closes on the inverted panel, so the
          project grid reads as a return to the page's normal ground rather
          than a second dark break. */}
      <Projects projects={projects} stars={projectStars} />
      {/* Last section on the page, as in v1: the testimonials close the pitch
          after the work itself has been shown. Kept clear of the Experience
          section's inverted panel so it reads on normal ground. */}
      <Testimonials
        testimonials={testimonials}
        headingLead={siteConfig?.testimonialsHeadingLead ?? "Don't take"}
        headingHighlight={
          siteConfig?.testimonialsHeadingHighlight ?? "my word for it"
        }
        intro={
          siteConfig?.testimonialsIntro ??
          "Clients and collaborators I've built things with and for, in their own words."
        }
      />
    </main>
  )
}
