"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

type KudosButtonProps = {
  slug: string;
  name: string;
};

const STORAGE_PREFIX = "discover:kudos:v1:";

export function KudosButton({ slug, name }: KudosButtonProps) {
  const storageKey = `${STORAGE_PREFIX}${slug}`;

  const [liked, setLiked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [bursting, setBursting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(storageKey);
      setLiked(stored === "liked");
    } catch (error) {
      console.warn("Failed to read kudos state", error);
      setLiked(false);
    } finally {
      setMounted(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    try {
      if (liked) {
        window.localStorage.setItem(storageKey, "liked");
      } else {
        window.localStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.warn("Failed to persist kudos state", error);
    }
  }, [mounted, liked, storageKey]);

  const handleToggle = () => {
    setLiked((previous) => {
      const nextLiked = !previous;
      if (nextLiked) {
        setBursting(true);
        window.setTimeout(() => {
          setBursting(false);
        }, 550);
      }
      return nextLiked;
    });
  };

  if (!mounted) {
    return (
      <div className="inline-flex h-[46px] min-w-[180px] animate-pulse items-center justify-center rounded-full border border-cyber-brand-300/30 bg-cyber-gray-900/40 px-6 text-sm font-medium uppercase tracking-[0.3em] text-cyber-gray-500">
        Loading cheers…
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={liked}
      aria-label={`Send kudos to ${name}`}
      className={`group relative inline-flex items-center gap-3 rounded-full border px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] transition-all duration-300 focus-visible:border-cyber-neon-cyan/70 focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[0_0_22px_rgba(0,255,255,0.35)] focus-visible:shadow-cyber-neon-cyan/50 focus-visible:-translate-y-0.5 ${
        liked
          ? "border-cyber-brand-500 bg-cyber-gray-900/80 text-cyber-neon-cyan shadow-[0_0_24px_rgba(0,255,255,0.35)]"
          : "border-cyber-brand-300/40 bg-cyber-gray-900/60 text-cyber-gray-100 hover:border-cyber-brand-400/60 hover:text-cyber-neon-cyan hover:shadow-[0_0_24px_rgba(0,255,255,0.2)]"
      }`}
    >
      {bursting ? (
        <>
          <span className="pointer-events-none absolute inset-0 -m-1 rounded-full border border-cyber-neon-cyan/40 opacity-75 animate-ping" />
          <span className="pointer-events-none absolute inset-0 -m-0.5 rounded-full border border-cyber-neon-magenta/35 opacity-70 animate-ping [animation-delay:120ms]" />
        </>
      ) : null}
      <span className="relative z-10 flex items-center gap-3">
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyber-brand-500/40 via-cyber-neon-cyan/35 to-cyber-neon-magenta/35 text-cyber-gray-100 shadow-[0_0_16px_rgba(0,255,255,0.25)] transition-transform duration-300 group-hover:scale-[1.08]">
          <Icon
            icon={liked ? "heroicons:heart-solid" : "heroicons:heart"}
            width={20}
            className={liked ? "text-cyber-neon-cyan" : "text-cyber-gray-100"}
          />
        </span>
        <span className="flex flex-col text-left leading-tight">
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.5em] text-cyber-gray-400">
            {liked ? "Thanks" : "Send"}
          </span>
          <span
            className="text-base font-semibold text-cyber-gray-100"
            aria-live="polite"
          >
            {liked ? "Cheered" : "Kudos"}
          </span>
        </span>
      </span>
    </button>
  );
}
