import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  const host = absoluteUrl();
  const sitemap = `${host}/sitemap.xml`;

  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
    },
    sitemap,
    host,
  };
}

