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
      <div className="absolute inset-0 bg-[radial-gradient(900px_400px_at_50%_-120px,rgba(56,189,248,0.18),transparent_60%)]" />
      <div className="absolute inset-0 mix-blend-screen pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>
  );
}


