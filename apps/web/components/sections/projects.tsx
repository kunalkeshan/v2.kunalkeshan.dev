"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRightIcon, FolderKanbanIcon, StarIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Container } from "@workspace/ui/components/container"
import { cardLift, cn } from "@workspace/ui/lib/utils"
import { urlFor } from "@workspace/sanity/image"
import type {
  FEATURED_PROJECTS_QUERY_RESULT,
  PROJECTS_QUERY_RESULT,
} from "@workspace/sanity/types"

import { HighlightText } from "@/components/highlight-text"
import {
  PROJECT_KIND_LABELS,
  PROJECT_STATUS_LABELS,
  attributionLine,
} from "@/lib/projects"
import {
  sectionReveal,
  sectionRevealTransition,
  sectionRevealViewport,
} from "@/lib/motion"

/**
 * The listing query is the wider of the two, so cards are typed against it and
 * the home section's narrower rows structurally satisfy the same shape.
 */
type Project = PROJECTS_QUERY_RESULT[number]
type FeaturedProject = FEATURED_PROJECTS_QUERY_RESULT[number]
type ProjectCardData = Project | FeaturedProject

/**
 * Content-card hover: rests flat, lifts and gains the hard shadow on hover,
 * with the cover art scaling inside it (`group` + `group-hover:scale-*` below).
 * The lift lives in `cardLift`; see docs/ui/design-system.md "Content-card
 * hover".
 */
const cardShell = cn(
  "group flex h-full flex-col overflow-hidden rounded-lg border-3 border-border bg-card",
  cardLift
)

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
 * Star counts come from `fetchStars` in the page's Server Component, batched
 * into one lookup rather than fetched per card — GitHub's unauthenticated
 * budget is 60 requests/hour for the whole build. A missing entry (private
 * repo, rate limit, outage) renders nothing at all rather than a zero.
 */
function StarBadge({ stars }: { stars: number | undefined }) {
  if (stars === undefined) return null

  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground">
      <StarIcon className="size-3.5" aria-hidden="true" />
      <span className="sr-only">GitHub stars: </span>
      {stars}
    </span>
  )
}

export interface ProjectCardProps {
  project: ProjectCardData
  /** repo -> star count, from `fetchStars`. */
  stars?: Map<string, number>
  /** Renders a tighter card for the "Earlier work" section. */
  compact?: boolean
  /**
   * Text-left / image-right, the way v1's project cards and Paperfolio's are
   * built. Used on /projects, where two cards per row leaves each one wide
   * enough to carry a side-by-side split. The home strip runs 3-up, which is
   * too narrow for it, so it keeps the stacked image-on-top layout.
   */
  split?: boolean
}

export function ProjectCard({
  project,
  stars,
  compact,
  split,
}: ProjectCardProps) {
  const slug = project.slug?.current
  const coverUrl = project.coverImage?.asset
    ? urlFor(project.coverImage).width(640).height(400).fit("crop").url()
    : undefined

  const kindLabel = project.kind ? PROJECT_KIND_LABELS[project.kind] : null
  const statusLabel = project.status
    ? PROJECT_STATUS_LABELS[project.status]
    : null

  // `relatedExperience` only exists on the wider listing query.
  const employmentType =
    "relatedExperience" in project
      ? (project.relatedExperience?.employmentType ?? null)
      : null
  const attribution = attributionLine(
    employmentType,
    project.organization?.name
  )

  const starCount = project.githubRepo
    ? stars?.get(project.githubRepo)
    : undefined

  // Every project has its own page — `generateStaticParams` builds one per
  // slug whether or not a case-study body exists, since the page still shows
  // the summary, tech, links and gallery. An earlier version gated this on
  // `hasBody`, which made every card unclickable while no project had a body
  // yet. `hasBody` now only picks the CTA wording.
  const isLinked = Boolean(slug)
  const skills = project.skills?.slice(0, compact ? 3 : 4) ?? []

  // No `.height()`/`.fit("crop")`: a wordmark logo is much wider than it is
  // tall, and cropping it to a square would cut the word in half. Width-only
  // keeps the asset's own ratio, and the CSS locks the height instead.
  const iconUrl = project.icon?.asset
    ? urlFor(project.icon).width(240).url()
    : undefined

  /**
   * Cards whose project has no cover still need to occupy the same height as
   * the ones that do, or a mixed grid tears open into voids where the image
   * would have been. The fallback panel shows the project's own icon at size,
   * and failing that a monogram from its title — deliberate-looking rather
   * than obviously missing.
   */
  const initials = (project.title ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")

  return (
    <article
      className={cn(
        cardShell,
        // Split cards lay their two halves out side by side from `sm` up; the
        // stacked default keeps `flex-col` from `cardShell`.
        split && "sm:flex-row-reverse"
      )}
    >
      {/*
        Always rendered, cover or not, so every card in a mixed grid is the
        same height. See `initials` above.
      */}
      <div
        className={cn(
          "overflow-hidden bg-muted",
          split
            ? "border-b-2 border-border sm:w-2/5 sm:shrink-0 sm:self-start sm:border-b-0 sm:border-l-2"
            : "border-b-2 border-border",
          // A fixed 4:3 panel on split cards, *not* `aspect-auto`. Letting the
          // panel size itself meant a portrait-ish source dictated the whole
          // card's height — Zion Taxi rendered about twice as tall as a
          // coverless card next to it, with the text column stretched and a
          // large void under its CTA. A fixed box makes every card in the list
          // the same height whether or not it has a cover.
          split
            ? "aspect-[16/10] sm:aspect-[4/3]"
            : compact
              ? "aspect-[2/1]"
              : "aspect-[16/10]"
        )}
      >
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={project.coverImage?.alt ?? ""}
            width={640}
            height={400}
            sizes="(min-width: 1024px) 480px, (min-width: 640px) 40vw, 100vw"
            className={cn(
              "h-full w-full",
              // `contain` on split cards: at 40% of a full-width card the panel
              // rarely matches the asset's ratio, and `cover` was slicing the
              // edges off illustrations. Letterboxing onto the muted ground
              // shows the whole image instead. Stacked cards keep `cover`,
              // where the panel's fixed 16:10 does match the source.
              split ? "object-contain p-4" : "object-cover",
              "scale-100 transform-gpu will-change-transform",
              "transition-transform duration-press ease-snap group-hover:scale-110",
              "motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            )}
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center p-8",
              "scale-100 transform-gpu will-change-transform",
              "transition-transform duration-press ease-snap group-hover:scale-105",
              "motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            )}
          >
            {iconUrl ? (
              <Image
                src={iconUrl}
                alt={project.icon?.alt ?? ""}
                width={240}
                height={240}
                sizes="160px"
                className="max-h-20 w-auto max-w-40 object-contain opacity-90"
              />
            ) : (
              <span
                aria-hidden="true"
                className="font-heading text-5xl font-black text-muted-foreground/35"
              >
                {initials}
              </span>
            )}
          </div>
        )}
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col",
          compact ? "p-4" : "p-5",
          // Deliberately not `justify-center`: on a split card the height comes
          // from the image column, and centring the text left a large gap
          // between the chips and the CTA. Content packs to the top and any
          // slack falls below the whole block, where it reads as padding.
          split && "sm:w-3/5"
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          {/*
            Free-floating: no border, background or padding, and only the
            height is fixed. A boxed square cropped wordmark logos and read as
            a chip rather than a brand mark.
            Hidden when the panel above is already showing this same icon,
            so it isn't displayed twice on one card.
          */}
          {iconUrl && coverUrl && (
            <Image
              src={iconUrl}
              alt={project.icon?.alt ?? ""}
              width={240}
              height={56}
              sizes="120px"
              className="h-7 w-auto max-w-30 shrink-0 object-contain object-left"
            />
          )}
          {kindLabel && <MetaBadge tone="primary">{kindLabel}</MetaBadge>}
          {statusLabel && <MetaBadge>{statusLabel}</MetaBadge>}
          <span className="ml-auto">
            <StarBadge stars={starCount} />
          </span>
        </div>

        <h3
          className={cn(
            "mt-3 font-heading font-black",
            compact ? "text-lg" : "text-xl"
          )}
        >
          {isLinked ? (
            <Link
              href={`/projects/${slug}`}
              className={cn(
                "underline-offset-4 hover:underline",
                "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
                // Stretches the link over the whole card so the entire surface
                // is clickable, while the nested links below opt back out.
                "after:absolute after:inset-0 after:content-['']"
              )}
            >
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </h3>

        {attribution && (
          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            {attribution}
          </p>
        )}

        {project.tagline && (
          <p className="mt-2 text-sm leading-relaxed text-body-foreground">
            {project.tagline}
          </p>
        )}

        {skills.length > 0 && (
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
        )}

        {/*
          No `mt-auto` on a split card: pinning the CTA to the bottom edge is
          what opened the gap under the chips. Stacked cards keep it, so their
          CTAs line up across a row.
        */}
        <div className={cn(!split && "mt-auto")}>
          {isLinked && (
            <p className="mt-4 flex items-center gap-2 font-heading text-sm font-bold">
              {project.hasBody ? "Read case study" : `More about ${project.title}`}
              <ArrowRightIcon
                className="size-4 transition-transform duration-press ease-snap group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
                aria-hidden="true"
              />
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

interface ProjectsGridProps {
  projects: PROJECTS_QUERY_RESULT | FEATURED_PROJECTS_QUERY_RESULT
  stars?: Map<string, number>
  compact?: boolean
  /**
   * Cards per row at the widest breakpoint. The home strip runs 3-up to keep
   * the section short next to everything else on that page; /projects runs
   * 2-up so each card can carry a larger cover image.
   */
  columns?: 2 | 3
  /** Text-left / image-right cards. See `ProjectCardProps["split"]`. */
  split?: boolean
}

/**
 * The grid on its own, with no heading/section/motion wrapper — used inside
 * `Projects` below and directly on /projects, which supplies its own `h1`.
 * Mirrors the `ServicesGrid` / `ExperienceTimeline` split.
 *
 * `relative` on the item wrapper anchors each card's stretched title link.
 */
export function ProjectsGrid({
  projects,
  stars,
  compact,
  columns = 2,
  split,
}: ProjectsGridProps) {
  if (!projects || projects.length === 0) return null

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6",
        // Split cards stay one per row: each is then full page width, so the
        // 60/40 halves are both wide enough to work. Stacked cards tile.
        !split && "sm:grid-cols-2",
        // `compact` (the Earlier-work strip) always runs 3-up regardless, since
        // those cards carry less content.
        !split && (compact || columns === 3) && "lg:grid-cols-3"
      )}
    >
      {projects.map((project) => (
        <div key={project._id} className="relative">
          <ProjectCard
            project={project}
            stars={stars}
            compact={compact}
            split={split}
          />
        </div>
      ))}
    </div>
  )
}

interface ProjectsProps {
  projects: FEATURED_PROJECTS_QUERY_RESULT
  stars?: Map<string, number>
}

/**
 * The condensed home page section.
 *
 * `variant="secondary"` on the highlight because the Services heading above it
 * already uses `primary` — docs/ui/design-system.md requires alternating rather
 * than defaulting every section to the same colour.
 */
const Projects = ({ projects, stars }: ProjectsProps) => {
  if (!projects || projects.length === 0) return null

  return (
    <motion.section
      id="projects"
      initial="hidden"
      whileInView="visible"
      variants={sectionReveal}
      transition={sectionRevealTransition}
      viewport={sectionRevealViewport}
      className="py-10 md:py-16"
    >
      <Container>
        {/*
          Meme-referencing in the wording only — no hover tooltip. v1's format
          was "a quote that also reads as plain English" (Grievous on Projects,
          "Modern problems require modern solutions" on Services); this keeps
          that voice without porting `MemeTooltip`.
        */}
        <h2 className="mb-6 font-heading text-2xl font-black sm:text-3xl">
          It works on{" "}
          <HighlightText variant="secondary">my machine</HighlightText>
        </h2>

        <ProjectsGrid projects={projects} stars={stars} columns={3} />

        <Button
          size="lg"
          className="mt-8 w-full md:w-fit"
          render={<Link href="/projects" />}
          nativeButton={false}
        >
          <FolderKanbanIcon data-icon="inline-start" />
          See all projects
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </Container>
    </motion.section>
  )
}

export default Projects
