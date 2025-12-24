"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { getProfessionals } from "@/data/db";

const ITEMS_PER_PAGE_DESKTOP = 6;
const ITEMS_PER_PAGE_TABLET = 4;
const AUTO_SLIDE_INTERVAL = 6000; // 6 seconds

// Fisher-Yates shuffle algorithm with fixed seed for consistent results
function shuffleArray<T>(array: T[], seed = 12345): T[] {
  const arr = [...array];
  let currentIndex = arr.length;
  let random = seed;
  
  // Simple seeded random number generator
  const seededRandom = () => {
    random = (random * 9301 + 49297) % 233280;
    return random / 233280;
  };

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(seededRandom() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }
  
  return arr;
}

export function Professionals() {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_DESKTOP);
  const [paused, setPaused] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useRef<boolean>(false);

  // Filter and shuffle the list (fixed order for consistency)
  const list = useMemo(() => {
    const filtered = getProfessionals()
      .filter((p) => Boolean(p.Location));
    
    return shuffleArray(filtered);
  }, []);

  const totalPages = Math.ceil(list.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, list.length);
  const currentItems = list.slice(startIndex, endIndex);

  // Auto-slide timer - similar to Carousel component
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
        prefersReducedMotion.current = mql.matches;
      } catch {}
    }

    const start = () => {
      if (timer.current) clearInterval(timer.current);
      if (!prefersReducedMotion.current && totalPages > 1) {
        timer.current = setInterval(() => {
          setCurrentPage((c) => (c + 1) % totalPages);
        }, AUTO_SLIDE_INTERVAL);
        setPaused(false);
      }
    };

    start();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [totalPages]);

  // Pause on hover
  const handleMouseEnter = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setPaused(true);
  };

  const handleMouseLeave = () => {
    if (!prefersReducedMotion.current && totalPages > 1) {
      timer.current = setInterval(() => {
        setCurrentPage((c) => (c + 1) % totalPages);
      }, AUTO_SLIDE_INTERVAL);
    }
    setPaused(false);
  };

  // Handle responsive items per page
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setItemsPerPage(ITEMS_PER_PAGE_DESKTOP);
      } else if (width >= 768) {
        setItemsPerPage(ITEMS_PER_PAGE_TABLET);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset to first page if current page exceeds total pages
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(0);
    }
  }, [currentPage, totalPages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
      } else if (e.key === "ArrowRight" && currentPage < totalPages - 1) {
        setCurrentPage((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <section 
      className="relative overflow-visible bg-gradient-to-b from-cyber-gray-900 via-cyber-gray-900/95 to-cyber-gray-800 py-28"
      role="region"
      aria-label="Professional Photographers Carousel"
    >
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

        {/* Mobile grid (unchanged) */}
        <div className="grid grid-cols-1 gap-6 md:hidden min-h-[200px]">
          {list.map((p, index) => (
            <Link
              key={`grid-${p.id}`}
              href={`/professional/${p.slug ?? p.id}`}
              className="group hover-shine relative flex flex-col items-center overflow-hidden rounded-2xl border border-cyber-gray-600 bg-cyber-gray-900/70 px-6 pb-6 pt-10 text-center shadow-lg shadow-black/20 transition-transform duration-500 hover:-translate-y-2 hover:border-cyber-brand-400 hover:shadow-cyber-brand-500/25"
              aria-label={`Open ${p.name}`}
            >
              <div className="relative mb-6 h-28 w-28 overflow-hidden rounded-2xl border border-white/40 bg-cyber-gray-800 shadow-lg shadow-black/30 transition-transform duration-500 group-hover:scale-[1.05]">
                <div className="relative h-full w-full">
                  <Image
                    src={`/professional/${p.slug}.jpg`}
                    alt={p.name}
                    fill
                    sizes="112px"
                    className="rounded-2xl object-cover"
                    loading={index < 4 ? "eager" : "lazy"}
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

        {/* Desktop paginated carousel */}
        <div 
          ref={containerRef} 
          className="relative hidden md:block pb-12 min-h-[600px]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Navigation arrows */}
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-cyber-gray-800/80 backdrop-blur-sm border border-cyber-gray-600 flex items-center justify-center text-cyber-gray-100 hover:bg-cyber-brand-500/20 hover:border-cyber-brand-400 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-cyber-gray-800/80 disabled:hover:border-cyber-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-gray-900"
            aria-label="Previous page"
            aria-disabled={currentPage === 0}
          >
            <Icon icon="heroicons:chevron-left" width={24} />
          </button>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-cyber-gray-800/80 backdrop-blur-sm border border-cyber-gray-600 flex items-center justify-center text-cyber-gray-100 hover:bg-cyber-brand-500/20 hover:border-cyber-brand-400 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-cyber-gray-800/80 disabled:hover:border-cyber-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-gray-900"
            aria-label="Next page"
            aria-disabled={currentPage === totalPages - 1}
          >
            <Icon icon="heroicons:chevron-right" width={24} />
          </button>

          {/* Carousel content */}
          <div className="relative px-16 min-h-[520px]">
            <div 
              className="professionals-carousel-page grid grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-400 ease-in-out"
              key={currentPage}
            >
              {currentItems.map((p, index) => (
                <Link
                  key={`page-${currentPage}-${p.id}`}
                  href={`/professional/${p.slug ?? p.id}`}
                  className="group hover-shine relative flex flex-col items-center overflow-hidden rounded-2xl border border-cyber-gray-600 bg-cyber-gray-900/70 px-6 pb-6 pt-10 text-center shadow-lg shadow-black/25 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 hover:border-cyber-brand-400 hover:shadow-cyber-brand-500/30"
                  aria-label={`Open ${p.name}`}
                  style={{
                    animation: `fadeInUp 400ms ease-out ${index * 60}ms both`
                  }}
                >
                  <div className="relative mb-6 h-24 w-24 overflow-hidden rounded-2xl border border-white/40 bg-cyber-gray-800 shadow-lg shadow-black/30 transition-transform duration-500 group-hover:scale-[1.05]">
                    <div className="relative h-full w-full">
                      <Image
                        src={`/professional/${p.slug}.jpg`}
                        alt={p.name}
                        fill
                        sizes="96px"
                        className="rounded-2xl object-cover"
                        loading={currentPage === 0 && index < 6 ? "eager" : "lazy"}
                      />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-cyber-brand-500/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-base font-semibold text-cyber-gray-100">
                      {p.name}
                    </h3>
                    {p.Location ? (
                      <p className="text-xs text-cyber-gray-400 md:text-sm flex items-center justify-center gap-1">
                        <Icon
                          icon="heroicons:map-pin"
                          width={14}
                          className="text-cyber-brand-600"
                        />
                        {p.Location}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Page indicators and progress */}
          <div className="flex flex-col items-center gap-4 mt-8">
            {/* Page dots */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Carousel pages">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-gray-900 ${
                    index === currentPage
                      ? "w-8 bg-gradient-to-r from-cyber-brand-500 to-cyber-neon-cyan"
                      : "w-2 bg-cyber-gray-600 hover:bg-cyber-gray-500"
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                  aria-current={index === currentPage ? "true" : "false"}
                  role="tab"
                />
              ))}
            </div>

            {/* Progress text */}
            <p className="text-sm text-cyber-gray-400">
              {startIndex + 1}-{endIndex} of {list.length} Creators
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
