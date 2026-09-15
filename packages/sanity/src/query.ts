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
    aboutHeadingLead,
    aboutHeadingHighlight,
    aboutBody,
    aboutHighlights[] {
      title,
      description
    },
    aboutImage {
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
    },
    resumePdf {
      asset->
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

/**
 * The condensed home page section: work roles only, flagged in the Studio.
 * Deliberately projects `summary` and not `highlights` — the home section
 * shows one line per role, and the bullets belong to the full page.
 */
export const FEATURED_EXPERIENCES_QUERY = defineQuery(`
  *[_type == "experience" && kind == "work" && featured == true] | order(orderRank asc) {
    _id,
    role,
    organization-> {
      _id,
      name,
      website,
      logo {
        asset->,
        alt
      }
    },
    employmentType,
    startDate,
    endDate,
    isCurrent,
    summary
  }
`);

/**
 * The full timeline on /resume — work and community roles in Studio order.
 * Education is excluded here and fetched separately so it renders as its own
 * block rather than being interleaved into the work history.
 */
export const EXPERIENCES_QUERY = defineQuery(`
  *[_type == "experience" && kind in ["work", "community"]] | order(orderRank asc) {
    _id,
    role,
    kind,
    organization-> {
      _id,
      name,
      website,
      description,
      logo {
        asset->,
        alt
      }
    },
    employmentType,
    workMode,
    location,
    startDate,
    endDate,
    isCurrent,
    summary,
    highlights,
    skills[]-> {
      _id,
      name
    },
    links[] {
      label,
      url,
      type
    }
  }
`);

export const EDUCATION_QUERY = defineQuery(`
  *[_type == "experience" && kind == "education"] | order(orderRank asc) {
    _id,
    role,
    organization-> {
      _id,
      name,
      website,
      logo {
        asset->,
        alt
      }
    },
    location,
    startDate,
    endDate,
    isCurrent,
    summary,
    highlights,
    credential,
    links[] {
      label,
      url,
      type
    }
  }
`);

export const PUBLICATIONS_QUERY = defineQuery(`
  *[_type == "publication"] | order(orderRank asc) {
    _id,
    title,
    venue,
    publishedAt,
    authors,
    doi,
    url,
    abstract
  }
`);
