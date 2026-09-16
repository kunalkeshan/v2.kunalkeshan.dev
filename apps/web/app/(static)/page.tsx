import { sanityFetch } from "@workspace/sanity/fetch"
import { urlFor } from "@workspace/sanity/image"
import { createCollectionTag } from "@workspace/sanity/cache-tags"
import {
  SITE_CONFIG_QUERY,
  FEATURED_SKILLS_QUERY,
  SERVICES_QUERY,
  FEATURED_EXPERIENCES_QUERY,
  FEATURED_PROJECTS_QUERY,
} from "@workspace/sanity/query"
import type {
  SITE_CONFIG_QUERY_RESULT,
  FEATURED_SKILLS_QUERY_RESULT,
  SERVICES_QUERY_RESULT,
  FEATURED_EXPERIENCES_QUERY_RESULT,
  FEATURED_PROJECTS_QUERY_RESULT,
} from "@workspace/sanity/types"

import Hero from "@/components/sections/hero"
import Skills from "@/components/sections/skills"
import Services from "@/components/sections/services"
import About from "@/components/sections/about"
import Experience from "@/components/sections/experience"
import Projects from "@/components/sections/projects"
import { fetchStars } from "@/lib/github"

/**
 * Kunal has been building for the web since 2021, and working as a software
 * engineer professionally since 2025 — two distinct claims. The About copy
 * counts from `BUILDING_SINCE` only, so it never overstates years of
 * employment. Computed here in the Server Component rather than inside the
 * client section, so `new Date()` can't drift between server and client.
 */
const BUILDING_SINCE = 2021

export default async function Home() {
  const [siteConfig, skills, services, experiences, projects] =
    await Promise.all([
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
      sanityFetch<FEATURED_EXPERIENCES_QUERY_RESULT>({
        query: FEATURED_EXPERIENCES_QUERY,
        tags: [createCollectionTag("experience")],
      }),
      sanityFetch<FEATURED_PROJECTS_QUERY_RESULT>({
        query: FEATURED_PROJECTS_QUERY,
        tags: [createCollectionTag("project")],
      }),
    ])

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
    </main>
  )
}
