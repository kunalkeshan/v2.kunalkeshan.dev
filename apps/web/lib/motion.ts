import type { Transition, Variants } from "motion/react"

/**
 * Reveal easing curve — `ease-out-quint`, `cubic-bezier(0.22, 1, 0.36, 1)`,
 * the same Penner/coss.com palette `globals.css` already defines as
 * `--ease-out-quint` for CSS transitions (see `packages/ui/src/styles/globals.css`
 * "motion" block, sourced from coss.com/origin/easings). Motion/react's
 * `Transition.ease` only accepts a bezier array, not the CSS var, so the
 * literal points are duplicated here — keep the two in sync if either
 * changes.
 *
 * Previously these reveals ran on spring *physics*
 * (`type: "spring"`), which settles with a variable, travel-distance-dependent
 * velocity curve and a touch of overshoot — across 15+ consumers that read as
 * inconsistent/"ragged" rather than deliberate, especially since
 * `sectionRevealTransition` and `heroRevealTransition` were actually two
 * *different* untuned spring instances (the former had no explicit
 * stiffness/damping/mass, so it fell back to motion/react's own defaults,
 * never matching the latter's hand-tuned 350/28/0.5). A single fixed
 * duration + curve is fully deterministic and identical everywhere it's
 * used, which is the whole point of centralizing this file.
 */
const revealEase = [0.22, 1, 0.36, 1] as const

/**
 * Ported from kunalkeshan.dev v1's copy-pasted section-reveal snippet
 * (`initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
 * transition={{delay:0.2,type:"spring"}} viewport={{once:true}}`, repeated
 * inline across ~15+ sections) — centralized here instead of re-inlined.
 * See docs/ui/design-system.md "Motion / animation conventions".
 */
export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export const sectionRevealTransition: Transition = {
  delay: 0.2,
  duration: 0.6,
  ease: revealEase,
}

export const sectionRevealViewport = { once: true } as const

/**
 * Kept as the shared duration+curve reveal transition (name retained from
 * the old spring-physics version so every existing `import { springTransition }`
 * keeps working) — also reused directly by the navbar's scroll-morph, which
 * has no delay of its own.
 */
export const springTransition: Transition = {
  duration: 0.6,
  ease: revealEase,
}

/**
 * Mount-entrance counterpart to sectionReveal (which is for whileInView
 * scroll-discovered content). Hero-style above-the-fold sections are
 * already in view at load, so they animate in on mount instead.
 */
export const heroReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export const heroRevealTransition: Transition = springTransition
