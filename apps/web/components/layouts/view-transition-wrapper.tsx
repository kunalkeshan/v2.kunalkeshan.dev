"use client";

import { ViewTransition } from "react";

interface ViewTransitionWrapperProps {
  children: React.ReactNode;
}

/**
 * Client-side wrapper component for React's View Transitions API
 * Enables smooth transitions between page navigations
 * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition
 */
export function ViewTransitionWrapper({
  children,
}: ViewTransitionWrapperProps) {
  return <ViewTransition>{children}</ViewTransition>;
}
