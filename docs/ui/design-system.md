# Design System (Neobrutalism)

`packages/ui`'s tokens and shadcn components implement a neobrutalist visual language:
thick borders, hard single-color offset shadows (no blur), a "press into shadow"
interaction, an orange primary + blue secondary, and heavy Montserrat display type.

## Source of truth

Values originate from a Claude Design MCP project, "Neobrutalism Design System"
(`https://claude.ai/design/p/93bfe40b-2353-4165-8053-ea8960c5d2e6`), pulled manually into
this repo's token files and components as a one-time reference read — not an ongoing
sync. `/design-sync` is a separate, opposite-direction workflow (pushes local files _to_
a Claude Design project) and does not apply here; there is no automated sync step to run
after editing tokens or components.

## Token naming: `--main` → `--primary`

The source design system names its brand color `--main`/`--main-foreground`. This repo
keeps shadcn's existing `--primary`/`--primary-foreground` names instead — every
component (and every future shadcn-registry component) already references `bg-primary`,
`text-primary-foreground`, etc., and renaming would break that ecosystem contract for no
benefit. When diffing this repo against the MCP source, mentally map `--main` →
`--primary`.

The source also has no separate "accent" concept. `--accent`/`--accent-foreground` are
aliased to the same values as `--muted`/`--foreground` — accent surfaces look identical
to muted ones in this design language, differentiated by border/shadow rather than a
distinct hue.

## Full token table

| Tailwind key             | Light                | Dark             |
| ------------------------ | -------------------- | ---------------- |
| `--background`           | `#FAF9F6`            | `#0B0B0B`        |
| `--foreground`           | `#0B0B0B`            | `#F1F0EE`        |
| `--card` / `--popover`   | `#FFFFFF`            | `#181818`        |
| `--primary`              | `#FFA500`            | `#FFA500`        |
| `--primary-foreground`   | `#0B0B0B`            | `#0B0B0B`        |
| `--secondary`            | `#1C92FF`            | `#1C92FF`        |
| `--secondary-foreground` | `#FFFFFF`            | `#0B0B0B`        |
| `--muted` / `--accent`   | `#F1F0EE`            | `#242424`        |
| `--muted-foreground`     | `#6B6B6B`            | `#9A9A9A`        |
| `--success`              | `#00E07B`            | `#00E07B`        |
| `--warning`              | `#FFB800`            | `#FFB800`        |
| `--destructive`          | `#FF4D4D`            | `#FF6B6B`        |
| `--border` / `--input`   | `#0B0B0B`            | `#F1F0EE`        |
| `--ring`                 | `#1C92FF`            | `#FFA500`        |
| `--overlay`              | `rgba(11,11,11,.55)` | `rgba(0,0,0,.7)` |
| `--body-foreground`      | `#393939`            | `#C7C7C7`        |

All status colors (`success`/`warning`/`destructive`) and `primary` pair with a
near-black foreground — never light text on orange/yellow. `chart-*`/`sidebar-*` tokens
are out of scope for this pass (no chart/sidebar components exist yet) and keep their
placeholder values.

`--body-foreground` was ported from `kunalkeshan.dev` v1's `themes.txt_secondary`
(`#393939`) during the navbar port. It's distinct from `--muted-foreground`
(`#6B6B6B`/`#9A9A9A`) — `--muted-foreground` means de-emphasized/disabled/placeholder
content, while `--body-foreground` is v1's actual default color for subtitles and
paragraph body copy under headings (darker/more present than muted, lighter than the
full `--foreground` used for headings themselves). Use `text-body-foreground` for
hero subtitles, section intros, card body paragraphs — anywhere v1 used
`text-themes-txt_secondary`. The dark-mode value (`#C7C7C7`) wasn't in v1 (v1 had no
dark mode) — it was chosen to sit between `--foreground` and `--muted-foreground` in
dark mode the same way `#393939` sits between them in light mode; revisit if it reads
too light/dark once real body copy exists to check it against.

## Border widths

Bare `border` = 2px everywhere (controls: buttons, inputs, badges), via
`--default-border-width: 2px` set in `@theme inline`. **This override only affects the
bare `border` utility** — a color-only class like `border-input` or `border-border` with
no explicit width utility renders with **no visible border at all**. Always pair a
color class with an explicit width: `border-2 border-input`, not just `border-input`.
Containers (cards, panels, sheets, dialogs) use explicit `border-3` (Tailwind's built-in
numeric scale, no custom key needed). Never use a 1px border anywhere in this language.

## Shadow scale

Solid, single-color, offset shadows only — no blur, no spread, color always equals
`--border` (so shadows invert automatically in dark mode).

| Class                               | Value                         | Usage                                             |
| ----------------------------------- | ----------------------------- | ------------------------------------------------- |
| `shadow-sm`                         | `2px 2px 0 0 var(--border)`   | badges, tooltips                                  |
| `shadow`                            | `4px 4px 0 0 var(--border)`   | buttons/inputs at rest                            |
| `shadow-lg`                         | `6px 6px 0 0 var(--border)`   | open accordions, cards                            |
| `shadow-xl`                         | `8px 8px 0 0 var(--border)`   | sheets, dialogs, floating nav chrome              |
| `shadow-2xl`                        | `10px 10px 0 0 var(--border)` | the hover-grow step past `shadow-xl` — see below  |
| `shadow-[var(--shadow-reverse)]`    | `-4px 4px 0 0 var(--border)`  | rare, directional emphasis only                   |
| `shadow-[var(--shadow-reverse-sm)]` | `-2px 2px 0 0 var(--border)`  | reverse-direction hover on small circular avatars |

The raw CSS var backing `shadow` is `--shadow-base`, not a bare `--shadow` — Tailwind v4
reserves `--shadow-*` as its own box-shadow theme namespace, so a bare `--shadow` raw var
would collide. `@theme inline` maps `--shadow: var(--shadow-base)` to bridge it. Same
reasoning applies to `shadow-2xl`/`shadow-reverse-sm` — reference them as
`shadow-[var(--shadow-2xl)]` / `shadow-[var(--shadow-reverse-sm)]` in Tailwind classes
rather than expecting a bare utility name, consistent with `shadow-reverse`.

**`shadow-xl` → `shadow-2xl` hover-grow pattern** (ported from v1's
`shadow-3d hover:shadow-3d-hover`): pair a resting `shadow-xl` with
`hover:shadow-[var(--shadow-2xl)]` plus `transition-shadow duration-(--duration-press)
ease-(--ease-snap)` on **image containers** — hero art, profile/avatar photos, a
highlighted "currently active" card. In v1 this was never applied to buttons or nav
chrome, only bordered `<Image>` wrappers; keep that boundary when porting more
components. The `shadow-reverse-sm` variant is the same idea but for small circular
avatar thumbnails, paired with a resting `shadow-[var(--shadow-reverse-sm)]` (not
`shadow-sm`) and `hover:shadow-[var(--shadow-reverse)]`.

## `pressableShadow` — the "press into shadow" interaction

Exported from `packages/ui/src/lib/utils.ts`. Rest state carries the full shadow;
hover nudges 2px toward it and shrinks to `shadow-sm`; active/disabled/loading fully
collapse the offset and shadow to zero. Apply it (via CVA `compoundVariants`, see
`button.tsx`) only to solid/bordered interactive controls — never to `ghost`/`link`
button variants, and never to static containers like cards.

## Radius scale

`--radius-sm: 4px`, `--radius-base: 6px` (Tailwind `rounded-md`), `--radius-lg: 10px`
(Tailwind `rounded-lg` and up), `--radius-pill: 999px` (`rounded-4xl`). Corners stay
tight — nothing above 10px except pills.

## Focus ring convention

`focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2
focus-visible:ring-offset-background` on every focusable component. Never a thin 1px
ring, never missing the offset (the offset keeps the ring visible outside the element's
own hard shadow).

## Color-never-alone rule

Status (success/warning/destructive) must always pair with an icon or text label, not
rely on hue alone, for accessibility (WCAG 1.4.1). This is a content/usage guideline for
whoever builds pages against these components — not something enforced in the component
code itself.

## Known deviations from the MCP source

- **Accordion toggle**: the source spec shows a rotating `+`/`×` box that inverts
  foreground/background on open. This repo's `accordion.tsx` keeps the original chevron
  icon swap instead, to limit risk in this pass. Revisit if/when the boxed-card accordion
  gets more visual polish.
- **`--radius` generic alias**: `sonner.tsx` (a third-party library, not our own
  component) reads a bare `var(--radius)` in an inline style. Rather than hunt down every
  such external consumer, `:root`/`.dark` keep one generic `--radius: var(--radius-base)`
  alias purely for this interop case. Don't add more generic aliases beyond this one
  justified exception — internal components should always reference the specific
  `--radius-sm`/`--radius-base`/`--radius-lg`/`--radius-pill` tokens.
- **Tooltip surface**: the MCP source's own showcase doesn't specify tooltip colors in
  detail; this repo's `tooltip.tsx` uses the `--popover`/`--popover-foreground` pair (the
  same surface as dropdowns/selects) rather than an inverted foreground/background
  scheme, so it reads as one consistent "floating surface" language across
  tooltip/select/dropdown rather than tooltips looking like a different, inverted
  component.

## Navbar / floating-chrome reference

Applies to any fixed/sticky floating container (navbars, floating toolbars, command
bars) — not just the current navbar.

- **Corner radius:** always `--radius-lg` (10px, Tailwind `rounded-lg`+). This was
  ported from `kunalkeshan.dev` v1, whose navbar pill and its icon button both measured
  `border-radius: 12px` in production (confirmed via computed styles) — visually a
  rounded rectangle, never a true pill/stadium shape. **Do not use `--radius-pill` on a
  floating nav container or its buttons** — that was tried once during this port and
  produced a capsule shape that reads as noticeably more rounded than the source
  design. `--radius-pill` stays reserved for things that are actually circular/pill by
  intent (avatars, true pill badges) — the shared `Logo` component
  (`packages/ui/src/components/logo.tsx`) is the one correct user of `rounded-full`
  here, since v1's logo is a circular photo.
- **Border + shadow:** `border-3 border-border` + `shadow-xl` for the outer floating
  container, matching the card/sheet elevation tier in the Shadow scale table above —
  v1's navbar shadow (`8px 8px 0 0 rgb(11,11,11)`) is what `shadow-xl` already encodes
  in this repo's tokens.
- **Dropdown panels** (e.g. a nav item's expandable menu): reuse the same
  `border-3 border-border bg-card` + `rounded-(--radius-lg)` treatment as any other
  card-tier surface, plus `shadow-lg`. Note this repo's navbar dropdowns intentionally
  render richer than v1's — v1's own "More" dropdown was a bare `border-2` panel with
  **no icons, no per-item descriptions, and no shadow at all** (plain two-column text
  links). The current icon+label+description card style is a deliberate upgrade over
  that, not a literal port — if a future navbar-style component is added, default to
  this richer style rather than v1's plainer one unless told otherwise.
- **Contact/icon buttons living in nav chrome:** solid `bg-foreground text-background`
  (true inverted foreground, matching v1's solid black-in-light-mode button) rather than
  `bg-primary`/`bg-secondary` — this is chrome, not a content-level call-to-action, but
  it still gets a `--primary` **hover** state (see below).
- **Nav item spacing:** the shared `NavigationMenuList` primitive
  (`packages/ui/src/components/navigation-menu.tsx`) defaults to `gap-0` — that default
  is correct for menus that rely on internal item padding, but it reads as cramped for a
  v1-style flat link row. When building a nav bar from this primitive, override the gap
  on your own `NavigationMenuList` usage (`className="gap-6"` is what the current navbar
  uses, matching v1's `gap-6` exactly) rather than changing the shared primitive's
  default — other menu styles may legitimately want `gap-0`.
- **Pill container width vs. content:** a floating pill that's wider than its content
  needs reads as loose/uncertain; v1's navbar pill is `max-w-3xl` (48rem) for 5 flat
  links + one dropdown. Size a new floating nav's `max-w` to roughly that ratio for a
  similar link count, don't default to a much larger `max-w` "for breathing room" — it
  produces dead space between the logo and the nav links under `justify-between`, not a
  more spacious feel.

## Hover-color rules (v1-derived)

v1's navbar used exactly two non-neutral hover colors, confirmed via computed styles on
the live site — neither color is used as a resting-state fill anywhere in the navbar,
only as a hover accent:

- **Nav links / dropdown triggers** (flat text links, "Work"/"More" triggers): add
  `hover:text-secondary` (and `focus:text-secondary` on plain links) alongside whatever
  neutral `hover:bg-muted` the component already has — v1 used `hover:text-portfolio-accent`
  (blue) with no background change; this repo keeps the neutral background hover from the
  shared primitives too rather than replacing it, so hover gets both a bg and text-color
  change.
- **Solid icon/CTA buttons in chrome** (e.g. the navbar's contact button): add
  `hover:bg-primary hover:text-primary-foreground` — v1 used `hover:bg-portfolio-main`
  (orange) with a **white** icon, but this repo's Color-never-alone/contrast rule (see
  above) requires primary/orange to always pair with a near-black foreground, never
  white. `text-primary-foreground` (`#0B0B0B`) is the correct swap, not v1's literal
  white — this is an intentional accessibility deviation from the source, not a mistake.
  Don't add a translate/lift transform alongside a button that already uses
  `pressableShadow` (see below) — the two hover-transform rules can conflict since
  `pressableShadow` already owns `hover:translate-*`.

## Neutralizing a primitive's built-in surface when you supply your own

Some Base UI–derived primitives in this package (ported from a reference shadcn
registry block) render their own default chrome — background, border-radius, a subtle
`ring-1 ring-foreground/10`, a small box-shadow — meant for consumers who use the
primitive _without_ a custom wrapper. `NavigationMenuPositioner`'s inner `Popup` element
(`navigation-menu.tsx`) is the current example: it originally always rendered
`rounded-lg bg-popover shadow ring-1 ring-foreground/10`, and when a consumer (like
`desktop-nav.tsx`) also renders its own bordered `<div>` inside `NavigationMenuContent`,
the two surfaces stack and produce a visible double-outline/ghost-ring artifact around
the intended hard border.

**The fix belongs in the shared primitive, not a per-usage override**, when every
current consumer supplies its own styled wrapper: strip the primitive's own
background/border/shadow classes down to layout-only (position, size, transform,
transition) and let the wrapping `<div>` be the sole visible surface. Only reach for a
per-usage `className` override (e.g. `rounded-none! bg-transparent! shadow-none!`) if
some _other_ consumer still relies on the primitive's default look — in that case the
override belongs on the specific usage that wants to opt out, not on the primitive.
When something looks like a stray outline or double border and a straightforward
`className` change doesn't remove it, use `getComputedStyle()` on the actual DOM
ancestor chain (dropdown/portal content in particular often renders outside the
triggering element's own subtree) rather than guessing at which class is responsible.

## Interaction timing: `--ease-snap` / `--dur-press`

Both live in `packages/ui/src/styles/globals.css` (`:root`, theme-independent — not
redefined in `.dark`) and back every `pressableShadow` consumer (every solid/bordered
Button variant, and any future component that opts into the same utility). Current
values: `--ease-snap: cubic-bezier(0.4, 0, 0.2, 1)` (the widely-used "standard" Material
ease — fast start, gentle settle) at `--dur-press: 180ms`. These were tuned once during
the navbar port after the original `cubic-bezier(0.2, 0.8, 0.2, 1)` at `120ms` read as
too abrupt/janky when a hover simultaneously changes transform, shadow, _and_ color —
`pressableShadow` transitions all three (`transform,box-shadow,background-color,color`)
off this one pair of tokens, so changing either value here retunes every button's hover
feel at once. Don't introduce a second timing pair for "just this one button" — if
something feels off, it's almost always because a class is fighting `pressableShadow`
(see the hover-color rules above) rather than needing its own duration/easing.

## Motion / animation conventions

`kunalkeshan.dev` v1 (Pages Router, Framer Motion `^8.5.5`) had **no shared animation
module** — every section hand-rolled an identical inline snippet:

```tsx
<motion.section
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2, type: "spring" }}
  viewport={{ once: true }}
>
```

reused verbatim (copy-pasted, not imported) across ~15+ sections/pages, with one
staggered variant (`delay: 0.4`) used only for the navbar's own entrance. There was no
page-transition system at all (`pages/_app.tsx` rendered `<Component {...pageProps} />`
directly, no `AnimatePresence`, no route keying) — each page's _content_ animating in on
mount was the only thing that ever read as a "transition." No custom easing curves or
duration constants existed outside framer-motion's own spring defaults.

**This repo's convention going forward — a deliberate improvement, not a literal port:**

- Use the `motion` package (the current name for framer-motion; see
  `apps/web/package.json`) — never `next/font`-style ad-hoc per-file reinvention of the
  same values.
- **Section reveal-on-scroll** keeps v1's exact values as the default (they're a good,
  proven baseline) but centralizes them in `apps/web/lib/motion.ts`
  (`sectionReveal` variants + `sectionRevealTransition` + `sectionRevealViewport`) —
  `initial="hidden" whileInView="visible" variants={sectionReveal}
transition={sectionRevealTransition} viewport={sectionRevealViewport}`. Import from
  there instead of inlining the object literals per component. If a second app ever
  needs the same section-reveal pattern, promote this file to
  `packages/ui/src/lib/motion.ts` (same "genuinely shared vs. app-local" test used for
  `packages/ui/src/hooks`) — don't duplicate it into a second app-local copy.
  `apps/web/components/layouts/footer.tsx` is the working reference implementation —
  copy its `motion.footer` wrapper (and its `"use client"` directive, required for any
  component using `motion.*`) for new sections rather than re-deriving the pattern.
- **Scroll-driven navbar morph + mount entrance** (see
  `apps/web/components/layouts/navbar.tsx`): `useScroll` (a small hysteresis-based
  scroll-position hook, `packages/ui/src/hooks/use-scroll.ts`) drives a `motion.nav`
  between **named `variants`** — `enter` (mount-only: `opacity: 0, y: -20`, at the
  `default` shape), `default`, and `scrolled` — rather than raw inline objects computed
  per render. `initial="enter"`, `animate={scrolled ? "scrolled" : "default"}`,
  transitioning with `springTransition` from `apps/web/lib/motion.ts`
  (`stiffness: 200, damping: 20, mass: 0.6`, no second timing pair — see the button
  hover-timing note above for why that matters). **Use named variants, not ad-hoc
  merged objects, for any `motion` component with more than one animated state**: an
  early version of this navbar built `initial`/`animate` by hand-spreading plain
  objects per render (`{ opacity: 1, ...shapeProps }`), and because one variant defined
  a `y` transform the other never explicitly reset, the entrance intermittently got
  stuck mid-animation instead of settling — `variants` avoids this because every named
  state declares its full property set. Always gate this kind of animation behind
  `useReducedMotion()` (from `motion/react`) and fall back to `initial={false}` /
  `{ duration: 0 }` — see the navbar for the exact pattern.
- Still no dedicated page-transition/route system — that remains genuinely out of scope
  until a real cross-route transition is actually requested; don't add
  `AnimatePresence`-around-`{children}` speculatively.

## Related

- [`font-stack.md`](./font-stack.md) — font loading convention and the `font-heading` →
  `--font-serif` (Montserrat) wiring.
