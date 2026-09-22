import type { BlockContent } from "@workspace/sanity/types"

/**
 * Words per minute for the reading-time estimate. 200 is the commonly cited
 * average adult silent-reading speed (same order of magnitude the old
 * journal.kunalkeshan.dev repo used) — not configurable per post, since a
 * per-post override would need its own schema field for a number nobody
 * would tune in practice.
 */
const WORDS_PER_MINUTE = 200

/**
 * Word count from a Portable Text body: walks each text block's `children`
 * spans and counts whitespace-separated words. Images and other non-text
 * array members are skipped — they contribute nothing to reading time.
 *
 * No `reading-time` npm dependency: that package works on plain text/HTML,
 * so Portable Text would need converting to plain text first regardless —
 * at which point walking the block array directly is less code, not more.
 */
export function wordCount(body: BlockContent | null | undefined): number {
  if (!body) return 0

  let count = 0
  for (const block of body) {
    if (block._type !== "block" || !block.children) continue
    for (const span of block.children) {
      if (!span.text) continue
      const words = span.text.trim().split(/\s+/).filter(Boolean)
      count += words.length
    }
  }
  return count
}

/**
 * "3 min read" — rounded up so a 30-second post still reads as "1 min read"
 * rather than "0 min read".
 */
export function readingTime(body: BlockContent | null | undefined): string {
  const minutes = Math.max(1, Math.ceil(wordCount(body) / WORDS_PER_MINUTE))
  return `${minutes} min read`
}
