import Image from "next/image"

import { urlFor } from "@workspace/sanity/image"
import type { PROJECT_BY_SLUG_QUERY_RESULT } from "@workspace/sanity/types"

type Collaborators = NonNullable<PROJECT_BY_SLUG_QUERY_RESULT>["collaborators"]

interface ProjectCollaboratorsProps {
  collaborators: Collaborators
}

/**
 * Initials fallback for a collaborator with no photo — `person.photo` is
 * optional (unlike a testimonial's headshot), since a college-era teammate
 * or research assistant may not have one on hand.
 */
function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? ""
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : ""
  return (first + last).toUpperCase()
}

export function ProjectCollaborators({
  collaborators,
}: ProjectCollaboratorsProps) {
  const entries = (collaborators ?? []).filter(
    (entry) => entry.person?.name
  )

  if (entries.length === 0) return null

  return (
    <section aria-labelledby="collaborators-heading" className="mt-12">
      <h2
        id="collaborators-heading"
        className="font-heading text-2xl font-black sm:text-3xl"
      >
        Collaborators
      </h2>

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {entries.map((entry, index) => {
          const person = entry.person!
          const photoUrl = person.photo?.asset
            ? urlFor(person.photo).width(96).height(96).fit("crop").url()
            : undefined
          const org = person.organization?.name ?? person.organizationName
          const roleLine = [person.position, org].filter(Boolean).join(" at ")

          return (
            <li
              key={person._id ?? index}
              className="flex items-start gap-3 rounded-lg border-3 border-border bg-card p-4 shadow-sm"
            >
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={person.photo?.alt ?? ""}
                  width={96}
                  height={96}
                  sizes="48px"
                  className="size-12 shrink-0 rounded-full border-2 border-border object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-border bg-muted font-heading text-sm font-black"
                >
                  {getInitials(person.name!)}
                </span>
              )}

              <div className="min-w-0">
                <p className="font-heading font-black">{person.name}</p>
                {roleLine && (
                  <p className="text-xs text-muted-foreground">{roleLine}</p>
                )}
                {entry.contribution && (
                  <p className="mt-1 text-sm text-body-foreground">
                    {entry.contribution}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
