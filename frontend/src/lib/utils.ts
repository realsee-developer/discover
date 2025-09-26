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

export function absoluteUrl(path?: string | null): string {
  const base = getSiteURL();
  if (!path) return base;
  if (path.startsWith("http")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
