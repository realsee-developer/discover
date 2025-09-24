/**
 * Badge utility functions for consistent badge styling across components
 */

import React from "react";
import { Icon } from "@iconify/react";
import { GaloisIcon } from "@/components/custom/GaloisIcon";
import { PanoTo3DIcon } from "@/components/custom/PanoTo3DIcon";

export function getCategoryBadgeClass(category: string): string {
  const normalizedCategory = (category || "").toLowerCase();
  
  // Semantic category colors
  if (normalizedCategory.includes("residential") || normalizedCategory.includes("house") || normalizedCategory.includes("home")) {
    return "badge-category-residential";
  }
  if (normalizedCategory.includes("office") || normalizedCategory.includes("workplace")) {
    return "badge-category-office";
  }
  if (normalizedCategory.includes("retail") || normalizedCategory.includes("store") || normalizedCategory.includes("shop")) {
    return "badge-category-retail";
  }
  if (normalizedCategory.includes("industrial") || normalizedCategory.includes("factory") || normalizedCategory.includes("warehouse")) {
    return "badge-category-industrial";
  }
  if (normalizedCategory.includes("exhibition") || normalizedCategory.includes("museum") || normalizedCategory.includes("gallery")) {
    return "badge-category-exhibition";
  }
  
  // Default to primary badge for other categories
  return "badge-primary";
}

export function getDeviceBadgeClass(device: string): string {
  // All devices use the same dark glass style for consistency
  return "badge-device";
}

export function getBadgeIcon(category: string): string {
  const c = (category || "").toLowerCase();
  if (c.includes("residential") || c.includes("house") || c.includes("home")) return "heroicons:home";
  if (c.includes("industrial") || c.includes("factory")) return "heroicons:building-office-2";
  if (c.includes("exhibition")) return "heroicons:photo";
  if (c.includes("showroom")) return "heroicons:sparkles";
  if (c.includes("museum")) return "heroicons:building-library";
  if (c.includes("office")) return "heroicons:building-office";
  if (c.includes("restaurant")) return "heroicons:building-storefront";
  if (c.includes("studio")) return "heroicons:video-camera";
  if (c.includes("church")) return "mdi:church";
  if (c.includes("gym")) return "mdi:dumbbell";
  if (c.includes("aerial")) return "heroicons:paper-airplane";
  if (c.includes("outdoor") || c.includes("outside")) return "heroicons:globe-alt";
  return "heroicons:tag";
}

export function getDeviceIcon(device: string): string {
  const d = (device || "").toLowerCase();
  if (d.includes("galois") || d.includes("伽罗华")) return "mdi:laser-pointer";
  if (d.includes("pano to 3d") || d.includes("panorama") || d.includes("全景")) return "mdi:panorama-variant";
  return "heroicons:camera";
}

/**
 * Device icon component that handles custom icons like Galois and Pano to 3D
 */
export function DeviceIcon({ device, width = 16, className = "" }: { device: string; width?: number; className?: string }) {
  const d = (device || "").toLowerCase();
  
  if (d.includes("galois") || d.includes("伽罗华")) {
    return <GaloisIcon width={width} className={className} />;
  }
  
  if (d.includes("pano to 3d") || d.includes("panorama") || d.includes("全景")) {
    return <PanoTo3DIcon width={width} className={className} />;
  }
  
  return <Icon icon={getDeviceIcon(device)} width={width} className={className} />;
}
