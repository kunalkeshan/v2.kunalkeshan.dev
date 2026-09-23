import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Container } from "@workspace/ui/components/container"
import { sanityFetch } from "@workspace/sanity/live"
import { createCollectionTag, createDocumentTag } from "@workspace/sanity/cache-tags"
import {
  TAG_BY_SLUG_QUERY,
  WRITING_BY_TAG_QUERY,
  WRITING_COUNT_BY_TAG_QUERY,
} from "@workspace/sanity/query"

import { HighlightText } from "@/components/highlight-text"
import { PostsGrid } from "@/components/blog/post-card"
import { PostPagination } from "@/components/blog/post-pagination"
import { JsonLd } from "@/components/shared/json-ld"
import { pageCount, pageSlice, parsePage } from "@/lib/posts"
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
} from "@/lib/structured-data"
import {
  cleanSanityData,
  getDynamicSanityFetchOptions,
  type SanityFetchOptions,
} from "@/lib/sanity-fetch-options"

interface TagPageProps {
  params: Promise<{ tag: string }>
  searchParams: Promise<{ page?: string }>
}

async function getTag(slug: string, options: SanityFetchOptions) {
  const { data } = await sanityFetch({
    query: TAG_BY_SLUG_QUERY,
    params: { slug },
    tags: [createCollectionTag("tag"), createDocumentTag("tag", slug)],
    ...options,
  })
  return cleanSanityData(data)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const { tag: slug } = await params
  // Never let stega leak into <title>/<meta> — always published, clean.
  const tag = await getTag(slug, { perspective: "published", stega: false })

  if (!tag) return {}

  return {
    title: `#${tag.name}`,
    description:
      tag.description ??
      `Posts and journal entries tagged "${tag.name}".`,
    // Always the clean, unpaginated URL — ?page= variants are duplicate
    // content and must never self-canonicalize.
    alternates: { canonical: `/tags/${slug}` },
  }
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tag: slug } = await params
  const { page: pageParam } = await searchParams
  const page = parsePage(pageParam)
  const { start, end } = pageSlice(page)

  const dynamicOptions = await getDynamicSanityFetchOptions()
  const tag = await getTag(slug, dynamicOptions)
  if (!tag) notFound()

  const [itemsResult, totalCountResult] = await Promise.all([
    sanityFetch({
      query: WRITING_BY_TAG_QUERY,
      params: { tagSlug: slug, start, end },
      tags: [createCollectionTag("post"), createCollectionTag("journalEntry")],
      ...dynamicOptions,
    }),
    sanityFetch({
      query: WRITING_COUNT_BY_TAG_QUERY,
      params: { tagSlug: slug },
      tags: [createCollectionTag("post"), createCollectionTag("journalEntry")],
      ...dynamicOptions,
    }),
  ])

  const items = cleanSanityData(itemsResult.data)
  const totalCount = cleanSanityData(totalCountResult.data)

  const totalPages = pageCount(totalCount ?? 0)

  function hrefForPage(targetPage: number) {
    return targetPage > 1 ? `/tags/${slug}?page=${targetPage}` : `/tags/${slug}`
  }

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <JsonLd
        data={buildCollectionPageJsonLd({
          name: `#${tag.name}`,
          description: tag.description,
          path: `/tags/${slug}`,
        })}
      />
      <JsonLd
        data={buildBreadcrumbListJsonLd([
          { name: "Home", path: "/" },
          { name: `#${tag.name}`, path: `/tags/${slug}` },
        ])}
      />
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
