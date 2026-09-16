import { defineField, defineType } from "sanity";
import { BookIcon } from "@sanity/icons/Book";
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
 * as a small callout at the foot of the experience page.
 */
export const publicationType = defineType({
  name: "publication",
  title: "Publication",
  type: "document",
  icon: BookIcon,
  orderings: [orderRankOrdering],
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "credits", title: "Credits & Links" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "details",
      description:
        "The paper's full title, exactly as published. Example: 'Leaky LMS Algorithm Based Low Complexity Adaptive Noise Cancellation'.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "string",
      group: "details",
      description:
        "Conference or journal the work appeared in, including location if relevant. Example: '2025 International Conference on Recent Advances in Electrical, Electronics… (RAEEUCCI), Chennai, India'.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published",
      type: "date",
      group: "details",
      options: { dateFormat: "MMMM YYYY" },
      description:
        "Publication date. Only the month and year are shown on the site.",
    }),
    defineField({
      name: "abstract",
      title: "Abstract",
      type: "text",
      rows: 4,
      group: "details",
      description:
        "A short plain-language summary of what the work shows — not necessarily the paper's formal abstract. Written for a reader who isn't in the field.",
    }),

    defineField({
      name: "authors",
      title: "Authors",
      type: "array",
      group: "credits",
      of: [{ type: "string" }],
      description:
        "In publication order, as printed on the paper. Example: 'S. Maiti', 'D. Adusumalli', 'K. Keshan'.",
    }),
    defineField({
      name: "doi",
      title: "DOI",
      type: "string",
      group: "credits",
      description:
        "Identifier only, without the https://doi.org/ prefix. Example: '10.1109/RAEEUCCI63961.2025.11048209'.",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      group: "credits",
      description:
        "Where the paper can be read, including https://. Use this when there's a better landing page than the DOI resolver.",
    }),
    orderRankField({ type: "publication" }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "venue",
    },
  },
});
