import type { ReactElement } from "react";
import { render, toPlainText } from "react-email";

import { emailTemplates, type EmailTemplateId, type EmailTemplateProps } from "./registry";

/**
 * Render a registered template to HTML, type-safe against its own prop
 * shape via the registry lookup.
 */
export async function renderEmailTemplateHtml<I extends EmailTemplateId>(
  id: I,
  props: EmailTemplateProps<I>
): Promise<string> {
  const { Component } = emailTemplates[id];
  return render(<Component {...props} />);
}

/**
 * Render a registered template to a plain-text fallback, for the
 * multipart/alternative body every transactional send should include.
 */
export async function renderEmailTemplatePlainText<I extends EmailTemplateId>(
  id: I,
  props: EmailTemplateProps<I>
): Promise<string> {
  const html = await renderEmailTemplateHtml(id, props);
  return toPlainText(html);
}

/** Escape hatch for rendering an ad hoc element outside the registry. */
export async function renderEmailHtml(element: ReactElement): Promise<string> {
  return render(element);
}

/** Escape hatch for plain-text rendering outside the registry. */
export async function renderEmailPlainText(
  element: ReactElement
): Promise<string> {
  const html = await renderEmailHtml(element);
  return toPlainText(html);
}
