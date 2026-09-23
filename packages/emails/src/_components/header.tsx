import { Column, Img, Row, Section, Text } from "react-email";

import { EMAIL_BRAND } from "../_theme/brand";

interface EmailHeaderProps {
  /** Absolute URL to the sender's logo, e.g. a Sanity CDN asset URL. */
  logoUrl?: string;
  logoAlt?: string;
  siteName?: string;
}

/**
 * Shared banner at the top of every template. Renders the image logo — as a
 * circular badge next to the site name, matching the site's own navbar/
 * footer `<Logo>` treatment (packages/ui/src/components/logo.tsx: size-10,
 * rounded-full, border-2 border-border, object-cover) — when a URL is
 * available (resolved by the caller from `siteConfig.logo`), and falls back
 * to a plain text wordmark otherwise, so a template never ships a broken
 * `<img>` tag when Sanity has no logo set.
 */
export function EmailHeader({
  logoUrl,
  logoAlt,
  siteName = EMAIL_BRAND.siteName,
}: EmailHeaderProps) {
  return (
    <Section className="mb-4 rounded-mail border-2 border-solid border-border bg-card px-6 py-5">
      {logoUrl ? (
        <Row>
          <Column className="w-10">
            <Img
              src={logoUrl}
              alt={logoAlt ?? siteName}
              width="40"
              height="40"
              className="rounded-full border-2 border-solid border-border object-cover"
            />
          </Column>
          <Column className="pl-3">
            <Text className="m-0 text-sm font-bold text-foreground">
              {siteName}
            </Text>
          </Column>
        </Row>
      ) : (
        <Text className="m-0 text-lg font-bold text-foreground">
          {siteName}
        </Text>
      )}
    </Section>
  );
}
