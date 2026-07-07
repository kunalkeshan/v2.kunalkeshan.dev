# Runbook: Sanity Workflow

Covers two things: (1) changing schema/queries and propagating types, (2) deploying/redeploying the Studio.

## 1. Changing a schema field or GROQ query

**This is a strict, blocking rule** (see `AGENTS.md` Definition of Done) — a task that changes a schema field or query is not done until this runbook is fully completed.

### If you changed a schema field (`apps/studio/schemaTypes/*.ts`)

1. Edit the schema file in `apps/studio/schemaTypes/`. If it's a new document type, register it in `apps/studio/schemaTypes/index.ts`'s `schema.types` array — a file existing in the directory does **not** mean it's active in the Studio.
2. If the change affects the Studio's document list ordering/grouping, update `apps/studio/structure.ts` too.

### If you changed or added a GROQ query (`packages/sanity/src/query.ts`)

1. Edit/add the query in `packages/sanity/src/query.ts`, using `defineQuery` from `next-sanity` (required for typegen to pick it up).

### Then, always — regenerate types

```bash
pnpm --filter studio extract   # apps/studio/schema.json
pnpm --filter studio type      # writes packages/sanity/src/sanity.types.ts
```

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
