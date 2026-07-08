# Design System (Neobrutalism)

`packages/ui`'s tokens and shadcn components implement a neobrutalist visual language:
thick borders, hard single-color offset shadows (no blur), a "press into shadow"
interaction, an orange primary + blue secondary, and heavy Montserrat display type.

## Source of truth

Values originate from a Claude Design MCP project, "Neobrutalism Design System"
(`https://claude.ai/design/p/93bfe40b-2353-4165-8053-ea8960c5d2e6`), pulled manually into
this repo's token files and components as a one-time reference read — not an ongoing
sync. `/design-sync` is a separate, opposite-direction workflow (pushes local files *to*
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

| Tailwind key | Light | Dark |
|---|---|---|
| `--background` | `#FAF9F6` | `#0B0B0B` |
| `--foreground` | `#0B0B0B` | `#F1F0EE` |
| `--card` / `--popover` | `#FFFFFF` | `#181818` |
| `--primary` | `#FFA500` | `#FFA500` |
| `--primary-foreground` | `#0B0B0B` | `#0B0B0B` |
| `--secondary` | `#1C92FF` | `#1C92FF` |
| `--secondary-foreground` | `#FFFFFF` | `#0B0B0B` |
| `--muted` / `--accent` | `#F1F0EE` | `#242424` |
| `--muted-foreground` | `#6B6B6B` | `#9A9A9A` |
| `--success` | `#00E07B` | `#00E07B` |
| `--warning` | `#FFB800` | `#FFB800` |
| `--destructive` | `#FF4D4D` | `#FF6B6B` |
| `--border` / `--input` | `#0B0B0B` | `#F1F0EE` |
| `--ring` | `#1C92FF` | `#FFA500` |
| `--overlay` | `rgba(11,11,11,.55)` | `rgba(0,0,0,.7)` |

All status colors (`success`/`warning`/`destructive`) and `primary` pair with a
near-black foreground — never light text on orange/yellow. `chart-*`/`sidebar-*` tokens
are out of scope for this pass (no chart/sidebar components exist yet) and keep their
placeholder values.

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

| Class | Value | Usage |
|---|---|---|
| `shadow-sm` | `2px 2px 0 0 var(--border)` | badges, tooltips |
| `shadow` | `4px 4px 0 0 var(--border)` | buttons/inputs at rest |
| `shadow-lg` | `6px 6px 0 0 var(--border)` | open accordions, cards |
| `shadow-xl` | `8px 8px 0 0 var(--border)` | sheets, dialogs |
| `shadow-[var(--shadow-reverse)]` | `-4px 4px 0 0 var(--border)` | rare, directional emphasis only |

The raw CSS var backing `shadow` is `--shadow-base`, not a bare `--shadow` — Tailwind v4
reserves `--shadow-*` as its own box-shadow theme namespace, so a bare `--shadow` raw var
would collide. `@theme inline` maps `--shadow: var(--shadow-base)` to bridge it.

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

## Related

- [`font-stack.md`](./font-stack.md) — font loading convention and the `font-heading` →
  `--font-serif` (Montserrat) wiring.
