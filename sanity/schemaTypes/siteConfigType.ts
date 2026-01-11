import { defineType } from "sanity";

export const siteConfigType = defineType({
  name: "siteConfig",
  title: "Site Configuration",
  type: "document",
  groups: [
    {
      name: "basic",
      title: "Basic Information",
      default: true,
    },
    {
      name: "contact",
      title: "Contact Information",
    },
    {
      name: "social",
      title: "Social Media",
    },
    {
      name: "content",
      title: "Content Management",
    },
  ],
  fields: [
    {
      name: "title",
      title: "Site Title",
      type: "string",
      group: "basic",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      title: "Site Description",
      type: "text",
      group: "basic",
      rows: 3,
    },
    {
      name: "ogImage",
      title: "Open Graph Image",
      type: "image",
      group: "basic",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Short description for accessibility and SEO",
        },
      ],
      description:
        "Recommended minimum: 1200 x 630px (1.91:1). Use JPG/PNG under 5MB. Keep important content centered and allow ~60px padding on all sides to prevent cropping in previews.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "twitterImage",
      title: "Twitter Card Image",
      type: "image",
      group: "basic",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Short description for accessibility and SEO",
        },
      ],
      description:
        "Recommended minimum: 1200 x 600px (1.91:1). Use JPG/PNG under 5MB. Keep key content centered with ~60px padding to avoid cropping in Twitter previews.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "phoneNumbers",
      title: "Phone Numbers",
      type: "array",
      group: "contact",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "number",
              title: "Phone Number",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "label",
              title: "Label (optional)",
              type: "string",
              description: "e.g., 'Primary', 'Secondary', 'WhatsApp'",
            },
          ],
        },
      ],
    },
    {
      name: "emails",
      title: "Email Addresses",
      type: "array",
      group: "contact",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "email",
              title: "Email Address",
              type: "string",
              validation: (Rule) => Rule.required().email(),
            },
            {
              name: "label",
              title: "Label (optional)",
              type: "string",
              description: "e.g., 'General', 'Support', 'Bookings'",
            },
          ],
        },
      ],
    },
    {
      name: "address",
      title: "Address",
      type: "object",
      group: "contact",
      fields: [
        {
          name: "street",
          title: "Street Address",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "city",
          title: "City",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "state",
          title: "State",
          type: "string",
        },
        {
          name: "postalCode",
          title: "Postal Code",
          type: "string",
        },
        {
          name: "country",
          title: "Country",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
      ],
    },
    {
      name: "socialMedia",
      title: "Social Media Links",
      type: "array",
      group: "social",
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
                  { title: "Twitter (X)", value: "twitter" },
                  { title: "YouTube", value: "youtube" },
                  { title: "Instagram", value: "instagram" },
                  { title: "Facebook", value: "facebook" },
                  { title: "WhatsApp", value: "whatsapp" },
                  { title: "LinkedIn", value: "linkedin" },
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
            {
              name: "label",
              title: "Label (optional)",
              type: "string",
              description: "Custom label for the social media link",
            },
          ],
          preview: {
            select: {
              title: "platform",
              subtitle: "url",
            },
            prepare(selection) {
              const { title, subtitle } = selection;
              return {
                title: title?.charAt(0).toUpperCase() + title?.slice(1),
                subtitle: subtitle,
              };
            },
          },
        },
      ],
      description:
        "Add your social media profiles. Only platforms with URLs will be displayed.",
    },
    {
      name: "footerLegalLinks",
      title: "Footer Legal Links",
      type: "array",
      group: "content",
      of: [
        {
          type: "reference",
          to: [{ type: "legal" }],
        },
      ],
      description:
        "Select and order legal documents to be displayed in the footer links. Only legal documents added in this list will appear in the footer.",
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
});
