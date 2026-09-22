import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons/Tag";

/**
 * A flat, shared label applied to both `post` and `journalEntry` documents.
 *
 * Deliberately not a two-level category/tag system — one flat pool keeps
 * Studio curation simple and gives every tag its own /tags/<slug> archive
 * page, which is the point: more indexable, topic-specific URLs for SEO/AEO
 * rather than a handful of broad category buckets.
 */
export const tagType = defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description:
        "The tag as it appears on post cards and filter chips. Example: 'Next.js', 'Career', 'Sanity'. Shared across Blog and Journal — a tag applied to both shows up under either.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      description:
        "Drives the /tags/<slug> archive URL. Click Generate to derive it from the name. Changing this after publishing breaks any existing links to the tag page.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description:
        "Optional one-line summary shown at the top of the tag's archive page. Leave empty and the page just lists matching posts under the tag name.",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
    },
  },
});
