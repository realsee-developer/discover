import { Icon } from "@iconify/react";
import { getVrTags } from "@/data/db";

export function SearchFilter() {
  const tags = getVrTags().filter((t) => t.type === "category");
  return (
    <section className="search-filter-section bg-base-100 py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-base-content mb-4">Discover Your Perfect 3D Space</h2>
          <p className="text-xl text-base-content/70">Search through thousands of immersive 3D tours and virtual experiences</p>
        </div>
        <div className="flex justify-center mb-8">
          <div className="join w-full max-w-2xl">
            <input type="text" placeholder="Search 3D spaces, locations, styles..." className="input input-bordered join-item flex-1 text-lg h-14" />
            <button className="btn btn-primary join-item h-14 px-8">
              <Icon icon="heroicons:magnifying-glass" width={24} />
              Search
            </button>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button className="btn btn-outline btn-sm">All Categories</button>
          {tags.map((t) => (
            <button key={t.id} className="btn btn-outline btn-sm">{t.label}</button>
          ))}
        </div>
      </div>
    </section>
  );
}


