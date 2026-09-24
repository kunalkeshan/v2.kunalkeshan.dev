import type { Metadata } from "next";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import "@workspace/ui/globals.css";
import { rootBodyClassName } from "@workspace/ui/lib/fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalyticsScript } from "@/components/analytics/google-analytics";
import { ClarityScript } from "@/components/analytics/clarity";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.URL),
  formatDetection: {
    address: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={rootBodyClassName}
      data-scroll-behavior="smooth"
    >
      <body>
        {/* Required by `nuqs`' useQueryState (the /projects filters); it throws
            without an adapter in the tree. */}
        <NuqsAdapter>
          <ThemeProvider>{children}</ThemeProvider>
        </NuqsAdapter>
        <GoogleAnalyticsScript />
        <ClarityScript />
      </body>
    </html>
  );
}
