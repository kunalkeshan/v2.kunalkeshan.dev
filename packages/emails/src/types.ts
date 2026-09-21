import type { ComponentType } from "react";

/**
 * A template component that also carries its own preview props, so
 * `react-email dev`'s local preview server (and any future registry
 * consumer) can render it with realistic sample data without a caller
 * having to invent props by hand.
 */
export type EmailTemplateWithPreview<P extends object> = ComponentType<P> & {
  PreviewProps: P;
};
