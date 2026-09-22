import { defineType } from "sanity";
import { BookIcon } from "@sanity/icons/Book";

import { writingFields } from "./writingFields";

/**
 * A journal entry at /journal/<slug> — more personal, informal writing.
 *
 * Same field shape as `post` (see writingFields.ts) by deliberate choice:
 * journal entries get the full author/tags/SEO/custom-OG-image treatment
 * rather than a stripped-down model, even though the old journal.kunalkeshan.dev
 * was tag-free and minimal. Kept as its own document type — not `post` with a
 * `kind` field — so Studio lists, queries and routes stay separate.
 */
export const journalEntryType = defineType({
  name: "journalEntry",
  title: "Journal Entry",
  type: "document",
  icon: BookIcon,
  fields: writingFields("/journal"),
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
