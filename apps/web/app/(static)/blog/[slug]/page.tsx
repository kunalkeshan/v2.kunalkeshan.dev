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
  LATEST_POSTS_QUERY,
  POST_BY_SLUG_QUERY,
  POST_SLUGS_QUERY,
} from "@workspace/sanity/query"
import type {
  LATEST_POSTS_QUERY_RESULT,
  POST_BY_SLUG_QUERY_RESULT,
  POST_SLUGS_QUERY_RESULT,
} from "@workspace/sanity/types"

import { SITE_CONFIG } from "@/config/site"
import { postPortableTextComponents } from "@/components/blog/post-portable-text-components"
import { PostFooterLicense } from "@/components/blog/post-footer-license"
import { PostSidebar } from "@/components/blog/post-sidebar"
import { ReadingProgressBar } from "@/components/blog/reading-progress-bar"
import { ShareButtons } from "@/components/blog/share-buttons"
import { readingTime } from "@/lib/reading-time"
import { extractToc } from "@/lib/toc"

async function getPost(slug: string) {
  return sanityFetch<POST_BY_SLUG_QUERY_RESULT>({
    query: POST_BY_SLUG_QUERY,
    params: { slug },
    tags: [createCollectionTag("post"), createDocumentTag("post", slug)],
  })
}

async function getSlugs() {
  return sanityFetch<POST_SLUGS_QUERY_RESULT>({
    query: POST_SLUGS_QUERY,
    tags: [createCollectionTag("post")],
  })
}

async function getLatest() {
  return sanityFetch<LATEST_POSTS_QUERY_RESULT>({
    query: LATEST_POSTS_QUERY,
    tags: [createCollectionTag("post")],
  })
}

export async function generateStaticParams() {
  const posts = await getSlugs()

  return (posts ?? [])
    .map((post) => post.slug?.current)
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
  const post = await getPost(slug)

  if (!post) return {}

  const title = post.title ?? "Post"
  const description = post.excerpt ?? undefined

  // Only overrides next/og's file-convention opengraph-image.tsx when a
  // manual override was set in Studio. An `images` key present on the
  // returned object — even set to `undefined` — stops Next from merging in
  // the file-convention image for this segment, so the key is omitted
  // entirely (via spread) rather than included with an undefined value.
  const overrideImage = post.ogImage?.asset
    ? urlFor(post.ogImage).width(1200).height(630).fit("crop").url()
    : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      authors: post.author?.name ? [post.author.name] : undefined,
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [post, allSlugs, latest] = await Promise.all([
    getPost(slug),
    getSlugs(),
    getLatest(),
  ])

  if (!post) notFound()

  const coverUrl = post.coverImage?.asset
    ? urlFor(post.coverImage).width(1680).url()
    : undefined

  const authorPhotoUrl = post.author?.photo?.asset
    ? urlFor(post.author.photo).width(80).height(80).fit("crop").url()
    : undefined

  const dateLabel = post.publishedAt
    ? DATE_FORMAT.format(new Date(post.publishedAt))
    : null

  const toc = extractToc(post.body)
  const tags = post.tags ?? []
  const shareUrl = `${SITE_CONFIG.URL}/blog/${slug}`

  // Neighbours follow publishedAt order, matching the listing page.
  const ordered = (allSlugs ?? []).filter((entry) => entry.slug?.current)
  const currentIndex = ordered.findIndex((entry) => entry.slug?.current === slug)
  const previous = currentIndex > 0 ? ordered[currentIndex - 1] : null
  const next =
    currentIndex >= 0 && currentIndex < ordered.length - 1
      ? ordered[currentIndex + 1]
      : null

  const latestOthers = (latest ?? []).filter((entry) => entry.slug?.current !== slug)

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <ReadingProgressBar targetId="post-article-body" />
      <Container>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/blog" />}>Blog</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{post.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {tags.map((tag) =>
              tag.name ? (
                <span
                  key={tag._id}
                  className="rounded-sm border-2 border-border bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground"
                >
                  {tag.name}
                </span>
              ) : null
            )}
          </div>
        )}

        <h1 className="mt-3 font-heading text-4xl leading-tight font-black sm:text-5xl">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-semibold text-muted-foreground">
          {authorPhotoUrl && (
            <Image
              src={authorPhotoUrl}
              alt={post.author?.photo?.alt ?? ""}
              width={32}
              height={32}
              className="size-8 rounded-full border-2 border-border object-cover"
            />
          )}
          {post.author?.name && <span>{post.author.name}</span>}
          {dateLabel && (
            <>
              <span aria-hidden="true">·</span>
              <span>{dateLabel}</span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>{readingTime(post.body)}</span>
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
              alt={post.coverImage?.alt ?? ""}
              width={1680}
              height={720}
              priority
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/*
          Plain `flex-col` (not `-reverse`, unlike the /projects detail page):
          the sidebar there is a small Information/Links panel readers expect
          above the fold; here it's a taller search/TOC/latest/tags stack that
          reads as supplementary, so it belongs after the article on mobile,
          not before it.
        */}
        <div className="mt-12 flex flex-col gap-10 lg:flex-row lg:gap-16">
          <div className="min-w-0 flex-1">
            <article id="post-article-body">
              <PortableText
                value={post.body}
                components={postPortableTextComponents}
              />
            </article>

            <div className="mt-10 border-t-2 border-border pt-6">
              <ShareButtons url={shareUrl} title={post.title ?? ""} />
            </div>

            <PostFooterLicense />

            {(previous || next) && (
              <nav
                aria-label="More posts"
                className="mt-16 border-t-2 border-border pt-8"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {previous?.slug?.current && (
                    <Link
                      href={`/blog/${previous.slug.current}`}
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
                      href={`/blog/${next.slug.current}`}
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
              No `h-fit` here: the aside must stretch to the main column's
              full height (the flex row's default `items-stretch`) so the
              sticky div below has scroll room for the *entire* article, not
              just its own shorter content height. With `h-fit`, a sidebar
              shorter than the article would detach from `sticky` as soon as
              its own bottom edge was reached and scroll away early.

              `max-h-[calc(100vh-...)]` + `overflow-y-auto`: the sidebar
              stacks four cards (search/TOC/latest/tags), which can still be
              taller than the viewport (e.g. a post with a long table of
              contents). Capping the sticky div's own height and letting it
              scroll internally keeps the whole block within the viewport,
              under the navbar, instead of being clipped or pushing later
              cards out of reach.

              The cards' own `shadow-lg` is a hard *offset* shadow (no blur —
              see design-system.md), which draws outside their border box.
              `overflow-y-auto` clips that at the scroll container's edge, so
              this pads the container by the shadow's offset and pulls the
              padding back out with a matching negative margin — the visible
              column still lines up with the width `aside` reserves, but the
              scroll box now has room to render the shadow before clipping.
            */}
            <div className="lg:sticky lg:top-28 lg:z-10 lg:-mx-2 lg:-mb-2 lg:max-h-[calc(100vh-8rem+0.5rem)] lg:overflow-y-auto lg:overflow-x-hidden lg:p-2">
              <PostSidebar
                hrefPrefix="/blog"
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
