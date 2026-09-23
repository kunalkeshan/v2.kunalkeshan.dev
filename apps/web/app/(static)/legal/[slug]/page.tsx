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
import { sanityFetch } from "@workspace/sanity/fetch"
import {
  createCollectionTag,
  createDocumentTag,
} from "@workspace/sanity/cache-tags"
import {
  LEGAL_DOCUMENT_BY_SLUG_QUERY,
  LEGAL_DOCUMENTS_QUERY,
} from "@workspace/sanity/query"
import type {
  LEGAL_DOCUMENTS_QUERY_RESULT,
  LEGAL_DOCUMENT_BY_SLUG_QUERY_RESULT,
} from "@workspace/sanity/types"

import { portableTextComponents } from "@/components/sanity/portable-text-components"

async function getLegalDocument(slug: string) {
  return sanityFetch<LEGAL_DOCUMENT_BY_SLUG_QUERY_RESULT>({
    query: LEGAL_DOCUMENT_BY_SLUG_QUERY,
    params: { slug },
    tags: [createCollectionTag("legal"), createDocumentTag("legal", slug)],
  })
}

async function getSlugs() {
  return sanityFetch<LEGAL_DOCUMENTS_QUERY_RESULT>({
    query: LEGAL_DOCUMENTS_QUERY,
    tags: [createCollectionTag("legal")],
  })
}

export async function generateStaticParams() {
  const docs = await getSlugs()

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
  const doc = await getLegalDocument(slug)

  if (!doc) return {}

  return {
    title: doc.title ?? "Legal",
    description: doc.description ?? undefined,
  }
}

export default async function LegalDocumentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const doc = await getLegalDocument(slug)

  if (!doc) notFound()

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
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
