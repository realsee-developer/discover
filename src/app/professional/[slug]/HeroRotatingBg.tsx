"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Props = {
  images: string[];
  interval?: number;
};

export function HeroRotatingBg({ images, interval = 8000 }: Props) {
  const clean = useMemo(() => (images || []).filter(Boolean), [images]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (clean.length <= 1) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % clean.length),
      interval,
    );
    return () => clearInterval(timer);
  }, [clean.length, interval]);

  if (!clean.length) return null;

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden">
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
            className="pointer-events-none select-none object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cyber-gray-900/6"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-cyber-brand-500/6 via-transparent to-cyber-neon-cyan/6"
          />
        </div>
      ))}
    </div>
  );
}
