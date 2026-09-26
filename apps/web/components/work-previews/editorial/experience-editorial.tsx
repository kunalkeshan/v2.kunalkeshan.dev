"use client"

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
  groupByOrganization,
  type Education,
  type OrganizationGroup,
  type Role,
} from "@/components/sections/experience"
import { OrganizationLogoMark } from "@/components/organization-logo-mark"
import { formatDateRange, formatDuration, spanOf } from "@/lib/dates"
import { useRevealGroup } from "@/hooks/use-reveal"
import { Reveal } from "@/components/reveal"
import { CARD_STAGGER_STEP_S } from "@/lib/reveal-stagger"
import { trackLinkClick } from "@/lib/analytics"

/**
 * One role/education entry, editorial-styled: a large pull-quote-style
 * heading, generous body copy, and a thin left rule in place of the rail's
 * bulleted highlight list — deliberately lighter than the "cards"/"blocks"
 * variants' heavy borders.
 */
function EditorialRole({ role }: { role: Role | Education }) {
  const employment =
    "employmentType" in role && role.employmentType
      ? EMPLOYMENT_LABELS[role.employmentType]
      : null
  const workMode =
    "workMode" in role && role.workMode
      ? WORK_MODE_LABELS[role.workMode]
      : null

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h4 className="font-heading text-2xl font-black text-balance sm:text-3xl">
          {role.role}
        </h4>
        {role.isCurrent && (
          <span className="font-heading text-sm font-bold text-secondary">
            Current
          </span>
        )}
      </div>

      <p className="mt-1 text-sm font-bold text-muted-foreground">
        {formatDateRange(role.startDate, role.endDate, role.isCurrent)}
      </p>

      <MetaLine
        items={[
          employment,
          workMode,
          role.location,
          "credential" in role ? role.credential : null,
        ]}
      />

      {role.summary && (
        <p className="mt-4 text-lg leading-relaxed text-body-foreground">
          {role.summary}
        </p>
      )}

      {role.highlights && role.highlights.length > 0 && (
        <ul className="mt-4 flex flex-col gap-3 border-l-2 border-border pl-4">
          {role.highlights.map((highlight) => (
            <li
              key={highlight}
              className="text-base leading-relaxed text-body-foreground"
            >
              {highlight}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        <SkillTags skills={"skills" in role ? role.skills : null} />
        <RoleLinks links={role.links} />
      </div>
    </div>
  )
}

/**
 * Two-column per-organization row: a sticky logo/date marker on the left,
 * the organization's roles stacked on the right. Same sticky-column pattern
 * as the home page's `<Experience>` section (`components/sections/experience.tsx`
 * default export) — see that file's comment on why the `<Reveal>` wrapping a
 * sticky descendant needs `fade` rather than the default slide+fade.
 */
function OrganizationEditorialRow({ group }: { group: OrganizationGroup }) {
  const span = spanOf(group.roles)
  const tenure = formatDuration(span.startDate, span.endDate, span.isCurrent)

  return (
    <div className="grid grid-cols-1 gap-8 border-b-2 border-border py-10 first:pt-0 last:border-b-0 lg:grid-cols-[minmax(0,260px)_1fr] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <OrganizationLogoMark
          logo={group.logo}
          name={group.name}
          website={group.website}
          size={64}
        />
        <h3 className="mt-4 font-heading text-2xl font-black">
          {group.website ? (
            <a
              href={group.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackLinkClick({
                  platform: "organization",
                  url: group.website ?? "",
                  placement: "experience",
                })
              }
              className="underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
            >
              {group.name}
            </a>
          ) : (
            group.name
          )}
        </h3>
        <p className="mt-1 text-sm font-bold text-muted-foreground">
          {formatDateRange(span.startDate, span.endDate, span.isCurrent)}
        </p>
        {group.roles.length > 1 && tenure && (
          <p className="text-sm text-muted-foreground">{tenure}</p>
        )}
        {group.description && (
          <p className="mt-3 text-sm leading-relaxed text-body-foreground">
            {group.description}
          </p>
        )}
      </div>

      <div className={cn("flex flex-col gap-10")}>
        {group.roles.map((role) => (
          <EditorialRole key={role._id} role={role} />
        ))}
      </div>
    </div>
  )
}

function ExperienceEditorialList({ roles }: { roles: Array<Role | Education> }) {
  const groups = groupByOrganization(roles)
  const { ref, state, Provider } = useRevealGroup<HTMLDivElement>("in-view")

  if (groups.length === 0) return null

  return (
    <Provider state={state}>
      <div ref={ref} className="flex flex-col">
        {groups.map((group, index) => (
          <Reveal key={group.key} delay={index * CARD_STAGGER_STEP_S} fade>
            <OrganizationEditorialRow group={group} />
          </Reveal>
        ))}
      </div>
    </Provider>
  )
}

interface ExperienceEditorialProps {
  experiences: EXPERIENCES_QUERY_RESULT
  education: EDUCATION_QUERY_RESULT
}

export function ExperienceEditorial({
  experiences,
  education,
}: ExperienceEditorialProps) {
  return (
    <div className="flex flex-col gap-14">
      {experiences.length > 0 && (
        <div id="work">
          <ExperienceEditorialList roles={experiences} />
        </div>
      )}

      {education.length > 0 && (
        <section id="education" aria-labelledby="education-heading">
          <h2
            id="education-heading"
            className="mb-2 flex items-center gap-2.5 font-heading text-2xl font-black sm:text-3xl"
          >
            <GraduationCapIcon className="size-7" aria-hidden="true" />
            Education
          </h2>
          <ExperienceEditorialList roles={education} />
        </section>
      )}
    </div>
  )
}
