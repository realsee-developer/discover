"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  getDevices,
  getVrTags,
  getVrs,
  resolvePublicAssetPath,
} from "@/data/db";
import { CategoryBadge, DeviceBadge } from "@/components/custom/badges";
import { DeviceIcon } from "@/lib/badge-utils";
import { JoinCTA } from "@/components/custom/home/JoinCTA";

const ALL_VRS = getVrs();
const CATEGORY_TAGS = getVrTags().filter((t) => t.type === "category");
const DEVICES = getDevices();

interface SearchFilters {
  query: string;
  category: string | null;
  device: string | null;
  sort: string;
  view: "grid" | "list";
}

export function SearchStateClient() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: null,
    device: null,
    sort: "relevance",
    view: "grid",
  });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 12;

  // Initialize URL parameters
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      query: searchParams.get("q") || "",
      category: searchParams.get("category") || null,
      device: searchParams.get("device") || null,
      sort: searchParams.get("sort") || "relevance",
    }));
  }, [searchParams]);

  // Filter and sort logic
  const filteredResults = useMemo(() => {
    let results = ALL_VRS.filter((vr) => {
      if (filters.category) {
        const category = vr.category || vr.shortCategory || "";
        if (!category.toLowerCase().includes(filters.category.toLowerCase())) {
          return false;
        }
      }

      if (filters.device) {
        const device = vr.device || "";
        if (!device.toLowerCase().includes(filters.device.toLowerCase())) {
          return false;
        }
      }

      if (filters.query.trim()) {
        const query = filters.query.toLowerCase();
        const searchableText = [
          vr.title || "",
          vr.description || "",
          vr.category || "",
          vr.shortCategory || "",
          vr.device || "",
        ]
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(query)) {
          return false;
        }
      }

      return true;
    });

    switch (filters.sort) {
      case "newest":
        results.sort((a, b) => (b.id > a.id ? 1 : -1));
        break;
      case "title":
        results.sort((a, b) =>
          (a.title || a.id).localeCompare(b.title || b.id)
        );
        break;
      case "category":
        results.sort((a, b) =>
          (a.category || "").localeCompare(b.category || "")
        );
        break;
      default:
        break;
    }

    return results;
  }, [filters]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 180);
    return () => clearTimeout(timer);
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / pageSize));
  const paginatedResults = filteredResults.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearAllFilters = () => {
    setFilters({
      query: "",
      category: null,
      device: null,
      sort: "relevance",
      view: filters.view,
    });
    setPage(1);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.query.trim()) count++;
    if (filters.category) count++;
    if (filters.device) count++;
    return count;
  };

  return (
    <div className="relative min-h-screen bg-cyber-gray-900 pb-24">
      <section className="relative overflow-hidden border-b border-cyber-gray-800 pt-28 pb-24">
        <div className="absolute inset-0">
          <div className="cyber-grid absolute inset-0 opacity-10" />
          <div className="absolute left-1/2 top-[-15%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyber-brand-500/25 blur-3xl" />
          <div className="absolute left-16 top-24 h-72 w-72 rounded-full bg-cyber-neon-cyan/20 blur-[140px]" />
          <div className="absolute right-24 bottom-[-10%] h-80 w-80 rounded-full bg-cyber-neon-magenta/15 blur-[170px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyber-gray-700 bg-cyber-gray-800/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-cyber-gray-300 shadow-cyber-brand-500/20">
            <Icon
              icon="heroicons:sparkles"
              width={16}
              className="text-cyber-brand-200"
            />
            <span>Immersive Search</span>
          </div>

          <div className="mt-6 max-w-3xl">
            <h1 className="text-4xl font-bold text-cyber-gray-100 md:text-5xl">
              Discover VR tours curated for professionals
            </h1>
            <p className="mt-4 text-base text-cyber-gray-300 md:text-lg">
              Search across our continuously expanding library of high-fidelity
              3D experiences, filter by industry-ready devices, and surface the
              right scene for every pitch.
            </p>
          </div>

          <div className="mt-12">
            <div className="cyber-card-neon flex flex-col gap-4 rounded-3xl border border-cyber-gray-600 bg-cyber-gray-900/85 p-4 shadow-cyber-brand-500/20 sm:p-6 md:flex-row md:items-center">
              <div className="flex flex-1 items-center gap-4 rounded-2xl border border-cyber-gray-700 bg-cyber-gray-900/70 px-4 py-3">
                <Icon
                  icon="heroicons:magnifying-glass"
                  width={22}
                  className="text-cyber-brand-200"
                />
                <input
                  className="cyber-focus w-full bg-transparent text-base text-cyber-gray-100 placeholder:text-cyber-gray-500 focus:outline-none md:text-lg"
                  placeholder="Search tours, locations, or creators"
                  value={filters.query}
                  onChange={(e) => updateFilter("query", e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setPage(1);
                    }
                  }}
                  aria-label="Search VR tours"
                />
              </div>
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end md:w-auto">
                <button
                  type="button"
                  className="cyber-btn-primary cyber-focus h-12 w-full rounded-xl px-8 text-sm font-semibold uppercase tracking-[0.2em] sm:w-auto"
                  onClick={() => setPage(1)}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-cyber-gray-100">
              Search results
            </h2>
            <p className="mt-2 text-sm text-cyber-gray-400">
              {isLoading
                ? "Calculating matches..."
                : `Showing ${filteredResults.length.toLocaleString()} immersive experiences from the Realsee library.`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {getActiveFilterCount() > 0 && (
              <button
                type="button"
                className="cyber-focus inline-flex items-center gap-2 rounded-xl border border-cyber-gray-700 bg-cyber-gray-900/80 px-4 py-2 text-sm font-medium text-cyber-gray-200 transition-colors duration-300 hover:border-cyber-brand-400/70 hover:text-cyber-brand-200"
                onClick={clearAllFilters}
              >
                <Icon icon="heroicons:x-mark" width={18} />
                Clear Filters ({getActiveFilterCount()})
              </button>
            )}
          </div>
        </div>

        <div
          className={`mt-10 grid grid-cols-1 gap-4 rounded-2xl border border-cyber-gray-700 bg-cyber-gray-900/80 p-6 shadow-cyber-brand-500/10 transition-all duration-300 ${
            showFilters ? "" : "hidden lg:grid"
          } lg:grid-cols-3`}
        >
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.25em] text-cyber-gray-400">
              Category
            </label>
            <select
              className="cyber-focus h-12 rounded-xl border border-cyber-gray-700 bg-cyber-gray-900/90 px-4 text-sm text-cyber-gray-100"
              value={filters.category || ""}
              onChange={(e) => updateFilter("category", e.target.value || null)}
            >
              <option value="">All categories</option>
              {CATEGORY_TAGS.map((tag) => (
                <option key={tag.id} value={tag.label}>
                  {tag.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.25em] text-cyber-gray-400">
              Device
            </label>
            <select
              className="cyber-focus h-12 rounded-xl border border-cyber-gray-700 bg-cyber-gray-900/90 px-4 text-sm text-cyber-gray-100"
              value={filters.device || ""}
              onChange={(e) => updateFilter("device", e.target.value || null)}
            >
              <option value="">All devices</option>
              {DEVICES.map((device) => (
                <option key={device.id} value={device.name}>
                  {device.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.25em] text-cyber-gray-400">
              Sort by
            </label>
            <select
              className="cyber-focus h-12 rounded-xl border border-cyber-gray-700 bg-cyber-gray-900/90 px-4 text-sm text-cyber-gray-100"
              value={filters.sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest first</option>
              <option value="title">Title (A-Z)</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>

        {getActiveFilterCount() > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {filters.query.trim() && (
              <div className="inline-flex items-center gap-2 rounded-full border border-cyber-brand-400/60 bg-cyber-brand-500/15 px-4 py-1.5 text-sm text-cyber-brand-100">
                <Icon icon="heroicons:magnifying-glass" width={16} />
                <span className="font-medium">{filters.query}</span>
                <button
                  type="button"
                  className="cyber-focus text-cyber-brand-200 transition-colors duration-200 hover:text-cyber-brand-100"
                  onClick={() => updateFilter("query", "")}
                  aria-label="Remove query filter"
                >
                  <Icon icon="heroicons:x-mark" width={16} />
                </button>
              </div>
            )}
            {filters.category && (
              <div className="inline-flex items-center gap-2 rounded-full border border-cyber-brand-400/60 bg-cyber-brand-500/10 px-4 py-1.5 text-sm text-cyber-brand-100">
                <Icon icon="heroicons:tag" width={16} />
                <span className="font-medium">{filters.category}</span>
                <button
                  type="button"
                  className="cyber-focus text-cyber-brand-200 transition-colors duration-200 hover:text-cyber-brand-100"
                  onClick={() => updateFilter("category", null)}
                  aria-label="Remove category filter"
                >
                  <Icon icon="heroicons:x-mark" width={16} />
                </button>
              </div>
            )}
            {filters.device && (
              <div className="inline-flex items-center gap-2 rounded-full border border-cyber-brand-400/60 bg-cyber-brand-500/10 px-4 py-1.5 text-sm text-cyber-brand-100">
                <Icon icon="heroicons:device-phone-mobile" width={16} />
                <span className="font-medium">{filters.device}</span>
                <button
                  type="button"
                  className="cyber-focus text-cyber-brand-200 transition-colors duration-200 hover:text-cyber-brand-100"
                  onClick={() => updateFilter("device", null)}
                  aria-label="Remove device filter"
                >
                  <Icon icon="heroicons:x-mark" width={16} />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-12">
          {isLoading ? (
            <div
              className={`grid gap-6 ${
                filters.view === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {Array.from({ length: filters.view === "grid" ? 8 : 6 }).map(
                (_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="cyber-card h-full overflow-hidden rounded-3xl border border-cyber-gray-700 bg-cyber-gray-900/80 p-0 animate-pulse"
                  >
                    <div className="h-48 w-full bg-cyber-gray-800/80" />
                    <div className="space-y-3 p-6">
                      <div className="h-4 w-3/4 rounded-full bg-cyber-gray-800/80" />
                      <div className="h-3 w-1/2 rounded-full bg-cyber-gray-800/80" />
                      <div className="h-3 w-2/3 rounded-full bg-cyber-gray-800/80" />
                    </div>
                  </div>
                )
              )}
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="mx-auto max-w-2xl rounded-3xl border border-cyber-gray-700 bg-cyber-gray-900/80 p-12 text-center shadow-cyber-brand-500/10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyber-brand-400/40 bg-cyber-brand-500/15 text-3xl">
                <span role="img" aria-label="Search">
                  🔍
                </span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-cyber-gray-100">
                No VR tours matched your filters
              </h3>
              <p className="mt-3 text-sm text-cyber-gray-400">
                Try broadening your keywords, removing a device constraint, or
                exploring all categories to surface more experiences.
              </p>
              <button
                type="button"
                className="cyber-btn-primary cyber-focus mt-8 rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em]"
                onClick={clearAllFilters}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div
                className={`grid gap-6 ${
                  filters.view === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}
              >
                {paginatedResults.map((vr, index) => {
                  const imageSrc = (() => {
                    const localSrc = resolvePublicAssetPath(
                      vr.assetCover || vr.cover
                    );
                    const remoteSrc = vr.remoteCover;
                    const fallback = "/placeholder.jpg";
                    return localSrc || remoteSrc || fallback;
                  })();

                  if (filters.view === "list") {
                    return (
                      <Link
                        key={vr.id}
                        href={vr.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tour-card group relative flex flex-col gap-6 rounded-3xl border border-cyber-gray-600 bg-cyber-gray-900/80 p-6 shadow-lg shadow-cyber-brand-500/15 transition-all duration-500 hover:border-cyber-brand-400 hover:shadow-cyber-brand-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-gray-900 sm:flex-row"
                      >
                        <figure className="relative h-48 w-full overflow-hidden rounded-2xl border border-cyber-gray-700 bg-cyber-gray-800/70 shadow-cyber-brand-500/10 sm:w-72">
                          <Image
                            src={imageSrc}
                            alt={vr.title || vr.id}
                            width={640}
                            height={384}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            priority={index < 4}
                          />

                          {(vr.shortCategory || vr.category) && (
                            <div className="absolute left-4 top-4 flex max-w-[calc(100%-5rem)] items-center gap-2">
                              <CategoryBadge
                                category={vr.shortCategory || vr.category}
                                size="sm"
                              />
                            </div>
                          )}

                          {vr.device && (
                            <div className="absolute right-4 top-4">
                              <DeviceBadge device={vr.device} size="sm" />
                            </div>
                          )}
                        </figure>

                        <div className="flex flex-1 flex-col justify-between gap-4">
                          <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-cyber-brand-400/50 bg-cyber-brand-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyber-brand-200">
                              <span>VR Experience</span>
                            </div>
                            <h3 className="mt-3 text-2xl font-semibold text-cyber-gray-100">
                              {vr.title || vr.id}
                            </h3>
                            {vr.description && (
                              <p className="mt-2 text-sm text-cyber-gray-300 line-clamp-3">
                                {vr.description}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-cyber-gray-400">
                            {vr.shortCategory && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-cyber-gray-700 bg-cyber-gray-800/80 px-3 py-1">
                                <Icon
                                  icon="heroicons:hashtag"
                                  width={14}
                                  className="text-cyber-brand-200"
                                />
                                {vr.shortCategory}
                              </span>
                            )}
                            {vr.device && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-cyber-gray-700 bg-cyber-gray-800/80 px-3 py-1">
                                <DeviceIcon device={vr.device} width={14} />
                                {vr.device}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  }

                  return (
                    <Link
                      key={vr.id}
                      href={vr.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tour-card group relative block overflow-hidden rounded-2xl border border-cyber-gray-600 bg-cyber-gray-900/75 shadow-lg shadow-cyber-brand-500/10 transition-transform duration-500 hover:-translate-y-1 hover:border-cyber-brand-400 hover:shadow-cyber-brand-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-gray-900"
                    >
                      <figure className="relative overflow-hidden">
                        <Image
                          src={imageSrc}
                          alt={vr.title || vr.id}
                          width={640}
                          height={384}
                          className="h-48 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          priority={index < 4}
                        />

                        {(vr.shortCategory || vr.category) && (
                          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 max-w-[calc(100%-6rem)]">
                            <CategoryBadge
                              category={vr.shortCategory || vr.category}
                              size="sm"
                            />
                          </div>
                        )}

                        {vr.device && (
                          <div className="absolute top-3 right-3">
                            <DeviceBadge device={vr.device} size="sm" />
                          </div>
                        )}
                      </figure>

                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cyber-gray-900 via-cyber-gray-900/70 to-transparent p-4">
                        <h3 className="text-cyber-gray-100 text-lg font-semibold leading-snug line-clamp-2">
                          {vr.title || vr.id}
                        </h3>
                        {vr.description && (
                          <p className="mt-2 text-sm text-cyber-gray-300 line-clamp-2">
                            {vr.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex items-center gap-2 rounded-full border border-cyber-gray-700 bg-cyber-gray-900/80 px-2 py-2">
                    <button
                      type="button"
                      className="cyber-focus inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-cyber-gray-300 transition-colors duration-300 hover:text-cyber-brand-200 disabled:cursor-not-allowed disabled:text-cyber-gray-600"
                      onClick={() =>
                        setPage((current) => Math.max(1, current - 1))
                      }
                      disabled={page === 1}
                    >
                      <Icon icon="heroicons:chevron-left" width={18} />
                      Previous
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }).map(
                      (_, i) => {
                        let pageNum = i + 1;
                        if (totalPages > 5) {
                          if (page <= 3) {
                            pageNum = i + 1;
                          } else if (page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = page - 2 + i;
                          }
                        }

                        return (
                          <button
                            key={pageNum}
                            type="button"
                            className={`cyber-focus inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300 ${
                              page === pageNum
                                ? "bg-cyber-brand-500/20 text-cyber-brand-100"
                                : "text-cyber-gray-300 hover:text-cyber-brand-200"
                            }`}
                            onClick={() => setPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                    <button
                      type="button"
                      className="cyber-focus inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-cyber-gray-300 transition-colors duration-300 hover:text-cyber-brand-200 disabled:cursor-not-allowed disabled:text-cyber-gray-600"
                      onClick={() =>
                        setPage((current) => Math.min(totalPages, current + 1))
                      }
                      disabled={page === totalPages}
                    >
                      Next
                      <Icon icon="heroicons:chevron-right" width={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="relative z-10 border-t border-cyber-gray-800 bg-gradient-to-b from-cyber-gray-900 via-cyber-gray-900/95 to-cyber-gray-800">
        <JoinCTA variant="creator" />
      </section>
    </div>
  );
}
