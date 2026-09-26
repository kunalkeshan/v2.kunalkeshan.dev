import { Suspense } from "react"
import type { Metadata } from "next"

import { Container } from "@workspace/ui/components/container"
import { sanityFetch } from "@workspace/sanity/live"
import { createCollectionTag } from "@workspace/sanity/cache-tags"
import { POSTS_QUERY, POST_COUNT_QUERY, TAGS_QUERY } from "@workspace/sanity/query"

import { HighlightText } from "@/components/highlight-text"
import { PageHero } from "@/components/page-hero"
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
  title: "Blog",
  description:
    "Notes and write-ups on the tools, decisions, and problems I run into building software.",
  // Always the clean, unfiltered URL — ?q=/?tag=/?page= variants are
  // duplicate content and must never self-canonicalize.
  alternates: { canonical: "/blog" },
}

interface BlogPageProps {
  searchParams: Promise<{ q?: string; tag?: string; page?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams
  const search = params.q?.trim() || null
  const tagSlug = params.tag?.trim() || null
  const page = parsePage(params.page)
  const { start, end } = pageSlice(page)

  const dynamicOptions = await getDynamicSanityFetchOptions()

  const [postsResult, totalCountResult, tagsResult] = await Promise.all([
    sanityFetch({
      query: POSTS_QUERY,
      params: { start, end, search, tagSlug },
      tags: [createCollectionTag("post")],
      ...dynamicOptions,
    }),
    sanityFetch({
      query: POST_COUNT_QUERY,
      params: { search, tagSlug },
      tags: [createCollectionTag("post")],
      ...dynamicOptions,
    }),
    sanityFetch({
      query: TAGS_QUERY,
      tags: [createCollectionTag("tag")],
      ...dynamicOptions,
    }),
  ])

  const posts = cleanSanityData(postsResult.data)
  const totalCount = cleanSanityData(totalCountResult.data)
  const tags = cleanSanityData(tagsResult.data)

  const totalPages = pageCount(totalCount ?? 0)

  function hrefForPage(targetPage: number) {
    const next = new URLSearchParams()
    if (search) next.set("q", search)
    if (tagSlug) next.set("tag", tagSlug)
    if (targetPage > 1) next.set("page", String(targetPage))
    const query = next.toString()
    return query ? `/blog?${query}` : "/blog"
  }

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <JsonLd
        data={buildCollectionPageJsonLd({
          name: "Blog",
          description:
            "Notes and write-ups on the tools, decisions, and problems I run into building software.",
          path: "/blog",
        })}
      />
      <JsonLd
        data={buildBreadcrumbListJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <Container>
        <PageHero
          heading={
            <>
              Notes and{" "}
              <HighlightText variant="primary">write-ups</HighlightText>
            </>
          }
          headingClassName="font-heading text-4xl leading-tight font-black sm:text-5xl"
          subtext="Things I run into building software — tools, decisions, and the occasional mistake worth writing down."
          subtextClassName="mt-4 max-w-2xl leading-relaxed text-body-foreground md:text-lg"
        />

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
            {posts && posts.length > 0 ? (
              <PostsGrid posts={posts} hrefPrefix="/blog" />
            ) : (
              <p className="text-sm text-muted-foreground">
                No posts match your search.
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
