import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"

export interface PostPaginationProps {
  currentPage: number
  totalPages: number
  /** Builds the href for a given page number, preserving q/tag search params. */
  hrefForPage: (page: number) => string
}

/**
 * Numbered, URL-driven pagination — plain `<a>` links via PaginationLink, not
 * a client-side page-state toggle, so every page is a real crawlable,
 * indexable URL (the reason numbered pagination was chosen over infinite
 * scroll for /blog and /journal).
 *
 * Shows first, last, current +/-1, and ellipses for any gap — the common
 * "windowed" pagination shape, so a 40-page archive doesn't render 40 links.
 */
export function PostPagination({
  currentPage,
  totalPages,
  hrefForPage,
}: PostPaginationProps) {
  if (totalPages <= 1) return null

  const pages = new Set<number>([1, totalPages, currentPage])
  if (currentPage > 1) pages.add(currentPage - 1)
  if (currentPage < totalPages) pages.add(currentPage + 1)

  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)

  const items: Array<number | "ellipsis"> = []
  for (let i = 0; i < sorted.length; i++) {
    const page = sorted[i]
    if (page === undefined) continue
    if (i > 0) {
      const prev = sorted[i - 1]
      if (prev !== undefined && page - prev > 1) items.push("ellipsis")
    }
    items.push(page)
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? hrefForPage(currentPage - 1) : undefined}
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>

        {items.map((item, index) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink href={hrefForPage(item)} isActive={item === currentPage}>
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href={currentPage < totalPages ? hrefForPage(currentPage + 1) : undefined}
            aria-disabled={currentPage >= totalPages}
            className={
              currentPage >= totalPages ? "pointer-events-none opacity-50" : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
