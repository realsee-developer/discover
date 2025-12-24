"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Props = {
  images: string[];
  interval?: number;
  /** Enable enhanced cyberpunk effects */
  enhanced?: boolean;
};

export function HeroRotatingBg({
  images,
  interval = 8000,
  enhanced = true,
}: Props) {
  const clean = useMemo(() => (images || []).filter(Boolean), [images]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (clean.length <= 1) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % clean.length),
      interval
    );
    return () => clearInterval(timer);
  }, [clean.length, interval]);

  if (!clean.length) return null;

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden">
      {/* Rotating background images */}
      {clean.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="pointer-events-none select-none object-cover scale-105"
            style={{
              filter: enhanced ? "saturate(1.2) contrast(1.1)" : undefined,
            }}
          />
        </div>
      ))}

      {/* Minimal bottom gradient for text contrast - keeps image visible */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-cyber-gray-900/80 via-transparent to-transparent"
      />

      {/* Subtle scanlines for cyber feel - very light */}
      {enhanced && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 3px,
              rgba(0, 255, 255, 0.015) 3px,
              rgba(0, 255, 255, 0.015) 6px
            )`,
          }}
        />
      )}
    </div>
  );
}
