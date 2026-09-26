"use client"

import { GraduationCapIcon } from "lucide-react"

import { cardLift, cardLiftActive, cn } from "@workspace/ui/lib/utils"
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
  type Education,
  type Role,
} from "@/components/sections/experience"
import { OrganizationLogoMark } from "@/components/organization-logo-mark"
import { formatDateRange } from "@/lib/dates"
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
        "rounded-sm border-2 border-border px-2 py-0.5 text-xs font-bold",
        tone === "primary"
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-foreground"
      )}
    >
      {children}
    </span>
  )
}

/**
 * One role or education entry as its own bordered card — the "cards" preview
 * variant flattens the organization grouping the live page uses (see
 * `experience.tsx`'s `OrganizationBlock`) so every entry stands on its own,
 * carrying its org's logo/name inline instead.
 */
function RoleCard({ role }: { role: Role | Education }) {
  const employment =
    "employmentType" in role && role.employmentType
      ? EMPLOYMENT_LABELS[role.employmentType]
      : null
  const workMode =
    "workMode" in role && role.workMode
      ? WORK_MODE_LABELS[role.workMode]
      : null
  const isCommunity = "kind" in role && role.kind === "community"
  const website = role.organization?.website ?? null
  const name = role.organization?.name ?? null

  return (
    <article
      className={cn(
        "flex h-full flex-col gap-4 rounded-lg border-3 border-border bg-card p-5 md:p-6",
        role.isCurrent ? cardLiftActive : cardLift
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <OrganizationLogoMark logo={role.organization?.logo ?? null} name={name} website={website} size={40} />
          <div>
            <h3 className="font-heading text-lg font-black">{role.role}</h3>
            {name &&
              (website ? (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackLinkClick({
                      platform: "organization",
                      url: website,
                      placement: "experience",
                    })
                  }
                  className="text-sm font-semibold underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                >
                  {name}
                </a>
              ) : (
                <p className="text-sm font-semibold">{name}</p>
              ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {role.isCurrent && <MetaBadge tone="primary">Current</MetaBadge>}
          {isCommunity && <MetaBadge>Community</MetaBadge>}
        </div>
      </div>

      <p
        className={cn(
          "font-heading text-sm font-bold",
          role.isCurrent && "text-secondary"
        )}
      >
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
        <p className="text-sm leading-relaxed text-body-foreground">
          {role.summary}
        </p>
      )}

      {role.highlights && role.highlights.length > 0 && (
        <ul className="flex flex-col gap-2">
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

      <div className="mt-auto flex flex-col gap-1">
        <SkillTags skills={"skills" in role ? role.skills : null} />
        <RoleLinks links={role.links} />
      </div>
    </article>
  )
}

function RoleCardsGrid({ roles }: { roles: Array<Role | Education> }) {
  const { ref, state, Provider } = useRevealGroup<HTMLDivElement>("in-view")

  if (roles.length === 0) return null

  return (
    <Provider state={state}>
      <div ref={ref} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {roles.map((role, index) => (
          <Reveal key={role._id} delay={index * CARD_STAGGER_STEP_S}>
            <RoleCard role={role} />
          </Reveal>
        ))}
      </div>
    </Provider>
  )
}

interface ExperienceCardsProps {
  experiences: EXPERIENCES_QUERY_RESULT
  education: EDUCATION_QUERY_RESULT
}

export function ExperienceCards({ experiences, education }: ExperienceCardsProps) {
  return (
    <div className="flex flex-col gap-12">
      {experiences.length > 0 && (
        <div id="work" className="flex flex-col gap-6">
          <RoleCardsGrid roles={experiences} />
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
          <RoleCardsGrid roles={education} />
        </section>
      )}
    </div>
  )
}
