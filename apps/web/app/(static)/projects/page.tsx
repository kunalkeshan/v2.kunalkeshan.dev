import { Suspense } from "react"
import type { Metadata } from "next"

import { Container } from "@workspace/ui/components/container"
import { sanityFetch } from "@workspace/sanity/live"
import { createCollectionTag } from "@workspace/sanity/cache-tags"
import { PROJECTS_QUERY } from "@workspace/sanity/query"

import { HighlightText } from "@/components/highlight-text"
import { ProjectsFiltered } from "@/components/sections/projects-filtered"
import { fetchStars } from "@/lib/github"
import {
  cleanSanityData,
  getDynamicSanityFetchOptions,
} from "@/lib/sanity-fetch-options"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Products, client work, and side projects I've designed, built, and shipped — with the stack and the story behind each one.",
}

export default async function ProjectsPage() {
  const projects = cleanSanityData(
    (
      await sanityFetch({
        query: PROJECTS_QUERY,
        tags: [createCollectionTag("project")],
        ...(await getDynamicSanityFetchOptions()),
      })
    ).data
  )

  // One batched call for the whole page rather than one per card: GitHub's
  // unauthenticated budget is 60 requests/hour for the entire build machine.
  const stars = await fetchStars(
    (projects ?? [])
      .map((project) => project.githubRepo)
      .filter((repo): repo is string => Boolean(repo))
  )

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <Container>
        <h1 className="font-heading text-4xl leading-tight font-black sm:text-5xl">
          Things I&apos;ve <HighlightText variant="primary">built</HighlightText>
        </h1>
        {/*
          The home section's heading is "It works on my machine". This opening
          line completes that joke — but states it outright rather than relying
          on the setup, so it still lands for anyone arriving here cold from
          search instead of from the home page.
        */}
        <p className="mt-4 max-w-2xl leading-relaxed text-body-foreground md:text-lg">
          It works on my machine — and, as it turns out, everywhere else too.
          Products shipped in full-time and contract roles, freelance builds,
          and the side projects I keep coming back to. Filter by how it was
          built or what it was built with.
        </p>

        <div className="mt-10">
          {/*
            `ProjectsFiltered` keeps its state in the URL via nuqs, which reads
            `useSearchParams()`. Next can't statically prerender a page that
            calls that outside a Suspense boundary, so the shell renders and
            the filtered grid streams in.
          */}
          <Suspense
            fallback={
              <div className="text-sm text-muted-foreground">
                Loading projects…
              </div>
            }
          >
            <ProjectsFiltered projects={projects} stars={stars} />
          </Suspense>
        </div>
      </Container>
    </main>
  )
}
