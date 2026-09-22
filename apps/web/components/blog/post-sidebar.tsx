"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { type FormEvent, useState } from "react"
import { ArrowRightIcon, SearchIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"

import type { TocEntry } from "@/lib/toc"

interface SidebarPost {
  _id: string
  title: string | null
  slug: { current?: string | null } | null
}

export interface PostSidebarProps {
  hrefPrefix: "/blog" | "/journal"
  latestPosts: SidebarPost[]
  toc: TocEntry[]
  tags: Array<{ _id: string; name: string | null; slug: { current?: string | null } | null }>
}

/**
 * The repurposed sidebar from the cagpt.in reference: a search box + a
 * "latest articles" list, plus a table of contents and this post's tags —
 * no newsletter box, since this site has no email-capture infrastructure
 * (confirmed during planning rather than building one for this alone).
 */
export function PostSidebar({
  hrefPrefix,
  latestPosts,
  toc,
  tags,
}: PostSidebarProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = query.trim()
    router.push(trimmed ? `${hrefPrefix}?q=${encodeURIComponent(trimmed)}` : hrefPrefix)
  }

  const cardClass = "rounded-lg border-3 border-border bg-card p-5 shadow-lg"

  return (
    <div className="flex flex-col gap-5">
      <div className={cardClass}>
        {/*
          A visible submit button, not just Enter-to-search: an input with no
          affordance beyond a decorative icon reads as "nothing happened" when
          someone types and pauses, since there's nothing on screen inviting a
          next action.
        */}
        <form onSubmit={handleSearch} className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles..."
            aria-label="Search articles"
            className="h-10 pr-10 pl-8"
          />
          <Button
            type="submit"
            size="icon-sm"
            variant="ghost"
            aria-label="Search"
            className="absolute top-1/2 right-1 -translate-y-1/2"
          >
            <ArrowRightIcon />
          </Button>
        </form>
      </div>

      {toc.length > 0 && (
        <div className={cardClass}>
          <h2 className="font-heading text-sm font-black tracking-wide uppercase">
            On this page
          </h2>
          {/*
            Capped independently of the other cards: a post with a long
            table of contents must never push Latest Articles/Tags out of
            reach below the fold. This card scrolls on its own instead.
          */}
          <nav
            aria-label="Table of contents"
            className="mt-3 max-h-64 overflow-y-auto overscroll-contain pr-1"
          >
            <ul className="flex flex-col gap-2">
              {toc.map((entry) => (
                <li key={entry.id} className={entry.level === 3 ? "pl-3" : undefined}>
                  <a
                    href={`#${entry.id}`}
                    className={cn(
                      "text-sm text-muted-foreground hover:text-foreground",
                      "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                    )}
                  >
                    {entry.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {latestPosts.length > 0 && (
        <div className={cardClass}>
          <h2 className="font-heading text-sm font-black tracking-wide uppercase">
            Latest Articles
          </h2>
          <ul className="mt-3 flex flex-col gap-3">
            {latestPosts.map((post) => {
              const slug = post.slug?.current
              if (!slug) return null
              return (
                <li key={post._id}>
                  <Link
                    href={`${hrefPrefix}/${slug}`}
                    className={cn(
                      "block text-sm font-semibold text-foreground underline-offset-4 hover:underline",
                      "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                    )}
                  >
                    {post.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {tags.length > 0 && (
        <div className={cardClass}>
          <h2 className="font-heading text-sm font-black tracking-wide uppercase">
            Tags
          </h2>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => {
              const slug = tag.slug?.current
              if (!slug) return null
              return (
                <li key={tag._id}>
                  <Link
                    href={`/tags/${slug}`}
                    className={cn(
                      "inline-block rounded-sm border-2 border-border bg-background px-2 py-0.5 text-xs font-semibold",
                      "hover:bg-muted",
                      "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                    )}
                  >
                    {tag.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
