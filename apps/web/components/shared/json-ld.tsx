/**
 * Renders a schema.org JSON-LD <script> tag from a Server Component.
 * Deliberately NOT next/script — Next's own docs warn next/script is wrong
 * for JSON-LD (it's structured data, not executable JS, and has known
 * issues serializing dynamic JSON-LD into the RSC flight payload).
 * See: https://nextjs.org/docs/app/guides/json-ld
 */
import type { Thing, WithContext } from "schema-dts";

export function JsonLd<T extends Thing>({ data }: { data: WithContext<T> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify + escaping "<" prevents breaking out of the script
      // tag if Sanity-sourced free text (titles, descriptions) contains "<".
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
