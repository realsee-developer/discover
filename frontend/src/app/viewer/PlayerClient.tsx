"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function PlayerClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);

  const applyZoom = useCallback((next: number) => {
    const clamped = Math.max(50, Math.min(200, next));
    setZoom(clamped);
    if (containerRef.current) {
      containerRef.current.style.transform = `scale(${clamped / 100})`;
      containerRef.current.style.transformOrigin = "center center";
    }
  }, []);

  const enterFullscreen = () => {
    const el = containerRef.current?.parentElement;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
  };

  useEffect(() => {
    applyZoom(100);
  }, [applyZoom]);

  return (
    <div className="relative w-full aspect-video bg-base-300 rounded-box overflow-hidden">
      <div ref={containerRef} className="absolute inset-0">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1600210492493-0946911123ea?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1280&h=720"
          alt="3D Viewer"
        />
      </div>
      <div className="absolute bottom-3 right-3 join">
        <button className="btn btn-sm join-item" onClick={() => applyZoom(zoom - 10)}>
          <span className="iconify" data-icon="heroicons:minus" data-width="16"></span>
        </button>
        <button className="btn btn-sm join-item">{zoom}%</button>
        <button className="btn btn-sm join-item" onClick={() => applyZoom(zoom + 10)}>
          <span className="iconify" data-icon="heroicons:plus" data-width="16"></span>
        </button>
        <button className="btn btn-sm join-item" onClick={enterFullscreen}>
          <span className="iconify" data-icon="heroicons:arrows-pointing-out" data-width="16"></span>
        </button>
      </div>
    </div>
  );
}


