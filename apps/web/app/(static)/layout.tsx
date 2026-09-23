import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

import { Toaster } from "@workspace/ui/components/sonner";
import { sanityFetch, SanityLive } from "@workspace/sanity/live";
import { urlFor } from "@workspace/sanity/image";
import { createCollectionTag } from "@workspace/sanity/cache-tags";
import {
  SITE_CONFIG_QUERY,
  FOOTER_LEGAL_LINKS_QUERY,
} from "@workspace/sanity/query";

import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { ViewTransitionWrapper } from "@/components/layouts/view-transition-wrapper";
import { Providers } from "@/providers/providers";
import { DisableDraftMode } from "@/components/sanity/disable-draft-mode";
import {
  cleanSanityData,
  getDynamicSanityFetchOptions,
} from "@/lib/sanity-fetch-options";

export async function generateMetadata(): Promise<Metadata> {
  // Never let stega leak into <title>/<meta>/OG tags — always published, clean.
  const { data: siteConfig } = await sanityFetch({
    query: SITE_CONFIG_QUERY,
    tags: [createCollectionTag("siteConfig")],
    perspective: "published",
    stega: false,
  });

  const title = siteConfig?.title || "Kunal Keshan — Software Engineer";
  const description =
    siteConfig?.description ||
    "Portfolio of Kunal Keshan, a software engineer based in India focused on clean design and systems that hold up over time.";

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
  const dynamicOptions = await getDynamicSanityFetchOptions();

  const [siteConfigResult, legalLinksResult] = await Promise.all([
    sanityFetch({
      query: SITE_CONFIG_QUERY,
      tags: [createCollectionTag("siteConfig")],
      ...dynamicOptions,
    }),
    sanityFetch({
      query: FOOTER_LEGAL_LINKS_QUERY,
      tags: [createCollectionTag("siteConfig")],
      ...dynamicOptions,
    }),
  ]);

  const siteConfig = cleanSanityData(siteConfigResult.data);
  const legalLinks = cleanSanityData(legalLinksResult.data);

  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <>
      <Providers rickrollAudioUrl={siteConfig?.rickrollAudio?.asset?.url ?? null}>
        <ViewTransitionWrapper>
          <Navbar siteConfig={siteConfig} />
          {children}
          <Footer siteConfig={siteConfig} legalLinks={legalLinks} />
          <Toaster richColors />
        </ViewTransitionWrapper>
      </Providers>
      <SanityLive />
      {isDraftMode && (
        <>
          <VisualEditing />
          <DisableDraftMode />
        </>
      )}
    </>
  );
}
