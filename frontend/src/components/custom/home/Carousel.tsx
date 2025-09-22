"use client";

import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { getCarousels, getVrById, resolvePublicAssetPath } from "@/data/db";

export function Carousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);
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
    try {
      const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      prefersReducedMotion.current = mql.matches;
    } catch {}

    const start = () => {
      if (timer.current) window.clearInterval(timer.current);
      if (!prefersReducedMotion.current && slides.length > 1) {
        timer.current = window.setInterval(() => {
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
      if (timer.current) window.clearInterval(timer.current);
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

  const getCategoryIcon = (category: string): string => {
    const c = (category || "").toLowerCase();
    if (c.includes("residential") || c.includes("house") || c.includes("home")) return "heroicons:home";
    if (c.includes("industrial") || c.includes("factory")) return "heroicons:building-office-2";
    if (c.includes("exhibition")) return "heroicons:photo";
    if (c.includes("showroom")) return "heroicons:sparkles";
    if (c.includes("museum")) return "heroicons:building-library";
    if (c.includes("office")) return "heroicons:building-office";
    if (c.includes("restaurant")) return "heroicons:building-storefront";
    if (c.includes("studio")) return "heroicons:video-camera";
    if (c.includes("church")) return "mdi:church";
    if (c.includes("gym")) return "mdi:dumbbell";
    if (c.includes("aerial")) return "heroicons:paper-airplane";
    if (c.includes("outdoor") || c.includes("outside")) return "heroicons:globe-alt";
    return "heroicons:tag";
  };

  const getDeviceIcon = (device: string): string => {
    const d = (device || "").toLowerCase();
    if (d.includes("galois") || d.includes("伽罗华")) return "mdi:laser-pointer"; // 激光扫描仪
    if (d.includes("pano to 3d") || d.includes("panorama") || d.includes("全景")) return "mdi:panorama-variant"; // 全景转VR
    return "heroicons:camera";
  };

  return (
    <section className="hero min-h-[100svh] w-screen bg-base-200/0 p-0">
      <div className="hero-content p-0 w-full max-w-none">
        <div
          className="relative w-full overflow-hidden rounded-none shadow-none focus:outline-none"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
          }}
          onMouseEnter={() => {
            if (timer.current) window.clearInterval(timer.current);
            setPaused(true);
          }}
          onMouseLeave={() => {
            if (!prefersReducedMotion.current && slides.length > 1) {
              timer.current = window.setInterval(() => setCurrent((c) => (c + 1) % slides.length), DURATION_MS);
              setPaused(false);
            }
          }}
          onTouchStart={(e) => {
            const t = e.touches[0];
            touchStart.current = { x: t.clientX, y: t.clientY };
            if (timer.current) window.clearInterval(timer.current);
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
              timer.current = window.setInterval(() => setCurrent((c) => (c + 1) % slides.length), DURATION_MS);
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
                  className={`absolute inset-0 ${isVisible ? "block" : "hidden"} transition-opacity duration-700 ease-out ${
                    i === current ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                aria-hidden={i !== current}
                aria-label={s.title}
                role="group"
                >
                <div
                  className={`absolute inset-0 bg-center bg-cover pointer-events-none ${!prefersReducedMotion.current ? "kenburns-soft" : ""}`}
                  style={{ backgroundImage: `url("${s.img}")` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base-content/70 via-base-content/20 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-base-content/40 via-base-content/10 to-transparent pointer-events-none" />
                {/* Immersive centered hero content with title and badges */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="px-4 md:px-10 w-full">
                    <div className="text-base-100 text-center mb-8 md:mb-16">
                      <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight drop-shadow-xl">{s.title}</h1>
                      <div className="mt-3 md:mt-4 flex items-center justify-center gap-2">
                        {s.category ? (
                          <span className="badge badge-lg bg-primary/95 text-primary-content border-0 shadow-md shadow-primary/30 gap-1">
                            <Icon icon={getCategoryIcon(s.category)} width={16} /> {s.category}
                          </span>
                        ) : null}
                        {s.device ? (
                          <span className="badge badge-lg badge-outline border-white/70 text-base-100/95 gap-1 bg-black/10">
                            <Icon icon={getDeviceIcon(s.device)} width={16} /> {s.device}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-5 md:mt-7 pointer-events-auto inline-flex">
                        <a
                          className="btn btn-outline btn-lg rounded-full text-base-100 border-white/80 hover:border-white hover:bg-white/15 active:scale-[0.98] transition-transform backdrop-blur-sm gap-2 btn-wide"
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="立即进入 3D Tour"
                        >
                          <Icon icon="heroicons:play" width={20} />
                          立即进入
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              );
            })}
          </div>

          {/* Controls */}
          {slides.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="上一个"
                onClick={prev}
                className="btn btn-circle btn-sm md:btn-md btn-ghost absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-base-100 bg-base-100/10 hover:bg-base-100/20 border-white/20"
              >
                <span className="iconify" data-icon="heroicons:chevron-left-20-solid" data-width="20"></span>
              </button>
              <button
                type="button"
                aria-label="下一个"
                onClick={next}
                className="btn btn-circle btn-sm md:btn-md btn-ghost absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-base-100 bg-base-100/10 hover:bg-base-100/20 border-white/20"
              >
                <span className="iconify" data-icon="heroicons:chevron-right-20-solid" data-width="20"></span>
              </button>
            </>
          ) : null}

          {/* Scroll hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-3 text-base-100/90 z-20 pointer-events-none">
            <div className="scroll-mouse"></div>
          </div>

          {/* Indicators: simple stable dots to avoid flicker */}
          {slides.length > 1 ? (
            <div className="absolute bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 z-20">
              <div className="px-2 py-1 rounded-full bg-white/10 backdrop-blur-md flex items-center gap-1.5 md:gap-2">
                {slides.map((_, i) => {
                  const isActive = i === current;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`跳转到第 ${i + 1} 张`}
                      className={`relative overflow-hidden rounded-full h-1.5 md:h-2 transition-all duration-300 ${
                        isActive ? "w-8 md:w-14 bg-white/30" : "w-2.5 md:w-3.5 bg-white/60 hover:bg-white/80"
                      }`}
                      style={{ ["--carousel-duration" as any]: `${DURATION_MS}ms` }}
                      aria-current={isActive}
                    >
                      {isActive ? (
                        <span
                          key={`progress-${current}`}
                          className={`absolute left-0 top-0 bottom-0 bg-white carousel-progress ${paused || prefersReducedMotion.current ? "paused" : ""}`}
                          style={{ width: 0 as unknown as number, animationPlayState: paused ? "paused" : "running" }}
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


