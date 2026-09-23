import type { Metadata } from "next"

import { Container } from "@workspace/ui/components/container"
import { sanityFetch } from "@workspace/sanity/live"
import { createCollectionTag } from "@workspace/sanity/cache-tags"
import {
  EDUCATION_QUERY,
  EXPERIENCES_QUERY,
  PUBLICATIONS_QUERY,
  SITE_CONFIG_QUERY,
} from "@workspace/sanity/query"

import { HighlightText } from "@/components/highlight-text"
import { ExperienceTimeline } from "@/components/sections/experience"
import { Publications } from "@/components/sections/publications"
import { ResumeCta } from "@/components/sections/resume-cta"
import {
  SectionNav,
  type SectionNavItem,
} from "@/components/sections/section-nav"
import {
  cleanSanityData,
  getDynamicSanityFetchOptions,
} from "@/lib/sanity-fetch-options"

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Every role so far: full-time and contract engineering work, the community teams that came before it, and the education behind both.",
}

export default async function ExperiencePage() {
  const dynamicOptions = await getDynamicSanityFetchOptions()

  const [siteConfigResult, experiencesResult, educationResult, publicationsResult] =
    await Promise.all([
      sanityFetch({
        query: SITE_CONFIG_QUERY,
        tags: [createCollectionTag("siteConfig")],
        ...dynamicOptions,
      }),
      sanityFetch({
        query: EXPERIENCES_QUERY,
        tags: [createCollectionTag("experience")],
        ...dynamicOptions,
      }),
      sanityFetch({
        query: EDUCATION_QUERY,
        tags: [createCollectionTag("experience")],
        ...dynamicOptions,
      }),
      sanityFetch({
        query: PUBLICATIONS_QUERY,
        tags: [createCollectionTag("publication")],
        ...dynamicOptions,
      }),
    ])

  const siteConfig = cleanSanityData(siteConfigResult.data)
  const experiences = cleanSanityData(experiencesResult.data)
  const education = cleanSanityData(educationResult.data)
  const publications = cleanSanityData(publicationsResult.data)

  const resumeUrl = siteConfig?.resumePdf?.asset?.url ?? null

  // Only offer a jump target for sections that actually rendered, so the bar
  // never points at an anchor that isn't on the page.
  const sectionNavItems: SectionNavItem[] = [
    experiences.length > 0 && { id: "work", label: "Work" },
    education.length > 0 && { id: "education", label: "Education" },
    publications.length > 0 && { id: "publications", label: "Published" },
  ].filter((item): item is SectionNavItem => Boolean(item))

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <Container>
        <h1 className="font-heading text-4xl leading-tight font-black text-balance sm:text-5xl">
          It&apos;s dangerous to go alone,{" "}
          <HighlightText variant="secondary">take this resume</HighlightText>
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-body-foreground md:text-lg">
          Everywhere I&apos;ve worked, what I actually built there, and the
          tools each role left me with.
        </p>

        <div className="mt-10">
          <SectionNav items={sectionNavItems} />
          <ExperienceTimeline
            experiences={experiences}
            education={education}
          />
        </div>

        <div className="mt-12">
          <Publications publications={publications} />
        </div>

        {resumeUrl && (
          <div className="mt-12">
            <ResumeCta
              fileUrl={resumeUrl}
              fileName="Kunal Keshan - Resume.pdf"
              certificationsHref="/certifications"
            />
          </div>
        )}
      </Container>
    </main>
  )
}
