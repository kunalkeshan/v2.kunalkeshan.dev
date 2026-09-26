import { defineField, defineType } from "sanity";
import { ProjectsIcon } from "@sanity/icons/Projects";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

/**
 * `kind` describes the *engagement*, not the client.
 *
 * A single "Client work" value was rejected during planning because it flattens
 * three genuinely different things: Zion Taxi / Innkraft / Culinex are full-time
 * product work at StejasSYS, the one21.ai suite is contract, and Hzel Brown /
 * Dr. Nidhi are independent freelance builds. Labelling employer product work as
 * "client work" reads as freelance-for-hire and misrepresents the role.
 *
 * The employer itself is never retyped here — it comes from `relatedExperience`,
 * and `experience` already stores `employmentType`, so the full-time/contract
 * distinction keeps one source of truth.
 */
export const PROJECT_KINDS = [
  { title: "Professional", value: "professional" },
  { title: "Freelance", value: "freelance" },
  { title: "Personal", value: "personal" },
  { title: "Open source", value: "open-source" },
  { title: "Research", value: "research" },
  { title: "College", value: "college" },
] as const;

export const PROJECT_STATUSES = [
  { title: "Live", value: "live" },
  { title: "In development", value: "in-development" },
  { title: "Unlaunched", value: "unlaunched" },
  { title: "Archived", value: "archived" },
] as const;

export const PROJECT_LINK_TYPES = [
  { title: "Live site", value: "live-site" },
  { title: "Repository", value: "repo" },
  { title: "Google Play", value: "play-store" },
  { title: "App Store", value: "app-store" },
  { title: "Case study", value: "case-study" },
  { title: "Video", value: "video" },
  { title: "Paper", value: "paper" },
] as const;

// Shared by `githubRepo` and `additionalRepos[].repo` so both fields accept
// exactly the same "owner/name" shape.
const GITHUB_OWNER_REPO_PATTERN = /^[\w.-]+\/[\w.-]+$/;

/**
 * One project — shipped product work, a freelance build, a personal side
 * project, an open-source repo, or a research artifact.
 *
 * One document type covers all five via `kind` rather than separate "project"
 * and "case study" schemas, which would duplicate ~15 identical fields and then
 * need merging back for the listing grid. What actually differs between them is
 * *who it was for* and *whether the code is public* — two fields, not two
 * models. This mirrors how `experience` uses `kind` for work/community/education.
 *
 * Ordering is drag-and-drop in the Studio (`orderRank`), matching every other
 * orderable type in this dataset. `startDate`/`completedAt` are still stored as
 * real dates so ranges can be formatted and a "Newest" toggle offered, but they
 * are not the default sort.
 */
export const projectType = defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: ProjectsIcon,
  orderings: [orderRankOrdering],
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
    { name: "references", title: "Connections" },
    { name: "meta", title: "Links & Dates" },
    { name: "display", title: "Display" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      description:
        "The project's name as it should appear everywhere on the site. Example: 'Zion Taxi', 'Mind-Check'.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      description:
        "Drives the /projects/<slug> URL. Click Generate to derive it from the title. Changing this after publishing breaks any existing links to the project page.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      group: "content",
      options: {
        list: PROJECT_KINDS.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "personal",
      description:
        "The engagement type, shown as the orange badge on the card. Professional = built inside a full-time or contract role (link that role under Connections); Freelance = independent paid client work; Personal = your own side project; Open source = public repo built for others to use; Research = academic or published work; College = built as coursework or campus life during your degree.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "content",
      options: {
        list: PROJECT_STATUSES.map(({ title, value }) => ({ title, value })),
        layout: "dropdown",
      },
      description:
        "Shown as the second badge on the card. Live = publicly usable right now; In development = actively being built; Unlaunched = finished but never shipped publicly; Archived = no longer maintained.",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "content",
      description:
        "One short line shown under the title on the card — aim for under ~70 characters so it doesn't wrap awkwardly. Example: 'Production ride-hailing platform — backend, admin dashboard, and driver apps.'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "Two or three sentences describing what you built and what you owned. Appears in the Overview section of the project page and as the page's SEO meta description.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Case study",
      type: "blockContent",
      group: "content",
      description:
        "Optional long-form write-up shown below the Overview. Projects with a body get a 'Read case study' call to action on the card; those without say 'More about <title>' instead. Both still link to the project page.",
    }),

    defineField({
      // v1 rendered a small square logo on every project card, and again as a
      // rotated badge on the project page linking out to the live site.
      // Distinct from `coverImage`: this is the product's mark, that is the
      // artwork.
      name: "icon",
      title: "Icon / logo",
      type: "image",
      group: "media",
      options: { hotspot: true },
      description:
        "Optional square logo or app icon, shown as a small 36px mark beside the badges on the card. This is the product's mark — use Cover image for artwork or a screenshot.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Describe the logo for screen readers and SEO. Example: 'Zion Taxi app icon'.",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      description:
        "Optional headline image, shown across the top of the card (where it zooms on hover) and full-width on the project page. Landscape works best — roughly 16:10. Cards and the page omit the image block entirely when this is empty, rather than showing a placeholder.",
      fields: [
        defineField({
          // Required only *within* the image object: if an image is provided
          // it must carry alt text, but the image itself is optional.
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Describe what the image shows, for screen readers and SEO.",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      description:
        "Screenshots shown lower down the project page, each opening in a full-screen lightbox with zoom and arrow-key navigation. Portrait and landscape can be mixed freely — each image keeps its own aspect ratio and is never cropped.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description:
                "Describe what this screenshot shows, for screen readers and SEO.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
              description:
                "Optional short label shown under the image while the lightbox is open.",
            }),
          ],
        },
      ],
    }),

    defineField({
      name: "organization",
      title: "Organization",
      type: "reference",
      group: "references",
      to: [{ type: "organization" }],
      description:
        "The employer or client this was built for. Reuses the existing Organization documents, so a logo or name updated once updates everywhere. Leave empty for personal projects.",
    }),
    defineField({
      name: "relatedExperience",
      title: "Built during",
      type: "reference",
      group: "references",
      to: [{ type: "experience" }],
      description:
        "The role this was built in. Drives the 'Full-time at StejasSYS' style line on the card, and the cross-link to the Experience page — so the employment type never has to be retyped here.",
    }),
    defineField({
      name: "skills",
      title: "Tech used",
      type: "array",
      group: "references",
      of: [{ type: "reference", to: [{ type: "skill" }] }],
      description:
        "References existing Skill documents rather than free text, so a skill renamed once is renamed everywhere. The first four appear as chips on the card; all of them show on the project page and feed the tech filters on /projects.",
    }),
    defineField({
      name: "collaborators",
      title: "Collaborators",
      type: "array",
      group: "references",
      description:
        "People who helped build this project, each with what they contributed. References existing Person documents, so the same person (a professor, a designer, a research assistant) is authored once and reused across projects.",
      of: [
        {
          type: "object",
          name: "collaborator",
          fields: [
            defineField({
              name: "person",
              title: "Person",
              type: "reference",
              to: [{ type: "person" }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "contribution",
              title: "Contribution",
              type: "string",
              description:
                "What they did on this project. Example: 'Trained the classification model', 'UI design'.",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "person.name",
              subtitle: "contribution",
              media: "person.photo",
            },
          },
        },
      ],
    }),
    defineField({
      name: "relatedProjects",
      title: "Related projects",
      type: "array",
      group: "references",
      description:
        "Other projects worth cross-linking (shared codebase, same theme, a follow-up build). Kept in sync automatically on publish: adding this project here also adds the reverse link on the other project, and removing it here removes the reverse link too.",
      of: [{ type: "reference", to: [{ type: "project" }] }],
      validation: (Rule) =>
        Rule.custom((refs: { _ref?: string }[] | undefined, context) => {
          const currentId = (context.document?._id ?? "").replace(
            /^drafts\./,
            ""
          );
          const referencesSelf = (refs ?? []).some(
            (ref) => ref._ref === currentId
          );
          return referencesSelf ? "A project can't relate to itself" : true;
        }),
    }),

    defineField({
      name: "links",
      title: "Links",
      type: "array",
      group: "meta",
      description:
        "Outbound links shown as buttons in the Information panel on the project page. Leave the repository link off for private client work. For an actual GitHub repo, prefer GitHub repository / Additional repositories below — they auto-build the URL and (for the primary one) show a star count.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description:
                "The button text. Example: 'Live site', 'Repository', 'Publication (DOI)'.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              description: "Full URL including https://",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "type",
              title: "Type",
              type: "string",
              options: {
                list: PROJECT_LINK_TYPES.map(({ title, value }) => ({
                  title,
                  value,
                })),
                layout: "dropdown",
              },
              description:
                "Picks the icon shown next to the link — a globe for a live site, a branch for a repo, and so on.",
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "url",
            },
          },
        },
      ],
    }),
    defineField({
      name: "githubRepo",
      title: "GitHub repository",
      type: "string",
      group: "meta",
      description:
        "The primary repo. Owner and name only — 'kunalkeshan/Shiryoku', not a full URL. Used to fetch the star count at build time, which appears on the card. Leave empty for private repos; the badge is simply hidden. For any other repos this project spans, use Additional repositories below — those never show a star count.",
      validation: (Rule) =>
        Rule.regex(GITHUB_OWNER_REPO_PATTERN, {
          name: "owner/name",
          invert: false,
        }).warning("Expected the 'owner/name' form, e.g. kunalkeshan/Shiryoku"),
    }),
    defineField({
      name: "additionalRepos",
      title: "Additional repositories",
      type: "array",
      group: "meta",
      description:
        "Other repos this project spans (e.g. a companion CLI or mobile app) beyond the primary GitHub repository above. Shown as plain links on the project page — no star count, unlike the primary repo.",
      of: [
        {
          type: "object",
          name: "additionalRepo",
          fields: [
            defineField({
              name: "repo",
              title: "Repository",
              type: "string",
              description:
                "Owner and name only — 'kunalkeshan/foo-cli', not a full URL.",
              validation: (Rule) =>
                Rule.required().regex(GITHUB_OWNER_REPO_PATTERN, {
                  name: "owner/name",
                  invert: false,
                }),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description:
                "Optional short label shown next to the repo name, e.g. 'CLI tool', 'Mobile app'. Leave empty to just show the repo name.",
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "repo",
            },
            prepare({ title, subtitle }) {
              return { title: title || subtitle, subtitle: title && subtitle };
            },
          },
        },
      ],
    }),
    defineField({
      name: "startDate",
      title: "Start date",
      type: "date",
      group: "meta",
      options: { dateFormat: "MMMM YYYY" },
      description:
        "When you started building. Only the month and year are shown on the site.",
    }),
    defineField({
      name: "completedAt",
      title: "Completed",
      type: "date",
      group: "meta",
      options: { dateFormat: "MMMM YYYY" },
      description:
        "When the work wrapped up. Leave empty for ongoing projects — the timeline then shows just the start.",
    }),

    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "display",
      description:
        "Featured projects appear in the condensed section on the home page. Everything appears on /projects regardless of this flag.",
      initialValue: false,
    }),
    defineField({
      name: "archived",
      title: "Earlier work",
      type: "boolean",
      group: "display",
      description:
        "Moves this into the quieter 'Earlier work' section lower down /projects, rather than the main grid. Use it for student-era and no-longer-maintained projects. Archived projects never appear on the home page.",
      initialValue: false,
    }),
    orderRankField({ type: "project" }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "tagline",
      media: "coverImage",
    },
  },
});
