"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { DeviceIcon } from "@/lib/badge-utils";

export type TourCardData = {
  id: string;
  title: string;
  description: string;
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
            className="group relative block rounded-2xl border border-cyber-brand-400/15 bg-cyber-gray-900/70 shadow-lg shadow-cyber-brand-500/10 transition-all duration-500 hover:-translate-y-1 hover:border-cyber-brand-300/40 hover:shadow-[0_35px_70px_-35px_rgba(15,23,42,0.8)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={tour.cover}
                alt={tour.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              {tour.shortCategory ? (
                <div className="absolute left-3 top-3">
                  <div className="badge badge-primary badge-sm gap-1">
                    {tour.categoryIcon ? (
                      <Icon icon={tour.categoryIcon} width={12} />
                    ) : null}
                    <span>{tour.shortCategory}</span>
                  </div>
                </div>
              ) : null}
              {tour.device ? (
                <div className="absolute right-3 top-3">
                  <div className="badge badge-neutral badge-sm gap-1.5">
                    <DeviceIcon device={tour.device} width={14} />
                    <span className="text-[0.65rem] font-medium uppercase tracking-wide">
                      {tour.device}
                    </span>
                  </div>
                </div>
              ) : null}
              <div className="pointer-events-none absolute bottom-3 right-3 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyber-brand-600 text-white shadow-lg shadow-cyber-brand-500/30">
                  <Icon icon="heroicons:play" width={16} className="ml-0.5" />
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 p-6">
              <div>
                <h3 className="text-lg font-semibold text-white transition-colors duration-200 group-hover:text-cyber-brand-100">
                  {tour.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-cyber-gray-300">
                {tour.description}
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-cyber-brand-400/10 pt-3 text-xs text-cyber-gray-400">
                <div className="flex items-center gap-2">
                  <Icon icon="heroicons:eye" width={14} />
                  <span>3D Virtual Tour</span>
                </div>
                <span>View Experience</span>
              </div>
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


