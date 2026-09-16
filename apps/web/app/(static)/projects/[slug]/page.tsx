import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PortableText } from "@portabletext/react"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
  FileTextIcon,
  GitBranchIcon,
  LinkIcon,
  PlayIcon,
  ScrollTextIcon,
  StarIcon,
} from "lucide-react"

import { Container } from "@workspace/ui/components/container"
import { cn } from "@workspace/ui/lib/utils"
import { sanityFetch } from "@workspace/sanity/fetch"
import {
  createCollectionTag,
  createDocumentTag,
} from "@workspace/sanity/cache-tags"
import { urlFor } from "@workspace/sanity/image"
import {
  PROJECT_BY_SLUG_QUERY,
  PROJECT_SLUGS_QUERY,
} from "@workspace/sanity/query"
import type {
  PROJECT_BY_SLUG_QUERY_RESULT,
  PROJECT_SLUGS_QUERY_RESULT,
} from "@workspace/sanity/types"

import { portableTextComponents } from "@/components/sanity/portable-text-components"
import { ProjectGallery } from "@/components/sections/project-gallery"
import { formatDateRange } from "@/lib/dates"
import { fetchStars } from "@/lib/github"
import {
  PROJECT_KIND_LABELS,
  PROJECT_STATUS_LABELS,
  attributionLine,
} from "@/lib/projects"

const LINK_ICONS = {
  "live-site": ExternalLinkIcon,
  repo: GitBranchIcon,
  "case-study": FileTextIcon,
  video: PlayIcon,
  paper: ScrollTextIcon,
} as const

async function getProject(slug: string) {
  return sanityFetch<PROJECT_BY_SLUG_QUERY_RESULT>({
    query: PROJECT_BY_SLUG_QUERY,
    params: { slug },
    tags: [createCollectionTag("project"), createDocumentTag("project", slug)],
  })
}

async function getSlugs() {
  return sanityFetch<PROJECT_SLUGS_QUERY_RESULT>({
    query: PROJECT_SLUGS_QUERY,
    tags: [createCollectionTag("project")],
  })
}

export async function generateStaticParams() {
  const projects = await getSlugs()

  return (projects ?? [])
    .map((project) => project.slug?.current)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) return {}

  const image = project.coverImage?.asset
    ? urlFor(project.coverImage).width(1200).height(630).fit("crop").url()
    : undefined

  const title = project.title ?? "Project"
  const description = project.summary ?? project.tagline ?? undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      // v1 shipped `summary`, which crops the cover to a small square thumbnail.
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

function InfoRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1 border-b-2 border-border/25 py-3 last:border-b-0">
      <dt className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-sm font-semibold">{children}</dd>
    </div>
  )
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [project, allProjects] = await Promise.all([
    getProject(slug),
    getSlugs(),
  ])

  // v1 redirected an unknown slug back to /projects, which hides broken links
  // and returns 200 for a URL that doesn't exist.
  if (!project) notFound()

  const stars = await fetchStars(project.githubRepo ? [project.githubRepo] : [])
  const starCount = project.githubRepo
    ? stars.get(project.githubRepo)
    : undefined

  const coverUrl = project.coverImage?.asset
    ? urlFor(project.coverImage).width(1600).url()
    : undefined

  const kindLabel = project.kind ? PROJECT_KIND_LABELS[project.kind] : null
  const statusLabel = project.status
    ? PROJECT_STATUS_LABELS[project.status]
    : null

  const attribution = attributionLine(
    project.relatedExperience?.employmentType,
    project.organization?.name ??
      project.relatedExperience?.organization?.name
  )

  const dateRange = formatDateRange(
    project.startDate,
    project.completedAt,
    // No completion date on an in-development project reads as ongoing.
    project.completedAt ? false : project.status === "in-development"
  )

  // Neighbours follow the Studio's drag order, matching the listing page.
  const ordered = (allProjects ?? []).filter((entry) => entry.slug?.current)
  const currentIndex = ordered.findIndex(
    (entry) => entry.slug?.current === slug
  )
  const previous = currentIndex > 0 ? ordered[currentIndex - 1] : null
  const next =
    currentIndex >= 0 && currentIndex < ordered.length - 1
      ? ordered[currentIndex + 1]
      : null

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <Container>
        <Link
          href="/projects"
          className={cn(
            "inline-flex items-center gap-2 text-sm font-bold text-muted-foreground",
            "hover:text-foreground",
            "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
          )}
        >
          <ArrowLeftIcon className="size-4" aria-hidden="true" />
          All projects
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {kindLabel && (
            <span className="rounded-sm border-2 border-border bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
              {kindLabel}
            </span>
          )}
          {statusLabel && (
            <span className="rounded-sm border-2 border-border bg-muted px-2 py-0.5 text-xs font-bold">
              {statusLabel}
            </span>
          )}
          {starCount !== undefined && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground">
              <StarIcon className="size-3.5" aria-hidden="true" />
              <span className="sr-only">GitHub stars: </span>
              {starCount}
            </span>
          )}
        </div>

        <h1 className="mt-3 font-heading text-4xl leading-tight font-black sm:text-5xl">
          {project.title}
        </h1>

        {project.tagline && (
          <p className="mt-4 max-w-2xl leading-relaxed text-body-foreground md:text-lg">
            {project.tagline}
          </p>
        )}

        {coverUrl && (
          // A bordered image wrapper — the one place the resting-`shadow-xl`
          // -> `hover:shadow-2xl` pairing belongs. See docs/ui/design-system.md.
          <div
            className={cn(
              "mt-8 overflow-hidden rounded-lg border-3 border-border bg-muted",
              "shadow-xl transition-shadow duration-press ease-snap hover:shadow-2xl"
            )}
          >
            <Image
              src={coverUrl}
              alt={project.coverImage?.alt ?? ""}
              width={1600}
              height={900}
              priority
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        <div className="mt-12 flex flex-col-reverse gap-10 lg:flex-row lg:gap-16">
          <div className="min-w-0 flex-1">
            <section aria-labelledby="overview-heading">
              <h2
                id="overview-heading"
                className="font-heading text-2xl font-black sm:text-3xl"
              >
                Overview
              </h2>
              {project.summary && (
                <p className="mt-4 leading-relaxed text-body-foreground md:text-lg">
                  {project.summary}
                </p>
              )}
            </section>

            {project.body && (
              <div className="mt-10">
                <PortableText
                  value={project.body}
                  components={portableTextComponents}
                />
              </div>
            )}

            <ProjectGallery gallery={project.gallery} title={project.title} />
          </div>

          {/*
            `lg:h-fit` matters: as a flex child this would otherwise stretch to
            the full row height, leaving the sticky panel inside it no room to
            travel — sticky silently does nothing. Carried over from v1, which
            had the same `lg:h-fit` on its Information panel. Sticky is gated
            behind `lg:` throughout, so on mobile the panel is static and (via
            `flex-col-reverse`) sits above the prose.
          */}
          <aside className="lg:h-fit lg:w-80 lg:shrink-0">
            <div
              className={cn(
                "rounded-lg border-3 border-border bg-card p-5 shadow-lg",
                "lg:sticky lg:top-32"
              )}
            >
              <h2 className="font-heading text-lg font-black">Information</h2>

              <dl className="mt-3">
                {dateRange && <InfoRow label="Timeline">{dateRange}</InfoRow>}

                {attribution && <InfoRow label="Built">{attribution}</InfoRow>}

                {project.relatedExperience?.role && (
                  <InfoRow label="Role">
                    <Link
                      href="/experience"
                      className="underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                    >
                      {project.relatedExperience.role}
                    </Link>
                  </InfoRow>
                )}

                {project.skills && project.skills.length > 0 && (
                  <InfoRow label="Built with">
                    <ul className="flex flex-wrap gap-1.5">
                      {project.skills.map((skill) => (
                        <li key={skill._id}>
                          <Link
                            href="/skills"
                            className={cn(
                              "inline-block rounded-sm border-2 border-border bg-background px-2 py-0.5 text-xs font-semibold",
                              "hover:bg-muted",
                              "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                            )}
                          >
                            {skill.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </InfoRow>
                )}
              </dl>

              {project.links && project.links.length > 0 && (
                <ul className="mt-5 flex flex-col gap-2">
                  {project.links.map((link) => {
                    if (!link.url) return null
                    const Icon = link.type ? LINK_ICONS[link.type] : LinkIcon

                    return (
                      <li key={`${link.url}-${link.label}`}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "flex items-center justify-center gap-2 rounded-lg border-2 border-border bg-primary px-4 py-2.5",
                            "font-heading text-sm font-bold text-primary-foreground",
                            "shadow-sm transition-[transform,box-shadow] duration-press ease-snap",
                            "hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
                            "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                          )}
                        >
                          <Icon className="size-4" aria-hidden="true" />
                          {link.label ?? "Visit"}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </aside>
        </div>

        {(previous || next) && (
          <nav
            aria-label="More projects"
            className="mt-16 border-t-2 border-border pt-8"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {previous?.slug?.current && (
                <Link
                  href={`/projects/${previous.slug.current}`}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg border-3 border-border bg-card p-4",
                    "translate-y-0 transform-gpu will-change-transform",
                    "transition-[transform,box-shadow] duration-press ease-snap",
                    "hover:-translate-y-2 hover:shadow-xl",
                    "motion-reduce:transition-[box-shadow] motion-reduce:hover:translate-y-0",
                    "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                  )}
                >
                  <ArrowLeftIcon className="size-4 shrink-0" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-xs font-bold text-muted-foreground">
                      Previous
                    </span>
                    <span className="block truncate font-heading font-black">
                      {previous.title}
                    </span>
                  </span>
                </Link>
              )}

              {next?.slug?.current && (
                <Link
                  href={`/projects/${next.slug.current}`}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg border-3 border-border bg-card p-4 md:ml-auto md:flex-row-reverse md:text-right",
                    "translate-y-0 transform-gpu will-change-transform",
                    "transition-[transform,box-shadow] duration-press ease-snap",
                    "hover:-translate-y-2 hover:shadow-xl",
                    "motion-reduce:transition-[box-shadow] motion-reduce:hover:translate-y-0",
                    "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                  )}
                >
                  <ArrowRightIcon
                    className="size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block text-xs font-bold text-muted-foreground">
                      Next
                    </span>
                    <span className="block truncate font-heading font-black">
                      {next.title}
                    </span>
                  </span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </Container>
    </main>
  )
}
