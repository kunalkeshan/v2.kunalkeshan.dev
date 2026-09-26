import { ScrollTextIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import type { PUBLICATIONS_QUERY_RESULT } from "@workspace/sanity/types"

import { formatMonthYear } from "@/lib/dates"
import { TrackedLink } from "@/components/shared/tracked-link"

/**
 * Same content as `components/sections/publications.tsx`, in the heavier
 * bordered-block language the "blocks" preview variant uses everywhere else.
 */
export function PublicationsBlocks({
  publications,
}: {
  publications: PUBLICATIONS_QUERY_RESULT
}) {
  if (!publications || publications.length === 0) return null

  return (
    <section id="publications" aria-labelledby="publications-heading">
      <h2
        id="publications-heading"
        className="mb-6 flex items-center gap-2.5 font-heading text-2xl font-black sm:text-3xl"
      >
        <ScrollTextIcon className="size-7" aria-hidden="true" />
        Published work
      </h2>

      <ul className="flex flex-col gap-8">
        {publications.map((publication) => {
          const published = formatMonthYear(publication.publishedAt)
          const href =
            publication.url ??
            (publication.doi ? `https://doi.org/${publication.doi}` : null)

          return (
            <li
              key={publication._id}
              className={cn(
                "rounded-lg border-3 border-border bg-card p-6 shadow-xl md:p-8"
              )}
            >
              <h3 className="font-heading text-xl font-black text-balance sm:text-2xl">
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
                <p className="mt-2 text-sm text-muted-foreground">
                  {publication.venue}
                  {publication.venue && published && (
                    <span aria-hidden="true"> · </span>
                  )}
                  {published}
                </p>
              )}

              {publication.authors && publication.authors.length > 0 && (
                <p className="mt-3 text-sm leading-relaxed text-body-foreground">
                  {publication.authors.join(", ")}
                </p>
              )}

              {publication.abstract && (
                <p className="mt-3 text-base leading-relaxed text-body-foreground">
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
