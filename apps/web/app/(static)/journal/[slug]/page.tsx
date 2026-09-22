import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PortableText } from "@portabletext/react"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { Container } from "@workspace/ui/components/container"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { cardLift, cn } from "@workspace/ui/lib/utils"
import { sanityFetch } from "@workspace/sanity/fetch"
import {
  createCollectionTag,
  createDocumentTag,
} from "@workspace/sanity/cache-tags"
import { urlFor } from "@workspace/sanity/image"
import {
  JOURNAL_ENTRY_BY_SLUG_QUERY,
  JOURNAL_ENTRY_SLUGS_QUERY,
  LATEST_JOURNAL_ENTRIES_QUERY,
} from "@workspace/sanity/query"
import type {
  JOURNAL_ENTRY_BY_SLUG_QUERY_RESULT,
  JOURNAL_ENTRY_SLUGS_QUERY_RESULT,
  LATEST_JOURNAL_ENTRIES_QUERY_RESULT,
} from "@workspace/sanity/types"

import { SITE_CONFIG } from "@/config/site"
import { postPortableTextComponents } from "@/components/blog/post-portable-text-components"
import { PostFooterLicense } from "@/components/blog/post-footer-license"
import { PostSidebar } from "@/components/blog/post-sidebar"
import { ReadingProgressBar } from "@/components/blog/reading-progress-bar"
import { ShareButtons } from "@/components/blog/share-buttons"
import { readingTime } from "@/lib/reading-time"
import { extractToc } from "@/lib/toc"

async function getEntry(slug: string) {
  return sanityFetch<JOURNAL_ENTRY_BY_SLUG_QUERY_RESULT>({
    query: JOURNAL_ENTRY_BY_SLUG_QUERY,
    params: { slug },
    tags: [
      createCollectionTag("journalEntry"),
      createDocumentTag("journalEntry", slug),
    ],
  })
}

async function getSlugs() {
  return sanityFetch<JOURNAL_ENTRY_SLUGS_QUERY_RESULT>({
    query: JOURNAL_ENTRY_SLUGS_QUERY,
    tags: [createCollectionTag("journalEntry")],
  })
}

async function getLatest() {
  return sanityFetch<LATEST_JOURNAL_ENTRIES_QUERY_RESULT>({
    query: LATEST_JOURNAL_ENTRIES_QUERY,
    tags: [createCollectionTag("journalEntry")],
  })
}

export async function generateStaticParams() {
  const entries = await getSlugs()

  return (entries ?? [])
    .map((entry) => entry.slug?.current)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }))
}

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = await getEntry(slug)

  if (!entry) return {}

  const title = entry.title ?? "Journal entry"
  const description = entry.excerpt ?? undefined

  // See blog/[slug]/page.tsx's generateMetadata for why `images` is omitted
  // via spread rather than set to `undefined` when there's no override.
  const overrideImage = entry.ogImage?.asset
    ? urlFor(entry.ogImage).width(1200).height(630).fit("crop").url()
    : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: entry.publishedAt ?? undefined,
      authors: entry.author?.name ? [entry.author.name] : undefined,
      ...(overrideImage && {
        images: [{ url: overrideImage, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(overrideImage && { images: [overrideImage] }),
    },
  }
}

export default async function JournalEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [entry, allSlugs, latest] = await Promise.all([
    getEntry(slug),
    getSlugs(),
    getLatest(),
  ])

  if (!entry) notFound()

  const coverUrl = entry.coverImage?.asset
    ? urlFor(entry.coverImage).width(1680).url()
    : undefined

  const authorPhotoUrl = entry.author?.photo?.asset
    ? urlFor(entry.author.photo).width(80).height(80).fit("crop").url()
    : undefined

  const dateLabel = entry.publishedAt
    ? DATE_FORMAT.format(new Date(entry.publishedAt))
    : null

  const toc = extractToc(entry.body)
  const tags = entry.tags ?? []
  const shareUrl = `${SITE_CONFIG.URL}/journal/${slug}`

  const ordered = (allSlugs ?? []).filter((item) => item.slug?.current)
  const currentIndex = ordered.findIndex((item) => item.slug?.current === slug)
  const previous = currentIndex > 0 ? ordered[currentIndex - 1] : null
  const next =
    currentIndex >= 0 && currentIndex < ordered.length - 1
      ? ordered[currentIndex + 1]
      : null

  const latestOthers = (latest ?? []).filter((item) => item.slug?.current !== slug)

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <ReadingProgressBar targetId="entry-article-body" />
      <Container>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/journal" />}>
                Journal
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{entry.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {tags.map((tag) =>
              tag.name ? (
                <span
                  key={tag._id}
                  className="rounded-sm border-2 border-border bg-secondary px-2 py-0.5 text-xs font-bold text-secondary-foreground"
                >
                  {tag.name}
                </span>
              ) : null
            )}
          </div>
        )}

        <h1 className="mt-3 font-heading text-4xl leading-tight font-black sm:text-5xl">
          {entry.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-semibold text-muted-foreground">
          {authorPhotoUrl && (
            <Image
              src={authorPhotoUrl}
              alt={entry.author?.photo?.alt ?? ""}
              width={32}
              height={32}
              className="size-8 rounded-full border-2 border-border object-cover"
            />
          )}
          {entry.author?.name && <span>{entry.author.name}</span>}
          {dateLabel && (
            <>
              <span aria-hidden="true">·</span>
              <span>{dateLabel}</span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>{readingTime(entry.body)}</span>
        </div>

        {coverUrl && (
          <div
            className={cn(
              "mt-8 aspect-[21/9] overflow-hidden rounded-lg border-3 border-border bg-muted",
              "shadow-xl transition-shadow duration-press ease-snap hover:shadow-2xl"
            )}
          >
            <Image
              src={coverUrl}
              alt={entry.coverImage?.alt ?? ""}
              width={1680}
              height={720}
              priority
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* See blog/[slug]/page.tsx for why this is flex-col, not -reverse. */}
        <div className="mt-12 flex flex-col gap-10 lg:flex-row lg:gap-16">
          <div className="min-w-0 flex-1">
            <article id="entry-article-body">
              <PortableText
                value={entry.body}
                components={postPortableTextComponents}
              />
            </article>

            <div className="mt-10 border-t-2 border-border pt-6">
              <ShareButtons url={shareUrl} title={entry.title ?? ""} />
            </div>

            <PostFooterLicense />

            {(previous || next) && (
              <nav
                aria-label="More entries"
                className="mt-16 border-t-2 border-border pt-8"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {previous?.slug?.current && (
                    <Link
                      href={`/journal/${previous.slug.current}`}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg border-3 border-border bg-card p-4",
                        cardLift,
                        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                      )}
                    >
                      <ArrowLeftIcon className="size-4 shrink-0" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block text-xs font-bold text-muted-foreground">
                          Previous
                        </span>
                        <span className="block truncate font-heading font-black">
                          {previous.title}
                        </span>
                      </span>
                    </Link>
                  )}

                  {next?.slug?.current && (
                    <Link
                      href={`/journal/${next.slug.current}`}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg border-3 border-border bg-card p-4 md:flex-row-reverse md:text-right",
                        "md:col-start-2",
                        cardLift,
                        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                      )}
                    >
                      <ArrowRightIcon className="size-4 shrink-0" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block text-xs font-bold text-muted-foreground">
                          Next
                        </span>
                        <span className="block truncate font-heading font-black">
                          {next.title}
                        </span>
                      </span>
                    </Link>
                  )}
                </div>
              </nav>
            )}
          </div>

          <aside className="lg:w-80 lg:shrink-0">
            {/*
              See blog/[slug]/page.tsx's aside for why there's no `h-fit`
              here, why the sticky div caps height and scrolls internally,
              and why it pads + negative-margins to keep the cards' hard
              offset shadows from being clipped by overflow-y-auto.
            */}
            <div className="lg:sticky lg:top-28 lg:z-10 lg:-mx-2 lg:-mb-2 lg:max-h-[calc(100vh-8rem+0.5rem)] lg:overflow-y-auto lg:overflow-x-hidden lg:p-2">
              <PostSidebar
                hrefPrefix="/journal"
                latestPosts={latestOthers}
                toc={toc}
                tags={tags}
              />
            </div>
          </aside>
        </div>
      </Container>
    </main>
  )
}
