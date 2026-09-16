import { defineType } from "sanity";
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
  { title: "Case study", value: "case-study" },
  { title: "Video", value: "video" },
  { title: "Paper", value: "paper" },
] as const;

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
  orderings: [orderRankOrdering],
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      description: "Drives the /projects/<slug> URL.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "kind",
      title: "Kind",
      type: "string",
      options: {
        list: PROJECT_KINDS.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "personal",
      description:
        "The engagement type. Professional = built inside a full-time or contract role (link the role below); Freelance = independent paid work.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: PROJECT_STATUSES.map(({ title, value }) => ({ title, value })),
        layout: "dropdown",
      },
      description: "Shown as a badge on the card and the project page.",
    },
    {
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "One line, shown under the title on the card.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description:
        "Two or three sentences. Used as the card body and the page meta description.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "body",
      title: "Case study",
      type: "blockContent",
      description:
        "Long-form write-up. Projects with a body get a 'Read case study' CTA; those without link straight out to the live site or repo.",
    },
    {
      name: "organization",
      title: "Organization",
      type: "reference",
      to: [{ type: "organization" }],
      description:
        "The employer or client. Reuses the existing Organization documents.",
    },
    {
      name: "relatedExperience",
      title: "Built during",
      type: "reference",
      to: [{ type: "experience" }],
      description:
        "Links this project to the role it was built in, so the page can cross-reference /experience.",
    },
    {
      name: "skills",
      title: "Tech used",
      type: "array",
      of: [{ type: "reference", to: [{ type: "skill" }] }],
      description:
        "References existing Skill documents rather than free text, so a skill renamed once is renamed everywhere.",
    },
    {
      // v1 rendered a small square logo on every project card, and again as a
      // rotated badge on the project page linking out to the live site.
      // Distinct from `coverImage`: this is the product's mark, that is the
      // artwork.
      name: "icon",
      title: "Icon / logo",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional. A small square logo shown beside the badges on the card.",
      fields: [
        {
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Short description for accessibility and SEO",
          validation: (Rule) => Rule.required(),
        },
      ],
    },
    {
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional. Cards and the project page omit the image block entirely when this is empty, rather than rendering a placeholder.",
      fields: [
        {
          // Required only *within* the image object: if an image is provided
          // it must carry alt text, but the image itself is optional.
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Short description for accessibility and SEO",
          validation: (Rule) => Rule.required(),
        },
      ],
    },
    {
      name: "gallery",
      title: "Gallery",
      type: "array",
      description: "Screenshots shown on the project page, opened in a lightbox.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Alt text",
              type: "string",
              description: "Short description for accessibility and SEO",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "caption",
              title: "Caption",
              type: "string",
              description: "Optional, shown under the image in the lightbox.",
            },
          ],
        },
      ],
    },
    {
      name: "links",
      title: "Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Label",
              type: "string",
              description: "e.g. 'Live site', 'Repository'.",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) => Rule.required(),
            },
            {
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
              description: "Picks the icon shown next to the link.",
            },
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "url",
            },
          },
        },
      ],
    },
    {
      name: "githubRepo",
      title: "GitHub repository",
      type: "string",
      description:
        "Owner and name only, e.g. 'kunalkeshan/Shiryoku' — not a full URL. Used to fetch the star count at build time. Leave empty for private work.",
      validation: (Rule) =>
        Rule.regex(/^[\w.-]+\/[\w.-]+$/, {
          name: "owner/name",
          invert: false,
        }).warning("Expected the 'owner/name' form, e.g. kunalkeshan/Shiryoku"),
    },
    {
      name: "startDate",
      title: "Start date",
      type: "date",
      options: { dateFormat: "MMMM YYYY" },
    },
    {
      name: "completedAt",
      title: "Completed",
      type: "date",
      options: { dateFormat: "MMMM YYYY" },
      description: "Leave empty for ongoing work.",
    },
    {
      name: "featured",
      title: "Featured",
      type: "boolean",
      description:
        "Featured projects appear in the condensed home page section. Everything appears on /projects regardless of this flag.",
      initialValue: false,
    },
    {
      name: "archived",
      title: "Earlier work",
      type: "boolean",
      description:
        "Moves this into the quieter 'Earlier work' section lower on /projects, rather than the main grid.",
      initialValue: false,
    },
    orderRankField({ type: "project" }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "tagline",
      media: "coverImage",
    },
  },
});
