import { defineType } from "sanity";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

/**
 * An academic paper or patent.
 *
 * Kept separate from `experience` rather than folded in behind another `kind`
 * value: the fields genuinely differ (an author list, a DOI, a venue), and a
 * publication is a credential rather than a position with a duration. Rendered
 * as a small callout at the foot of the resume page.
 */
export const publicationType = defineType({
  name: "publication",
  title: "Publication",
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
      name: "venue",
      title: "Venue",
      type: "string",
      description:
        "Conference or journal the work appeared in, including location if relevant.",
    },
    {
      name: "publishedAt",
      title: "Published",
      type: "date",
      options: { dateFormat: "MMMM YYYY" },
    },
    {
      name: "authors",
      title: "Authors",
      type: "array",
      of: [{ type: "string" }],
      description: "In publication order, as printed on the paper.",
    },
    {
      name: "doi",
      title: "DOI",
      type: "string",
      description: "Identifier only, without the https://doi.org/ prefix.",
    },
    {
      name: "url",
      title: "URL",
      type: "url",
      description: "Where the paper can be read.",
    },
    {
      name: "abstract",
      title: "Abstract",
      type: "text",
      rows: 4,
      description: "A short plain-language summary of what the work shows.",
    },
    orderRankField({ type: "publication" }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "venue",
    },
  },
});
