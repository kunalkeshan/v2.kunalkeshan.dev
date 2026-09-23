import type { Metadata } from "next";

import { sanityFetch } from "@workspace/sanity/live";
import { createCollectionTag } from "@workspace/sanity/cache-tags";
import {
  SITE_CONFIG_QUERY,
  FOOTER_LEGAL_LINKS_QUERY,
} from "@workspace/sanity/query";

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
  // Always published, no draft preview on a 404 page.
  const [{ data: siteConfig }, { data: legalLinks }] = await Promise.all([
    sanityFetch({
      query: SITE_CONFIG_QUERY,
      tags: [createCollectionTag("siteConfig")],
      perspective: "published",
      stega: false,
    }),
    sanityFetch({
      query: FOOTER_LEGAL_LINKS_QUERY,
      tags: [createCollectionTag("siteConfig")],
      perspective: "published",
      stega: false,
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
