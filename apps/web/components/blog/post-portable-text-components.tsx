import type { PortableTextComponents } from "@portabletext/react"

import { portableTextComponents } from "@/components/sanity/portable-text-components"
import { headingId } from "@/lib/toc"

/**
 * The shared `portableTextComponents` plus anchor `id`s on the rendered
 * h2/h3 (source style, shifted to <h3>/<h4> — see the shared file's own
 * comment) so the sidebar's table of contents links actually scroll
 * somewhere. Only posts/journal entries need this — legal and project pages
 * don't offer a TOC — so it extends the shared config here rather than
 * changing what every Portable Text consumer renders.
 *
 * `block` is redefined wholesale rather than spread from the shared config:
 * spreading a components object (a plain object of functions) typechecks
 * fine as a *value*, but its inferred type carries React's `defaultProps`
 * key, which isn't assignable back to `PortableTextComponents["block"]`.
 * h4/h5/h6 are omitted deliberately — the schema's field description tells
 * authors to use Heading 2/3 for section breaks, so a post body never
 * reaches h4 in practice, but they fall back to the library's default
 * rendering if one ever does.
 *
 * `normal`/`blockquote` are reproduced rather than referenced off the shared
 * config: `PortableTextComponents["block"]` is typed as a union (a single
 * component OR a per-style record), so TypeScript can't statically confirm
 * `portableTextComponents.block.normal` exists even though it does at
 * runtime — keeping the two in sync is one line each, not worth a cast.
 */
export const postPortableTextComponents: PortableTextComponents = {
  ...portableTextComponents,
  block: {
    normal: (props) => (
      <p className="mb-4 text-justify leading-relaxed text-muted-foreground">
        {props.children}
      </p>
    ),
    blockquote: (props) => (
      <blockquote className="my-4 border-l-4 border-primary pl-4 text-justify italic text-muted-foreground">
        {props.children}
      </blockquote>
    ),
    h1: (props) => (
      <h2
        id={headingId(props.value._key ?? "")}
        className="mt-8 mb-4 scroll-mt-32 text-3xl font-semibold tracking-tight text-foreground first:mt-0"
      >
        {props.children}
      </h2>
    ),
    h2: (props) => (
      <h3
        id={headingId(props.value._key ?? "")}
        className="mt-6 mb-3 scroll-mt-32 text-2xl font-semibold tracking-tight text-foreground"
      >
        {props.children}
      </h3>
    ),
    h3: (props) => (
      <h4
        id={headingId(props.value._key ?? "")}
        className="mt-5 mb-2 scroll-mt-32 text-xl font-semibold tracking-tight text-foreground"
      >
        {props.children}
      </h4>
    ),
  },
}
