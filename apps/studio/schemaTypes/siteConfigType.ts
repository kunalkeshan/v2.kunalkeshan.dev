import { defineType } from "sanity";
import { CogIcon } from "@sanity/icons/Cog";

export const siteConfigType = defineType({
  name: "siteConfig",
  title: "Site Configuration",
  type: "document",
  icon: CogIcon,
  groups: [
    {
      name: "basic",
      title: "Basic Information",
      default: true,
    },
    {
      name: "hero",
      title: "Hero Section",
    },
    {
      name: "about",
      title: "About Section (Home)",
    },
    {
      name: "aboutPage",
      title: "About Page",
    },
    {
      name: "testimonials",
      title: "Testimonials Section (Home)",
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
      description:
        "Used for SEO/meta <title> and social previews. Can differ from the Hero Name shown on the page (e.g. include a tagline).",
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
      name: "logo",
      title: "Logo",
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
        "Shown in the navbar, mobile menu, and footer. Square image recommended.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "heroName",
      title: "Hero Name",
      type: "string",
      group: "hero",
      description: "The large name shown in the Hero section headline.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "heroRoles",
      title: "Hero Rotating Roles",
      type: "array",
      group: "hero",
      of: [{ type: "string" }],
      description:
        "Short taglines that rotate below the Hero name (e.g. 'Building, steadily').",
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "hero",
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
      description: "The illustration shown alongside the Hero headline.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "aboutHeadingLead",
      title: "About Heading (lead)",
      type: "string",
      group: "about",
      description:
        "The un-highlighted first half of the About heading, e.g. 'Wait a minute,'.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "aboutHeadingHighlight",
      title: "About Heading (highlighted)",
      type: "string",
      group: "about",
      description:
        "The highlighted second half of the About heading, e.g. 'who am I?'. Rendered with the animated highlighter sweep.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "aboutBody",
      title: "About Body",
      type: "text",
      group: "about",
      rows: 4,
      description: "The main paragraph shown in the About section.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "aboutHighlights",
      title: "About Highlights",
      type: "array",
      group: "about",
      description:
        "The bulleted points below the About paragraph. Swatch colors alternate automatically.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
            },
          },
        },
      ],
    },
    {
      name: "aboutImage",
      title: "About Image",
      type: "image",
      group: "about",
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
      description:
        "The portrait shown alongside the About copy. Rendered as a circle, so a square-ish image with the subject centered works best.",
      validation: (Rule) => Rule.required(),
    },
    /*
     * The `aboutPage` group below feeds the standalone /about page, and is
     * deliberately separate from the `about` group above, which feeds the short
     * two-column strip on the home page. They are different lengths for
     * different surfaces — `aboutBody` is one paragraph, `aboutPageStory` is
     * several — and merging them into one group made it impossible to tell in
     * the Studio which field lands where.
     */
    {
      name: "aboutPageHeadingLead",
      title: "About Page — Heading Lead",
      type: "string",
      group: "aboutPage",
      description:
        "The un-highlighted first half of the /about <h1>. Example: 'Hello there! I'm'.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "aboutPageHeadingHighlight",
      title: "About Page — Heading Highlight",
      type: "string",
      group: "aboutPage",
      description:
        "The highlighted second half of the <h1>, drawn with the highlighter sweep. Example: 'Kunal Keshan'.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "aboutPageIntro",
      title: "About Page — Intro",
      type: "text",
      group: "aboutPage",
      rows: 3,
      description:
        "The paragraph directly under the <h1>. One or two sentences framing what the page covers.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "aboutPageStoryHeadingLead",
      title: "About Page — Story Heading Lead",
      type: "string",
      group: "aboutPage",
      description:
        "Un-highlighted text before the highlight in the story <h2>. Example: 'What keeps me'.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "aboutPageStoryHeadingHighlight",
      title: "About Page — Story Heading Highlight",
      type: "string",
      group: "aboutPage",
      description: "The highlighted phrase in the story <h2>.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "aboutPageStoryHeadingTrail",
      title: "About Page — Story Heading Trail",
      type: "string",
      group: "aboutPage",
      description:
        "Optional un-highlighted text AFTER the highlight, so headings like 'My story as a developer' (highlight in the middle) are expressible. Leave empty when the highlight ends the heading.",
    },
    {
      name: "aboutPageStory",
      title: "About Page — Story",
      type: "array",
      group: "aboutPage",
      of: [{ type: "text", rows: 5 }],
      description:
        "The bio, one array entry per paragraph. Present-tense work comes first, past-tense backstory after — see docs/content/persona-and-tone.md, which requires asking before any student-era reframing. Supports a {years} placeholder, substituted server-side from BUILDING_SINCE (2021) and worded as years *building*, never years employed.",
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "aboutPageValuesHeading",
      title: "About Page — Values Heading",
      type: "string",
      group: "aboutPage",
      description:
        "The <h2> above the values grid. Plain text with no highlight — it follows the inverted marquee band, where a third highlighter sweep reads as decoration.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "aboutPageValuesIntro",
      title: "About Page — Values Intro",
      type: "text",
      group: "aboutPage",
      rows: 3,
      description: "The paragraph under the values heading.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "aboutPagePortrait",
      title: "About Page — Portrait",
      type: "image",
      group: "aboutPage",
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
      description:
        "The portrait on /about, rendered as a circle. Kept separate from the home About Image so the two surfaces can use different photos.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "testimonialsHeadingLead",
      title: "Testimonials Heading (lead)",
      type: "string",
      group: "testimonials",
      description:
        "The un-highlighted first half of the testimonials heading, e.g. 'What do clients and collaborators say'.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "testimonialsHeadingHighlight",
      title: "Testimonials Heading (highlighted)",
      type: "string",
      group: "testimonials",
      description:
        "The highlighted second half, e.g. 'about me'. Rendered with the highlighter sweep in blue — the home page's other sweeps are orange, and the two alternate.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "testimonialsIntro",
      title: "Testimonials Intro",
      type: "text",
      rows: 3,
      group: "testimonials",
      description:
        "The lead paragraph under the heading. Your words about the testimonials as a whole — the quotes themselves are never edited.",
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
      name: "contactNotificationEmail",
      title: "Contact Form Notification Email",
      type: "string",
      group: "contact",
      description:
        "Where new /contact form submissions are sent. Not shown publicly — separate from the Email Addresses list above, which is displayed on the site.",
      validation: (Rule) => Rule.required().email(),
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
                  { title: "GitHub", value: "github" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "Twitter (X)", value: "twitter" },
                  { title: "Instagram", value: "instagram" },
                  { title: "YouTube", value: "youtube" },
                  { title: "Blog", value: "blog" },
                  { title: "Facebook", value: "facebook" },
                  { title: "WhatsApp", value: "whatsapp" },
                  { title: "Discord", value: "discord" },
                  { title: "Telegram", value: "telegram" },
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
      name: "resumePdf",
      title: "Resume PDF",
      type: "file",
      group: "content",
      options: { accept: "application/pdf" },
      description:
        "The downloadable resume offered on the /resume page. The download banner is hidden entirely while this is empty, so the page never ships a dead link.",
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
