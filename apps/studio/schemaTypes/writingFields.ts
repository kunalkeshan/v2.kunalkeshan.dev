import { defineField } from "sanity";

/**
 * Field set shared verbatim by `post` and `journalEntry`.
 *
 * The two are kept as separate document types (separate Studio lists,
 * separate GROQ queries, separate routes) rather than one type with a
 * discriminator field — but their shape is identical by design, so the
 * field list is defined once here instead of copy-pasted twice.
 *
 * `urlPrefix` only changes field *descriptions* (which URL a slug drives),
 * never behavior — every field's `name` is identical across both types.
 */
export function writingFields(urlPrefix: "/blog" | "/journal") {
  return [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The post's title, shown as the page heading and in cards.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      description: `Drives the ${urlPrefix}/<slug> URL. Click Generate to derive it from the title. Changing this after publishing breaks any existing links.`,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "person" }],
      description:
        "Who wrote this. Their photo, name and social links come from the Person document — reuse your own Person document for anything you write yourself.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description:
        "One or two sentences summarising the piece. Shown on listing cards and used as the SEO meta description when no other description is set.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      description:
        "The hero image shown at the top of the post and on listing cards. Landscape works best — roughly 16:9.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe what the image shows, for screen readers and SEO.",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "ogImage",
      title: "Social share image (optional)",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional override for the image shown in social/link previews (Open Graph). Leave empty and one is generated automatically from the title, matching the site's design — only set this if you want a specific custom image instead. Recommended 1200x630px.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Short description for accessibility and SEO.",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
      description:
        "Topics this piece touches on. References existing Tag documents, shared between Blog and Journal, and drives the tag filter chips and each tag's own archive page.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      description:
        "The full write-up. Use Heading 2 / Heading 3 for section breaks — they power the automatic table of contents shown alongside the post.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published on",
      type: "datetime",
      description:
        "Drives sort order on the listing page (newest first) and the date shown on the post. Set this to schedule when a draft should read as published.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description:
        "Reserved for a future curated section (e.g. a home page strip). Everything appears on the listing page regardless of this flag.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ];
}
