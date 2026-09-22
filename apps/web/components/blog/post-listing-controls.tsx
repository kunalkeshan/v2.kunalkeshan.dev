"use client"

import { useTransition } from "react"
import { parseAsString, parseAsInteger, useQueryStates } from "nuqs"

import type { TAGS_QUERY_RESULT } from "@workspace/sanity/types"

import { FilterChipGroup } from "@/components/filters/filter-chip-group"
import { FilterClearButton } from "@/components/filters/filter-clear-button"
import { FilterSearchInput } from "@/components/filters/filter-search-input"

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
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useQueryStates(
    {
      q: parseAsString
        .withDefault("")
        .withOptions({ clearOnDefault: true, throttleMs: 400 }),
      tag: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
      page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
    },
    { shallow: false, startTransition }
  )

  const tagOptions = tags
    .filter((tag) => tag.slug?.current)
    .map((tag) => ({ value: tag.slug!.current!, label: tag.name ?? "" }))

  const hasFilters = search.q.length > 0 || search.tag.length > 0

  return (
    <div>
      <FilterSearchInput
        value={search.q}
        onChange={(value) => setSearch({ q: value || null, page: null })}
        placeholder="Search posts..."
        aria-label="Search posts"
        isPending={isPending}
      />

      {tagOptions.length > 0 && (
        <div className="mt-4">
          <FilterChipGroup
            options={tagOptions}
            selectionMode="single"
            value={search.tag ? [search.tag] : []}
            onChange={([next]) => setSearch({ tag: next ?? null, page: null })}
            aria-label="Filter by tag"
          />
        </div>
      )}

      <FilterClearButton
        show={hasFilters}
        onClick={() => setSearch({ q: null, tag: null, page: null })}
      />
    </div>
  )
}
