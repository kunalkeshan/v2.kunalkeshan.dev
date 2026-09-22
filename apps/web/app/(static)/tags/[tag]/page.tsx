import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Container } from "@workspace/ui/components/container"
import { sanityFetch } from "@workspace/sanity/fetch"
import { createCollectionTag, createDocumentTag } from "@workspace/sanity/cache-tags"
import {
  TAG_BY_SLUG_QUERY,
  WRITING_BY_TAG_QUERY,
  WRITING_COUNT_BY_TAG_QUERY,
} from "@workspace/sanity/query"
import type {
  TAG_BY_SLUG_QUERY_RESULT,
  WRITING_BY_TAG_QUERY_RESULT,
  WRITING_COUNT_BY_TAG_QUERY_RESULT,
} from "@workspace/sanity/types"

import { HighlightText } from "@/components/highlight-text"
import { PostsGrid } from "@/components/blog/post-card"
import { PostPagination } from "@/components/blog/post-pagination"
import { pageCount, pageSlice, parsePage } from "@/lib/posts"

interface TagPageProps {
  params: Promise<{ tag: string }>
  searchParams: Promise<{ page?: string }>
}

async function getTag(slug: string) {
  return sanityFetch<TAG_BY_SLUG_QUERY_RESULT>({
    query: TAG_BY_SLUG_QUERY,
    params: { slug },
    tags: [createCollectionTag("tag"), createDocumentTag("tag", slug)],
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const { tag: slug } = await params
  const tag = await getTag(slug)

  if (!tag) return {}

  return {
    title: `#${tag.name}`,
    description:
      tag.description ??
      `Posts and journal entries tagged "${tag.name}".`,
  }
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tag: slug } = await params
  const { page: pageParam } = await searchParams
  const page = parsePage(pageParam)
  const { start, end } = pageSlice(page)

  const tag = await getTag(slug)
  if (!tag) notFound()

  const [items, totalCount] = await Promise.all([
    sanityFetch<WRITING_BY_TAG_QUERY_RESULT>({
      query: WRITING_BY_TAG_QUERY,
      params: { tagSlug: slug, start, end },
      tags: [createCollectionTag("post"), createCollectionTag("journalEntry")],
    }),
    sanityFetch<WRITING_COUNT_BY_TAG_QUERY_RESULT>({
      query: WRITING_COUNT_BY_TAG_QUERY,
      params: { tagSlug: slug },
      tags: [createCollectionTag("post"), createCollectionTag("journalEntry")],
    }),
  ])

  const totalPages = pageCount(totalCount ?? 0)

  function hrefForPage(targetPage: number) {
    return targetPage > 1 ? `/tags/${slug}?page=${targetPage}` : `/tags/${slug}`
  }

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <Container>
        <h1 className="font-heading text-4xl leading-tight font-black sm:text-5xl">
          <HighlightText variant="primary">#{tag.name}</HighlightText>
        </h1>
        {tag.description && (
          <p className="mt-4 max-w-2xl leading-relaxed text-body-foreground md:text-lg">
            {tag.description}
          </p>
        )}

        <div className="mt-10">
          {items && items.length > 0 ? (
            <PostsGrid
              posts={items}
              hrefPrefix={(post) => {
                const postSlug = post.slug?.current
                if (!postSlug) return undefined
                const kind = "kind" in post ? post.kind : undefined
                return kind === "journalEntry"
                  ? `/journal/${postSlug}`
                  : `/blog/${postSlug}`
              }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Nothing tagged &quot;{tag.name}&quot; yet.
            </p>
          )}
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
