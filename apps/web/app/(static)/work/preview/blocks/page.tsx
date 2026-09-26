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
import { PageHero } from "@/components/page-hero"
import { ResumeCta } from "@/components/sections/resume-cta"
import {
  SectionNav,
  type SectionNavItem,
} from "@/components/sections/section-nav"
import { ExperienceBlocks } from "@/components/work-previews/blocks/experience-blocks"
import { PublicationsBlocks } from "@/components/work-previews/blocks/publications-blocks"
import { PreviewBanner } from "@/components/work-previews/preview-banner"
import {
  cleanSanityData,
  getDynamicSanityFetchOptions,
} from "@/lib/sanity-fetch-options"

// Temporary comparison page — see plan "Rework /work: 4 real preview
// variants". Noindexed and canonicalized back to the real /work page, and
// left out of app/sitemap.ts, since it's not meant to be discovered or
// ranked as its own page.
export const metadata: Metadata = {
  title: "Experience — Preview: Blocks",
  robots: { index: false, follow: true },
  alternates: { canonical: "/work" },
}

export default async function ExperienceBlocksPreviewPage() {
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

  const sectionNavItems: SectionNavItem[] = [
    experiences.length > 0 && { id: "work", label: "Work" },
    education.length > 0 && { id: "education", label: "Education" },
    publications.length > 0 && { id: "publications", label: "Published" },
  ].filter((item): item is SectionNavItem => Boolean(item))

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <Container>
        <PreviewBanner variant="Blocks" />

        <PageHero
          heading={
            <>
              It&apos;s dangerous to go alone,{" "}
              <HighlightText variant="secondary">
                take this resume
              </HighlightText>
            </>
          }
          headingClassName="font-heading text-4xl leading-tight font-black text-balance sm:text-5xl"
          subtext="Everywhere I've worked, what I actually built there, and the tools each role left me with."
          subtextClassName="mt-4 max-w-2xl text-base leading-relaxed text-body-foreground md:text-lg"
        />

        <div className="mt-10">
          <SectionNav items={sectionNavItems} />
          <ExperienceBlocks experiences={experiences} education={education} />
        </div>

        <div className="mt-12">
          <PublicationsBlocks publications={publications} />
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
