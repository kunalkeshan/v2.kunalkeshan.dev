import { ImageResponse } from "next/og"

import { loadOgFonts } from "./fonts"
import { OG_TOKENS as TOKENS } from "./tokens"
import { OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from "./writing-og-image"

export { OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE }

interface ProjectOgImageProps {
  title: string
  tagline: string
  siteName: string
  kindLabel: string | null
  statusLabel: string | null
  /**
   * Must already be a raster URL (Sanity's `.format("jpg")` forced) — Satori
   * cannot reliably render an SVG passed as an `<img src>`, and per-project
   * source assets aren't guaranteed to be raster (see the caller).
   */
  thumbnailUrl: string | undefined
  /**
   * "cover" for a landscape cover image (crops to fill the panel, matching
   * the card treatment elsewhere); "contain" for a square icon/logo mark
   * (centered, nothing cut off — a logo cropped to a portrait rect would
   * usually lose part of the mark).
   */
  thumbnailFit: "cover" | "contain"
  /** Same raster-forced-URL contract as `thumbnailUrl`. Omitted entirely when unset. */
  siteLogoUrl: string | undefined
}

/**
 * The neobrutalist-branded OG image for a project — always generated, unlike
 * the writing card, since `project` has no manual `ogImage` override field.
 * Unlike the writing card this composites the project's actual thumbnail
 * (cover image, or icon as a smaller fallback) into the card itself rather
 * than staying text-only, since a screenshot/logo is the more identifying
 * image for a project than it would be for a blog post.
 *
 * Falls back to a text-only layout — same spirit as the writing card's
 * no-override fallback — when a project has neither a cover image nor an
 * icon, so a project can never ship a blank/broken card.
 */
function ProjectOgImage({
  title,
  tagline,
  siteName,
  kindLabel,
  statusLabel,
  thumbnailUrl,
  thumbnailFit,
  siteLogoUrl,
}: ProjectOgImageProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "64px",
        backgroundColor: TOKENS.background,
        fontFamily: "Montserrat",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          backgroundColor: TOKENS.card,
          border: `6px solid ${TOKENS.border}`,
          borderRadius: "16px",
          boxShadow: `16px 16px 0px 0px ${TOKENS.border}`,
          overflow: "hidden",
        }}
      >
        {thumbnailUrl ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "42%",
              height: "100%",
              backgroundColor: TOKENS.background,
              borderRight: `6px solid ${TOKENS.border}`,
              padding: thumbnailFit === "contain" ? "48px" : "0",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- Satori (next/og) renders via its own image pipeline, not next/image. */}
            <img
              src={thumbnailUrl}
              width={504}
              height={630}
              style={{
                width: "100%",
                height: "100%",
                objectFit: thumbnailFit,
              }}
            />
          </div>
        ) : null}

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            // Centered, with a fixed `gap` to the footer below — not
            // `justify-content: space-between` against the card's full
            // height, which stretched the gap above the footer divider to
            // whatever was left over, so it grew or shrank with title
            // length instead of reading as one consistent rhythm.
            justifyContent: "center",
            gap: "40px",
            padding: "56px",
            minWidth: 0,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {kindLabel || statusLabel ? (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  marginBottom: "32px",
                }}
              >
                {kindLabel ? (
                  <div
                    style={{
                      display: "flex",
                      backgroundColor: TOKENS.primary,
                      color: TOKENS.primaryForeground,
                      border: `3px solid ${TOKENS.border}`,
                      borderRadius: "8px",
                      padding: "8px 20px",
                      fontSize: "26px",
                      fontWeight: 700,
                    }}
                  >
                    {kindLabel}
                  </div>
                ) : null}
                {statusLabel ? (
                  <div
                    style={{
                      display: "flex",
                      backgroundColor: TOKENS.background,
                      color: TOKENS.foreground,
                      border: `3px solid ${TOKENS.border}`,
                      borderRadius: "8px",
                      padding: "8px 20px",
                      fontSize: "26px",
                      fontWeight: 700,
                    }}
                  >
                    {statusLabel}
                  </div>
                ) : null}
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                fontSize: title.length > 40 ? "52px" : "64px",
                fontWeight: 700,
                lineHeight: 1.15,
                color: TOKENS.foreground,
              }}
            >
              {title}
            </div>

            {tagline ? (
              <div
                style={{
                  display: "flex",
                  marginTop: "24px",
                  fontSize: "28px",
                  fontWeight: 400,
                  lineHeight: 1.4,
                  color: TOKENS.mutedForeground,
                }}
              >
                {tagline}
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              borderTop: `3px solid ${TOKENS.border}`,
              paddingTop: "32px",
            }}
          >
            {siteLogoUrl ? (
              // Same treatment as the navbar's site logo (`Logo` in
              // packages/ui/src/components/logo.tsx): circular, bordered,
              // cropped to fill — so the mark reads as the same "brand"
              // element wherever it shows up.
              // eslint-disable-next-line @next/next/no-img-element -- Satori (next/og) renders via its own image pipeline, not next/image.
              <img
                src={siteLogoUrl}
                width={44}
                height={44}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "9999px",
                  border: `3px solid ${TOKENS.border}`,
                  objectFit: "cover",
                }}
              />
            ) : null}
            <div
              style={{
                display: "flex",
                fontSize: "32px",
                fontWeight: 700,
                color: TOKENS.secondary,
              }}
            >
              {siteName}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function renderProjectOgImage(
  props: ProjectOgImageProps
): Promise<ImageResponse> {
  const fonts = await loadOgFonts(
    `${props.title}${props.tagline}${props.siteName}${props.kindLabel ?? ""}${props.statusLabel ?? ""}`
  )

  return new ImageResponse(<ProjectOgImage {...props} />, {
    ...OG_IMAGE_SIZE,
    fonts,
  })
}
