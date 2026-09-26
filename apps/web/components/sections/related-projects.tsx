import Image from "next/image"
import Link from "next/link"

import { cardLift, cn } from "@workspace/ui/lib/utils"
import { urlFor } from "@workspace/sanity/image"
import type { PROJECT_BY_SLUG_QUERY_RESULT } from "@workspace/sanity/types"

type RelatedProjectList = NonNullable<
  PROJECT_BY_SLUG_QUERY_RESULT
>["relatedProjects"]

interface RelatedProjectsProps {
  projects: RelatedProjectList
}

/**
 * Small cross-link card grid, kept in sync from the Studio side by
 * `apps/studio/actions/syncRelatedProjectsAction.ts` — this component just
 * renders whatever `relatedProjects` the query returns, matching the
 * Previous/Next nav's card language further down the page.
 */
export function RelatedProjects({ projects }: RelatedProjectsProps) {
  const entries = (projects ?? []).filter((project) => project.slug?.current)

  if (entries.length === 0) return null

  return (
    <section aria-labelledby="related-projects-heading" className="mt-12">
      <h2
        id="related-projects-heading"
        className="font-heading text-2xl font-black sm:text-3xl"
      >
        Related projects
      </h2>

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {entries.map((project) => {
          const coverUrl = project.coverImage?.asset
            ? urlFor(project.coverImage).width(128).height(128).fit("crop").url()
            : undefined

          return (
            <li key={project._id}>
              <Link
                href={`/projects/${project.slug!.current}`}
                className={cn(
                  "group flex items-center gap-3 overflow-hidden rounded-lg border-3 border-border bg-card p-4",
                  cardLift,
                  "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                )}
              >
                {coverUrl && (
                  <span className="block size-16 shrink-0 overflow-hidden rounded-md border-2 border-border bg-muted">
                    <Image
                      src={coverUrl}
                      alt=""
                      width={128}
                      height={128}
                      sizes="64px"
                      className="h-full w-full object-cover"
                    />
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate font-heading font-black">
                    {project.title}
                  </span>
                  {project.tagline && (
                    <span className="mt-0.5 block line-clamp-2 text-sm text-muted-foreground">
                      {project.tagline}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
