import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineField, defineType } from "sanity";

export const legalType = defineType({
  name: "legal",
  title: "Legal",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        "The document's name as it appears in the footer and as the page heading. Examples: 'Privacy Policy', 'Terms and Conditions'.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      description:
        "Drives the /legal/<slug> URL. Click Generate to derive it from the title. Changing this after publishing breaks any existing links.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      description:
        "One or two sentences summarising the document. Used as the SEO meta description and as the subtitle in the legal documents list.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "blockContent",
      description:
        "The full document body. Headings, lists, and links are all supported — note that a Heading 1 here renders as an h2 on the page, so it never competes with the page title.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
});
