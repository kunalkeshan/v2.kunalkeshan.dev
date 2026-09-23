import type { Metadata } from "next"

import { Container } from "@workspace/ui/components/container"
import { sanityFetch } from "@workspace/sanity/live"
import { urlFor } from "@workspace/sanity/image"
import { createCollectionTag } from "@workspace/sanity/cache-tags"
import {
  ABOUT_PAGE_QUERY,
  SITE_CONFIG_QUERY,
  VALUES_QUERY,
  FEATURED_SKILLS_QUERY,
} from "@workspace/sanity/query"

import { HighlightText } from "@/components/highlight-text"
import AboutStory from "@/components/sections/about-story"
import SkillsMarquee from "@/components/sections/skills-marquee"
import Values from "@/components/sections/values"
import { JsonLd } from "@/components/shared/json-ld"
import {
  buildBreadcrumbListJsonLd,
  buildPersonJsonLd,
  buildProfilePageJsonLd,
} from "@/lib/structured-data"
import {
  cleanSanityData,
  getDynamicSanityFetchOptions,
} from "@/lib/sanity-fetch-options"

export const metadata: Metadata = {
  title: "About",
  description:
    "How I got into software, what I work on now, and the principles I hold to. Software engineer, freelancer, and long-time builder for the web.",
  alternates: { canonical: "/about" },
}

/**
 * Same constant and reasoning as the home page: building for the web since 2021,
 * working professionally since 2025 — two claims that must never be conflated.
 * Substituted server-side so `new Date()` can't drift between server and client.
 */
const BUILDING_SINCE = 2021

export default async function AboutPage() {
  const dynamicOptions = await getDynamicSanityFetchOptions()

  const [aboutResult, siteConfigResult, valuesResult, skillsResult] =
    await Promise.all([
      sanityFetch({
        query: ABOUT_PAGE_QUERY,
        tags: [createCollectionTag("siteConfig")],
        ...dynamicOptions,
      }),
      sanityFetch({
        query: SITE_CONFIG_QUERY,
        tags: [createCollectionTag("siteConfig")],
        ...dynamicOptions,
      }),
      sanityFetch({
        query: VALUES_QUERY,
        tags: [createCollectionTag("value")],
        ...dynamicOptions,
      }),
      sanityFetch({
        query: FEATURED_SKILLS_QUERY,
        tags: [createCollectionTag("skill")],
        ...dynamicOptions,
      }),
    ])

  const about = cleanSanityData(aboutResult.data)
  const siteConfig = cleanSanityData(siteConfigResult.data)
  const values = cleanSanityData(valuesResult.data)
  const skills = cleanSanityData(skillsResult.data)

  const yearsBuilding = new Date().getFullYear() - BUILDING_SINCE

  const story = (about?.aboutPageStory ?? []).map((paragraph) =>
    paragraph.replace("{years}", String(yearsBuilding))
  )

  // Resolved here and passed down as a plain string — the repo's convention is
  // to keep Sanity image objects out of client components. The source portrait
  // is square, so a square crop is right (unlike the home page's 1433x1956).
  const portraitUrl = about?.aboutPagePortrait?.asset
    ? urlFor(about.aboutPagePortrait).width(1280).height(1280).url()
    : "/logo.jpg"

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <JsonLd data={buildPersonJsonLd(siteConfig)} />
      <JsonLd data={buildProfilePageJsonLd(siteConfig)} />
      <JsonLd
        data={buildBreadcrumbListJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <Container>
        <h1 className="font-heading text-4xl leading-tight font-black sm:text-5xl">
          {about?.aboutPageHeadingLead}{" "}
          <HighlightText variant="primary">
            {about?.aboutPageHeadingHighlight}
          </HighlightText>
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-body-foreground md:text-lg">
          {about?.aboutPageIntro}
        </p>
      </Container>

      <AboutStory
        headingLead={about?.aboutPageStoryHeadingLead ?? ""}
        headingHighlight={about?.aboutPageStoryHeadingHighlight ?? ""}
        headingTrail={about?.aboutPageStoryHeadingTrail}
        story={story}
        imageUrl={portraitUrl}
        imageAlt={
          about?.aboutPagePortrait?.alt ?? "Portrait photograph of Kunal Keshan"
        }
      />

      <SkillsMarquee skills={skills} />

      <Values
        values={values}
        heading={about?.aboutPageValuesHeading ?? ""}
        intro={about?.aboutPageValuesIntro ?? ""}
      />
    </main>
  )
}
