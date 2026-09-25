/**
 * Per-card delay step for a staggered card-grid reveal (`ServicesGrid`,
 * `ProjectsGrid`, `ValuesGrid`) — card at index `i` uses
 * `delay={i * CARD_STAGGER_STEP_S}`.
 *
 * Deliberately smaller than the hero's per-piece steps (0.12s): a grid can
 * have 6+ items, and a 0.12s step across that many would push the last
 * card's reveal out past ~0.7s, reading as sluggish rather than a quick
 * left-to-right/row-by-row cascade. 0.06s keeps a 6-card grid's full reveal
 * finishing within roughly a third of a second while still being visibly
 * sequential, not simultaneous.
 */
export const CARD_STAGGER_STEP_S = 0.06

/**
 * Per-chip delay step for a staggered *chip* reveal (`Skills`'s home strip,
 * `SkillsFiltered`'s full grid on /skills) — smaller than `CARD_STAGGER_STEP_S`
 * because a chip list can run to 20-30+ items across categories, where even
 * the card step would push the last item out past a second and a half.
 */
export const CHIP_STAGGER_STEP_S = 0.02

/** No chip waits longer than this, regardless of how many precede it — see
 * `chipStaggerDelay`. */
export const CHIP_STAGGER_MAX_DELAY_S = 0.4

/**
 * `delay={chipStaggerDelay(index)}` for a `<Reveal>` wrapping chip `index`.
 * Capped so a long list (20-30+ chips) doesn't push its last few items out
 * to a noticeably slower finish than a short one — every chip list settles
 * within `CHIP_STAGGER_MAX_DELAY_S` of its own reveal firing, however many
 * chips it has.
 */
export function chipStaggerDelay(index: number) {
  return Math.min(index * CHIP_STAGGER_STEP_S, CHIP_STAGGER_MAX_DELAY_S)
}
