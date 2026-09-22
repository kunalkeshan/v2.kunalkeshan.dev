/**
 * Fetches Montserrat (the site's heading font — see docs/ui/font-stack.md)
 * as raw font bytes for `next/og`'s `ImageResponse`.
 *
 * `ImageResponse` runs outside the normal React tree (it renders via Satori,
 * not the DOM), so it can't use `next/font/google` the way the rest of the
 * app does — it needs the actual font binary handed to it. There's no
 * bundled TTF/OTF in this repo (next/font's build output is hashed and not
 * guaranteed to be a format Satori accepts), so this fetches the same
 * family from Google Fonts' CSS2 API at request time, following the
 * standard next/og pattern. The fetch is covered by Next's data cache by
 * default, so this only hits the network on a cold path.
 *
 * A legacy-browser User-Agent is required: Google's CSS2 API serves WOFF2
 * (what a browser wants) to modern user agents and only falls back to TTF
 * (what Satori needs) for user agents it doesn't recognize as WOFF2-capable.
 */
const LEGACY_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"

async function fetchMontserratTtf(
  weight: 400 | 700,
  text?: string
): Promise<ArrayBuffer> {
  const params = new URLSearchParams({ family: `Montserrat:wght@${weight}` })
  if (text) params.set("text", text)

  const css = await fetch(
    `https://fonts.googleapis.com/css2?${params.toString()}`,
    { headers: { "User-Agent": LEGACY_USER_AGENT } }
  ).then((res) => res.text())

  const fontUrlMatch = css.match(/src: url\(([^)]+)\)/)
  if (!fontUrlMatch) {
    throw new Error(`Could not find TTF URL for Montserrat ${weight}`)
  }

  const fontResponse = await fetch(fontUrlMatch[1] as string)
  return fontResponse.arrayBuffer()
}

export interface OgFont {
  name: string
  data: ArrayBuffer
  weight: 400 | 700
  style: "normal"
}

/**
 * Montserrat Bold (title) + Regular (metadata line) as `ImageResponse`-ready
 * font descriptors. Pass `text` (the actual characters the image will
 * render) to subset the fetch — Google only returns glyphs for the
 * characters requested, which keeps the fetch small regardless of post
 * title length or character set.
 */
export async function loadOgFonts(text?: string): Promise<OgFont[]> {
  const [bold, regular] = await Promise.all([
    fetchMontserratTtf(700, text),
    fetchMontserratTtf(400, text),
  ])

  return [
    { name: "Montserrat", data: bold, weight: 700, style: "normal" },
    { name: "Montserrat", data: regular, weight: 400, style: "normal" },
  ]
}
