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

/**
 * The condensed home page section: featured projects only, and never the
 * archived/earlier-work ones — those exist for the full page's lower section.
 *
 * Capped at six. The grid runs three per row, so six fills exactly two rows —
 * eight left a ragged 3/3/2. The slice is a hard ceiling rather than the only
 * control: `featured` is still curated in the Studio, and this just guarantees
 * the section can't overflow if more get flagged later. Studio drag order
 * decides which six survive the cut.
 *
 * `hasBody` rather than `body`: the card only needs to know whether to offer a
 * "Read case study" CTA, and projecting every case study's portable-text array
 * into the listing payload would bloat it for no rendering benefit.
 */
export const FEATURED_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && featured == true && archived != true] | order(orderRank asc) [0...6] {
    _id,
    title,
    slug,
    kind,
    status,
    tagline,
    summary,
    "hasBody": defined(body),
    icon {
      asset->,
      alt
    },
    coverImage {
      asset->,
      alt
    },
    organization-> {
      _id,
      name,
      website
    },
    skills[]-> {
      _id,
      name
    },
    links[] {
      label,
      url,
      type
    },
    githubRepo,
    startDate,
    completedAt
  }
`);

/**
 * Everything on /projects, in Studio drag order. `archived` is projected so the
 * page can split the main grid from the quieter "Earlier work" section without
 * a second query.
 */
export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project"] | order(orderRank asc) {
    _id,
    title,
    slug,
    kind,
    status,
    tagline,
    summary,
    "hasBody": defined(body),
    archived,
    featured,
    icon {
      asset->,
      alt
    },
    coverImage {
      asset->,
      alt
    },
    organization-> {
      _id,
      name,
      website
    },
    relatedExperience-> {
      _id,
      role,
      employmentType
    },
    skills[]-> {
      _id,
      name
    },
    links[] {
      label,
      url,
      type
    },
    githubRepo,
    startDate,
    completedAt
  }
`);

/**
 * One project page. Full projection including the case-study body and gallery,
 * plus the cross-references (`relatedExperience`, `skills`) that v1 had no way
 * of expressing.
 */
export const PROJECT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    kind,
    status,
    tagline,
    summary,
    body,
    archived,
    icon {
      asset->,
      alt
    },
    coverImage {
      asset->,
      alt
    },
    gallery[] {
      asset->,
      alt,
      caption
    },
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
    relatedExperience-> {
      _id,
      role,
      employmentType,
      startDate,
      endDate,
      isCurrent,
      organization-> {
        _id,
        name
      }
    },
    skills[]-> {
      _id,
      name,
      category
    },
    links[] {
      label,
      url,
      type
    },
    githubRepo,
    startDate,
    completedAt,
    _updatedAt
  }
`);

/**
 * Slugs for `generateStaticParams`, and the ordered list the project page uses
 * to resolve its previous/next neighbours.
 */
export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)] | order(orderRank asc) {
    _id,
    title,
    slug,
    coverImage {
      asset->,
      alt
    }
  }
`);
