import type { ReactNode } from "react";
import { Head, Html, Tailwind } from "react-email";

import { emailTailwindConfig } from "../_theme/email-tailwind-config";

interface EmailTailwindRootProps {
  children: ReactNode;
}

/**
 * Wraps a template's body in `<Html>`/`<Head>` + react-email's `<Tailwind>`,
 * and forces light-only rendering — dark mode support across mail clients is
 * too inconsistent to design against, so `packages/emails/src/_theme/colors.ts`
 * only defines a light palette.
 *
 * A template composes its own `<Preview>` as the first child of `children`
 * (react-email convention — it must render before `<Body>` in the tree).
 */
export function EmailTailwindRoot({ children }: EmailTailwindRootProps) {
  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      <Tailwind config={emailTailwindConfig}>{children}</Tailwind>
    </Html>
  );
}
