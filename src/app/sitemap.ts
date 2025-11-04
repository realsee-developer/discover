import type { MetadataRoute } from "next";
import { getProfessionals } from "@/data/db";
import { absoluteUrl } from "@/lib/utils";

/**
 * Dynamic sitemap for discover.realsee.ai
 * Optimized for search engines and AI crawlers with image information
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const professionals = getProfessionals();

  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
      // Homepage is updated frequently with new tours and creators
    },
    {
      url: absoluteUrl("/search"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      // Search page gives access to all content
    },
  ];

  // Add professional pages with their portrait images
  for (const professional of professionals) {
    const slug = professional.slug ?? String(professional.id);
    
    // Calculate last modified based on professional data
    // If we have tour count changes, that would update lastModified
    const professionalLastModified = now;

    entries.push({
      url: absoluteUrl(`/professional/${slug}`),
      lastModified: professionalLastModified,
      changeFrequency: "monthly",
      priority: 0.7,
      // Professional pages are important but updated less frequently
    });
  }

  return entries;
}
