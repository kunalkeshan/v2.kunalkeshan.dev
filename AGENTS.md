<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Repo Conventions

This is `v2.kunalkeshan.dev`, a personal portfolio site built as a Turborepo monorepo. It is currently a solo project (`apps/web` + `apps/studio`) but may grow additional apps/sub-projects over time — conventions here should scale to that, not assume a single app forever.

See `CLAUDE.md` for the full architecture, workflow, and Definition of Done. This file exists for agent tooling that reads `AGENTS.md` specifically; the content is the same source of truth.

## Definition of Done Checklist

Before considering any change complete:

- [ ] `pnpm typecheck` passes for every affected package/app
- [ ] `pnpm build` succeeds for every affected app
- [ ] **If a Sanity schema field or GROQ query changed** (`apps/studio/schemaTypes/**`, `apps/studio/structure.ts`, or `packages/sanity/src/query.ts`): typegen was regenerated (`pnpm --filter studio extract && pnpm --filter studio type`) and every consumer of the changed type/query in `apps/web` was updated to match. This is a **strict, blocking rule** — never mark a task done with stale generated types. See `docs/runbooks/sanity-workflow.md`.
- [ ] UI components reuse `@workspace/ui` primitives rather than redefining them locally
- [ ] New/restyled components in `packages/ui` follow the token model and conventions in `docs/ui/design-system.md` (border widths, shadow scale, radius scale, focus rings) rather than inventing ad-hoc values
- [ ] Fonts are sourced from `@workspace/ui/lib/fonts` (`rootBodyClassName`), never loaded inline in an app's `layout.tsx`
- [ ] New env vars are added to the relevant package's `env.sample`/`.env.example` and, if validated, to `packages/env/src/{client,server}.ts`
- [ ] Relevant `docs/` file updated for new workflows, features, or architectural changes (see `docs/README.md` for where things live)
- [ ] No secrets committed (`.env*` stays gitignored; only `env.sample` files are tracked)

## Production Gates (lightweight, portfolio-scoped)

Unlike a multi-tenant SaaS, this repo does not need enterprise-grade compliance gates (backward-compat shims, Sentry triage, dependency SBOM review). It does keep:

- **Security basics (OWASP-lite)**: no secrets in code, sanitize/validate any user input (e.g. webhook signature verification in `apps/web/app/api/revalidate/route.ts`), no `dangerouslySetInnerHTML` without justification, keep dependencies reasonably current.
- **Accessibility**: this is explicitly a bar to hold, not skip. Semantic HTML, labeled form fields (via `@workspace/ui/components/form`), sufficient color contrast in `packages/ui/src/styles/globals.css` theme tokens, keyboard-navigable interactive elements, `alt` text on all Sanity-sourced images.

If a change touches either area non-trivially, call it out explicitly when reporting the change as done.
