import type { Components } from "react-markdown"

/**
 * `react-markdown` components config for rendering a GitHub release body,
 * one per `<ChangelogEntry>` on the /changelog page.
 *
 * Headings are demoted by two levels (markdown h1 -> rendered h3, ... h5/h6
 * -> bold paragraph) rather than the one-level shift
 * `portable-text-components.tsx` uses for Sanity content: on /changelog the
 * page's <h1> is the page title and each entry's release name is already an
 * <h2> (see `changelog-entry.tsx`), so body headings need to start a level
 * further in to nest correctly under that <h2> instead of colliding with it.
 */
export const changelogMarkdownComponents: Components = {
  h1: (props) => (
    <h3 className="mt-6 mb-3 text-xl font-semibold tracking-tight text-foreground first:mt-0">
      {props.children}
    </h3>
  ),
  h2: (props) => (
    <h4 className="mt-5 mb-2 text-lg font-semibold tracking-tight text-foreground">
      {props.children}
    </h4>
  ),
  h3: (props) => (
    <h5 className="mt-4 mb-2 text-base font-semibold tracking-tight text-foreground">
      {props.children}
    </h5>
  ),
  h4: (props) => (
    <h6 className="mt-4 mb-2 text-sm font-semibold tracking-tight text-foreground">
      {props.children}
    </h6>
  ),
  h5: (props) => (
    <p className="mt-4 mb-2 font-bold text-foreground">{props.children}</p>
  ),
  h6: (props) => (
    <p className="mt-4 mb-2 font-bold text-foreground">{props.children}</p>
  ),
  p: (props) => (
    <p className="mb-4 leading-relaxed text-muted-foreground">
      {props.children}
    </p>
  ),
  a: (props) => {
    const href = props.href ?? ""
    const external = /^https?:\/\//.test(href)
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="text-primary underline hover:text-primary/80"
      >
        {props.children}
      </a>
    )
  },
  strong: (props) => (
    <strong className="font-semibold text-foreground">
      {props.children}
    </strong>
  ),
  em: (props) => (
    <em className="italic text-muted-foreground">{props.children}</em>
  ),
  ul: (props) => (
    <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
      {props.children}
    </ul>
  ),
  ol: (props) => (
    <ol className="mb-4 list-decimal space-y-2 pl-6 text-muted-foreground">
      {props.children}
    </ol>
  ),
  li: (props) => <li className="leading-relaxed">{props.children}</li>,
  blockquote: (props) => (
    <blockquote className="my-4 border-l-4 border-primary pl-4 italic text-muted-foreground">
      {props.children}
    </blockquote>
  ),
  hr: () => <hr className="my-6 border-t-2 border-border" />,
  pre: (props) => (
    <pre className="mb-4 overflow-x-auto rounded-md border-2 border-border bg-muted p-4 text-sm [&>code]:bg-transparent [&>code]:p-0">
      {props.children}
    </pre>
  ),
  code: (props) => (
    <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-sm text-foreground">
      {props.children}
    </code>
  ),
  table: (props) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{props.children}</table>
    </div>
  ),
  th: (props) => (
    <th className="border-2 border-border bg-muted px-3 py-2 text-left font-semibold text-foreground">
      {props.children}
    </th>
  ),
  td: (props) => (
    <td className="border-2 border-border px-3 py-2 text-muted-foreground">
      {props.children}
    </td>
  ),
}
