import type { ReactNode } from "react"
import { Body, Container, Preview } from "react-email"

import { EmailTailwindRoot } from "./email-tailwind-root"
import { EmailHeader } from "./header"
import { EmailFooter } from "./footer"

interface EmailLayoutProps {
  /**
   * Inbox preview text. Plain `string`, not `ReactNode` — react-email's
   * `<Preview>` only accepts `string | string[]` children.
   */
  preview: string
  logoUrl?: string
  logoAlt?: string
  siteName?: string
  children: ReactNode
}

/**
 * Full-page shell shared by every template: `EmailTailwindRoot` +
 * `<Preview>` + `<Body>`/`<Container>` with `EmailHeader`/`EmailFooter`
 * bracketing the template's own content. A new template only needs to
 * supply `preview` and its body — branding props (`siteName`/`logoUrl`/
 * `logoAlt`) are threaded through to both `EmailHeader` and `EmailFooter`
 * once instead of being repeated on each.
 */
export function EmailLayout({
  preview,
  logoUrl,
  logoAlt,
  siteName,
  children,
}: EmailLayoutProps) {
  return (
    <EmailTailwindRoot>
      <Preview>{preview}</Preview>
      <Body className="bg-background font-sans">
        <Container className="mx-auto max-w-[560px] px-4 py-8">
          <EmailHeader
            logoUrl={logoUrl}
            logoAlt={logoAlt}
            siteName={siteName}
          />

          {children}

          <EmailFooter siteName={siteName} />
        </Container>
      </Body>
    </EmailTailwindRoot>
  )
}
