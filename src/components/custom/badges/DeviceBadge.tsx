import { DeviceIcon } from "@/lib/badge-utils";

type DeviceBadgeSize = "sm" | "md" | "lg";

const baseClass =
  "inline-flex items-center gap-2 rounded-full border border-cyber-gray-600/70 bg-cyber-gray-900/80 px-3 py-1 text-cyber-gray-100 font-medium tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-gray-900";

const sizeClass: Record<DeviceBadgeSize, string> = {
  sm: "text-xs px-3 py-1",
  md: "text-sm px-3.5 py-1.5",
  lg: "text-base px-4 py-2",
};

export function DeviceBadge({
  device,
  size = "sm",
}: {
  device: string | null | undefined;
  size?: DeviceBadgeSize;
}) {
  if (!device) return null;

  const iconSize = size === "lg" ? 18 : size === "md" ? 16 : 14;

  return (
    <span
      className={`${baseClass} ${sizeClass[size]} shadow-lg shadow-black/20 hover:-translate-y-0.5 hover:border-cyber-brand-400/70 hover:text-cyber-brand-200`}
    >
      <DeviceIcon device={device} width={iconSize} className="opacity-90" />
      <span className="truncate max-w-[10rem]">{device}</span>
    </span>
  );
}
