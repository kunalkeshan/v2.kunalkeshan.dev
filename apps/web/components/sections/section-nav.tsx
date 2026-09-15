"use client"

import { useEffect, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

export interface SectionNavItem {
  id: string
  label: string
}

interface SectionNavProps {
  items: SectionNavItem[]
}

/**
 * In-page section jump bar for long documents.
 *
 * Deliberately anchors rather than tabs: the resume is one continuous document,
 * so swapping panels would hide the work history from browser find-in-page,
 * from printing, and from anyone linking to a section. Every section stays in
 * the DOM; this only moves the viewport.
 *
 * Sticks below the floating navbar at every width — a horizontal pill row reads
 * the same on a phone and a desktop, so there is one layout to reason about and
 * no reflow at the breakpoint.
 */
export function SectionNav({ items }: SectionNavProps) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null)

  useEffect(() => {
    if (items.length === 0) return

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null)

    if (elements.length === 0) return

    // The top band is occupied by the navbar and this bar, so a section only
    // counts as "current" once it reaches roughly a quarter down the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 }
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [items])

  if (items.length < 2) return null

  return (
    <nav
      aria-label="Sections"
      className={cn(
        // Deliberately static rather than sticky: the page already has a
        // floating navbar pinned to the top, and a second pinned bar competed
        // with it and overlapped cards scrolling underneath. This reads as a
        // "jump to" row under the intro and then gets out of the way.
        "-mx-1 mb-8 overflow-x-auto px-1 py-1"
      )}
    >
      <ul className="flex w-max gap-2">
        {items.map((item) => {
          const isActive = item.id === activeId

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "inline-flex items-center rounded-(--radius-pill) border-2 border-border px-4 py-1.5",
                  "font-heading text-sm font-bold whitespace-nowrap",
                  "transition-[transform,box-shadow,background-color,color] duration-(--duration-press) ease-(--ease-snap)",
                  "hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
                  "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-none"
                    : "bg-card text-card-foreground shadow-[var(--shadow-sm)]"
                )}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
