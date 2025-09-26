import type { ImageLoader } from "next/image";

const base = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.replace(/\/$/, "") ?? "";
const baseUrl = (() => {
  try {
    return base ? new URL(base) : null;
  } catch {
    return null;
  }
})();

const CDN_SEGMENT = "/cdn-cgi/image/";

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

const extractWidthCap = (input: string): number | null => {
  const idx = input.indexOf(CDN_SEGMENT);
  if (idx === -1) return null;
  const rest = input.slice(idx + CDN_SEGMENT.length);
  const nextSlash = rest.indexOf("/");
  const segment = nextSlash === -1 ? rest : rest.slice(0, nextSlash);
  const match = segment.match(/width=(\d+)/);
  if (!match) return null;
  const parsed = Number.parseInt(match[1], 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const cloudflareImageLoader: ImageLoader = ({ src, width, quality }) => {
  if (!base) {
    return src.startsWith("/") ? src : `/${src}`;
  }

  const widthCap = extractWidthCap(src);
  const targetWidth = widthCap ? Math.min(width, widthCap) : width;
  const transforms = [`width=${targetWidth}`, `quality=${quality ?? 85}`, "format=auto"];

  const ensureRelative = (input: string) =>
    input.startsWith("/") ? input.slice(1) : input;

  if (src.startsWith("http")) {
    try {
      const url = new URL(src);
      if (baseUrl && url.origin === baseUrl.origin) {
        const assetPath = ensureRelative(buildTransformPath(url.pathname));
        return `${base}/cdn-cgi/image/${transforms.join(",")}/${assetPath}`;
      }
      return src;
    } catch {
      return src;
    }
  }

  const normalized = ensureRelative(src);
  return `${base}/cdn-cgi/image/${transforms.join(",")}/${normalized}`;
};

export default cloudflareImageLoader;

