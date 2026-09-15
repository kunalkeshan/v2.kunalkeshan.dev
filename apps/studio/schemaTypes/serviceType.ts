import { defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export const serviceType = defineType({
  name: "service",
  title: "Service",
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Short 1-2 sentence summary shown on the service card.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "illustration",
      title: "Illustration",
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
    orderRankField({ type: "service" }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
      media: "illustration",
    },
  },
});
