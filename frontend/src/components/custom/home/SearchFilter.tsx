"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { getVrTags } from "@/data/db";

export function SearchFilter() {
  const router = useRouter();

  const tags = getVrTags()
    .filter((t) => t.type === "category")
    .sort((a, b) => a.label.localeCompare(b.label));

  const normalizeLabel = (label: string) => label.trim().toLowerCase();

  const iconMap: Record<string, string> = {
    "aerial 3d": "heroicons:paper-airplane",
    campus: "heroicons:building-library",
    car: "heroicons:truck",
    church: "heroicons:star",
    clinic: "heroicons:lifebuoy",
    construction: "heroicons:wrench-screwdriver",
    exhibition: "heroicons:photo",
    exibition: "heroicons:photo",
    gym: "heroicons:heart",
    hotel: "heroicons:building-office",
    industrial: "heroicons:cog-6-tooth",
    museum: "heroicons:building-library",
    office: "heroicons:building-office-2",
    outdoor: "heroicons:map",
    outside: "heroicons:globe-alt",
    residential: "heroicons:home",
    restaurant: "heroicons:cake",
    retail: "heroicons:shopping-bag",
    showroom: "heroicons:building-storefront",
    school: "heroicons:academic-cap",
    studio: "heroicons:camera",
    tourism: "heroicons:map-pin",
    "village hall": "heroicons:users",
    healthcare: "heroicons:lifebuoy",
    "medical clinic": "heroicons:lifebuoy",
  };

  const getCategoryIcon = (label: string) => iconMap[normalizeLabel(label)] || "heroicons:hashtag";

  const featuredTags = tags.slice(0, 8);
  const secondaryTags = tags.slice(8, 16);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cyber-gray-900 via-cyber-gray-900/95 to-cyber-gray-800 py-24">
      <div className="absolute inset-0 -z-10">
        <div className="cyber-grid absolute inset-0 opacity-10" />
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 bg-cyber-brand-500/25 blur-3xl" />
        <div className="absolute left-[12%] top-32 h-72 w-72 bg-cyber-neon-cyan/15 blur-[120px]" />
        <div className="absolute right-[10%] top-48 h-80 w-80 bg-cyber-brand-500/20 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-cyber-gray-600 bg-cyber-gray-800/90 p-8 shadow-cyber-brand-500/10 backdrop-blur-2xl md:p-10">
          <div className="text-center space-y-4">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-cyber-brand-500/30">
              <Icon icon="heroicons:sparkles" width={16} className="text-white" />
              <span>Featured Categories</span>
            </div>
            <h2 className="text-3xl font-bold text-cyber-gray-100 md:text-4xl">
              Jump straight into immersive content
            </h2>
            <p className="text-sm text-cyber-gray-300 md:text-base">
              Pick a category to browse curated spatial experiences that match your presentation or device needs.
            </p>
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap justify-center gap-3">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  className="group inline-flex items-center gap-2 rounded-full border border-cyber-brand-300/40 bg-cyber-brand-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyber-gray-100 transition-all duration-300 hover:-translate-y-[2px] hover:border-cyber-neon-cyan/60 hover:bg-cyber-brand-500/30 hover:text-white hover:shadow-[0_10px_24px_-12px_rgba(0,255,255,0.6)]"
                  onClick={() => {
                    const params = new URLSearchParams();
                    params.set("category", tag.label);
                    router.push(`/search?${params.toString()}`);
                  }}
                  aria-label={`Browse ${tag.label} category`}
                >
                  <Icon icon={getCategoryIcon(tag.label)} width={16} className="text-cyber-brand-800 transition-colors duration-300 group-hover:text-white" />
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 text-xs text-cyber-gray-300 sm:flex-row sm:justify-center">
            <div className="inline-flex items-center gap-2">
              <Icon icon="heroicons:cursor-arrow-rays" width={16} className="text-cyber-brand-800" />
              <span>Select a category to jump directly into tailored search results.</span>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-cyber-brand-300/60 bg-cyber-brand-500/20 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:border-cyber-neon-cyan/70 hover:text-cyber-neon-cyan"
              onClick={() => router.push("/search")}
            >
              View all tours
              <Icon icon="heroicons:arrow-right" width={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
