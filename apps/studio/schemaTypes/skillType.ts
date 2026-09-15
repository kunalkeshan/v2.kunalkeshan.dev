import { defineType } from "sanity";
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
  orderings: [orderRankOrdering],
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "icon",
      title: "Icon",
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
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: SKILL_CATEGORIES.map(({ title, value }) => ({ title, value })),
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "featured",
      title: "Featured",
      type: "boolean",
      description:
        "Featured skills appear in the curated home page skills strip. Everything appears on the full /skills page regardless of this flag.",
      initialValue: false,
    },
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
