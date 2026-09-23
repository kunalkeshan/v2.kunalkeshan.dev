import { defineField, defineType } from "sanity";
import { SearchIcon } from "@sanity/icons/Search";

/**
 * Shared SEO object, embedded (not referenced) on `post`, `journalEntry`,
 * `project`, and `legal` — the document types with their own detail page.
 *
 * Deliberately minimal: this repo already derives the meta `<title>` from
 * each document's own `title` field and the meta description from
 * `excerpt`/`summary`/`description`, so this object only covers what those
 * fields *can't* express — an explicit `<title>` override, and a per-document
 * way to keep a published page out of search indexing without unpublishing
 * it. See docs/seo.md.
 */
export const seoType = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  icon: SearchIcon,
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title override",
      type: "string",
      description:
        "Overrides the <title> tag and OG/Twitter title for this page. Leave empty to use the document's own title.",
    }),
    defineField({
      name: "noindex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
      description:
        "When on, this page is excluded from the sitemap and marked noindex, so search engines won't index it. The page itself still renders normally — this doesn't unpublish it.",
    }),
  ],
  options: {
    collapsible: true,
    collapsed: true,
  },
});
