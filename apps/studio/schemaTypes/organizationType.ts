import { defineType } from "sanity";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

/**
 * A company, client, university, or student organization that one or more
 * `experience` documents point at.
 *
 * Modelled as its own document because organizations genuinely repeat across
 * roles — StejasSYS, IEEE SRMIST, and Think-Digital each hold multiple
 * sequential positions, and v1 (`kunalkeshan.dev`) had to paste the SRMIST
 * logo twice to express that. Referencing an organization makes the
 * "group several roles under one tenure" rendering on /resume fall out for
 * free, and means a logo or website change is a single edit.
 */
export const organizationType = defineType({
  name: "organization",
  title: "Organization",
  type: "document",
  orderings: [orderRankOrdering],
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "logo",
      title: "Logo",
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
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "website",
      title: "Website",
      type: "url",
      description:
        "Public site for the organization. Leave empty if it has none — the logo simply won't link anywhere.",
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description:
        "One line on what the organization does. Shown under the organization name when several roles are grouped beneath it.",
    },
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
