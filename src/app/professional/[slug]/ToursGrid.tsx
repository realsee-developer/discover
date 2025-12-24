"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CategoryBadge } from "@/components/custom/badges";
import { getBlurPlaceholder } from "@/data/db";
import { DeviceIcon } from "@/lib/badge-utils";
import { ScanLinesOverlay } from "@/components/cyber";

export type TourCardData = {
  id: string;
  title: string;
  url: string;
  shortCategory?: string;
  device?: string;
  cover: string;
  categoryIcon?: string;
};

const INITIAL_VISIBLE = 9;
const PLACEHOLDER_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3Crect width='4' height='3' fill='%230a0f1a'/%3E%3C/svg%3E";

export function ToursGrid({ tours }: { tours: TourCardData[] }) {
  const [visibleCount, setVisibleCount] = useState(
    tours.length > INITIAL_VISIBLE ? INITIAL_VISIBLE : tours.length
  );

  if (!tours.length) {
    return (
      <div className="mt-16 text-center text-cyber-gray-300">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-cyber-neon-cyan/30 bg-cyber-gray-900/70 neon-border">
          <Icon icon="heroicons:cube" width={32} className="text-cyber-neon-cyan" />
        </div>
        <h3 className="mt-6 text-xl font-semibold text-white">
          No Projects Yet
        </h3>
        <p className="mt-2 text-cyber-gray-400">
          This creator has not shared any virtual tours at the moment.
        </p>
      </div>
    );
  }

  const visibleTours = tours.slice(0, visibleCount);
  const showMore = visibleCount < tours.length;

  return (
    <div className="space-y-12">
      {/* Masonry Grid with stagger animation */}
      <div className="masonry-grid">
        {visibleTours.map((tour, index) => (
          <Link
            key={tour.id}
            href={tour.url}
            target="_blank"
            rel="noreferrer"
            style={
              {
                "--stagger-delay": `${index * 100}ms`,
              } as React.CSSProperties
            }
            className="stagger-card cyber-card-glow group relative block overflow-hidden rounded-2xl border border-cyber-gray-700/60 bg-cyber-gray-900/80 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-gray-900"
          >
            <figure className="relative overflow-hidden m-0">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={tour.cover}
                  alt={tour.title}
                  fill
                  sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 32vw, (min-width: 768px) 45vw, 95vw"
                  placeholder="blur"
                  blurDataURL={
                    getBlurPlaceholder(tour.cover) ?? PLACEHOLDER_FALLBACK
                  }
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:saturate-[1.2]"
                />

                {/* Neon overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-gray-900 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />

                {/* Scanlines on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <ScanLinesOverlay intensity="subtle" />
                </div>
              </div>

              {/* Category badge */}
              <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 max-w-[calc(100%-6rem)]">
                {tour.shortCategory && (
                  <CategoryBadge category={tour.shortCategory} size="sm" />
                )}
              </div>

              {/* Device icon */}
              {tour.device && (
                <div className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-cyber-gray-900/90 border border-cyber-gray-600/50 shadow-lg shadow-black/30 group-hover:border-cyber-neon-cyan/50 transition-colors">
                  <DeviceIcon
                    device={tour.device}
                    width={18}
                    className="text-cyber-gray-200 group-hover:text-cyber-neon-cyan transition-colors"
                  />
                </div>
              )}
            </figure>

            {/* Title overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cyber-gray-900 via-cyber-gray-900/90 to-transparent p-5">
              <h3 className="text-cyber-gray-100 text-lg font-semibold leading-snug line-clamp-2 group-hover:text-cyber-neon-cyan transition-colors duration-300">
                {tour.title}
              </h3>

              {/* View indicator */}
              <div className="mt-2 flex items-center gap-2 text-xs text-cyber-gray-400 group-hover:text-cyber-neon-cyan/70 transition-colors">
                <Icon icon="heroicons:eye" width={14} />
                <span className="uppercase tracking-widest">View Tour</span>
                <Icon
                  icon="heroicons:arrow-right"
                  width={14}
                  className="transform translate-x-0 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>

            {/* Neon corner accents */}
            <span className="absolute top-0 left-0 w-8 h-[2px] bg-gradient-to-r from-cyber-neon-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute top-0 left-0 w-[2px] h-8 bg-gradient-to-b from-cyber-neon-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute bottom-0 right-0 w-8 h-[2px] bg-gradient-to-l from-cyber-neon-magenta to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute bottom-0 right-0 w-[2px] h-8 bg-gradient-to-t from-cyber-neon-magenta to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>

      {/* Load more button */}
      {showMore && (
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={() => setVisibleCount(tours.length)}
            className="group relative inline-flex items-center gap-3 rounded-full border border-cyber-neon-cyan/40 bg-cyber-gray-900/80 px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyber-gray-100 backdrop-blur-md transition-all duration-300 hover:border-cyber-neon-cyan hover:text-cyber-neon-cyan hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-gray-900"
          >
            {/* Animated background */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyber-neon-cyan/10 via-transparent to-cyber-neon-magenta/10 opacity-0 group-hover:opacity-100 transition-opacity" />

            <Icon icon="heroicons:rectangle-stack" width={20} className="relative z-10" />
            <span className="relative z-10">View All {tours.length} Tours</span>
          </button>
        </div>
      )}
    </div>
  );
}
