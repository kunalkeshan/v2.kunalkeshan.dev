import { defineField, defineType } from "sanity";
import { CaseIcon } from "@sanity/icons/Case";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

export const EXPERIENCE_KINDS = [
  { title: "Work", value: "work" },
  { title: "Community / Club", value: "community" },
  { title: "Education", value: "education" },
] as const;

export const EMPLOYMENT_TYPES = [
  { title: "Full-time", value: "full-time" },
  { title: "Part-time", value: "part-time" },
  { title: "Internship", value: "internship" },
  { title: "Contract", value: "contract" },
  { title: "Freelance", value: "freelance" },
  { title: "Volunteer", value: "volunteer" },
] as const;

export const WORK_MODES = [
  { title: "On-site", value: "on-site" },
  { title: "Remote", value: "remote" },
  { title: "Hybrid", value: "hybrid" },
] as const;

export const EXPERIENCE_LINK_TYPES = [
  { title: "Live site", value: "live-site" },
  { title: "Repository", value: "repo" },
  { title: "Certificate", value: "certificate" },
  { title: "Letter", value: "letter" },
  { title: "Patent", value: "patent" },
  { title: "Publication", value: "publication" },
] as const;

/**
 * A single position — a job, a community/club role, or a degree.
 *
 * One document type covers all three via `kind` rather than three near-identical
 * schemas, but the *rendering* groups them into separate blocks. Education is
 * never interleaved into the work timeline: v1 listed the B.Tech as a dated
 * experience row ending "(Tentative)", which `docs/content/persona-and-tone.md`
 * names as an anti-pattern. Keeping `kind` as a field means a future degree
 * slots into the Education block with no schema change.
 *
 * Ordering is drag-and-drop in the Studio (`orderRank`), and that order is
 * exactly what the site renders — not a date sort. Dates are still stored as
 * real dates so ranges can be formatted and durations computed; v1 stored
 * display strings like "Sept 2023" and "July 2024 (Tentative)", which could
 * be neither sorted nor reformatted.
 */
export const experienceType = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  icon: CaseIcon,
  orderings: [orderRankOrdering],
  groups: [
    { name: "role", title: "Role", default: true },
    { name: "dates", title: "Dates" },
    { name: "details", title: "Details" },
    { name: "links", title: "Links" },
  ],
  fields: [
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      group: "role",
      description:
        "Job title, or the qualification for an education entry. Examples: 'Software Engineer', 'Chairperson, Computer Society', 'B.Tech, Electronics & Communication Engineering'.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "organization",
      title: "Organization",
      type: "reference",
      group: "role",
      to: [{ type: "organization" }],
      description:
        "Who this role was at. Consecutive roles pointing at the same organization are grouped under one logo and a combined tenure on the Experience page — so create the Organization once and reference it from each position.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      group: "role",
      options: {
        list: EXPERIENCE_KINDS.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "work",
      description:
        "Work and Community roles share the main timeline; Education renders in its own block further down the page, never interleaved into the work history.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "employmentType",
      title: "Employment Type",
      type: "string",
      group: "role",
      options: {
        list: EMPLOYMENT_TYPES.map(({ title, value }) => ({ title, value })),
        layout: "dropdown",
      },
      description:
        "Shown in the meta line under the role. Also read by any Project linked to this role, to render its 'Full-time at …' attribution.",
    }),
    defineField({
      name: "workMode",
      title: "Work Mode",
      type: "string",
      group: "role",
      options: {
        list: WORK_MODES.map(({ title, value }) => ({ title, value })),
        layout: "dropdown",
      },
      description: "On-site, remote, or hybrid. Shown in the same meta line.",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "role",
      description: "City and country. Example: 'Chennai, India'.",
    }),

    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
      group: "dates",
      options: { dateFormat: "MMMM YYYY" },
      description:
        "When the role began. Only the month and year are shown on the site.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "date",
      group: "dates",
      options: { dateFormat: "MMMM YYYY" },
      description:
        "When it ended. Leave empty when this is a current role and tick 'Currently here' instead.",
    }),
    defineField({
      name: "isCurrent",
      title: "Currently here",
      type: "boolean",
      group: "dates",
      description:
        "Renders the date block in the accent colour and shows 'Present' instead of an end date. Also marks the timeline node as active.",
      initialValue: false,
    }),

    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 2,
      group: "details",
      description:
        "One or two sentences on what the role was. This is all the condensed home page section shows, so it has to stand alone — the highlights below only appear on the full Experience page.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      group: "details",
      of: [{ type: "string" }],
      description:
        "Bullet points shown on the full page. Aim for four to six of the strongest per role — what you built and what changed because of it, rather than a list of duties.",
    }),
    defineField({
      name: "skills",
      title: "Skills Used",
      type: "array",
      group: "details",
      of: [{ type: "reference", to: [{ type: "skill" }] }],
      description:
        "References existing Skill documents rather than free text, so a skill renamed once is renamed everywhere. Shown as chips under the role.",
    }),
    defineField({
      name: "credential",
      title: "Credential",
      type: "string",
      group: "details",
      description:
        "Education entries only — example: 'CGPA 8.65'. Ignored for work and community roles.",
    }),

    defineField({
      name: "links",
      title: "Links",
      type: "array",
      group: "links",
      description:
        "Supporting links shown as small buttons under the role — an experience letter, a certificate, the product you worked on.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description:
                "The button text. Examples: 'Experience letter', 'Live site'.",
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
                list: EXPERIENCE_LINK_TYPES.map(({ title, value }) => ({
                  title,
                  value,
                })),
                layout: "dropdown",
              },
              description: "Picks the icon shown next to the link.",
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
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "links",
      description:
        "Featured roles appear in the condensed section on the home page. Everything appears on the full Experience page regardless of this flag.",
      initialValue: false,
    }),
    orderRankField({ type: "experience" }),
  ],
  preview: {
    select: {
      title: "role",
      subtitle: "organization.name",
      media: "organization.logo",
    },
  },
});
