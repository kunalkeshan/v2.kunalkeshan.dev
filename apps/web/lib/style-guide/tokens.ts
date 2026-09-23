import fs from "node:fs"
import path from "node:path"

// Reads packages/ui/src/styles/globals.css directly off disk (server-only —
// this module must never be imported from a "use client" file) instead of
// hand-copying token values into this app. If a color/shadow/radius token
// changes in packages/ui, the style guide reflects it on the next request
// with zero manual edits here.
const GLOBALS_CSS_PATH = path.join(
  process.cwd(),
  "..",
  "..",
  "packages/ui/src/styles/globals.css"
)

export type TokenEntry = {
  key: string
  label: string
  light: string
  dark: string
}

export type TokenGroup = {
  title: string
  description?: string
  entries: TokenEntry[]
}

function extractBlock(css: string, selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`)
  if (start === -1) return {}
  const openBrace = css.indexOf("{", start)
  let depth = 0
  let end = openBrace
  for (let i = openBrace; i < css.length; i++) {
    if (css[i] === "{") depth++
    if (css[i] === "}") {
      depth--
      if (depth === 0) {
        end = i
        break
      }
    }
  }
  const body = css.slice(openBrace + 1, end)
  const props: Record<string, string> = {}
  const declRegex = /--([a-z0-9-]+):\s*([^;]+);/gi
  let match: RegExpExecArray | null
  while ((match = declRegex.exec(body)) !== null) {
    const [, name, value] = match
    if (name && value) props[`--${name}`] = value.trim()
  }
  return props
}

function readTokens() {
  const css = fs.readFileSync(GLOBALS_CSS_PATH, "utf-8")
  const light = extractBlock(css, ":root")
  const dark = extractBlock(css, ".dark")
  return { light, dark }
}

function entry(
  light: Record<string, string>,
  dark: Record<string, string>,
  key: string,
  label: string
): TokenEntry {
  return {
    key,
    label,
    light: light[key] ?? "",
    dark: dark[key] ?? light[key] ?? "",
  }
}

// Bare-utility class names, per docs/ui/design-system.md's shadow-naming
// rule: the raw var is `--shadow-base`, but the Tailwind utility it maps to
// is the bare `shadow` class, not `shadow-base`.
const SHADOW_UTILITY_NAMES: Record<string, string> = {
  "--shadow-sm": "shadow-sm",
  "--shadow-base": "shadow",
  "--shadow-lg": "shadow-lg",
  "--shadow-xl": "shadow-xl",
  "--shadow-2xl": "shadow-2xl",
  "--shadow-reverse": "shadow-reverse",
  "--shadow-reverse-sm": "shadow-reverse-sm",
}

const RADIUS_UTILITY_NAMES: Record<string, string> = {
  "--radius-sm": "rounded-sm",
  "--radius-base": "rounded-md",
  "--radius-lg": "rounded-lg",
  "--radius-pill": "rounded-4xl",
}

export function getTokenGroups(): TokenGroup[] {
  const { light, dark } = readTokens()

  const colors: TokenGroup = {
    title: "Colors",
    description:
      "Every color token, light and dark. Status colors always pair with a near-black foreground, never light text on orange/yellow.",
    entries: [
      entry(light, dark, "--background", "Background"),
      entry(light, dark, "--foreground", "Foreground"),
      entry(light, dark, "--card", "Card / Popover"),
      entry(light, dark, "--primary", "Primary"),
      entry(light, dark, "--primary-foreground", "Primary foreground"),
      entry(light, dark, "--secondary", "Secondary"),
      entry(light, dark, "--secondary-foreground", "Secondary foreground"),
      entry(light, dark, "--muted", "Muted / Accent"),
      entry(light, dark, "--muted-foreground", "Muted foreground"),
      entry(light, dark, "--success", "Success"),
      entry(light, dark, "--warning", "Warning"),
      entry(light, dark, "--destructive", "Destructive"),
      entry(light, dark, "--border", "Border / Input"),
      entry(light, dark, "--ring", "Ring"),
      entry(light, dark, "--overlay", "Overlay"),
      entry(light, dark, "--body-foreground", "Body foreground"),
    ],
  }

  const shadows: TokenGroup = {
    title: "Shadows",
    description:
      "Solid, single-color, offset shadows — no blur, no spread. Color always equals --border, so shadows invert automatically in dark mode.",
    entries: Object.entries(SHADOW_UTILITY_NAMES).map(([key, label]) =>
      entry(light, dark, key, label)
    ),
  }

  const radius: TokenGroup = {
    title: "Radius",
    description:
      "Corners stay tight — nothing above 10px except pills (avatars, true pill badges).",
    entries: Object.entries(RADIUS_UTILITY_NAMES).map(([key, label]) =>
      entry(light, dark, key, label)
    ),
  }

  return [colors, shadows, radius]
}

export type BorderWidthEntry = {
  label: string
  className: string
  description: string
}

// This is a convention documented in docs/ui/design-system.md, not a single
// CSS custom property to parse — the bare `border` utility's 2px width comes
// from `--default-border-width` in `@theme inline`, but the "controls vs.
// containers" split is authored guidance, so it's hand-listed here rather
// than derived.
export const BORDER_WIDTHS: BorderWidthEntry[] = [
  {
    label: "Controls",
    className: "border-2",
    description: "Buttons, inputs, badges — the bare `border` utility.",
  },
  {
    label: "Containers",
    className: "border-3",
    description: "Cards, panels, sheets, dialogs.",
  },
]
