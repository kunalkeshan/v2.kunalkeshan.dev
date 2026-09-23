import {
  defineLocations,
  type PresentationPluginOptions,
} from "sanity/presentation";

/**
 * Maps each document type to the frontend route(s) it appears on, so the
 * Presentation Tool can navigate its preview iframe when a document is
 * opened, and offer "used on" locations the other way around.
 *
 * Lives entirely in apps/studio — packages/sanity is consumed only by
 * apps/web, and this is pure Studio-config wiring passed into
 * `presentationTool()`, never imported by apps/web.
 *
 * Route mapping confirmed against apps/web/app/(static)'s actual folder
 * structure and each page's `createCollectionTag(...)` fetch calls:
 * - `legal`, `post`, `journalEntry`, `project`, `tag` each have their own
 *   `[slug]` detail route.
 * - `siteConfig` has no route of its own — it drives the layout globally
 *   (header/footer) and the home page's hero/about copy.
 * - `skill`, `service`, `experience`, `value`, `certification`, `faqs`,
 *   `publication` only ever render as sections embedded in other pages —
 *   mapped to every page confirmed (via grep) to fetch that type's
 *   collection tag.
 * - `organization`, `person`, `testimonial` are never fetched as their own
 *   top-level collection on any page — they're only dereferenced *through*
 *   `experience`/`project`/`testimonial` documents, so they map to the pages
 *   that render whichever document embeds them.
 */
export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    legal: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: `/legal/${doc?.slug}`,
          },
          { title: "Legal index", href: "/legal" },
        ],
      }),
    }),

    post: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: `/blog/${doc?.slug}`,
          },
          { title: "Blog index", href: "/blog" },
        ],
      }),
    }),

    journalEntry: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: `/journal/${doc?.slug}`,
          },
          { title: "Journal index", href: "/journal" },
        ],
      }),
    }),

    project: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: `/projects/${doc?.slug}`,
          },
          { title: "Home", href: "/" },
          { title: "Projects index", href: "/projects" },
        ],
      }),
    }),

    tag: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: `/tags/${doc?.slug}`,
          },
        ],
      }),
    }),

    // No route of its own — drives the header/footer on every page and the
    // home page's hero/about copy.
    siteConfig: defineLocations({
      message: "Drives the header, footer, and home page on every route",
      tone: "positive",
      locations: [{ title: "Home", href: "/" }],
    }),

    skill: defineLocations({
      message: "Featured on the home page and listed on /skills",
      tone: "positive",
      locations: [
        { title: "Home", href: "/" },
        { title: "Skills", href: "/skills" },
      ],
    }),

    service: defineLocations({
      message: "Featured on the home page, /contact, and listed on /services",
      tone: "positive",
      locations: [
        { title: "Home", href: "/" },
        { title: "Contact", href: "/contact" },
        { title: "Services", href: "/services" },
      ],
    }),

    experience: defineLocations({
      message: "Featured on the home page and listed on /work",
      tone: "positive",
      locations: [
        { title: "Home", href: "/" },
        { title: "Work", href: "/work" },
      ],
    }),

    value: defineLocations({
      message: "Listed on /about",
      tone: "positive",
      locations: [{ title: "About", href: "/about" }],
    }),

    certification: defineLocations({
      message: "Listed on /certifications",
      tone: "positive",
      locations: [{ title: "Certifications", href: "/certifications" }],
    }),

    faqs: defineLocations({
      message: "Rendered on /contact",
      tone: "positive",
      locations: [{ title: "Contact", href: "/contact" }],
    }),

    publication: defineLocations({
      message: "Rendered on /work",
      tone: "positive",
      locations: [{ title: "Work", href: "/work" }],
    }),

    // Only ever dereferenced through another document, never fetched as its
    // own collection on any page.
    organization: defineLocations({
      message:
        "Referenced by experience, project, certification, and testimonial documents — no dedicated route",
      tone: "caution",
      locations: [
        { title: "Home", href: "/" },
        { title: "Work", href: "/work" },
        { title: "Projects", href: "/projects" },
      ],
    }),

    person: defineLocations({
      message:
        "Referenced by testimonial and post/journalEntry author fields — no dedicated route",
      tone: "caution",
      locations: [
        { title: "Home", href: "/" },
        { title: "Blog", href: "/blog" },
        { title: "Journal", href: "/journal" },
      ],
    }),

    testimonial: defineLocations({
      message: "Featured on the home page — no dedicated route",
      tone: "positive",
      locations: [{ title: "Home", href: "/" }],
    }),
  },
};
