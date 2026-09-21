import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * The neobrutalist "press into shadow" interaction: rest state carries the
 * full offset shadow; hover nudges 2px toward it and shrinks the shadow;
 * active/disabled/loading fully collapse the offset and shadow to zero.
 * Also transitions background/text color so any hover color swap (e.g. a
 * CTA switching to --primary on hover) fades instead of snapping instantly.
 * Apply only to solid/bordered controls — never ghost/link variants.
 */
export const pressableShadow =
  "shadow transition-[translate,transform,box-shadow,background-color,color] duration-press ease-snap " +
  "hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-sm " +
  "active:translate-x-1 active:translate-y-1 active:shadow-none " +
  "disabled:translate-x-1 disabled:translate-y-1 disabled:shadow-none disabled:pointer-events-none disabled:opacity-60 " +
  "aria-disabled:translate-x-1 aria-disabled:translate-y-1 aria-disabled:shadow-none"

/**
 * The content-card hover, ported from v1's project/service cards: the card
 * **rests flat** and the hard shadow *appears* on hover alongside a lift. Mirrors
 * the reference card on paperfolio.webflow.io, whose rule is
 * `transition: box-shadow .3s, transform .3s` with the shadow and a -10px
 * translate applied only on `:hover`.
 *
 * This is deliberately not the resting-`shadow-xl` -> `hover:shadow-2xl` pair,
 * which docs/ui/design-system.md reserves for bordered *image wrappers* (hero
 * art, avatars). Using that pairing here reads as inert — the shadow is already
 * there, so hover barely registers.
 *
 * The explicit resting `translate-y-0` matters: without a declared start value
 * the property is absent at rest, and the browser has nothing to interpolate
 * *from* on hover / *back to* on unhover. That asymmetry reads as jank on the
 * way out. `transform-gpu` promotes the card to its own layer so the lift
 * composites instead of repainting the bordered box every frame.
 *
 * The transition list names `translate`, NOT `transform`. Tailwind v4 emits
 * `-translate-y-*` as the standalone CSS `translate` property (it composes
 * translate/rotate/scale separately so utilities don't clobber each other), so a
 * `transition-[transform,...]` list does not cover it: the shadow eases while the
 * lift jumps instantly, which is precisely the "sudden, not gradual" feel this
 * helper exists to avoid. `transform` stays in the list for `transform-gpu`'s
 * `translateZ(0)` and for any call site that composes a real `transform`.
 * Verify with `getComputedStyle(el).transitionProperty` — it must include
 * `translate`.
 *
 * Motion only — layout, colour and border classes stay at the call site. Pair
 * with `group` on the same element to let inner art respond (see the
 * `group-hover:scale-110` on the card images). Never combine with
 * `pressableShadow`, which owns its own `hover:translate-*` on the same axis and
 * would fight the lift.
 */
export const cardLift =
  "translate-y-0 transform-gpu will-change-transform " +
  "transition-[translate,transform,box-shadow] duration-press ease-snap " +
  "hover:-translate-y-2 hover:shadow-xl " +
  // Reduced motion: keep the shadow cue, drop the travel.
  "motion-reduce:transition-[box-shadow] motion-reduce:hover:translate-y-0"

/**
 * `cardLift`'s hovered state, applied unconditionally instead of on `:hover`.
 * For a card that should always read as "elevated" — e.g. a card the user
 * points to first. Same tokens as `cardLift`'s hover step (`-translate-y-2
 * shadow-xl`) so it stays visually consistent with the rest of the card grid;
 * just permanently in that position instead of transitioning into it.
 * Motion only — layout, colour and border classes stay at the call site.
 * Never combine with `cardLift` or `pressableShadow` on the same element.
 */
export const cardLiftActive =
  "-translate-y-2 shadow-xl transform-gpu will-change-transform"
