import { Suspense } from "react"
import type { Metadata } from "next"

import { Container } from "@workspace/ui/components/container"
import { sanityFetch } from "@workspace/sanity/live"
import { createCollectionTag } from "@workspace/sanity/cache-tags"
import { SKILLS_QUERY } from "@workspace/sanity/query"

import { HighlightText } from "@/components/highlight-text"
import { SkillsFiltered } from "@/components/sections/skills-filtered"
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
  title: "Skills",
  description:
    "The full list of tools, languages, and technologies I work with.",
  alternates: { canonical: "/skills" },
}

export default async function SkillsPage() {
  const skills = cleanSanityData(
    (
      await sanityFetch({
        query: SKILLS_QUERY,
        tags: [createCollectionTag("skill")],
        ...(await getDynamicSanityFetchOptions()),
      })
    ).data
  )

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <JsonLd
        data={buildCollectionPageJsonLd({
          name: "Skills",
          description:
            "The full list of tools, languages, and technologies I work with.",
          path: "/skills",
        })}
      />
      <JsonLd
        data={buildBreadcrumbListJsonLd([
          { name: "Home", path: "/" },
          { name: "Skills", path: "/skills" },
        ])}
      />
      <Container>
        <h1 className="font-heading text-4xl leading-tight font-black sm:text-5xl">
          A good workman never blames his tools
          {"—"}
          <HighlightText variant="secondary">
            but a great one collects them
          </HighlightText>
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-body-foreground md:text-lg">
          Everything I&apos;ve picked up and used in practice, grouped by
          category.
        </p>

        <div className="mt-10">
          <Suspense
            fallback={
              <div className="text-sm text-muted-foreground">Loading…</div>
            }
          >
            <SkillsFiltered skills={skills} />
          </Suspense>
        </div>
      </Container>
    </main>
  )
}
