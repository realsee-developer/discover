"use client";

export function JoinCTA() {
  return (
    <section className="join-community-section relative overflow-hidden bg-transparent py-24">
      <div className="absolute inset-0 -z-20">
        <img src="/bg/creator-hero.jpeg" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_50%_-100px,rgba(56,189,248,0.16),transparent_60%)]" />
        <div className="absolute inset-0 mix-blend-screen pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[oklch(0.72_0.17_210_/_.25)] blur-3xl" />
        <div className="absolute left-[15%] top-24 h-72 w-72 rounded-full bg-[oklch(0.68_0.16_260_/_.2)] blur-3xl" />
        <div className="absolute right-[12%] top-40 h-80 w-80 rounded-full bg-[oklch(0.78_0.14_180_/_.2)] blur-3xl" />
      </div>
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl rounded-3xl border border-base-300/60 bg-base-100/80 p-10 text-center shadow-xl md:p-14">
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-base-content md:text-6xl">
            Become a Realsee Creator
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base text-base-content/70 md:text-xl">
            Turn your spatial capture passion into opportunities. Publish stunning tours, collaborate with brands, and get discovered by clients worldwide.
          </p>
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-3 py-1.5 text-sm text-white ring-1 ring-white/20 backdrop-blur">
              <span aria-hidden="true">👥</span> Global Community
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-3 py-1.5 text-sm text-white ring-1 ring-white/20 backdrop-blur">
              <span aria-hidden="true">📷</span> Pro‑grade Tools
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-3 py-1.5 text-sm text-white ring-1 ring-white/20 backdrop-blur">
              <span aria-hidden="true">💰</span> Monetization
            </span>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="/contact" className="btn btn-lg px-10 text-white bg-[oklch(0.26_0.06_250)] hover:bg-[oklch(0.3_0.06_250)] hover:shadow-neon">
              <span aria-hidden="true">🚀</span> Join Creator Center
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


