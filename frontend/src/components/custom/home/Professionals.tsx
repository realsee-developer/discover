"use client";

import { useEffect, useRef } from "react";
import { getProfessionals } from "@/data/db";

export function Professionals() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const availableIds = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const list = getProfessionals()
    .filter((p) => availableIds.has(p.id))
    .sort((a, b) => (b.vrIds?.length || 0) - (a.vrIds?.length || 0))
    .slice(0, 10);
  const duplicated = [...list, ...list];

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const marquee = root.querySelector<HTMLElement>(".marquee");
    if (!marquee) return;

    let cleanup: (() => void) | undefined;
    try {
      const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mql.matches) {
        marquee.setAttribute("data-paused", "true");
        return;
      }
    } catch {}

    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          marquee.setAttribute("data-paused", en.isIntersecting ? "false" : "true");
        }
      },
      { threshold: 0.1 }
    );
    io.observe(root);
    cleanup = () => io.disconnect();
    return cleanup;
  }, []);
  return (
    <section className="featured-professionals-section relative overflow-hidden bg-transparent py-20">
      <div className="container mx-auto px-6">
        <div className="mb-14 flex flex-col items-center text-center">
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-base-content md:text-5xl">
            Realsee Galois Professionals
          </h2>
          <p className="mt-3 max-w-3xl text-base text-base-content/70 md:text-lg">
            Discover a curated network of creators pushing the boundaries of spatial capture.
          </p>
        </div>
        <div className="relative overflow-hidden" ref={containerRef}>
          <div className="marquee group" data-paused="false">
            <div
              className="marquee-track flex flex-nowrap items-stretch gap-6"
              style={{ ["--marquee-duration" as any]: `${Math.max(30, duplicated.length * 5)}s` }}
            >
              {duplicated.map((p, idx) => (
                <a
                  key={`${p.id}-${idx}`}
                  href={`/professional/${p.slug ?? p.id}`}
                  className="group/card block w-80 md:w-[22rem] shrink-0 cursor-pointer rounded-3xl border border-base-300/70 bg-base-100/80 p-7 text-center shadow-md ring-0 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(56,189,248,0.18)] focus-visible:outline-none"
                  aria-label={`Open ${p.name}`}
                  aria-hidden={idx >= list.length}
                >
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4 isolate">
                      <div className="pointer-events-none absolute -inset-4 z-0 rounded-[30px] bg-[radial-gradient(300px_160px_at_50%_-40px,rgba(56,189,248,0.25),transparent_60%)] opacity-70 blur-2xl transition-opacity duration-300 group-hover/card:opacity-100" />
                      <div className="avatar relative z-10">
                        <div className="h-28 w-28 overflow-hidden rounded-2xl border border-white/30 shadow-lg transition-transform duration-300 group-hover/card:scale-[1.04] md:h-32 md:w-32">
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
                      <p className="mb-5 text-sm text-base-content/70 md:text-base">{p.shortBio}</p>
                    ) : null}
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-base-100 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-base-100 to-transparent" />
        </div>
        <div className="mt-8 text-center">
          <a href="/professional" className="btn px-6 bg-[oklch(0.26_0.06_250)] text-white hover:bg-[oklch(0.3_0.06_250)] hover:shadow-[0_0_18px_rgba(56,189,248,0.18)]">
            Explore All Professionals
          </a>
        </div>
      </div>
    </section>
  );
}
