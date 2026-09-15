import type { Metadata } from "next"

import { Container } from "@workspace/ui/components/container"
import { sanityFetch } from "@workspace/sanity/fetch"
import { createCollectionTag } from "@workspace/sanity/cache-tags"
import {
  EDUCATION_QUERY,
  EXPERIENCES_QUERY,
  PUBLICATIONS_QUERY,
  SITE_CONFIG_QUERY,
} from "@workspace/sanity/query"
import type {
  EDUCATION_QUERY_RESULT,
  EXPERIENCES_QUERY_RESULT,
  PUBLICATIONS_QUERY_RESULT,
  SITE_CONFIG_QUERY_RESULT,
} from "@workspace/sanity/types"

import { HighlightText } from "@/components/highlight-text"
import { ExperienceTimeline } from "@/components/sections/experience"
import { Publications } from "@/components/sections/publications"
import { ResumeCta } from "@/components/sections/resume-cta"
import {
  SectionNav,
  type SectionNavItem,
} from "@/components/sections/section-nav"

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Every role so far: full-time and contract engineering work, the community teams that came before it, and the education behind both.",
}

export default async function ExperiencePage() {
  const [siteConfig, experiences, education, publications] = await Promise.all([
    sanityFetch<SITE_CONFIG_QUERY_RESULT>({
      query: SITE_CONFIG_QUERY,
      tags: [createCollectionTag("siteConfig")],
    }),
    sanityFetch<EXPERIENCES_QUERY_RESULT>({
      query: EXPERIENCES_QUERY,
      tags: [createCollectionTag("experience")],
    }),
    sanityFetch<EDUCATION_QUERY_RESULT>({
      query: EDUCATION_QUERY,
      tags: [createCollectionTag("experience")],
    }),
    sanityFetch<PUBLICATIONS_QUERY_RESULT>({
      query: PUBLICATIONS_QUERY,
      tags: [createCollectionTag("publication")],
    }),
  ])

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
            />
          </div>
        )}
      </Container>
    </main>
  )
}
