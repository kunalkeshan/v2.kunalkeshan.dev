import { defineField, defineType } from "sanity";
import { SparklesIcon } from "@sanity/icons/Sparkles";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export const SKILL_CATEGORIES = [
  { title: "Languages", value: "languages" },
  { title: "Frontend / Mobile", value: "frontend-mobile" },
  { title: "Backend", value: "backend" },
  { title: "Testing", value: "testing" },
  { title: "Payments & Security", value: "payments-security" },
  { title: "CMS / Content", value: "cms" },
  { title: "Cloud & Infrastructure", value: "cloud-infrastructure" },
  { title: "Auth & Security", value: "auth-security" },
  { title: "AI / ML", value: "ai-ml" },
  { title: "Messaging / Integrations", value: "messaging-integrations" },
  { title: "DevOps / Tooling", value: "devops-tooling" },
  { title: "Databases", value: "databases" },
  { title: "Collaboration & Communication", value: "collaboration" },
  { title: "Other", value: "other" },
] as const;

export const skillType = defineType({
  name: "skill",
  title: "Skill",
  type: "document",
  icon: SparklesIcon,
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description:
        "The tool or technology, spelled the way its makers spell it. Example: 'Next.js', 'PostgreSQL', 'shadcn/ui'. Skills are referenced by Experience and Project documents, so renaming here updates every mention across the site.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      options: { hotspot: true },
      description:
        "The technology's logo, shown as a small mark on the skill chip. Square SVGs work best — most projects publish one in their brand or press kit.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Describe the icon for screen readers and SEO. Example: 'Next.js logo'.",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: SKILL_CATEGORIES.map(({ title, value }) => ({ title, value })),
        layout: "dropdown",
      },
      description:
        "Groups the skill on the /skills page and drives the filter chips there. Pick the category a reader would look under first — a tool that spans two (say, TypeScript) belongs under the one it's best known for.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description:
        "Featured skills appear in the curated strip on the home page. Everything appears on the full /skills page regardless of this flag — keep the featured set small enough to stay scannable.",
      initialValue: false,
    }),
    orderRankField({ type: "skill" }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "icon",
    },
  },
});
