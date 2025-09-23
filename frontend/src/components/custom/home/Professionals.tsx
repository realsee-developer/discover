import { Icon } from "@iconify/react";
import { getProfessionals } from "@/data/db";

export function Professionals() {
  const availableIds = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const list = getProfessionals()
    .filter((p) => availableIds.has(p.id))
    .slice(0, 10);
  return (
    <section className="featured-professionals-section relative overflow-hidden bg-gradient-to-b from-base-100 to-base-200/40 py-20">
      <div className="container mx-auto px-6">
        <div className="mb-14 flex flex-col items-center text-center">
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-base-content md:text-5xl">
            Realsee Galois Professionals
          </h2>
          <p className="mt-3 max-w-3xl text-base text-base-content/70 md:text-lg">
            Discover a curated network of creators pushing the boundaries of spatial capture.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-4 xl:grid-cols-5">
          {list.map((p) => (
            <a
              key={p.id}
              href={`/professional/${p.slug ?? p.id}`}
              className="group block cursor-pointer rounded-3xl border border-base-300/40 bg-base-100/70 p-7 text-center shadow-md ring-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
              aria-label={`Open ${p.name}`}
            >
              <div className="flex flex-col items-center">
                <div className="relative mb-4 isolate">
                  <div className="pointer-events-none absolute -inset-4 z-0 rounded-[30px] bg-gradient-to-br from-primary/40 to-accent/40 opacity-60 blur-xl transition-opacity duration-300 group-hover:opacity-90" />
                  <div className="avatar relative z-10">
                    <div className="h-28 w-28 overflow-hidden rounded-2xl border border-white/30 shadow-lg transition-transform duration-300 group-hover:scale-[1.04] md:h-32 md:w-32">
                      <img
                        src={`/professional/${p.id}.jpg`}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-base-content md:text-2xl">{p.name}</h3>
                {p.shortBio ? (
                  <p className="mb-5 line-clamp-2 text-sm text-base-content/70 md:text-base">{p.shortBio}</p>
                ) : null}
                <div className="flex items-center justify-center gap-3 text-sm text-base-content/60">
                  <span className="inline-flex items-center gap-1 rounded-full bg-base-200/60 px-2.5 py-1 ring-1 ring-base-300/60">
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
