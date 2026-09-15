import { defineType } from "sanity";
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
  orderings: [orderRankOrdering],
  fields: [
    {
      name: "role",
      title: "Role",
      type: "string",
      description:
        "Job title, or the qualification for an education entry (e.g. 'B.Tech, Electronics & Communication Engineering').",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "organization",
      title: "Organization",
      type: "reference",
      to: [{ type: "organization" }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "kind",
      title: "Kind",
      type: "string",
      options: {
        list: EXPERIENCE_KINDS.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "work",
      description:
        "Work and Community roles share the main timeline; Education renders in its own block further down the page.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "employmentType",
      title: "Employment Type",
      type: "string",
      options: {
        list: EMPLOYMENT_TYPES.map(({ title, value }) => ({ title, value })),
        layout: "dropdown",
      },
    },
    {
      name: "workMode",
      title: "Work Mode",
      type: "string",
      options: {
        list: WORK_MODES.map(({ title, value }) => ({ title, value })),
        layout: "dropdown",
      },
    },
    {
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g. 'Chennai, India'.",
    },
    {
      name: "startDate",
      title: "Start Date",
      type: "date",
      options: { dateFormat: "MMMM YYYY" },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "endDate",
      title: "End Date",
      type: "date",
      options: { dateFormat: "MMMM YYYY" },
      description: "Leave empty when this is a current role.",
    },
    {
      name: "isCurrent",
      title: "Currently here",
      type: "boolean",
      description:
        "Renders the date block in the accent color and shows 'Present' instead of an end date.",
      initialValue: false,
    },
    {
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 2,
      description:
        "One or two sentences. This is what the condensed home page section shows — the detailed highlights below are only used on the full page.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "string" }],
      description:
        "The bullet points shown on the full page. Aim for 4-6 of the strongest per role.",
    },
    {
      name: "skills",
      title: "Skills Used",
      type: "array",
      of: [{ type: "reference", to: [{ type: "skill" }] }],
      description:
        "References existing Skill documents rather than free text, so a skill renamed once is renamed everywhere.",
    },
    {
      name: "credential",
      title: "Credential",
      type: "string",
      description:
        "Education only — e.g. 'CGPA 8.65'. Ignored for work and community roles.",
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
              description: "e.g. 'Experience letter', 'Live site'.",
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
                list: EXPERIENCE_LINK_TYPES.map(({ title, value }) => ({
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
      name: "featured",
      title: "Featured",
      type: "boolean",
      description:
        "Featured roles appear in the condensed home page section. Everything appears on the full page regardless of this flag.",
      initialValue: false,
    },
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
