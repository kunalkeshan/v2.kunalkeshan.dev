import type { Metadata } from "next"

import { Container } from "@workspace/ui/components/container"
import { sanityFetch } from "@workspace/sanity/fetch"
import { createCollectionTag } from "@workspace/sanity/cache-tags"
import {
  ARCHIVED_CERTIFICATIONS_QUERY,
  CERTIFICATIONS_QUERY,
} from "@workspace/sanity/query"
import type {
  ARCHIVED_CERTIFICATIONS_QUERY_RESULT,
  CERTIFICATIONS_QUERY_RESULT,
} from "@workspace/sanity/types"

import { HighlightText } from "@/components/highlight-text"
import {
  ArchivedCertifications,
  CertificationsGrid,
} from "@/components/sections/certifications"
import {
  SectionNav,
  type SectionNavItem,
} from "@/components/sections/section-nav"

export const metadata: Metadata = {
  title: "Certifications",
  description:
    "Courses and certifications completed over the years, from SQL fundamentals to the latest AI tooling.",
}

export default async function CertificationsPage() {
  const [certifications, archivedCertifications] = await Promise.all([
    sanityFetch<CERTIFICATIONS_QUERY_RESULT>({
      query: CERTIFICATIONS_QUERY,
      tags: [createCollectionTag("certification")],
    }),
    sanityFetch<ARCHIVED_CERTIFICATIONS_QUERY_RESULT>({
      query: ARCHIVED_CERTIFICATIONS_QUERY,
      tags: [createCollectionTag("certification")],
    }),
  ])

  // Only offer a jump target for sections that actually rendered, so the bar
  // never points at an anchor that isn't on the page.
  const sectionNavItems: SectionNavItem[] = [
    certifications.length > 0 && { id: "active", label: "Certifications" },
    archivedCertifications.length > 0 && { id: "archived", label: "Archived" },
  ].filter((item): item is SectionNavItem => Boolean(item))

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <Container>
        <h1 className="font-heading text-4xl leading-tight font-black text-balance sm:text-5xl">
          Achievement unlocked:{" "}
          <HighlightText variant="secondary">the paper trail</HighlightText>
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-body-foreground md:text-lg">
          Courses and certifications completed over the years, from SQL
          fundamentals to the latest AI tooling.
        </p>

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
