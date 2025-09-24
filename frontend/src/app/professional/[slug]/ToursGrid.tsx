"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { CategoryBadge } from "@/components/custom/badges";
import { DeviceIcon } from "@/lib/badge-utils";

export type TourCardData = {
  id: string;
  title: string;
  url: string;
  shortCategory?: string;
  device?: string;
  cover: string;
  categoryIcon?: string;
};

const INITIAL_VISIBLE = 8;

export function ToursGrid({ tours }: { tours: TourCardData[] }) {
  const [visibleCount, setVisibleCount] = useState(
    tours.length > INITIAL_VISIBLE ? INITIAL_VISIBLE : tours.length,
  );

  if (!tours.length) {
    return (
      <div className="mt-16 text-center text-cyber-gray-300">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-cyber-brand-400/30 bg-cyber-gray-900/70 text-cyber-brand-100">
          <Icon icon="heroicons:cube" width={32} />
        </div>
        <h3 className="mt-6 text-xl font-semibold text-white">No Projects Yet</h3>
        <p className="mt-2 text-cyber-gray-400">
          This creator has not shared any virtual tours at the moment.
        </p>
      </div>
    );
  }

  const visibleTours = tours.slice(0, visibleCount);
  const showMore = visibleCount < tours.length;

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {visibleTours.map((tour, index) => (
          <a
            key={tour.id}
            href={tour.url}
            target="_blank"
            rel="noreferrer"
            style={{ animationDelay: `${index * 80}ms` }}
            className="tour-card group relative block overflow-hidden rounded-2xl border border-cyber-gray-600 bg-cyber-gray-900/75 shadow-lg shadow-cyber-brand-500/10 transition-transform duration-500 hover:-translate-y-1 hover:border-cyber-brand-400 hover:shadow-cyber-brand-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-gray-900"
          >
            <figure className="relative overflow-hidden">
              <Image
                src={tour.cover}
                alt={tour.title}
                width={640}
                height={384}
                className="h-48 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 max-w-[calc(100%-6rem)]">
                {tour.shortCategory ? (
                  <CategoryBadge category={tour.shortCategory} size="sm" />
                ) : null}
              </div>

              {tour.device ? (
                <div className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-cyber-gray-900/80 shadow-lg shadow-black/30">
                  <DeviceIcon device={tour.device} width={18} className="text-cyber-gray-100" />
                </div>
              ) : null}
            </figure>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cyber-gray-900 via-cyber-gray-900/70 to-transparent p-4">
              <h3 className="text-cyber-gray-100 text-lg font-semibold leading-snug line-clamp-2">
                {tour.title}
              </h3>
            </div>
          </a>
        ))}
      </div>

      {showMore ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount(tours.length)}
            className="btn cyber-btn-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em]"
          >
            <Icon icon="heroicons:arrow-down-tray" width={18} />
            View More Tours
          </button>
        </div>
      ) : null}
    </div>
  );
}


