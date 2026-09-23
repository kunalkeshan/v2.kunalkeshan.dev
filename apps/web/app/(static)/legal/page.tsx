import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Container } from "@workspace/ui/components/container"
import { cardLift, cn } from "@workspace/ui/lib/utils"
import { sanityFetch } from "@workspace/sanity/fetch"
import { createCollectionTag } from "@workspace/sanity/cache-tags"
import { LEGAL_DOCUMENTS_QUERY } from "@workspace/sanity/query"
import type { LEGAL_DOCUMENTS_QUERY_RESULT } from "@workspace/sanity/types"

import { HighlightText } from "@/components/highlight-text"

export const metadata: Metadata = {
  title: "Legal",
  description: "Privacy policy, terms, and other legal documents for this site.",
}

export default async function LegalPage() {
  const legalDocs = await sanityFetch<LEGAL_DOCUMENTS_QUERY_RESULT>({
    query: LEGAL_DOCUMENTS_QUERY,
    tags: [createCollectionTag("legal")],
  })

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <Container>
        <h1 className="font-heading text-4xl leading-tight font-black text-balance sm:text-5xl">
          The fine print,{" "}
          <HighlightText variant="primary">plainly stated</HighlightText>
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-body-foreground md:text-lg">
          Privacy policy, terms, and any other legal documents for this site.
        </p>

        <div className="mt-10">
          {legalDocs && legalDocs.length > 0 ? (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {legalDocs.map((doc) =>
                doc.slug?.current ? (
                  <li key={doc._id}>
                    <Link
                      href={`/legal/${doc.slug.current}`}
                      className={cn(
                        "group flex h-full flex-col justify-between gap-3 rounded-lg border-3 border-border bg-card p-5",
                        cardLift,
                        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                      )}
                    >
                      <div>
                        <h2 className="font-heading text-lg font-black">
                          {doc.title}
                        </h2>
                        {doc.description && (
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {doc.description}
                          </p>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-secondary">
                        Read more
                        <ArrowRightIcon
                          className="size-4 transition-transform duration-press ease-snap group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  </li>
                ) : null
              )}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No legal documents published yet.
            </p>
          )}
        </div>
      </Container>
    </main>
  )
}
