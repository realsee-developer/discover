import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "kind-love-9d69af7ecf.media.strapiapp.com",
      "kind-love-9d69af7ecf.strapiapp.com",
      "localhost",
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**/*",
      },
      {
        protocol: "https",
        hostname: "kind-love-9d69af7ecf.strapiapp.com",
        pathname: "/uploads/**/*",
      },
      {
        protocol: "https",
        hostname: "kind-love-9d69af7ecf.media.strapiapp.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
