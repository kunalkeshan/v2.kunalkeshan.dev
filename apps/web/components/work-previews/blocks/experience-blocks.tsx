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

function MetaBadge({
  children,
  tone = "muted",
}: {
  children: React.ReactNode
  tone?: "muted" | "primary"
}) {
  return (
    <span
      className={cn(
        "rounded-sm border-2 border-border px-2.5 py-1 text-xs font-bold",
        tone === "primary"
          ? "bg-primary text-primary-foreground"
          : "bg-background text-foreground"
      )}
    >
      {children}
    </span>
  )
}

function RoleContent({ role }: { role: Role | Education }) {
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
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="font-heading text-xl font-black">{role.role}</h4>
        <p
          className={cn(
            "text-sm font-bold",
            role.isCurrent && "text-secondary"
          )}
        >
          {formatDateRange(role.startDate, role.endDate, role.isCurrent)}
        </p>
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
        <p className="mt-3 text-base leading-relaxed text-body-foreground">
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
    </div>
  )
}

/**
 * Today's `OrganizationBlock` (see `experience.tsx`) pushed further: a bigger
 * header banner with a larger logo and a tenure badge, and blocks alternate
 * `bg-card`/`bg-muted` so consecutive employers read as visually distinct
 * sections rather than one continuous column.
 */
function OrganizationBlockHeavy({
  group,
  toneIndex,
}: {
  group: OrganizationGroup
  toneIndex: number
}) {
  const span = spanOf(group.roles)
  const tenure = formatDuration(span.startDate, span.endDate, span.isCurrent)
  const showTenure = group.roles.length > 1 && tenure
  const alt = toneIndex % 2 === 1

  return (
    <article
      className={cn(
        "overflow-hidden rounded-lg border-3 border-border shadow-xl",
        alt ? "bg-muted" : "bg-card"
      )}
    >
      <header
        className={cn(
          "flex items-start gap-4 border-b-3 border-border p-6 md:p-8",
          alt ? "bg-card" : "bg-muted"
        )}
      >
        <OrganizationLogoMark
          logo={group.logo}
          name={group.name}
          website={group.website}
          size={72}
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-2xl font-black sm:text-3xl">
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
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {showTenure && <MetaBadge tone="primary">{tenure}</MetaBadge>}
            <span className="text-sm font-bold text-muted-foreground">
              {formatDateRange(span.startDate, span.endDate, span.isCurrent)}
            </span>
          </div>
          {group.description && (
            <p className="mt-3 text-sm leading-relaxed text-body-foreground">
              {group.description}
            </p>
          )}
        </div>
      </header>

      <ul className="flex flex-col divide-y-2 divide-border">
        {group.roles.map((role) => (
          <li key={role._id} className="p-6 md:p-8">
            <RoleContent role={role} />
          </li>
        ))}
      </ul>
    </article>
  )
}

function ExperienceBlocksList({ roles }: { roles: Array<Role | Education> }) {
  const groups = groupByOrganization(roles)
  const { ref, state, Provider } = useRevealGroup<HTMLDivElement>("in-view")

  if (groups.length === 0) return null

  return (
    <Provider state={state}>
      <div ref={ref} className="flex flex-col gap-8">
        {groups.map((group, index) => (
          <Reveal key={group.key} delay={index * CARD_STAGGER_STEP_S}>
            <OrganizationBlockHeavy group={group} toneIndex={index} />
          </Reveal>
        ))}
      </div>
    </Provider>
  )
}

interface ExperienceBlocksProps {
  experiences: EXPERIENCES_QUERY_RESULT
  education: EDUCATION_QUERY_RESULT
}

export function ExperienceBlocks({ experiences, education }: ExperienceBlocksProps) {
  return (
    <div className="flex flex-col gap-14">
      {experiences.length > 0 && (
        <div id="work">
          <ExperienceBlocksList roles={experiences} />
        </div>
      )}

      {education.length > 0 && (
        <section id="education" aria-labelledby="education-heading">
          <h2
            id="education-heading"
            className="mb-6 flex items-center gap-2.5 font-heading text-2xl font-black sm:text-3xl"
          >
            <GraduationCapIcon className="size-7" aria-hidden="true" />
            Education
          </h2>
          <ExperienceBlocksList roles={education} />
        </section>
      )}
    </div>
  )
}
