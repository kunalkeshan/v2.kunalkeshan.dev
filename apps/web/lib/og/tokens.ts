// Raw hex values, not Tailwind classes — ImageResponse renders via Satori,
// not the browser, so it never sees globals.css. Copied from the light-mode
// :root tokens in packages/ui/src/styles/globals.css (design-system.md's
// "Colors" table); generated OG images always render light-mode regardless
// of the visiting browser's theme, matching how a generated social-preview
// image has no user session to read a preference from.
//
// Shared by every `next/og` template in this directory so the tokens never
// drift out of sync with each other or with design-system.md.
export const OG_TOKENS = {
  background: "#faf9f6",
  foreground: "#0b0b0b",
  card: "#ffffff",
  primary: "#ffa500",
  primaryForeground: "#0b0b0b",
  secondary: "#1c92ff",
  border: "#0b0b0b",
  mutedForeground: "#5c5c5c",
}
