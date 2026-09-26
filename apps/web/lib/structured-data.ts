/**
 * Builds schema.org JSON-LD objects (typed via schema-dts) from data already
 * fetched for a page's normal rendering — never issue a new Sanity fetch
 * solely for structured data. Render the result with
 * components/shared/json-ld.tsx. Every property is omitted entirely (never
 * null/""/[]) when its source is empty, so emitted JSON-LD stays valid per
 * schema.org's "missing = unknown" semantics. See docs/seo.md.
 *
 * Every `build*JsonLd` function below returns `WithContext<T>` from
 * schema-dts and takes parameters typed from the generated Sanity query
 * result types (`@workspace/sanity/types`) — never a hand-typed/duplicated
 * shape, never `any`. Fix the data mapping if a type error surfaces here;
 * `as any`/`as unknown as X` are not acceptable escape hatches on this file.
 */
import type {
  Article,
  BreadcrumbList,
  CollectionPage,
  CreativeWork,
  FAQPage,
  ListItem,
  Person,
  ProfilePage,
  Service,
  WebPage,
  WebSite,
  WithContext,
} from "schema-dts";

import { urlFor } from "@workspace/sanity/image";
import type {
  FAQS_QUERY_RESULT,
  POST_BY_SLUG_QUERY_RESULT,
  PROJECT_BY_SLUG_QUERY_RESULT,
  SERVICES_QUERY_RESULT,
  SITE_CONFIG_QUERY_RESULT,
} from "@workspace/sanity/types";

import { SITE_CONFIG } from "@/config/site";

/** Narrowed to the fields every writing detail query (post/journalEntry) shares. */
type WritingDetail = POST_BY_SLUG_QUERY_RESULT;

function absoluteUrl(path: string): string {
  return `${SITE_CONFIG.URL}${path}`;
}

/** Extracts non-empty URLs from any array of `{ url: string | null }`-shaped objects. */
function urlsOf(links: { url: string | null }[] | null | undefined): string[] {
  return (links ?? [])
    .map((link) => link.url)
    .filter((url): url is string => Boolean(url));
}

/**
 * The Person entity for Kunal, built from the `siteConfig` singleton — used
 * as the homepage/`/about` subject, `WebSite.author`, and every
 * `Article.author`.
 */
export function buildPersonJsonLd(
  siteConfig: SITE_CONFIG_QUERY_RESULT
): WithContext<Person> {
  const image = siteConfig?.heroImage?.asset
    ? urlFor(siteConfig.heroImage).width(800).height(800).fit("crop").url()
    : undefined;
  const sameAs = urlsOf(siteConfig?.socialMedia);
  const email = siteConfig?.emails?.[0]?.email ?? undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_CONFIG.URL}/about#person`,
    url: absoluteUrl("/about"),
    ...(siteConfig?.heroName && { name: siteConfig.heroName }),
    ...(siteConfig?.description && { description: siteConfig.description }),
    ...(image && { image }),
    ...(email && { email }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

/** The `WebSite` entity for the home page. */
export function buildWebSiteJsonLd(
  siteConfig: SITE_CONFIG_QUERY_RESULT
): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.URL}#website`,
    url: SITE_CONFIG.URL,
    ...(siteConfig?.title && { name: siteConfig.title }),
    ...(siteConfig?.description && { description: siteConfig.description }),
    author: { "@id": `${SITE_CONFIG.URL}/about#person` },
  };
}

/** `/about` — wraps the Person entity as the subject of the page. */
export function buildProfilePageJsonLd(
  siteConfig: SITE_CONFIG_QUERY_RESULT
): WithContext<ProfilePage> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: absoluteUrl("/about"),
    ...(siteConfig?.heroName && { name: siteConfig.heroName }),
    mainEntity: { "@id": `${SITE_CONFIG.URL}/about#person` },
  };
}

/**
 * `/blog/[slug]` and `/journal/[slug]` — both document types share the exact
 * same detail-query shape (see writingFields.ts), so one builder covers both.
 */
export function buildArticleJsonLd(
  post: WritingDetail,
  path: string
): WithContext<Article> {
  const image = post?.coverImage?.asset
    ? urlFor(post.coverImage).width(1200).height(630).fit("crop").url()
    : post?.ogImage?.asset
      ? urlFor(post.ogImage).width(1200).height(630).fit("crop").url()
      : undefined;
  const authorSameAs = urlsOf(post?.author?.socials);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": absoluteUrl(path),
    url: absoluteUrl(path),
    ...(post?.title && { headline: post.title }),
    ...(post?.excerpt && { description: post.excerpt }),
    ...(image && { image }),
    ...(post?.publishedAt && { datePublished: post.publishedAt }),
    ...(post?._updatedAt && { dateModified: post._updatedAt }),
    ...(post?.author?.name && {
      author: {
        "@type": "Person",
        name: post.author.name,
        ...(post.author.website && { url: post.author.website }),
        ...(authorSameAs.length > 0 && { sameAs: authorSameAs }),
      },
    }),
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
  };
}

/** `/projects/[slug]` — mapped as a CreativeWork (no single schema.org type fits a portfolio project better). */
export function buildCreativeWorkJsonLd(
  project: PROJECT_BY_SLUG_QUERY_RESULT,
  path: string
): WithContext<CreativeWork> {
  const image = project?.coverImage?.asset
    ? urlFor(project.coverImage).width(1200).height(630).fit("crop").url()
    : undefined;
  const keywords = (project?.skills ?? [])
    .map((skill) => skill.name)
    .filter((name): name is string => Boolean(name));
  const sameAs = (project?.links ?? [])
    .map((link) => link.url)
    .filter((url): url is string => Boolean(url));
  const contributors = (project?.collaborators ?? [])
    .map((entry) => entry.person?.name)
    .filter((name): name is string => Boolean(name));

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": absoluteUrl(path),
    url: absoluteUrl(path),
    ...(project?.title && { name: project.title }),
    ...(project?.summary && { description: project.summary }),
    ...(image && { image }),
    ...(project?.startDate && { dateCreated: project.startDate }),
    ...((project?.completedAt ?? project?._updatedAt) && {
      dateModified: project.completedAt ?? project._updatedAt,
    }),
    ...(keywords.length > 0 && { keywords: keywords.join(", ") }),
    ...(sameAs.length > 0 && { sameAs }),
    ...(project?.organization?.name && {
      creator: { "@type": "Person", "@id": `${SITE_CONFIG.URL}/about#person` },
    }),
    ...(contributors.length > 0 && {
      contributor: contributors.map((name) => ({
        "@type": "Person" as const,
        name,
      })),
    }),
  };
}

/** `/services` — one Service entity per offering, provider is always Kunal. */
export function buildServiceJsonLd(
  services: SERVICES_QUERY_RESULT,
  path: string
): { id: string; jsonLd: WithContext<Service> }[] {
  return services
    .filter((service) => service.name)
    .map((service) => ({
      id: service._id,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Service",
        url: absoluteUrl(path),
        name: service.name as string,
        ...(service.description && { description: service.description }),
        provider: { "@id": `${SITE_CONFIG.URL}/about#person` },
      },
    }));
}

/** `/contact` — the FAQ accordion, from the `faqs` singleton. */
export function buildFAQPageJsonLd(
  faqs: FAQS_QUERY_RESULT
): WithContext<FAQPage> | null {
  const items = (faqs?.faqItems ?? []).filter(
    (item): item is { question: string; answer: string; _key: string } =>
      Boolean(item.question && item.answer)
  );
  if (items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** Generic breadcrumb helper, used on every detail/nested page. */
export function buildBreadcrumbListJsonLd(
  items: { name: string; path: string }[]
): WithContext<BreadcrumbList> {
  const itemListElement: ListItem[] = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}

/** Generic listing-page helper — /projects, /blog, /journal, /work, /skills, /certifications, /tags/[tag]. */
export function buildCollectionPageJsonLd(params: {
  name: string;
  description?: string | null;
  path: string;
  items?: { name: string; path: string }[];
}): WithContext<CollectionPage> {
  const { name, description, path, items } = params;
  const itemListElement: ListItem[] | undefined = items?.length
    ? items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      }))
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: absoluteUrl(path),
    name,
    ...(description && { description }),
    ...(itemListElement && {
      mainEntity: {
        "@type": "ItemList",
        itemListElement,
      },
    }),
  };
}

/** Generic fallback for static content pages that don't warrant a more specific type. */
export function buildWebPageJsonLd(params: {
  name?: string | null;
  description?: string | null;
  path: string;
}): WithContext<WebPage> {
  const { name, description, path } = params;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: absoluteUrl(path),
    ...(name && { name }),
    ...(description && { description }),
  };
}
