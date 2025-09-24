"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getVrTags } from "@/data/db";
import { CategoryBadge } from "@/components/custom/badges";

export function SearchFilter() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const tags = getVrTags().filter((t) => t.type === "category");

  // Map tag labels to the corresponding icon
  const getCategoryIcon = (label: string) => {
    const iconMap: Record<string, string> = {
      // Space types
      "Outdoor": "heroicons:map",
      "Aerial 3D": "heroicons:paper-airplane", 
      "Industrial": "heroicons:cog-6-tooth",
      "Exhibition": "heroicons:photo",
      "Exibition": "heroicons:photo", // misspelled variant
      "Showroom": "heroicons:building-storefront",
      "Residential": "heroicons:home",
      "Outside": "heroicons:globe-alt",
      "Museum": "heroicons:building-library",
      "Office": "heroicons:building-office-2", 
      "Restaurant": "heroicons:cake",
      "Studio": "heroicons:camera",
      "Church": "heroicons:star",
      "Gym": "heroicons:heart",
      "School": "heroicons:academic-cap",
      "village hall": "heroicons:users",
      "Tourism": "heroicons:map-pin",
      "Hotel": "heroicons:building-office",
      "Clinic": "heroicons:heart-pulse",
      "Retail": "heroicons:shopping-bag",
      "Construction": "heroicons:wrench-screwdriver",
      "Car": "heroicons:truck",
      "Campus": "heroicons:building-library",
    };
    
    return iconMap[label] || "heroicons:hashtag";
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }

    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cyber-gray-900 via-cyber-gray-900/95 to-cyber-gray-800 py-24">
      <div className="absolute inset-0 -z-10">
        <div className="cyber-grid absolute inset-0 opacity-10" />
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 bg-cyber-brand-500/25 blur-3xl" />
        <div className="absolute left-[12%] top-32 h-72 w-72 bg-cyber-neon-cyan/15 blur-[120px]" />
        <div className="absolute right-[10%] top-48 h-80 w-80 bg-cyber-brand-500/20 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-cyber-gray-600 bg-cyber-gray-800/90 p-10 shadow-cyber-brand-500/10 backdrop-blur-2xl md:p-14">
          <div className="text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-cyber-brand-500/30">
              <Icon icon="heroicons:sparkles" width={16} className="text-white" />
              <span>Search The Library</span>
            </div>
            <h2 className="mt-5 text-3xl font-bold text-cyber-gray-100 md:text-4xl">
              Discover your next immersive experience
            </h2>
            <p className="mt-4 text-base text-cyber-gray-200 md:text-lg">
              Explore thousands of Realsee 3D spaces and narrow results by scene, device, or keyword.
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-3xl rounded-2xl border border-cyber-gray-600 bg-cyber-gray-900/80 shadow-inner shadow-cyber-brand-500/10">
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-0">
                <div className="flex flex-1 items-center gap-3 rounded-xl bg-cyber-gray-900/60 px-4 py-3 text-cyber-gray-200">
                  <Icon icon="heroicons:magnifying-glass" width={22} className="text-cyber-brand-200" />
                  <input
                    type="text"
                    placeholder="Search tours, locations or creators"
                    className="flex-1 bg-transparent text-base text-cyber-gray-100 placeholder:text-cyber-gray-400 focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <button
                  className="cyber-btn-primary h-12 w-full rounded-xl text-sm font-semibold uppercase tracking-[0.2em] shadow-cyber-brand-500/30 hover:shadow-cyber-brand-500/40 sm:w-auto sm:min-w-[160px]"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-cyber-gray-200">
                <Icon icon="heroicons:swatch" width={16} className="text-cyber-brand-200" />
                <span>Popular Categories</span>
              </div>
              <button
                type="button"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-cyber-brand-200 hover:text-cyber-neon-cyan transition-colors"
                onClick={() => router.push("/search")}
              >
                View all
              </button>
            </div>

            <div className="relative mt-6 overflow-hidden">
              <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-cyber-gray-800 via-cyber-gray-800/70 to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-cyber-gray-800 via-cyber-gray-800/70 to-transparent pointer-events-none" />

              <div className="flex animate-marquee hover:[animation-play-state:paused] gap-4 py-4">
                {[...tags, ...tags].map((tag, index) => (
                  <button
                    key={`${tag.id}-${index}`}
                    className="group flex-shrink-0"
                    onClick={() => {
                      const params = new URLSearchParams();
                      params.set("category", tag.label);
                      router.push(`/search?${params.toString()}`);
                    }}
                  >
                    <CategoryBadge category={tag.label} size="md" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyber-gray-600/60 bg-cyber-gray-900/70 px-3 py-1 text-xs text-cyber-gray-300">
              <Icon icon="heroicons:cursor-arrow-rays" width={14} className="text-cyber-brand-200" />
              <span>Select a category to jump to its results</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
