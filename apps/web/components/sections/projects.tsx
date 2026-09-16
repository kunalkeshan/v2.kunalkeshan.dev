"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRightIcon, FolderKanbanIcon, StarIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Container } from "@workspace/ui/components/container"
import { cn } from "@workspace/ui/lib/utils"
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
 * with the cover art scaling inside it. See docs/ui/design-system.md
 * "Content-card hover" — deliberately NOT the resting-`shadow-xl` pairing,
 * which is scoped to bordered image wrappers.
 */
const cardShell = cn(
  "group flex h-full flex-col overflow-hidden rounded-lg border-3 border-border bg-card",
  // Explicit resting transform + GPU promotion — see the note in services.tsx:
  // without a declared start value the unhover transition has nothing to
  // interpolate back to, which reads as jank on the way out.
  "translate-y-0 transform-gpu will-change-transform",
  "transition-[transform,box-shadow] duration-press ease-snap",
  "hover:-translate-y-2 hover:shadow-xl",
  "motion-reduce:transition-[box-shadow] motion-reduce:hover:translate-y-0"
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
}

export function ProjectCard({ project, stars, compact }: ProjectCardProps) {
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

  const iconUrl = project.icon?.asset
    ? urlFor(project.icon).width(96).height(96).fit("crop").url()
    : undefined

  return (
    <article className={cardShell}>
      {coverUrl && (
        <div
          className={cn(
            "overflow-hidden border-b-2 border-border bg-muted",
            compact ? "aspect-[2/1]" : "aspect-[16/10]"
          )}
        >
          <Image
            src={coverUrl}
            alt={project.coverImage?.alt ?? ""}
            width={640}
            height={400}
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className={cn(
              "h-full w-full object-cover",
              "scale-100 transform-gpu will-change-transform",
              "transition-transform duration-press ease-snap group-hover:scale-110",
              "motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            )}
          />
        </div>
      )}

      <div className={cn("flex flex-1 flex-col", compact ? "p-4" : "p-5")}>
        <div className="flex flex-wrap items-center gap-2">
          {iconUrl && (
            // v1 showed the product's own mark beside the category pill.
            <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-sm border-2 border-border bg-background">
              <Image
                src={iconUrl}
                alt={project.icon?.alt ?? ""}
                width={72}
                height={72}
                sizes="36px"
                className="h-full w-full object-cover"
              />
            </span>
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

        <div className="mt-auto">
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
}: ProjectsGridProps) {
  if (!projects || projects.length === 0) return null

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2",
        // `compact` (the Earlier-work strip) always runs 3-up regardless, since
        // those cards carry less content.
        (compact || columns === 3) && "lg:grid-cols-3"
      )}
    >
      {projects.map((project) => (
        <div key={project._id} className="relative">
          <ProjectCard project={project} stars={stars} compact={compact} />
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
      className="scroll-mt-28 py-10 md:py-16"
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
