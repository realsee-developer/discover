import { Icon } from "@iconify/react";

import { getBadgeIcon } from "@/lib/badge-utils";

type CategoryBadgeSize = "sm" | "md" | "lg";

const baseClass =
  "inline-flex items-center gap-2 rounded-full border border-cyber-gray-600/60 bg-cyber-gray-800/90 text-cyber-gray-100 font-medium tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-gray-900";

const sizeClass: Record<CategoryBadgeSize, string> = {
  sm: "text-xs px-3 py-1",
  md: "text-sm px-3.5 py-1.5",
  lg: "text-base px-4 py-2",
};

const accentClass: Record<string, string> = {
  residential:
    "border-cyber-brand-400/80 bg-cyber-brand-500/25 text-cyber-brand-50",
  office:
    "border-cyber-neon-cyan/70 bg-cyber-neon-cyan/20 text-cyber-neon-cyan",
  retail: "border-cyber-brand-400/80 bg-cyber-brand-500/22 text-cyber-brand-50",
  industrial: "border-cyber-gray-500 bg-cyber-gray-900/85 text-cyber-gray-100",
  exhibition:
    "border-cyber-brand-400/70 bg-cyber-brand-500/18 text-cyber-brand-100",
};

function cx(...values: Array<string | null | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

function normalizeCategory(category: string) {
  return (category || "").toLowerCase();
}

function getAccentClass(category: string) {
  const normalized = normalizeCategory(category);
  if (normalized.includes("residential") || normalized.includes("home")) {
    return accentClass.residential;
  }
  if (normalized.includes("office")) {
    return accentClass.office;
  }
  if (normalized.includes("retail") || normalized.includes("store")) {
    return accentClass.retail;
  }
  if (
    normalized.includes("industrial") ||
    normalized.includes("factory") ||
    normalized.includes("warehouse")
  ) {
    return accentClass.industrial;
  }
  if (
    normalized.includes("exhibition") ||
    normalized.includes("museum") ||
    normalized.includes("gallery")
  ) {
    return accentClass.exhibition;
  }

  return "border-cyber-brand-400/70 bg-cyber-brand-500/18 text-cyber-brand-100";
}

export function CategoryBadge({
  category,
  size = "sm",
  showIcon = true,
}: {
  category: string | null | undefined;
  size?: CategoryBadgeSize;
  showIcon?: boolean;
}) {
  if (!category) return null;

  const iconSize = size === "lg" ? 18 : size === "md" ? 16 : 14;

  return (
    <span
      className={cx(
        baseClass,
        sizeClass[size],
        getAccentClass(category),
        "shadow-cyber-brand-500/10 shadow-sm hover:-translate-y-0.5 hover:shadow-cyber-brand-500/20",
      )}
    >
      {showIcon ? (
        <Icon
          icon={getBadgeIcon(category)}
          width={iconSize}
          className="opacity-90"
        />
      ) : null}
      <span className="truncate max-w-[10rem]">{category}</span>
    </span>
  );
}
