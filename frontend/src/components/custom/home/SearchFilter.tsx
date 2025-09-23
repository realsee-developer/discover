"use client";

import { getVrTags } from "@/data/db";

export function SearchFilter() {
  const tags = getVrTags().filter((t) => t.type === "category");
  return (
    <section className="search-filter-section bg-transparent py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-base-content mb-4">Discover Your Perfect 3D Space</h2>
          <p className="text-xl text-base-content/70">Search through thousands of immersive 3D tours and virtual experiences</p>
        </div>
        <div className="flex justify-center mb-8">
          <form className="join w-full max-w-2xl" action="/search" method="get" role="search" aria-label="Search 3D tours">
            <input name="q" type="text" placeholder="Search 3D spaces, locations, styles..." className="input join-item flex-1 text-lg h-14 border-base-300 focus:border-[oklch(0.72_0.17_210)] focus:outline-0" />
            <button type="submit" className="join-item btn h-14 px-6 md:px-8 bg-[oklch(0.26_0.06_250)] text-white hover:bg-[oklch(0.3_0.06_250)] shadow-neon">
              Search
            </button>
          </form>
        </div>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          <button className="btn btn-sm border-base-300/70 hover:border-[oklch(0.72_0.17_210)] hover:shadow-neon-sm">All Categories</button>
          {tags.map((t) => (
            <button key={t.id} className="btn btn-sm border-base-300/70 hover:border-[oklch(0.72_0.17_210)] hover:shadow-neon-sm">{t.label}</button>
          ))}
        </div>
      </div>
    </section>
  );
}


