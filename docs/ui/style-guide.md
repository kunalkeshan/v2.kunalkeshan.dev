# Style Guide page and shadcn registry

Two related but separate pieces of infrastructure for `@workspace/ui`.

## The `/style-guide` page (`apps/web`)

A public, indexed page (`apps/web/app/(static)/style-guide`) rendering every design
token and component from `packages/ui` live from the real source, with
click-to-copy on tokens and component usage snippets. It includes a sticky grouped
sidebar on large screens, a bottom navigation sheet on smaller screens, and quick
instructions for configuring and using the public registry. Linked from the footer's
"Utility links" column, not the navbar.

### Tokens (fully dynamic — no manual step)

`apps/web/lib/style-guide/tokens.ts` reads `packages/ui/src/styles/globals.css` off
disk at request time and parses the `:root`/`.dark` custom-property blocks into
typed groups (colors, shadows, radius). If a token's value changes in `globals.css`,
the page reflects it on the next request with zero code changes here. Border widths
are hand-listed (`apps/web/lib/style-guide/tokens.ts`'s `BORDER_WIDTHS`) since the
2px-controls/3px-containers split is a convention, not a single CSS variable.

Typography (`apps/web/lib/style-guide/typography.ts`) is hand-maintained — Tailwind's
type scale is a set of utility classes, not custom properties, so there's nothing to
parse off disk. If the site's heading/body scale changes, this file needs a matching
manual edit.

### Components (hybrid: auto-iterated cva configs + hand-written demo specs)

`cva()`'s returned function does not expose its own `variants` config at runtime
(confirmed by reading the installed `class-variance-authority` source), so a fully
generic "read every component's variants" renderer isn't possible. Instead:

- **4 of 31 components** (`button`, `badge`, `empty`, `tabs`) extract their `cva()`
  config into a named, exported `*VariantsConfig` const (e.g. `buttonVariantsConfig`
  in `packages/ui/src/components/button.tsx`) purely so this page can read the real
  variant list. `apps/web/app/(static)/style-guide/_components/variant-grid.tsx`
  cartesian-products every axis in that config (e.g. Button's `variant` × `size`) and
  renders one cell per combination — this can't drift, since it reads the same object
  the component itself is built from.
- **The other 27 components** each get a small hand-written file in
  `apps/web/app/(static)/style-guide/_components/demo-specs/`, importing the real
  component and exporting a matching copy-ready JSX snippet string alongside it.
  Several needed real scaffolding to render meaningfully rather than trivial default
  props — `Dialog`/`Sheet`/`Tooltip` need a live trigger (content only exists while
  open/hovered), `Sonner` needs a button that calls `toast()`, `Form` needs a real
  `useForm()` instance, `Combobox`/`Select` need real options data, `Carousel` needs
  multiple real slides for `CarouselDots` to render anything.

**A component imported from a `"use client"` module needs its own demo file marked
`"use client"` too** if that demo reads a plain data export (like a `*VariantsConfig`
object) from that module — `tabs.tsx` is `"use client"` (unlike `button`/`badge`/
`empty`), and importing `tabsListVariantsConfig` from a Server Component demo file
resolved to `undefined` at render time until `tabs-demo.tsx` was marked `"use client"`
too. This is an RSC module-boundary behavior, not a bug in the config extraction
itself — watch for it if a future auto-cva component's source file is a Client
Component.

### Registering a component (the one manual step — see Definition of Done)

`apps/web/app/(static)/style-guide/_components/component-catalog.ts` is the single
manifest listing every component this page renders (`kind: "auto-cva"` or
`kind: "demo-spec"`). Adding, removing, or renaming a `packages/ui` component
requires:

1. Add/update its entry in `component-catalog.ts`.
2. If `kind: "auto-cva"`: extract its `cva()` config to a named, exported
   `*VariantsConfig` const (see `button.tsx` for the pattern) and wire it into
   `_components/auto-cva/`.
3. If `kind: "demo-spec"`: add a small file to `_components/demo-specs/` exporting
   the demo component and its copy-ready snippet string, and wire it into
   `_components/components-section.tsx`'s `DEMOS` map.

This is a **strict, blocking Definition-of-Done rule** — see the root `AGENTS.md`.

## The shadcn registry (`packages/ui/registry.json`)

Lets any project run `pnpm dlx shadcn add @kunalkeshan/<name>` to pull a component
directly from this repo's real source, using the official shadcn CLI's registry
tooling — no npm package publish, no Storybook.

- `packages/ui/registry.json` lists every component as a `registry:ui` item
  (`dependencies` for external npm packages it imports, `registryDependencies` for
  cross-component references like `pagination` → `button`), plus a `utils` item
  wrapping `lib/utils.ts`.
- `pnpm --filter ui registry:build` runs `shadcn build --output ../../apps/web/public/r`,
  writing static JSON files to `apps/web/public/r/*.json` — served automatically by
  Next.js's static file handling, no route handler needed. These generated files are
  tracked in git (not gitignored) since there's no build-time hook regenerating them
  yet.
- A consumer configures `@kunalkeshan` as
  `https://v2-kunalkeshan-dev.vercel.app/r/{name}.json` in `components.json`, then uses
  `shadcn add @kunalkeshan/button`. The `/style-guide` page includes copyable setup,
  discovery, and install commands for pnpm, npm, yarn, and bun.

**This is currently a manual step, not wired into `apps/web`'s build.** Re-run
`pnpm --filter ui registry:build` after changing `registry.json` or any registered
component's source, before deploying, if the registry needs to reflect that change.
Wiring it into `apps/web`'s build script (e.g. a `prebuild` step) is a reasonable
follow-up once the registry sees real external use, not required today.

## Related

- [`design-system.md`](./design-system.md) — the token model and component
  conventions this page renders.
- [`font-stack.md`](./font-stack.md) — the font pipeline (hand-maintained in the
  page's typography section, not parsed).
