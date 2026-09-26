export interface TocEntry {
  id: string
  text: string
  level: 2 | 3
}

/**
 * A block content array mixes text blocks and non-text members (images).
 * This only reads text-block fields, so it's typed against that minimal
 * shape rather than the generated `BlockContent` union — which now differs
 * per query depending on whether the embedded image is dereferenced
 * (`asset->`), and would otherwise need this file to track that per call
 * site even though it never touches the image member at all.
 */
interface PortableTextLikeBlock {
  _type: string
  _key: string
  style?: string
  children?: readonly { text?: string | null }[]
}

/**
 * The rendered heading's anchor `id`. Built from the block's own `_key`
 * (stable and unique per block, present in both the GROQ result this file
 * reads and the render props post-portable-text-components.tsx sees) rather
 * than a derived text slug or a running counter — either would need the two
 * sides to stay in lockstep, and a duplicate heading title would collide.
 */
export function headingId(key: string): string {
  return `heading-${key}`
}

/**
 * Extracts H2/H3 headings from a post's Portable Text body for the sidebar
 * table of contents — the schema's field description tells authors "use
 * Heading 2 / Heading 3 for section breaks" specifically so this can exist.
 *
 * Reads the *source* style values ("h2"/"h3") directly off the block array,
 * not the rendered DOM — portable-text-components.tsx shifts heading levels
 * down by one for display (h2 style -> rendered <h3>), but the TOC only
 * cares about the author's intent, not the final tag name.
 */
export function extractToc(
  body: readonly PortableTextLikeBlock[] | null | undefined
): TocEntry[] {
  if (!body) return []

  const entries: TocEntry[] = []

  for (const block of body) {
    if (block._type !== "block") continue
    if (block.style !== "h2" && block.style !== "h3") continue

    const text = (block.children ?? [])
      .map((span) => span.text ?? "")
      .join("")
      .trim()
    if (!text) continue

    entries.push({
      id: headingId(block._key),
      text,
      level: block.style === "h2" ? 2 : 3,
    })
  }

  return entries
}
