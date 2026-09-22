"use client"

import { SearchIcon } from "lucide-react"
import { parseAsString, parseAsInteger, useQueryStates } from "nuqs"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import type { TAGS_QUERY_RESULT } from "@workspace/sanity/types"

export interface PostListingControlsProps {
  tags: TAGS_QUERY_RESULT
}

/**
 * Search + tag filtering for /blog and /journal.
 *
 * Unlike \`projects-filtered.tsx\` (which fetches every project once and
 * filters client-side), search/tag/page here all live in the URL via nuqs
 * and drive a fresh server-side GROQ query — the post count is expected to
 * grow indefinitely, so "fetch everything, filter client-side" stops
 * scaling the way it does for the bounded /projects list. This component
 * only owns the URL state; the page component does the actual fetching.
 *
 * Changing search or tag resets \`page\` back to 1 — filtering the second
 * page of an unrelated result set would show as an empty page, not just no
 * change, so the reset has to be user-visible immediately.
 */
export function PostListingControls({ tags }: PostListingControlsProps) {
  const [search, setSearch] = useQueryStates(
    {
      q: parseAsString
        .withDefault("")
        .withOptions({ clearOnDefault: true, throttleMs: 400 }),
      tag: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
      page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
    },
    { shallow: false }
  )

  const chipClass = (isActive: boolean) =>
    cn(
      "h-auto cursor-pointer rounded-lg border-2 border-border px-3 py-1.5 text-xs normal-case",
      "shadow-sm transition-[translate,transform,box-shadow,background-color,color] duration-press ease-snap",
      "hover:translate-x-px hover:translate-y-px hover:shadow-none",
      isActive ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
    )

  const hasFilters = search.q.length > 0 || search.tag.length > 0

  return (
    <div>
      <div className="relative max-w-sm">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={search.q}
          onChange={(event) =>
            setSearch({ q: event.target.value || null, page: null })
          }
          placeholder="Search posts..."
          aria-label="Search posts"
          className="h-10 pl-8"
        />
      </div>

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {tags.map((tag) => {
            const slug = tag.slug?.current
            if (!slug) return null
            const isActive = search.tag === slug

            return (
              <Badge
                key={tag._id}
                onClick={() =>
                  setSearch({ tag: isActive ? null : slug, page: null })
                }
                aria-pressed={isActive}
                className={chipClass(isActive)}
              >
                {tag.name}
              </Badge>
            )
          })}
        </div>
      )}

      {hasFilters && (
        <div className="mt-3">
          <Button
            variant="link"
            size="xs"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setSearch({ q: null, tag: null, page: null })}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}
