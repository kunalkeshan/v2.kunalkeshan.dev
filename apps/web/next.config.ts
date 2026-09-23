import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/sanity", "@workspace/env"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        // /sitemap.xml itself can't serve content — that literal path is
        // reserved by app/sitemap.ts's `generateSitemaps()` convention (it
        // only emits real chunks at /sitemap/<id>.xml), so the real sitemap
        // index lives at /sitemap-index.xml instead (see that route's doc
        // comment). Redirects run before Next's file-based routing, so this
        // still lets any crawler/tool that hardcodes the conventional
        // /sitemap.xml URL reach real content.
        source: "/sitemap.xml",
        destination: "/sitemap-index.xml",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
