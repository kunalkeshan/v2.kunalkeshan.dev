import { ExternalLinkIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import type {
  ARCHIVED_CERTIFICATIONS_QUERY_RESULT,
  CERTIFICATIONS_QUERY_RESULT,
} from "@workspace/sanity/types"

import { OrganizationLogoMark } from "@/components/organization-logo-mark"
import { formatMonthYear } from "@/lib/dates"

type Certification =
  | CERTIFICATIONS_QUERY_RESULT[number]
  | ARCHIVED_CERTIFICATIONS_QUERY_RESULT[number]

/**
 * One certification. Issuer logo leads — the priority the user asked for,
 * inverting v1's cert-image-first cards — with the credential itself
 * demoted to a "View credential" link rather than a thumbnail, since the
 * schema has no certificate-image field at all.
 */
function CertificationCard({
  certification,
  muted = false,
}: {
  certification: Certification
  muted?: boolean
}) {
  const issued = formatMonthYear(certification.issuedAt)
  const organizationName = certification.organization?.name ?? null

  return (
    <li
      className={cn(
        "flex flex-col gap-4 rounded-lg border-3 border-border bg-card p-5 md:p-6",
        muted ? "shadow-sm" : "shadow-lg"
      )}
    >
      <div className="flex items-start gap-4">
        <OrganizationLogoMark
          logo={certification.organization?.logo ?? null}
          name={organizationName}
          website={certification.organization?.website ?? null}
          size={56}
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-lg leading-tight font-black text-balance">
            {certification.title}
          </h3>
          {(organizationName || issued) && (
            <p className="mt-1 text-sm text-muted-foreground">
              {organizationName}
              {organizationName && issued && (
                <span aria-hidden="true"> · </span>
              )}
              {issued}
            </p>
          )}
        </div>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-3">
        {certification.verifyUrl && (
          <a
            href={certification.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-muted px-2.5 py-1",
              "text-xs font-bold",
              "shadow-sm transition-[translate,transform,box-shadow] duration-press ease-snap",
              "hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
              "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
            )}
          >
            <ExternalLinkIcon className="size-3.5" aria-hidden="true" />
            View credential
          </a>
        )}
        {certification.credentialId && (
          <p className="font-mono text-xs text-muted-foreground">
            ID: {certification.credentialId}
          </p>
        )}
      </div>
    </li>
  )
}

interface CertificationsGridProps {
  certifications: CERTIFICATIONS_QUERY_RESULT
}

/**
 * The active certifications grid, with no heading/section wrapper — the
 * page itself supplies the `<h1>` and intro, same split as `ServicesGrid`.
 */
export function CertificationsGrid({
  certifications,
}: CertificationsGridProps) {
  if (!certifications || certifications.length === 0) return null

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {certifications.map((certification) => (
        <CertificationCard
          key={certification._id}
          certification={certification}
        />
      ))}
    </ul>
  )
}

interface ArchivedCertificationsProps {
  certifications: ARCHIVED_CERTIFICATIONS_QUERY_RESULT
}

/**
 * Certifications no longer listed on LinkedIn but still worth keeping a
 * record of. Its own section rather than a per-card tag — the user's call,
 * mirroring how Education gets its own block on /experience instead of an
 * inline marker on each entry.
 */
export function ArchivedCertifications({
  certifications,
}: ArchivedCertificationsProps) {
  if (!certifications || certifications.length === 0) return null

  return (
    <section
      id="archived"
      aria-labelledby="archived-certifications-heading"
      className="opacity-90"
    >
      <h2
        id="archived-certifications-heading"
        className="mb-2 font-heading text-2xl font-black sm:text-3xl"
      >
        Archived
      </h2>
      <p className="mb-6 max-w-prose text-sm text-muted-foreground">
        No longer listed on LinkedIn, but still earned — kept here for the
        record.
      </p>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((certification) => (
          <CertificationCard
            key={certification._id}
            certification={certification}
            muted
          />
        ))}
      </ul>
    </section>
  )
}
