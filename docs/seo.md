# SEO / AEO / GEO

Covers structured data (JSON-LD), canonical URLs, the sitemap/robots setup, per-document
`noindex`, and `llms.txt`. **This is a strict, blocking rule** (see `AGENTS.md` Definition
of Done) — a new or changed public-facing page/route is not done until it follows this
doc.

## Structured Data (JSON-LD)

Every public-facing page renders schema.org JSON-LD via a shared Server Component — never
`next/script` for this (Next's own docs warn against it for JSON-LD: it's structured data,
not executable JS, and has known issues serializing dynamic JSON-LD into the RSC flight
payload).

- `apps/web/components/shared/json-ld.tsx` exports `JsonLd<T extends Thing>({ data }: {
  data: WithContext<T> })`, a generic Server Component rendering a native `<script
  type="application/ld+json">` with `dangerouslySetInnerHTML={{ __html:
  JSON.stringify(data).replace(/</g, "\\u003c") }}` — this exact escaping guards against
  Sanity free-text fields (titles, descriptions) containing `<`.
- `apps/web/lib/structured-data.ts` centralizes all schema.org object construction as pure
  `build*JsonLd(...)` functions, each consuming data already fetched for that page's normal
  rendering — never issue a new Sanity fetch solely for JSON-LD.
- Types come from `schema-dts` (Google's official TypeScript types for schema.org), a
  devDependency — compile-time only, no runtime cost.
- **TypeScript rigor is non-negotiable on this surface — no `any`, no untyped object
  literals.** Every `build*JsonLd` function's return type is explicitly `WithContext<T>`
  from `schema-dts`. Input parameters are typed from the generated Sanity query-result types
  (`@workspace/sanity/types`), never hand-typed/duplicated shapes. If a type error surfaces
  when wiring a new page, fix the data mapping — `as any`/`as unknown as X` are not
  acceptable escape hatches here. `pnpm typecheck` is what actually enforces this.
- JSON-LD objects are built and rendered **inside the page component itself** (not
  `generateMetadata`, which is metadata-only and cannot emit arbitrary markup).
- Every `build*JsonLd` function must omit a schema.org property entirely when its Sanity
  source is null/empty — never emit `null`/`""`/`[]` for a property key, so emitted JSON-LD
  stays valid per schema.org's "missing = unknown" semantics.
- **When adding any new public-facing page, ship it with appropriate JSON-LD structured
  data before shipping**, following this pattern.

### Current type mapping

| Page(s) | Type(s) |
|---|---|
| `/` | `WebSite` + `Person` |
| `/about` | `Person` + `ProfilePage`, `BreadcrumbList` |
| `/blog/[slug]`, `/journal/[slug]` | `Article`, `BreadcrumbList` |
| `/projects/[slug]` | `CreativeWork`, `BreadcrumbList` |
| `/services` | `Service` (one per offering), `BreadcrumbList` |
| `/contact` | `FAQPage` (from the `faqs` singleton), `WebPage`, `BreadcrumbList` |
| `/projects`, `/blog`, `/journal`, `/work`, `/skills`, `/certifications`, `/tags/[tag]` | `CollectionPage`, `BreadcrumbList` |
| `/legal`, `/legal/[slug]`, `/style-guide` | `WebPage`, `BreadcrumbList` |

Picking a type for a page that doesn't fit the table: prefer the closest matching
schema.org type over inventing a custom one, and default to `WebPage` when nothing fits
better (see `buildWebPageJsonLd` in `structured-data.ts`).

## Site base URL

The single source of truth for the site's own base URL is the
`NEXT_PUBLIC_SITE_URL` env var (validated via `@workspace/env/client`, see
`apps/web/env.sample`) — never a hardcoded domain literal anywhere in `apps/web` or
`packages/*`.

- **Server code** (route handlers, Server Components, plain lib files like
  `apps/web/lib/structured-data.ts`) should go through `apps/web/config/site.ts`'s
  `SITE_CONFIG.URL`, which additionally prefers Vercel's auto-injected
  `VERCEL_PROJECT_PRODUCTION_URL` over `NEXT_PUBLIC_SITE_URL` when present (so
  Vercel preview/production deployments resolve automatically without a matching
  manual env var update).
- **Client Components** that need the base URL (e.g. the `/style-guide` page's
  shadcn-registry instructions) can't use `SITE_CONFIG.URL` — `VERCEL_PROJECT_PRODUCTION_URL`
  is server-only — so they import `env` from `@workspace/env/client` directly and
  read `env.NEXT_PUBLIC_SITE_URL`.

Adding a new absolute-URL consumer: reach for `SITE_CONFIG.URL` (server) or
`env.NEXT_PUBLIC_SITE_URL` (client) first, and only fall back to prop-drilling a
server-computed URL into a client component (see `shareUrl` in the blog/journal
detail pages) when the value also needs data unavailable to `@workspace/env/client`.

## Canonical URLs

Every page-level `metadata`/`generateMetadata` sets `alternates: { canonical: "<path>" }`
(a relative path — it resolves against `metadataBase`, set once in the root
`app/layout.tsx` from `SITE_CONFIG.URL`). This includes the home page (`page.tsx` in
the `(static)` route group), which previously had no `metadata` export at all.

**Filterable/paginated listing pages** (`/blog`, `/journal`, `/tags/[tag]` — all support
`?q=`/`?tag=`/`?page=`) canonicalize to the clean, unfiltered URL always, regardless of the
current query params — the filtered variants are duplicate content and must never
self-canonicalize to their own query-string URL.

## Per-document `seo` object (Sanity)

A shared `seo` object type (`apps/studio/schemaTypes/seoType.ts`) is embedded on `post`,
`journalEntry` (both via `writingFields.ts`), `project`, and `legal` — the document types
with their own detail page. Two fields:

- `metaTitle` — optional `<title>` override. `generateMetadata` uses
  `doc.seo?.metaTitle || doc.title || "<fallback>"`.
- `noindex` — boolean. When true:
  - `generateMetadata` sets `robots: { index: false, follow: true }`.
  - The document is excluded from its `sitemap.ts` chunk (see below).

Adding `seo` to another document type follows the same three-step pattern: add the field
(`type: "seo"`), add `seo { metaTitle, noindex }` to its GROQ query, run typegen (see
`docs/runbooks/sanity-workflow.md`), then wire both into that document's `generateMetadata`
and sitemap entry.

## Open Graph images

Every dynamic detail page (`/blog/[slug]`, `/journal/[slug]`, `/projects/[slug]`) always
ships a working `og:image`/`twitter:image` — either a manual per-document override, or an
auto-generated branded card, never nothing. The site-wide default
(`(static)/layout.tsx`, from `siteConfig.ogImage`/`twitterImage`) follows the same
raster-format rule below, but has no generated-card fallback of its own — it's the last
resort under everything else here.

**The pattern, per collection:**

- **`post`/`journalEntry`** (`writingFields.ts`) have a dedicated `ogImage` field, separate
  from `coverImage`, for a manual social-image override. `generateMetadata` in
  `blog|journal/[slug]/page.tsx` uses it when set; when it's *not* set, the `images` key is
  **omitted from the returned object entirely** (never present-but-`undefined`) so Next.js's
  file-convention `opengraph-image.tsx` for that route segment fills in automatically. That
  file always renders a generated card via the shared `renderWritingOgImage` template
  (`apps/web/lib/og/writing-og-image.tsx`) — title, tags, date, reading time, no thumbnail.
- **`project`** has no manual override field — its `opengraph-image.tsx` is *always*
  reached, unconditionally, and `generateMetadata` never sets an `images` key at all. Its
  template (`apps/web/lib/og/project-og-image.tsx`, `renderProjectOgImage`) additionally
  composites the project's actual thumbnail (`coverImage`, or `icon` as a smaller fallback)
  into the card — a screenshot/logo is more identifying for a project than it would be for a
  post, and rendering through `next/og`'s `ImageResponse` guarantees PNG output regardless of
  what format the source asset happens to be (see below).

**Adding a new Sanity collection with its own detail page** should follow the `project`
half of this pattern unless it also needs a manual per-document override (in which case,
follow the `post`/`journalEntry` half instead): a route-level `opengraph-image.tsx` that
always generates a card, and `generateMetadata` that never sets `openGraph.images`/
`twitter.images` at all.

**Force a raster format on every Sanity-derived OG/Twitter image URL** — append
`.format("jpg").quality(85)` (or another raster format) to the `urlFor(...)` chain
whenever its result feeds an `og:image`/`twitter:image` tag, or an `<img>` inside a
generated card. A source asset can be an SVG (a logo, an illustration) and Sanity's image
API does **not** rasterize one just because width/height/crop params are present — the
response keeps `content-type: image/svg+xml` unless a format is explicitly forced. Most
social crawlers (WhatsApp, Facebook, X/Twitter, LinkedIn, iMessage) silently drop an
`og:image` that resolves to SVG, producing a blank link-preview image with no error
anywhere — this is exactly what broke `/projects/[slug]` before the fix documented here.
This rule applies everywhere a Sanity image feeds a social-image tag, not just inside a
generated card — including the sitewide default in `(static)/layout.tsx`.

## Sitemap

`apps/web/app/sitemap.ts` is split **per collection** via Next's native
`generateSitemaps()` — not a single handler fetching all five Sanity collections on every
request. Each id (`static`, `projects`, `posts`, `journal`, `tags`, `legal`) becomes its
own route at `/sitemap/<id>.xml`. This keeps two things bounded independently as content
grows:

- Google's 50,000-URL-per-sitemap-file limit — per-collection chunking means each
  collection would need to individually reach that limit, not the site as a whole.
- Request cost / cache-tag invalidation: a new post only touches the `posts` chunk (tagged
  `collection:post`), not projects/journal/tags/legal too.

**Next does not synthesize a combined `/sitemap.xml` index for this pattern — and the exact
`/sitemap.xml` path is itself reserved by the convention**, so a manual Route Handler there
fails the build ("Conflicting route and metadata at /sitemap.xml"). The real index lives at
`/sitemap-index.xml` (`apps/web/app/sitemap-index.xml/route.ts`), a hand-built
`<sitemapindex>` XML file per the Sitemaps protocol, listing every chunk. `next.config.ts`
redirects `/sitemap.xml` → `/sitemap-index.xml` (308) so any tool/crawler that hardcodes the
conventional path still reaches real content, and `app/robots.ts`'s `sitemap` field points
at `/sitemap-index.xml`.

The `static` chunk covers hardcoded top-level routes that aren't a Sanity collection (`/`,
`/about`, `/work`, ...). Every other chunk filters out documents with `seo.noindex === true`
and derives `lastModified` from real Sanity dates (`_updatedAt`, or `publishedAt` for
posts/journal where that's the more meaningful date) via a shared `mostRecentDate()`
helper — never build-time `new Date()`.

`SITEMAP_IDS`/`SitemapId` are defined once in `apps/web/lib/sitemap-ids.ts` and imported by
both `sitemap.ts` and `robots.ts`/`sitemap-index.xml/route.ts` so the three files can't
drift out of sync.

Adding a new Sanity collection with its own detail pages: add a new id to `SITEMAP_IDS`, a
corresponding `async function <name>Entries()` in `sitemap.ts` following the existing
pattern, and a case in the default export's `switch`.

## robots.txt

`apps/web/app/robots.ts` — wildcard `userAgent: "*", allow: "/", disallow: ["/api/"]`. No
named AI-crawler-specific rules (GPTBot, ClaudeBot, PerplexityBot, etc.) — the wildcard
already permits them, and there's no current reason to treat any of them differently.

## `llms.txt`

`apps/web/app/llms.txt/route.ts` — a dynamic route (not a static file), Sanity-sourced at
request time the same way `sitemap.ts` is (published perspective, no stega). Follows the
emerging (not yet standardized) `llms.txt` convention: a short intro, links to the key
static pages, and a handful of the most recent posts/featured projects — a curated
Markdown index, not a full content dump. Keep it that way when extending it; resist the
urge to inline full post bodies.

## Validation

- View source (or `curl`) on a representative page and confirm the expected
  `<script type="application/ld+json">` block(s) and `<link rel="canonical">`.
- [Google Rich Results Test](https://search.google.com/test/rich-results) / [schema.org
  validator](https://validator.schema.org/) against a deployed URL.
- `curl <site>/sitemap.xml` — confirm the 308 redirect to `/sitemap-index.xml`, then confirm
  the index lists all six chunks and each chunk returns real entries.
- `curl <site>/llms.txt` and `curl <site>/robots.txt`.
- In Studio, toggle a document's `seo.noindex` on and confirm it drops out of its sitemap
  chunk and the page's rendered `<meta name="robots">` shows `noindex`.
- `curl -s <page-url> | grep -oE '<meta property="og:image"[^>]*>'` — confirm the URL it
  points at resolves with `content-type: image/png` or `image/jpeg` (never `image/svg+xml`),
  and that a dynamic detail page's tag points at its own `/opengraph-image` route rather
  than a raw `cdn.sanity.io/...` asset URL when there's no manual override set.
