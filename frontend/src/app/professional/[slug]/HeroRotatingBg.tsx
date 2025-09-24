"use client";
import { useEffect, useState, useMemo } from "react";

// Enhanced cross-fade background with brand color overlay
export function HeroRotatingBg({ images, interval = 8000 }: { images: string[]; interval?: number }) {
  const clean = useMemo(() => (images || []).filter(Boolean), [images]);
  const [index, setIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState<boolean[]>([]);


  useEffect(() => {
    if (clean.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % clean.length), interval);
    return () => clearInterval(id);
  }, [clean.length, interval]);

  useEffect(() => {
    // Initialize loaded state
    setIsLoaded(new Array(clean.length).fill(false));
    
    // Preload images
    const imagePromises = clean.map((src, i) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          setIsLoaded(prev => {
            const newLoaded = [...prev];
            newLoaded[i] = true;
            return newLoaded;
          });
          resolve();
        };
        img.onerror = () => {
          // Handle error case - mark as loaded to avoid infinite loading
          setIsLoaded(prev => {
            const newLoaded = [...prev];
            newLoaded[i] = true;
            return newLoaded;
          });
          resolve();
        };
        img.src = src;
      });
    });

    return () => {
      // Cleanup: cancel any pending image loads if component unmounts
      imagePromises.forEach(promise => promise.catch(() => {}));
    };
  }, [clean]);

  if (!clean.length) return null;

  return (
    <div className="absolute inset-0 -z-20">
      {/* Background Images */}
      <div className="absolute inset-0">
        {clean.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${
              i === index ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <img
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
            {/* Individual image overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-900/10 via-brand-800/5 to-brand-600/15"></div>
          </div>
        ))}
      </div>
      
      {/* Multi-layer Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-brand-900/5 to-black/10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent"></div>
      
      {/* Animated Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-brand-300 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-brand-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 left-2/3 w-1.5 h-1.5 bg-brand-200 rounded-full animate-pulse"></div>
      </div>
      
      {/* Progress Indicators */}
      {clean.length > 1 && (
        <div className="absolute bottom-8 right-8 z-10">
          <div className="flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10">
            <div className="flex gap-2">
              {clean.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === index 
                      ? "bg-brand-400 scale-125" 
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
            <div className="w-px h-4 bg-white/20 mx-2"></div>
            <div className="text-xs text-white/80 font-medium">
              {index + 1}/{clean.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


