import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { geolocation } from "@vercel/functions";

/**
 * Vercel Edge Proxy for SEO/GEO optimization (Next.js 16+)
 *
 * Features:
 * 1. Add geo-location headers for better SEO
 * 2. Add security headers
 * 3. Add performance headers
 * 4. Add SEO-friendly headers
 *
 * @see https://nextjs.org/docs/app/getting-started/proxy
 * @see https://vercel.com/docs/functions/geolocation
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Get geo-location from Vercel Functions API
  // Note: request.geo is deprecated in Next.js 15+
  // Use @vercel/functions instead
  const geo = geolocation(request);
  const country = geo?.country || "US";
  const region = geo?.region || "";
  const city = geo?.city || "";
  const latitude = geo?.latitude || "";
  const longitude = geo?.longitude || "";

  // Add custom headers for SEO and analytics
  response.headers.set("X-Geo-Country", country);
  response.headers.set("X-Geo-Region", region);
  response.headers.set("X-Geo-City", city);

  // Security headers for SEO trust signals
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Performance headers
  response.headers.set(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400",
  );

  // SEO-friendly headers
  response.headers.set("X-Robots-Tag", "index, follow");

  // Add geo-location meta for analytics
  if (latitude && longitude) {
    response.headers.set("X-Geo-Location", `${latitude},${longitude}`);
  }

  return response;
}

// Configure which routes to run proxy on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.txt|.*\\.xml).*)",
  ],
};

