import type { Transition, Variants } from "motion/react"

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
  type: "spring",
}

export const sectionRevealViewport = { once: true } as const

export const springTransition: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
  mass: 0.6,
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
