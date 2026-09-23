import { Suspense } from "react"
import type { Metadata } from "next"

import { Container } from "@workspace/ui/components/container"
import { sanityFetch } from "@workspace/sanity/live"
import { createCollectionTag } from "@workspace/sanity/cache-tags"
import {
  JOURNAL_ENTRIES_QUERY,
  JOURNAL_ENTRY_COUNT_QUERY,
  TAGS_QUERY,
} from "@workspace/sanity/query"

import { HighlightText } from "@/components/highlight-text"
import { PostsGrid } from "@/components/blog/post-card"
import { PostListingControls } from "@/components/blog/post-listing-controls"
import { PostPagination } from "@/components/blog/post-pagination"
import { FilterResultsTransition } from "@/components/filters/filter-results-transition"
import { JsonLd } from "@/components/shared/json-ld"
import { pageCount, pageSlice, parsePage } from "@/lib/posts"
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
} from "@/lib/structured-data"
import {
  cleanSanityData,
  getDynamicSanityFetchOptions,
} from "@/lib/sanity-fetch-options"

export const metadata: Metadata = {
  title: "Journal",
  description:
    "A running, more personal log — shorter and less polished than the blog, written as things happen.",
  // Always the clean, unfiltered URL — ?q=/?tag=/?page= variants are
  // duplicate content and must never self-canonicalize.
  alternates: { canonical: "/journal" },
}

interface JournalPageProps {
  searchParams: Promise<{ q?: string; tag?: string; page?: string }>
}

export default async function JournalPage({ searchParams }: JournalPageProps) {
  const params = await searchParams
  const search = params.q?.trim() || null
  const tagSlug = params.tag?.trim() || null
  const page = parsePage(params.page)
  const { start, end } = pageSlice(page)

  const dynamicOptions = await getDynamicSanityFetchOptions()

  const [entriesResult, totalCountResult, tagsResult] = await Promise.all([
    sanityFetch({
      query: JOURNAL_ENTRIES_QUERY,
      params: { start, end, search, tagSlug },
      tags: [createCollectionTag("journalEntry")],
      ...dynamicOptions,
    }),
    sanityFetch({
      query: JOURNAL_ENTRY_COUNT_QUERY,
      params: { search, tagSlug },
      tags: [createCollectionTag("journalEntry")],
      ...dynamicOptions,
    }),
    sanityFetch({
      query: TAGS_QUERY,
      tags: [createCollectionTag("tag")],
      ...dynamicOptions,
    }),
  ])

  const entries = cleanSanityData(entriesResult.data)
  const totalCount = cleanSanityData(totalCountResult.data)
  const tags = cleanSanityData(tagsResult.data)

  const totalPages = pageCount(totalCount ?? 0)

  function hrefForPage(targetPage: number) {
    const next = new URLSearchParams()
    if (search) next.set("q", search)
    if (tagSlug) next.set("tag", tagSlug)
    if (targetPage > 1) next.set("page", String(targetPage))
    const query = next.toString()
    return query ? `/journal?${query}` : "/journal"
  }

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <JsonLd
        data={buildCollectionPageJsonLd({
          name: "Journal",
          description:
            "A running, more personal log — shorter and less polished than the blog.",
          path: "/journal",
        })}
      />
      <JsonLd
        data={buildBreadcrumbListJsonLd([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/journal" },
        ])}
      />
      <Container>
        <h1 className="font-heading text-4xl leading-tight font-black sm:text-5xl">
          The <HighlightText variant="secondary">journal</HighlightText>
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-body-foreground md:text-lg">
          Shorter, less polished, and more personal than the blog — written
          closer to when things actually happened.
        </p>

        <div className="mt-10">
          <Suspense
            fallback={
              <div className="text-sm text-muted-foreground">Loading…</div>
            }
          >
            <PostListingControls tags={tags ?? []} />
          </Suspense>
        </div>

        <div className="mt-8">
          <FilterResultsTransition
            resultsKey={`${search ?? ""}:${tagSlug ?? ""}:${page}`}
          >
            {entries && entries.length > 0 ? (
              <PostsGrid posts={entries} hrefPrefix="/journal" />
            ) : (
              <p className="text-sm text-muted-foreground">
                No entries match your search.
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
