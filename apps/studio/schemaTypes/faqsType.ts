import { defineType } from "sanity";

export const faqsType = defineType({
  name: "faqs",
  title: "FAQs",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Frequently Asked Questions",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "faqItems",
      title: "FAQ Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "question",
              title: "Question",
              type: "string",
              validation: (Rule) => Rule.required().min(10).max(200),
            },
            {
              name: "answer",
              title: "Answer",
              type: "text",
              validation: (Rule) => Rule.required().min(10),
            },
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
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    },
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
