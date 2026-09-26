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
import { SiAppstore, SiGoogleplay } from "react-icons/si"

import { Container } from "@workspace/ui/components/container"
import { cardLift, cn } from "@workspace/ui/lib/utils"
import { sanityFetch } from "@workspace/sanity/live"
import {
  createCollectionTag,
  createDocumentTag,
} from "@workspace/sanity/cache-tags"
import { urlFor } from "@workspace/sanity/image"
import {
  PROJECT_BY_SLUG_QUERY,
  PROJECT_SLUGS_QUERY,
} from "@workspace/sanity/query"

import { portableTextComponents } from "@/components/sanity/portable-text-components"
import { PageHero } from "@/components/page-hero"
import { ProjectCollaborators } from "@/components/sections/project-collaborators"
import { ProjectGallery } from "@/components/sections/project-gallery"
import { RelatedProjects } from "@/components/sections/related-projects"
import { JsonLd } from "@/components/shared/json-ld"
import { TrackedLink } from "@/components/shared/tracked-link"
import { formatDateRange } from "@/lib/dates"
import { fetchStars } from "@/lib/github"
import {
  PROJECT_KIND_LABELS,
  PROJECT_STATUS_LABELS,
  attributionLine,
} from "@/lib/projects"
import { buildBreadcrumbListJsonLd, buildCreativeWorkJsonLd } from "@/lib/structured-data"
import {
  cleanSanityData,
  getDynamicSanityFetchOptions,
  type SanityFetchOptions,
} from "@/lib/sanity-fetch-options"

/**
 * `react-icons/si` for the two app stores: lucide deliberately ships no brand
 * marks, and a generic phone glyph doesn't read as "Google Play" the way the
 * real logo does. Everything else stays on lucide.
 */
const LINK_ICONS = {
  "live-site": ExternalLinkIcon,
  repo: GitBranchIcon,
  "play-store": SiGoogleplay,
  "app-store": SiAppstore,
  "case-study": FileTextIcon,
  video: PlayIcon,
  paper: ScrollTextIcon,
} as const

async function getProject(slug: string, options: SanityFetchOptions) {
  const { data } = await sanityFetch({
    query: PROJECT_BY_SLUG_QUERY,
    params: { slug },
    tags: [createCollectionTag("project"), createDocumentTag("project", slug)],
    ...options,
  })
  return cleanSanityData(data)
}

async function getSlugs(options: SanityFetchOptions) {
  const { data } = await sanityFetch({
    query: PROJECT_SLUGS_QUERY,
    tags: [createCollectionTag("project")],
    ...options,
  })
  return cleanSanityData(data)
}

export async function generateStaticParams() {
  // Build time — draftMode() can't be called here, so always published.
  const projects = await getSlugs({ perspective: "published", stega: false })

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
  // Never let stega leak into <title>/<meta>/OG tags — always published, clean.
  const project = await getProject(slug, { perspective: "published", stega: false })

  if (!project) return {}

  const title = project.seo?.metaTitle || project.title || "Project"
  const description = project.summary ?? project.tagline ?? undefined

  // No `images` key here at all (not even set to `undefined`) — that lets
  // Next merge in this segment's file-convention opengraph-image.tsx, which
  // always generates the branded card (see that file: project has no manual
  // ogImage override field the way blog/journal do, so this route has no
  // other way to get an image).
  return {
    title,
    description,
    alternates: { canonical: `/projects/${slug}` },
    ...(project.seo?.noindex && { robots: { index: false, follow: true } }),
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      // v1 shipped `summary`, which crops the cover to a small square thumbnail.
      card: "summary_large_image",
      title,
      description,
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
  const dynamicOptions = await getDynamicSanityFetchOptions()
  const [project, allProjects] = await Promise.all([
    getProject(slug, dynamicOptions),
    getSlugs(dynamicOptions),
  ])

  // v1 redirected an unknown slug back to /projects, which hides broken links
  // and returns 200 for a URL that doesn't exist.
  if (!project) notFound()

  const stars = await fetchStars(project.githubRepo ? [project.githubRepo] : [])
  const starCount = project.githubRepo
    ? stars.get(project.githubRepo)
    : undefined

  // Width-only, no server-side crop: the panel below is a fixed 21:9 box that
  // caps the height (uncapped, a tall illustration filled the whole viewport
  // before any content was reachable), but the image is contained inside it
  // rather than cropped to fill, so nothing is ever cut off.
  const coverUrl = project.coverImage?.asset
    ? urlFor(project.coverImage).width(1680).url()
    : undefined

  const iconUrl = project.icon?.asset
    ? urlFor(project.icon).width(240).url()
    : undefined

  // The first usable link leads as the primary action; everything after it
  // renders as a compact chip, so the panel scales to any number of links.
  const links = (project.links ?? []).filter((link) => link.url)
  const [primaryLink, ...secondaryLinks] = links

  // Repos beyond the primary `githubRepo` (which drives the star badge above)
  // — plain chip links, no star count, rendered alongside the secondary links.
  const additionalRepos = (project.additionalRepos ?? []).filter(
    (entry): entry is { repo: string; label: string | null } =>
      Boolean(entry.repo)
  )

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
      <JsonLd data={buildCreativeWorkJsonLd(project, `/projects/${slug}`)} />
      <JsonLd
        data={buildBreadcrumbListJsonLd([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
          { name: project.title ?? "Project", path: `/projects/${slug}` },
        ])}
      />
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

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {iconUrl && (
            // Free-floating, matching the card treatment: height locked, width
            // free, so wordmarks and square app icons both sit correctly.
            <Image
              src={iconUrl}
              alt={project.icon?.alt ?? ""}
              width={240}
              height={64}
              sizes="140px"
              className="h-8 w-auto max-w-35 shrink-0 object-contain object-left"
            />
          )}
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

        <PageHero
          heading={project.title}
          headingClassName="mt-3 font-heading text-4xl leading-tight font-black sm:text-5xl"
          subtext={project.tagline}
          subtextClassName="mt-4 max-w-2xl leading-relaxed text-body-foreground md:text-lg"
        />

        {coverUrl && (
          // A bordered image wrapper — the one place the resting-`shadow-xl`
          // -> `hover:shadow-2xl` pairing belongs. See docs/ui/design-system.md.
          <div
            className={cn(
              "mt-8 aspect-[21/9] overflow-hidden rounded-lg border-3 border-border bg-muted",
              "shadow-xl transition-shadow duration-press ease-snap hover:shadow-2xl"
            )}
          >
            <Image
              src={coverUrl}
              alt={project.coverImage?.alt ?? ""}
              width={1680}
              height={720}
              priority
              sizes="(min-width: 1280px) 1200px, 100vw"
              // `contain`, matching the split cards on /projects: the 21:9 box
              // caps how tall the hero can get, and the image sits fully inside
              // it on the muted ground rather than being cropped to fill.
              className="h-full w-full object-contain p-4"
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

            <ProjectCollaborators collaborators={project.collaborators} />

            <RelatedProjects projects={project.relatedProjects} />

            <ProjectGallery gallery={project.gallery} title={project.title} />
          </div>

          {/*
            No `h-fit` here, matching blog/journal: as a flex child the aside
            stretches to the main column's full height (the row's default
            `items-stretch`), giving the sticky div below room to travel
            across a case study of any length. With `h-fit` the aside shrinks
            to the sticky content's own height, leaving it almost nowhere to
            travel — sticky silently does nothing. Sticky is gated behind
            `lg:` throughout, so on mobile the panel is static and (via
            `flex-col-reverse`) sits above the prose.
          */}
          <aside className="lg:w-80 lg:shrink-0">
            {/*
              One sticky column holding two separate cards: the sticky lives on
              this wrapper rather than on each card, so Information and Links
              travel and settle together with the gap between them intact.

              `lg:z-10` keeps this above the fixed, `z-50`-adjacent navbar's
              visual footprint as it scrolls into the sticky offset — without
              it the cards can render underneath the navbar instead of
              settling below it. `max-h-[calc(100vh-8rem-0.5rem)]` +
              `overflow-y-auto` caps the stack at viewport height and scrolls
              internally instead of ever growing taller than the screen. The
              `-mx-2 -mb-2 p-2` pair pads the scroll container by the cards'
              own hard offset `shadow-lg` and pulls the padding back out, so
              the shadow isn't clipped at the scroll edge while the visible
              column still lines up with `aside`'s width.
            */}
            <div className="flex flex-col gap-5 lg:sticky lg:top-32 lg:z-10 lg:-mx-2 lg:-mb-2 lg:max-h-[calc(100vh-8rem-0.5rem)] lg:overflow-y-auto lg:overflow-x-hidden lg:p-2">
              <div className="rounded-lg border-3 border-border bg-card p-5 shadow-lg">
                <h2 className="font-heading text-lg font-black">Information</h2>

              <dl className="mt-3">
                {dateRange && <InfoRow label="Timeline">{dateRange}</InfoRow>}

                {attribution && <InfoRow label="Built">{attribution}</InfoRow>}

                {project.relatedExperience?.role && (
                  <InfoRow label="Role">
                    <Link
                      href="/work"
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

              </div>

              {/*
                Links get their own card, and only the first one is a full-width
                primary button — the rest are compact chips on a wrapping row,
                matching the "Built with" chips above. Three stacked orange
                buttons already crowded the panel; six or eight would have been
                a wall of colour with no hierarchy, and nothing reading as the
                primary action.
              */}
              {(links.length > 0 || additionalRepos.length > 0) && (
                <div className="rounded-lg border-3 border-border bg-card p-5 shadow-lg">
                  <h2 className="font-heading text-lg font-black">Links</h2>

                  {primaryLink?.url && (
                    <TrackedLink
                      platform={primaryLink.type ?? "external"}
                      url={primaryLink.url}
                      placement="project_detail"
                      position="primary"
                    >
                      <a
                        href={primaryLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "mt-3 flex items-center justify-center gap-2 rounded-lg border-2 border-border bg-primary px-4 py-2.5",
                          "font-heading text-sm font-bold text-primary-foreground",
                          "shadow-sm transition-[translate,transform,box-shadow] duration-press ease-snap",
                          "hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
                          "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                        )}
                      >
                        {(() => {
                          const Icon = primaryLink.type
                            ? LINK_ICONS[primaryLink.type]
                            : LinkIcon
                          return <Icon className="size-4" aria-hidden="true" />
                        })()}
                        {primaryLink.label ?? "Visit"}
                      </a>
                    </TrackedLink>
                  )}

                  {(secondaryLinks.length > 0 ||
                    additionalRepos.length > 0) && (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {secondaryLinks.map((link) => {
                        if (!link.url) return null
                        const Icon = link.type
                          ? LINK_ICONS[link.type]
                          : LinkIcon

                        return (
                          <li key={`${link.url}-${link.label}`}>
                            <TrackedLink
                              platform={link.type ?? "external"}
                              url={link.url}
                              placement="project_detail"
                              position="secondary"
                            >
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                  "inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-background px-2.5 py-1",
                                  "text-xs font-bold",
                                  "shadow-sm transition-[translate,transform,box-shadow] duration-press ease-snap",
                                  "hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-muted hover:shadow-none",
                                  "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                                )}
                              >
                                <Icon className="size-3.5" aria-hidden="true" />
                                {link.label ?? "Link"}
                              </a>
                            </TrackedLink>
                          </li>
                        )
                      })}

                      {/*
                        Repos beyond the primary one: same chip shell as the
                        secondary links above, but the repo's `owner/name` is
                        always shown (monospace) so the actual repo stays
                        identifiable even when a label is set — unlike a free-
                        text link label, it never goes stale or ambiguous.
                      */}
                      {additionalRepos.map((entry) => {
                        const href = `https://github.com/${entry.repo}`

                        return (
                          <li key={entry.repo}>
                            <TrackedLink
                              platform="repo"
                              url={href}
                              placement="project_detail"
                              position="secondary"
                            >
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                  "inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-background px-2.5 py-1",
                                  "text-xs font-bold",
                                  "shadow-sm transition-[translate,transform,box-shadow] duration-press ease-snap",
                                  "hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-muted hover:shadow-none",
                                  "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                                )}
                              >
                                <GitBranchIcon
                                  className="size-3.5 shrink-0"
                                  aria-hidden="true"
                                />
                                {entry.label ? (
                                  <span className="flex flex-col items-start leading-tight">
                                    <span>{entry.label}</span>
                                    <span className="font-mono text-[10px] font-normal text-muted-foreground">
                                      {entry.repo}
                                    </span>
                                  </span>
                                ) : (
                                  <span className="font-mono">
                                    {entry.repo}
                                  </span>
                                )}
                              </a>
                            </TrackedLink>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
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
                    cardLift,
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
                    "group flex items-center gap-3 rounded-lg border-3 border-border bg-card p-4 md:flex-row-reverse md:text-right",
                    // Pinned to the second column rather than pushed right with
                    // `ml-auto`. On the first project there is no Previous tile,
                    // and `ml-auto` left this one floating mid-row inside
                    // column 1 — belonging to neither edge. `col-start-2` keeps
                    // Next on the right and Previous on the left always, so the
                    // tile's position always means the same thing.
                    "md:col-start-2",
                    cardLift,
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
