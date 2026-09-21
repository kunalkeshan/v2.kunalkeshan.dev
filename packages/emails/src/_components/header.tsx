import { Img, Section, Text } from "react-email";

import { EMAIL_BRAND } from "../_theme/brand";

interface EmailHeaderProps {
  /** Absolute URL to the sender's logo, e.g. a Sanity CDN asset URL. */
  logoUrl?: string;
  logoAlt?: string;
  siteName?: string;
}

/**
 * Shared banner at the top of every template. Renders the image logo when a
 * URL is available (resolved by the caller from `siteConfig.logo`), and
 * falls back to a plain text wordmark otherwise — so a template never ships
 * a broken `<img>` tag when Sanity has no logo set.
 */
export function EmailHeader({
  logoUrl,
  logoAlt,
  siteName = EMAIL_BRAND.siteName,
}: EmailHeaderProps) {
  return (
    <Section className="mb-4 rounded-mail border-2 border-solid border-border bg-card px-6 py-5">
      {logoUrl ? (
        <Img src={logoUrl} alt={logoAlt ?? siteName} height="40" />
      ) : (
        <Text className="m-0 text-lg font-bold text-foreground">
          {siteName}
        </Text>
      )}
    </Section>
  );
}
