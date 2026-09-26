"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  AwardIcon,
  ExternalLinkIcon,
  FileTextIcon,
  GitBranchIcon,
  GraduationCapIcon,
  LinkIcon,
  ScrollTextIcon,
} from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Container } from "@workspace/ui/components/container"
import { cn } from "@workspace/ui/lib/utils"
import type {
  EDUCATION_QUERY_RESULT,
  EXPERIENCES_QUERY_RESULT,
  FEATURED_EXPERIENCES_QUERY_RESULT,
} from "@workspace/sanity/types"

import { HighlightText } from "@/components/highlight-text"
import { OrganizationLogoMark } from "@/components/organization-logo-mark"
import { formatDateRange, formatDuration, spanOf } from "@/lib/dates"
import { useRevealGroup } from "@/hooks/use-reveal"
import { Reveal } from "@/components/reveal"
import { CARD_STAGGER_STEP_S } from "@/lib/reveal-stagger"
import { trackLinkClick } from "@/lib/analytics"

type Role = EXPERIENCES_QUERY_RESULT[number]
type Education = EDUCATION_QUERY_RESULT[number]
type FeaturedRole = FEATURED_EXPERIENCES_QUERY_RESULT[number]
type OrganizationLogo = NonNullable<Role["organization"]>["logo"]

const EMPLOYMENT_LABELS: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  internship: "Internship",
  contract: "Contract",
  freelance: "Freelance",
  volunteer: "Volunteer",
}

const WORK_MODE_LABELS: Record<string, string> = {
  "on-site": "On-site",
  remote: "Remote",
  hybrid: "Hybrid",
}

const LINK_ICONS = {
  "live-site": ExternalLinkIcon,
  repo: GitBranchIcon,
  certificate: AwardIcon,
  letter: FileTextIcon,
  patent: ScrollTextIcon,
  publication: ScrollTextIcon,
} as const

function MetaLine({ items }: { items: Array<string | null | undefined> }) {
  const shown = items.filter((item): item is string => Boolean(item))
  if (shown.length === 0) return null

  return (
    <p className="text-sm text-muted-foreground">
      {shown.map((item, index) => (
        <span key={item}>
          {index > 0 && <span aria-hidden="true"> · </span>}
          {item}
        </span>
      ))}
    </p>
  )
}

function RoleLinks({ links }: { links: Role["links"] }) {
  if (!links || links.length === 0) return null

  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {links.map((link) => {
        if (!link.url) return null
        const Icon = link.type ? LINK_ICONS[link.type] : LinkIcon

        return (
          <li key={`${link.url}-${link.label}`}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackLinkClick({
                  platform: link.type ?? "external",
                  url: link.url ?? "",
                  placement: "experience",
                })
              }
              className={cn(
                "inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-muted px-2.5 py-1",
                "text-xs font-bold",
                "shadow-sm transition-[translate,transform,box-shadow] duration-press ease-snap",
                "hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
                "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {link.label ?? "Link"}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function SkillTags({ skills }: { skills: Role["skills"] }) {
  if (!skills || skills.length === 0) return null

  return (
    <ul className="mt-4 flex flex-wrap gap-1.5">
      {skills.map((skill) => (
        <li
          key={skill._id}
          className="rounded-sm border-2 border-border bg-background px-2 py-0.5 text-xs font-semibold"
        >
          {skill.name}
        </li>
      ))}
    </ul>
  )
}

type OrganizationGroup = {
  key: string
  name: string | null
  website: string | null
  description: string | null
  logo: OrganizationLogo
  roles: Array<Role | Education>
}

/**
 * Collapses consecutive roles at the same organization into one group.
 *
 * Consecutive rather than global, so the Studio's drag order stays the source
 * of truth — moving a role away from its siblings splits the group rather than
 * silently teleporting it back. Three organizations here hold several roles
 * each, which is exactly why `organization` is its own document type.
 */
function groupByOrganization(
  roles: Array<Role | Education>
): OrganizationGroup[] {
  return roles.reduce<OrganizationGroup[]>((groups, role) => {
    const previous = groups[groups.length - 1]
    const orgId = role.organization?._id

    if (previous && orgId && previous.key === orgId) {
      previous.roles.push(role)
      return groups
    }

    groups.push({
      key: orgId ?? role._id,
      name: role.organization?.name ?? null,
      website: role.organization?.website ?? null,
      description:
        role.organization && "description" in role.organization
          ? role.organization.description
          : null,
      logo: role.organization?.logo ?? null,
      roles: [role],
    })
    return groups
  }, [])
}

/**
 * One role/education entry: a pull-quote-style heading, generous body copy,
 * and a thin left rule beside the highlight list. Rendered inside an
 * organization group, so the organization's name/logo/date marker are
 * deliberately absent here — they belong to the sticky column in
 * `OrganizationBlock`.
 */
function RoleEntry({ role }: { role: Role | Education }) {
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
 * the organization's roles stacked on the right. The `<Reveal>` wrapping
 * this (in `ExperienceGroupList` below) needs `fade` rather than the default
 * slide+fade, since it's an ancestor of the `lg:sticky` marker column — same
 * reasoning as the home page's `<Experience>` section further down this
 * file, and `[data-reveal-fade]` in `packages/ui/src/styles/globals.css`.
 */
function OrganizationBlock({ group }: { group: OrganizationGroup }) {
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

      <div className="flex flex-col gap-10">
        {group.roles.map((role) => (
          <RoleEntry key={role._id} role={role} />
        ))}
      </div>
    </div>
  )
}

/**
 * Groups `roles` by organization and reveals each group as it scrolls into
 * view, one after another.
 */
function ExperienceGroupList({ roles }: { roles: Array<Role | Education> }) {
  const groups = groupByOrganization(roles)
  const { ref, state, Provider } = useRevealGroup<HTMLDivElement>("in-view")

  if (groups.length === 0) return null

  return (
    <Provider state={state}>
      <div ref={ref} className="flex flex-col">
        {groups.map((group, index) => (
          <Reveal key={group.key} delay={index * CARD_STAGGER_STEP_S} fade>
            <OrganizationBlock group={group} />
          </Reveal>
        ))}
      </div>
    </Provider>
  )
}

interface ExperienceTimelineProps {
  experiences: EXPERIENCES_QUERY_RESULT
  education: EDUCATION_QUERY_RESULT
}

/**
 * The full timeline, with no section/heading/motion wrapper — used on /work,
 * which supplies its own `h1`. Two-column editorial layout per organization:
 * a sticky logo/date marker beside the roles.
 *
 * Education renders as its own block below the roles rather than being
 * interleaved: v1 listed the degree as a dated experience row, which
 * docs/content/persona-and-tone.md names as an anti-pattern.
 */
export function ExperienceTimeline({
  experiences,
  education,
}: ExperienceTimelineProps) {
  const roles = experiences ?? []
  const educationRoles = education ?? []

  return (
    <div className="flex flex-col gap-14">
      {roles.length > 0 && (
        // Navbar clearance for this anchor comes from `scroll-padding-top` on
        // `html` (packages/ui/src/styles/globals.css), not a local scroll margin.
        <div id="work">
          <ExperienceGroupList roles={roles} />
        </div>
      )}

      {educationRoles.length > 0 && (
        <section id="education" aria-labelledby="education-heading">
          <h2
            id="education-heading"
            className="mb-2 flex items-center gap-2.5 font-heading text-2xl font-black sm:text-3xl"
          >
            <GraduationCapIcon className="size-7" aria-hidden="true" />
            Education
          </h2>
          <ExperienceGroupList roles={educationRoles} />
        </section>
      )}
    </div>
  )
}

/**
 * Ported from v1's `components/landing/Experience.tsx` card: the date sits at
 * the top left with the organization's logo opposite it, a full-width rule
 * separates that header from the body, and the role sits above a linked
 * organization name. v1's dark inverted section background is deliberately not
 * carried over — the rest of the v2 home page holds one theme, and flipping a
 * single section reads as a different site mid-scroll.
 */
function FeaturedCard({ role }: { role: FeaturedRole }) {
  const employment = role.employmentType
    ? EMPLOYMENT_LABELS[role.employmentType]
    : null
  const website = role.organization?.website ?? null
  const name = role.organization?.name ?? null

  return (
    <article
      className={cn(
        "overflow-hidden rounded-lg border-3 border-border bg-card",
        // Pale card on the inverted panel: `.on-surface` restores the normal
        // tokens inside it, so its text, hairlines and shadow read against the
        // card's own ground rather than inheriting the inverted ones.
        "on-surface",
        "shadow-lg"
      )}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <p
          className={cn(
            "font-heading text-base font-black",
            role.isCurrent && "text-secondary"
          )}
        >
          {formatDateRange(role.startDate, role.endDate, role.isCurrent)}
        </p>
        <OrganizationLogoMark
          logo={role.organization?.logo ?? null}
          name={name}
          website={website}
          size={56}
        />
      </div>

      <hr className="border-t-2 border-border" />

      <div className="px-5 py-4">
        <h3 className="font-heading text-xl font-black">{role.role}</h3>
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
              className="font-semibold underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
            >
              {name}
            </a>
          ) : (
            <p className="font-semibold">{name}</p>
          ))}
        <MetaLine items={[employment]} />
        {role.summary && (
          <p className="mt-3 text-sm leading-relaxed text-body-foreground">
            {role.summary}
          </p>
        )}
      </div>
    </article>
  )
}

interface ExperienceProps {
  experiences: FEATURED_EXPERIENCES_QUERY_RESULT
  /**
   * Years spent building, computed from `BUILDING_SINCE` in the home page's
   * Server Component. Passed in rather than derived here so `new Date()` can't
   * drift between server and client, and so the count always tracks the same
   * constant the About copy uses. Per docs/content/persona-and-tone.md this is
   * always worded as *building*, never as years of employment.
   */
  yearsBuilding: number
}

/**
 * The condensed home page section, sitting after About.
 *
 * Two columns with a sticky heading — a layout family the home page doesn't
 * use elsewhere (Hero, Skills, Services and About are all stacked or grid), so
 * the page doesn't read as five variations of one arrangement. Carried over
 * from v1's landing Experience section, which used the same shape.
 */
const Experience = ({ experiences, yearsBuilding }: ExperienceProps) => {
  const { ref, state, Provider } = useRevealGroup<HTMLElement>("in-view")

  if (!experiences || experiences.length === 0) return null

  return (
    <Provider state={state}>
      <section
        id="experience"
        ref={ref}
        className={cn(
          "py-14 md:py-20",
          // v1 ran this section on a hard black panel. `.on-inverted` reproduces
          // it by flipping the design tokens for this subtree, so descendant
          // shadows and focus rings re-derive against the dark ground instead of
          // rendering black-on-black. See docs/ui/design-system.md.
          "on-inverted"
        )}
      >
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <Reveal delay={0.2}>
              {/* Sticky lives on this inner div, one level below the
               * `Reveal` itself, so animating the `Reveal`'s `transform`
               * doesn't touch the sticky element's own containing block. */}
              <div className="lg:sticky lg:top-28">
                <h2 className="font-heading text-2xl font-black text-balance sm:text-3xl">
                  Started from the bottom,{" "}
                  <HighlightText variant="primary">
                    now we&apos;re here
                  </HighlightText>
                </h2>
                <p className="mt-4 text-base leading-relaxed text-body-foreground md:text-lg">
                  {yearsBuilding} years of clubs, contracts, and full-time
                  work, and the experience that actually stuck.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="mt-8 w-full md:w-fit"
                  render={<Link href="/work" />}
                  nativeButton={false}
                >
                  <FileTextIcon data-icon="inline-start" />
                  See full experience
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </div>
            </Reveal>

            <div className="flex flex-col gap-5">
              {experiences.map((role, index) => (
                <Reveal
                  key={role._id}
                  delay={0.32 + index * CARD_STAGGER_STEP_S}
                >
                  <FeaturedCard role={role} />
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </Provider>
  )
}

export default Experience
