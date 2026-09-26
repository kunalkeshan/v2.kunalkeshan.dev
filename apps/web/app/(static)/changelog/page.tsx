import type { Metadata } from "next"

import { Container } from "@workspace/ui/components/container"
import { getAppReleases, type AppRelease } from "@workspace/version"
import { env } from "@workspace/env/server"

import { PageHero } from "@/components/page-hero"
import { HighlightText } from "@/components/highlight-text"
import { ChangelogEntry } from "@/components/changelog/changelog-entry"
import { PostPagination } from "@/components/blog/post-pagination"
import { FilterResultsTransition } from "@/components/filters/filter-results-transition"
import { JsonLd } from "@/components/shared/json-ld"
import { pageCount, pageSlice, parsePage } from "@/lib/posts"
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
} from "@/lib/structured-data"

const PAGE_DESCRIPTION =
  "What's shipped on this site, straight from its GitHub release history."

// Web app releases are fetched fresh at most once per hour — no need to
// revalidate on every request for a page that changes a handful of times a
// year at most.
const RELEASES_REVALIDATE_SECONDS = 60 * 60

export const metadata: Metadata = {
  title: "Changelog",
  description: PAGE_DESCRIPTION,
  // Always the clean, unfiltered URL — ?page= variants are duplicate content.
  alternates: { canonical: "/changelog" },
}

interface ChangelogPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function ChangelogPage({
  searchParams,
}: ChangelogPageProps) {
  const params = await searchParams
  const page = parsePage(params.page)
  const { start, end } = pageSlice(page)

  // The GitHub API (rate limits, transient outages) is out of our control —
  // failing to fetch shouldn't 500 the whole page, just show fewer releases
  // than usual.
  let releases: AppRelease[] = []
  let fetchFailed = false
  try {
    releases = await getAppReleases("web", {
      token: env.GITHUB_RELEASES_TOKEN,
      revalidate: RELEASES_REVALIDATE_SECONDS,
    })
  } catch (error) {
    console.error("Failed to fetch GitHub releases for /changelog:", error)
    fetchFailed = true
  }

  const totalPages = pageCount(releases.length)
  const pageReleases = releases.slice(start, end)

  function hrefForPage(targetPage: number) {
    return targetPage > 1 ? `/changelog?page=${targetPage}` : "/changelog"
  }

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <JsonLd
        data={buildCollectionPageJsonLd({
          name: "Changelog",
          description: PAGE_DESCRIPTION,
          path: "/changelog",
        })}
      />
      <JsonLd
        data={buildBreadcrumbListJsonLd([
          { name: "Home", path: "/" },
          { name: "Changelog", path: "/changelog" },
        ])}
      />
      <Container>
        <PageHero
          heading={
            <>
              What&apos;s <HighlightText variant="primary">shipped</HighlightText>
            </>
          }
          headingClassName="font-heading text-4xl leading-tight font-black sm:text-5xl"
          subtext={PAGE_DESCRIPTION}
          subtextClassName="mt-4 max-w-2xl leading-relaxed text-body-foreground md:text-lg"
        />

        <div className="mt-10">
          <FilterResultsTransition resultsKey={String(page)}>
            {pageReleases.length > 0 ? (
              <div className="flex flex-col gap-6">
                {pageReleases.map((release) => (
                  <ChangelogEntry key={release.tag} release={release} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {fetchFailed
                  ? "Couldn't load releases right now — please try again shortly."
                  : releases.length === 0
                    ? "No releases have been published yet — check back soon."
                    : "There's nothing on this page."}
              </p>
            )}
          </FilterResultsTransition>
        </div>

        {totalPages > 1 && (
          <div className="mt-12">
            <PostPagination
              currentPage={page}
              totalPages={totalPages}
              hrefForPage={hrefForPage}
            />
          </div>
        )}
      </Container>
    </main>
  )
}
