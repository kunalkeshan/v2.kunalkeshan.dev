import { defineArrayMember, defineField, defineType } from "sanity";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";

/**
 * The FAQ singleton, rendered as an accordion on the contact page.
 *
 * A single document holding an array rather than one document per question:
 * the questions are only ever read together, and ordering them by dragging
 * inside one array is simpler than maintaining an orderRank across documents.
 */
export const faqsType = defineType({
  name: "faqs",
  title: "FAQs",
  type: "document",
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Frequently Asked Questions",
      description:
        "Heading shown above the accordion. Rarely needs changing from the default.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "faqItems",
      title: "FAQ Items",
      type: "array",
      description:
        "Drag to reorder — this is the order they appear on the page, so lead with what people actually ask most.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              description:
                "Phrase it the way someone would actually ask it. Between 10 and 200 characters.",
              validation: (Rule) => Rule.required().min(10).max(200),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              description:
                "A direct answer in a couple of sentences. Plain text — no formatting is rendered here.",
              validation: (Rule) => Rule.required().min(10),
            }),
          ],
          preview: {
            select: {
              title: "question",
              subtitle: "answer",
            },
            prepare({ title, subtitle }) {
              return {
                title: title || "Untitled Question",
                subtitle: subtitle
                  ? `${subtitle.slice(0, 50)}...`
                  : "No answer",
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
      faqItems: "faqItems",
    },
    prepare({ title, faqItems }) {
      const count = faqItems?.length || 0;
      return {
        title: title || "FAQs",
        subtitle: `${count} FAQ${count !== 1 ? "s" : ""}`,
      };
    },
  },
});
