export const POSTS_PAGE_SIZE = 9

/**
 * GROQ slice bounds for a 1-indexed page number. Page 1 -> [0, 9),
 * page 2 -> [9, 18), etc. — \`[$start...$end]\` in a GROQ query is an
 * inclusive-exclusive range, matching Array.slice semantics.
 */
export function pageSlice(page: number): { start: number; end: number } {
  const safePage = Math.max(1, page)
  const start = (safePage - 1) * POSTS_PAGE_SIZE
  return { start, end: start + POSTS_PAGE_SIZE }
}

export function pageCount(totalCount: number): number {
  return Math.max(1, Math.ceil(totalCount / POSTS_PAGE_SIZE))
}

/**
 * Parses and clamps the \`?page=\` search param. Anything invalid (missing,
 * non-numeric, zero, negative) falls back to page 1 rather than erroring —
 * a stale/hand-edited URL should degrade gracefully, not 500 or 404.
 */
export function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = raw ? Number.parseInt(raw, 10) : 1
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}
