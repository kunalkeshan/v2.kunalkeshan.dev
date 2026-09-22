import Image from "next/image"
import Link from "next/link"

import { cardLift, cn } from "@workspace/ui/lib/utils"
import { urlFor } from "@workspace/sanity/image"
import type {
  POSTS_QUERY_RESULT,
  JOURNAL_ENTRIES_QUERY_RESULT,
} from "@workspace/sanity/types"

/**
 * `post` and `journalEntry` share an identical card projection
 * (WRITING_CARD_FIELDS in query.ts), so one card component serves both
 * listing pages — the caller resolves the href, since /blog and /journal
 * cards use a fixed prefix but /tags/<slug> mixes both content types in one
 * grid and needs to route each card individually (see "kind" on
 * WRITING_BY_TAG_QUERY_RESULT).
 */
type WritingCardData =
  | POSTS_QUERY_RESULT[number]
  | JOURNAL_ENTRIES_QUERY_RESULT[number]

export interface PostCardProps {
  post: WritingCardData
  href: string | undefined
}

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

export function PostCard({ post, href }: PostCardProps) {
  const coverUrl = post.coverImage?.asset
    ? urlFor(post.coverImage).width(640).height(400).fit("crop").url()
    : undefined

  const dateLabel = post.publishedAt
    ? DATE_FORMAT.format(new Date(post.publishedAt))
    : null

  const initials = (post.title ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-lg border-3 border-border bg-card",
        cardLift
      )}
    >
      <div className="aspect-[16/10] overflow-hidden border-b-2 border-border bg-muted">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={post.coverImage?.alt ?? ""}
            width={640}
            height={400}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 100vw"
            className={cn(
              "h-full w-full object-cover",
              "scale-100 transform-gpu will-change-transform",
              "transition-transform duration-press ease-snap group-hover:scale-110",
              "motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            )}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-8">
            <span
              aria-hidden="true"
              className="font-heading text-5xl font-black text-muted-foreground/35"
            >
              {initials}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) =>
              tag.slug?.current ? (
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

        <h3 className="mt-3 font-heading text-xl font-black">
          {href ? (
            <Link
              href={href}
              className={cn(
                "underline-offset-4 hover:underline",
                "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
                "after:absolute after:inset-0 after:content-['']"
              )}
            >
              {post.title}
            </Link>
          ) : (
            post.title
          )}
        </h3>

        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-body-foreground">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center gap-3 pt-4 text-xs font-semibold text-muted-foreground">
          {post.author?.name && <span>{post.author.name}</span>}
          {dateLabel && (
            <>
              <span aria-hidden="true">·</span>
              <span>{dateLabel}</span>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

interface PostsGridProps {
  posts: WritingCardData[]
  /**
   * A fixed prefix ("/blog"/"/journal") for a single-type listing, or a
   * per-item resolver for a mixed grid like /tags/<slug>.
   */
  hrefPrefix: "/blog" | "/journal" | ((post: WritingCardData) => string | undefined)
}

export function PostsGrid({ posts, hrefPrefix }: PostsGridProps) {
  if (!posts || posts.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => {
        const slug = post.slug?.current
        const href =
          typeof hrefPrefix === "function"
            ? hrefPrefix(post)
            : slug
              ? `${hrefPrefix}/${slug}`
              : undefined

        return (
          <div key={post._id} className="relative">
            <PostCard post={post} href={href} />
          </div>
        )
      })}
    </div>
  )
}
