"use client";
import { Icon } from "@iconify/react";

export function JoinCTA() {
  return (
    <section className="join-community-section relative overflow-hidden bg-gradient-to-b from-primary/15 via-accent/10 to-base-100 py-24">
      <div className="absolute inset-0 -z-20">
        <img src="/bg/creator-hero.jpeg" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-base-100/70 via-base-100/50 to-base-100" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute left-[15%] top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute right-[12%] top-40 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
      </div>
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl rounded-3xl border border-base-300/40 bg-base-100/90 p-10 text-center shadow-xl backdrop-blur md:p-14">
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-base-content md:text-6xl">
            Become a Realsee Creator
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base text-base-content/70 md:text-xl">
            Turn your spatial capture passion into opportunities. Publish stunning tours, collaborate with brands, and get discovered by clients worldwide.
          </p>
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary ring-1 ring-primary/20">
              <Icon icon="heroicons:users" width={16} /> Global Community
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1.5 text-sm text-accent ring-1 ring-accent/20">
              <Icon icon="heroicons:camera" width={16} /> Pro‑grade Tools
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1.5 text-sm text-secondary ring-1 ring-secondary/20">
              <Icon icon="heroicons:currency-dollar" width={16} /> Monetization
            </span>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="/contact" className="btn btn-primary btn-lg px-10 shadow-lg shadow-primary/20">
              <Icon icon="heroicons:rocket-launch" width={20} /> Join Creator Center
            </a>
          </div>
        </div>
      </div>
      {/* Scoped visual effects for animated gradient chips */}
      <style jsx>{`
        .gradient-animate { background-size: 200% 200%; animation: gradientShift 6s ease infinite; }
        @keyframes gradientShift { 0% {background-position: 0% 50%} 50% {background-position: 100% 50%} 100% {background-position: 0% 50%} }
        .chip-shine { position: relative; overflow: hidden; }
        .chip-shine::after { content: ""; position: absolute; inset: -1px; background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 65%, transparent 100%); transform: translateX(-150%); transition: transform 0.8s ease; pointer-events: none; }
        .chip-shine:hover::after, .chip-shine:focus-visible::after { transform: translateX(150%); }
        @media (prefers-reduced-motion: reduce) { .gradient-animate { animation: none } .chip-shine::after { display: none } }
      `}</style>
    </section>
  );
}


