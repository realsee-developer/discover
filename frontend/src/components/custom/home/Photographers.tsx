import { Icon } from "@iconify/react";
import { getPhotographers } from "@/data/db";

export function Photographers() {
  const availableIds = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const list = getPhotographers()
    .filter((p) => availableIds.has(p.id))
    .slice(0, 10);
  return (
    <section className="featured-photographers-section bg-base-100 py-16">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-base-content">
            Realsee Galois Professionals
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {list.map((p) => (
            <a
              key={p.id}
              href="/photographer"
              className="group block text-center cursor-pointer rounded-3xl p-6 bg-base-100/60 border border-base-300/40 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              aria-label={`Open ${p.name}`}
            >
              <div className="flex flex-col items-center">
                <div className="relative mb-4 isolate">
                  <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-primary/40 to-accent/40 opacity-70 blur-lg transition-opacity duration-300 pointer-events-none z-0 group-hover:opacity-95" />
                  <div className="avatar relative z-10">
                    <div className="w-24 h-24 overflow-hidden rounded-2xl border border-white/30 shadow-lg transition-transform duration-300 group-hover:scale-[1.04]">
                      <img
                        src={`/photographer/${p.id}.jpg`}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-base-content mb-2">{p.name}</h3>
                {p.shortBio ? (
                  <p className="text-sm text-base-content/70 mb-4 line-clamp-2">{p.shortBio}</p>
                ) : null}
                <div className="flex items-center justify-center gap-2 text-sm text-base-content/60">
                  <span className="flex items-center gap-1">
                    <Icon icon="heroicons:globe-alt" width={16} /> {(p.vrIds || []).length} Tours
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
