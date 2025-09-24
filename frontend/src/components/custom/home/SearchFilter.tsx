"use client";

import { Icon } from "@iconify/react";
import { getVrTags } from "@/data/db";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchFilter() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const tags = getVrTags().filter((t) => t.type === "category");

  // 根据标签类别获取对应的图标
  const getCategoryIcon = (label: string) => {
    const iconMap: Record<string, string> = {
      // 空间类型
      "Outdoor": "heroicons:map",
      "Aerial 3D": "heroicons:paper-airplane", 
      "Industrial": "heroicons:cog-6-tooth",
      "Exhibition": "heroicons:photo",
      "Exibition": "heroicons:photo", // 拼写错误的版本
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
    <section className="relative bg-gradient-to-br from-base-300 via-base-200 to-primary/10 py-20 overflow-hidden">
      {/* Background patterns - similar to Footer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,_oklch(var(--p)/_0.15),_transparent_50%),radial-gradient(circle_at_80%_20%,_oklch(var(--s)/_0.08),_transparent_50%)]"></div>
      <div className="absolute inset-0 cyber-grid opacity-15"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_oklch(var(--p)/_0.05),_transparent_70%)]"></div>

      {/* Subtle animated elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl cyber-gentle-pulse"></div>
      <div
        className="absolute bottom-10 right-10 w-40 h-40 bg-secondary/8 rounded-full blur-2xl cyber-gentle-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Title section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/30 cyber-glow-text">
            <Icon icon="heroicons:sparkles" width={16} />
            <span>Explore Amazing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-base-content mb-6 tracking-tight font-display">
            Discover Your Perfect
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent cyber-subtle-text ml-3">
              3D Space
            </span>
          </h2>
          <p className="text-lg md:text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
            Find inspiration in thousands of immersive 3D virtual tours and
            spatial experiences
          </p>
        </div>

        {/* Search box */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-3xl">
            <div className="join w-full shadow-xl cyber-subtle-box">
              <input
                type="text"
                placeholder="Search 3D spaces, locations, styles..."
                className="cyber-input join-item flex-1 h-16 text-lg pl-6 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className="cyber-btn-primary join-item h-16 px-8 text-lg font-semibold"
                onClick={handleSearch}
              >
                <Icon icon="heroicons:magnifying-glass" width={24} />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category filter - Marquee style */}
        <div className="relative overflow-hidden mb-8">
          {/* Gradient masks for smooth edges */}
          <div className="absolute left-0 top-0 z-10 w-32 h-full bg-gradient-to-r from-base-200 via-base-200/80 to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 z-10 w-32 h-full bg-gradient-to-l from-base-200 via-base-200/80 to-transparent pointer-events-none"></div>
          
          {/* Marquee container */}
          <div className="flex animate-marquee hover:[animation-play-state:paused] gap-4 py-4">
            {/* First set of tags */}
            {tags.map((tag) => (
              <button
                key={tag.id}
                className="flex-shrink-0 px-6 py-3 rounded-xl font-medium transition-all duration-300 bg-base-200/60 text-base-content/70 border border-base-300/50 hover:bg-primary/10 hover:text-primary hover:border-primary/20 hover:scale-105 hover:shadow-lg cyber-glow-text whitespace-nowrap"
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set("category", tag.label);
                  router.push(`/search?${params.toString()}`);
                }}
              >
                <span className="flex items-center gap-2">
                  <Icon 
                    icon={getCategoryIcon(tag.label)} 
                    width={16} 
                    className="text-primary/60"
                  />
                  {tag.label}
                </span>
              </button>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {tags.map((tag) => (
              <button
                key={`${tag.id}-duplicate`}
                className="flex-shrink-0 px-6 py-3 rounded-xl font-medium transition-all duration-300 bg-base-200/60 text-base-content/70 border border-base-300/50 hover:bg-primary/10 hover:text-primary hover:border-primary/20 hover:scale-105 hover:shadow-lg cyber-glow-text whitespace-nowrap"
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set("category", tag.label);
                  router.push(`/search?${params.toString()}`);
                }}
              >
                <span className="flex items-center gap-2">
                  <Icon 
                    icon={getCategoryIcon(tag.label)} 
                    width={16} 
                    className="text-primary/60"
                  />
                  {tag.label}
                </span>
              </button>
            ))}
          </div>
          
          {/* Category hint */}
          <div className="text-center mt-4">
            <div className="inline-flex items-center gap-2 text-sm text-base-content/50 bg-base-200/30 px-3 py-1 rounded-full backdrop-blur-sm border border-base-300/30">
              <Icon icon="heroicons:cursor-arrow-rays" width={14} />
              <span>Click any category to explore</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
