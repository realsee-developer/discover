import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStrapiURL() {
  // 1) 显式覆盖优先
  const explicit = process.env.NEXT_PUBLIC_STRAPI_URL
  if (explicit) return explicit

  // 2) 自动识别当前环境（本地 dev、Vercel preview/production）
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV
    ?? process.env.VERCEL_ENV
    ?? (process.env.NODE_ENV === "development" ? "development" : "production")

  // 3) 按环境选择对应地址
  const byEnv = appEnv === "development"
    ? process.env.NEXT_PUBLIC_STRAPI_URL_DEV
    : appEnv === "preview"
      ? process.env.NEXT_PUBLIC_STRAPI_URL_PREVIEW
      : process.env.NEXT_PUBLIC_STRAPI_URL_PROD

  return byEnv ?? "http://localhost:1337";
}

export function getStrapiMedia(url: string | null) {
  const strapiURL = getStrapiURL();
  if (url == null) return null;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  return `${strapiURL}${url}`;
}
