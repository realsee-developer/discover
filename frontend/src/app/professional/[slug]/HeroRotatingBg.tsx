"use client";
import { useEffect, useState } from "react";

// Cross-fade between VR covers, no overlay; keeps images crisp
export function HeroRotatingBg({ images, interval = 7000 }: { images: string[]; interval?: number }) {
  const clean = (images || []).filter(Boolean);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (clean.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % clean.length), interval);
    return () => clearInterval(id);
  }, [clean.length, interval]);

  if (!clean.length) return null;

  return (
    <div className="absolute inset-0 -z-10">
      {clean.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}


