"use client";

import { useMemo, useState, useEffect } from "react";
import { getVrs, getVrTags, getDevices, resolvePublicAssetPath } from "@/data/db";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getCategoryBadgeClass, getDeviceBadgeClass, getBadgeIcon, DeviceIcon } from "@/lib/badge-utils";

const ALL_VRS = getVrs();
const CATEGORY_TAGS = getVrTags().filter((t) => t.type === "category");
const DEVICE_TAGS = getVrTags().filter((t) => t.type === "device");
const DEVICES = getDevices();

interface SearchFilters {
  query: string;
  category: string | null;
  device: string | null;
  sort: string;
  view: 'grid' | 'list';
}

export function SearchStateClient() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: null,
    device: null,
    sort: "relevance",
    view: 'grid'
  });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 12;

  // Initialize URL parameters
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      query: searchParams.get('q') || '',
      category: searchParams.get('category') || null,
      device: searchParams.get('device') || null,
      sort: searchParams.get('sort') || 'relevance'
    }));
  }, [searchParams]);

  // Filter and sort logic
  const filteredResults = useMemo(() => {
    setIsLoading(true);
    
    let results = ALL_VRS.filter((vr) => {
      // Category filter
      if (filters.category) {
        const category = vr.category || vr.shortCategory || '';
        if (!category.toLowerCase().includes(filters.category.toLowerCase())) {
          return false;
        }
      }

      // Device filter
      if (filters.device) {
        const device = vr.device || '';
        if (!device.toLowerCase().includes(filters.device.toLowerCase())) {
          return false;
        }
      }

      // Text search
      if (filters.query.trim()) {
        const query = filters.query.toLowerCase();
        const searchableText = [
          vr.title || '',
          vr.description || '',
          vr.category || '',
          vr.shortCategory || '',
          vr.device || ''
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    switch (filters.sort) {
      case 'newest':
        results.sort((a, b) => (b.id > a.id ? 1 : -1));
        break;
      case 'title':
        results.sort((a, b) => (a.title || a.id).localeCompare(b.title || b.id));
        break;
      case 'category':
        results.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
        break;
      default:
        // relevance - keep original order or implement relevance scoring
        break;
    }

    setTimeout(() => setIsLoading(false), 200);
    return results;
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / pageSize));
  const paginatedResults = filteredResults.slice((page - 1) * pageSize, page * pageSize);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearAllFilters = () => {
    setFilters({
      query: "",
      category: null,
      device: null,
      sort: "relevance",
      view: filters.view
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
    <div className="min-h-screen bg-base-200">
      {/* Simple Hero Section */}
      <div className="bg-gradient-to-b from-base-100 to-base-200 py-12 border-b">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
              Discover VR Tours
            </h1>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Explore immersive 3D worlds and virtual reality experiences
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="join w-full shadow-lg">
              <div className="join-item flex items-center bg-base-100 px-4">
                <Icon icon="heroicons:magnifying-glass" width={20} className="text-base-content/60" />
              </div>
              <input
                className="join-item input input-lg w-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Search VR tours, experiences..."
                value={filters.query}
                onChange={(e) => updateFilter('query', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setPage(1);
                }}
              />
              <button 
                className="join-item btn btn-primary btn-lg"
                onClick={() => setPage(1)}
              >
                Search
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-base-100 rounded-lg shadow-md p-6">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                {/* Categories */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <Icon icon="heroicons:tag" width={16} />
                      Category
                    </span>
                  </label>
                  <select
                    className="select select-bordered select-sm"
                    value={filters.category || ''}
                    onChange={(e) => updateFilter('category', e.target.value || null)}
                  >
                    <option value="">All Categories</option>
                    {CATEGORY_TAGS.map((tag) => (
                      <option key={tag.id} value={tag.label}>{tag.label}</option>
                    ))}
                  </select>
                </div>

                {/* Devices */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <Icon icon="heroicons:device-phone-mobile" width={16} />
                      Device
                    </span>
                  </label>
                  <select
                    className="select select-bordered select-sm"
                    value={filters.device || ''}
                    onChange={(e) => updateFilter('device', e.target.value || null)}
                  >
                    <option value="">All Devices</option>
                    {DEVICES.map((device) => (
                      <option key={device.id} value={device.name}>{device.name}</option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Sort by</span>
                  </label>
                  <select
                    className="select select-bordered select-sm"
                    value={filters.sort}
                    onChange={(e) => updateFilter('sort', e.target.value)}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="newest">Newest First</option>
                    <option value="title">Title (A-Z)</option>
                    <option value="category">Category</option>
                  </select>
                </div>
              </div>

              {/* View Controls & Clear */}
              <div className="flex items-center gap-3">
                {getActiveFilterCount() > 0 && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={clearAllFilters}
                  >
                    <Icon icon="heroicons:x-mark" width={16} />
                    Clear ({getActiveFilterCount()})
                  </button>
                )}

                <div className="join">
                  <button
                    className={`join-item btn btn-sm ${
                      filters.view === 'grid' 
                        ? 'btn-primary' 
                        : 'btn-ghost'
                    }`}
                    onClick={() => updateFilter('view', 'grid')}
                    aria-label="Grid View"
                  >
                    <Icon icon="heroicons:squares-2x2" width={18} />
                  </button>
                  <button
                    className={`join-item btn btn-sm ${
                      filters.view === 'list'
                        ? 'btn-primary'
                        : 'btn-ghost'
                    }`}
                    onClick={() => updateFilter('view', 'list')}
                    aria-label="List View"
                  >
                    <Icon icon="heroicons:list-bullet" width={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Results Stats */}
        <div className="flex items-center justify-between mb-6">
          <div>
            {isLoading ? (
              <div className="flex items-center gap-3">
                <span className="loading loading-spinner loading-sm"></span>
                <span className="text-base-content/70">Searching...</span>
              </div>
            ) : (
              <p className="text-base-content/70">
                Found <strong className="text-primary">{filteredResults.length}</strong> VR experiences
              </p>
            )}
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className={`grid gap-6 ${
            filters.view === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card bg-base-100 shadow-lg animate-pulse">
                <div className="h-48 bg-base-300 rounded-t-lg"></div>
                <div className="card-body">
                  <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-base-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-lg mx-auto">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-base-content mb-4">
                No VR Tours Found
              </h3>
              <p className="text-base-content/70 mb-8">
                Try different keywords or clear your filters to see more results
              </p>
              <button
                className="btn btn-primary"
                onClick={clearAllFilters}
              >
                <Icon icon="heroicons:arrow-path" width={20} />
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${
              filters.view === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {paginatedResults.map((vr) => (
                <Link
                  key={vr.id}
                  href={vr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`tour-card card bg-base-100 group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 ${
                    filters.view === 'list' ? 'card-side' : ''
                  }`}
                >
                  <figure className="relative overflow-hidden">
                    <img
                      src={resolvePublicAssetPath(vr.assetCover || vr.cover) || vr.remoteCover || "/placeholder.jpg"}
                      alt={vr.title || vr.id}
                      className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                        filters.view === 'list' ? 'w-64 h-48' : 'h-48 w-full'
                      }`}
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 max-w-[calc(100%-6rem)]">
                      {vr.shortCategory || vr.category ? (
                        <div className={`badge ${getCategoryBadgeClass(vr.shortCategory || vr.category || "")} badge-sm gap-1`}>
                          <Icon icon={getBadgeIcon(vr.shortCategory || vr.category || "")} width={12} />
                          <span>{vr.shortCategory || vr.category}</span>
                        </div>
                      ) : null}
                    </div>
                    
                    {/* Device Badge */}
                    {vr.device ? (
                      <div className="absolute top-3 right-3">
                        <div className={`badge ${getDeviceBadgeClass(vr.device)} badge-sm gap-1.5`}>
                          <DeviceIcon device={vr.device} width={14} />
                          <span className="font-medium text-xs">{vr.device}</span>
                        </div>
                      </div>
                    ) : null}

                    {/* Title Overlay for Grid View */}
                    {filters.view === 'grid' && (
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                        <h3 className="text-white font-bold text-lg line-clamp-2 drop-shadow-lg">
                          {vr.title || vr.id}
                        </h3>
                      </div>
                    )}
                  </figure>
                  
                  {/* Card Body for List View */}
                  {filters.view === 'list' && (
                    <div className="card-body">
                      <h3 className="card-title text-base-content line-clamp-2">
                        {vr.title || vr.id}
                      </h3>
                      {vr.description && (
                        <p className="text-base-content/70 text-sm line-clamp-3">
                          {vr.description}
                        </p>
                      )}
                      <div className="card-actions justify-end">
                        <div className="badge badge-ghost">VR Experience</div>
                      </div>
                    </div>
                  )}
                </Link>
              ))}
            </div>

            {/* Simple Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="join">
                  <button
                    className={`join-item btn ${page === 1 ? 'btn-disabled' : 'btn-outline'}`}
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  >
                    <Icon icon="heroicons:chevron-left" width={20} />
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        className={`join-item btn ${
                          page === pageNum ? 'btn-primary' : 'btn-outline'
                        }`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    className={`join-item btn ${page === totalPages ? 'btn-disabled' : 'btn-outline'}`}
                    disabled={page === totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  >
                    Next
                    <Icon icon="heroicons:chevron-right" width={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}