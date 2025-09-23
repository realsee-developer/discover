"use client";

import { useEffect, useRef } from "react";

export function ParticlesBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const context: CanvasRenderingContext2D = ctx;

    let rafId = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    type Particle = { x: number; y: number; vx: number; vy: number };
    const particles: Particle[] = [];
    const prefersReduced = (() => {
      try {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      } catch {
        return false;
      }
    })();

    function resize() {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initParticles() {
      particles.length = 0;
      const count = Math.floor(Math.min(80, (width * height) / 30000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
        });
      }
    }

    function step() {
      context.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      }

      const maxd = 140;
      const maxd2 = maxd * maxd;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]!;
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]!;
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < maxd2) {
            const a = 1 - Math.sqrt(dist2) / maxd;
            context.beginPath();
            context.strokeStyle = `rgba(56,189,248,${0.1 * a})`;
            context.lineWidth = 1;
            context.moveTo(p.x, p.y);
            context.lineTo(q.x, q.y);
            context.stroke();
          }
        }
      }

      context.fillStyle = "rgba(147,51,234,0.25)";
      for (const p of particles) {
        context.beginPath();
        context.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        context.fill();
      }

      rafId = requestAnimationFrame(step);
    }

    function start() {
      resize();
      initParticles();
      if (!prefersReduced) step();
    }

    start();
    const onResize = () => {
      resize();
      initParticles();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-20"
      aria-hidden="true"
    />
  );
}

export default ParticlesBg;


