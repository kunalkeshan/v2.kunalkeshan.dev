import { Hr, Section, Text } from "react-email";

import { EMAIL_BRAND } from "../_theme/brand";

interface EmailFooterProps {
  siteName?: string;
}

/**
 * Shared closing block. Kept intentionally minimal — this is a personal
 * portfolio's transactional notification, not a marketing send, so there is
 * no unsubscribe/legal-link row to carry.
 */
export function EmailFooter({
  siteName = EMAIL_BRAND.siteName,
}: EmailFooterProps) {
  return (
    <Section className="mt-6">
      <Hr className="my-4 border-border" />
      <Text className="m-0 text-xs text-muted-foreground">
        Sent automatically by the {siteName} contact form.
      </Text>
    </Section>
  );
}
