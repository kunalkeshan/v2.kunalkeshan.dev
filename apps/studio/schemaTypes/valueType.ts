import { defineField, defineType } from "sanity";
import { HeartIcon } from "@sanity/icons/Heart";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

/**
 * One core value in the grid on /about.
 *
 * Modelled on `serviceType` — same {title, description, illustration, orderRank}
 * shape — rather than living as an array on `siteConfig`. Two reasons: authoring
 * an image inside a 6-element array object means expanding each row one at a
 * time, and a real document type is what gives `createCollectionTag("value")`
 * its own revalidation scope. As a `siteConfig` array, editing one value would
 * bust `collection:siteConfig`, which every route reads.
 *
 * The copy for these is carried over verbatim from kunalkeshan.dev v1's
 * `data/values.ts`. Per docs/content/persona-and-tone.md, personal values
 * language is explicitly out of scope for the student → professional reframe:
 * "this is personal identity, not student-coded. Don't touch, hedge, or
 * reframe it."
 */
export const valueType = defineType({
  name: "value",
  title: "Value",
  type: "document",
  icon: HeartIcon,
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        "The value as a single word. Example: 'Focus', 'Discipline', 'Grit'.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description:
        "A few sentences on what this value means in practice. Shown as the body of the value card. Lengths vary between values and that's fine — the cards are a two-column grid, not a fixed-height row.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "illustration",
      title: "Illustration",
      type: "image",
      options: { hotspot: true },
      description:
        "The artwork on the left panel of the card, zooming slightly on hover. SVGs work best. Keep the visual style consistent across every value.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Describe what the illustration depicts — not the value's name. The heading beside it already carries that. Example: 'Person at a desk reviewing a checklist'.",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    orderRankField({ type: "value" }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "illustration",
    },
  },
});
