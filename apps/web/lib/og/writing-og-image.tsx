import { ImageResponse } from "next/og"

import { loadOgFonts } from "./fonts"

export const OG_IMAGE_SIZE = { width: 1200, height: 630 }
export const OG_IMAGE_CONTENT_TYPE = "image/png"

// Raw hex values, not Tailwind classes — ImageResponse renders via Satori,
// not the browser, so it never sees globals.css. Copied from the light-mode
// :root tokens in packages/ui/src/styles/globals.css (design-system.md's
// "Colors" table); the image always renders light-mode regardless of the
// visiting browser's theme, matching how a generated social-preview image
// has no user session to read a preference from.
const TOKENS = {
  background: "#faf9f6",
  foreground: "#0b0b0b",
  card: "#ffffff",
  primary: "#ffa500",
  primaryForeground: "#0b0b0b",
  secondary: "#1c92ff",
  border: "#0b0b0b",
  mutedForeground: "#5c5c5c",
}

interface WritingOgImageProps {
  title: string
  siteName: string
  tagNames: string[]
  dateLabel: string
  readingTimeLabel: string
}

/**
 * The neobrutalist-branded fallback OG image for a post/journal entry with
 * no manual `ogImage` override — a bordered card with a hard offset shadow,
 * a wrapping row of primary-orange tag chips (every tag, not just the
 * first — matches the detail page header, which shows the full tag set
 * since posts can carry more than one), title, and a footer metadata line,
 * styled to match this site rather than rendering as plain text-on-background.
 *
 * Capped to the first 4 tags: unlike the detail page (unlimited screen
 * height), the fixed 630px card has to keep the title as the dominant
 * element — a post with many tags would otherwise push it down or shrink it.
 *
 * `tw` (Tailwind-in-Satori, enabled by next/og) is used for layout, but
 * color values still need to be the raw hex tokens above — Satori's `tw`
 * support only understands Tailwind's *default* palette, not this repo's
 * custom CSS variables.
 */
function WritingOgImage({
  title,
  siteName,
  tagNames,
  dateLabel,
  readingTimeLabel,
}: WritingOgImageProps) {
  const visibleTags = tagNames.slice(0, 4)
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
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: TOKENS.card,
          border: `6px solid ${TOKENS.border}`,
          borderRadius: "16px",
          boxShadow: `16px 16px 0px 0px ${TOKENS.border}`,
          padding: "56px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {visibleTags.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "32px",
              }}
            >
              {visibleTags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    backgroundColor: TOKENS.primary,
                    color: TOKENS.primaryForeground,
                    border: `3px solid ${TOKENS.border}`,
                    borderRadius: "8px",
                    padding: "8px 20px",
                    fontSize: "28px",
                    fontWeight: 700,
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              fontSize: title.length > 60 ? "56px" : "68px",
              fontWeight: 700,
              lineHeight: 1.15,
              color: TOKENS.foreground,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `3px solid ${TOKENS.border}`,
            paddingTop: "32px",
          }}
        >
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
          <div
            style={{
              display: "flex",
              fontSize: "26px",
              fontWeight: 400,
              color: TOKENS.mutedForeground,
            }}
          >
            {dateLabel} · {readingTimeLabel}
          </div>
        </div>
      </div>
    </div>
  )
}

export async function renderWritingOgImage(
  props: WritingOgImageProps
): Promise<ImageResponse> {
  const fonts = await loadOgFonts(
    `${props.title}${props.siteName}${props.tagNames.join("")}${props.dateLabel}${props.readingTimeLabel}`
  )

  return new ImageResponse(<WritingOgImage {...props} />, {
    ...OG_IMAGE_SIZE,
    fonts,
  })
}
