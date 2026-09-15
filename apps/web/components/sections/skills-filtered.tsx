"use client"

import { useState } from "react"
import { SearchIcon } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import type { SKILLS_QUERY_RESULT } from "@workspace/sanity/types"

import { SkillChip } from "@/components/sections/skill-chip"
import {
  SKILL_CATEGORY_LABELS,
  SKILL_CATEGORY_ORDER,
} from "@/lib/skill-categories"

interface SkillsFilteredProps {
  skills: SKILLS_QUERY_RESULT
}

export function SkillsFiltered({ skills }: SkillsFilteredProps) {
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set()
  )
  const [query, setQuery] = useState("")

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

  function toggleCategory(category: string) {
    setActiveCategories((current) => {
      const next = new Set(current)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  const normalizedQuery = query.trim().toLowerCase()

  const visibleSkills = (skills ?? []).filter((skill) => {
    const matchesCategory =
      activeCategories.size === 0 ||
      (skill.category && activeCategories.has(skill.category))
    const matchesQuery =
      normalizedQuery.length === 0 ||
      skill.name?.toLowerCase().includes(normalizedQuery)
    return matchesCategory && matchesQuery
  })

  return (
    <div>
      <div className="relative max-w-sm">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search skills..."
          className="h-10 pl-8"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {availableCategories.map((category) => {
          const isActive = activeCategories.has(category)
          return (
            <Badge
              key={category}
              onClick={() => toggleCategory(category)}
              aria-pressed={isActive}
              className={cn(
                "h-auto cursor-pointer rounded-(--radius-lg) border-2 border-border px-3 py-1.5 text-xs normal-case",
                "shadow-[var(--shadow-sm)] transition-[transform,box-shadow,background-color,color] duration-(--duration-press) ease-(--ease-snap)",
                "hover:translate-x-px hover:translate-y-px hover:shadow-none",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground"
              )}
            >
              {SKILL_CATEGORY_LABELS[category] ?? category}
            </Badge>
          )
        })}

        {activeCategories.size > 0 && (
          <Button
            variant="link"
            size="xs"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setActiveCategories(new Set())}
          >
            Clear
          </Button>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {visibleSkills.map((skill) => (
          <SkillChip key={skill._id} skill={skill} />
        ))}

        {visibleSkills.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No skills match your search.
          </p>
        )}
      </div>
    </div>
  )
}
