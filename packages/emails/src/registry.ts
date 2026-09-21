import type { ComponentProps } from "react";

import ContactNotificationEmail, {
  CONTACT_NOTIFICATION_EMAIL_FILE,
  CONTACT_NOTIFICATION_EMAIL_PREVIEW_PROPS,
} from "./contact/contact-notification";

/**
 * Central map of every template this package ships, keyed by its `_FILE`
 * constant. Adding a template means adding one entry here — `render-email.ts`
 * looks templates up through this map so callers never import a template
 * file directly.
 */
export const emailTemplates = {
  [CONTACT_NOTIFICATION_EMAIL_FILE]: {
    file: CONTACT_NOTIFICATION_EMAIL_FILE,
    Component: ContactNotificationEmail,
    previewProps: CONTACT_NOTIFICATION_EMAIL_PREVIEW_PROPS,
  },
} as const;

export type EmailTemplateId = keyof typeof emailTemplates;

/**
 * Derived from the component's own prop type (`ComponentProps`), not from
 * `previewProps` — so optional props stay optional here even though the
 * preview object always fills every field with sample data.
 */
export type EmailTemplateProps<I extends EmailTemplateId> = ComponentProps<
  (typeof emailTemplates)[I]["Component"]
>;
