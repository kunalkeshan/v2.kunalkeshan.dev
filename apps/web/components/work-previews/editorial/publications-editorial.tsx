import { ScrollTextIcon } from "lucide-react"

import type { PUBLICATIONS_QUERY_RESULT } from "@workspace/sanity/types"

import { formatMonthYear } from "@/lib/dates"
import { TrackedLink } from "@/components/shared/tracked-link"

/**
 * Same content as `components/sections/publications.tsx`, laid out with thin
 * rule dividers instead of bordered cards, to match the "editorial"
 * variant's lighter, magazine-like typography.
 */
export function PublicationsEditorial({
  publications,
}: {
  publications: PUBLICATIONS_QUERY_RESULT
}) {
  if (!publications || publications.length === 0) return null

  return (
    <section id="publications" aria-labelledby="publications-heading">
      <h2
        id="publications-heading"
        className="mb-2 flex items-center gap-2.5 font-heading text-2xl font-black sm:text-3xl"
      >
        <ScrollTextIcon className="size-7" aria-hidden="true" />
        Published work
      </h2>

      <ul className="flex flex-col divide-y-2 divide-border">
        {publications.map((publication) => {
          const published = formatMonthYear(publication.publishedAt)
          const href =
            publication.url ??
            (publication.doi ? `https://doi.org/${publication.doi}` : null)

          return (
            <li key={publication._id} className="py-8 first:pt-8">
              <h3 className="font-heading text-2xl font-black text-balance sm:text-3xl">
                {href ? (
                  <TrackedLink
                    platform="publication"
                    url={href}
                    placement="publications"
                  >
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                    >
                      {publication.title}
                    </a>
                  </TrackedLink>
                ) : (
                  publication.title
                )}
              </h3>

              {(publication.venue || published) && (
                <p className="mt-2 text-sm font-bold text-muted-foreground">
                  {publication.venue}
                  {publication.venue && published && (
                    <span aria-hidden="true"> · </span>
                  )}
                  {published}
                </p>
              )}

              {publication.authors && publication.authors.length > 0 && (
                <p className="mt-3 text-base leading-relaxed text-body-foreground">
                  {publication.authors.join(", ")}
                </p>
              )}

              {publication.abstract && (
                <p className="mt-3 text-lg leading-relaxed text-body-foreground">
                  {publication.abstract}
                </p>
              )}

              {publication.doi && (
                <p className="mt-4 font-mono text-xs text-muted-foreground">
                  DOI: {publication.doi}
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
