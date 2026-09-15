import type { Metadata } from "next"

import { Container } from "@workspace/ui/components/container"
import { sanityFetch } from "@workspace/sanity/fetch"
import { createCollectionTag } from "@workspace/sanity/cache-tags"
import { SKILLS_QUERY } from "@workspace/sanity/query"
import type { SKILLS_QUERY_RESULT } from "@workspace/sanity/types"

import { HighlightText } from "@/components/highlight-text"
import { SkillsFiltered } from "@/components/sections/skills-filtered"

export const metadata: Metadata = {
  title: "Skills",
  description:
    "The full list of tools, languages, and technologies I work with.",
}

export default async function SkillsPage() {
  const skills = await sanityFetch<SKILLS_QUERY_RESULT>({
    query: SKILLS_QUERY,
    tags: [createCollectionTag("skill")],
  })

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
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
          <SkillsFiltered skills={skills} />
        </div>
      </Container>
    </main>
  )
}
