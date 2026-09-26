import { defineQuery } from "next-sanity";

export const SITE_CONFIG_QUERY = defineQuery(`
  *[_type == "siteConfig"][0] {
    _id,
    title,
    description,
    footerBlurb,
    ogImage {
      asset->,
      hotspot,
      crop,
      alt
    },
    twitterImage {
      asset->,
      hotspot,
      crop,
      alt
    },
    logo {
      asset->,
      hotspot,
      crop,
      alt
    },
    favicon {
      asset->,
      hotspot,
      crop,
      alt
    },
    heroName,
    heroRoles,
    heroImage {
      asset->,
      hotspot,
      crop,
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
      hotspot,
      crop,
      alt
    },
    testimonialsHeadingLead,
    testimonialsHeadingHighlight,
    testimonialsIntro,
    phoneNumbers[] {
      number,
      label
    },
    emails[] {
      email,
      label
    },
    contactNotificationEmail,
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
      label,
      description
    },
    resumePdf {
      asset->
    },
    rickrollAudio {
      asset->
    }
  }
`);

/**
 * The /about page's copy, kept out of SITE_CONFIG_QUERY on purpose.
 *
 * SITE_CONFIG_QUERY is fetched by the shared (static) layout, so it runs on
 * every route. Folding ten about-only fields (one of them dereferencing a full
 * image asset) into it would put that payload on pages that never render it.
 * /about fetches this alongside the others in one Promise.all, so the extra
 * round trip costs essentially nothing.
 */
export const ABOUT_PAGE_QUERY = defineQuery(`
  *[_type == "siteConfig"][0] {
    aboutPageHeadingLead,
    aboutPageHeadingHighlight,
    aboutPageIntro,
    aboutPageStoryHeadingLead,
    aboutPageStoryHeadingHighlight,
    aboutPageStoryHeadingTrail,
    aboutPageStory,
    aboutPageValuesHeading,
    aboutPageValuesIntro,
    aboutPagePortrait {
      asset->,
      hotspot,
      crop,
      alt
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
    _updatedAt,
    seo {
      noindex
    }
  }
`);

export const LEGAL_DOCUMENT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "legal" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    content[] {
      ...,
      _type == "image" => {
        asset->,
        hotspot,
        crop,
        alt
      }
    },
    _createdAt,
    _updatedAt,
    seo {
      metaTitle,
      noindex
    }
  }
`);

export const FEATURED_SKILLS_QUERY = defineQuery(`
  *[_type == "skill" && featured == true] | order(orderRank asc, name asc) {
    _id,
    name,
    icon {
      asset->,
      hotspot,
      crop,
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
      hotspot,
      crop,
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
    icon,
    illustration {
      asset->,
      hotspot,
      crop,
      alt
    }
  }
`);

/**
 * Resolves service document IDs to their display names — used by the contact
 * form's notification email to render human-readable service names instead
 * of the raw `_id`s the client submits (see service-multi-select.tsx, which
 * only keeps IDs in committed form state).
 */
export const SERVICES_BY_IDS_QUERY = defineQuery(`
  *[_type == "service" && _id in $ids] {
    _id,
    name
  }
`);

/**
 * The six core values on /about.
 *
 * `asset->` is dereferenced in full, not just for the URL: every illustration is
 * an SVG, and ValueCard reads `metadata.dimensions` off the asset to declare the
 * real aspect ratio. Sanity ignores w/h/rect for SVGs and serves the original
 * file, so assuming a square here produces a Next.js aspect-ratio warning —
 * the same trap already documented in ServiceCard.
 */
export const VALUES_QUERY = defineQuery(`
  *[_type == "value"] | order(orderRank asc) {
    _id,
    title,
    description,
    illustration {
      asset->,
      hotspot,
      crop,
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
        hotspot,
        crop,
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
        hotspot,
        crop,
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
        hotspot,
        crop,
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

export const CERTIFICATIONS_QUERY = defineQuery(`
  *[_type == "certification" && archived != true] | order(orderRank asc) {
    _id,
    title,
    organization-> {
      _id,
      name,
      website,
      logo {
        asset->,
        hotspot,
        crop,
        alt
      }
    },
    issuedAt,
    credentialId,
    verifyUrl
  }
`);

export const ARCHIVED_CERTIFICATIONS_QUERY = defineQuery(`
  *[_type == "certification" && archived == true] | order(orderRank asc) {
    _id,
    title,
    organization-> {
      _id,
      name,
      website,
      logo {
        asset->,
        hotspot,
        crop,
        alt
      }
    },
    issuedAt,
    credentialId,
    verifyUrl
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
      hotspot,
      crop,
      alt
    },
    coverImage {
      asset->,
      hotspot,
      crop,
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
      hotspot,
      crop,
      alt
    },
    coverImage {
      asset->,
      hotspot,
      crop,
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
    body[] {
      ...,
      _type == "image" => {
        asset->,
        hotspot,
        crop,
        alt
      }
    },
    archived,
    icon {
      asset->,
      hotspot,
      crop,
      alt
    },
    coverImage {
      asset->,
      hotspot,
      crop,
      alt
    },
    gallery[] {
      asset->,
      hotspot,
      crop,
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
        hotspot,
        crop,
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
    collaborators[] {
      contribution,
      person-> {
        _id,
        name,
        photo {
          asset->,
          hotspot,
          crop,
          alt
        },
        position,
        organization-> {
          _id,
          name
        },
        organizationName
      }
    },
    relatedProjects[]-> {
      _id,
      title,
      slug,
      tagline,
      kind,
      coverImage {
        asset->,
        hotspot,
        crop,
        alt
      }
    },
    links[] {
      label,
      url,
      type
    },
    githubRepo,
    startDate,
    completedAt,
    _updatedAt,
    seo {
      metaTitle,
      noindex
    }
  }
`);

/**
 * Slugs for `generateStaticParams`, and the ordered list the project page uses
 * to resolve its previous/next neighbours. Also the source for the sitemap's
 * project entries — `_updatedAt` and `seo.noindex` are projected here so
 * `sitemap.ts` can use a real lastmod and skip noindexed projects without a
 * second query.
 */
export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)] | order(orderRank asc) {
    _id,
    title,
    slug,
    coverImage {
      asset->,
      hotspot,
      crop,
      alt
    },
    _updatedAt,
    seo {
      noindex
    }
  }
`);

/**
 * Shared projection for a testimonial and the person who gave it.
 *
 * `author->` is dereferenced so one `person` document can back several
 * testimonials without any identity field being re-authored per quote — the
 * duplication v1 carried for Diveakssh Schae's two entries.
 *
 * `organization->` is dereferenced one level further for the logo, with
 * `organizationName` as the flat fallback for people whose company has no
 * Organization document of its own. The card picks whichever is present.
 *
 * Both images project `hotspot`/`crop` alongside `asset->` and `alt`: the
 * headshot is rendered through `.fit("crop")`, and omitting them degrades every
 * crop to a blind center-crop that cuts faces off — see
 * docs/runbooks/sanity-workflow.md.
 */
const TESTIMONIAL_FIELDS = `
  _id,
  quote,
  context,
  givenAt,
  author-> {
    _id,
    name,
    position,
    website,
    organizationName,
    photo {
      asset->,
      hotspot,
      crop,
      alt
    },
    organization-> {
      _id,
      name,
      website,
      logo {
        asset->,
        hotspot,
        crop,
        alt
      }
    }
  }
`;

/**
 * Every testimonial, in Studio drag order — for a future dedicated surface.
 */
export const TESTIMONIALS_QUERY = defineQuery(`
  *[_type == "testimonial"] | order(orderRank asc) {
    ${TESTIMONIAL_FIELDS}
  }
`);

/**
 * The home page carousel: curated in the Studio via `featured`.
 *
 * Unlike FEATURED_PROJECTS_QUERY there is no `[0...n]` ceiling. The carousel
 * shows one quote at a time and its dot indicator is windowed, so the section's
 * footprint is constant no matter how many are flagged — the reason a slice was
 * needed for the project grid (a ragged final row) does not arise here.
 *
 * `featured` is also the intended lever for quotes that shouldn't lead the home
 * page — the quote text itself is a third party's words and is never edited.
 */
export const FEATURED_TESTIMONIALS_QUERY = defineQuery(`
  *[_type == "testimonial" && featured == true] | order(orderRank asc) {
    ${TESTIMONIAL_FIELDS}
  }
`);

/**
 * Shared author projection for `post` and `journalEntry`.
 *
 * Only the fields a byline/author-card actually needs — not the full
 * `person` document (position/organization are testimonial-specific and
 * don't apply to a writing byline).
 */
const WRITING_AUTHOR_FIELDS = `
  author-> {
    _id,
    name,
    photo {
      asset->,
      hotspot,
      crop,
      alt
    },
    website,
    socials[] {
      platform,
      url
    }
  }
`;

/**
 * Shared listing-card projection for `post` and `journalEntry`.
 *
 * Deliberately excludes `body` — the listing page never renders full post
 * content, only cards, so projecting the whole portable-text array would
 * bloat every paginated page's payload for no rendering benefit (same
 * reasoning as \`"hasBody": defined(body)\` on FEATURED_PROJECTS_QUERY).
 */
const WRITING_CARD_FIELDS = `
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  "hasBody": defined(body),
  coverImage {
    asset->,
    hotspot,
    crop,
    alt
  },
  ${WRITING_AUTHOR_FIELDS},
  tags[]-> {
    _id,
    name,
    slug
  }
`;

/**
 * Full single-document projection for `post` and `journalEntry` detail pages.
 */
const WRITING_DETAIL_FIELDS = `
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  body[] {
    ...,
    _type == "image" => {
      asset->,
      hotspot,
      crop,
      alt
    }
  },
  coverImage {
    asset->,
    hotspot,
    crop,
    alt
  },
  ogImage {
    asset->,
    hotspot,
    crop,
    alt
  },
  ${WRITING_AUTHOR_FIELDS},
  tags[]-> {
    _id,
    name,
    slug
  },
  _updatedAt,
  seo {
    metaTitle,
    noindex
  }
`;

/**
 * The listing filter every /blog, /journal and /tags/<slug> query shares:
 * \`$tagSlug\`/\`$search\` are both nullable, and \`null in [...]\` / a \`null\`
 * \`match\` target both evaluate to \`false\` in GROQ — so passing null for
 * either simply matches everything, letting one query serve the unfiltered
 * listing, a tag archive, a search, and any combination of the two, rather
 * than a separate query per combination.
 */
const WRITING_FILTER = `
  (!defined($tagSlug) || $tagSlug in tags[]->slug.current) &&
  (!defined($search) || title match $search + "*" || excerpt match $search + "*")
`;

/**
 * One page of blog posts, newest first, optionally filtered by tag and/or a
 * search term. \`$start\`/\`$end\` are the GROQ slice bounds (e.g. 0 and 9 for
 * a 9-per-page first page) — pagination is numbered and server-rendered, not
 * client-side "fetch everything and slice," since the post count is expected
 * to grow indefinitely over time (unlike /projects, which fetches its whole
 * — bounded — list at once). Pass \`null\` for \`$tagSlug\`/\`$search\` to skip
 * that filter.
 */
export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && ${WRITING_FILTER}] | order(publishedAt desc) [$start...$end] {
    ${WRITING_CARD_FIELDS}
  }
`);

/**
 * Total matching post count, for computing page count alongside POSTS_QUERY
 * — same \`$tagSlug\`/\`$search\` params, no slice.
 */
export const POST_COUNT_QUERY = defineQuery(`
  count(*[_type == "post" && ${WRITING_FILTER}])
`);

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    ${WRITING_DETAIL_FIELDS}
  }
`);

/**
 * Slugs (+ publishedAt, for prev/next ordering) for \`generateStaticParams\`
 * and the detail page's previous/next neighbour resolution — mirrors
 * PROJECT_SLUGS_QUERY. Also the source for the sitemap's post entries —
 * \`_updatedAt\` and \`seo.noindex\` are projected here for the same reason as
 * PROJECT_SLUGS_QUERY.
 */
export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    _updatedAt,
    seo {
      noindex
    }
  }
`);

/**
 * The five most recent posts, for the detail page sidebar's "Latest
 * Articles" panel. Capped, unlike POSTS_QUERY, since the sidebar always
 * shows a short fixed list regardless of total post count.
 */
export const LATEST_POSTS_QUERY = defineQuery(`
  *[_type == "post"] | order(publishedAt desc) [0...5] {
    _id,
    title,
    slug,
    publishedAt
  }
`);

/**
 * Journal entry equivalent of the post queries above — same shape and same
 * \`$tagSlug\`/\`$search\` filter, separate collection. See postType.ts /
 * journalEntryType.ts for why the two stay distinct document types despite
 * the identical field set.
 */
export const JOURNAL_ENTRIES_QUERY = defineQuery(`
  *[_type == "journalEntry" && ${WRITING_FILTER}] | order(publishedAt desc) [$start...$end] {
    ${WRITING_CARD_FIELDS}
  }
`);

export const JOURNAL_ENTRY_COUNT_QUERY = defineQuery(`
  count(*[_type == "journalEntry" && ${WRITING_FILTER}])
`);

export const JOURNAL_ENTRY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "journalEntry" && slug.current == $slug][0] {
    ${WRITING_DETAIL_FIELDS}
  }
`);

export const JOURNAL_ENTRY_SLUGS_QUERY = defineQuery(`
  *[_type == "journalEntry" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    _updatedAt,
    seo {
      noindex
    }
  }
`);

export const LATEST_JOURNAL_ENTRIES_QUERY = defineQuery(`
  *[_type == "journalEntry"] | order(publishedAt desc) [0...5] {
    _id,
    title,
    slug,
    publishedAt
  }
`);

/**
 * Every tag, for filter chips on /blog and /journal and for resolving a tag's
 * name/description on its /tags/<slug> archive page.
 */
export const TAGS_QUERY = defineQuery(`
  *[_type == "tag"] | order(name asc) {
    _id,
    name,
    slug,
    description,
    _updatedAt
  }
`);

export const TAG_BY_SLUG_QUERY = defineQuery(`
  *[_type == "tag" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description
  }
`);

/**
 * One page of a tag archive: posts and journal entries carrying the tag,
 * combined into one publishedAt-ordered feed — a tag is shared across both
 * content types (see tagType.ts), so its archive page shows both rather
 * than picking one. \`"kind"\` lets the page route each card to the right
 * href prefix without a second lookup.
 */
export const WRITING_BY_TAG_QUERY = defineQuery(`
  *[(_type == "post" || _type == "journalEntry") && $tagSlug in tags[]->slug.current] | order(publishedAt desc) [$start...$end] {
    "kind": _type,
    ${WRITING_CARD_FIELDS}
  }
`);

export const WRITING_COUNT_BY_TAG_QUERY = defineQuery(`
  count(*[(_type == "post" || _type == "journalEntry") && $tagSlug in tags[]->slug.current])
`);
