import { GraduationCapIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import type {
  EDUCATION_QUERY_RESULT,
  EXPERIENCES_QUERY_RESULT,
} from "@workspace/sanity/types"

import {
  EMPLOYMENT_LABELS,
  MetaLine,
  RoleLinks,
  SkillTags,
  WORK_MODE_LABELS,
} from "@/components/sections/experience"
import {
  groupByOrganization,
  type Education,
  type OrganizationGroup,
  type Role,
} from "@/lib/group-by-organization"
import { OrganizationLogoMark } from "@/components/organization-logo-mark"
import { formatDateRange, formatDuration, spanOf } from "@/lib/dates"
import { TrackedLink } from "@/components/shared/tracked-link"

function MetaBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-sm border-2 border-border bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
      {children}
    </span>
  )
}

/**
 * Today's `RoleEntry` (see `experience.tsx`), with density added: a bigger
 * rail dot and a "Current" chip beside the date instead of just colored
 * text. This is the "smallest structural change" preview variant — no new
 * layout, no motion added beyond what the live page already has (the live
 * `ExperienceTimeline` renders with no scroll-reveal of its own; only the
 * page hero animates).
 */
function RoleEntryDense({ role }: { role: Role | Education }) {
  const employment =
    "employmentType" in role && role.employmentType
      ? EMPLOYMENT_LABELS[role.employmentType]
      : null
  const workMode =
    "workMode" in role && role.workMode
      ? WORK_MODE_LABELS[role.workMode]
      : null

  return (
    <li
      className={cn(
        "relative pl-7",
        "before:absolute before:top-2 before:left-0 before:size-3.5 before:rounded-full before:border-2 before:border-border",
        role.isCurrent ? "before:bg-primary" : "before:bg-card"
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="font-heading text-lg font-black md:text-xl">
          {role.role}
        </h4>
        <div className="flex items-center gap-2">
          {role.isCurrent && <MetaBadge>Current</MetaBadge>}
          <p
            className={cn(
              "text-sm font-bold",
              role.isCurrent && "text-secondary"
            )}
          >
            {formatDateRange(role.startDate, role.endDate, role.isCurrent)}
          </p>
        </div>
      </div>

      <MetaLine
        items={[
          employment,
          workMode,
          role.location,
          "credential" in role ? role.credential : null,
        ]}
      />

      {role.summary && (
        <p className="mt-3 text-sm leading-relaxed text-body-foreground md:text-base">
          {role.summary}
        </p>
      )}

      {role.highlights && role.highlights.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {role.highlights.map((highlight) => (
            <li
              key={highlight}
              className="flex gap-2.5 text-sm leading-relaxed text-body-foreground"
            >
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-border"
              />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}

      <SkillTags skills={"skills" in role ? role.skills : null} />
      <RoleLinks links={role.links} />
    </li>
  )
}

function OrganizationBlockDense({ group }: { group: OrganizationGroup }) {
  const span = spanOf(group.roles)
  const tenure = formatDuration(span.startDate, span.endDate, span.isCurrent)
  const showTenure = group.roles.length > 1 && tenure

  return (
    <article className="rounded-lg border-3 border-border bg-card p-5 shadow-lg md:p-7">
      <header>
        <div className="flex items-start gap-4">
          {/* Bigger than the live page's default 64px lockup — the one
              deliberate density bump in this header. */}
          <OrganizationLogoMark
            logo={group.logo}
            name={group.name}
            website={group.website}
            size={80}
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-xl font-black sm:text-2xl">
              {group.website ? (
                <TrackedLink
                  platform="organization"
                  url={group.website}
                  placement="experience"
                >
                  <a
                    href={group.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                  >
                    {group.name}
                  </a>
                </TrackedLink>
              ) : (
                group.name
              )}
            </h3>
            <MetaLine
              items={[
                showTenure ? tenure : null,
                formatDateRange(span.startDate, span.endDate, span.isCurrent),
              ]}
            />
          </div>
        </div>

        {group.description && (
          <p className="mt-3 text-sm leading-relaxed text-body-foreground">
            {group.description}
          </p>
        )}
      </header>

      <ul
        className={cn(
          "mt-6 flex flex-col gap-7",
          group.roles.length > 1 &&
            "relative before:absolute before:top-2 before:bottom-2 before:left-[6px] before:w-0.5 before:bg-border/40"
        )}
      >
        {group.roles.map((role) => (
          <RoleEntryDense key={role._id} role={role} />
        ))}
      </ul>
    </article>
  )
}

interface ExperienceDenseProps {
  experiences: EXPERIENCES_QUERY_RESULT
  education: EDUCATION_QUERY_RESULT
}

export function ExperienceDense({ experiences, education }: ExperienceDenseProps) {
  const groups = groupByOrganization(experiences ?? [])
  const educationGroups = groupByOrganization(education ?? [])

  return (
    <div className="flex flex-col gap-12">
      {groups.length > 0 && (
        <div id="work" className="flex flex-col gap-6">
          {groups.map((group) => (
            <OrganizationBlockDense key={group.key} group={group} />
          ))}
        </div>
      )}

      {educationGroups.length > 0 && (
        <section id="education" aria-labelledby="education-heading">
          <h2
            id="education-heading"
            className="mb-6 flex items-center gap-2.5 font-heading text-2xl font-black sm:text-3xl"
          >
            <GraduationCapIcon className="size-7" aria-hidden="true" />
            Education
          </h2>
          <div className="flex flex-col gap-6">
            {educationGroups.map((group) => (
              <OrganizationBlockDense key={group.key} group={group} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
