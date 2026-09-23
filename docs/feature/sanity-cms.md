# Sanity CMS

## What it does

Content for the portfolio site (site config, FAQs, legal documents) is authored in a standalone Sanity Studio (`apps/studio`) and consumed read-only by the Next.js site (`apps/web`) via `@workspace/sanity`.

## Schema (owned by `apps/studio`)

Defined in `apps/studio/schemaTypes/`:

- `siteConfig` — singleton: site title/description, OG/Twitter images, `logo` (navbar/footer/email branding), `favicon` (browser tab icon + Apple touch icon, see below), contact info, social links, footer legal links, the downloadable `resumePdf` file, and the footer's `rickrollAudio` easter-egg file (hidden entirely while empty, same pattern as `resumePdf`)
- `faqs` — singleton: FAQ list
- `legal` — document: legal pages (privacy policy, terms, etc.), rendered via `blockContent`
- `blockContent` — shared rich-text/portable-text array type used by `legal`
- `skill` / `service` — orderable documents powering the home strips and the `/skills` and `/services` pages
- `value` — orderable document: one core value on `/about` (`title`, `description`, `illustration`). Modelled on `service` because the shape is identical. Its own type rather than an array on `siteConfig` for two reasons: authoring an image inside an array object means expanding each row one at a time, and only a real document type gets its own `createCollectionTag("value")` — as a `siteConfig` array, editing a value would bust `collection:siteConfig`, which every route reads.
- `organization` — orderable document: a company, client, university, or student org. Its own type because organizations repeat across roles (StejasSYS, IEEE SRMIST, and Think-Digital each hold several sequential positions), so a logo or website change is a single edit.
- `person` — orderable document: someone who appears on the site, currently a testimonial author (`name`, `photo`, `position`, `organization` ref, `website`, `socials[]`). Its own type so one person can carry several testimonials without their identity being re-entered per quote — v1 stored Diveakssh Schae twice with the name, photo, company and slug duplicated. `organizationName` is a flat fallback for a company with no `organization` document of its own (a personal brand, a one-off client).
- `testimonial` — orderable document: `quote`, `author` → `person`, optional `context` (what it was about — the field that tells one person's several quotes apart), `featured`, `givenAt`. **The `quote` is quoted material and is never edited** — see the testimonials entry in `docs/content/persona-and-tone.md`; `featured` is the lever for a quote that shouldn't lead the home page.
- `experience` — orderable document: one position, referencing an `organization`. A `kind` field (`work` / `community` / `education`) covers all three shapes in one type, but the **rendering** keeps education in its own block — never interleaved into the work timeline (see `docs/content/persona-and-tone.md`).
- `publication` — orderable document: papers and patents, shown as a callout at the foot of `/resume`. Kept separate from `experience` because the fields genuinely differ (author list, DOI, venue) and a publication has no duration.
- `author`, `category`, `post` — defined but **not currently registered** in `apps/studio/schemaTypes/index.ts`'s `schema.types` array (a carry-over from an earlier blog-oriented design; not wired into the Studio UI or queried by `apps/web`)

`apps/studio/structure.ts` customizes the Studio's document list to surface the two singletons (`siteConfig`, `faqs`) at the top, followed by `legal`, then the orderable lists (`skill`, `service`, `value`, `experience`, `organization`, `person`, `testimonial`, `publication`), followed by anything else.

**`siteConfig` field groups**: note that `about` and `aboutPage` are two different surfaces. `about` (titled "About Section (Home)" in the Studio) feeds the short two-column strip on the home page; `aboutPage` feeds the standalone `/about` page, whose `aboutPageStory` is a multi-paragraph array. They were deliberately not merged — the copy lengths differ, and one group made it impossible to tell which field landed where.

**Ordering**: the orderable types use `@sanity/orderable-document-list` (`orderRankField` + `orderRankOrdering` in the schema, `orderableDocumentListDeskItem` in `structure.ts`, `| order(orderRank asc)` in GROQ). Drag order in the Studio **is** the order the site renders — for experience this is deliberately not a date sort, so professional roles can sit above community ones regardless of dates. Two gotchas: any new orderable type must also be added to the exclusion array at the bottom of `structure.ts` or it appears twice; and documents created outside the Studio (via MCP or the CLI) must set `orderRank` explicitly to a real LexoRank value, or drag-and-drop breaks for that document.

**Seeding referenced documents outside the Studio**: `create_documents` writes **drafts**, and a draft cannot satisfy a reference — pointing at one fails with `references non-existent document`. So seed in dependency order and **publish each tier before creating the next** (organizations → people → testimonials). For a bulk seed of already-final content, `npx @sanity/cli@latest dataset import <file>.ndjson` sidesteps the dance entirely by writing published documents directly.

## Queries (owned by `packages/sanity/src/query.ts`)

- `SITE_CONFIG_QUERY` / `FOOTER_LEGAL_LINKS_QUERY`
- `FAQS_QUERY`
- `LEGAL_DOCUMENTS_QUERY` / `LEGAL_DOCUMENT_BY_SLUG_QUERY`
- `FEATURED_SKILLS_QUERY` / `SKILLS_QUERY`
- `SERVICES_QUERY` / `VALUES_QUERY`
- `ABOUT_PAGE_QUERY` — the `aboutPage*` fields only, fetched **only** by `/about`. Deliberately not folded into `SITE_CONFIG_QUERY`: that query runs on every route via the shared layout, so ten about-only fields (one dereferencing a full image asset) would tax pages that never render them.
- `FEATURED_EXPERIENCES_QUERY` — work roles flagged `featured`, projecting `summary` and **not** `highlights`; the home section shows one line per role
- `EXPERIENCES_QUERY` — work + community roles in Studio order, with `organization->`, dereferenced `skills[]->`, and structured `links[]`
- `EDUCATION_QUERY` — `kind == "education"` only, fetched separately so it renders as its own block
- `PUBLICATIONS_QUERY`
- `TESTIMONIALS_QUERY` / `FEATURED_TESTIMONIALS_QUERY` — share one `TESTIMONIAL_FIELDS` fragment that dereferences `author->` and, one level further, `author->organization->` for the logo. Unlike `FEATURED_PROJECTS_QUERY` there is **no** `[0...n]` slice: the carousel shows one quote at a time behind a windowed dot indicator, so the section's footprint is constant however many are flagged — the ragged-final-row problem that justified a ceiling for the project grid doesn't arise.

All written with `next-sanity`'s `defineQuery` for typegen support.

## Consumption in `apps/web`

- `app/(static)/layout.tsx` — fetches `SITE_CONFIG_QUERY` for metadata (title/description/OG images) and passes site config + footer legal links down to `Footer`.
- `app/(static)/legal/page.tsx` and `app/(static)/legal/[slug]/page.tsx` — fetch `LEGAL_DOCUMENTS_QUERY` (index) and `LEGAL_DOCUMENT_BY_SLUG_QUERY` (detail), rendering `content` through the shared `portable-text-components.tsx`. Canonical path is singular `/legal` (`sitemap.ts` and `legalType.ts`'s own field description both say so) — `footer.tsx` already linked here; it was `sitemap.ts` that briefly drifted to a plural `/legals` before both were reconciled.
- `app/(static)/page.tsx` — fetches site config, featured skills, services, `FEATURED_EXPERIENCES_QUERY`, and `FEATURED_TESTIMONIALS_QUERY` in one `Promise.all`, rendering the condensed Experience section after About and the testimonials carousel last.
- `components/sections/testimonials.tsx` — default-exports the home section; named-exports `TestimonialsCarousel` unwrapped, the same split as `ServicesGrid`. Heading/intro copy comes from `siteConfig`'s `testimonials*` fields, not hardcoded.
- `app/(static)/resume/page.tsx` — fetches site config (for `resumePdf`), `EXPERIENCES_QUERY`, `EDUCATION_QUERY`, and `PUBLICATIONS_QUERY`. Renders `ExperienceTimeline` (grouped by organization, education in its own block), `Publications`, and `ResumeCta`. The download banner renders nothing while `resumePdf` is empty, so the page can never ship a dead link.
- `components/sections/experience.tsx` — default-exports the home section; named-exports `ExperienceTimeline` for the standalone page (same split as `ServicesGrid` in `services.tsx`). Grouping is by *consecutive* organization so Studio drag order stays authoritative.
- `lib/dates.ts` — formats Sanity `date` strings in UTC (`formatDateRange`, `formatDuration`, `spanOf`). Sanity dates are `YYYY-MM-DD`; parsing them as local time renders the previous month in timezones behind UTC.
- `app/sitemap.ts` — fetches `LEGAL_DOCUMENTS_QUERY` to generate sitemap entries for legal pages, plus static entries for `/resume`, `/skills`, and `/services`.
- `app/api/revalidate/route.ts` — webhook endpoint; validates the Sanity webhook signature (`SANITY_WEBHOOK_SECRET`) and revalidates Next.js cache tags based on the changed document's `_type`.
- `app/icon.tsx` / `app/apple-icon.tsx` — Next.js file-convention icon routes. Both fetch `SITE_CONFIG_QUERY` (literal `{ perspective: "published", stega: false }`, same build-time-only constraint as `generateMetadata`/`sitemap.ts`/`opengraph-image.tsx`) and derive their image from the single `siteConfig.favicon` asset via `urlFor(...).width().height().fit("crop")` — `icon.tsx` at 32×32, `apple-icon.tsx` at 180×180. One source image, two sizes; no separate pre-cropped fields in the Studio. Statically optimized at build time like the other icon-route conventions, and picked up by the existing `siteConfig` revalidation webhook when the image changes — no redeploy needed.
- `components/sanity/portable-text-components.tsx` — renders `blockContent` (portable text) with the site's Tailwind theme classes, including a heading-level shift (schema `h1`→ rendered `h2`, etc.) so CMS content headings never collide with the page's own `h1`.

## Revalidation model

On-demand only — tag-based, invalidated via `createCollectionTag`/`createDocumentTag` (`packages/sanity/src/cache-tags.ts`) when the Sanity webhook fires `revalidateTag` in `apps/web/app/api/revalidate/route.ts`. There is no time-based ISR polling.

The webhook itself is registered in the Sanity project dashboard (Project → API → Webhooks), pointed at the deployed `/api/revalidate` URL (both `https://v2-kunalkeshan-dev.vercel.app/api/revalidate` and, once the custom domain is live, `https://kunalkeshan.dev/api/revalidate`), firing on Create/Update/Delete for all document types with no filter, and signed with `SANITY_WEBHOOK_SECRET`.

When adding a new document type, remember it needs a `case` in the switch in `apps/web/app/api/revalidate/route.ts` as well — an unhandled type falls through to `default`, which logs a warning and revalidates nothing.

## Live preview / Visual Editing

`apps/web` uses `next-sanity`'s Live Content API (`defineLive`, `packages/sanity/src/live.ts`) for every fetch — `sanityFetch` from `@workspace/sanity/live` returns `{ data, sourceMap, tags }` rather than a raw value, and connects the rendered page to real-time content updates via `<SanityLive />` (mounted in `apps/web/app/(static)/layout.tsx`).

**Stega and draft mode**: every request-time fetch resolves its `perspective`/`stega` options dynamically via `apps/web/lib/sanity-fetch-options.ts`'s `getDynamicSanityFetchOptions()` — `stega: false, perspective: "published"` normally, switching to `stega: true, perspective: "drafts"` only while Next.js Draft Mode is enabled (i.e. only inside an active Presentation Tool preview session). Regular visitors and production builds never see stega-encoded strings. Build-time-only fetches (`generateStaticParams`, `generateMetadata`, `opengraph-image.tsx`, `sitemap.ts`, the contact API route) always pass `{ perspective: "published", stega: false }` literally instead — `draftMode()` can't be called outside a request scope, and metadata/OG/sitemap output must never carry invisible stega characters regardless.

**Draft mode routes**: `apps/web/app/api/draft-mode/enable/route.ts` (via `next-sanity/draft-mode`'s `defineEnableDraftMode`, using a Viewer-role `SANITY_API_READ_TOKEN`) and `.../disable/route.ts` (plain `draftMode().disable()`). `apps/web/components/sanity/disable-draft-mode.tsx` renders a visible exit link outside the Presentation Tool's own iframe (hidden inside it via `useIsPresentationTool()`).

**Presentation Tool**: configured in `apps/studio/sanity.config.ts` (`presentationTool` from `sanity/presentation`), with document-type → route mapping in `apps/studio/presentation/resolve.ts`. Its `previewUrl.origin` reads `SANITY_STUDIO_PREVIEW_ORIGIN`, resolved automatically per command via Sanity's `.env`/`.env.production` mode-file loading (no manual swap) — see `docs/runbooks/sanity-workflow.md`.

**Token**: `SANITY_API_READ_TOKEN` (Viewer role, read-only) is read via `packages/sanity/src/token.ts`'s `getSanityReadToken()`, which returns `undefined` rather than throwing when unset. This is deliberate: `defineLive`/the draft-mode enable route evaluate it at module scope, which Next.js runs during build-time route collection for every route (including ones that never touch draft mode, like `sitemap.ts`, since it imports `@workspace/sanity/live`) — so a missing token must never fail a build. Without it, `defineLive` just serves published content with no live/draft capability, and the enable route fails at request time (a normal Sanity API auth error) only if actually hit.

## Adding a new field or query

See [`docs/runbooks/sanity-workflow.md`](../runbooks/sanity-workflow.md) — this is a strict, blocking workflow (typegen must be regenerated and all consumers updated before the change is done).
