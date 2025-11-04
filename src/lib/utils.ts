import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并 class names，处理 Tailwind 冲突
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 从 es-toolkit 导入的工具函数
 */
export { debounce, delay, throttle } from "es-toolkit";

/**
 * 获取站点 URL
 */
export function getSiteURL(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercelEnv = process.env.NEXT_PUBLIC_APP_ENV ?? process.env.VERCEL_ENV;
  if (vercelEnv === "production") {
    return "https://discover.realsee.ai";
  }

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

/**
 * 获取绝对 URL
 */
export function absoluteUrl(path?: string | null): string {
  const base = getSiteURL();
  if (!path) return base;
  if (path.startsWith("http")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * 格式化价格
 */
export function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * 格式化数字（添加千分位）
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * 生成唯一 ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 复制到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy:", error);
    return false;
  }
}

/**
 * 滚动到元素
 */
export function scrollToElement(
  elementId: string,
  options?: ScrollIntoViewOptions,
): void {
  const element = document.getElementById(elementId);

  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      ...options,
    });
  }
}

/**
 * 检查是否在视口内
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
