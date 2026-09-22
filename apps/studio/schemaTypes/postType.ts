import { defineType } from "sanity";
import { ComposeIcon } from "@sanity/icons/Compose";

import { writingFields } from "./writingFields";

/**
 * A blog post at /blog/<slug> — technical/professional writing.
 *
 * Kept as its own document type rather than merged with `journalEntry` via a
 * discriminator field: separate Studio lists, separate GROQ queries, and
 * separate routes stay cleaner than one type branching on a `kind` field,
 * even though the two share an identical field shape (see writingFields.ts).
 *
 * Sorted by `publishedAt desc` rather than a manual `orderRank` — unlike the
 * curated types (projects, skills, ...), a growing list of dated posts is
 * always read newest-first, so there's nothing to hand-order.
 */
export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: ComposeIcon,
  fields: writingFields("/blog"),
  preview: {
    select: {
      title: "title",
      authorName: "author.name",
      media: "coverImage",
      publishedAt: "publishedAt",
    },
    prepare({ title, authorName, media, publishedAt }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString()
        : "Unpublished";
      return {
        title,
        subtitle: [authorName, date].filter(Boolean).join(" — "),
        media,
      };
    },
  },
});
