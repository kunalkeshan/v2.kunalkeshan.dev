"use client"

import { useMemo } from "react"
import { SearchIcon } from "lucide-react"
import { parseAsString, parseAsArrayOf, useQueryState } from "nuqs"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import type { PROJECTS_QUERY_RESULT } from "@workspace/sanity/types"

import { ProjectsGrid } from "@/components/sections/projects"
import { PROJECT_KIND_LABELS, PROJECT_KIND_ORDER } from "@/lib/projects"

interface ProjectsFilteredProps {
  projects: PROJECTS_QUERY_RESULT
  stars?: Map<string, number>
}

/**
 * Search + facet filtering over the full project list.
 *
 * Modelled on `skills-filtered.tsx`, with one deliberate addition: filter state
 * lives in the URL via `nuqs` (already a dependency) rather than `useState`, so
 * a filtered view is shareable and survives a back/forward. v1 had no filtering
 * at all, let alone URL syncing.
 *
 * The archived split is applied *after* filtering so that searching still
 * reaches earlier work — otherwise a query for "Shiryoku" would appear to match
 * nothing while its card sat in a section below.
 */
export function ProjectsFiltered({ projects, stars }: ProjectsFilteredProps) {
  const [query, setQuery] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ clearOnDefault: true })
  )
  const [activeKinds, setActiveKinds] = useQueryState(
    "kind",
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ clearOnDefault: true })
  )
  const [activeSkills, setActiveSkills] = useQueryState(
    "tech",
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ clearOnDefault: true })
  )

  const all = useMemo(() => projects ?? [], [projects])

  const availableKinds = useMemo(
    () => PROJECT_KIND_ORDER.filter((kind) => all.some((p) => p.kind === kind)),
    [all]
  )

  /**
   * Only the tech that actually appears on a project, most-used first — a flat
   * list of all 100+ skill documents would be unusable as a filter row.
   */
  const availableSkills = useMemo(() => {
    const counts = new Map<string, { name: string; count: number }>()
    for (const project of all) {
      for (const skill of project.skills ?? []) {
        if (!skill.name) continue
        const existing = counts.get(skill.name)
        counts.set(skill.name, {
          name: skill.name,
          count: (existing?.count ?? 0) + 1,
        })
      }
    }
    return [...counts.values()]
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      .slice(0, 12)
      .map((entry) => entry.name)
  }, [all])

  function toggle(
    value: string,
    current: string[],
    setter: (next: string[] | null) => void
  ) {
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]
    // `null` clears the param entirely rather than leaving `?kind=` behind.
    setter(next.length > 0 ? next : null)
  }

  const normalizedQuery = query.trim().toLowerCase()

  const visible = useMemo(
    () =>
      all.filter((project) => {
        const matchesKind =
          activeKinds.length === 0 ||
          (project.kind !== null && activeKinds.includes(project.kind))

        const skillNames = (project.skills ?? [])
          .map((skill) => skill.name)
          .filter((name): name is string => Boolean(name))

        const matchesSkills =
          activeSkills.length === 0 ||
          activeSkills.every((wanted) => skillNames.includes(wanted))

        const haystack = [
          project.title,
          project.tagline,
          project.summary,
          project.organization?.name,
          ...skillNames,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()

        const matchesQuery =
          normalizedQuery.length === 0 || haystack.includes(normalizedQuery)

        return matchesKind && matchesSkills && matchesQuery
      }),
    [all, activeKinds, activeSkills, normalizedQuery]
  )

  const current = visible.filter((project) => !project.archived)
  const earlier = visible.filter((project) => project.archived)

  const hasFilters =
    activeKinds.length > 0 || activeSkills.length > 0 || query.length > 0

  const chipClass = (isActive: boolean) =>
    cn(
      "h-auto cursor-pointer rounded-lg border-2 border-border px-3 py-1.5 text-xs normal-case",
      "shadow-sm transition-[transform,box-shadow,background-color,color] duration-press ease-snap",
      "hover:translate-x-px hover:translate-y-px hover:shadow-none",
      isActive ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
    )

  return (
    <div>
      <div className="relative max-w-sm">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value || null)}
          placeholder="Search projects..."
          aria-label="Search projects"
          className="h-10 pl-8"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {availableKinds.map((kind) => (
          <Badge
            key={kind}
            onClick={() => toggle(kind, activeKinds, setActiveKinds)}
            aria-pressed={activeKinds.includes(kind)}
            className={chipClass(activeKinds.includes(kind))}
          >
            {PROJECT_KIND_LABELS[kind] ?? kind}
          </Badge>
        ))}
      </div>

      {availableSkills.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {availableSkills.map((skill) => (
            <Badge
              key={skill}
              onClick={() => toggle(skill, activeSkills, setActiveSkills)}
              aria-pressed={activeSkills.includes(skill)}
              className={chipClass(activeSkills.includes(skill))}
            >
              {skill}
            </Badge>
          ))}
        </div>
      )}

      {hasFilters && (
        <div className="mt-3">
          <Button
            variant="link"
            size="xs"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => {
              setQuery(null)
              setActiveKinds(null)
              setActiveSkills(null)
            }}
          >
            Clear filters
          </Button>
        </div>
      )}

      <div className="mt-8">
        {current.length > 0 && (
          // `split` only here: /projects runs two per row, wide enough for the
          // text-left/image-right layout. The home strip is 3-up and stays
          // stacked.
          <ProjectsGrid projects={current} stars={stars} split />
        )}

        {earlier.length > 0 && (
          <section aria-labelledby="earlier-work" className="mt-16">
            <h2
              id="earlier-work"
              className="font-heading text-2xl font-black sm:text-3xl"
            >
              Earlier work
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-body-foreground">
              Projects from my university years — open-source initiatives,
              hackathon builds, and coursework that&apos;s since been archived.
            </p>
            <div className="mt-6">
              <ProjectsGrid projects={earlier} stars={stars} compact />
            </div>
          </section>
        )}

        {visible.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No projects match your search.
          </p>
        )}
      </div>
    </div>
  )
}
