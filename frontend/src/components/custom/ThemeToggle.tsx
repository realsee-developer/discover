"use client";

import { useEffect, useState } from "react";

const THEMES = ["business", "light"] as const;

export function ThemeToggle() {
  const [theme, setTheme] = useState<(typeof THEMES)[number]>("business");

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as (typeof THEMES)[number]) || "business";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggle = () => {
    const next = theme === "business" ? "light" : "business";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <button className="btn btn-ghost btn-xs" onClick={toggle}>
      <span className="iconify" data-icon="heroicons:moon" data-width="16"></span>
      <span>Theme</span>
    </button>
  );
}


