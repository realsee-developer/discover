import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/utils";

/**
 * Dynamic robots.txt configuration for discover.realsee.ai
 * Optimized for global search engines and AI crawlers
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = absoluteUrl();

  return {
    rules: [
      // Default rule for all crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      // Google crawlers - highest priority
      {
        userAgent: [
          "Googlebot",
          "Googlebot-Image",
          "Googlebot-News",
          "Googlebot-Video",
        ],
        allow: "/",
        disallow: ["/api/"],
        crawlDelay: 0,
      },
      // Bing and Microsoft crawlers
      {
        userAgent: ["Bingbot", "msnbot", "BingPreview"],
        allow: "/",
        disallow: ["/api/"],
        crawlDelay: 0,
      },
      // Baidu crawlers
      {
        userAgent: [
          "Baiduspider",
          "Baiduspider-image",
          "Baiduspider-video",
          "Baiduspider-news",
        ],
        allow: "/",
        disallow: ["/api/"],
        crawlDelay: 1,
      },
      // Yandex crawler
      {
        userAgent: "Yandex",
        allow: "/",
        disallow: ["/api/"],
        crawlDelay: 1,
      },
      // DuckDuckGo crawler
      {
        userAgent: "DuckDuckBot",
        allow: "/",
        disallow: ["/api/"],
        crawlDelay: 1,
      },
      // AI Search Engine Crawlers - OpenAI (ChatGPT)
      {
        userAgent: ["GPTBot", "ChatGPT-User"],
        allow: "/",
        disallow: ["/api/"],
        crawlDelay: 1,
      },
      // Anthropic Claude
      {
        userAgent: ["Claude-Web", "anthropic-ai"],
        allow: "/",
        disallow: ["/api/"],
        crawlDelay: 1,
      },
      // Perplexity AI
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api/"],
        crawlDelay: 1,
      },
      // Google Extended (Bard/Gemini)
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/api/"],
        crawlDelay: 1,
      },
      // Amazon Alexa
      {
        userAgent: "Amazonbot",
        allow: "/",
        disallow: ["/api/"],
        crawlDelay: 1,
      },
      // Meta AI
      {
        userAgent: ["FacebookBot", "Meta-ExternalAgent"],
        allow: "/",
        disallow: ["/api/"],
        crawlDelay: 1,
      },
      // Apple Intelligence
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: ["/api/"],
        crawlDelay: 1,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
