import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons/Users";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

/**
 * A company, client, university, or student organization that one or more
 * `experience` or `project` documents point at.
 *
 * Modelled as its own document because organizations genuinely repeat across
 * roles — StejasSYS, IEEE SRMIST, and Think-Digital each hold multiple
 * sequential positions, and v1 (`kunalkeshan.dev`) had to paste the SRMIST
 * logo twice to express that. Referencing an organization makes the
 * "group several roles under one tenure" rendering on /experience fall out for
 * free, and means a logo or website change is a single edit.
 */
export const organizationType = defineType({
  name: "organization",
  title: "Organization",
  type: "document",
  icon: UsersIcon,
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description:
        "The organization's name as it should appear on the site. Example: 'StejasSYS', 'IEEE SRMIST'.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      description:
        "Shown as a circular mark beside the organization name on the Experience page. Square images work best — wordmarks with lots of built-in whitespace get cropped to fill the circle.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Describe the logo for screen readers and SEO. Example: 'StejasSYS logo'.",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
      description:
        "Public site for the organization, including https://. The logo and name link here. Leave empty if it has none — they simply won't link anywhere.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description:
        "One line on what the organization does. Shown under the name when several roles are grouped beneath it, so it gives context to the whole tenure rather than any single role.",
    }),
    orderRankField({ type: "organization" }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
      media: "logo",
    },
  },
});
