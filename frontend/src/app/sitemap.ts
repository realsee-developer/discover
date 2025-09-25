import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/utils";
import { getProfessionals } from "@/data/db";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  const professionals = getProfessionals();

  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/search"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  for (const professional of professionals) {
    const slug = professional.slug ?? String(professional.id);
    entries.push({
      url: absoluteUrl(`/professional/${slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}
