/**
 * SEO utility functions for discover.realsee.ai
 * Provides helpers for international SEO, hreflang tags, and AI crawler optimization
 */

import { absoluteUrl } from "./utils";

/**
 * Generate hreflang alternates for global markets
 * All markets use English content with USD currency for now
 * @param path - The path for the current page (default: "/")
 * @returns Object with language codes and URLs for metadata.alternates.languages
 */
export function generateGlobalAlternates(path: string = "/") {
  const baseUrl = absoluteUrl(path);

  return {
    // Default for unmatched languages
    "x-default": baseUrl,
    // North America
    "en-US": baseUrl,
    "en-CA": baseUrl,
    // Europe
    "en-GB": baseUrl,
    "de-DE": baseUrl, // German market
    "fr-FR": baseUrl, // French market
    "es-ES": baseUrl, // Spanish market
    "it-IT": baseUrl, // Italian market
    "nl-NL": baseUrl, // Dutch market
    "pl-PL": baseUrl, // Polish market
    "pt-PT": baseUrl, // Portuguese market
    // Asia Pacific
    "en-AU": baseUrl,
    "en-SG": baseUrl, // Singapore
    "en-NZ": baseUrl, // New Zealand
    "ja-JP": baseUrl, // Japanese market
    "zh-CN": baseUrl, // Simplified Chinese
    "zh-TW": baseUrl, // Traditional Chinese
    "zh-HK": baseUrl, // Hong Kong
    "ko-KR": baseUrl, // Korean market
    // Middle East
    "en-AE": baseUrl, // UAE
    "ar-AE": baseUrl, // Arabic (UAE)
    "en-SA": baseUrl, // Saudi Arabia
    // Latin America
    "es-MX": baseUrl, // Mexico
    "pt-BR": baseUrl, // Brazil
    "es-AR": baseUrl, // Argentina
    "es-CL": baseUrl, // Chile
    // Other markets
    "en-IN": baseUrl, // India
    "en-ZA": baseUrl, // South Africa
    "ru-RU": baseUrl, // Russia
  };
}

/**
 * Get list of AI crawler user agents
 * Used for robots.txt and analytics
 */
export function getAICrawlers() {
  return [
    "GPTBot",
    "ChatGPT-User",
    "Claude-Web",
    "anthropic-ai",
    "PerplexityBot",
    "Google-Extended",
    "Amazonbot",
    "FacebookBot",
    "Meta-ExternalAgent",
    "Applebot",
    "Bingbot", // Also used for ChatGPT search
  ];
}

/**
 * Check if a user agent is an AI crawler
 * @param userAgent - The user agent string to check
 * @returns true if the user agent is an AI crawler
 */
export function isAICrawler(userAgent: string): boolean {
  const aiCrawlers = getAICrawlers();
  const userAgentLower = userAgent.toLowerCase();
  return aiCrawlers.some((crawler) =>
    userAgentLower.includes(crawler.toLowerCase()),
  );
}

/**
 * Get optimized meta tags for AI search engines
 * These tags help AI models better understand and index content
 */
export function getAIOptimizedMetaTags() {
  return {
    // Allow AI crawlers to use content
    robots: "index, follow, max-image-preview:large, max-snippet:-1",
    // Help AI understand the content type
    "article:content_tier": "free",
    // Indicate this is informational content
    "article:tag": "3d-virtual-tours, creators, photography",
  };
}

/**
 * Generate canonical URL with proper formatting
 * @param path - The path to append to base URL
 * @returns Properly formatted canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  return absoluteUrl(path);
}

/**
 * Get target markets information
 * Useful for displaying creator locations and market-specific content
 */
export function getTargetMarkets() {
  return [
    { code: "US", name: "United States", region: "North America" },
    { code: "CA", name: "Canada", region: "North America" },
    { code: "GB", name: "United Kingdom", region: "Europe" },
    { code: "DE", name: "Germany", region: "Europe" },
    { code: "FR", name: "France", region: "Europe" },
    { code: "ES", name: "Spain", region: "Europe" },
    { code: "IT", name: "Italy", region: "Europe" },
    { code: "NL", name: "Netherlands", region: "Europe" },
    { code: "AU", name: "Australia", region: "Asia Pacific" },
    { code: "SG", name: "Singapore", region: "Asia Pacific" },
    { code: "JP", name: "Japan", region: "Asia Pacific" },
    { code: "CN", name: "China", region: "Asia Pacific" },
    { code: "KR", name: "South Korea", region: "Asia Pacific" },
    { code: "AE", name: "United Arab Emirates", region: "Middle East" },
    { code: "MX", name: "Mexico", region: "Latin America" },
    { code: "BR", name: "Brazil", region: "Latin America" },
  ];
}

