"use client";

import { lazy, Suspense } from "react";

const LazyParticles = lazy(() =>
  import("@/components/custom/ParticlesBg").then((m) => ({ default: m.default })),
);

export function ClientParticlesMount() {
  return (
    <Suspense fallback={null}>
      <LazyParticles />
    </Suspense>
  );
}

export default ClientParticlesMount;


