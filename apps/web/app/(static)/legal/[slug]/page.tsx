import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PortableText } from "@portabletext/react"

import { Container } from "@workspace/ui/components/container"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { sanityFetch } from "@workspace/sanity/live"
import {
  createCollectionTag,
  createDocumentTag,
} from "@workspace/sanity/cache-tags"
import {
  LEGAL_DOCUMENT_BY_SLUG_QUERY,
  LEGAL_DOCUMENTS_QUERY,
} from "@workspace/sanity/query"

import { portableTextComponents } from "@/components/sanity/portable-text-components"
import { JsonLd } from "@/components/shared/json-ld"
import { buildBreadcrumbListJsonLd, buildWebPageJsonLd } from "@/lib/structured-data"
import {
  cleanSanityData,
  getDynamicSanityFetchOptions,
  type SanityFetchOptions,
} from "@/lib/sanity-fetch-options"

async function getLegalDocument(slug: string, options: SanityFetchOptions) {
  const { data } = await sanityFetch({
    query: LEGAL_DOCUMENT_BY_SLUG_QUERY,
    params: { slug },
    tags: [createCollectionTag("legal"), createDocumentTag("legal", slug)],
    ...options,
  })
  return cleanSanityData(data)
}

async function getSlugs(options: SanityFetchOptions) {
  const { data } = await sanityFetch({
    query: LEGAL_DOCUMENTS_QUERY,
    tags: [createCollectionTag("legal")],
    ...options,
  })
  return cleanSanityData(data)
}

export async function generateStaticParams() {
  // Build time — draftMode() can't be called here, so always published.
  const docs = await getSlugs({ perspective: "published", stega: false })

  return (docs ?? [])
    .map((doc) => doc.slug?.current)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  // Never let stega leak into <title>/<meta> — always published, clean.
  const doc = await getLegalDocument(slug, {
    perspective: "published",
    stega: false,
  })

  if (!doc) return {}

  return {
    title: doc.seo?.metaTitle || doc.title || "Legal",
    description: doc.description ?? undefined,
    alternates: { canonical: `/legal/${slug}` },
    ...(doc.seo?.noindex && { robots: { index: false, follow: true } }),
  }
}

export default async function LegalDocumentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const doc = await getLegalDocument(slug, await getDynamicSanityFetchOptions())

  if (!doc) notFound()

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <JsonLd
        data={buildWebPageJsonLd({
          name: doc.title,
          description: doc.description,
          path: `/legal/${slug}`,
        })}
      />
      <JsonLd
        data={buildBreadcrumbListJsonLd([
          { name: "Home", path: "/" },
          { name: "Legal", path: "/legal" },
          { name: doc.title ?? "Legal", path: `/legal/${slug}` },
        ])}
      />
      <Container className="max-w-3xl">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/legal" />}>
                Legal
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{doc.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="mt-3 font-heading text-4xl leading-tight font-black sm:text-5xl">
          {doc.title}
        </h1>

        {doc.description && (
          <p className="mt-4 text-base leading-relaxed text-body-foreground md:text-lg">
            {doc.description}
          </p>
        )}

        <article className="mt-10">
          <PortableText
            value={doc.content}
            components={portableTextComponents}
          />
        </article>
      </Container>
    </main>
  )
}
