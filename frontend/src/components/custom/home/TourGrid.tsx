import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { getBlurPlaceholder, getVrs } from "@/data/db";

const DEFAULT_BLUR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%230a0f1a'/%3E%3C/svg%3E";
import { CategoryBadge } from "@/components/custom/badges";
import { DeviceIcon } from "@/lib/badge-utils";

export function TourGrid() {
  const vrs = getVrs().slice(0, 12);

  return (
    <section className="tour-gallery-section relative overflow-hidden bg-gradient-to-b from-cyber-gray-900 via-cyber-gray-900/96 to-cyber-gray-800 py-20">
      <div className="absolute inset-0 -z-10">
        <div className="cyber-grid h-full w-full opacity-10" />
        <div className="absolute left-[8%] top-24 h-72 w-72 rounded-full bg-cyber-brand-500/15 blur-[120px]" />
        <div className="absolute right-[12%] top-0 h-80 w-80 rounded-full bg-cyber-neon-cyan/15 blur-[140px]" />
      </div>
      <div className="relative z-10 container mx-auto px-6">
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white shadow-lg shadow-cyber-brand-500/30">
              <Icon icon="heroicons:bolt" width={16} className="text-white" />
              <span>Featured Library</span>
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-cyber-gray-100 md:text-4xl">
              Explore More 3D Tours
            </h2>
            <p className="mt-3 max-w-2xl text-base text-cyber-gray-200">
              Dive into a hand-picked collection of immersive spaces curated across industries, devices, and creators.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="cyber-btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold uppercase tracking-[0.25em]"
            >
              View All Tours
              <Icon icon="heroicons:arrow-right" width={16} />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vrs.map((vr) => (
            <Link
              key={vr.id}
              href={vr.url}
              target="_blank"
              rel="noreferrer"
              className="tour-card group relative block overflow-hidden rounded-2xl border border-cyber-gray-600 bg-cyber-gray-900/75 shadow-lg shadow-cyber-brand-500/10 transition-transform duration-500 hover:-translate-y-1 hover:border-cyber-brand-400 hover:shadow-cyber-brand-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-gray-900"
            >
              <figure className="relative aspect-[16/9] overflow-hidden m-0">
                {(() => {
                  const localSrc = vr.assetCover || vr.cover;
                  const remoteSrc = vr.remoteCover;
                  const fallback = "/cover/placeholder.jpg";
                  const imageSrc = localSrc || remoteSrc || fallback;
                  const blur = getBlurPlaceholder(localSrc) || getBlurPlaceholder(fallback) || DEFAULT_BLUR;
                  return (
                    <Image
                      src={imageSrc}
                      alt={vr.title || vr.id}
                      fill
                      sizes="(min-width: 1536px) 22vw, (min-width: 1280px) 24vw, (min-width: 1024px) 33vw, (min-width: 768px) 45vw, 95vw"
                      placeholder="blur"
                      blurDataURL={blur}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  );
                })()}

                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 max-w-[calc(100%-6rem)]">
                  <CategoryBadge category={vr.shortCategory || vr.category} size="sm" />
                </div>

                {vr.device ? (
                  <div className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-cyber-gray-900/80 shadow-lg shadow-black/30">
                    <DeviceIcon device={vr.device} width={18} className="text-cyber-gray-100" />
                  </div>
                ) : null}
              </figure>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-cyber-gray-900 via-cyber-gray-900/70 to-transparent p-4">
                <h3 className="text-cyber-gray-100 text-lg font-semibold leading-snug line-clamp-2">
                  {vr.title || vr.id}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


