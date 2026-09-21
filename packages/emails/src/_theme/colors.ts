/**
 * Hex palette for HTML email, manually mirrored from the light-mode `:root`
 * tokens in `packages/ui/src/styles/globals.css`.
 *
 * This CANNOT be derived automatically: email clients render raw HTML/CSS
 * with no access to CSS custom properties, so every value here has to be a
 * literal hex. Dark mode is skipped entirely (`prefers-color-scheme` support
 * across mail clients is too inconsistent to design against), matching the
 * reference pattern this package is modeled on.
 *
 * MAINTENANCE: if `packages/ui/src/styles/globals.css`'s `:root` block
 * changes (background/foreground/primary/border/etc.), update the matching
 * value here too. There is no build-time link between the two files — see
 * the cross-reference note in docs/ui/design-system.md.
 */
export const emailColors = {
  background: "#faf9f6",
  foreground: "#0b0b0b",
  card: "#ffffff",
  primary: "#ffa500",
  primaryForeground: "#0b0b0b",
  secondary: "#1c92ff",
  secondaryForeground: "#ffffff",
  muted: "#f1f0ee",
  mutedForeground: "#6b6b6b",
  border: "#0b0b0b",
  bodyForeground: "#393939",
} as const;
