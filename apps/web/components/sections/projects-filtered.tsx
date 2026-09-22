"use client"

import { useMemo, useTransition } from "react"
import { parseAsString, parseAsArrayOf, useQueryState } from "nuqs"

import type { PROJECTS_QUERY_RESULT } from "@workspace/sanity/types"

import { FilterChipGroup } from "@/components/filters/filter-chip-group"
import { FilterClearButton } from "@/components/filters/filter-clear-button"
import { FilterResultsTransition } from "@/components/filters/filter-results-transition"
import { FilterSearchInput } from "@/components/filters/filter-search-input"
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
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useQueryState(
    "q",
    parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault: true, startTransition })
  )
  const [activeKinds, setActiveKinds] = useQueryState(
    "kind",
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ clearOnDefault: true, startTransition })
  )
  const [activeSkills, setActiveSkills] = useQueryState(
    "tech",
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ clearOnDefault: true, startTransition })
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

  const resultsKey = visible.map((project) => project._id).join(",")

  return (
    <div>
      <FilterSearchInput
        value={query}
        onChange={(value) => setQuery(value || null)}
        placeholder="Search projects..."
        aria-label="Search projects"
        isPending={isPending}
      />

      <div className="mt-6">
        <FilterChipGroup
          options={availableKinds.map((kind) => ({
            value: kind,
            label: PROJECT_KIND_LABELS[kind] ?? kind,
          }))}
          selectionMode="multiple"
          value={activeKinds}
          onChange={(next) => setActiveKinds(next.length > 0 ? next : null)}
          aria-label="Filter by project kind"
        />
      </div>

      {availableSkills.length > 0 && (
        <div className="mt-3">
          <FilterChipGroup
            options={availableSkills.map((skill) => ({
              value: skill,
              label: skill,
            }))}
            selectionMode="multiple"
            value={activeSkills}
            onChange={(next) => setActiveSkills(next.length > 0 ? next : null)}
            aria-label="Filter by technology"
          />
        </div>
      )}

      <FilterClearButton
        show={hasFilters}
        onClick={() => {
          setQuery(null)
          setActiveKinds(null)
          setActiveSkills(null)
        }}
      />

      <div className="mt-8">
        <FilterResultsTransition resultsKey={resultsKey}>
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
                hackathon builds, and coursework that&apos;s since been
                archived.
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
        </FilterResultsTransition>
      </div>
    </div>
  )
}
