import type { Metadata } from "next";

import { sanityFetch } from "@workspace/sanity/fetch";
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
import NotFoundContent from "@/components/sections/not-found-content";
import { Providers } from "@/providers/providers";
import { Toaster } from "@workspace/ui/components/sonner";

export const metadata: Metadata = {
  title: "Page Not Found | Kunal Keshan",
  description: "The page you are looking for does not exist.",
};

export default async function NotFound() {
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
    <Providers rickrollAudioUrl={siteConfig?.rickrollAudio?.asset?.url ?? null}>
      <Navbar siteConfig={siteConfig} />
      <NotFoundContent />
      <Footer siteConfig={siteConfig} legalLinks={legalLinks} />
      <Toaster richColors />
    </Providers>
  );
}
