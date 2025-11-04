import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { getProfessionals } from "@/data/db";

const DESKTOP_CARD_WIDTH = 260;
const DESKTOP_GAP = 32;
const DESKTOP_SPEED = 30;

export function Professionals() {
  const list = getProfessionals()
    .sort((a, b) => (b.vrIds || []).length - (a.vrIds || []).length)
    .filter((p) => Boolean(p.Location));

  const desktopTotal = list.length * (DESKTOP_CARD_WIDTH + DESKTOP_GAP);

  const marqueeStyle: CSSProperties = {
    ["--marquee-duration" as string]: `${desktopTotal / DESKTOP_SPEED}s`,
  };

  return (
    <section className="relative overflow-visible bg-gradient-to-b from-cyber-gray-900 via-cyber-gray-900/95 to-cyber-gray-800 py-28">
      <div className="absolute inset-0 -z-10">
        <div className="cyber-grid absolute inset-0 opacity-10" />
        <div className="absolute left-[10%] top-12 h-80 w-80 rounded-full bg-cyber-brand-500/18 blur-[140px]" />
        <div className="absolute right-[15%] bottom-0 h-72 w-72 rounded-full bg-cyber-neon-cyan/18 blur-[150px]" />
      </div>

      <div className="container mx-auto px-6">
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="inline-flex items-center">
            <div className="rounded-full bg-gradient-to-r from-cyber-brand-500 via-cyber-neon-cyan to-cyber-neon-magenta p-[1.5px] shadow-[0_0_28px_rgba(51,102,255,0.35)]">
              <div className="flex items-center gap-2 rounded-full bg-cyber-gray-900/85 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-cyber-gray-100">
                <Icon
                  icon="heroicons:sparkles"
                  width={16}
                  className="text-cyber-neon-cyan"
                />
                Verified Creators
              </div>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-cyber-gray-100 md:text-5xl">
            Realsee Galois Professionals
          </h2>
          <p className="mt-4 max-w-3xl text-base text-cyber-gray-300 md:text-lg">
            Explore a global roster of certified creators delivering premium
            spatial capture, 3D storytelling, and immersive experiences.
          </p>
        </div>

        {/* Mobile grid */}
        <div className="grid grid-cols-1 gap-6 md:hidden">
          {list.map((p) => (
            <Link
              key={`grid-${p.id}`}
              href={`/professional/${p.slug ?? p.id}`}
              className="group hover-shine relative flex flex-col items-center overflow-hidden rounded-2xl border border-cyber-gray-600 bg-cyber-gray-900/70 px-6 pb-6 pt-10 text-center shadow-lg shadow-black/20 transition-transform duration-500 hover:-translate-y-2 hover:border-cyber-brand-400 hover:shadow-cyber-brand-500/25"
              aria-label={`Open ${p.name}`}
            >
              <div className="relative mb-6 h-28 w-28 overflow-hidden rounded-2xl border border-white/40 bg-cyber-gray-800 shadow-lg shadow-black/30 transition-transform duration-500 group-hover:scale-[1.05]">
                <div className="relative h-full w-full">
                  <Image
                    src={`/professional/${p.id}.jpg`}
                    alt={p.name}
                    fill
                    sizes="112px"
                    className="rounded-2xl object-cover"
                  />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-cyber-brand-500/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
              <h3 className="text-base font-semibold text-cyber-gray-100">
                {p.name}
              </h3>
              {p.Location ? (
                <div className="mt-2 flex max-w-full items-center justify-center gap-1 text-sm text-cyber-gray-300">
                  <Icon
                    icon="heroicons:map-pin"
                    width={16}
                    className="text-cyber-brand-600"
                  />
                  <span>{p.Location}</span>
                </div>
              ) : null}
            </Link>
          ))}
        </div>

        {/* Desktop marquee */}
        <div className="relative hidden pb-12 md:block">
          <div className="professionals-marquee" style={marqueeStyle}>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-cyber-gray-900 via-cyber-gray-900/40 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-cyber-gray-900 via-cyber-gray-900/40 to-transparent" />
            <div className="relative flex overflow-visible">
              <div className="professionals-track flex gap-6 animate-marquee-dynamic px-10">
                {[...list, ...list].map((p, index) => (
                  <Link
                    key={`${p.id}-${index}`}
                    href={`/professional/${p.slug ?? p.id}`}
                    className="group hover-shine relative flex w-[220px] flex-shrink-0 transform-gpu flex-col items-center overflow-hidden rounded-2xl border border-cyber-gray-600 bg-cyber-gray-900/70 px-6 pb-6 pt-10 text-center shadow-lg shadow-black/25 transition-transform duration-500 hover:scale-[1.06] hover:-translate-y-2 hover:border-cyber-brand-400 hover:shadow-cyber-brand-500/30 xl:w-[260px]"
                    aria-label={`Open ${p.name}`}
                  >
                    <div className="relative mb-6 h-24 w-24 overflow-hidden rounded-2xl border border-white/40 bg-cyber-gray-800 shadow-lg shadow-black/30 transition-transform duration-500 group-hover:scale-[1.05]">
                      <div className="relative h-full w-full">
                        <Image
                          src={`/professional/${p.id}.jpg`}
                          alt={p.name}
                          fill
                          sizes="96px"
                          className="rounded-2xl object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-cyber-brand-500/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-base font-semibold text-cyber-gray-100">
                        {p.name}
                      </h3>
                      {p.Location ? (
                        <p className="text-xs text-cyber-gray-400 md:text-sm">
                          {p.Location}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
