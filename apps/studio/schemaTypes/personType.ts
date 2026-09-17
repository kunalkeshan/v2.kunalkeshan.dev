import { defineField, defineType } from "sanity";
// Deep import, not a barrel import: `@sanity/icons`' root export only exposes
// `Icon` and `icons`, so `import { UserIcon } from "@sanity/icons"` typechecks
// but fails at bundle time with MISSING_EXPORT.
import { UserIcon } from "@sanity/icons/User";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

/**
 * A real person who appears on the site — currently the author of one or more
 * `testimonial` documents.
 *
 * Modelled as its own document rather than inlined on the testimonial, because
 * a person genuinely repeats: v1 (`kunalkeshan.dev`) carried Diveakssh Schae
 * twice in `data/tributes.ts` — two testimonials, but the name, headshot,
 * position, company and slug all duplicated, and its carousel matched entries
 * by `name`, so the duplicate made one of his quotes unreachable. Referencing a
 * person means the headshot is authored once and a title change is a single
 * edit, and it leaves room for a person to be cited by something other than a
 * testimonial later.
 *
 * Deliberately NOT v1's `tribute`: that type also carried Kunal's own words
 * about the person (`tributes[]`, `lessonsLearnt`, `intro`, `coverImage`) and
 * drove the `/tributes` pages. That is a separate feature and is out of scope
 * here — this document holds only who someone is.
 */
export const personType = defineType({
  name: "person",
  title: "Person",
  type: "document",
  icon: UserIcon,
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description:
        "The person's name as it should appear on the site. Example: 'Rajarajan K', 'GS Thina'.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      description:
        "Headshot, shown as a circular portrait beside their testimonial. Square images work best — anything else is cropped to fill the circle, so set the hotspot over their face.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Describe the photo for screen readers. Example: 'Portrait photograph of Rajarajan K'.",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "position",
      title: "Position",
      type: "string",
      description:
        "Their role at the organization, shown under their name. Example: 'Managing Director', 'Founder'. Leave empty if it doesn't apply.",
    }),
    defineField({
      name: "organization",
      title: "Organization",
      type: "reference",
      to: [{ type: "organization" }],
      description:
        "Where they work. References an existing Organization document, so the logo and website are authored once and shared with the Experience and Projects pages. Leave empty and use 'Organization name' below if they don't warrant their own Organization document.",
    }),
    defineField({
      name: "organizationName",
      title: "Organization name (unreferenced)",
      type: "string",
      description:
        "Fallback for a one-off organization that has no Organization document — a personal brand or a solo client, for example. Ignored when 'Organization' above is set. No logo is shown in this case.",
      hidden: ({ parent }) => Boolean(parent?.organization),
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
      description:
        "Their personal site or profile, including https://. Their name links here. Leave empty and the name simply won't link anywhere.",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "socials",
      title: "Social Links",
      type: "array",
      description:
        "Optional profiles. Not currently rendered on the testimonial card — stored so a future surface can use them without re-authoring every person.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "Twitter (X)", value: "twitter" },
                  { title: "Instagram", value: "instagram" },
                  { title: "YouTube", value: "youtube" },
                  { title: "GitHub", value: "github" },
                ],
                layout: "dropdown",
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: "platform",
              subtitle: "url",
            },
          },
        },
      ],
    }),
    orderRankField({ type: "person" }),
  ],
  preview: {
    select: {
      title: "name",
      position: "position",
      organization: "organization.name",
      organizationName: "organizationName",
      media: "photo",
    },
    prepare({ title, position, organization, organizationName, media }) {
      const company = organization || organizationName;
      const subtitle = [position, company].filter(Boolean).join(" at ");
      return { title, subtitle: subtitle || undefined, media };
    },
  },
});
