import type { Metadata } from "next"

import { Container } from "@workspace/ui/components/container"
import { sanityFetch } from "@workspace/sanity/live"
import { createCollectionTag } from "@workspace/sanity/cache-tags"
import {
  ARCHIVED_CERTIFICATIONS_QUERY,
  CERTIFICATIONS_QUERY,
} from "@workspace/sanity/query"

import { HighlightText } from "@/components/highlight-text"
import { PageHero } from "@/components/page-hero"
import {
  ArchivedCertifications,
  CertificationsGrid,
} from "@/components/sections/certifications"
import {
  SectionNav,
  type SectionNavItem,
} from "@/components/sections/section-nav"
import { JsonLd } from "@/components/shared/json-ld"
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
} from "@/lib/structured-data"
import {
  cleanSanityData,
  getDynamicSanityFetchOptions,
} from "@/lib/sanity-fetch-options"

export const metadata: Metadata = {
  title: "Certifications",
  description:
    "Courses and certifications completed over the years, from SQL fundamentals to the latest AI tooling.",
  alternates: { canonical: "/certifications" },
}

export default async function CertificationsPage() {
  const dynamicOptions = await getDynamicSanityFetchOptions()

  const [certificationsResult, archivedCertificationsResult] =
    await Promise.all([
      sanityFetch({
        query: CERTIFICATIONS_QUERY,
        tags: [createCollectionTag("certification")],
        ...dynamicOptions,
      }),
      sanityFetch({
        query: ARCHIVED_CERTIFICATIONS_QUERY,
        tags: [createCollectionTag("certification")],
        ...dynamicOptions,
      }),
    ])

  const certifications = cleanSanityData(certificationsResult.data)
  const archivedCertifications = cleanSanityData(
    archivedCertificationsResult.data
  )

  // Only offer a jump target for sections that actually rendered, so the bar
  // never points at an anchor that isn't on the page.
  const sectionNavItems: SectionNavItem[] = [
    certifications.length > 0 && { id: "active", label: "Certifications" },
    archivedCertifications.length > 0 && { id: "archived", label: "Archived" },
  ].filter((item): item is SectionNavItem => Boolean(item))

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <JsonLd
        data={buildCollectionPageJsonLd({
          name: "Certifications",
          description:
            "Courses and certifications completed over the years.",
          path: "/certifications",
        })}
      />
      <JsonLd
        data={buildBreadcrumbListJsonLd([
          { name: "Home", path: "/" },
          { name: "Certifications", path: "/certifications" },
        ])}
      />
      <Container>
        <PageHero
          heading={
            <>
              Achievement unlocked:{" "}
              <HighlightText variant="secondary">
                the paper trail
              </HighlightText>
            </>
          }
          headingClassName="font-heading text-4xl leading-tight font-black text-balance sm:text-5xl"
          subtext="Courses and certifications completed over the years, from SQL fundamentals to the latest AI tooling."
          subtextClassName="mt-4 max-w-2xl text-base leading-relaxed text-body-foreground md:text-lg"
        />

        <div className="mt-10">
          <SectionNav items={sectionNavItems} />

          <div className="flex flex-col gap-12">
            {certifications.length > 0 && (
              <div id="active">
                <CertificationsGrid certifications={certifications} />
              </div>
            )}

            <ArchivedCertifications certifications={archivedCertifications} />
          </div>
        </div>
      </Container>
    </main>
  )
}
