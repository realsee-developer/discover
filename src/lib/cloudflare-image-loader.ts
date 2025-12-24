import type { ImageLoader } from "next/image";

// CDN 基础 URL，用于访问 R2 上的静态资源
const base = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.replace(/\/$/, "") ?? "";
const baseUrl = (() => {
  try {
    return base ? new URL(base) : null;
  } catch {
    return null;
  }
})();

// 项目路径前缀，与上传脚本中的 PROJECT_PREFIX 保持一致
const PROJECT_PREFIX = process.env.NEXT_PUBLIC_ASSET_PROJECT_PREFIX;

const CDN_SEGMENT = "/cdn-cgi/image/";

// Asset manifest mapping: original path -> hashed path
let assetManifest: Record<string, string> | null = null;

/**
 * Load asset manifest file (maps original paths to hashed paths)
 * This is loaded lazily on first use
 */
function loadAssetManifest(): Record<string, string> {
  if (assetManifest !== null) {
    return assetManifest;
  }

  try {
    // Try to load the manifest file using require (works in Next.js client-side code)
    // The file may not exist during development, so we handle that gracefully
    const manifest = require("@/data/asset-manifest.json");
    assetManifest = manifest as Record<string, string>;
    return assetManifest;
  } catch (error) {
    // If manifest doesn't exist, return empty object (fallback to original paths)
    // This allows the code to work even if assets haven't been uploaded yet
    assetManifest = {};
    return assetManifest;
  }
}

/**
 * Resolve asset path using manifest mapping
 * If manifest exists and contains mapping, return hashed path; otherwise return original path
 * @param originalPath - Original asset path (e.g., "cover/image.jpg")
 * @returns Resolved path (with hash if available)
 */
function resolveAssetPath(originalPath: string): string {
  const manifest = loadAssetManifest();

  // Remove leading slash if present for consistency
  const normalizedPath = originalPath.startsWith("/")
    ? originalPath.slice(1)
    : originalPath;

  // Check if mapping exists
  if (manifest[normalizedPath]) {
    return manifest[normalizedPath];
  }

  // Fallback to original path
  return normalizedPath;
}

/**
 * 从已经包含 Cloudflare Image Resizing 转换的路径中提取原始资源路径
 */
const buildTransformPath = (pathname: string) => {
  const idx = pathname.indexOf(CDN_SEGMENT);
  if (idx === -1) {
    return pathname.replace(/^\//, "");
  }

  const rest = pathname.slice(idx + CDN_SEGMENT.length);
  const nextSlash = rest.indexOf("/");
  if (nextSlash === -1) {
    return rest;
  }

  return rest.slice(nextSlash + 1);
};

/**
 * 从图片路径中提取宽度限制（如果存在）
 * 支持格式: /path/to/image[w1200].jpg
 */
const extractWidthCap = (input: string): number | null => {
  const match = /\[w(\d+)\]/i.exec(input);
  if (!match?.[1]) {
    return null;
  }

  const parsed = Number.parseInt(match[1], 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const cloudflareImageLoader: ImageLoader = ({ src, width, quality }) => {
  // SVG files should not go through image CDN - return original path
  if (src.endsWith(".svg")) {
    return src.startsWith("/") ? src : `/${src}`;
  }

  // 如果没有配置 CDN，直接返回本地路径
  if (!base) {
    return src.startsWith("/") ? src : `/${src}`;
  }

  // 提取宽度限制并计算目标宽度
  const widthCap = extractWidthCap(src);
  const targetWidth = widthCap ? Math.min(width, widthCap) : width;
  const transforms = [
    `width=${targetWidth}`,
    `quality=${quality ?? 85}`,
    "format=auto",
  ];

  const ensureRelative = (input: string) =>
    input.startsWith("/") ? input.slice(1) : input;

  // 处理绝对 URL
  if (src.startsWith("http")) {
    try {
      const url = new URL(src);
      // 如果是同源的 CDN URL，使用 Cloudflare Image Resizing
      if (baseUrl && url.origin === baseUrl.origin) {
        const assetPath = ensureRelative(buildTransformPath(url.pathname));
        return `${base}/cdn-cgi/image/${transforms.join(",")}/${assetPath}`;
      }
      // 外部 URL 直接返回
      return src;
    } catch {
      return src;
    }
  }

  // 处理相对路径，先通过映射文件解析（可能包含 hash），然后添加项目前缀
  const normalized = ensureRelative(src);
  const resolvedPath = resolveAssetPath(normalized);
  const fullPath = PROJECT_PREFIX
    ? `${PROJECT_PREFIX}/${resolvedPath}`
    : resolvedPath;
  return `${base}/cdn-cgi/image/${transforms.join(",")}/${fullPath}`;
};

export default cloudflareImageLoader;
