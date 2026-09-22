"use client"

import { useEffect, useState } from "react"

/**
 * A thin fixed-top bar tracking scroll progress through a target element
 * (the article body), not the whole page — the sidebar/footer scrolling past
 * shouldn't read as "done reading."
 *
 * Plain scroll-listener + rAF rather than a library: the calculation is one
 * division (`scrolled / scrollable`), so a dependency would add more bundle
 * weight than code it replaces.
 */
export function ReadingProgressBar({ targetId }: { targetId: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const target = document.getElementById(targetId)
    if (!target) return

    let frame: number | null = null

    function updateProgress() {
      frame = null
      if (!target) return

      const rect = target.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      // Distance already scrolled past the article's top, relative to the
      // article's own height minus one viewport — so progress hits 100% when
      // the article's bottom edge reaches the bottom of the screen, not when
      // the user scrolls the full page height (which includes the footer).
      const scrollable = rect.height - viewportHeight
      if (scrollable <= 0) {
        setProgress(rect.top <= 0 ? 100 : 0)
        return
      }

      const scrolled = -rect.top
      const percent = Math.min(100, Math.max(0, (scrolled / scrollable) * 100))
      setProgress(percent)
    }

    function onScroll() {
      if (frame !== null) return
      frame = requestAnimationFrame(updateProgress)
    }

    updateProgress()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [targetId])

  return (
    <div
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent"
    >
      <div
        className="h-full bg-primary transition-[width] duration-100 ease-linear motion-reduce:transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
