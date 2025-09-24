"use client";

import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { getCarousels, getVrById, resolvePublicAssetPath } from "@/data/db";
import { CategoryBadge, DeviceBadge } from "@/components/custom/badges";

export function Carousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const prefersReducedMotion = useRef<boolean>(false);
  const previous = useRef(0);
  const DURATION_MS = 5000;

  const carousels = getCarousels();
  const slides = carousels
    .map((entry) => {
      const vr = getVrById(entry.vrId);
      if (!vr) return null;
      const title = vr.title || vr.category || vr.shortCategory;
      const img =
        resolvePublicAssetPath(entry.imagePath || vr.assetCover || vr.cover) ||
        vr.remoteCover ||
        undefined;
      const url = vr.url;
      const category = vr.category || vr.shortCategory || "";
      const device = vr.device || "";
      return { title: title || "", img, url, category, device };
    })
    .filter(Boolean) as {
    title: string;
    img?: string;
    url: string;
    category: string;
    device: string;
  }[];

  useEffect(() => {
    // Respect reduced motion preference
    if (typeof window !== "undefined") {
      try {
        const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
        prefersReducedMotion.current = mql.matches;
      } catch {}
    }

    const start = () => {
      if (timer.current) clearInterval(timer.current);
      if (!prefersReducedMotion.current && slides.length > 1) {
        timer.current = setInterval(() => {
          setCurrent((c) => {
            previous.current = c;
            return (c + 1) % slides.length;
          });
        }, DURATION_MS);
        setPaused(false);
      }
    };

    start();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [slides.length]);

  const goTo = (index: number) => {
    if (!slides.length) return;
    const len = slides.length;
    previous.current = current;
    setCurrent(((index % len) + len) % len);
  };

  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  if (!slides.length) return null;

  return (
    <section className="hero min-h-[calc(100svh-4rem)] sm:min-h-[calc(100svh-4.5rem)] w-screen bg-cyber-gray-900 p-0 relative overflow-hidden">
      {/* 赛博朋克背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-brand-500/10 via-transparent to-cyber-neon-cyan/5 pointer-events-none z-0" />
      {/* 网格背景 */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none z-0" />

      <div className="hero-content p-0 w-full max-w-none relative z-10">
        <div
          className="relative w-full overflow-hidden rounded-none shadow-none focus:outline-none focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          tabIndex={0}
          role="region"
          aria-label="Featured 3D Tours Carousel"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
            if (e.key === "Home") goTo(0);
            if (e.key === "End") goTo(slides.length - 1);
          }}
          onMouseEnter={() => {
            if (timer.current) clearInterval(timer.current);
            setPaused(true);
          }}
          onMouseLeave={() => {
            if (!prefersReducedMotion.current && slides.length > 1) {
              timer.current = setInterval(
                () => setCurrent((c) => (c + 1) % slides.length),
                DURATION_MS
              );
              setPaused(false);
            }
          }}
          onTouchStart={(e) => {
            const t = e.touches[0];
            touchStart.current = { x: t.clientX, y: t.clientY };
            if (timer.current) clearInterval(timer.current);
            setPaused(true);
          }}
          onTouchEnd={(e) => {
            const s = touchStart.current;
            touchStart.current = null;
            if (!s) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - s.x;
            const dy = t.clientY - s.y;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
              if (dx > 0) prev();
              else next();
            }
            if (!prefersReducedMotion.current && slides.length > 1) {
              timer.current = setInterval(
                () => setCurrent((c) => (c + 1) % slides.length),
                DURATION_MS
              );
              setPaused(false);
            }
          }}
        >
          {/* Visual container full-bleed with subtle Ken Burns */}
          <div className="relative w-full h-[100svh]">
            {slides.map((s, i) => {
              const isVisible = i === current || i === previous.current;
              return (
                <div
                  key={`${s.title}-${i}`}
                  className={`absolute inset-0 ${
                    isVisible ? "block" : "hidden"
                  } transition-opacity duration-700 ease-out ${
                    i === current ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                  aria-hidden={i !== current}
                  aria-label={s.title}
                  role="group"
                >
                  <div
                    className={`absolute inset-0 bg-center bg-cover pointer-events-none ${
                      !prefersReducedMotion.current ? "kenburns-soft" : ""
                    }`}
                    style={{ backgroundImage: `url("${s.img}")` }}
                  />
                  {/* Immersive centered hero content with enhanced design */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="px-6 md:px-12 w-full max-w-6xl">
                      <div className="text-white text-center">
                        {/* Main Title */}
                        <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6">
                          <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent drop-shadow-2xl">
                            {s.title}
                          </span>
                        </h1>

                        <div className="mt-6 mb-8 flex items-center justify-center gap-3 flex-wrap">
                          <CategoryBadge category={s.category} size="lg" />
                          <DeviceBadge device={s.device} size="lg" />
                        </div>

                        {/* 赛博朋克 CTA 按钮 */}
                        <div className="mt-8 pointer-events-auto">
                          <a
                            className="cyber-btn-primary btn-lg px-10 py-4 rounded-full text-lg font-semibold shadow-2xl shadow-primary/50 hover:shadow-cyber-neon-lg hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-sm gap-3 cyber-gentle-pulse font-display"
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Explore ${s.title} 3D Virtual Tour`}
                          >
                            <Icon icon="heroicons:play-circle" width={24} />
                            <span>Explore Now</span>
                          </a>
                        </div>

                        {/* Additional description */}
                        <p className="mt-6 text-white/80 text-base md:text-lg max-w-2xl mx-auto">
                          Immersive 3D virtual experience - Explore every detail of real spaces
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Navigation Controls */}
          {slides.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={prev}
                className="btn btn-circle btn-lg btn-ghost absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white bg-base-300/20 border-primary/30 hover:bg-base-300/40 hover:border-primary/70 hover:scale-110 active:scale-95 transition-all duration-200 backdrop-blur-md shadow-lg shadow-primary/20 cyber-glow-box"
              >
                <Icon icon="heroicons:chevron-left" width={24} />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={next}
                className="btn btn-circle btn-lg btn-ghost absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white bg-base-300/20 border-primary/30 hover:bg-base-300/40 hover:border-primary/70 hover:scale-110 active:scale-95 transition-all duration-200 backdrop-blur-md shadow-lg shadow-primary/20 cyber-glow-box"
              >
                <Icon icon="heroicons:chevron-right" width={24} />
              </button>
            </>
          ) : null}

          {/* Enhanced Scroll hint */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3 text-white/70 z-20 pointer-events-none">
            <div className="scroll-mouse"></div>
            <p className="text-xs font-medium tracking-wider uppercase">
              Scroll
            </p>
          </div>

          {/* Enhanced Indicators with modern design */}
          {slides.length > 1 ? (
            <div className="absolute bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 z-20">
              <div className="px-4 py-3 rounded-full bg-base-300/30 backdrop-blur-xl border border-primary/20 shadow-xl shadow-primary/20 flex items-center gap-2 md:gap-3">
                {slides.map((_, i) => {
                  const isActive = i === current;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`relative overflow-hidden rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${
                        isActive
                          ? "h-2 md:h-2.5 w-8 md:w-16 bg-primary shadow-lg shadow-primary/50 cyber-glow-box"
                          : "h-2 md:h-2.5 w-2 md:w-2.5 bg-base-content/50 hover:bg-primary/60"
                      }`}
                      style={{
                        ["--carousel-duration" as any]: `${DURATION_MS}ms`,
                      }}
                      aria-current={isActive}
                    >
                      {isActive ? (
                        <span
                          key={`progress-${current}`}
                          className={`absolute left-0 top-0 bottom-0 bg-white/90 carousel-progress ${
                            paused || prefersReducedMotion.current
                              ? "paused"
                              : ""
                          }`}
                          style={{
                            width: 0 as unknown as number,
                            animationPlayState: paused ? "paused" : "running",
                          }}
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
