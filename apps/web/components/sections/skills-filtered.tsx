"use client"

import { useState, useTransition } from "react"
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs"

import type { SKILLS_QUERY_RESULT } from "@workspace/sanity/types"

import { FilterChipGroup } from "@/components/filters/filter-chip-group"
import { FilterClearButton } from "@/components/filters/filter-clear-button"
import { FilterResultsTransition } from "@/components/filters/filter-results-transition"
import { FilterSearchInput } from "@/components/filters/filter-search-input"
import { SkillChip } from "@/components/sections/skill-chip"
import {
  SKILL_CATEGORY_LABELS,
  SKILL_CATEGORY_ORDER,
} from "@/lib/skill-categories"
import { useRevealGroup } from "@/hooks/use-reveal"
import { Reveal } from "@/components/reveal"
import { chipStaggerDelay } from "@/lib/reveal-stagger"

interface SkillsFilteredProps {
  skills: SKILLS_QUERY_RESULT
}

/**
 * URL-backed filter state (via nuqs), matching the convention already used
 * on /blog, /journal and /projects — a filtered skills view is then
 * shareable and survives back/forward, instead of resetting on navigation
 * the way the previous local `useState` version did.
 *
 * The chip grid staggers in (`chipStaggerDelay`, same mechanism as the home
 * page's featured-skills strip) only on first load — see `everFiltered`
 * above. Once the user has filtered even once, every later render (including
 * clearing back to the unfiltered set) renders plain `SkillChip`s with no
 * `<Reveal>`, leaving `FilterResultsTransition`'s crossfade as the only
 * motion — re-staggering a 20-30 chip grid on every keystroke or category
 * toggle would read as sluggish for a control used repeatedly.
 */
export function SkillsFiltered({ skills }: SkillsFilteredProps) {
  const [isPending, startTransition] = useTransition()
  const [filters, setFilters] = useQueryStates(
    {
      q: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
      category: parseAsArrayOf(parseAsString)
        .withDefault([])
        .withOptions({ clearOnDefault: true }),
    },
    { startTransition }
  )
  // Stagger the chip grid in only on first load. Any filter/search change
  // after that is `FilterResultsTransition`'s job (a plain crossfade of the
  // whole grid) — re-running a 20-30 chip ripple on every keystroke or
  // category toggle would feel sluggish for a control someone uses
  // repeatedly, not celebratory the way a one-time page-load reveal is.
  //
  // "Adjust state during rendering" (react.dev), not an effect: this only
  // ever flips one way (false -> true) and must be true for the SAME render
  // that shows the filtered result, not one render later.
  const filtersActive = filters.q.length > 0 || filters.category.length > 0
  const [everFiltered, setEverFiltered] = useState(filtersActive)
  if (filtersActive && !everFiltered) {
    setEverFiltered(true)
  }
  const { ref, state, Provider } = useRevealGroup<HTMLDivElement>("mount")

  const byCategory = new Map<string, NonNullable<SKILLS_QUERY_RESULT>>()
  for (const skill of skills ?? []) {
    if (!skill.category) continue
    const bucket = byCategory.get(skill.category) ?? []
    bucket.push(skill)
    byCategory.set(skill.category, bucket)
  }

  const availableCategories = SKILL_CATEGORY_ORDER.filter((category) =>
    byCategory.has(category)
  )

  const normalizedQuery = filters.q.trim().toLowerCase()

  const visibleSkills = (skills ?? []).filter((skill) => {
    const matchesCategory =
      filters.category.length === 0 ||
      (skill.category && filters.category.includes(skill.category))
    const matchesQuery =
      normalizedQuery.length === 0 ||
      skill.name?.toLowerCase().includes(normalizedQuery)
    return matchesCategory && matchesQuery
  })

  const hasFilters = filters.category.length > 0 || filters.q.length > 0
  const resultsKey = visibleSkills.map((skill) => skill._id).join(",")

  return (
    <div ref={ref}>
      <FilterSearchInput
        value={filters.q}
        onChange={(value) => setFilters({ q: value || null })}
        placeholder="Search skills..."
        aria-label="Search skills"
        isPending={isPending}
      />

      <div className="mt-6">
        <FilterChipGroup
          options={availableCategories.map((category) => ({
            value: category,
            label: SKILL_CATEGORY_LABELS[category] ?? category,
          }))}
          selectionMode="multiple"
          value={filters.category}
          onChange={(next) =>
            setFilters({ category: next.length > 0 ? next : null })
          }
          aria-label="Filter by skill category"
        />
      </div>

      <FilterClearButton
        show={hasFilters}
        onClick={() => setFilters({ q: null, category: null })}
      />

      <div className="mt-8">
        <FilterResultsTransition resultsKey={resultsKey}>
          <Provider state={state}>
            <div className="flex flex-wrap gap-2">
              {visibleSkills.map((skill, index) =>
                everFiltered ? (
                  <SkillChip key={skill._id} skill={skill} />
                ) : (
                  <Reveal key={skill._id} delay={chipStaggerDelay(index)}>
                    <SkillChip skill={skill} />
                  </Reveal>
                )
              )}

              {visibleSkills.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No skills match your search.
                </p>
              )}
            </div>
          </Provider>
        </FilterResultsTransition>
      </div>
    </div>
  )
}
