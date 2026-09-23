import "server-only";

import { draftMode } from "next/headers";
import { stegaClean, type StegaCleaned } from "next-sanity";

/**
 * Shape of the `{ perspective, stega }` pair every `sanityFetch` call needs —
 * either resolved dynamically per-request (`getDynamicSanityFetchOptions`) or
 * passed as a published/no-stega literal for build-time and non-previewable
 * fetches (generateStaticParams, generateMetadata, opengraph images, etc).
 */
export interface SanityFetchOptions {
  perspective: "published" | "drafts";
  stega: boolean;
}

/**
 * The dynamic subset of options every request-time `sanityFetch` call needs:
 * `stega` is only ever enabled while Draft Mode is on (i.e. inside the
 * Presentation Tool's preview session), so regular visitors and the build
 * never see stega-encoded strings or risk a broken string comparison.
 *
 * Not for use in `generateStaticParams` or other build-time-only fetches —
 * those must pass `{ perspective: "published", stega: false }` directly,
 * since `draftMode()` throws outside a request scope.
 */
export async function getDynamicSanityFetchOptions(): Promise<SanityFetchOptions> {
  const { isEnabled: isDraftMode } = await draftMode();

  if (!isDraftMode) {
    return { perspective: "published", stega: false };
  }

  return { perspective: "drafts", stega: true };
}

/**
 * Because `getDynamicSanityFetchOptions()` returns a non-literal `stega:
 * boolean`, `sanityFetch`'s overloads can't statically rule out stega being
 * enabled, so `data` always comes back branded as `StegaBranded<...>` at the
 * type level (strings typed as `StegaString`), even on requests where
 * `stega` resolves to `false` at runtime. That breaks every component prop
 * typed against the plain generated `..._QUERY_RESULT` shape.
 *
 * `stegaClean()` is a runtime no-op when nothing is actually branded (draft
 * mode off) and strips real stega characters when it is (draft mode on) —
 * either way it restores the exact original, unbranded type. Every call site
 * using `getDynamicSanityFetchOptions()` should wrap its destructured `data`
 * with this before passing it to components.
 */
export function cleanSanityData<T>(data: T): StegaCleaned<T> {
  return stegaClean(data);
}
