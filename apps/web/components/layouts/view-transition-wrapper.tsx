"use client";

import { ViewTransition } from "react";

interface ViewTransitionWrapperProps {
  children: React.ReactNode;
}

/**
 * Client-side wrapper component for React's View Transitions API. Enables
 * smooth transitions between page navigations. Works in the App Router with
 * no `next.config.ts` flag — see `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`
 * ("View transitions work in the App Router with no configuration").
 *
 * Deliberately wraps only route content (`{children}` in
 * `app/(static)/layout.tsx`), not the persistent `<Navbar>`/`<Footer>`, so
 * neither one is a transition participant on every navigation.
 *
 * `<ViewTransition>` only activates for actual Transitions (route
 * navigation, `useTransition`, `<Suspense>`, `useDeferredValue`) — a plain
 * `setState` never triggers it, confirmed against the installed React
 * 19.3.0 by spying on `document.startViewTransition` while driving an
 * interval-based re-render for several cycles: it was never called. So a
 * component that updates on its own timer (e.g. `Hero`'s rotating role
 * text) needs no special handling here to stay out of the way.
 *
 * @see https://react.dev/reference/react/ViewTransition
 */
export function ViewTransitionWrapper({
  children,
}: ViewTransitionWrapperProps) {
  return <ViewTransition>{children}</ViewTransition>;
}
