import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/sanity", "@workspace/env"],
}

export default nextConfig
