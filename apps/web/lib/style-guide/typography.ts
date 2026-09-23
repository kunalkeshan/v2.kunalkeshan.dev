// Unlike tokens.ts, this file is hand-maintained rather than parsed: Tailwind
// v4's type scale is a set of utility classes (text-4xl, font-black, ...),
// not a list of CSS custom properties in globals.css, so there is nothing to
// read off disk here. If the site's heading/body scale changes, this file
// needs a matching manual edit — see docs/ui/style-guide.md.

export type TypeSpecimen = {
  label: string
  sample: string
  className: string
  meta: string
}

export const DISPLAY_SPECIMENS: TypeSpecimen[] = [
  {
    label: "Display",
    sample: "Modern problems, modern services.",
    className: "font-heading text-4xl leading-tight font-black sm:text-5xl",
    meta: "font-heading (Montserrat) · text-4xl/5xl · font-black",
  },
]

export const HEADING_SPECIMENS: TypeSpecimen[] = [
  {
    label: "Heading 1",
    sample: "The fine print, plainly stated.",
    className: "font-heading text-4xl leading-tight font-black sm:text-5xl",
    meta: "font-heading · text-4xl/5xl · font-black",
  },
  {
    label: "Heading 2",
    sample: "Modern problems, require modern services.",
    className: "font-heading text-2xl font-black sm:text-3xl",
    meta: "font-heading · text-2xl/3xl · font-black",
  },
  {
    label: "Heading 3",
    sample: "Card heading",
    className: "font-heading text-lg font-black md:text-xl",
    meta: "font-heading · text-lg/xl · font-black",
  },
]

export const BODY_SPECIMENS: TypeSpecimen[] = [
  {
    label: "Body large",
    sample:
      "Privacy policy, terms, and any other legal documents for this site.",
    className: "text-base leading-relaxed text-body-foreground md:text-lg",
    meta: "font-sans (Nunito Sans) · text-base/lg · text-body-foreground",
  },
  {
    label: "Body default",
    sample:
      "A working software engineer who also freelances independently.",
    className: "text-sm leading-relaxed text-body-foreground",
    meta: "font-sans · text-sm · text-body-foreground",
  },
  {
    label: "Body small / muted",
    sample: "No legal documents published yet.",
    className: "text-sm text-muted-foreground",
    meta: "font-sans · text-sm · text-muted-foreground",
  },
]

export const MONO_SPECIMENS: TypeSpecimen[] = [
  {
    label: "Mono",
    sample: "const cardLift = 'translate-y-0 ...'",
    className: "font-mono text-sm",
    meta: "font-mono (Ubuntu Mono) · text-sm",
  },
]
