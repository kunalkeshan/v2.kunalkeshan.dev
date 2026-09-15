import type { Metadata } from "next";

import { Toaster } from "@workspace/ui/components/sonner";
import { sanityFetch } from "@workspace/sanity/fetch";
import { urlFor } from "@workspace/sanity/image";
import { createCollectionTag } from "@workspace/sanity/cache-tags";
import {
  SITE_CONFIG_QUERY,
  FOOTER_LEGAL_LINKS_QUERY,
} from "@workspace/sanity/query";
import type {
  SITE_CONFIG_QUERY_RESULT,
  FOOTER_LEGAL_LINKS_QUERY_RESULT,
} from "@workspace/sanity/types";

import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { ViewTransitionWrapper } from "@/components/layouts/view-transition-wrapper";
import { Providers } from "@/providers/providers";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await sanityFetch<SITE_CONFIG_QUERY_RESULT>({
    query: SITE_CONFIG_QUERY,
    tags: [createCollectionTag("siteConfig")],
  });

  const title = siteConfig?.title || "Kunal Keshan — Software Engineer";
  const description =
    siteConfig?.description ||
    "Portfolio of Kunal Keshan, a software engineer who builds products with clean design and systems that hold up over time.";

  const ogImageUrl = siteConfig?.ogImage?.asset
    ? urlFor(siteConfig.ogImage)
        .width(1200)
        .height(630)
        .fit("crop")
        .format("jpg")
        .quality(85)
        .url()
    : undefined;
  const twitterImageUrl = siteConfig?.twitterImage?.asset
    ? urlFor(siteConfig.twitterImage)
        .width(1200)
        .height(600)
        .fit("crop")
        .format("jpg")
        .quality(85)
        .url()
    : ogImageUrl;

  return {
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description,
    openGraph: {
      type: "website",
      title,
      description,
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              alt: siteConfig?.ogImage?.alt || title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: twitterImageUrl ? [twitterImageUrl] : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteConfig, legalLinks] = await Promise.all([
    sanityFetch<SITE_CONFIG_QUERY_RESULT>({
      query: SITE_CONFIG_QUERY,
      tags: [createCollectionTag("siteConfig")],
    }),
    sanityFetch<FOOTER_LEGAL_LINKS_QUERY_RESULT>({
      query: FOOTER_LEGAL_LINKS_QUERY,
      tags: [createCollectionTag("siteConfig")],
    }),
  ]);

  return (
    <>
      <Providers>
        <ViewTransitionWrapper>
          <Navbar siteConfig={siteConfig} />
          {children}
          <Footer siteConfig={siteConfig} legalLinks={legalLinks} />
          <Toaster richColors />
        </ViewTransitionWrapper>
      </Providers>
    </>
  );
}
