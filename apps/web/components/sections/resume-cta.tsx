"use client"

import { motion, useReducedMotion } from "motion/react"
import { DownloadIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

interface ResumeCtaProps {
  /** Absolute URL of the uploaded PDF. The banner renders nothing without one. */
  fileUrl: string | null
  /** Shown as the saved filename, e.g. "Kunal Keshan - Resume.pdf". */
  fileName?: string
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
 * Renders `null` when no PDF has been uploaded in the Studio, so the page can
 * never ship a dead download link.
 */
export function ResumeCta({ fileUrl, fileName }: ResumeCtaProps) {
  const reduceMotion = useReducedMotion()

  if (!fileUrl) return null

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
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        {rings.map((ring) => (
          <motion.div
            key={ring.size}
            initial={reduceMotion ? false : { scale: ring.from, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "circOut" }}
            className={cn(
              "absolute rounded-full border-2",
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
          Prefer the one-page version?
        </h2>
        <p className="max-w-prose text-base leading-relaxed text-body-foreground">
          The same history, condensed to a PDF you can skim, print, or forward.
        </p>
        <Button
          size="lg"
          className="mt-2"
          render={
            <a
              href={fileUrl}
              download={fileName}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
          nativeButton={false}
        >
          <DownloadIcon data-icon="inline-start" />
          Download resume
        </Button>
      </div>
    </section>
  )
}
