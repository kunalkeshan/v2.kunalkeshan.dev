import { defineField, defineType } from "sanity";
import { WrenchIcon } from "@sanity/icons/Wrench";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

/**
 * One offering in the Services grid, shown both on the home page strip and on
 * the standalone /services page.
 *
 * Deliberately flat — three fields don't justify field groups; the Studio form
 * reads better as a single short column.
 */
export const serviceType = defineType({
  name: "service",
  title: "Service",
  type: "document",
  icon: WrenchIcon,
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description:
        "The service as a customer would name it. Example: 'Software Development', 'CMS & Content Platforms'.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description:
        "One or two sentences on what this actually covers and who it's for. Shown as the body of the service card — aim for a similar length across all services so the cards line up.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description:
        "A small inline icon shown in the contact form's service picker (distinct from the illustration below, which is a larger graphic used elsewhere). Name must match a lucide-react icon exported from PLATFORM_ICONS in apps/web/components/contact/service-multi-select.tsx.",
      options: {
        list: [
          { title: "Code", value: "Code2" },
          { title: "Database", value: "Database" },
          { title: "Search", value: "Search" },
          { title: "Cloud", value: "Cloud" },
          { title: "Wrench", value: "Wrench" },
          { title: "Rocket", value: "Rocket" },
          { title: "Server", value: "Server" },
          { title: "File Code", value: "FileCode" },
          { title: "Globe", value: "Globe" },
          { title: "Sparkles", value: "Sparkles" },
          { title: "Layers", value: "Layers" },
          { title: "Terminal", value: "Terminal" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "illustration",
      title: "Illustration",
      type: "image",
      options: { hotspot: true },
      description:
        "The artwork at the top of the card, sitting on a muted panel and zooming slightly on hover. SVGs work best. Keep the visual style consistent across every service.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Describe the illustration for screen readers and SEO. Example: 'Developer working at a desk with dual monitors'.",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
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
