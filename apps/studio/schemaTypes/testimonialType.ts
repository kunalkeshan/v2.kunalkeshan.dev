import { defineField, defineType } from "sanity";
// Deep import — see the note in personType.ts on why the barrel import fails.
import { DoubleQuoteIcon } from "@sanity/icons/DoubleQuote";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

/**
 * Something someone said about Kunal, shown in the home page carousel.
 *
 * `author` is a reference rather than inline name/photo fields, which is what
 * lets one person carry several testimonials: v1 expressed Diveakssh Schae's
 * two quotes as two array entries with every identity field duplicated. Here
 * that is one `person` document and two `testimonial` documents, distinguished
 * by `context`.
 *
 * ## The quote field is not ours to edit
 *
 * A testimonial is a third party's own words. Unlike every other copy field in
 * this dataset, it is quoted material: it is migrated verbatim from v1's
 * `data/tributes.ts` and must never be reworded, tightened, or reframed —
 * including under docs/content/persona-and-tone.md's student → professional
 * rule. Three of the migrated quotes are student-era framed (Yakub Mathew, GS
 * Thina, Raman Shekhawat); the `featured` flag below is the correct lever for
 * those, not an edit. Confirmed with the user before seeding.
 *
 * Attribution follows the resume surface's exemption from the no-employer rule
 * rather than the About section's restriction: a testimonial's credibility
 * rests on who said it, so real names, titles and employers are shown.
 */
export const testimonialType = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: DoubleQuoteIcon,
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 8,
      description:
        "Their words, exactly as they wrote them. Don't reword, shorten, or fix the grammar — this is a quotation, not site copy. Paste as plain text; line breaks are preserved but the card reads best as flowing prose.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "person" }],
      description:
        "Who said it. Their photo, position and organization all come from the Person document, so the same person can have several testimonials without re-entering any of it.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "context",
      title: "Context",
      type: "string",
      description:
        "What this testimonial was about, in a few words. Example: 'Custom accordion build'. Only needed when one person has given more than one — it's what tells them apart in this list.",
    }),
    defineField({
      name: "featured",
      title: "Show on home page",
      type: "boolean",
      initialValue: false,
      description:
        "Featured testimonials appear in the home page carousel. Unfeatured ones stay here in the Studio without being shown — the right way to retire a quote you'd rather not lead with, since the quote itself must not be edited.",
    }),
    defineField({
      name: "givenAt",
      title: "Given on",
      type: "date",
      description:
        "Roughly when they gave it. Not displayed — it's here so the order can be reasoned about later. Leave empty if unknown.",
    }),
    orderRankField({ type: "testimonial" }),
  ],
  preview: {
    select: {
      authorName: "author.name",
      context: "context",
      quote: "quote",
      media: "author.photo",
      featured: "featured",
    },
    prepare({ authorName, context, quote, media, featured }) {
      const title = [authorName ?? "Unknown", context]
        .filter(Boolean)
        .join(" — ");
      return {
        title: featured ? `★ ${title}` : title,
        subtitle: quote,
        media,
      };
    },
  },
});
