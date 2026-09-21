import { defineField, defineType } from "sanity";
import { CheckmarkCircleIcon } from "@sanity/icons/CheckmarkCircle";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

/**
 * A course or credential completed outside of formal education/employment.
 *
 * Issuer is a reference to `organization` rather than an embedded field —
 * the same reasoning as `experience.organization`: Coursera, Pirple, and
 * Anthropic Academy each issue more than one certification here, so the
 * logo and link live once and every certification just points at it.
 *
 * `archived` does not affect an individual card's styling — it decides which
 * page section the certification renders in (current vs. archived), mirroring
 * how `experience.kind` routes a document to a different block on /experience
 * rather than flagging it inline.
 */
export const certificationType = defineType({
  name: "certification",
  title: "Certification",
  type: "document",
  icon: CheckmarkCircleIcon,
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        "The certification's name, exactly as issued. Example: 'SQL for Data Science'.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "organization",
      title: "Issuing Organization",
      type: "reference",
      to: [{ type: "organization" }],
      description:
        "Who issued this certification. Its logo is the primary visual on the certification card — create the Organization once and reference it from each certification it issued.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "issuedAt",
      title: "Issued",
      type: "date",
      options: { dateFormat: "MMMM YYYY" },
      description:
        "When the certification was issued. Only the month and year are shown on the site.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "credentialId",
      title: "Credential ID",
      type: "string",
      description:
        "The issuer's credential/certificate ID, if it has one. Shown in small print on the card. Leave empty if the issuer doesn't expose one.",
    }),
    defineField({
      name: "verifyUrl",
      title: "Verify URL",
      type: "url",
      description:
        "Link to the credential's official verification or view page, including https://. Renders as a 'View credential' link on the card. Leave empty if there's no public verification page.",
    }),
    defineField({
      name: "archived",
      title: "Archived",
      type: "boolean",
      description:
        "Renders this certification in the page's separate 'Archived' section instead of the main list — for certifications that are no longer listed on LinkedIn or elsewhere, but are still worth keeping a record of. Does not change how the card itself looks.",
      initialValue: false,
    }),
    orderRankField({ type: "certification" }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "organization.name",
      media: "organization.logo",
    },
  },
});
