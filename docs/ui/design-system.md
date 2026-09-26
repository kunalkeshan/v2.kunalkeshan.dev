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
near-black foreground — never light text on orange/yellow. `chart-*` tokens remain
placeholders. The Sidebar component's `sidebar-*` aliases map to card, foreground,
primary, muted, border, and ring tokens in both themes.

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

| Class               | Value                         | Usage                                             |
| ------------------- | ----------------------------- | ------------------------------------------------- |
| `shadow-sm`         | `2px 2px 0 0 var(--border)`   | badges, tooltips                                  |
| `shadow`            | `4px 4px 0 0 var(--border)`   | buttons/inputs at rest                            |
| `shadow-lg`         | `6px 6px 0 0 var(--border)`   | open accordions, cards                            |
| `shadow-xl`         | `8px 8px 0 0 var(--border)`   | sheets, dialogs, floating nav chrome              |
| `shadow-2xl`        | `10px 10px 0 0 var(--border)` | the hover-grow step past `shadow-xl` — see below  |
| `shadow-reverse`    | `-4px 4px 0 0 var(--border)`  | rare, directional emphasis only                   |
| `shadow-reverse-sm` | `-2px 2px 0 0 var(--border)`  | reverse-direction hover on small circular avatars |

The raw CSS var backing `shadow` is `--shadow-base`, not a bare `--shadow` — Tailwind v4
reserves `--shadow-*` as its own box-shadow theme namespace, so a bare `--shadow` raw var
would collide. `@theme inline` maps `--shadow: var(--shadow-base)` to bridge it.

**Write every one of these as the bare utility** (`shadow-sm`, `shadow`, `shadow-lg`,
`shadow-xl`, `shadow-2xl`, `shadow-reverse`, `shadow-reverse-sm`) — each is a registered
`@theme inline` key, so the named utility resolves and is what Tailwind's IDE plugin
expects. The namespace-collision note above is only about how the **raw var** is spelled
in `:root`; it does not mean these need an arbitrary `shadow-[var(...)]` form. Writing
the bracket form instead produces a `suggestCanonicalClasses` warning in the editor.
Note the `--shadow-base` raw var maps to the bare `shadow` utility, not `shadow-base` —
there is no `shadow-base` class.

**`shadow-xl` → `shadow-2xl` hover-grow pattern** (ported from v1's
`shadow-3d hover:shadow-3d-hover`): pair a resting `shadow-xl` with
`hover:shadow-2xl` plus `transition-shadow duration-press ease-snap` on **image
containers** — hero art, profile/avatar photos, a highlighted "currently active" card.
In v1 this was never applied to buttons or nav chrome, only bordered `<Image>` wrappers;
keep that boundary when porting more components. The `shadow-reverse-sm` variant is the
same idea but for small circular avatar thumbnails, paired with a resting
`shadow-reverse-sm` (not `shadow-sm`) and `hover:shadow-reverse`.

**Content-card hover — rest flat, lift on hover.** This is a _different_ pattern
from the image-wrapper one above, and the two are easy to confuse. A content card
(service card, project card — a bordered panel holding text) **rests with no
shadow at all** and gains both the lift and the shadow on hover:

The recipe lives in **`cardLift`** (`packages/ui/src/lib/utils.ts`), beside
`pressableShadow`. Import it rather than re-spelling the classes — it owns motion only,
so layout, colour and border classes stay at the call site:

```tsx
import { cardLift, cn } from "@workspace/ui/lib/utils"

const cardShell = cn(
  "group rounded-lg border-3 border-border bg-card …",
  cardLift
)
```

`cardLift` carries `translate-y-0 transform-gpu will-change-transform` alongside the
hover classes. The explicit resting `translate-y-0` is load-bearing: without a declared
start value the transform is absent at rest and the browser has nothing to interpolate
_back to_ on unhover, which reads as jank on the way out. `transform-gpu` promotes the
card to its own layer so the lift composites instead of repainting the bordered box
every frame.

Pair with `group` on the same element so the card's image scales in sympathy via
`group-hover:scale-110` (`motion-reduce:group-hover:scale-100`). This is the literal v1
behaviour — `hover:-translate-y-2 hover:shadow-3d` on the card, `group-hover:scale-110`
on the cover art, where `shadow-3d` is `8px 8px` = this repo's `shadow-xl` — and it
matches the Paperfolio reference card, which rests flat and applies both the shadow and
a -10px translate only on `:hover`.

Never combine `cardLift` with `pressableShadow`: both own `hover:translate-*` on the
same axis and would fight each other.

**`cardLiftActive` — the same lift, permanently on.** For a card that should always
read as elevated (e.g. a highlighted "Get in touch" card in a services grid) rather
than only on hover, use `cardLiftActive` instead of `cardLift`. It hardcodes the exact
same tokens as `cardLift`'s hover step (`-translate-y-2 shadow-xl`) unconditionally, so
the card stays visually consistent with its resting-hover siblings — just permanently
in that position instead of transitioning into it. It carries no `hover:`/
`motion-reduce:` logic of its own (nothing to reduce if it never moves). Never combine
`cardLiftActive` with `cardLift` or `pressableShadow` on the same element.

Why it matters: an earlier version of `services.tsx` used the image-wrapper
pairing (resting `shadow-xl` → `hover:shadow-2xl`) on its content cards. The
shadow was already present at rest, so hover only nudged it 8px → 10px and the
card read as inert — and it borrowed a pairing the section above explicitly
scopes to image wrappers. Use resting-flat → `hover:shadow-xl` for cards; use
resting-`shadow-xl` → `hover:shadow-2xl` only for bordered image wrappers.

**Never combine either pattern with `pressableShadow`** — that utility owns
`hover:translate-x-0.5 hover:translate-y-0.5` on the same axis as the card lift,
and the two transforms fight. Buttons _inside_ a card keep their own
`pressableShadow` independently; the card itself must not have it.

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
  `border-3 border-border bg-card` + `rounded-lg` treatment as any other
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
  on your own `NavigationMenuList` usage rather than changing the shared primitive's
  default — other menu styles may legitimately want `gap-0`. The current navbar uses
  `className="gap-3"`: v1 used `gap-6`, but v1's links were lighter-weight, and once the
  links went `font-bold` (see Hover-color rules below) the heavier type filled more of
  the row and `gap-6` read as too airy. Treat gap as paired with type weight, not as a
  fixed number to copy from v1.
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

- **Top-level nav links / dropdown triggers** (flat text links, "Work"/"More" triggers):
  **flat text-only — `hover:text-secondary` with no background change at all**, matching v1's
  `hover:text-portfolio-accent` (blue). An **open** dropdown trigger reads the same way
  (`data-open:text-secondary`), blue text rather than a grey chip — the open panel below it
  is already the "this menu is open" signal. These links also render `font-bold`.

  The shared `navigation-menu.tsx` primitives bake a neutral `bg-muted` chip into
  `hover:`/`focus:`/`data-open:`/`data-active:` states. **Cancelling it requires naming each
  variant** (`hover:bg-transparent focus:bg-transparent data-open:bg-transparent`, …) — a
  bare `bg-transparent` only overrides the _rest_ state and leaves every other one painting
  grey. Do this **on the nav's own usage** (`apps/web/components/layouts/desktop-nav.tsx`
  defines `navLinkClassName`/`navTriggerClassName` for exactly this), not by editing the
  shared primitive's defaults — same reasoning as the `gap-0` override note above.

  Pair the hover with `focus-visible:text-secondary`, **not** bare `focus:` — with no chip,
  bare `focus:` leaves a link stranded blue after a mouse click.

- **Dropdown panel rows** (the icon+label+description items _inside_ a Work/More panel): these
  **keep** `hover:bg-muted` (`nav-dropdown-item.tsx`). The flat/no-chip rule above is for the
  top-level nav row only — inside a panel, the chip is the row's hit-target affordance.
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

## Inverted surfaces

Every shadow in this system is a solid offset in `var(--border)`, and `--border`
is near-black in light mode. That means a section painted dark with a plain
utility (`bg-foreground`, `bg-black`, an image overlay) silently breaks every
control inside it: buttons keep their `shadow` but it
renders black-on-black and disappears, taking the press-into-shadow interaction
with it. Hairlines and focus rings fail the same way.

Every shadow resolves `var(--shadow-color)`, which defaults to `--border`. That
indirection is the whole mechanism: a surface can re-aim the cast shadow without
touching borders, hairlines or focus rings.

Use the `.on-inverted` component class instead of painting the background by
hand. It sets `--shadow-color` to the light foreground and flips the text tokens
(`--background`, `--foreground`, `--body-foreground`, `--muted-foreground`) for
its subtree. It deliberately leaves `--border` alone — a button on the panel
keeps its normal border and simply casts a light shadow, rather than turning
into an outlined variant of itself.

```tsx
<section className="on-inverted py-14 md:py-20">
  <Container>{/* buttons and text here get inverted tokens */}</Container>
</section>
```

In dark mode the page ground is already near-black, so a literal black panel
would vanish. `.on-inverted` handles this: under `.dark` the surface lifts to
the card color (`#181818`) and reads as a raised panel, while the tokens stay
as they already are.

**Nested pale cards**: a light card sitting on an inverted panel needs the page
text tokens back, or its copy inherits the panel's near-white foreground and
disappears against its own pale ground. Add `.on-surface` to that card — it
restores the text tokens _and_ puts `--shadow-color` back to the dark border
color, because a light card has to cast a dark shadow onto the panel behind it.
Inheriting the panel's light cast would paint a white shadow against a white
card and lose the depth entirely:

```tsx
<section className="on-inverted">
  <article className="on-surface border-3 border-border bg-card shadow-lg">
    …
  </article>
</section>
```

**When to use it.** `.on-inverted` is for a deliberate full-width section break
that gives one section its own weight — the home page Experience section is the
reference implementation, carried over from v1's black experience panel. It is
not for individual cards, and it should stay rare: a page that flips ground
repeatedly reads as several sites stitched together. One inverted section per
page is the working limit.

Reach for `variant="secondary"` on buttons inside an inverted panel — the blue
holds its contrast against both the dark light-mode ground and the lifted
dark-mode one, where the default orange `--primary` competes with the
highlight sweep.

## Interaction timing — the easing standard

All tokens live in `packages/ui/src/styles/globals.css` (`:root`, theme-independent —
not redefined in `.dark`).

### The rule

**Anything the user initiates decelerates only — use an `out` curve.** Hover, press,
a panel opening on click, a card lifting: the motion should begin at full speed and
ease to a stop. Motion the user did _not_ trigger (autoplay, looping, scroll-linked
progress) may use an `in-out` curve, where a soft start is honest.

This is why the original `--ease-snap: cubic-bezier(0.4, 0, 0.2, 1)` was replaced. That
is a _symmetric in-out_ curve: it eases in at the start, so a 180ms hover spent its first
frames barely moving, then accelerated, then settled — reading as sluggish and abrupt at
the same time. A hover has no "wind-up" in the physical world; it is a response, and a
response starts immediately.

### The curves

Standard Penner easings, values as published at
[coss.com/origin/easings](https://coss.com/origin/easings):

| Token                 | Value                               | Use for                                       |
| --------------------- | ----------------------------------- | --------------------------------------------- |
| `--ease-out-expo`     | `cubic-bezier(0.16, 1, 0.3, 1)`     | the default; hover, press, card lift, reveals |
| `--ease-out-quint`    | `cubic-bezier(0.22, 1, 0.36, 1)`    | slightly softer alternative to expo           |
| `--ease-out-quart`    | `cubic-bezier(0.25, 1, 0.5, 1)`     | medium decelerate                             |
| `--ease-out-cubic`    | `cubic-bezier(0.33, 1, 0.68, 1)`    | gentle, for larger travel distances           |
| `--ease-out-quad`     | `cubic-bezier(0.5, 1, 0.89, 1)`     | the subtlest; small opacity/color shifts      |
| `--ease-in-out-quart` | `cubic-bezier(0.76, 0, 0.24, 1)`    | **non-user-initiated** motion only            |
| `--ease-spring`       | `cubic-bezier(0.34, 1.56, 0.64, 1)` | overshoot; use sparingly, never on hover      |

`--ease-snap` is aliased to `--ease-out-expo`. Keep writing `ease-snap` in components —
it is the name every existing component already references, so retuning it reaches all
of them at once. Reach for a specific `ease-out-*` token only when a particular element
genuinely needs a different feel.

### Durations

`--dur-press: 300ms` and `--dur-reveal: 600ms` (Tailwind: `duration-press`,
`duration-reveal`).

Duration and curve are coupled: an out-expo curve spends most of its duration already
nearly settled, so it needs a longer clock than a linear-ish curve to read as
deliberate. At 180ms this curve looked like a jump cut. If you shorten the duration,
you must soften the curve to match (expo → quart → quad), and vice versa.

300ms is what both references land on — Paperfolio's card rule is
`transition: box-shadow .3s, transform .3s, color .3s`, and v1's cards used
`duration-300`. It is long enough for the hard shadow to visibly grow in and back out,
short enough to sweep a grid of cards without feeling laggy.

> Values written here before the token bug below was fixed (`260ms`/`420ms`, later
> `400ms`) were never actually observed in a browser: `duration-press` emitted no class
> at all, so every hover really ran at Tailwind's 150ms default. Re-tune against the
> rendered page, never against a remembered number.

### Writing it

Write the named utilities — `ease-snap`, `duration-press` — never the arbitrary bracket
form (`ease-[cubic-bezier(...)]`), which bypasses the token and triggers a
`suggestCanonicalClasses` editor warning.

Only `--ease-snap` and `--ease-spring` are registered in `@theme inline`, as literal
`cubic-bezier(...)` values. The `--ease-out-*` curves are the palette that `:root` picks
from, not utilities to reach for directly. The durations are **not** theme keys — they
are `@utility` rules at the end of `globals.css` (see the second trap below).

> **Trap 1 — a `@theme inline` key must be a literal, in `@theme` itself.**
> `@theme inline` substitutes a token's value _where it is defined_. A key that names
> the same custom property it wants to read (`--ease-snap: var(--ease-snap)`) resolves
> to itself; so does one pointing at a `:root` var that holds another `var()`. Either
> way the value is unresolvable and the declaration is dropped silently — no error, no
> warning. For a timing function that means **no easing at all**: the browser falls back
> to `ease` and motion reads as "sudden, not gradual".
>
> This shipped twice. The first fix corrected only `:root` and left
> `--ease-snap: var(--ease-snap)` in the `@theme inline` block, where it shadowed the
> now-correct `:root` literal — so the bug survived its own fix. **Writing the literal
> in `:root` is not sufficient; the `@theme inline` key must be a literal too.**

> **Trap 2 — there is no `--duration-*` theme namespace in Tailwind v4.**
> `--ease-*`, `--color-*`, `--shadow-*` and friends exist; `--duration-*` does not. A
> `--duration-press` key in `@theme inline` therefore compiles to **nothing at all** —
> not a wrong value, no class whatsoever — and every `duration-press` in the codebase
> silently falls back to Tailwind's 150ms default. Named durations must be declared as
> real utilities instead:
>
> ```css
> @utility duration-press {
>   transition-duration: var(--dur-press);
> }
> ```
>
> Reading `:root` at use time keeps `--dur-press` the single source of truth, so
> retuning it still reaches every call site at once.

> **Trap 3 — `-translate-y-*` animates the `translate` property, not `transform`.**
> Tailwind v4 composes translate/rotate/scale as _separate_ CSS properties so utilities
> don't clobber one another. `hover:-translate-y-2` therefore changes **`translate`**,
> and a `transition-[transform,box-shadow]` list does not cover it. The result is a card
> whose shadow eases over 300ms while the 8px lift **jumps instantly** — the classic
> "sudden, not gradual" hover, with the transition looking entirely correct in the
> source.
>
> Always name `translate` in the property list (keep `transform` too, for
> `transform-gpu`'s `translateZ(0)` and any composed transform):
>
> ```
> transition-[translate,transform,box-shadow]
> ```

**Verifying all three:** every one of these is invisible in the source, which looks
perfectly correct. Check the **compiled** CSS and the live computed style:

```bash
grep -o "\.duration-press{[^}]*}" apps/web/.next/static/chunks/*.css   # missing ⇒ Trap 2
grep -c -- "--ease-snap:var(--ease-snap)" apps/web/.next/static/chunks/*.css  # >0 ⇒ Trap 1
```

```js
// In DevTools, on a card element — Trap 3:
getComputedStyle($0).transitionProperty // must include "translate"
getComputedStyle($0).transitionDuration // "0.3s", not "0.15s"
```

A missing class means the utility never existed, no matter how right the source reads.
A `transitionDuration` of `0.15s` or an `ease-in-out` timing function means you are
looking at Tailwind's fallback, i.e. the token silently failed.

`pressableShadow` transitions `transform`, `box-shadow`, `background-color` and `color`
off this one pair, so changing either value retunes every button at once. Don't
introduce a bespoke duration/easing for "just this one component" — if something feels
off, it is almost always a class fighting `pressableShadow` (see the hover-color rules
above) rather than a genuine need for its own timing.

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

reused verbatim (copy-pasted, not imported) across ~15+ sections/pages. This repo's
first pass centralized that into `apps/web/lib/motion.ts` and swapped `type: "spring"`
for a fixed `duration: 0.6` + `ease-out-quint` (`cubic-bezier(0.22, 1, 0.36, 1)`) —
still driven by the `motion` package (the current name for framer-motion), just with a
deterministic, non-physics transition. That version is now itself superseded; see
below.

**Current convention: CSS-only, no animation package.** The `motion` package has been
removed from `apps/web` entirely (it was never a `packages/ui` dependency), and
`apps/web/lib/motion.ts` is deleted. Every animation in the repo — reveals, the navbar
morph, the mobile nav stagger, filter micro-interactions — is now a native CSS
`transition`/`animation`, matching the marquee (`packages/ui/src/components/marquee.tsx`
+ its `@keyframes` in `globals.css`), which was always CSS-only.

**Why this changed.** `motion/react` interpolates every animated frame with JS
(`requestAnimationFrame`), which competes with the rest of the page's JS for the main
thread — under CPU throttling (a low-end device, a busy tab, background work) those
callbacks get delayed or dropped, which reads as visible stutter. This was most
noticeable on the home hero and contact hero, which animate immediately on load,
competing with the page's other startup JS. A native CSS `transition`/`animation` runs
on the compositor instead, and stays smooth under the same conditions — this is also
mechanically how Webflow's built-in page-load interactions work (the reference point
for this migration): a small JS toggle flips a class/attribute, and the browser's own
compositor does the interpolation, not a JS render loop.

**The trigger/animation split.** React still decides *when* to reveal something — that
part didn't change conceptually, it just moved out of `motion`'s `initial`/`animate`/
`whileInView` props and into two small hooks:

- `apps/web/hooks/use-reveal.ts` — `useReveal(mode)` returns a `ref` + `state`
  (`"hidden" | "visible"`). `mode: "mount"` flips to `"visible"` shortly after mount
  (the mount-entrance case — hero, contact-hero, 404, navbar); `mode: "in-view"` uses a
  one-shot `IntersectionObserver` (the scroll-reveal case — every section that used to
  import `sectionReveal`). Spread the returned `ref`/`data-reveal={state}` onto the
  element; the CSS below owns the actual animation.

  The `"in-view"` observer uses `rootMargin: "20% 0px"`, not the bare viewport —
  without it, a fast fling on a smooth high-refresh-rate display can carry an element
  through the whole physical viewport *between* two observer samples, so it's never
  recorded as intersecting and stays stuck `"hidden"` (reported on `/projects`: the
  current-work grid stayed blank after a quick scroll to the bottom, while the archived
  grid below it — resting in view when the fling settled — revealed normally).
  Expanding the root gives every scroll several samples' worth of runway to catch the
  crossing before the element reaches the real edge.
- `apps/web/hooks/use-delayed-unmount.ts` — the one genuine gap CSS can't cover on its
  own: animating an *unmount*. Keeps an outgoing element mounted for its exit
  transition's duration before telling the caller to stop rendering it. Used by
  `FilterClearButton` and `FilterResultsTransition` (the two former `AnimatePresence`
  consumers that actually needed exit timing — `FilterSearchInput`'s icon↔spinner swap
  doesn't, since both icons can stay mounted and cross-fade via opacity with nothing to
  ever unmount).

**`apps/web/components/page-hero.tsx` — the shared static-page hero.** Every static
page's `<h1>` + intro paragraph (`/services`, `/about`, `/work`, `/skills`, `/projects`,
`/certifications`, `/legal`, `/journal`, `/blog`, `/tags/[tag]`, `/style-guide`, and the
title on each detail page — `/projects/[slug]`, `/blog/[slug]`, `/journal/[slug]`,
`/legal/[slug]`) uses `<PageHero heading={...} headingClassName={...} subtext={...}
subtextClassName={...} />` rather than a bare `<h1>`/`<p>`. It wires up the same
`useRevealGroup("mount")` + `<Reveal delay={0}>`/`<Reveal delay={0.12}>` pattern `Hero`
and `ContactHero` hand-roll for their own bespoke layouts — those two stay bespoke
because they compose more than a text pair (buttons, an image, a form); every other
static page's hero *is* just the text pair, so it's centralized here instead of
copy-pasting the same two-hook wiring across a dozen pages. `headingClassName`/
`subtextClassName` are required/optional pass-throughs, not baked-in defaults, since the
pages it replaces disagree in small, deliberate ways (`text-balance` on some, `mt-3` vs
`mt-4`, `max-w-2xl` vs none) that a shared class string would silently flatten.

The standalone `/services` page is the one case where the content *below* the hero also
joins the mount sequence: `ServicesGrid` takes an optional `mode` (default `"in-view"`,
unchanged for the home page's `Services` strip) and `delayOffset` prop, and `/services`
passes `mode="mount"` `delayOffset={0.24}` so its cards continue the hero's own delay
sequence instead of waiting on a scroll that, on that page, may never happen. No other
page's below-the-hero content (filtered grids, `PostsGrid`, etc.) was changed — they keep
whatever reveal behavior (or lack of one) they already had; only the hero text itself was
missing this pattern.

**Reduced motion is now handled entirely in CSS**, not per-component
`useReducedMotion()` checks — one `@media (prefers-reduced-motion: reduce)` block in
`packages/ui/src/styles/globals.css` (alongside the marquee's own) zeroes out every
`[data-reveal]`/`[data-reveal-sweep]`/`[data-nav-state]`/`.animate-*` transition and
animation at once. This is a strict improvement, not just a refactor: several
`sectionReveal`/`HighlightText` consumers under the old `motion` system never actually
checked `useReducedMotion()` despite the convention implying they should, so this
consolidation newly (and correctly) covers them too.

**The CSS contract** (all in `packages/ui/src/styles/globals.css`, modeled on the
marquee's existing `@keyframes`/`@utility` pattern):

- `[data-reveal="hidden"]` / `[data-reveal="visible"]` — the direct replacement for
  `sectionReveal`/`heroReveal`: `opacity`/`translateY(20px)` → `opacity: 1`/
  `translateY(0)`, transitioning over `var(--dur-reveal)` (600ms) with
  `var(--ease-out-quint)` — the same duration/curve the old `motion` transition used.
  Add the `reveal-delay-200` utility class for the 200ms delay scroll-reveals had
  (`sectionRevealTransition`'s `delay: 0.2`); mount reveals have none, same as before.
- `[data-reveal-fade]` — opt-in fade-only variant (add alongside `data-reveal`) for a
  reveal wrapping a `position: sticky` descendant. Animating `transform` leaves a
  non-`none` value on the element mid-transition, which creates a new containing block
  and silently breaks `position: sticky` for anything inside it — this is the direct
  replacement for the old `heroRevealNoTransform` variant (`ContactHero`, the navbar).
- `[data-reveal-sweep]` — the `HighlightText` highlighter stroke: `scaleX(0)` →
  `scaleX(1)` from a fixed `transform-origin: left`, same timing as the reveal above.
- `--ease-circ-out` — one deliberate one-off token (`cubic-bezier(0, 0.55, 0.45, 1)`,
  motion/react's old named `"circOut"`) for the resume-cta expanding rings
  (`.animate-resume-cta-ring`), which never used the shared reveal curve.
- `.animate-role-fade-in` / `.animate-nav-item-in` — `@keyframes`-based, for effects
  that retrigger or stagger rather than fire once: the hero's rotating role text
  (restarted by changing the element's `key`, same as before) and the mobile nav
  sheet's per-item stagger (`--stagger-index` custom property drives
  `animation-delay`, replacing `staggerChildren`/`delayChildren`).
- `[data-nav-state="default"]` / `[data-nav-state="scrolled"]` — the navbar
  scroll-morph. `packages/ui/src/hooks/use-scroll.ts` is unchanged (it already
  returned a plain hysteresis-debounced boolean, no motion dependency); the old
  `enter`/`default`/`scrolled` `motion.nav` variants collapse to two states here,
  since `enter`'s only difference from `default` was the mount-in opacity, which
  `[data-reveal-fade]` already owns.
- `[data-transition-state]` — consumed by `useDelayedUnmount`'s `entering`/`visible`/
  `exiting` states; set `--transition-duration` inline to match the duration passed to
  the hook (CSS can't read a JS constant, so these are kept in sync manually — see the
  two consumers for the exact values, 150ms/180ms).
- Chip tap feedback (`FilterChipGroup`, previously `whileTap={{ scale: 0.96 }}`) is a
  plain `active:scale-96` Tailwind utility now, gated by `motion-reduce:` the same way
  `cardLift` is elsewhere in this codebase — no wrapper element needed at all.

Still no dedicated page-transition/route system — that remains genuinely out of scope
until a real cross-route transition is actually requested.

## `InputGroup` — icon-decorated inputs (`@workspace/ui/components/input-group`)

For a text input with a leading/trailing icon (a search icon, a submit button, a clear
button, …), the icon(s) must be flex children of the same element that carries
`pressableShadow`/the border/the shadow — never absolutely positioned against a
separate wrapper that the input itself moves independently of.

**Why this is a dedicated primitive and not a per-usage pattern.** An earlier version of
the blog/journal post-sidebar search box (`apps/web/components/blog/post-sidebar.tsx`)
put `pressableShadow` on the `Input` itself (via the base `Input` primitive) while the
search icon and the arrow-icon submit button were absolutely positioned against a
separate `<form className="relative">` wrapper. `pressableShadow`'s hover/press
translate moved the `<input>` element, but the icons — anchored to the stationary form
— didn't move with it, so the icons visibly lagged behind the input box on hover, press,
and while typing. `packages/ui/src/components/combobox.tsx`'s `ComboboxInputGroup`
already had the correct version of this (border/shadow/`pressableShadow`/focus ring on
the outer wrapper, icon and input as plain flex children inside it), so `InputGroup`
generalizes that same shape for plain (non-Combobox) text inputs.

- `InputGroup` — the wrapper. Owns `border-2 border-input`, the shadow scale,
  `pressableShadow`, and `focus-within:` (not `focus-visible:`) ring classes, since
  focus lands on the inner `InputGroupInput`, not the wrapper itself. Renders a
  `<div>` by default; pass `asChild` (backed by Radix `Slot`) to render as a `<form>`
  when the group needs to submit.
- `InputGroupInput` — a thin `<input>` with no border/shadow/focus classes of its own
  (`flex-1`, transparent background, `outline-none`) — those live on the wrapper.
- `InputGroupIcon` — a `shrink-0 text-muted-foreground` flex child for a leading or
  trailing icon (a `SearchIcon`, a loading spinner swap, …).
- `InputGroupClear` — a real `<button type="button">` rendering a `lucide-react`
  `XIcon`, shown conditionally by the consumer once there's a value. Prefer this over
  a bare `type="search"` input's native browser clear button: the native one can't be
  restyled or repositioned to match this design language, and doesn't render at all in
  Firefox. Use `type="text"` on `InputGroupInput`, not `type="search"`, once a custom
  clear button is present — otherwise both affordances can render at once.

The base `Input` primitive (`packages/ui/src/components/input.tsx`) is unaffected and
stays correct for any input without sibling icons (form fields, standalone search boxes
with no icon chrome). `InputGroup` is additive, the same way `ComboboxInputGroup` sits
alongside the base `Input` rather than replacing it.

Both `apps/web/components/blog/post-sidebar.tsx` (search icon + arrow-icon submit
button) and `apps/web/components/filters/filter-search-input.tsx` (search icon that
swaps for a loading spinner) use `InputGroup` — the reference implementations for a
submit-driven vs. an instant-filter icon input, respectively.

### Shared filter-bar components (`apps/web/components/filters/`)

`/blog`, `/journal`, `/projects`, and `/skills` each had their own copy-pasted
search-input + `Badge` chip-toggle + "Clear filters" markup (identical `chipClass`
Tailwind string included) before this was extracted. All four now share:

- `FilterSearchInput` — search icon swaps for a spinner while `isPending` (driven by
  the caller's `useTransition`, wired into nuqs' `startTransition` option), instead of
  separate loading chrome. Both icons stay mounted, absolutely stacked, and cross-fade
  via a plain CSS `transition-opacity` — no unmount ever happens, so this doesn't need
  `useDelayedUnmount`.
- `FilterChipGroup` — a `selectionMode: "single" | "multiple"` chip toggle. Chips press
  into their own shadow on click/tap (a plain `active:scale-96` CSS rule, gated by
  `motion-reduce:`, plus the existing `duration-press`/`ease-snap` hover styles) rather
  than using a new spring-based motion language for a small, frequent control.
- `FilterClearButton` — fades + slides in/out only when a filter is active, using
  `apps/web/hooks/use-delayed-unmount.ts` (see "Motion / animation conventions" above)
  to keep the exit transition mounted long enough to actually play.
- `FilterResultsTransition` — crossfades the whole results block when filters change
  (sequenced fade-out → child swap → fade-in via a small `setTimeout`, since `children`
  itself changes shape between keys — there's no persistent DOM node to cross-fade),
  instead of animating individual card enter/exit/reorder — a filtered grid can reflow
  column count between queries, which makes per-card position animation unreliable.

Reduced motion for all four is handled by the global `[data-reveal]`/
`[data-transition-state]` CSS media query (see "Motion / animation conventions"
above), not a per-component JS check.

`skills-filtered.tsx` was migrated from local `useState` to `nuqs` URL state as
part of this extraction, so all four screens now share the same "filters live in
the URL" behavior (shareable, survives back/forward) — see `projects-filtered.tsx`
and `post-listing-controls.tsx`'s doc comments for why URL state was already
preferred over client-only state on the other three.

## Highlight text sweep (mandatory for section-heading highlights)

Every section heading that highlights a phrase (an inline colored-background span
inside an `<h1>`/`<h2>`) **must** use `apps/web/components/highlight-text.tsx`'s
`HighlightText` component — never a bare `<span className="bg-primary px-1 ...">`.
This was established during the Services/Skills build (the first two sections to ship
highlighted headings) and is a going-forward requirement for any future section with a
highlighted title, not just those two.

The reasoning: a solid highlight span that just fades in with the rest of the heading
reads as inert — it's colored text, not a highlight. The intended effect is a real
highlighter stroke: the color sweeps in left-to-right across the phrase, once, the
first time the heading scrolls into view.

```tsx
<h2 className="mb-6 font-heading text-2xl font-black sm:text-3xl">
  Modern problems, require{" "}
  <HighlightText variant="primary">modern services</HighlightText>
</h2>
```

- `variant="primary"` (orange) or `variant="secondary"` (blue) — pick whichever one
  the _other_ nearby highlighted heading on the same page/flow isn't using. v1 alternated
  `bg-portfolio-main`/`bg-portfolio-accent` across sections (confirmed via
  `kunalkeshan.dev`'s `tailwind.config.js`: `main: "#ffa500"`, `accent: "#1C92FF"` —
  the same hex pairs as this repo's `--primary`/`--secondary`) rather than making every
  highlight the same color; keep that alternation rather than defaulting every new
  section to `primary`.
- **Mechanism**: an absolutely-positioned `span` (the color fill) sits behind a
  relatively-positioned text span, animating `transform: scaleX(0 → 1)` from a fixed
  `transform-origin: left` so it grows from the left edge — not a `width`/`clip-path`
  animation, which would be more expensive to composite for the same visual result.
  Triggered by `apps/web/hooks/use-reveal.ts`'s `"in-view"` mode (once-only, same
  `IntersectionObserver` every other scroll-reveal in this repo uses) via the
  `[data-reveal-sweep]` CSS rules in `packages/ui/src/styles/globals.css` — same
  duration/curve/delay as the heading's own reveal, so the sweep reads as part of the
  same reveal moment rather than a second, disconnected animation competing for
  attention. See "Motion / animation conventions" above for the full CSS contract.
- Lives in `apps/web/components/*` (not `packages/ui`) — no package-boundary reason
  now that this is plain CSS + a hook rather than a motion-package component, but it
  stays app-local since nothing outside `apps/web` needs it yet; promote it under the
  same "genuinely shared vs. app-local" test as any other `apps/web` utility if a
  second app ever does.

## Anchor clearance under the fixed navbar

The navbar is `position: fixed`, so it sits outside normal flow and an `#id` jump would
land the target underneath it.

**This is handled once, globally**, by `scroll-padding-top` on `html` in
`packages/ui/src/styles/globals.css` — `6rem` on mobile, `7rem` from `md` up, against a
navbar that measures 62px tall plus a 16px top offset.

**Do not add `scroll-mt-*` to new sections.** That was the previous approach and it had
drifted to three different values across eight sections while being missing entirely from
others, so `/#services` landed under the navbar while `#about` sat 222px below it. A
single scroll-padding rule also covers what a scroll-margin utility cannot: programmatic
`scrollIntoView()` calls and keyboard sequential-focus navigation.

Keep the two values in sync with the navbar if its height or offset changes. A section
may still set a local `scroll-mt-*` when a particular heading needs extra breathing room —
the global rule is the floor, not a ceiling.

## Illustrated card layout (values grid reference)

The `/about` values grid is the reference for cards that pair a stock illustration with
copy. It was first built with v1's side-panel layout and then rebuilt — the reasoning is
worth keeping, because the same trap applies to any future illustrated card.

- **Don't put a variable-aspect illustration in a fixed panel.** The original layout gave
  each card a 180×316 tinted side panel. The source SVGs range from 0.86:1 to 1.44:1, so
  they rendered 84–135px tall inside it, leaving **181–232px of empty tint per card** —
  and the panel took width the copy needed. Placing the art inline above the copy at a
  **fixed height with `w-auto`** normalizes wildly different source ratios into one
  consistent visual weight without any cropping, and hands the full card width back to
  the text.
- **Left-align the art with the text column** (`items-start` on the card body), not
  centered. A centered illustration above left-aligned copy reads as two unrelated
  elements.
- **Use a column flow, not a grid, when the copy lengths are uneven and fixed.** The
  values copy ranges from ~190 to ~385 characters, and it is not editable (v1 values are
  protected by `docs/content/persona-and-tone.md`). CSS grid offers only two bad answers
  to that: stretching to a shared row height pads every short card in the row with
  trailing dead space, and `items-start` leaves ragged holes _between_ rows, which reads
  as broken rather than as rhythm in a 3-up layout. `columns` removes the dilemma — with
  no rows to align, each card ends at its own copy and the next packs directly beneath
  it, so the variance becomes vertical flow. Pair with `break-inside-avoid` on the items.
  This also shortened the section by ~200px.
  **Only reach for this when the copy genuinely can't be evened out** — for content you
  control, matching the copy lengths is the better fix and a plain grid is simpler.
- **Keep a real step between section and card headings.** The cards originally used
  `text-2xl` (24px) under a `text-3xl` (30px) section heading — too close, so the grid
  read flat and was hard to scan. Card headings sit at `text-lg`/`md:text-xl`.
- Cards use `cardLift` (rest flat, lift on hover) with `group` driving
  `group-hover:scale-110` on the art, plus a `motion-reduce:` reset. `origin-left` on the
  image keeps that zoom anchored to the text column.

## Image loading priority (`next/image`, above-the-fold sections)

**Every `next/image` that can render within the initial viewport on common
desktop/laptop heights needs `priority`.** This is not limited to the very first
section on a page — Next's own LCP detection measures the actual rendered viewport at
build/runtime, not "is this the first `<Image>` in the JSX." On the home page, both
`Hero` and `About` render at the same identical size (`width={1433} height={1956}`)
and `About` sits close enough beneath `Hero` that it lands inside the fold on a typical
laptop screen — `next dev`'s console warned that `About`'s image (not `Hero`'s) was the
one actually measured as the Largest Contentful Paint element, because only `Hero`'s
had `priority` set.

**When adding or editing a section that renders near the top of a page:**

- Check what actually sits above the fold at a real desktop viewport height (not just
  "is my section first"), not only the hero/first section.
- Set `priority` on that `<Image>` — it maps to `loading="eager"` +
  `fetchPriority="high"`, so the browser requests it immediately instead of waiting for
  it to scroll into view.
- Leave every image genuinely below the fold on `loading="lazy"` (the `next/image`
  default) — marking everything `priority` defeats the hint and delays real LCP
  candidates behind unnecessary eager requests.
- If in doubt, run the page once with `next dev` and check the browser console: Next
  logs exactly which `<Image>` it measured as LCP and whether it's missing the eager
  hint — don't guess from the JSX order alone.

`about-story.tsx` (the `/about` page's own portrait) and `not-found-content.tsx`
already set `priority` correctly. The Carousel section below documents a related but
distinct case — which _slide_ images get eager loading in a component that mostly
renders off-screen content.

## Marquee (`@workspace/ui/components/marquee`)

The continuously scrolling band, used on `/about` for the featured-skills ticker.
Ported from `kunalkeshan.dev` v1's `SkillsInText`.

- **Pure CSS, and deliberately so.** No `"use client"`, no hooks, no event handlers —
  which keeps it a Server Component that adds nothing to the client bundle. This is
  also a hard constraint rather than a preference: `packages/ui` has zero
  motion-package dependency (see the note under "Highlight text sweep"), so a
  `motion/react` implementation could not live in this package at all. `pauseOnHover`
  is a CSS `:hover` rule for the same reason.
- **Why the keyframe is `-50%`, not `-100%`.** The component renders its children
  **twice**, side by side, and translates the track by half its own width. That lands
  copy 2 exactly where copy 1 began, so the loop restart is pixel-identical and
  invisible. v1 rendered the content once and ran `0% → -100%`, which scrolled the band
  to empty before snapping back — a visible jump every cycle. **The `-50%` in
  `globals.css` and the two copies in `marquee.tsx` are one mechanism; changing either
  alone reintroduces the gap.**
- **`linear` is correct here, and is the one place in this system that does not use
  `ease-snap`.** The easing tokens are for user-initiated motion that decelerates into
  place. This is continuous ambient motion, and any easing curve would make the band
  visibly surge and slow once per cycle.
- **Reduced motion is handled in CSS**, not per-call-site, so every consumer inherits it
  and no call site can forget. The band stops rather than hiding — the text stays
  readable and the layout is unchanged.
- **Accessibility**: the duplicate copy is `aria-hidden`, so the content is announced
  once. Give the wrapping landmark an `aria-label` at the call site.
- **Rotating the band**: put the rotation on a wrapper, never on the animated track —
  Tailwind v4 emits `rotate` separately from `transform`, and the keyframe owns
  `transform`. Pair a rotated band with an overshoot (`w-[120%]` + a centered negative
  translate) so the tilt doesn't expose triangular gaps at the corners, and clip it with
  **`overflow-x-clip`, not `overflow-hidden`** — the latter creates a scroll container
  and will silently break any `position: sticky` ancestor elsewhere on the page.
- Speed is set per call site via `durationSeconds`, which the component writes to
  `--marquee-duration`.

## Carousel (`@workspace/ui/components/carousel`)

Embla-backed, adapted from shadcn/ui. The testimonials section on the home page is the
reference implementation. Embla is not a motion library, so `packages/ui`'s
no-motion-dependency rule is intact.

**Why a real carousel rather than swapping a card's props.** Every slide is a persistent
DOM node laid out side by side and moved with one CSS transform. That is the whole point:
v1's testimonial section re-rendered a single card with new props and **no `key`**, so the
`<img>` kept its DOM node and had its `src` re-pointed. React repainted the text
synchronously while the browser decoded the new image asynchronously — the quote changed
and the portrait arrived late. With one node per slide that desync is structurally
impossible, not merely animated over.

**Image loading.** Don't eagerly load every slide. Give the active slide's image
`priority`, mark its immediate neighbours `eager`, and leave the rest `lazy` — the
distance is measured around the loop so slide 0's "previous" neighbour is the last slide.
Costs ~3 images on load instead of one per slide.

**Deviations from upstream shadcn, all deliberate:**

- **Arrows go through `Button`**, so they inherit `pressableShadow` and the focus ring
  instead of the stock `rounded-full` outline treatment.
- **The root is `tabIndex={0}`**, so arrow keys work after tabbing onto the carousel —
  upstream only responds while a nav button holds focus. `Home`/`End` jump to the ends,
  and typing in a focused input is left alone.
- **Wheel support is added.** Embla handles pointer drag but ignores the wheel entirely,
  so shift+wheel and a trackpad's horizontal swipe did nothing on a visibly horizontal
  control. Registered natively (`{ passive: false }`) because React's `onWheel` is passive
  and cannot `preventDefault` the browser's own horizontal scroll.
- **The wheel gate is per-gesture, not a time debounce.** A trackpad flick emits a
  decaying burst of events for up to ~1s; a short debounce lets the tail fire a second
  advance (the carousel visibly skips a slide) and a long one swallows a deliberate second
  swipe. So: fire once, then stay locked until the wheel has been quiet for ~140ms, with a
  sharp re-acceleration treated as a genuine new swipe since momentum only ever decays.
- **The `reInit` listener is actually removed on cleanup.** Upstream registers an inline
  arrow for `reInit` and only ever detaches `select`, leaking a listener per remount.
- **`CarouselContent` takes `viewportClassName`** for when slide content deliberately
  overhangs its slide (see below).

**Content that overhangs its slide.** The testimonial portrait overlaps its card's right
edge. Three rules make that work:

1. **Overlap, don't displace.** Position the overhanging element `absolute` over the card.
   Negative margins on an in-flow child instead pull the card's own borders inward to meet
   it, which visibly breaks the card open. Reserve the space it covers with padding
   (`lg:pr-80`) so the copy never runs underneath.
2. **Clip on one axis only.** `viewportClassName="overflow-x-clip overflow-y-visible"` —
   plain `overflow-hidden` shaves the circle off at the slide boundary, and
   `overflow-visible` leaks neighbouring slides into view. Prefer `overflow-x-clip` over
   `overflow-x-hidden` for the same reason the marquee does: `hidden` creates a scroll
   container and silently breaks `position: sticky` ancestors.
3. **Clip again further out.** The section carries `overflow-hidden` so the overhang can
   never widen the page into a horizontal scrollbar.

**Auto-height for uneven content, with a per-breakpoint floor.** The migrated quotes span
334–975 characters (2.9x). A naive self-sizing card changes height discontinuously on every
slide change and shoves the page around mid-read — but a *fixed* height sized for the
longest quote (the section's original approach) left the shortest quotes sitting in a mostly
empty box, which reads as a layout bug rather than a design choice.

The fix: measure the active slide's own natural content height (`useActiveSlideHeight` in
`testimonials.tsx`, a `ResizeObserver` re-pointed at whichever slide is selected — every
slide stays mounted since Embla pages by transform, not by swapping DOM nodes) and animate
a wrapping `[data-testimonial-height]` element's `height` to match on every slide change
(`--dur-reveal`/`--ease-out-quint`, in `globals.css`, switched off under
`prefers-reduced-motion` alongside every other transition in that file). The wrapper is
`overflow-y-hidden` so off-screen slides that are naturally taller don't inflate it — that's
invisible anyway since they're already clipped out of the horizontal viewport.

A small `min-h-*` floor per breakpoint still exists, but no longer to contain the longest
quote — auto-height already handles that, growing the card past its floor for anything
longer, same as before. The floor exists only where something else needs a minimum: at
`lg`/`xl` the portrait is `absolute`, not stacked in flow, so it doesn't contribute to the
card's own height at all, and the card there is `block` rather than `flex`, so
`justify-center` has nothing to center against — a floor close to the portrait's own size
lets a short quote leave the portrait overhanging the card top/bottom by a little (already
this design's language, not a new effect) instead of sitting in a mostly-empty box. Below
`lg` the portrait is in flow and always contributes to height directly; the floor there only
guards against a pathological one-liner looking collapsed. (Contrast the values grid above,
where the fix for uneven copy is a column flow; that works because those cards tile, and
carousel slides don't.)

**Don't let the clip box cut off an intentional overhang.** The quote badge and the `lg`/
`xl` portrait are both `absolute`, so neither contributes to `el.offsetHeight` — measuring
only the card's own box and clipping flush to it (as above) silently cut off both decorative
elements' overhang, since the wrapper's top/bottom edges landed exactly where the card's did.
The fix: mark both elements `data-testimonial-overhang`, and have `useActiveSlideHeight`
measure how far each one's `getBoundingClientRect()` extends past the card's own on the top
and bottom. `TestimonialSlides` then grows `[data-testimonial-height]`'s own box by that
amount — but pairs each side's added `padding` with an equal negative `margin` on the same
side, so the box is tall enough to contain the overhang without shifting the card (or
anything before/after it in flow) on screen. Below `lg`, where the portrait sits in flow and
never overhangs, this measures ~0 for it and the wrapper behaves exactly as it did before —
no breakpoint branching needed.

**Dot indicators must be windowed** (`@workspace/ui/components/carousel-dots`). A
dot-per-slide row is fine at ten and unusable at a hundred. `CarouselDots` renders a
fixed-width window (default 5) that slides with the active index, shrinking only the
dots at an edge that is actually hiding slides, plus an `n / total` counter for absolute
position. The control's width is constant regardless of slide count.

**No autoplay on long-form content.** Testimonials run to ~975 characters; advancing the
card out from under someone mid-sentence is hostile, and moving content that can't be
paused is an accessibility problem.

**`align: "center"`, not `"start"`.** With one slide per view and a card whose right
margin is asymmetric (it reserves room for the portrait's overhang), `start` lets Embla
settle _between_ two snap points — the carousel rests showing ~60% of one slide and ~38%
of the next. `center` makes every rest position a whole slide.

## Sizing logos of mixed aspect ratios

A row of company logos is never a set of matching squares: expect anything from a 1:1
roundel to a ~3:1 wordmark. Sizing the `<img>` itself — a fixed height, a max-width cap,
or both — makes each logo's rendered size depend on its own proportions, and they come out
wildly inconsistent. Capping both axes is worse than either alone: a wide mark hits the
width cap, which scales its height back down until it reads as a stamp.

**Give every logo an identical fixed box and let it fit inside.** A `relative` wrapper at
the target size, `<Image fill>`, and `object-contain`. A wide mark then spends the width, a
square one spends the height, and both occupy the same box. Make the box wider than tall
(`h-10 w-28` / `md:h-12 md:w-36` on the testimonial card) so a wordmark isn't the one that
suffers. Request the URL at 2x the CSS box with `fit=max` via `logoUrlFor`
(`@workspace/sanity/image`), which scales down to fit without padding back out.

**What CSS cannot fix: padding baked into the asset.** Several logo files park the mark in
a square canvas with a wide margin around it. That margin is pixels — indistinguishable
from artwork — so such a logo renders optically smaller than a tight crop beside it, in any
box. **Sanity's image API has no auto-trim parameter** (`w`/`h`/`dpr`/`fit`/`crop`/`rect`/
`bg`/`pad` and the filters; `rect` needs exact per-asset coordinates). Fix it in the asset:
crop the margin out of the source file, or set a tight crop in the Studio.

## Email templates carry a separate, hand-maintained color mirror

`packages/emails/src/_theme/colors.ts` hardcodes a hex copy of this file's light-mode
`:root` tokens (background/foreground/primary/border/etc.), for use in the HTML emails
sent by `apps/web/app/api/contact/route.ts`. Email clients cannot read CSS custom
properties, so `colors.ts` can't `@import` or otherwise derive from this file — it has to
be updated by hand whenever the `:root` palette above changes. See
`docs/runbooks/contact-form.md` for the full email-package layout.

## Related

- [`font-stack.md`](./font-stack.md) — font loading convention and the `font-heading` →
  `--font-serif` (Montserrat) wiring.
- [`contact-form.md`](../runbooks/contact-form.md) — the `@workspace/emails` package and
  its hand-maintained color mirror.
