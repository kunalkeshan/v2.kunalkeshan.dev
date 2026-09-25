"use client"

import Link from "next/link"
import { BadgeCheckIcon, DownloadIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { trackLinkClick } from "@/lib/analytics"
import { useReveal } from "@/hooks/use-reveal"

interface ResumeCtaProps {
  /** Absolute URL of the uploaded PDF. The banner renders nothing without one. */
  fileUrl: string | null
  /** Shown as the saved filename, e.g. "Kunal Keshan - Resume.pdf". */
  fileName?: string
  /**
   * Path to the certifications page. When set, renders a secondary
   * "See certifications" button beside the download — the two were
   * floating as separate page elements before, which read as an
   * afterthought rather than a related action.
   */
  certificationsHref?: string
}

/**
 * The download banner on /experience.
 *
 * Grown from `@efferd/cta-20`, which shipped as a finance template (concentric
 * rings behind a "Pay $0/month" headline in mono type with a pill button). The
 * expanding-rings entrance was the one idea worth keeping — it gives the page
 * a single orchestrated moment — so it stays, redrawn on `--border` and paired
 * with the house card treatment. The rest was replaced: the neobrutalist system
 * has no pill radius and no mono display type.
 *
 * Renders `null` when there's neither a resume to download nor a
 * certifications link to offer, so the page never ships an empty card. A
 * missing resume alone still renders the card for the certifications link —
 * losing that link entirely because the PDF isn't uploaded yet would be a
 * silent regression versus its previous standalone button.
 */
export function ResumeCta({
  fileUrl,
  fileName,
  certificationsHref,
}: ResumeCtaProps) {
  const { ref, state } = useReveal<HTMLDivElement>("in-view")

  if (!fileUrl && !certificationsHref) return null

  const rings = [
    { size: "size-72 md:size-96", from: 1.4, opacity: "border-border/25" },
    { size: "size-96 md:size-[32rem]", from: 1.8, opacity: "border-border/15" },
    { size: "size-[34rem] md:size-[44rem]", from: 2.2, opacity: "border-border/10" },
  ]

  return (
    <section
      aria-labelledby="resume-download-heading"
      className={cn(
        "relative isolate overflow-hidden",
        "rounded-lg border-3 border-border bg-card",
        "shadow-lg",
        "px-6 py-12 md:px-10 md:py-16"
      )}
    >
      <div
        ref={ref}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        {rings.map((ring) => (
          <div
            key={ring.size}
            style={
              {
                "--ring-from-scale": ring.from,
                opacity: state === "visible" ? undefined : 0,
              } as React.CSSProperties
            }
            className={cn(
              "absolute rounded-full border-2",
              state === "visible" && "animate-resume-cta-ring",
              ring.size,
              ring.opacity
            )}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <h2
          id="resume-download-heading"
          className="font-heading text-2xl font-black text-balance sm:text-3xl"
        >
          {fileUrl ? "Prefer the one-page version?" : "Want the receipts?"}
        </h2>
        <p className="max-w-prose text-base leading-relaxed text-body-foreground">
          {fileUrl
            ? "The same history, condensed to a PDF you can skim, print, or forward."
            : "The courses and credentials behind everything above."}
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          {fileUrl && (
            <Button
              size="lg"
              render={
                <a
                  href={fileUrl}
                  download={fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackLinkClick({
                      platform: "resume",
                      url: fileUrl,
                      placement: "resume_cta",
                      position: "primary",
                    })
                  }
                />
              }
              nativeButton={false}
            >
              <DownloadIcon data-icon="inline-start" />
              Download resume
            </Button>
          )}

          {certificationsHref && (
            <Button
              size="lg"
              variant={fileUrl ? "secondary" : "default"}
              render={<Link href={certificationsHref} />}
              nativeButton={false}
            >
              <BadgeCheckIcon data-icon="inline-start" />
              See certifications
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
