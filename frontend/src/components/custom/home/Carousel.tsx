"use client";

import { useEffect, useRef, useState } from "react";
import carouselData from "@/data/carousel.json";

export function Carousel() {
  const [current, setCurrent] = useState(0);
  const timer = useRef<number | null>(null);

  const slides = carouselData.map((item) => ({
    title: item.category || "",
    desc: item.device ? `Device: ${item.device}` : "",
    img: item.imagePath,
    url: item.url,
  }));

  useEffect(() => {
    const next = () => setCurrent((c) => (c + 1) % slides.length);
    timer.current = window.setInterval(next, 5000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [slides.length]);

  return (
    <section className="featured-tours-section bg-base-200 relative overflow-hidden">
      <div
        className="carousel w-full aspect-[16/9] featured-carousel-container"
        onMouseEnter={() => {
          if (timer.current) window.clearInterval(timer.current);
        }}
        onMouseLeave={() => {
          timer.current = window.setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
        }}
      >
        {slides.map((s, i) => (
          <div
            key={`${s.title}-${i}`}
            className={`carousel-slide relative w-full h-full ${i === current ? "" : "hidden"}`}
            style={{
              backgroundImage: `url("${s.img}")`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
          >
            <div className="hero-overlay bg-black/30"></div>
            <div className="hero-content text-center text-white absolute inset-0 flex items-center justify-center">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{s.title}</h1>
                {s.desc ? <p className="text-lg md:text-xl mb-6">{s.desc}</p> : null}
                <a className="btn btn-primary btn-lg" href={s.url} target="_blank" rel="noreferrer">
                  <span className="iconify" data-icon="heroicons:eye" data-width="20"></span>
                  View Tour
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors carousel-indicator ${
              i === current ? "active" : ""
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
}


