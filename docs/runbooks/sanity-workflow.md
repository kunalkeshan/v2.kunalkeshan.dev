# Runbook: Sanity Workflow

Covers two things: (1) changing schema/queries and propagating types, (2) deploying/redeploying the Studio.

## 1. Changing a schema field or GROQ query

**This is a strict, blocking rule** (see `AGENTS.md` Definition of Done) — a task that changes a schema field or query is not done until this runbook is fully completed.

### If you changed a schema field (`apps/studio/schemaTypes/*.ts`)

1. Edit the schema file in `apps/studio/schemaTypes/`. If it's a new document type, register it in `apps/studio/schemaTypes/index.ts`'s `schema.types` array — a file existing in the directory does **not** mean it's active in the Studio.
2. If the change affects the Studio's document list ordering/grouping, update `apps/studio/structure.ts` too.

### If you changed or added a GROQ query (`packages/sanity/src/query.ts`)

1. Edit/add the query in `packages/sanity/src/query.ts`, using `defineQuery` from `next-sanity` (required for typegen to pick it up).

### Image field projections must include `hotspot`/`crop`

Every image field in this repo is rendered through `urlFor()` (`@workspace/sanity/image`, a thin `@sanity/image-url` wrapper) and, at most call sites, a fixed aspect ratio via `.width().height().fit("crop")`. `@sanity/image-url` automatically honors an editor's Studio-set focal point (hotspot) and manual crop rectangle when cropping to a fixed aspect ratio — but only if the object passed into `urlFor()` actually carries `hotspot`/`crop`.

The standard fragment for any image field is therefore:

```groq
fieldName {
  asset->,
  hotspot,
  crop,
  alt
}
```

Projecting only `{ asset->, alt }` compiles fine and still returns a working image, but silently degrades every `.fit("crop")` render to a blind center-crop — any hotspot an editor sets in Studio is discarded before it reaches the URL builder. When adding a new image field to a schema and query, copy the four-field fragment above (adding any other sibling fields, like `gallery[]`'s `caption`, as needed) rather than the shorter two-field one.

### Then, always — regenerate types

```bash
pnpm --filter studio extract   # apps/studio/schema.json
pnpm --filter studio type      # writes packages/sanity/src/sanity.types.ts
```

The `extract` script passes `--force`. Current Sanity CLI versions refuse to overwrite an
existing `schema.json` without it, and since `schema.json` is committed, every run after
the first is an overwrite — without the flag the documented command fails with
"Schema file already exists".

`sanity.cli.ts`'s `typegen` config points `generates` at `../../packages/sanity/src/sanity.types.ts` — across the workspace boundary, from `apps/studio` into `packages/sanity`. This is intentional: `apps/web` imports generated types as `@workspace/sanity/types`, and `apps/studio` never needs to consume its own generated types.

**Never hand-edit `packages/sanity/src/sanity.types.ts`.** It is regenerated wholesale on every `type` run; manual edits are silently discarded.

### Then, update every consumer in `apps/web`

Run `pnpm typecheck` — any component/query destructuring a field that changed shape will now fail to compile. Fix each one. Do not consider the change done until:

```bash
pnpm typecheck   # clean across the whole workspace
pnpm build       # apps/web and apps/studio both build
```

### Naming convention note

Sanity's typegen (as of `sanity@6.x`) names generated result types with a `_RESULT` suffix, e.g. `SITE_CONFIG_QUERY_RESULT` — not the older `SITE_CONFIG_QUERYResult` convention. Check the actual generated name in `packages/sanity/src/sanity.types.ts` rather than assuming.

As of `@sanity/client@8.x`, the generated file's `SanityQueries` type-map registration switched from `declare module "@sanity/client"` to a `declare global` block (with a back-compat `declare module` shim for older `@sanity/client` versions). This is purely a typegen implementation detail — no `apps/web` consumer references `SanityQueries` directly — but if a future typegen run produces an unexpected diff limited to this block, it's expected and not a sign of a schema/query change.

## 1a. Drag-and-drop ordering (`@sanity/orderable-document-list`)

`skill` and `service` documents are ordered by dragging them in the Studio's desk
structure, not by a manual numeric field. This is wired via
`@sanity/orderable-document-list` (`apps/studio/package.json`):

- **Schema side**: each orderable document type's schema (`skillType.ts`,
  `serviceType.ts`) imports `orderRankField`/`orderRankOrdering` from the package,
  adds `orderings: [orderRankOrdering]` to the `defineType(...)` call, and includes
  `orderRankField({ type: "<the type name>" })` as one of its `fields` entries —
  this replaces what would otherwise be a hand-rolled numeric `order` field. The
  field itself (`orderRank`, a string) is managed entirely by the plugin; never add a
  separate manual order field alongside it.
- **Structure side**: `apps/studio/structure.ts` uses
  `orderableDocumentListDeskItem({ type: "<type>", title: "<Label>", S, context })`
  in place of a plain `S.documentTypeListItem(...)` line for that type — this is what
  actually renders the draggable list pane. The structure resolver's signature
  changed from `(S) => ...` to `(S, context) => ...` to supply `context` here.
- **Query side**: sort with `order(orderRank asc)` (optionally with tiebreakers after
  it, e.g. `order(category asc, orderRank asc, name asc)` for `SKILLS_QUERY`) — same
  as any other GROQ sort, `orderRank`'s lexicographic string ordering just happens to
  produce a stable drag-order.
- **New documents created outside Studio** (e.g. via the Sanity MCP `create_documents`
  tool, not dragged into place by a human): you must set `orderRank` explicitly on
  creation, since nothing else assigns it. Generate valid sequential values with the
  real `LexoRank` algorithm — see the vendored shim referenced below rather than
  hand-typing plausible-looking strings (the format isn't a simple sortable string;
  it's base-36 lexorank notation, e.g. `"0|100000:"`, `"0|100008:"`, ...).

### The `lexorank` CJS/ESM workaround — read before touching this plugin

`@sanity/orderable-document-list`'s dependency `lexorank@1.0.5` is CommonJS-only and
unmaintained (last published 2022). Sanity Studio v6's `sanity schema extract` (and
therefore `sanity deploy`, and this repo's own `pnpm --filter studio extract`) loads
the whole config graph — including any plugin import in `structure.ts`/schema files —
in a Vite worker with `ssr.noExternal: true`, which cannot bundle a CJS-only
dependency and fails with `SchemaExtractionError: exports is not defined`. This is a
confirmed upstream bug, not a misconfiguration in this repo:
https://github.com/sanity-io/plugins/issues/2011.

The fix lives in two places:

- `apps/studio/vendor/lexorank.esm.js` — an esbuild re-bundle of the **same published
  `lexorank@1.0.5` package** (the real algorithm, not a reimplementation) as proper
  ESM with named exports. `apps/studio/vendor/README.md` has the exact regeneration
  steps if `@sanity/orderable-document-list` ever bumps its `lexorank` version.
- `apps/studio/sanity.cli.ts`'s `vite` config hook aliases the bare `lexorank` import
  to that vendored file, so every consumer (extraction, dev, build) resolves to the
  ESM version instead of the broken CJS original.

**If a future `pnpm --filter studio extract` starts failing with the same
`SchemaExtractionError: exports is not defined` error**, check first whether a
`pnpm` upgrade of `@sanity/orderable-document-list` removed the CJS `lexorank`
dependency (check `apps/studio/vendor/README.md`'s "Removing this workaround"
section) before assuming the vendored alias broke — if the upstream issue is fixed,
delete the vendor file, the `vite` hook, and this section.

## 2. Deploying the Studio

The Studio deploys to Sanity's own hosting, independent of `apps/web`/Vercel.

### First deploy (already done once for this project)

```bash
cd apps/studio
npx sanity deploy --url <hostname> --title "<title>"
```

This registers a permanent hostname (`https://<hostname>.sanity.studio`) and prints an `appId`. Save that value into `apps/studio/.env` as `SANITY_STUDIO_APP_ID` so subsequent deploys target the same Studio instead of prompting to create a new one.

This project's Studio is already live at **https://kunalkeshan.sanity.studio** with its app ID pinned in `apps/studio/.env`.

### Redeploying (normal case — schema/config changes)

```bash
pnpm --filter studio deploy
```

(Do not use bare `pnpm deploy` from the repo root — that invokes pnpm's own `deploy` command, not the Studio's `deploy` script. Always scope with `--filter studio`, or `cd apps/studio && npx sanity deploy`.)

### Auth

The Sanity CLI needs an authenticated session (`npx sanity login`, interactive OAuth) to deploy or list projects. Check current auth/project access with:

```bash
npx sanity projects list
```

If this errors or shows no projects, run `npx sanity login` interactively — this cannot be scripted non-interactively, so it must be run by a human in a real terminal.
