import { defineQuery } from "next-sanity";

export const SITE_CONFIG_QUERY = defineQuery(`
  *[_type == "siteConfig"][0] {
    _id,
    title,
    description,
    ogImage {
      asset->,
      alt
    },
    twitterImage {
      asset->,
      alt
    },
    logo {
      asset->,
      alt
    },
    heroName,
    heroRoles,
    heroImage {
      asset->,
      alt
    },
    phoneNumbers[] {
      number,
      label
    },
    emails[] {
      email,
      label
    },
    address {
      street,
      city,
      state,
      postalCode,
      country
    },
    socialMedia[] {
      platform,
      url,
      label
    }
  }
`);

export const FOOTER_LEGAL_LINKS_QUERY = defineQuery(`
  *[_type == "siteConfig"][0].footerLegalLinks[]-> {
    _id,
    title,
    slug,
    description,
    _updatedAt
  }
`);

export const FAQS_QUERY = defineQuery(`
  *[_type == "faqs"][0] {
    ...,
    faqItems[]{ ... }
  }
`);

export const LEGAL_DOCUMENTS_QUERY = defineQuery(`
  *[_type == "legal"] | order(_updatedAt desc) {
    _id,
    title,
    slug,
    description,
    _createdAt,
    _updatedAt
  }
`);

export const LEGAL_DOCUMENT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "legal" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    content,
    _createdAt,
    _updatedAt
  }
`);

export const FEATURED_SKILLS_QUERY = defineQuery(`
  *[_type == "skill" && featured == true] | order(orderRank asc, name asc) {
    _id,
    name,
    icon {
      asset->,
      alt
    },
    category
  }
`);

export const SKILLS_QUERY = defineQuery(`
  *[_type == "skill"] | order(category asc, orderRank asc, name asc) {
    _id,
    name,
    icon {
      asset->,
      alt
    },
    category
  }
`);

export const SERVICES_QUERY = defineQuery(`
  *[_type == "service"] | order(orderRank asc) {
    _id,
    name,
    description,
    illustration {
      asset->,
      alt
    }
  }
`);
