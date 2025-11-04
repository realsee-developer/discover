import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loaderFile: "./src/lib/cloudflare-image-loader.ts",
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
