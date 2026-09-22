"use client"

import { useTransition } from "react"
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

interface SkillsFilteredProps {
  skills: SKILLS_QUERY_RESULT
}

/**
 * URL-backed filter state (via nuqs), matching the convention already used
 * on /blog, /journal and /projects — a filtered skills view is then
 * shareable and survives back/forward, instead of resetting on navigation
 * the way the previous local `useState` version did.
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
    <div>
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
          <div className="flex flex-wrap gap-2">
            {visibleSkills.map((skill) => (
              <SkillChip key={skill._id} skill={skill} />
            ))}

            {visibleSkills.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No skills match your search.
              </p>
            )}
          </div>
        </FilterResultsTransition>
      </div>
    </div>
  )
}
